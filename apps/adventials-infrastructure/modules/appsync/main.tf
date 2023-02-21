terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.40.0"
    }
  }
}

resource "aws_iam_role" "appsync_logging" {
  name = "appsync-logging-${terraform.workspace}"

  assume_role_policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
        "Effect": "Allow",
        "Principal": {
            "Service": "appsync.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
        }
    ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "appsync_logging_policy" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppSyncPushToCloudWatchLogs"
  role       = aws_iam_role.appsync_logging.name
}

resource "aws_appsync_graphql_api" "adventials" {
  authentication_type = "API_KEY"
  name                = terraform.workspace
  schema              = file("schema.api.graphql")
  xray_enabled        = true

  additional_authentication_provider {
    authentication_type = "AWS_IAM"
  }

  additional_authentication_provider {
    authentication_type = "OPENID_CONNECT"

    openid_connect_config {
      issuer = "https://castleadmin.eu.auth0.com/"
    }
  }

  log_config {
    cloudwatch_logs_role_arn = aws_iam_role.appsync_logging.arn
    field_log_level          = "ERROR"
  }
}

resource "aws_appsync_api_key" "adventials" {
  api_id  = aws_appsync_graphql_api.adventials.id
  expires = timeadd(timestamp(), "192h") # 24h * 8
}
