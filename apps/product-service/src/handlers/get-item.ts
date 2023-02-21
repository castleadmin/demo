import { Item, ItemRepository } from '@castleadmin/product-domain';
import { createHandler, ErrorResponse } from '@castleadmin/serverless-utils';
import { AppSyncResolverHandler } from 'aws-lambda';
import 'aws4'; // Optional mongodb dependency
import { MongoClient } from 'mongodb';
import { ItemRepositoryImplementation } from '../app/item-repository-implementation';
import { environment } from '../environments/environment';

interface GetItemResponse {
  item: Item;
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
  AppSyncResolverHandler<{ id: string }, ErrorResponse | GetItemResponse>
>(environment, async (event) => {
  const id = event.arguments.id;
  if (!id) {
    return {
      error: 'Missing id parameter',
    };
  }

  const repo: ItemRepository = new ItemRepositoryImplementation(client);

  let item = undefined;
  try {
    item = await repo.getItem(id);
  } catch (error: unknown) {
    console.warn(error);
  }

  if (!item) {
    return {
      error: `Couldn't get item with id ${id}`,
    };
  }

  return {
    item: item,
  };
});
