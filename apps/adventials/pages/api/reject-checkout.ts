import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client';
import { createApolloClient } from '@castleadmin/frontend-utils';
import { withSentry } from '@sentry/nextjs';
import { NextApiHandler } from 'next';
import { RejectCheckoutRequest, RejectCheckoutResponse } from '../../api';
import { environment } from '../../environments/environment';

export const rejectCheckoutHandler = withSentry(
  async function (req, res) {
    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    const body = req.body as RejectCheckoutRequest;

    if (!body.transactionId || !body.token) {
      return res.status(400).end();
    }

    const client = await createApolloClient(environment);
    const transactionId = body.transactionId;
    const token = body.token;

    const result = await rejectCheckout(client, transactionId, token);

    res.json({ transactionId: result });

    return res.status(200).end();
  } as NextApiHandler<RejectCheckoutResponse | void>,
  '/api/reject-checkout'
);

export async function rejectCheckout(
  client: ApolloClient<NormalizedCacheObject>,
  transactionId: string,
  token: string
): Promise<string> {
  const result = await client.mutate<
    {
      rejectCheckout: string;
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
      mutation rejectCheckoutMutation($transactionId: ID!, $token: ID!) {
        rejectCheckout(transactionId: $transactionId, token: $token)
      }
    `,
  });

  const resultTransactionId = result.data?.rejectCheckout;

  if (resultTransactionId !== transactionId) {
    throw new Error(
      `Transaction Id mismatch (received ${resultTransactionId}, expected ${transactionId})`
    );
  }

  return resultTransactionId;
}

export default rejectCheckoutHandler;
