import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createTicket } from "../services/ticketService.js";
import { errorResponse, noContentResponse, successResponse } from "../utils/lambdaResponse.js";
import { validateCreateTicketInput } from "../utils/validation.js";

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (event.httpMethod === "OPTIONS") {
    return noContentResponse();
  }

  console.log("create_ticket_request_started", { requestId: event.requestContext.requestId });

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

    const ticket = await createTicket(input);

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
