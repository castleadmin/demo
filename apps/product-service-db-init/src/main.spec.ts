import { Collection, Db, ListCollectionsCursor, MongoClient } from 'mongodb';
import { HttpClientResponse, request } from 'urllib';
import MockedFunction = jest.MockedFunction;

jest.mock('mongodb');
jest.mock('urllib');
jest.setTimeout(30000);

function nextTick(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe('main', () => {
  it('Should execute successfully and drop an existing collection', async () => {
    (request as jest.MockedFunction<typeof request>).mockImplementation(() =>
      Promise.resolve({
        statusCode: 200,
      } as unknown as HttpClientResponse)
    );

    const dbMock = new Db(undefined as unknown as MongoClient, '');
    const collectionMock = {
      createIndex: jest.fn(() => Promise.resolve()),
      insertMany: jest.fn(() => Promise.resolve()),
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
    expect(collectionMock.createIndex).toHaveBeenCalledTimes(12 + 4);
    expect(collectionMock.insertMany).toHaveBeenCalledTimes(1);
  });

  it('Should execute successfully', async () => {
    (request as jest.MockedFunction<typeof request>).mockImplementation(() =>
      Promise.resolve({
        statusCode: 200,
      } as unknown as HttpClientResponse)
    );

    const dbMock = new Db(undefined as unknown as MongoClient, '');
    const collectionMock = {
      createIndex: jest.fn(() => Promise.resolve()),
      insertMany: jest.fn(() => Promise.resolve()),
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
    expect(collectionMock.createIndex).toHaveBeenCalledTimes(12 + 4);
    expect(collectionMock.insertMany).toHaveBeenCalledTimes(1);
  });

  it('Should throw an error if connect rejects', async () => {
    (request as jest.MockedFunction<typeof request>).mockImplementation(() =>
      Promise.resolve({
        statusCode: 200,
      } as unknown as HttpClientResponse)
    );

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

  it("Should execute successfully if the search index doesn't exist", async () => {
    let statusCodeIndex = 0;
    (request as jest.MockedFunction<typeof request>).mockImplementation(() =>
      Promise.resolve({
        statusCode: [400, 200][statusCodeIndex++],
      } as unknown as HttpClientResponse)
    );

    const dbMock = new Db(undefined as unknown as MongoClient, '');
    const collectionMock = {
      createIndex: jest.fn(() => Promise.resolve()),
      insertMany: jest.fn(() => Promise.resolve()),
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
    expect(collectionMock.createIndex).toHaveBeenCalledTimes(12 + 4);
    expect(collectionMock.insertMany).toHaveBeenCalledTimes(1);
  });

  it('Should throw an error if the search index deletion fails', async () => {
    (request as jest.MockedFunction<typeof request>).mockImplementation(() =>
      Promise.resolve({
        statusCode: 500,
      } as unknown as HttpClientResponse)
    );

    const dbMock = new Db(undefined as unknown as MongoClient, '');
    const collectionMock = {
      createIndex: jest.fn(() => Promise.resolve()),
      insertMany: jest.fn(() => Promise.resolve()),
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

    let dbInit;
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      dbInit = require('./main').dbInit;
    });
    await expect(dbInit).rejects.toBeInstanceOf(Error);
  });

  it('Should throw an error if the search index creation fails', async () => {
    let statusCodeIndex = 0;
    (request as jest.MockedFunction<typeof request>).mockImplementation(() =>
      Promise.resolve({
        statusCode: [200, 500][statusCodeIndex++],
      } as unknown as HttpClientResponse)
    );

    const dbMock = new Db(undefined as unknown as MongoClient, '');
    const collectionMock = {
      createIndex: jest.fn(() => Promise.resolve()),
      insertMany: jest.fn(() => Promise.resolve()),
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

    let dbInit;
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      dbInit = require('./main').dbInit;
    });
    await expect(dbInit).rejects.toBeInstanceOf(Error);
  });

  it('Should execute successfully if the search index creation happens after a waiting time', async () => {
    let statusCodeIndex = 0;
    (request as jest.MockedFunction<typeof request>).mockImplementation(() =>
      Promise.resolve({
        statusCode: [200, 400, 200][statusCodeIndex++],
      } as unknown as HttpClientResponse)
    );

    const dbMock = new Db(undefined as unknown as MongoClient, '');
    const collectionMock = {
      createIndex: jest.fn(() => Promise.resolve()),
      insertMany: jest.fn(() => Promise.resolve()),
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

    await new Promise((resolve) => setTimeout(resolve, (5 + 1) * 1000));

    expect(dbMock.dropCollection).toHaveBeenCalledTimes(0);
    expect(dbMock.createCollection).toHaveBeenCalledTimes(1);
    expect(collectionMock.createIndex).toHaveBeenCalledTimes(12 + 4);
    expect(collectionMock.insertMany).toHaveBeenCalledTimes(1);
  });
});
