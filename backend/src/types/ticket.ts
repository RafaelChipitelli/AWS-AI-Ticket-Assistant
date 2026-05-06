export type TicketPriority = "low" | "medium" | "high" | "critical";

export interface TicketAnalysis {
  possibleCause: string;
  priority: TicketPriority;
  nextSteps: string[];
  suggestedResponse: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  customerName?: string;
  customerEmail?: string;
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
  updatedAt: string;
  analysis?: TicketAnalysis;
}

export interface CreateTicketInput {
  title: string;
  description: string;
  customerName?: string;
  customerEmail?: string;
}
