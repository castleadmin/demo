variable "api_id" {
  type        = string
  description = "AppSync API ID"
  nullable    = false
}

variable "certificate_arn" {
  type        = string
  description = "API Certificate ARN"
  nullable    = false
}

variable "domain" {
  type        = string
  description = "API Domain Name"
  nullable    = false
}

variable "zone_id" {
  type        = string
  description = "DNS Zone ID"
  nullable    = false
}
