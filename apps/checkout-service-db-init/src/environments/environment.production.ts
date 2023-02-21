import { EnvironmentType } from '@castleadmin/serverless-utils';
import { CheckoutServiceDbInitEnvironment } from './checkout-service-db-init-environment';

/**
 * Production environment configuration
 */
export const environment: CheckoutServiceDbInitEnvironment = {
  type: EnvironmentType.production,
  mongoDbUri: 'mongodb+srv://adventials.kdefifi.mongodb.net',
  mongoDbUser: process.env['MONGODB_USER'] ?? '',
  mongoDbPassword: process.env['MONGODB_PASSWORD'] ?? '',
  dbName: 'adventials',
  ordersCollectionName: 'orders-production',
};
