variable "api_id" {
  type        = string
  description = "AppSync API ID"
  nullable    = false
}

variable "sfn_arn" {
  type        = string
  description = "Step Functions ARN"
  nullable    = false
}
