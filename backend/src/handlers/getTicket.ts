import type { Request, Response } from "express";
import { findTicket } from "../services/ticketService.js";
import { sendError, sendSuccess } from "../utils/response.js";

export async function getTicketHandler(req: Request, res: Response): Promise<Response> {
  const ticketId = req.params.id;

  if (!ticketId || Array.isArray(ticketId)) {
    return sendError(res, "Ticket ID is required.", 400);
  }

  const ticket = await findTicket(ticketId, "local-dev-user");

  if (!ticket) {
    return sendError(res, "Ticket not found.", 404);
  }

  return sendSuccess(res, ticket);
}
