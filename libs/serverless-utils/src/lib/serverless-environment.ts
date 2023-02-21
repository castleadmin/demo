import { EnvironmentType } from './environment-type';

export interface ServerlessEnvironment {
  type: EnvironmentType;
  release: string;
  sentryDsn: string;
  sentryTracesSampleRate: number;
}
