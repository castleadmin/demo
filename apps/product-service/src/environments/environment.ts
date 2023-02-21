import {
  EnvironmentType,
  ServerlessEnvironment,
} from '@castleadmin/serverless-utils';

export interface ProductServiceEnvironment extends ServerlessEnvironment {
  awsAccessKey: string;
  awsSecretAccessKey: string;
  awsSessionToken: string;
  mongoDbUri: string;
  dbName: string;
  productsCollectionName: string;
  searchIndexName: string;
}

export const environment: ProductServiceEnvironment = {
  type:
    (process.env['ENVIRONMENT'] as EnvironmentType) ??
    EnvironmentType.development,
  release: process.env['RELEASE'] ?? 'development',
  sentryDsn: process.env['SENTRY_DSN'] ?? '',
  sentryTracesSampleRate: Number.parseFloat(
    process.env['SENTRY_TRACES_SAMPLE_RATE'] ?? '0'
  ),
  awsAccessKey: process.env['AWS_ACCESS_KEY_ID'] ?? '',
  awsSecretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'] ?? '',
  awsSessionToken: process.env['AWS_SESSION_TOKEN'] ?? '',
  mongoDbUri: process.env['MONGODB_URI'] ?? '',
  dbName: process.env['DB_NAME'] ?? '',
  productsCollectionName: process.env['PRODUCTS_COLLECTION_NAME'] ?? '',
  searchIndexName: process.env['SEARCH_INDEX_NAME'] ?? '',
};
