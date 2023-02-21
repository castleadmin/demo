import 'mongodb';
import { Collection, Db, ListCollectionsCursor, MongoClient } from 'mongodb';
import MockedFunction = jest.MockedFunction;

jest.mock('mongodb');
jest.setTimeout(15000);

function nextTick(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe('main', () => {
  it('Should execute successfully and drop an existing collection', async () => {
    const dbMock = new Db(undefined as unknown as MongoClient, '');
    const collectionMock = {
      createIndex: jest.fn(() => Promise.resolve()),
    } as unknown as Collection;

    (
      dbMock.listCollections as MockedFunction<
        typeof Db.prototype.listCollections
      >
    ).mockImplementationOnce(
      () =>
        ({
          toArray: jest.fn(() => ['abc']),
        } as unknown as ListCollectionsCursor)
    );
    (
      dbMock.createCollection as MockedFunction<
        typeof Db.prototype.createCollection
      >
    ).mockImplementationOnce(() => collectionMock);

    (
      MongoClient.prototype.connect as MockedFunction<
        typeof MongoClient.prototype.connect
      >
    ).mockImplementationOnce(() => Promise.resolve());
    (
      MongoClient.prototype.db as MockedFunction<
        typeof MongoClient.prototype.db
      >
    ).mockImplementationOnce(() => dbMock);

    jest.isolateModules(() => {
      require('./main');
    });

    await nextTick();

    expect(dbMock.dropCollection).toHaveBeenCalledTimes(1);
    expect(dbMock.createCollection).toHaveBeenCalledTimes(1);
    expect(collectionMock.createIndex).toHaveBeenCalledTimes(1);
  });

  it('Should execute successfully', async () => {
    const dbMock = new Db(undefined as unknown as MongoClient, '');
    const collectionMock = {
      createIndex: jest.fn(() => Promise.resolve()),
    } as unknown as Collection;

    (
      dbMock.listCollections as MockedFunction<
        typeof Db.prototype.listCollections
      >
    ).mockImplementationOnce(
      () =>
        ({
          toArray: jest.fn(() => []),
        } as unknown as ListCollectionsCursor)
    );
    (
      dbMock.createCollection as MockedFunction<
        typeof Db.prototype.createCollection
      >
    ).mockImplementationOnce(() => collectionMock);

    (
      MongoClient.prototype.connect as MockedFunction<
        typeof MongoClient.prototype.connect
      >
    ).mockImplementationOnce(() => Promise.resolve());
    (
      MongoClient.prototype.db as MockedFunction<
        typeof MongoClient.prototype.db
      >
    ).mockImplementationOnce(() => dbMock);

    jest.isolateModules(() => {
      require('./main');
    });

    await nextTick();

    expect(dbMock.dropCollection).toHaveBeenCalledTimes(0);
    expect(dbMock.createCollection).toHaveBeenCalledTimes(1);
    expect(collectionMock.createIndex).toHaveBeenCalledTimes(1);
  });

  it('Should throw an error', async () => {
    (
      MongoClient.prototype.connect as MockedFunction<
        typeof MongoClient.prototype.connect
      >
    ).mockImplementationOnce(() => Promise.reject(new Error()));

    let dbInit;
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      dbInit = require('./main').dbInit;
    });
    await expect(dbInit).rejects.toBeInstanceOf(Error);
  });
});
