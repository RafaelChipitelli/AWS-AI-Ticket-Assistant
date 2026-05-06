import { useEffect, useState } from "react";
import { createTicket, listTickets } from "./api/ticketsApi";
import { TicketForm } from "./components/TicketForm";
import { TicketList } from "./components/TicketList";
import { TicketResult } from "./components/TicketResult";
import type { CreateTicketPayload, Ticket } from "./types/ticket";

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    listTickets()
      .then((items) => {
        setTickets(items);
        setSelectedTicket(items[0] ?? null);
      })
      .catch((error) => {
        setLoadError(error instanceof Error ? error.message : "Unable to load tickets.");
      });
  }, []);

  async function handleCreateTicket(payload: CreateTicketPayload): Promise<Ticket> {
    const ticket = await createTicket(payload);
    setTickets((current) => [ticket, ...current]);
    setSelectedTicket(ticket);
    return ticket;
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <section className="bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">MSP Cloud Support</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
            AWS AI Ticket Assistant
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-300">
            Create support tickets, simulate cloud incident triage, and generate customer-ready responses.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[420px_1fr]">
        <div className="space-y-6">
          <TicketForm onCreate={handleCreateTicket} />
          <TicketList tickets={tickets} selectedTicketId={selectedTicket?.id} onSelectTicket={setSelectedTicket} />
        </div>

        <div className="space-y-4">
          {loadError && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{loadError}</p>}
          <TicketResult ticket={selectedTicket} />
        </div>
      </section>
    </main>
  );
}
