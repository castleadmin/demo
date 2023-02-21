import {
  Order,
  OrderItem,
  OrderRepository,
} from '@castleadmin/checkout-domain';
import { MongoClient, ObjectId } from 'mongodb';
import { environment } from '../environments/environment';

type OrderDb = Omit<Order, '_id' | 'createdAt' | 'items'> & {
  _id: ObjectId;
  createdAt: Date;
  items: OrderItemDb[];
};
type OrderItemDb = Omit<OrderItem, '_id' | 'deliveryDate'> & {
  _id: ObjectId;
  deliveryDate: Date;
};

export class OrderRepositoryImplementation implements OrderRepository {
  constructor(private client: MongoClient) {}

  async createOrder(order: Order): Promise<string> {
    const database = this.client.db(environment.dbName);
    const collection = database.collection<OrderDb>(
      environment.ordersCollectionName
    );

    const orderDb = structuredClone(order) as unknown as OrderDb;
    orderDb._id = new ObjectId(order._id);
    orderDb.createdAt = new Date(order.createdAt);
    orderDb.items.forEach((item) => {
      item._id = new ObjectId(item._id);
      item.deliveryDate = new Date(item.deliveryDate);
    });
    const result = await collection.insertOne(orderDb);
    if (
      !result.insertedId ||
      result.insertedId.toString() !== orderDb._id.toString()
    ) {
      throw Error(`Couldn't insert order with id ${orderDb._id.toString()}`);
    }

    const resultId = result.insertedId.toString();

    return resultId;
  }
}
