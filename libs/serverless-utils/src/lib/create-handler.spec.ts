import * as Sentry from '@sentry/serverless';
import { createHandler } from './create-handler';
import { EnvironmentType } from './environment-type';
import MockedFunction = jest.MockedFunction;

jest.mock('@sentry/serverless');

describe('createHandler', () => {
  it('Should setup sentry', () => {
    (
      Sentry.AWSLambda.wrapHandler as MockedFunction<
        typeof Sentry.AWSLambda.wrapHandler
      >
    ).mockImplementationOnce((handler) => handler);

    const handler = createHandler(
      {
        type: EnvironmentType.test,
        release: 'v0.1',
        sentryDsn: 'someDSN',
        sentryTracesSampleRate: 0.5,
      },
      async () => Promise.resolve('it works!')
    );
    expect(handler()).resolves.toBe('it works!');
    expect(
      Sentry.AWSLambda.init as MockedFunction<typeof Sentry.AWSLambda.init>
    ).toHaveBeenCalledWith({
      environment: EnvironmentType.test,
      release: 'v0.1',
      dsn: 'someDSN',
      tracesSampleRate: 0.5,
    });
  });
});
