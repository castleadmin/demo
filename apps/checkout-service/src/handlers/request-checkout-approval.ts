import { gql } from '@apollo/client';
import { ApprovalOrder } from '@castleadmin/checkout-domain';
import {
  createApolloClient,
  createHandler,
  ErrorResponse,
} from '@castleadmin/serverless-utils';
import { Handler } from 'aws-lambda';
import { environment } from '../environments/environment';

export interface RequestCheckoutApprovalResponse {
  transactionId: string;
}

const client = createApolloClient(
  environment.graphqlEndpoint,
  environment.awsAccessKey,
  environment.awsSecretAccessKey,
  environment.awsSessionToken
);

export const handler = createHandler<
  Handler<
    { transactionId: string; token: string; approvalOrder: ApprovalOrder },
    ErrorResponse | RequestCheckoutApprovalResponse
  >
>(environment, async (event) => {
  const transactionId = event.transactionId;
  if (!transactionId) {
    return {
      error: 'Missing transactionId parameter',
    };
  }
  const token = event.token;
  if (!token) {
    return {
      error: 'Missing token parameter',
    };
  }
  const approvalOrder = event.approvalOrder;
  if (!approvalOrder) {
    return {
      error: 'Missing approvalOrder parameter',
    };
  }

  const result = await client.mutate<
    {
      requestCheckoutApproval: {
        transactionId: string;
        token: string;
        approvalOrder: ApprovalOrder;
      };
    },
    {
      transactionId: string;
      token: string;
      approvalOrder: ApprovalOrder;
    }
  >({
    variables: {
      transactionId,
      token,
      approvalOrder,
    },
    mutation: gql`
      mutation requestCheckoutApproval(
        $transactionId: ID!
        $token: ID!
        $approvalOrder: ApprovalOrderInput!
      ) {
        requestCheckoutApproval(
          transactionId: $transactionId
          token: $token
          approvalOrder: $approvalOrder
        ) {
          transactionId
          token
          approvalOrder {
            firstName
            lastName
            businessName
            emailAddress
            streetAddress
            zipCode
            city
            country
            shippingOption
            paymentMethod
            language
            items {
              itemId
              quantity
            }
            validationResult {
              isValid
            }
            checkItemsResult {
              hasValidItems
              invalidItemIds
              checkedItems {
                _id
                ean
                category
                type
                quality
                effect
                effectPower
                prices {
                  EUR
                }
                isInStock
                popularity
                halfStars
                ratingCount
                translations {
                  de {
                    name
                    description
                    effectName
                  }
                  enUs {
                    name
                    description
                    effectName
                  }
                }
              }
            }
            shippingResult {
              shippingPrices {
                EUR
              }
              deliveryDateItems {
                itemId
                deliveryDate
              }
            }
          }
        }
      }
    `,
  });

  const resultTransactionId =
    result.data?.requestCheckoutApproval.transactionId;
  if (resultTransactionId !== transactionId) {
    return {
      error: `Request checkout approval failed (expected: ${transactionId}, received: ${resultTransactionId})`,
    };
  }

  return {
    transactionId,
  };
});
