import { Category, Item } from '@castleadmin/product-domain';
import { MongoClient, ObjectId } from 'mongodb';
import { request } from 'urllib';
import { createItems } from './app/items';
import { environment } from './environments/environment';
import { searchIndex } from './search-index';

type ItemDb = Omit<Item, '_id'> & { _id: ObjectId };

const client = new MongoClient(environment.mongoDbUri, {
  auth: {
    username: environment.mongoDbUser,
    password: environment.mongoDbPassword,
  },
  retryWrites: true,
  writeConcern: {
    w: 'majority',
  },
});

/**
 * Generate all items and database entities of the product database.
 */
export const dbInit = client
  .connect()
  .then(async () => {
    const db = client.db(environment.dbName);

    const hasCollection =
      (
        await db
          .listCollections({
            name: environment.productsCollectionName,
          })
          .toArray()
      ).length > 0;

    if (hasCollection) {
      console.log(`Dropping collection ${environment.productsCollectionName}`);
      await db.dropCollection(environment.productsCollectionName);
    }

    const collection = await db.createCollection<ItemDb>(
      environment.productsCollectionName,
      {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            properties: {
              _id: { bsonType: 'objectId' },
              ean: { bsonType: 'string', minLength: 13, maxLength: 13 },
              category: {
                bsonType: 'string',
                enum: [
                  'axes',
                  'hammers',
                  'spears',
                  'daggers',
                  'swords',
                  'bows',
                  'armors',
                  'helmets',
                  'shields',
                  'wands',
                  'scrolls',
                  'potions',
                ],
              },
              type: {
                bsonType: 'string',
                enum: [
                  'singleSided',
                  'doubleSided',

                  'leather',
                  'chainmail',
                  'plate',

                  'green',
                  'blue',
                  'red',
                ],
              },
              quality: {
                bsonType: 'string',
                enum: ['normal', 'improved', 'excellent'],
              },
              effect: { bsonType: 'string' },
              effectPower: {
                bsonType: 'string',
                enum: ['none', 'weak', 'average', 'strong'],
              },
              prices: {
                bsonType: 'object',
                properties: {
                  EUR: {
                    bsonType: 'int',
                    minimum: 0,
                    exclusiveMinimum: true,
                  },
                },
                additionalProperties: false,
                required: ['EUR'],
              },
              isInStock: { bsonType: 'bool' },
              popularity: {
                bsonType: 'double',
                minimum: 0,
                maximum: 1,
                exclusiveMaximum: true,
              },
              halfStars: { bsonType: 'int', minimum: 2, maximum: 10 },
              ratingCount: { bsonType: 'int', minimum: 0 },
              translations: {
                bsonType: 'object',
                properties: {
                  de: {
                    bsonType: 'object',
                    properties: {
                      name: { bsonType: 'string' },
                      description: { bsonType: 'string' },
                      effectName: { bsonType: 'string' },
                    },
                    required: ['name', 'description'],
                    additionalProperties: false,
                  },
                  enUs: {
                    bsonType: 'object',
                    properties: {
                      name: { bsonType: 'string' },
                      description: { bsonType: 'string' },
                      effectName: { bsonType: 'string' },
                    },
                    required: ['name', 'description'],
                    additionalProperties: false,
                  },
                },
                required: ['de', 'enUs'],
                additionalProperties: false,
              },
            },
            required: [
              '_id',
              'ean',
              'category',
              'quality',
              'effectPower',
              'prices',
              'isInStock',
              'popularity',
              'halfStars',
              'ratingCount',
              'translations',
            ],
            additionalProperties: false,
          },
        },
        validationLevel: 'strict',
        validationAction: 'error',
      }
    );

    await Promise.all([
      ...Object.values(Category).map((category) =>
        Promise.all([
          // category index
          collection.createIndex(
            { category: 1, _id: 1 },
            {
              name: `${category}-index`,
              partialFilterExpression: { category },
            }
          ),
        ])
      ),
      // SortOption.popularity index
      collection.createIndex(
        { popularity: -1, _id: 1 },
        {
          name: `popularity-index`,
        }
      ),
      //  SortOption.priceAscending index
      collection.createIndex(
        { 'prices.EUR': 1, _id: 1 },
        {
          name: `price-EUR-ascending-index`,
        }
      ),
      // SortOption.priceDescending index
      collection.createIndex(
        { 'prices.EUR': -1, _id: 1 },
        {
          name: `price-EUR-descending-index`,
        }
      ),
      // SortOption.review index
      collection.createIndex(
        { halfStars: -1, ratingCount: -1, _id: 1 },
        {
          name: `review-index`,
        }
      ),
    ]);

    // delete search index
    const resultDeleteSearchIndex = await request(
      `${environment.searchIndexApiUrl}/${environment.productsSearchIndexName}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        digestAuth: environment.searchIndexApiKey,
        method: 'DELETE',
      }
    );

    // statusCode 400 search index doesn't exist
    if (
      resultDeleteSearchIndex.statusCode !== 200 &&
      resultDeleteSearchIndex.statusCode !== 400
    ) {
      throw new Error(
        `Search index deletion failed ${JSON.stringify(
          resultDeleteSearchIndex,
          null,
          2
        )} ${resultDeleteSearchIndex.data.toString()}`
      );
    }

    // create search index
    let isSearchIndexCreated = false;

    while (!isSearchIndexCreated) {
      const resultCreateSearchIndex = await request(
        environment.searchIndexApiUrl,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          digestAuth: environment.searchIndexApiKey,
          method: 'POST',
          data: {
            collectionName: environment.productsCollectionName,
            database: environment.dbName,
            name: environment.productsSearchIndexName,
            ...searchIndex,
          },
        }
      );

      if (resultCreateSearchIndex.statusCode === 200) {
        isSearchIndexCreated = true;
      } else if (resultCreateSearchIndex.statusCode === 400) {
        // Deleted index still exists
        console.log('Waiting for search index creation');
        // wait for 5 seconds
        await new Promise((resolve) => setTimeout(resolve, 5 * 1000));
      } else {
        throw new Error(
          `Search index creation failed ${JSON.stringify(
            resultCreateSearchIndex,
            null,
            2
          )} ${resultCreateSearchIndex.data.toString()}`
        );
      }
    }

    const items = createItems().map((item) => {
      const itemDb = item as unknown as ItemDb;

      itemDb._id = new ObjectId(item._id);

      return itemDb;
    });
    console.log(`Inserting ${items.length} items into the collection...`);
    await collection.insertMany(items);
    console.log('Inserting done');

    await client.close();
  })
  .catch((error: unknown) => {
    throw error;
  });
