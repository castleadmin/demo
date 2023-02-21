import {
  ApprovalOrder,
  Order,
  OrderItem,
  OrderRepository,
  OrderStatus,
  validateOrder,
} from '@castleadmin/checkout-domain';
import {
  createHandler,
  ErrorResponse,
  sortProperties,
} from '@castleadmin/serverless-utils';
import { Handler } from 'aws-lambda';
import 'aws4'; // Optional mongodb dependency
import { MongoClient, ObjectId } from 'mongodb';
import { OrderRepositoryImplementation } from '../app/order-repository-implementation';
import { environment } from '../environments/environment';

const client = new MongoClient(environment.mongoDbUri, {
  auth: {
    username: environment.awsAccessKey,
    password: environment.awsSecretAccessKey,
  },
  authSource: '$external',
  authMechanism: 'MONGODB-AWS',
  authMechanismProperties: {
    AWS_SESSION_TOKEN: environment.awsSessionToken,
  },
  retryWrites: true,
  writeConcern: {
    w: 'majority',
  },
});

interface CreateOrderResponse {
  transactionId: string;
  order: Order;
}

export const handler = createHandler<
  Handler<
    { transactionId: string; approvalOrder: ApprovalOrder },
    ErrorResponse | CreateOrderResponse
  >
>(environment, async (event) => {
  const transactionId = event.transactionId;
  if (!transactionId) {
    return {
      error: 'Missing transactionId parameter',
    };
  }
  const approvalOrder = event.approvalOrder;
  if (!approvalOrder) {
    return {
      error: 'Missing approvalOrder parameter',
    };
  }

  const repo: OrderRepository = new OrderRepositoryImplementation(client);

  const quantityMap = new Map<string, number>();
  approvalOrder.items.forEach((item) => {
    quantityMap.set(item.itemId, item.quantity);
  });

  const deliveryDateMap = new Map<string, string>();
  approvalOrder.shippingResult.deliveryDateItems.forEach((item) => {
    deliveryDateMap.set(item.itemId, item.deliveryDate);
  });

  let order: Order = {
    _id: new ObjectId().toString(),
    createdAt: new Date().toISOString(),
    firstName: approvalOrder.firstName,
    lastName: approvalOrder.lastName,
    emailAddress: approvalOrder.emailAddress,
    streetAddress: approvalOrder.streetAddress,
    zipCode: approvalOrder.zipCode,
    city: approvalOrder.city,
    country: approvalOrder.country,
    shippingOption: approvalOrder.shippingOption,
    shippingPrices: approvalOrder.shippingResult.shippingPrices,
    paymentMethod: approvalOrder.paymentMethod,
    language: approvalOrder.language,
    status: OrderStatus.confirmed,
    items: approvalOrder.checkItemsResult.checkedItems.map((item) => {
      let orderItem = {
        ...item,
        quantity: quantityMap.get(item._id),
        deliveryDate: deliveryDateMap.get(item._id),
      } as OrderItem;

      orderItem = sortProperties<OrderItem>(orderItem);

      return orderItem;
    }),
  };
  if (approvalOrder.businessName) {
    order.businessName = approvalOrder.businessName;
  }

  order = sortProperties<Order>(order);

  await validateOrder(order);

  await repo.createOrder(order);

  return {
    transactionId,
    order,
  };
});
