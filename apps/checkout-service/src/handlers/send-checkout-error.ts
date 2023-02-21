import { gql } from '@apollo/client';
import { CheckoutErrorType } from '@castleadmin/checkout-domain';
import {
  createApolloClient,
  createHandler,
  ErrorResponse,
} from '@castleadmin/serverless-utils';
import { Handler } from 'aws-lambda';
import { mapErrorToErrorType } from '../app/map-error-to-error-type';
import { environment } from '../environments/environment';

interface SendErrorResponse {
  transactionId: string;
  checkoutError: {
    errorType: CheckoutErrorType;
    error: string;
    cause: string;
  };
}

const client = createApolloClient(
  environment.graphqlEndpoint,
  environment.awsAccessKey,
  environment.awsSecretAccessKey,
  environment.awsSessionToken
);

export const handler = createHandler<
  Handler<
    {
      transactionId: string;
      checkoutError: {
        Error: string;
        Cause: string;
      };
    },
    ErrorResponse | SendErrorResponse
  >
>(environment, async (event) => {
  const transactionId = event.transactionId;
  if (!transactionId) {
    return {
      error: 'Missing transactionId parameter',
    };
  }
  if (!event.checkoutError) {
    return {
      error: 'Missing checkoutError parameter',
    };
  }
  const error = event.checkoutError.Error;
  if (!error) {
    return {
      error: 'Missing error parameter',
    };
  }
  const cause = event.checkoutError.Cause;
  if (cause === undefined || cause === null) {
    return {
      error: 'Missing cause parameter',
    };
  }

  const errorType = mapErrorToErrorType(error);

  const result = await client.mutate<
    {
      sendCheckoutError: {
        transactionId: string;
        errorType: CheckoutErrorType;
      };
    },
    {
      transactionId: string;
      errorType: CheckoutErrorType;
    }
  >({
    variables: {
      transactionId,
      errorType,
    },
    mutation: gql`
      mutation sendCheckoutError(
        $transactionId: ID!
        $errorType: CheckoutErrorType!
      ) {
        sendCheckoutError(
          transactionId: $transactionId
          errorType: $errorType
        ) {
          transactionId
          errorType
        }
      }
    `,
  });

  const resultTransactionId = result.data?.sendCheckoutError.transactionId;
  if (resultTransactionId !== transactionId) {
    return {
      error: `Send error failed (expected: ${transactionId}, received: ${resultTransactionId})`,
    };
  }

  return {
    transactionId,
    checkoutError: {
      errorType,
      error,
      cause,
    },
  };
});
