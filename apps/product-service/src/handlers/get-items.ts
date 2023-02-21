import {
  Category,
  EffectPower,
  Item,
  ItemRepository,
  Quality,
  SortOption,
} from '@castleadmin/product-domain';
import { createHandler, ErrorResponse } from '@castleadmin/serverless-utils';
import { AppSyncResolverHandler } from 'aws-lambda';
import 'aws4'; // Optional mongodb dependency
import { MongoClient } from 'mongodb';
import { ItemRepositoryImplementation } from '../app/item-repository-implementation';
import { environment } from '../environments/environment';

interface GetItemsResponse {
  items: Item[];
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
      skip: number;
      limit: number;
      options?: {
        category?: Category;
        sort?: SortOption;
        qualities?: Quality[];
        powers?: EffectPower[];
      };
    },
    ErrorResponse | GetItemsResponse
  >
>(environment, async (event) => {
  const skip = event.arguments.skip;
  if (skip === null || skip === undefined) {
    return {
      error: 'Missing skip parameter',
    };
  }
  if (skip < 0) {
    return {
      error: `Invalid skip parameter - ${skip}`,
    };
  }
  const limit = event.arguments.limit;
  if (limit === null || limit === undefined) {
    return {
      error: 'Missing limit parameter',
    };
  }
  if (limit <= 0 || limit > 32) {
    return {
      error: `Invalid limit parameter - ${limit}`,
    };
  }
  const options = event.arguments.options;

  const repo: ItemRepository = new ItemRepositoryImplementation(client);

  let items = undefined;
  try {
    items = await repo.getItems(skip, limit, options);
  } catch (error: unknown) {
    console.warn(error);
  }

  if (!items) {
    return {
      error: `Couldn't get items (skip ${skip}, limit ${limit}, options ${JSON.stringify(
        options,
        null,
        2
      )})`,
    };
  }

  return {
    items,
  };
});
