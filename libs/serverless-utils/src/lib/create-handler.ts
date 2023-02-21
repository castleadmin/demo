import * as Sentry from '@sentry/serverless';
import { Handler } from 'aws-lambda';
import { ServerlessEnvironment } from './serverless-environment';

export function createHandler<T extends Handler>(
  environment: ServerlessEnvironment,
  handler: T
): T {
  Sentry.AWSLambda.init({
    environment: environment.type,
    release: environment.release,
    dsn: environment.sentryDsn,
    tracesSampleRate: environment.sentryTracesSampleRate,
  });

  return Sentry.AWSLambda.wrapHandler(handler) as T;
}
