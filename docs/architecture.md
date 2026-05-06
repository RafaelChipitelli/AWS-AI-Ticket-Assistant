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
