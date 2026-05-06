# Setup

## Requirements

- Node.js 20+
- npm

## Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:4000`.

The backend also includes Lambda-compatible handlers in `backend/src/lambda/`. These are compiled with the backend build and will be used by API Gateway in a later AWS deployment phase.

```text
backend/src/lambda/createTicketLambda.ts
backend/src/lambda/getTicketLambda.ts
backend/src/lambda/listTicketsLambda.ts
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Environment files

Copy `.env.example` files if you need custom ports or API URLs.
