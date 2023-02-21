output "ADVENTIALS_APPSYNC_API_ID" {
  value       = module.appsync.ADVENTIALS_APPSYNC_API_ID
  description = "Adventials AppSync API ID"
}

output "ADVENTIALS_APPSYNC_API_KEY_ID" {
  value       = module.appsync.ADVENTIALS_APPSYNC_API_KEY_ID
  description = "Adventials AppSync API Key ID"
}

output "ADVENTIALS_APPSYNC_API_KEY" {
  value       = module.appsync.ADVENTIALS_APPSYNC_API_KEY
  description = "Adventials AppSync API Key"
  sensitive   = true
}

output "ADVENTIALS_SES_DKIM_TOKENS" {
  value       = module.ses.ADVENTIALS_SES_DKIM_TOKENS
  description = "SES DKIM Tokens"
}
