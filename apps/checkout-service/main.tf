terraform {
  cloud {
    organization = "castleadmin"

    workspaces {
      tags = [
        "adventials",
        "checkout-service"
      ]
    }
  }
}

locals {
  tags = {
    checkout-service-test = {
      app     = "adventials"
      env     = "test"
      project = "checkout-service"
    }
    checkout-service-production = {
      app     = "adventials"
      env     = "production"
      project = "checkout-service"
    }
  }
}

provider "aws" {
  shared_config_files      = ["~/.aws/config"]
  shared_credentials_files = ["~/.aws/credentials"]

  default_tags {
    tags = local.tags[terraform.workspace]
  }
}

data "aws_caller_identity" "identity" {}

module "step_functions" {
  source = "./modules/step-functions"

  api_id = var.api_id
}

module "ses" {
  source = "./modules/ses"
}

module "appsync" {
  source = "./modules/appsync"

  api_id  = var.api_id
  sfn_arn = module.step_functions.CHECKOUT_SERVICE_SFN_ARN
}
