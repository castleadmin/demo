import { EnvironmentType } from '@castleadmin/serverless-utils';
import { CheckoutServiceDbInitEnvironment } from './checkout-service-db-init-environment';

/**
 * Development environment configuration
 */
export const environment: CheckoutServiceDbInitEnvironment = {
  type: EnvironmentType.development,
  mongoDbUri: 'mongodb+srv://adventials.kdefifi.mongodb.net',
  mongoDbUser: process.env['MONGODB_USER'] ?? '',
  mongoDbPassword: process.env['MONGODB_PASSWORD'] ?? '',
  dbName: 'adventials',
  ordersCollectionName: 'orders-test',
};
