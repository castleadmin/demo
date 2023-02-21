output "ADVENTIALS_API_CERTIFICATE_ARN" {
  value       = aws_acm_certificate_validation.adventials_api.certificate_arn
  description = "Adventials API Certificate ARN"
}

output "ADVENTIALS_API_ZONE_ID" {
  value       = aws_route53_zone.adventials_api.zone_id
  description = "Adventials API DNS Zone ID"
}
