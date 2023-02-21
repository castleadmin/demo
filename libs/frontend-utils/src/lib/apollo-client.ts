import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { AuthOptions } from 'aws-appsync-auth-link';
import './fetch-polyfill';
import { FrontendEnvironment } from './frontend-environment';
import './web-socket-polyfill';

export async function createApolloClient(
  environment: FrontendEnvironment
): Promise<ApolloClient<NormalizedCacheObject>> {
  const { ApolloLink, HttpLink, InMemoryCache } = await import(
    '@apollo/client'
  );
  const { RetryLink } = await import('@apollo/client/link/retry');
  const { createAuthLink } = await import('aws-appsync-auth-link');
  const { createSubscriptionHandshakeLink } = await import(
    'aws-appsync-subscription-link'
  );

  const url = environment.graphqlUrl;
  const region = 'eu-central-1';

  const auth = {
    type: 'API_KEY',
    apiKey: environment.graphqlApiKey,
  } as AuthOptions;

  const httpLink = new HttpLink({
    uri: url,
    fetchOptions: {
      mode: 'cors',
    },
  });

  const retryLink = new RetryLink({
    attempts: {
      max: 4,
    },
  });

  const link = ApolloLink.from([
    retryLink,
    createAuthLink({ url, region, auth }),
    createSubscriptionHandshakeLink({ url, region, auth }, httpLink),
  ]);

  const client = new ApolloClient({
    ssrMode: true,
    link,
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'none',
      },
      mutate: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'none',
      },
      watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'none',
      },
    },
  });

  return client;
}
