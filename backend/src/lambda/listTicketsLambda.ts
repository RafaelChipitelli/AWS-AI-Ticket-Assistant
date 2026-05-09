import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { findAllTickets } from "../services/ticketService.js";
import { errorResponse, noContentResponse, successResponse } from "../utils/lambdaResponse.js";

function extractUserId(event: APIGatewayProxyEvent): string | undefined {
  const ctx = event.requestContext as unknown as { authorizer?: { jwt?: { claims?: { sub?: string } } } };
  return ctx.authorizer?.jwt?.claims?.sub;
}

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (event.httpMethod === "OPTIONS") {
    return noContentResponse();
  }

  const userId = extractUserId(event);
  if (!userId) {
    return errorResponse("Unauthorized.", 401);
  }

  console.log("list_tickets_request_started", { requestId: event.requestContext.requestId, userId });

  try {
    const tickets = await findAllTickets(userId);
    console.log("list_tickets_completed", { count: tickets.length });
    return successResponse(tickets);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to list tickets.";
    console.error("list_tickets_failed", { message });
    return errorResponse("Internal server error.", 500);
  }
}
