import { z } from "zod";
import type { CreateTicketInput } from "../types/ticket.js";

const trimmedString = (min: number, max: number, label: string) =>
  z
    .string()
    .transform((value) => value.normalize("NFC").trim())
    .refine((value) => value.length >= min, `${label} must be at least ${min} characters.`)
    .refine((value) => value.length <= max, `${label} must be ${max} characters or less.`);

const optionalTrimmed = (max: number, label: string) =>
  z
    .string()
    .transform((value) => value.normalize("NFC").trim())
    .refine((value) => value.length <= max, `${label} must be ${max} characters or less.`)
    .transform((value) => (value.length === 0 ? undefined : value))
    .optional();

const createTicketSchema = z
  .object({
    title: trimmedString(3, 100, "Title"),
    description: trimmedString(10, 2000, "Description"),
    customerName: optionalTrimmed(100, "Customer name"),
    customerEmail: z
      .string()
      .trim()
      .max(254, "Customer email must be 254 characters or less.")
      .email("Customer email must be a valid email address.")
      .optional()
      .or(z.literal("").transform(() => undefined))
  })
  .strict();

export function validateCreateTicketInput(body: unknown): CreateTicketInput {
  const result = createTicketSchema.safeParse(body);

  if (!result.success) {
    const message = result.error.issues[0]?.message ?? "Invalid request body.";
    throw new Error(message);
  }

  return result.data;
}
