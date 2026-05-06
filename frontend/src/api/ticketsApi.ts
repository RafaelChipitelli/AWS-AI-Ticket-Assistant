import type { CreateTicketPayload, Ticket } from "../types/ticket";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers
    },
    ...options
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(errorBody?.error ?? "API request failed.");
  }

  return response.json() as Promise<T>;
}

export function createTicket(payload: CreateTicketPayload): Promise<Ticket> {
  return request<Ticket>("/tickets", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function listTickets(): Promise<Ticket[]> {
  return request<Ticket[]>("/tickets");
}

export function getTicket(id: string): Promise<Ticket> {
  return request<Ticket>(`/tickets/${id}`);
}
