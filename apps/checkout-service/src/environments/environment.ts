import {
  EnvironmentType,
  ServerlessEnvironment,
} from '@castleadmin/serverless-utils';

export interface CheckoutServiceEnvironment extends ServerlessEnvironment {
  awsAccessKey: string;
  awsSecretAccessKey: string;
  awsSessionToken: string;
  graphqlEndpoint: string;
  mongoDbUri: string;
  dbName: string;
  ordersCollectionName: string;
  noReplyEmailAddress: string;
  feedbackEmailAddress: string;
  feedbackEmailArn: string;
  emailTemplateName: string;
}

export const environment: CheckoutServiceEnvironment = {
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
  graphqlEndpoint: process.env['GRAPHQL_ENDPOINT'] ?? '',
  mongoDbUri: process.env['MONGODB_URI'] ?? '',
  dbName: process.env['DB_NAME'] ?? '',
  ordersCollectionName: process.env['ORDERS_COLLECTION_NAME'] ?? '',
  noReplyEmailAddress: process.env['NO_REPLY_EMAIL_ADDRESS'] ?? '',
  feedbackEmailAddress: process.env['FEEDBACK_EMAIL_ADDRESS'] ?? '',
  feedbackEmailArn: process.env['FEEDBACK_EMAIL_ARN'] ?? '',
  emailTemplateName: process.env['EMAIL_TEMPLATE_NAME'] ?? '',
};
