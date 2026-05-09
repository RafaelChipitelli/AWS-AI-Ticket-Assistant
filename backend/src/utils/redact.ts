import { createHash } from "node:crypto";

/**
 * Hashes an IP address into a short, non-reversible token suitable for logs.
 * Same IP always yields the same token (deterministic) so requests can be
 * correlated without exposing the raw address.
 */
export function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 12);
}

/**
 * Strips email addresses and long digit sequences (likely IDs, phone numbers,
 * card numbers) from a string before logging. Used on user-derived error
 * messages where the original input may have been echoed back.
 */
export function redactPii(message: string): string {
  return message
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[email]")
    .replace(/\b\d{4,}\b/g, "[number]");
}
