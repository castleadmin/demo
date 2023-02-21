import { Item, ItemRepository } from '@castleadmin/product-domain';
import { createHandler, ErrorResponse } from '@castleadmin/serverless-utils';
import { Handler } from 'aws-lambda';
import 'aws4'; // Optional mongodb dependency
import { MongoClient } from 'mongodb';
import { ItemRepositoryImplementation } from '../app/item-repository-implementation';
import { environment } from '../environments/environment';

interface GetItemsByIdResponse {
  hasValidItems: boolean;
  invalidIds: string[];
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
  Handler<{ ids: string[] }, ErrorResponse | GetItemsByIdResponse>
>(environment, async (event) => {
  const ids = event.ids;
  if (!ids) {
    return {
      error: 'Missing ids parameter',
    };
  }
  if (ids.length === 0) {
    return {
      error: 'At least one id is required',
    };
  }

  const repo: ItemRepository = new ItemRepositoryImplementation(client);

  let hasValidItems = undefined;
  let invalidIds = undefined;
  let items = undefined;
  try {
    const result = await repo.getItemsById(ids);
    hasValidItems = result.hasValidItems;
    invalidIds = result.invalidIds;
    items = result.items;
  } catch (error: unknown) {
    console.warn(error);
  }

  if (
    hasValidItems === undefined ||
    hasValidItems === null ||
    !invalidIds ||
    !items
  ) {
    return {
      error: `Couldn't get items by id ${ids}`,
    };
  }

  return {
    hasValidItems,
    invalidIds,
    items,
  };
});
