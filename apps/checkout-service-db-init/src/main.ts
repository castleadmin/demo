import { MongoClient } from 'mongodb';
import { environment } from './environments/environment';

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
 * Generate all database entities of the checkout database.
 */
export const dbInit = client
  .connect()
  .then(async () => {
    const db = client.db(environment.dbName);

    const hasCollection =
      (
        await db
          .listCollections({
            name: environment.ordersCollectionName,
          })
          .toArray()
      ).length > 0;

    if (hasCollection) {
      console.log(`Dropping collection ${environment.ordersCollectionName}`);
      await db.dropCollection(environment.ordersCollectionName);
    }

    const collection = await db.createCollection(
      environment.ordersCollectionName,
      {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            properties: {
              _id: { bsonType: 'objectId' },
              createdAt: { bsonType: 'date' },
              firstName: { bsonType: 'string' },
              lastName: { bsonType: 'string' },
              businessName: { bsonType: 'string' },
              emailAddress: { bsonType: 'string' },
              streetAddress: { bsonType: 'string' },
              zipCode: { bsonType: 'string' },
              city: { bsonType: 'string' },
              country: {
                bsonType: 'string',
                enum: [
                  'Austria',
                  'Belgium',
                  'Bulgaria',
                  'Canada',
                  'Croatia',
                  'Cyprus',
                  'Czech Republic',
                  'Denmark',
                  'Estonia',
                  'Finland',
                  'France',
                  'Germany',
                  'Greece',
                  'Hungary',
                  'Ireland',
                  'Italy',
                  'Japan',
                  'Latvia',
                  'Lithuania',
                  'Luxembourg',
                  'Malta',
                  'Netherlands',
                  'Poland',
                  'Portugal',
                  'Romania',
                  'Slovakia',
                  'Slovenia',
                  'Spain',
                  'Sweden',
                  'United Kingdom',
                  'United States',
                ],
              },
              shippingOption: {
                bsonType: 'string',
                enum: ['standard', 'express'],
              },
              shippingPrices: {
                bsonType: 'object',
                properties: {
                  EUR: {
                    bsonType: 'int',
                    minimum: 0,
                  },
                },
                additionalProperties: false,
                required: ['EUR'],
              },
              paymentMethod: {
                bsonType: 'string',
                enum: ['playMoney', 'sweets', 'greetingCards'],
              },
              language: {
                bsonType: 'string',
                enum: ['de', 'en-US'],
              },
              status: {
                bsonType: 'string',
                enum: ['confirmed'],
              },
              items: {
                bsonType: 'array',
                minItems: 1,
                items: {
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
                    quantity: {
                      bsonType: 'int',
                      minimum: 0,
                      exclusiveMinimum: true,
                      maximum: 20,
                    },
                    deliveryDate: { bsonType: 'date' },
                  },
                  additionalProperties: false,
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
                    'quantity',
                    'deliveryDate',
                  ],
                },
              },
            },
            additionalProperties: false,
            required: [
              '_id',
              'createdAt',
              'firstName',
              'lastName',
              'emailAddress',
              'streetAddress',
              'zipCode',
              'city',
              'country',
              'shippingOption',
              'shippingPrices',
              'paymentMethod',
              'language',
              'status',
              'items',
            ],
          },
        },
        validationLevel: 'strict',
        validationAction: 'error',
      }
    );

    const days90 = 60 * 60 * 24 * 90;
    await collection.createIndex(
      { createdAt: 1 },
      {
        name: 'ttl-index',
        expireAfterSeconds: days90,
      }
    );

    await client.close();
  })
  .catch((error: unknown) => {
    throw error;
  });
