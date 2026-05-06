import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createTicketHandler } from "../handlers/createTicket.js";
import { getTicketHandler } from "../handlers/getTicket.js";
import { listTicketsHandler } from "../handlers/listTickets.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 3001);
const frontendOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";

app.use(cors({ origin: frontendOrigin }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "aws-ai-ticket-assistant-backend" });
});

app.post("/tickets", createTicketHandler);
app.get("/tickets", listTicketsHandler);
app.get("/tickets/:id", getTicketHandler);

app.listen(port, () => {
  console.log(`Local ticket API running at http://localhost:${port}`);
});
