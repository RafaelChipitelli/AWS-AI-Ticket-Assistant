# AWS AI Ticket Assistant

A full-stack cloud support ticket assistant designed for a cloud support/MSP company.

The current version runs completely locally:

- React + TypeScript + Vite frontend
- Tailwind CSS styling
- Node.js + TypeScript + Express backend
- Lambda-compatible backend handlers
- In-memory mock database
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

## Example ticket

```json
{
  "title": "Website is down",
  "description": "After deploying the new version, the website is returning 502 errors.",
  "customerName": "John Smith",
  "customerEmail": "john@example.com"
}
```
