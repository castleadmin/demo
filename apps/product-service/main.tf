terraform {
  cloud {
    organization = "castleadmin"

    workspaces {
      tags = [
        "adventials",
        "product-service"
      ]
    }
  }
}

locals {
  tags = {
    product-service-test = {
      app     = "adventials"
      env     = "test"
      project = "product-service"
    }
    product-service-production = {
      app     = "adventials"
      env     = "production"
      project = "product-service"
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

module "appsync" {
  source = "./modules/appsync"

  api_id = var.api_id
}
