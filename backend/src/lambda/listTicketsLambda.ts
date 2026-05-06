import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { findAllTickets } from "../services/ticketService.js";
import { errorResponse, noContentResponse, successResponse } from "../utils/lambdaResponse.js";

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (event.httpMethod === "OPTIONS") {
    return noContentResponse();
  }

  console.log("list_tickets_request_started", { requestId: event.requestContext.requestId });

  try {
    const tickets = await findAllTickets();
    console.log("list_tickets_completed", { count: tickets.length });
    return successResponse(tickets);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to list tickets.";
    console.error("list_tickets_failed", { message });
    return errorResponse("Internal server error.", 500);
  }
}
