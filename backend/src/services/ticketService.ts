import { randomUUID } from "node:crypto";
import { analyzeTicket } from "./aiService.js";
import { getTicketById, listTickets, saveTicket } from "./databaseService.js";
import type { CreateTicketInput, Ticket } from "../types/ticket.js";

export async function createTicket(input: CreateTicketInput): Promise<Ticket> {
  const now = new Date().toISOString();
  const analysis = await analyzeTicket(input);

  const ticket: Ticket = {
    id: `ticket_${randomUUID()}`,
    title: input.title,
    description: input.description,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    status: "open",
    createdAt: now,
    updatedAt: now,
    analysis
  };

  return saveTicket(ticket);
}

export async function findTicket(id: string): Promise<Ticket | undefined> {
  return getTicketById(id);
}

export async function findAllTickets(): Promise<Ticket[]> {
  return listTickets();
}
