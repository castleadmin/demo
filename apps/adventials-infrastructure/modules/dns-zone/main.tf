terraform {
  required_providers {
    aws = {
      source                = "hashicorp/aws"
      version               = "4.40.0"
      configuration_aliases = [aws.us_east_1]
    }
  }
}

resource "aws_acm_certificate" "adventials_api" {
  provider          = aws.us_east_1
  domain_name       = var.domain
  validation_method = "DNS"

  options {
    certificate_transparency_logging_preference = "ENABLED"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_zone" "adventials_api" {
  name          = var.domain
  force_destroy = true
}

resource "aws_route53_record" "adventials_api" {
  for_each = {
    for dvo in aws_acm_certificate.adventials_api.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 300
  type            = each.value.type
  zone_id         = aws_route53_zone.adventials_api.zone_id
}

resource "aws_acm_certificate_validation" "adventials_api" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.adventials_api.arn
  validation_record_fqdns = [for record in aws_route53_record.adventials_api : record.fqdn]
}
