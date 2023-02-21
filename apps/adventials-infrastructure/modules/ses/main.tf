terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.40.0"
    }
  }
}

locals {
  ses = {
    adventials-test = {
      domain             = "test.adventials.com"
      notification_email = "willig.tobias+test@gmail.com"
    }
    adventials-production = {
      domain             = "adventials.com"
      notification_email = "willig.tobias@gmail.com"
    }
  }
}

resource "aws_ses_domain_identity" "adventials" {
  domain = local.ses[terraform.workspace].domain
}

resource "aws_ses_domain_identity_verification" "adventials_verification" {
  domain = aws_ses_domain_identity.adventials.domain
}

resource "aws_ses_domain_dkim" "adventials_dkim" {
  domain = aws_ses_domain_identity.adventials.domain
}

resource "aws_ses_email_identity" "notification_email" {
  email = local.ses[terraform.workspace].notification_email
}
