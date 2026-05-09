import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { findTicket } from "../services/ticketService.js";
import { errorResponse, noContentResponse, successResponse } from "../utils/lambdaResponse.js";
import { checkRateLimit } from "../utils/rateLimiter.js";
import { hashIp, redactPii } from "../utils/redact.js";
import { extractSourceIp, extractUserId } from "../utils/requestContext.js";

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

  const ticketId = event.pathParameters?.id;
  console.log("get_ticket_request_started", {
    requestId: event.requestContext.requestId,
    ticketId,
    userId
  });

  if (!ticketId) {
    return errorResponse("Ticket ID is required.", 400);
  }

  try {
    const ticket = await findTicket(ticketId, userId);

    if (!ticket) {
      return errorResponse("Ticket not found.", 404);
    }

    return successResponse(ticket);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to get ticket.";
    console.error("get_ticket_failed", { ticketId, message: redactPii(message) });
    return errorResponse("Internal server error.", 500);
  }
}
