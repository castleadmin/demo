output "ADVENTIALS_SES_DKIM_TOKENS" {
  value       = aws_ses_domain_dkim.adventials_dkim.dkim_tokens
  description = "SES DKIM Tokens"
}
