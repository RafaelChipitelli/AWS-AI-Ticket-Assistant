resource "aws_apigatewayv2_api" "tickets" {
  name          = "${local.project_name}-${var.environment}-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_headers = ["content-type", "authorization"]
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_origins = [
      "http://localhost:5173",
      "https://${aws_cloudfront_distribution.frontend.domain_name}"
    ]
    max_age = 300
  }
}

resource "aws_apigatewayv2_authorizer" "cognito" {
  api_id           = aws_apigatewayv2_api.tickets.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "cognito-jwt-authorizer"

  jwt_configuration {
    audience = [aws_cognito_user_pool_client.frontend.id]
    issuer   = "https://cognito-idp.${var.aws_region}.amazonaws.com/${aws_cognito_user_pool.main.id}"
  }
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.tickets.id
  name        = "$default"
  auto_deploy = true

  default_route_settings {
    throttling_burst_limit = 20
    throttling_rate_limit  = 10
  }
}

resource "aws_apigatewayv2_integration" "create_ticket" {
  api_id                 = aws_apigatewayv2_api.tickets.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.create_ticket.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "get_ticket" {
  api_id                 = aws_apigatewayv2_api.tickets.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.get_ticket.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "list_tickets" {
  api_id                 = aws_apigatewayv2_api.tickets.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.list_tickets.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "create_ticket" {
  api_id             = aws_apigatewayv2_api.tickets.id
  route_key          = "POST /tickets"
  target             = "integrations/${aws_apigatewayv2_integration.create_ticket.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_apigatewayv2_route" "list_tickets" {
  api_id             = aws_apigatewayv2_api.tickets.id
  route_key          = "GET /tickets"
  target             = "integrations/${aws_apigatewayv2_integration.list_tickets.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_apigatewayv2_route" "get_ticket" {
  api_id             = aws_apigatewayv2_api.tickets.id
  route_key          = "GET /tickets/{id}"
  target             = "integrations/${aws_apigatewayv2_integration.get_ticket.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_lambda_permission" "allow_api_create_ticket" {
  statement_id  = "AllowExecutionFromApiGatewayCreateTicket"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_ticket.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.tickets.execution_arn}/*/*"
}

resource "aws_lambda_permission" "allow_api_get_ticket" {
  statement_id  = "AllowExecutionFromApiGatewayGetTicket"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_ticket.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.tickets.execution_arn}/*/*"
}

resource "aws_lambda_permission" "allow_api_list_tickets" {
  statement_id  = "AllowExecutionFromApiGatewayListTickets"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.list_tickets.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.tickets.execution_arn}/*/*"
}
