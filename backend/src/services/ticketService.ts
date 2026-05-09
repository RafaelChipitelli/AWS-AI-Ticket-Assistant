import { randomUUID } from "node:crypto";
import { analyzeTicket } from "./aiService.js";
import { getTicketById, listTicketsByUser, saveTicket } from "./databaseService.js";
import type { CreateTicketInput, Ticket } from "../types/ticket.js";

export async function createTicket(input: CreateTicketInput, userId: string): Promise<Ticket> {
  const now = new Date().toISOString();
  const analysis = await analyzeTicket(input);

  const ticket: Ticket = {
    id: `ticket_${randomUUID()}`,
    userId,
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

export async function findTicket(id: string, userId: string): Promise<Ticket | undefined> {
  const ticket = await getTicketById(id);
  if (!ticket || ticket.userId !== userId) return undefined;
  return ticket;
}

export async function findAllTickets(userId: string): Promise<Ticket[]> {
  return listTicketsByUser(userId);
}
