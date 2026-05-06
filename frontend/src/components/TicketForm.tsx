import { FormEvent, useState } from "react";
import type { CreateTicketPayload, Ticket } from "../types/ticket";

interface TicketFormProps {
  onCreate: (payload: CreateTicketPayload) => Promise<Ticket>;
}

const initialForm: CreateTicketPayload = {
  title: "Website is down",
  description: "After deploying the new version, the website is returning 502 errors.",
  customerName: "John Smith",
  customerEmail: "john@example.com"
};

export function TicketForm({ onCreate }: TicketFormProps) {
  const [form, setForm] = useState<CreateTicketPayload>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onCreate(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create ticket.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">New support case</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-950">Create cloud support ticket</h2>
        <p className="mt-2 text-sm text-slate-600">
          Submit an issue and receive a mock AI triage summary for MSP support teams.
        </p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Title</span>
          <input
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-500 focus:ring-2"
            placeholder="Website is down"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Description</span>
          <textarea
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            className="mt-1 min-h-32 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-500 focus:ring-2"
            placeholder="Describe the customer issue, impact, and recent changes."
            required
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Customer name</span>
            <input
              value={form.customerName ?? ""}
              onChange={(event) => setForm({ ...form, customerName: event.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-500 focus:ring-2"
              placeholder="John Smith"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Customer email</span>
            <input
              type="email"
              value={form.customerEmail ?? ""}
              onChange={(event) => setForm({ ...form, customerEmail: event.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-500 focus:ring-2"
              placeholder="john@example.com"
            />
          </label>
        </div>
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? "Generating analysis..." : "Create ticket and analyze"}
      </button>
    </form>
  );
}
