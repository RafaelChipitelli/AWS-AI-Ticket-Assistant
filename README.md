# AWS AI Ticket Assistant

A full-stack cloud support ticket assistant designed for a cloud support/MSP company.

The current version runs completely locally:

- React + TypeScript + Vite frontend
- Tailwind CSS styling
- Node.js + TypeScript + Express backend
- In-memory mock database
- Mock AI analysis service
- Axios frontend API client

Future phases will add AWS Lambda, API Gateway, DynamoDB, CloudWatch, IAM, Terraform, and a real AI provider such as Amazon Bedrock or OpenAI.

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
