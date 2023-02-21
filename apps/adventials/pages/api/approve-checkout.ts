import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client';
import { createApolloClient } from '@castleadmin/frontend-utils';
import { withSentry } from '@sentry/nextjs';
import { NextApiHandler } from 'next';
import { ApproveCheckoutRequest, ApproveCheckoutResponse } from '../../api';
import { environment } from '../../environments/environment';

export const approveCheckoutHandler = withSentry(
  async function (req, res) {
    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    const body = req.body as ApproveCheckoutRequest;

    if (!body.transactionId || !body.token) {
      return res.status(400).end();
    }

    const client = await createApolloClient(environment);
    const transactionId = body.transactionId;
    const token = body.token;

    const result = await approveCheckout(client, transactionId, token);

    res.json({ transactionId: result });

    return res.status(200).end();
  } as NextApiHandler<ApproveCheckoutResponse | void>,
  '/api/approve-checkout'
);

export async function approveCheckout(
  client: ApolloClient<NormalizedCacheObject>,
  transactionId: string,
  token: string
): Promise<string> {
  const result = await client.mutate<
    {
      approveCheckout: string;
    },
    {
      transactionId: string;
      token: string;
    }
  >({
    variables: {
      transactionId,
      token,
    },
    mutation: gql`
      mutation approveCheckoutMutation($transactionId: ID!, $token: ID!) {
        approveCheckout(transactionId: $transactionId, token: $token)
      }
    `,
  });

  const resultTransactionId = result.data?.approveCheckout;

  if (resultTransactionId !== transactionId) {
    throw new Error(
      `Transaction Id mismatch (received ${resultTransactionId}, expected ${transactionId})`
    );
  }

  return resultTransactionId;
}

export default approveCheckoutHandler;
