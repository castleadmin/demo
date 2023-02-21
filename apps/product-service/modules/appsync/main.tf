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
  functions = {
    count_items = {
      name  = "count-items"
      type  = "Query"
      field = "countItems"
      arn   = "arn:aws:lambda:eu-central-1:${data.aws_caller_identity.identity.account_id}:function:${terraform.workspace}-countItems"
    },
    count_search_items = {
      name  = "count-search-items"
      type  = "Query"
      field = "countSearchItems"
      arn   = "arn:aws:lambda:eu-central-1:${data.aws_caller_identity.identity.account_id}:function:${terraform.workspace}-countSearchItems"
    }
    get_item = {
      name  = "get-item"
      type  = "Query"
      field = "getItem"
      arn   = "arn:aws:lambda:eu-central-1:${data.aws_caller_identity.identity.account_id}:function:${terraform.workspace}-getItem"
    }
    get_items = {
      name  = "get-items"
      type  = "Query"
      field = "getItems"
      arn   = "arn:aws:lambda:eu-central-1:${data.aws_caller_identity.identity.account_id}:function:${terraform.workspace}-getItems"
    },
    search_items = {
      name  = "search-items"
      type  = "Query"
      field = "searchItems"
      arn   = "arn:aws:lambda:eu-central-1:${data.aws_caller_identity.identity.account_id}:function:${terraform.workspace}-searchItems"
    }
  }
}

resource "aws_iam_role" "function_role" {
  for_each = local.functions

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

resource "aws_iam_role_policy" "function_role_policy" {
  for_each = local.functions

  name = "appsync-policy-${terraform.workspace}-${each.value.name}"
  role = aws_iam_role.function_role[each.key].id

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
        "${each.value.arn}"
      ]
    }
  ]
}
EOF
}

resource "aws_appsync_datasource" "function_datasource" {
  for_each = local.functions

  api_id           = var.api_id
  name             = "${each.key}_product_service"
  type             = "AWS_LAMBDA"
  service_role_arn = aws_iam_role.function_role[each.key].arn

  lambda_config {
    function_arn = each.value.arn
  }
}

resource "aws_appsync_resolver" "function_resolver" {
  for_each = local.functions

  api_id            = var.api_id
  type              = each.value.type
  field             = each.value.field
  request_template  = file("src/resolvers/${lower(each.value.type)}.${each.value.name}.request.vtl")
  response_template = file("src/resolvers/${lower(each.value.type)}.${each.value.name}.response.vtl")
  data_source       = aws_appsync_datasource.function_datasource[each.key].name
  kind              = "UNIT"
}
