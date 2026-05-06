import type { Ticket, TicketPriority } from "../types/ticket";

interface TicketListProps {
  tickets: Ticket[];
  selectedTicketId?: string;
  onSelectTicket: (ticket: Ticket) => void;
}

const priorityDotClasses: Record<TicketPriority, string> = {
  low: "bg-emerald-500",
  medium: "bg-amber-500",
  high: "bg-orange-500",
  critical: "bg-red-500"
};

export function TicketList({ tickets, selectedTicketId, onSelectTicket }: TicketListProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Queue</p>
          <h2 className="text-xl font-bold text-slate-950">Recent tickets</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
          {tickets.length}
        </span>
      </div>

      {tickets.length === 0 ? (
        <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No tickets yet.</p>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => onSelectTicket(ticket)}
              className={`w-full rounded-xl border p-4 text-left transition hover:border-blue-300 hover:bg-blue-50/40 ${
                selectedTicketId === ticket.id ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-slate-900">{ticket.title}</h3>
                {ticket.analysis && (
                  <span className={`h-3 w-3 rounded-full ${priorityDotClasses[ticket.analysis.priority]}`} />
                )}
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-slate-600">{ticket.description}</p>
              <p className="mt-3 text-xs text-slate-400">{new Date(ticket.createdAt).toLocaleString()}</p>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
