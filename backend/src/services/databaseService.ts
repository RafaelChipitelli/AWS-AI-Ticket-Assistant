import type { Ticket } from "../types/ticket.js";

const tickets = new Map<string, Ticket>();

export async function saveTicket(ticket: Ticket): Promise<Ticket> {
  tickets.set(ticket.id, ticket);
  return ticket;
}

export async function getTicketById(id: string): Promise<Ticket | undefined> {
  return tickets.get(id);
}

export async function listTickets(): Promise<Ticket[]> {
  return Array.from(tickets.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
