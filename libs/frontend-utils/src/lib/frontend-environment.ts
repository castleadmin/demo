import { EnvironmentType } from './environment-type';

export interface FrontendEnvironment {
  type: EnvironmentType;
  release: string;
  sentryDsn: string;
  sentryTracesSampleRate: number;

  graphqlApiKey: string;
  graphqlUrl: string;

  /**
   * Server-side options
   */
  serverSide?: object;
}
