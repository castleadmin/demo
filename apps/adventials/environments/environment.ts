import {
  EnvironmentType,
  FrontendEnvironment,
} from '@castleadmin/frontend-utils';

const adventialsEnvironment: FrontendEnvironment = {
  type:
    (process.env['NEXT_PUBLIC_ENVIRONMENT'] as EnvironmentType) ??
    EnvironmentType.development,
  release: process.env['NEXT_PUBLIC_RELEASE'] ?? 'development',
  sentryDsn: process.env['NEXT_PUBLIC_SENTRY_DSN'] ?? '',
  sentryTracesSampleRate: Number.parseFloat(
    process.env['NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE'] ?? '0'
  ),

  graphqlApiKey: process.env['NEXT_PUBLIC_ADVENTIALS_APPSYNC_API_KEY'] ?? '',
  graphqlUrl: process.env['NEXT_PUBLIC_GRAPHQL_URL'] ?? '',
};

if (typeof window === 'undefined') {
  /**
   * Server-side options
   */
  adventialsEnvironment.serverSide = {};
}

export const environment: FrontendEnvironment = adventialsEnvironment;
