import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import { createTicketHandler } from "../handlers/createTicket.js";
import { getTicketHandler } from "../handlers/getTicket.js";
import { listTicketsHandler } from "../handlers/listTickets.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);
const frontendOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";

app.use(cors({ origin: frontendOrigin }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "aws-ai-ticket-assistant-backend" });
});

app.post("/tickets", createTicketHandler);
app.get("/tickets", listTicketsHandler);
app.get("/tickets/:id", getTicketHandler);

app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON request body." });
  }

  return next(err);
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled local API error", err);
  return res.status(500).json({ error: "Internal server error." });
});

app.listen(port, () => {
  console.log(`Local ticket API running at http://localhost:${port}`);
});
