import type { Request, Response } from "express";
import { createTicket } from "../services/ticketService.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { validateCreateTicketInput } from "../utils/validation.js";

export async function createTicketHandler(req: Request, res: Response): Promise<Response> {
  try {
    const input = validateCreateTicketInput(req.body);
    const ticket = await createTicket(input, "local-dev-user");
    return sendSuccess(res, ticket, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create ticket.";
    return sendError(res, message, 400);
  }
}
