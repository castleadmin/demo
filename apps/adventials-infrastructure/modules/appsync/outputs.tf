output "ADVENTIALS_APPSYNC_API_ID" {
  value       = aws_appsync_graphql_api.adventials.id
  description = "Adventials AppSync API ID"
}

output "ADVENTIALS_APPSYNC_API_KEY_ID" {
  value       = aws_appsync_api_key.adventials.id
  description = "Adventials AppSync API Key ID"
}

output "ADVENTIALS_APPSYNC_API_KEY" {
  value       = aws_appsync_api_key.adventials.key
  description = "Adventials AppSync API Key"
  sensitive   = true
}
