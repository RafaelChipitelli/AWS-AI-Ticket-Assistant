import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { findAllTickets } from "../services/ticketService.js";
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

  console.log("list_tickets_request_started", { requestId: event.requestContext.requestId, userId });

  try {
    const tickets = await findAllTickets(userId);
    console.log("list_tickets_completed", { count: tickets.length });
    return successResponse(tickets);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to list tickets.";
    console.error("list_tickets_failed", { message: redactPii(message) });
    return errorResponse("Internal server error.", 500);
  }
}
