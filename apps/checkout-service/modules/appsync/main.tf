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
  http_resolvers = {
    checkout = {
      name     = "checkout"
      type     = "Mutation"
      field    = "checkout"
      action   = "states:StartExecution"
      endpoint = "https://states.eu-central-1.amazonaws.com"
    }
    approve_checkout = {
      name     = "approve-checkout"
      type     = "Mutation"
      field    = "approveCheckout"
      action   = "states:SendTaskSuccess"
      endpoint = "https://states.eu-central-1.amazonaws.com"
    }
    reject_checkout = {
      name     = "reject-checkout"
      type     = "Mutation"
      field    = "rejectCheckout"
      action   = "states:SendTaskFailure"
      endpoint = "https://states.eu-central-1.amazonaws.com"
    }
    checkout_heartbeat = {
      name     = "checkout-heartbeat"
      type     = "Mutation"
      field    = "checkoutHeartbeat"
      action   = "states:SendTaskHeartbeat"
      endpoint = "https://states.eu-central-1.amazonaws.com"
    }
  }
  none_resolvers = {
    request_checkout_approval = {
      name  = "request-checkout-approval"
      type  = "Mutation"
      field = "requestCheckoutApproval"
    }
    send_checkout_error = {
      name  = "send-checkout-error"
      type  = "Mutation"
      field = "sendCheckoutError"
    }
    on_request_checkout_approval = {
      name  = "on-request-checkout-approval"
      type  = "Subscription"
      field = "onRequestCheckoutApproval"
    }
    on_send_checkout_error = {
      name  = "on-send-checkout-error"
      type  = "Subscription"
      field = "onSendCheckoutError"
    }
  }
}

resource "aws_iam_role" "http_resolver_role" {
  for_each = local.http_resolvers

  name = "appsync-${terraform.workspace}-${each.value.name}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "appsync.amazonaws.com"
      },
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "http_resolver_role_policy" {
  for_each = local.http_resolvers

  name = "appsync-policy-${terraform.workspace}-${each.value.name}"
  role = aws_iam_role.http_resolver_role[each.key].id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "${each.value.action}"
      ],
      "Resource": [
        "${var.sfn_arn}"
      ]
    }
  ]
}
EOF
}

resource "aws_appsync_datasource" "http_resolver_datasource" {
  for_each = local.http_resolvers

  api_id           = var.api_id
  name             = "${each.key}_checkout_service"
  type             = "HTTP"
  service_role_arn = aws_iam_role.http_resolver_role[each.key].arn

  http_config {
    endpoint = each.value.endpoint

    authorization_config {
      authorization_type = "AWS_IAM"

      aws_iam_config {
        signing_region       = "eu-central-1"
        signing_service_name = "states"
      }
    }
  }
}

resource "aws_appsync_resolver" "http_resolver_resolver" {
  for_each = local.http_resolvers

  api_id            = var.api_id
  type              = each.value.type
  field             = each.value.field
  request_template  = templatefile("src/resolvers/${lower(each.value.type)}.${each.value.name}.request.vtl", { SFN_ARN = var.sfn_arn })
  response_template = file("src/resolvers/${lower(each.value.type)}.${each.value.name}.response.vtl")
  data_source       = aws_appsync_datasource.http_resolver_datasource[each.key].name
  kind              = "UNIT"
}

resource "aws_appsync_datasource" "none_resolver_datasource" {
  for_each = local.none_resolvers

  api_id = var.api_id
  name   = "${each.key}_checkout_service"
  type   = "NONE"
}

resource "aws_appsync_resolver" "none_resolver" {
  for_each = local.none_resolvers

  api_id            = var.api_id
  type              = each.value.type
  field             = each.value.field
  request_template  = file("src/resolvers/${lower(each.value.type)}.${each.value.name}.request.vtl")
  response_template = file("src/resolvers/${lower(each.value.type)}.${each.value.name}.response.vtl")
  data_source       = aws_appsync_datasource.none_resolver_datasource[each.key].name
  kind              = "UNIT"
}
