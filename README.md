# AWS AI Ticket Assistant

A full-stack cloud support ticket assistant designed for a cloud support/MSP company.

The current version runs completely locally:

- React + TypeScript + Vite frontend
- Tailwind CSS styling
- Node.js + TypeScript + Express backend
- Lambda-compatible backend handlers
- Database mode switch: local in-memory storage or DynamoDB
- Mock AI analysis service
- Axios frontend API client

Future phases will add AWS Lambda, API Gateway, DynamoDB, CloudWatch, IAM, Terraform, and a real AI provider such as Amazon Bedrock or OpenAI.

The backend is now structured so local Express handlers and future AWS Lambda handlers reuse the same ticket service logic.

## Local architecture

```text
User
 ↓
React Frontend
 ↓
Express API
 ↓
Mock Database
 ↓
Mock AI Service
 ↓
Frontend displays ticket result
```

## API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/tickets` | Creates a ticket and returns mock AI analysis |
| GET | `/tickets` | Lists all tickets |
| GET | `/tickets/:id` | Returns one ticket by ID |

## Lambda-ready handlers

The local Express API remains the primary development server, but the backend now also includes API Gateway-compatible Lambda handlers:

```text
backend/src/lambda/createTicketLambda.ts
backend/src/lambda/getTicketLambda.ts
backend/src/lambda/listTicketsLambda.ts
```

These handlers reuse the same ticket service, validation, mock database, and mock AI service as the local Express API.

## Database modes

The backend supports two database modes through environment variables:

```text
DATABASE_MODE=local
TICKETS_TABLE_NAME=Tickets
AWS_REGION=ap-southeast-2
```

- `local`: uses in-memory storage for local development.
- `dynamodb`: uses DynamoDB through `@aws-sdk/client-dynamodb` and `@aws-sdk/lib-dynamodb`.

Local mode is the default and does not require AWS credentials.

## Quick start

Install dependencies:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Run backend:

```bash
cd backend
npm run dev
```

Run frontend in another terminal:

```bash
cd frontend
npm run dev
```

Default URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`
- AWS API Gateway: `https://ti4jp4h8md.execute-api.ap-southeast-2.amazonaws.com`

## Example ticket

```json
{
  "title": "Website is down",
  "description": "After deploying the new version, the website is returning 502 errors.",
  "customerName": "John Smith",
  "customerEmail": "john@example.com"
}
```

## Low-cost AWS deployment

The Terraform stack in `infrastructure/` is configured for minimum-cost serverless usage:

- DynamoDB on-demand billing (`PAY_PER_REQUEST`)
- Lambda at 128 MB memory and 10-second timeout
- API Gateway HTTP API, not REST API
- CloudWatch log retention set to 3 days
- `AI_PROVIDER=mock` to avoid Bedrock/OpenAI costs
- No VPC, NAT Gateway, load balancer, or provisioned concurrency
- AWS Budget alert at USD 5/month

> The budget creates alerts, not a hard spending cap. If you receive a budget alert, destroy the stack manually.

### Package Lambda code

```bash
cd backend
npm run package
```

### Deploy infrastructure

```bash
cd infrastructure
terraform init
terraform plan
terraform apply
```

### Destroy infrastructure to stop AWS charges

```bash
cd infrastructure
terraform destroy
```

The budget alert email is configured in `infrastructure/terraform.tfvars.example`. Do not commit real secrets or private values to Git.

## Connect frontend to AWS API Gateway

For local frontend development against AWS, create `frontend/.env`:

```text
VITE_API_BASE_URL=https://ti4jp4h8md.execute-api.ap-southeast-2.amazonaws.com
```

To switch back to the local Express backend:

```text
VITE_API_BASE_URL=http://localhost:4000
```

Restart Vite after changing environment variables.

## Current deployed AWS endpoints

```text
POST https://ti4jp4h8md.execute-api.ap-southeast-2.amazonaws.com/tickets
GET  https://ti4jp4h8md.execute-api.ap-southeast-2.amazonaws.com/tickets
GET  https://ti4jp4h8md.execute-api.ap-southeast-2.amazonaws.com/tickets/{id}
```
