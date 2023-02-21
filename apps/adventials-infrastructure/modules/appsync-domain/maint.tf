terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.40.0"
    }
  }
}

resource "aws_appsync_domain_name" "adventials_api" {
  domain_name     = var.domain
  certificate_arn = var.certificate_arn
}

resource "aws_appsync_domain_name_api_association" "adventials_api" {
  api_id      = var.api_id
  domain_name = aws_appsync_domain_name.adventials_api.domain_name
}

resource "aws_route53_record" "adventials_api_a_record" {
  allow_overwrite = true
  zone_id         = var.zone_id
  name            = ""
  type            = "A"

  alias {
    name                   = aws_appsync_domain_name.adventials_api.appsync_domain_name
    zone_id                = aws_appsync_domain_name.adventials_api.hosted_zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "adventials_api_aaaa_record" {
  allow_overwrite = true
  zone_id         = var.zone_id
  name            = ""
  type            = "AAAA"

  alias {
    name                   = aws_appsync_domain_name.adventials_api.appsync_domain_name
    zone_id                = aws_appsync_domain_name.adventials_api.hosted_zone_id
    evaluate_target_health = true
  }
}
