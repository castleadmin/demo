import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client';
import { createApolloClient } from '@castleadmin/frontend-utils';
import { withSentry } from '@sentry/nextjs';
import { NextApiHandler } from 'next';
import { CheckoutHeartbeatRequest, CheckoutHeartbeatResponse } from '../../api';
import { environment } from '../../environments/environment';

export const checkoutHeartbeatHandler = withSentry(
  async function (req, res) {
    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    const body = req.body as CheckoutHeartbeatRequest;

    if (!body.transactionId || !body.token) {
      return res.status(400).end();
    }

    const client = await createApolloClient(environment);
    const transactionId = body.transactionId;
    const token = body.token;

    const result = await checkoutHeartbeat(client, transactionId, token);

    res.json({ transactionId: result });

    return res.status(200).end();
  } as NextApiHandler<CheckoutHeartbeatResponse | void>,
  '/api/checkout-heartbeat'
);

export async function checkoutHeartbeat(
  client: ApolloClient<NormalizedCacheObject>,
  transactionId: string,
  token: string
): Promise<string> {
  const result = await client.mutate<
    {
      checkoutHeartbeat: string;
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
      mutation checkoutHeartbeatMutation($transactionId: ID!, $token: ID!) {
        checkoutHeartbeat(transactionId: $transactionId, token: $token)
      }
    `,
  });

  const resultTransactionId = result.data?.checkoutHeartbeat;

  if (resultTransactionId !== transactionId) {
    throw new Error(
      `Transaction Id mismatch (received ${resultTransactionId}, expected ${transactionId})`
    );
  }

  return resultTransactionId;
}

export default checkoutHeartbeatHandler;
