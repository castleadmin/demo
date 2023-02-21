import * as Sentry from '@sentry/nextjs';
import { environment } from './environments/environment';

Sentry.init({
  environment: environment.type,
  release: environment.release,
  dsn: environment.sentryDsn,
  tracesSampleRate: environment.sentryTracesSampleRate,
});
