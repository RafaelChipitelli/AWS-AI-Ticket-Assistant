import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createTicket } from "../services/ticketService.js";
import { errorResponse, noContentResponse, successResponse } from "../utils/lambdaResponse.js";
import { checkRateLimit } from "../utils/rateLimiter.js";
import { hashIp, redactPii } from "../utils/redact.js";
import { extractSourceIp, extractUserId } from "../utils/requestContext.js";
import { validateCreateTicketInput } from "../utils/validation.js";

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (event.httpMethod === "OPTIONS") {
    return noContentResponse();
  }

  const userId = extractUserId(event);
  if (!userId) {
    return errorResponse("Unauthorized.", 401);
  }

  const sourceIp = extractSourceIp(event);
  const rate = await checkRateLimit(`ip#${sourceIp}`);
  if (!rate.allowed) {
    console.warn("rate_limit_exceeded", { ipHash: hashIp(sourceIp), count: rate.count, limit: rate.limit });
    return errorResponse("Too many requests.", 429, {
      "Retry-After": String(rate.retryAfterSeconds)
    });
  }

  console.log("create_ticket_request_started", { requestId: event.requestContext.requestId, userId });

  try {
    if (!event.body) {
      return errorResponse("Request body is required.", 400);
    }

    let parsedBody: unknown;

    try {
      parsedBody = JSON.parse(event.body);
    } catch {
      return errorResponse("Invalid JSON request body.", 400);
    }

    const input = validateCreateTicketInput(parsedBody);
    console.log("ai_analysis_started", { titleLength: input.title.length });

    const ticket = await createTicket(input, userId);

    console.log("ticket_created", {
      ticketId: ticket.id,
      priority: ticket.analysis?.priority
    });

    return successResponse(ticket, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create ticket.";
    console.error("create_ticket_failed", { message: redactPii(message) });
    return errorResponse(message, 400);
  }
}
