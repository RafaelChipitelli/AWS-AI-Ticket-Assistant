locals {
  lambda_environment_variables = {
    NODE_ENV                            = "production"
    DATABASE_MODE                       = "dynamodb"
    TICKETS_TABLE_NAME                  = aws_dynamodb_table.tickets.name
    RATE_LIMIT_TABLE_NAME               = aws_dynamodb_table.rate_limits.name
    AI_PROVIDER                         = "mock"
    AWS_NODEJS_CONNECTION_REUSE_ENABLED = "1"
  }
}

resource "aws_cloudwatch_log_group" "create_ticket" {
  name              = "/aws/lambda/${local.project_name}-${var.environment}-create-ticket"
  retention_in_days = var.cloudwatch_log_retention_days
}

resource "aws_cloudwatch_log_group" "get_ticket" {
  name              = "/aws/lambda/${local.project_name}-${var.environment}-get-ticket"
  retention_in_days = var.cloudwatch_log_retention_days
}

resource "aws_cloudwatch_log_group" "list_tickets" {
  name              = "/aws/lambda/${local.project_name}-${var.environment}-list-tickets"
  retention_in_days = var.cloudwatch_log_retention_days
}

resource "aws_lambda_function" "create_ticket" {
  function_name    = "${local.project_name}-${var.environment}-create-ticket"
  role             = aws_iam_role.lambda_execution.arn
  runtime          = var.lambda_runtime
  handler          = "dist/lambda/createTicketLambda.handler"
  filename         = var.lambda_zip_path
  source_code_hash = filebase64sha256(var.lambda_zip_path)
  memory_size      = var.lambda_memory_size
  timeout          = var.lambda_timeout

  environment {
    variables = local.lambda_environment_variables
  }

  depends_on = [
    aws_iam_role_policy.lambda_permissions,
    aws_cloudwatch_log_group.create_ticket
  ]
}

resource "aws_lambda_function" "get_ticket" {
  function_name    = "${local.project_name}-${var.environment}-get-ticket"
  role             = aws_iam_role.lambda_execution.arn
  runtime          = var.lambda_runtime
  handler          = "dist/lambda/getTicketLambda.handler"
  filename         = var.lambda_zip_path
  source_code_hash = filebase64sha256(var.lambda_zip_path)
  memory_size      = var.lambda_memory_size
  timeout          = var.lambda_timeout

  environment {
    variables = local.lambda_environment_variables
  }

  depends_on = [
    aws_iam_role_policy.lambda_permissions,
    aws_cloudwatch_log_group.get_ticket
  ]
}

resource "aws_lambda_function" "list_tickets" {
  function_name    = "${local.project_name}-${var.environment}-list-tickets"
  role             = aws_iam_role.lambda_execution.arn
  runtime          = var.lambda_runtime
  handler          = "dist/lambda/listTicketsLambda.handler"
  filename         = var.lambda_zip_path
  source_code_hash = filebase64sha256(var.lambda_zip_path)
  memory_size      = var.lambda_memory_size
  timeout          = var.lambda_timeout

  environment {
    variables = local.lambda_environment_variables
  }

  depends_on = [
    aws_iam_role_policy.lambda_permissions,
    aws_cloudwatch_log_group.list_tickets
  ]
}
