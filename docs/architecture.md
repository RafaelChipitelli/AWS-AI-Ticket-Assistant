# Architecture

## Current local architecture

```text
React Frontend → Express Backend → In-memory Mock Database → Mock AI Service
```

The local app is intentionally structured to match the future serverless architecture. Backend code is split into Express handlers, Lambda handlers, services, types, and utilities so the same domain logic can run locally and later in AWS.

## Phase 3: Lambda-ready backend

```text
API Gateway Event → Lambda Handler → Ticket Service → Mock Database → Mock AI Service
```

Lambda-compatible handlers live in `backend/src/lambda/` and return API Gateway proxy responses. The existing Express server in `backend/src/local/server.ts` remains available for local development.

## Phase 4: Database mode switch

```text
Ticket Service → Database Service → local in-memory Map
                            └──→ DynamoDB table
```

The backend reads `DATABASE_MODE` to decide which database adapter to use:

- `local`: in-memory Map for local development.
- `dynamodb`: DynamoDB table configured by `TICKETS_TABLE_NAME`.

This lets the local app keep working without AWS credentials while preparing the same service interface for Lambda and DynamoDB.

## Future target architecture

```text
User
 ↓
React Frontend
 ↓
API Gateway
 ↓
AWS Lambda
 ↓
DynamoDB
 ↓
AI Provider (Amazon Bedrock or OpenAI)
 ↓
Lambda returns analysis
 ↓
Frontend displays ticket result
```

CloudWatch will capture Lambda logs for support triage, debugging, and operational visibility.

## Cost controls

The AWS infrastructure is designed for low-cost learning/portfolio usage:

- DynamoDB uses `PAY_PER_REQUEST` billing.
- Lambda uses 128 MB memory and 10-second timeout.
- API Gateway uses HTTP API v2.
- CloudWatch log groups retain logs for 3 days.
- The deployed backend uses mock AI by default.
- A monthly AWS Budget alert is configured at USD 5.

The budget is an alerting mechanism, not an automatic hard cap. Destroy unused resources with Terraform to stop charges.

## Current AWS deployment

```text
React Frontend (local Vite)
 ↓
API Gateway: https://exple123.execute-api.ap-southeast-2.amazonaws.com
 ↓
Lambda functions
 ↓
DynamoDB table: aws-ai-ticket-assistant-dev-tickets
 ↓
Mock AI service
```

Validated endpoints:

- `POST /tickets`
- `GET /tickets`
- `GET /tickets/{id}`
