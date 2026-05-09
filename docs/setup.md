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

To point the local frontend to AWS API Gateway, use `frontend/.env`:

```text
VITE_API_BASE_URL=https://ti4jp4h8md.execute-api.ap-southeast-2.amazonaws.com
```

To point it back to the local Express backend:

```text
VITE_API_BASE_URL=http://localhost:4000
```

Restart Vite after changing `.env` values.

## Environment files

Copy `.env.example` files if you need custom ports or API URLs.

Backend database settings:

```text
DATABASE_MODE=local
TICKETS_TABLE_NAME=Tickets
AWS_REGION=ap-southeast-2
```

Use `DATABASE_MODE=local` for normal local development. `DATABASE_MODE=dynamodb` is reserved for AWS/DynamoDB-backed environments and requires AWS credentials plus an existing DynamoDB table.

## Low-cost AWS deployment

Before deploying, confirm AWS CLI and Terraform work:

```bash
aws sts get-caller-identity
terraform version
```

Package the Lambda code:

```bash
cd backend
npm run package
```

Deploy:

```bash
cd infrastructure
terraform init
terraform plan
terraform apply
```

Stop AWS charges when not using the project:

```bash
terraform destroy
```

Cost-control settings:

- Monthly AWS Budget alert: USD 5
- Alert email: `RafaelChipitelli.o.c27@gmail.com`
- DynamoDB: on-demand billing
- Lambda: 128 MB, 10-second timeout
- CloudWatch logs: 3-day retention
- AI provider: mock

Budget alerts do not automatically stop charges. If you receive an alert, run `terraform destroy` from the `infrastructure/` directory.

Current AWS API Gateway endpoint:

```text
https://ti4jp4h8md.execute-api.ap-southeast-2.amazonaws.com
```
