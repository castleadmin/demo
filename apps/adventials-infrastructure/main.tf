terraform {
  cloud {
    organization = "castleadmin"

    workspaces {
      tags = [
        "adventials",
        "infrastructure"
      ]
    }
  }
}

locals {
  tags = {
    adventials-test = {
      app     = "adventials"
      env     = "test"
      project = "adventials-infrastructure"
    }
    adventials-production = {
      app     = "adventials"
      env     = "production"
      project = "adventials-infrastructure"
    }
  }
  domain = {
    adventials-test       = "api-test.adventials.com"
    adventials-production = "api.adventials.com"
  }
}

provider "aws" {
  shared_config_files      = ["~/.aws/config"]
  shared_credentials_files = ["~/.aws/credentials"]

  default_tags {
    tags = local.tags[terraform.workspace]
  }
}

provider "aws" {
  alias                    = "us_east_1"
  region                   = "us-east-1"
  shared_config_files      = ["~/.aws/config"]
  shared_credentials_files = ["~/.aws/credentials"]

  default_tags {
    tags = local.tags[terraform.workspace]
  }
}

module "appsync" {
  source = "./modules/appsync"
}

module "dns_zone" {
  source = "./modules/dns-zone"
  domain = local.domain[terraform.workspace]

  providers = {
    aws.us_east_1 = aws.us_east_1
  }
}

module "appsync_domain" {
  source          = "./modules/appsync-domain"
  api_id          = module.appsync.ADVENTIALS_APPSYNC_API_ID
  certificate_arn = module.dns_zone.ADVENTIALS_API_CERTIFICATE_ARN
  domain          = local.domain[terraform.workspace]
  zone_id         = module.dns_zone.ADVENTIALS_API_ZONE_ID
}

module "ses" {
  source = "./modules/ses"
}
