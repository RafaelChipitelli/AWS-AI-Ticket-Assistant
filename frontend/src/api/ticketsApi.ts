import axios, { AxiosError } from "axios";
import type { CreateTicketPayload, Ticket } from "../types/ticket";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

const ticketsClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

export function setAuthToken(token: string | null) {
  if (token) {
    ticketsClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete ticketsClient.defaults.headers.common["Authorization"];
  }
}

function toApiError(error: unknown): Error {
  if (error instanceof AxiosError) {
    const message = (error.response?.data as { error?: string } | undefined)?.error;
    return new Error(message ?? "API request failed.");
  }

  return error instanceof Error ? error : new Error("API request failed.");
}

export async function createTicket(payload: CreateTicketPayload): Promise<Ticket> {
  try {
    const response = await ticketsClient.post<Ticket>("/tickets", payload);
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function listTickets(): Promise<Ticket[]> {
  try {
    const response = await ticketsClient.get<Ticket[]>("/tickets");
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function getTicket(id: string): Promise<Ticket> {
  try {
    const response = await ticketsClient.get<Ticket>(`/tickets/${id}`);
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}
