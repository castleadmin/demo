import { withSentry } from '@sentry/nextjs';
import { NextApiHandler } from 'next';
import { CheckoutRequest, CheckoutResponse } from '../../api';
import { requestCheckout } from '../../checkout-request';

export const checkoutHandler = withSentry(
  async function (req, res) {
    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    const body = req.body as CheckoutRequest;

    if (!body.transactionId || !body.createOrder) {
      return res.status(400).end();
    }

    const result = await requestCheckout(body.transactionId, body.createOrder);

    res.json(result);

    return res.status(200).end();
  } as NextApiHandler<CheckoutResponse | void>,
  '/api/checkout'
);

export default checkoutHandler;
