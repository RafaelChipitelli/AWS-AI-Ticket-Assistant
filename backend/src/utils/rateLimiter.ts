import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const WINDOW_SECONDS = 60;
const MAX_REQUESTS_PER_WINDOW = 60;

const tableName = process.env.RATE_LIMIT_TABLE_NAME;
const awsRegion = process.env.AWS_REGION ?? "ap-southeast-2";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: awsRegion }));

export interface RateLimitResult {
  allowed: boolean;
  count: number;
  limit: number;
  retryAfterSeconds: number;
}

/**
 * Fixed-window rate limiter backed by a DynamoDB atomic counter.
 * Each (identifier, window) pair gets its own row with a TTL for auto-cleanup.
 */
export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  if (!tableName) {
    // Rate limit disabled in local dev when table is not configured.
    return { allowed: true, count: 0, limit: MAX_REQUESTS_PER_WINDOW, retryAfterSeconds: 0 };
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const windowStart = nowSeconds - (nowSeconds % WINDOW_SECONDS);
  const key = `${identifier}#${windowStart}`;
  const expiresAt = windowStart + WINDOW_SECONDS * 2;
  const retryAfterSeconds = windowStart + WINDOW_SECONDS - nowSeconds;

  const result = await client.send(
    new UpdateCommand({
      TableName: tableName,
      Key: { key },
      UpdateExpression: "ADD #c :one SET #e = :exp",
      ExpressionAttributeNames: { "#c": "count", "#e": "expiresAt" },
      ExpressionAttributeValues: { ":one": 1, ":exp": expiresAt },
      ReturnValues: "UPDATED_NEW"
    })
  );

  const count = (result.Attributes?.count as number | undefined) ?? 1;
  return {
    allowed: count <= MAX_REQUESTS_PER_WINDOW,
    count,
    limit: MAX_REQUESTS_PER_WINDOW,
    retryAfterSeconds
  };
}
