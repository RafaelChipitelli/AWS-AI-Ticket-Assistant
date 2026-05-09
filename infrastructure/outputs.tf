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

output "frontend_bucket_name" {
  description = "S3 bucket name for the React frontend."
  value       = aws_s3_bucket.frontend.id
}

output "cloudfront_url" {
  description = "Public CloudFront URL for the frontend."
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}"
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID (needed for cache invalidation on deploy)."
  value       = aws_cloudfront_distribution.frontend.id
}

output "cognito_user_pool_id" {
  description = "Cognito User Pool ID."
  value       = aws_cognito_user_pool.main.id
}

output "cognito_client_id" {
  description = "Cognito App Client ID for the frontend."
  value       = aws_cognito_user_pool_client.frontend.id
}

output "cognito_hosted_ui_domain" {
  description = "Cognito Hosted UI base domain (without https://)."
  value       = "${aws_cognito_user_pool_domain.main.domain}.auth.${var.aws_region}.amazoncognito.com"
}

output "google_idp_callback_url" {
  description = "Add this URL to your Google OAuth authorized redirect URIs."
  value       = "https://${aws_cognito_user_pool_domain.main.domain}.auth.${var.aws_region}.amazoncognito.com/oauth2/idpresponse"
}
