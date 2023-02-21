import { Order } from './order';

/**
 * The order repository is used to retrieve and store orders.
 * DDD <<Repository>>
 */
export interface OrderRepository {
  /**
   * Create an order inside the persistent storage.
   */
  createOrder(order: Order): Promise<string>;
}
