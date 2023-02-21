import {
  Category,
  EffectPower,
  ItemRepository,
  Quality,
} from '@castleadmin/product-domain';
import { createHandler, ErrorResponse } from '@castleadmin/serverless-utils';
import { AppSyncResolverHandler } from 'aws-lambda';
import 'aws4'; // Optional mongodb dependency
import { MongoClient } from 'mongodb';
import { ItemRepositoryImplementation } from '../app/item-repository-implementation';
import { environment } from '../environments/environment';

interface CountSearchItemsResponse {
  count: number;
}

const client = new MongoClient(environment.mongoDbUri, {
  auth: {
    username: environment.awsAccessKey,
    password: environment.awsSecretAccessKey,
  },
  authSource: '$external',
  authMechanism: 'MONGODB-AWS',
  authMechanismProperties: {
    AWS_SESSION_TOKEN: environment.awsSessionToken,
  },
  retryWrites: true,
  writeConcern: {
    w: 'majority',
  },
});

export const handler = createHandler<
  AppSyncResolverHandler<
    {
      searchText: string;
      locale: string;
      options?: {
        category?: Category;
        qualities?: Quality[];
        powers?: EffectPower[];
      };
    },
    ErrorResponse | CountSearchItemsResponse
  >
>(environment, async (event) => {
  const searchText = event.arguments.searchText;
  if (!searchText) {
    return {
      error: 'Missing searchText parameter',
    };
  }
  const locale = event.arguments.locale;
  if (!locale) {
    return {
      error: 'Missing locale parameter',
    };
  }
  const options = event.arguments.options;

  const repo: ItemRepository = new ItemRepositoryImplementation(client);

  let count = undefined;
  try {
    count = await repo.countSearchItems(searchText, locale, options);
  } catch (error: unknown) {
    console.warn(error);
  }

  if (count === undefined || !Number.isInteger(count)) {
    return {
      error: `Couldn't count search items (searchText ${searchText}, locale ${locale}, options ${JSON.stringify(
        options,
        null,
        2
      )})`,
    };
  }

  return {
    count,
  };
});
