import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import type { Ticket } from "../types/ticket.js";

type DatabaseMode = "local" | "dynamodb";

const tickets = new Map<string, Ticket>();
const databaseMode = (process.env.DATABASE_MODE ?? "local") as DatabaseMode;
const tableName = process.env.TICKETS_TABLE_NAME ?? "Tickets";
const awsRegion = process.env.AWS_REGION ?? "ap-southeast-2";

const dynamoClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    region: awsRegion
  })
);

function sortTicketsByCreatedAt(items: Ticket[]): Ticket[] {
  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function isDynamoDbMode(): boolean {
  return databaseMode === "dynamodb";
}

export async function saveTicket(ticket: Ticket): Promise<Ticket> {
  if (!isDynamoDbMode()) {
    tickets.set(ticket.id, ticket);
    console.log("local_database_save_completed", { ticketId: ticket.id });
    return ticket;
  }

  await dynamoClient.send(
    new PutCommand({
      TableName: tableName,
      Item: ticket
    })
  );

  console.log("dynamodb_save_completed", { ticketId: ticket.id, tableName });
  return ticket;
}

export async function getTicketById(id: string): Promise<Ticket | undefined> {
  if (!isDynamoDbMode()) {
    return tickets.get(id);
  }

  const result = await dynamoClient.send(
    new GetCommand({
      TableName: tableName,
      Key: { id }
    })
  );

  return result.Item as Ticket | undefined;
}

export async function listTickets(): Promise<Ticket[]> {
  if (!isDynamoDbMode()) {
    return sortTicketsByCreatedAt(Array.from(tickets.values()));
  }

  const result = await dynamoClient.send(
    new ScanCommand({
      TableName: tableName
    })
  );

  return sortTicketsByCreatedAt((result.Items ?? []) as Ticket[]);
}
