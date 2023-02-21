import { EnvironmentType } from '@castleadmin/serverless-utils';

/**
 * Product database init script environment
 */
export interface ProductServiceDbInitEnvironment {
  type: EnvironmentType;
  mongoDbUri: string;
  mongoDbUser: string;
  mongoDbPassword: string;
  dbName: string;
  productsCollectionName: string;
  productsSearchIndexName: string;
  searchIndexApiUrl: string;
  searchIndexApiKey: string;
}
