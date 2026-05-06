import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { findTicket } from "../services/ticketService.js";
import { errorResponse, noContentResponse, successResponse } from "../utils/lambdaResponse.js";

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (event.httpMethod === "OPTIONS") {
    return noContentResponse();
  }

  const ticketId = event.pathParameters?.id;
  console.log("get_ticket_request_started", {
    requestId: event.requestContext.requestId,
    ticketId
  });

  if (!ticketId) {
    return errorResponse("Ticket ID is required.", 400);
  }

  try {
    const ticket = await findTicket(ticketId);

    if (!ticket) {
      return errorResponse("Ticket not found.", 404);
    }

    return successResponse(ticket);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to get ticket.";
    console.error("get_ticket_failed", { ticketId, message });
    return errorResponse("Internal server error.", 500);
  }
}
