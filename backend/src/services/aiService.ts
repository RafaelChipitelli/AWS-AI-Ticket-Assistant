import type { CreateTicketInput, TicketAnalysis, TicketPriority } from "../types/ticket.js";

function inferPriority(text: string): TicketPriority {
  const lower = text.toLowerCase();

  if (["outage", "critical", "security breach"].some((term) => lower.includes(term))) {
    return "critical";
  }

  if (["down", "production", "502", "503", "error", "failed", "cannot access", "latency"].some((term) => lower.includes(term))) {
    return "high";
  }

  if (["slow", "warning", "intermittent", "timeout"].some((term) => lower.includes(term))) {
    return "medium";
  }

  return "low";
}

export async function analyzeTicket(input: CreateTicketInput): Promise<TicketAnalysis> {
  const combinedText = `${input.title} ${input.description}`;
  const lower = combinedText.toLowerCase();
  const priority = inferPriority(combinedText);

  if (lower.includes("502") || lower.includes("load balancer") || lower.includes("gateway")) {
    return {
      possibleCause:
        "The 502 errors may indicate that the load balancer cannot reach the backend service or that the backend application crashed after deployment.",
      priority,
      nextSteps: [
        "Check application logs in CloudWatch or local application logs.",
        "Verify the backend service is healthy and listening on the expected port.",
        "Check load balancer target group health or reverse proxy configuration.",
        "Review recent deployment changes and environment variables.",
        "Rollback if the issue affects production users."
      ],
      suggestedResponse:
        "We are investigating the outage and checking backend service health, deployment logs, and load balancer configuration. We will provide an update as soon as we identify the root cause."
    };
  }

  if (lower.includes("deploy") || lower.includes("deployment")) {
    return {
      possibleCause:
        "The issue may be related to a recent deployment, such as a configuration change, failed build artifact, dependency mismatch, or application startup failure.",
      priority,
      nextSteps: [
        "Review the deployment pipeline logs.",
        "Compare the latest release with the previous known-good version.",
        "Validate runtime configuration and secrets.",
        "Check application health checks and startup logs.",
        "Prepare a rollback plan if customer impact continues."
      ],
      suggestedResponse:
        "We are reviewing the recent deployment and validating application health, configuration, and logs to identify what changed and restore stable service."
    };
  }

  return {
    possibleCause:
      "The issue requires triage. It may be caused by application configuration, infrastructure health, network connectivity, or recent operational changes.",
    priority,
    nextSteps: [
      "Confirm the scope of customer impact.",
      "Collect recent logs, metrics, and deployment history.",
      "Check service health dashboards and alerts.",
      "Reproduce the issue if possible.",
      "Escalate to the appropriate engineering team if impact is confirmed."
    ],
    suggestedResponse:
      "We have received your support request and are beginning triage. We will review service health, recent changes, and logs, then provide the next update shortly."
  };
}
