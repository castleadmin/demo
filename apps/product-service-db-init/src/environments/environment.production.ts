import { EnvironmentType } from '@castleadmin/serverless-utils';
import { ProductServiceDbInitEnvironment } from './product-service-db-init-environment';

/**
 * Production environment configuration
 */
export const environment: ProductServiceDbInitEnvironment = {
  type: EnvironmentType.production,
  mongoDbUri: 'mongodb+srv://adventials.kdefifi.mongodb.net',
  mongoDbUser: process.env['MONGODB_USER'] ?? '',
  mongoDbPassword: process.env['MONGODB_PASSWORD'] ?? '',
  dbName: 'adventials',
  productsCollectionName: 'products-production',
  productsSearchIndexName: 'search-products-production',
  searchIndexApiUrl: 'PLACEHOLDER',
  searchIndexApiKey: process.env['SEARCH_INDEX_API_KEY'] ?? '',
};
