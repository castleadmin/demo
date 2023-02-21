import { CreateOrder, validateCreateOrder } from '@castleadmin/checkout-domain';
import { createHandler } from '@castleadmin/serverless-utils';
import { Handler } from 'aws-lambda';
import { environment } from '../environments/environment';

export const handler = createHandler<
  Handler<{ createOrder: CreateOrder }, boolean>
>(environment, async (event) => {
  const createOrder = event.createOrder;
  if (!createOrder) {
    console.warn('Missing createOrder parameter');
    return false;
  }

  try {
    await validateCreateOrder(createOrder);
    return true;
  } catch (error: unknown) {
    console.warn(error);
  }

  return false;
});
