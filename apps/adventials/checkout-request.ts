import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client';
import { CheckoutErrorType, CreateOrder } from '@castleadmin/checkout-domain';
import { createApolloClient } from '@castleadmin/frontend-utils';
import { CheckoutResponse } from './api';
import { CheckoutApprovalOrder } from './checkout';
import { environment } from './environments/environment';

export async function requestCheckout(
  transactionId: string,
  createOrder: CreateOrder
): Promise<CheckoutResponse> {
  const client = await createApolloClient(environment);

  const resultSubscriptionPromise = resultSubscription(client, transactionId);
  const startCheckoutProcessPromise = startCheckoutProcess(
    client,
    transactionId,
    createOrder
  );

  await startCheckoutProcessPromise;
  const result = await resultSubscriptionPromise;

  return result;
}

export async function startCheckoutProcess(
  client: ApolloClient<NormalizedCacheObject>,
  transactionId: string,
  createOrder: CreateOrder
): Promise<string> {
  const result = await client.mutate<
    {
      checkout: string;
    },
    {
      transactionId: string;
      createOrder: CreateOrder;
    }
  >({
    variables: {
      transactionId,
      createOrder,
    },
    mutation: gql`
      mutation checkoutMutation(
        $transactionId: ID!
        $createOrder: CreateOrderInput!
      ) {
        checkout(transactionId: $transactionId, createOrder: $createOrder)
      }
    `,
  });

  const resultTransactionId = result.data?.checkout;

  if (resultTransactionId !== transactionId) {
    throw new Error(
      `Transaction Id mismatch (received ${resultTransactionId}, expected ${transactionId})`
    );
  }

  return resultTransactionId;
}

export function resultSubscription(
  client: ApolloClient<NormalizedCacheObject>,
  transactionId: string
): Promise<CheckoutResponse> {
  const observableError = client.subscribe<
    {
      onSendCheckoutError: {
        transactionId: string;
        errorType: CheckoutErrorType;
      };
    },
    {
      transactionId: string;
    }
  >({
    variables: {
      transactionId,
    },
    query: gql`
      subscription errorSubscription($transactionId: ID!) {
        onSendCheckoutError(transactionId: $transactionId) {
          transactionId
          errorType
        }
      }
    `,
  });

  const observableCheckoutApproval = client.subscribe<
    {
      onRequestCheckoutApproval: {
        transactionId: string;
        token: string;
        approvalOrder: CheckoutApprovalOrder;
      };
    },
    {
      transactionId: string;
    }
  >({
    variables: {
      transactionId,
    },
    query: gql`
      subscription checkoutApprovalSubscription($transactionId: ID!) {
        onRequestCheckoutApproval(transactionId: $transactionId) {
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
            items {
              itemId
              quantity
            }
            checkItemsResult {
              hasValidItems
              invalidItemIds
              checkedItems {
                _id
                category
                type
                quality
                effect
                effectPower
                prices {
                  EUR
                }
                isInStock
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

  return new Promise((resolve, reject) => {
    const errorSubscription = observableError.subscribe(
      (value) => {
        if (value.data?.onSendCheckoutError) {
          if (value.data.onSendCheckoutError.transactionId !== transactionId) {
            const errorText = `Transaction Id mismatch (received ${value.data.onSendCheckoutError.transactionId}, expected ${transactionId})`;

            onError(errorText);
          } else {
            const checkoutError = value.data.onSendCheckoutError;
            const errorText = `A checkout error ${checkoutError.errorType} has occurred while processing transaction ${checkoutError.transactionId}`;

            onError(errorText);
          }
        } else {
          const errorText = 'Unknown error subscription value';

          onError(errorText);
        }
      },
      (error) => {
        onError(error);
      }
    );

    const checkoutApprovalSubscription = observableCheckoutApproval.subscribe(
      (value) => {
        if (value.data?.onRequestCheckoutApproval) {
          if (
            value.data.onRequestCheckoutApproval.transactionId !== transactionId
          ) {
            const errorText = `Transaction Id mismatch (received ${value.data.onRequestCheckoutApproval.transactionId}, expected ${transactionId})`;

            onError(errorText);
          } else {
            errorSubscription.unsubscribe();
            checkoutApprovalSubscription.unsubscribe();
            resolve(value.data.onRequestCheckoutApproval);
          }
        } else {
          const errorText = 'Unknown checkout approval subscription value';

          onError(errorText);
        }
      },
      (error) => {
        onError(error);
      }
    );

    const onError = (error) => {
      errorSubscription.unsubscribe();
      checkoutApprovalSubscription.unsubscribe();
      reject(error);
    };
  });
}
