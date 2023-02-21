output "CHECKOUT_SERVICE_SFN_ARN" {
  value       = aws_sfn_state_machine.checkout_state_machine.arn
  description = "Step Functions ARN"
}
