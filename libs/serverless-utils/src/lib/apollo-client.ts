import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { RetryLink } from '@apollo/client/link/retry';
import { AuthOptions, createAuthLink } from 'aws-appsync-auth-link';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
import './fetch-polyfill';

export function createApolloClient(
  graphqlUrl: string,
  accessKeyId: string,
  secretAccessKey: string,
  sessionToken: string
): ApolloClient<NormalizedCacheObject> {
  const region = 'eu-central-1';

  const auth = {
    type: 'AWS_IAM',
    credentials: {
      accessKeyId,
      secretAccessKey,
      sessionToken,
    },
  } as AuthOptions;

  const httpLink = new HttpLink({
    uri: graphqlUrl,
  });

  const retryLink = new RetryLink({
    attempts: {
      max: 4,
    },
  });

  const link = ApolloLink.from([
    retryLink,
    createAuthLink({ url: graphqlUrl, region, auth }),
    createSubscriptionHandshakeLink(
      { url: graphqlUrl, region, auth },
      httpLink
    ),
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
