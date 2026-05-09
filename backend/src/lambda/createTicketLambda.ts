import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createTicket } from "../services/ticketService.js";
import { errorResponse, noContentResponse, successResponse } from "../utils/lambdaResponse.js";
import { validateCreateTicketInput } from "../utils/validation.js";

function extractUserId(event: APIGatewayProxyEvent): string | undefined {
  // HTTP API v2 payload format with JWT authorizer
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
    console.log("ai_analysis_started", { title: input.title });

    const ticket = await createTicket(input, userId);

    console.log("ticket_created", {
      ticketId: ticket.id,
      priority: ticket.analysis?.priority
    });

    return successResponse(ticket, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create ticket.";
    console.error("create_ticket_failed", { message });
    return errorResponse(message, 400);
  }
}
