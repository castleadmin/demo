import { EnvironmentType } from '@castleadmin/serverless-utils';
import { ProductServiceDbInitEnvironment } from './product-service-db-init-environment';

/**
 * Development environment configuration
 */
export const environment: ProductServiceDbInitEnvironment = {
  type: EnvironmentType.development,
  mongoDbUri: 'mongodb+srv://adventials.kdefifi.mongodb.net',
  mongoDbUser: process.env['MONGODB_USER'] ?? '',
  mongoDbPassword: process.env['MONGODB_PASSWORD'] ?? '',
  dbName: 'adventials',
  productsCollectionName: 'products-test',
  productsSearchIndexName: 'search-products-test',
  searchIndexApiUrl: 'PLACEHOLDER',
  searchIndexApiKey: process.env['SEARCH_INDEX_API_KEY'] ?? '',
};
