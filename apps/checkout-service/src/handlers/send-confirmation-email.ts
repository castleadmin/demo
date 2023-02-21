import { Order } from '@castleadmin/checkout-domain';
import { createHandler, ErrorResponse } from '@castleadmin/serverless-utils';
import { Handler } from 'aws-lambda';
import { SESV2 } from 'aws-sdk';
import { environment } from '../environments/environment';

interface SendConfirmationEmailResponse {
  order: Order;
}

const ses = new SESV2({ region: 'eu-central-1' });

export const handler = createHandler<
  Handler<
    { transactionId: string; order: Order },
    ErrorResponse | SendConfirmationEmailResponse
  >
>(environment, async (event) => {
  const transactionId = event.transactionId;
  if (!transactionId) {
    return {
      error: 'Missing transactionId parameter',
    };
  }
  const order = event.order;
  if (!order) {
    return {
      error: 'Missing order parameter',
    };
  }

  const params = {
    FeedbackForwardingEmailAddress: environment.feedbackEmailAddress,
    FeedbackForwardingEmailAddressIdentityArn: environment.feedbackEmailArn,
    FromEmailAddress: `"Adventials" <${environment.noReplyEmailAddress}>`,
    Destination: {
      ToAddresses: [order.emailAddress],
    },
    Content: {
      Template: {
        TemplateName: `${
          environment.emailTemplateName
        }-${order.language.toLowerCase()}`,
        TemplateData: JSON.stringify(order),
      },
    },
  } as SESV2.Types.SendEmailRequest;

  const result = await ses.sendEmail(params).promise();

  if (result.$response.error) {
    return {
      error: `Send email error - ${result.$response.error}`,
    };
  }

  return {
    transactionId,
    order,
  };
});
