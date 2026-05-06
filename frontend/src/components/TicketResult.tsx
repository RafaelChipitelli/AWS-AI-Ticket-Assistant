import type { Ticket, TicketPriority } from "../types/ticket";

interface TicketResultProps {
  ticket: Ticket | null;
}

const priorityClasses: Record<TicketPriority, string> = {
  low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  medium: "bg-amber-50 text-amber-700 ring-amber-200",
  high: "bg-orange-50 text-orange-700 ring-orange-200",
  critical: "bg-red-50 text-red-700 ring-red-200"
};

export function TicketResult({ ticket }: TicketResultProps) {
  if (!ticket) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-6 text-center text-slate-500">
        AI analysis will appear here after a ticket is created.
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Ticket result</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">{ticket.title}</h2>
          <p className="mt-2 text-sm text-slate-600">{ticket.description}</p>
        </div>
        {ticket.analysis && (
          <span
            className={`rounded-full px-3 py-1 text-sm font-bold uppercase ring-1 ${priorityClasses[ticket.analysis.priority]}`}
          >
            {ticket.analysis.priority}
          </span>
        )}
      </div>

      <dl className="mt-6 grid gap-4 text-sm md:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-4">
          <dt className="font-semibold text-slate-700">Customer</dt>
          <dd className="mt-1 text-slate-600">{ticket.customerName || "Not provided"}</dd>
          <dd className="text-slate-500">{ticket.customerEmail || "No email"}</dd>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <dt className="font-semibold text-slate-700">Status</dt>
          <dd className="mt-1 capitalize text-slate-600">{ticket.status.replace("_", " ")}</dd>
          <dd className="text-slate-500">Created {new Date(ticket.createdAt).toLocaleString()}</dd>
        </div>
      </dl>

      {ticket.analysis && (
        <div className="mt-6 space-y-5">
          <div>
            <h3 className="font-semibold text-slate-900">Possible cause</h3>
            <p className="mt-2 text-slate-700">{ticket.analysis.possibleCause}</p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">Recommended next steps</h3>
            <ol className="mt-2 list-decimal space-y-2 pl-5 text-slate-700">
              {ticket.analysis.nextSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="rounded-xl bg-blue-50 p-4">
            <h3 className="font-semibold text-blue-950">Suggested customer response</h3>
            <p className="mt-2 text-blue-900">{ticket.analysis.suggestedResponse}</p>
          </div>
        </div>
      )}
    </section>
  );
}
