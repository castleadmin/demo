terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.40.0"
    }
  }
}

resource "aws_ses_template" "order_confirmation_de" {
  name    = "order-confirmation-${terraform.workspace}-de"
  subject = file("email-templates/order-confirmation/de/subject.txt")
  html    = file("email-templates/order-confirmation/de/email.html")
  text    = file("email-templates/order-confirmation/de/email.txt")
}

resource "aws_ses_template" "order_confirmation_en_us" {
  name    = "order-confirmation-${terraform.workspace}-en-us"
  subject = file("email-templates/order-confirmation/en-us/subject.txt")
  html    = file("email-templates/order-confirmation/en-us/email.html")
  text    = file("email-templates/order-confirmation/en-us/email.txt")
}
