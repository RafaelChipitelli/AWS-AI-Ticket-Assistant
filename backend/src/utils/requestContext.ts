import type { APIGatewayProxyEvent } from "aws-lambda";

interface V2Context {
  authorizer?: { jwt?: { claims?: { sub?: string } } };
  http?: { sourceIp?: string };
}

export function extractUserId(event: APIGatewayProxyEvent): string | undefined {
  const ctx = event.requestContext as unknown as V2Context;
  return ctx.authorizer?.jwt?.claims?.sub;
}

export function extractSourceIp(event: APIGatewayProxyEvent): string {
  const ctx = event.requestContext as unknown as V2Context;
  return ctx.http?.sourceIp ?? event.requestContext.identity?.sourceIp ?? "unknown";
}
