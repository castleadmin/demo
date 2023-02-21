import { EnvironmentType } from '@castleadmin/serverless-utils';

/**
 * Checkout database init script environment
 */
export interface CheckoutServiceDbInitEnvironment {
  type: EnvironmentType;
  mongoDbUri: string;
  mongoDbUser: string;
  mongoDbPassword: string;
  dbName: string;
  ordersCollectionName: string;
}
