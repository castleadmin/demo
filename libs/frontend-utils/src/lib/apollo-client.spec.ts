import { ApolloClient } from '@apollo/client';
import 'aws-appsync-auth-link';
import 'aws-appsync-subscription-link';
import { createApolloClient } from './apollo-client';
import { EnvironmentType } from './environment-type';
import { FrontendEnvironment } from './frontend-environment';

jest.mock('@apollo/client', () => {
  const originalModule = jest.requireActual('@apollo/client');

  const ApolloLinkMock = originalModule.ApolloLink;
  ApolloLinkMock.from = jest.fn(() => {
    return undefined;
  }) as unknown as typeof originalModule.ApolloLink.from;
  const HttpLinkMock = function () {
    return undefined;
  };

  return {
    __esModule: true,
    ...originalModule,
    ApolloLink: ApolloLinkMock,
    HttpLink: HttpLinkMock,
  };
});

jest.mock('aws-appsync-auth-link');
jest.mock('aws-appsync-subscription-link');

describe('apollo-client', () => {
  describe('createApolloClient', () => {
    it('Should create the Apollo Client', async () => {
      const environment: FrontendEnvironment = {
        type: EnvironmentType.test,
        release: 'main',
        sentryDsn: '',
        sentryTracesSampleRate: 0,

        graphqlApiKey: '123',
        graphqlUrl: 'PLACEHOLDER',

        serverSide: {},
      };

      const result = await createApolloClient(environment);

      expect(result).toBeInstanceOf(ApolloClient);
    });
  });
});
