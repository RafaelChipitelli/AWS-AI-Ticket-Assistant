import type { CreateTicketInput } from "../types/ticket.js";

export function validateCreateTicketInput(body: unknown): CreateTicketInput {
  if (!body || typeof body !== "object") {
    throw new Error("Request body is required.");
  }

  const input = body as Partial<CreateTicketInput>;

  if (!input.title || typeof input.title !== "string" || input.title.trim().length < 3) {
    throw new Error("Title is required and must be at least 3 characters.");
  }

  if (
    !input.description ||
    typeof input.description !== "string" ||
    input.description.trim().length < 10
  ) {
    throw new Error("Description is required and must be at least 10 characters.");
  }

  if (input.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.customerEmail)) {
    throw new Error("Customer email must be a valid email address.");
  }

  return {
    title: input.title.trim(),
    description: input.description.trim(),
    customerName: input.customerName?.trim() || undefined,
    customerEmail: input.customerEmail?.trim() || undefined
  };
}
