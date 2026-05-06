# Architecture

## Phase 1: Local architecture

```text
React Frontend → Express Backend → In-memory Mock Database → Mock AI Service
```

The local app is intentionally structured to match the future serverless architecture. Backend code is split into handlers, services, types, and utilities so future Lambda handlers can reuse the same domain logic.

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
