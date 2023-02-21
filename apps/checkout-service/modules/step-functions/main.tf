terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.40.0"
    }
  }
}

data "aws_caller_identity" "identity" {}

locals {
  env = {
    checkout-service-test       = "test"
    checkout-service-production = "production"
  }
  product_service = replace(terraform.workspace, "checkout-service", "product-service")
  functions = {
    get_items_by_id = {
      arn = "arn:aws:lambda:eu-central-1:${data.aws_caller_identity.identity.account_id}:function:${local.product_service}-getItemsById"
    }
    create_order = {
      arn = "arn:aws:lambda:eu-central-1:${data.aws_caller_identity.identity.account_id}:function:${terraform.workspace}-createOrder"
    }
    get_shipping_details = {
      arn = "arn:aws:lambda:eu-central-1:${data.aws_caller_identity.identity.account_id}:function:${terraform.workspace}-getShippingDetails"
    }
    request_checkout_approval = {
      arn = "arn:aws:lambda:eu-central-1:${data.aws_caller_identity.identity.account_id}:function:${terraform.workspace}-requestCheckoutApproval"
    }
    send_checkout_error = {
      arn = "arn:aws:lambda:eu-central-1:${data.aws_caller_identity.identity.account_id}:function:${terraform.workspace}-sendCheckoutError"
    }
    send_confirmation_email = {
      arn = "arn:aws:lambda:eu-central-1:${data.aws_caller_identity.identity.account_id}:function:${terraform.workspace}-sendConfirmationEmail"
    }
    validate_order = {
      arn = "arn:aws:lambda:eu-central-1:${data.aws_caller_identity.identity.account_id}:function:${terraform.workspace}-validateOrder"
    }
  }
}

resource "aws_iam_role" "sfn_role" {
  name = "sfn-${terraform.workspace}-checkout"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "states.amazonaws.com"
      },
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "sfn_policy" {
  name = "sfn-policy-${terraform.workspace}-checkout"
  role = aws_iam_role.sfn_role.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "lambda:InvokeFunction"
      ],
      "Resource": [
        "${local.functions.get_items_by_id.arn}",
        "${local.functions.create_order.arn}",
        "${local.functions.get_shipping_details.arn}",
        "${local.functions.request_checkout_approval.arn}",
        "${local.functions.send_checkout_error.arn}",
        "${local.functions.send_confirmation_email.arn}",
        "${local.functions.validate_order.arn}"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "xray:PutTraceSegments",
        "xray:PutTelemetryRecords",
        "xray:GetSamplingTargets",
        "xray:GetSamplingRules",
        "xray:GetSamplingStatisticSummaries"
      ],
      "Resource": [
        "*"
      ]
    }
  ]
}
EOF
}

resource "aws_sfn_state_machine" "checkout_state_machine" {
  name       = "${terraform.workspace}-checkout"
  role_arn   = aws_iam_role.sfn_role.arn
  type       = "STANDARD"
  definition = templatefile("checkout.asl.json", { ENVIRONMENT = local.env[terraform.workspace] })

  tracing_configuration {
    enabled = true
  }
}
