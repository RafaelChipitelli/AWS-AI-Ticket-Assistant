output "api_base_url" {
  description = "Base URL for the API Gateway HTTP API."
  value       = aws_apigatewayv2_api.tickets.api_endpoint
}

output "dynamodb_table_name" {
  description = "Name of the DynamoDB tickets table."
  value       = aws_dynamodb_table.tickets.name
}

output "monthly_budget_name" {
  description = "Name of the AWS Budget guardrail."
  value       = aws_budgets_budget.monthly_cost_guardrail.name
}
