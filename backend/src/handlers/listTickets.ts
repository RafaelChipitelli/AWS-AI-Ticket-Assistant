import type { Request, Response } from "express";
import { findAllTickets } from "../services/ticketService.js";
import { sendSuccess } from "../utils/response.js";

export async function listTicketsHandler(_req: Request, res: Response): Promise<Response> {
  const tickets = await findAllTickets();
  return sendSuccess(res, tickets);
}
