import {
  AxeType,
  Category,
  EffectPower,
  Item,
  Quality,
} from '@castleadmin/product-domain';
import {
  AggregationCursor,
  Collection,
  Db,
  FindCursor,
  MongoClient,
} from 'mongodb';

it('mocks', () => {
  return;
});

export function createMockItem(id?: string): Item {
  return {
    _id: id ?? '63a2166dbe253e85fe0ee41a',
    category: Category.axes,
    ean: '7081229929168',
    effect: 'fog',
    effectPower: EffectPower.strong,
    halfStars: 7,
    isInStock: true,
    popularity: 0.9837485491447482,
    prices: {
      EUR: 47999,
    },
    quality: Quality.excellent,
    ratingCount: 37689,
    translations: {
      de: {
        name: 'Ausgezeichnete Axt des großen Nebels',
        description:
          'Ausgezeichnete Axt des großen Nebels ist genau auf die Bedürfnisse seiner Benutzer abgestimmt und zeichnet sich durch seine ausgezeichnete Qualität aus. Die Sicht von getroffenen Gegner wird durch einen großen Nebel beschränkt.',
        effectName: 'Nebel',
      },
      enUs: {
        name: 'Excellent Axe of greater Fog',
        description:
          'Excellent Axe of greater Fog is exactly tailored to the needs of its users. It is characterized by its excellent quality. The sight of attacked enemies is reduced by a greater fog.',
        effectName: 'Fog',
      },
    },
    type: AxeType.singleSided,
  };
}

export function createMockItems(): Item[] {
  return [
    createMockItem('a1'),
    createMockItem('a2'),
    createMockItem('a3'),
    createMockItem('a4'),
    createMockItem('a5'),
  ];
}

export function createMockMongoClient(): {
  client: jest.Mocked<MongoClient>;
  db: jest.Mocked<Db>;
  collection: jest.Mocked<Collection>;
  countDocuments: jest.MockedFunction<Collection['countDocuments']>;
  findOne: jest.MockedFunction<Collection['findOne']>;
  find: jest.MockedFunction<Collection['find']>;
  findToArray: jest.MockedFunction<FindCursor['toArray']>;
  insertOne: jest.MockedFunction<Collection['insertOne']>;
  aggregate: jest.MockedFunction<Collection['aggregate']>;
  aggregateToArray: jest.MockedFunction<AggregationCursor['toArray']>;
} {
  const findOne = jest.fn();
  const countDocuments = jest.fn();

  const findToArray = jest.fn();
  const find = jest.fn(() => ({
    toArray: findToArray,
  })) as unknown as jest.MockedFunction<Collection['find']>;

  const insertOne = jest.fn();

  const aggregateToArray = jest.fn();
  const aggregate = jest.fn(() => ({
    toArray: aggregateToArray,
  })) as unknown as jest.MockedFunction<Collection['aggregate']>;

  const collection = jest.fn(() => ({
    countDocuments,
    findOne,
    find,
    insertOne,
    aggregate,
  })) as unknown as jest.Mocked<Collection>;

  const db = jest.fn(() => ({
    collection,
  })) as unknown as jest.Mocked<Db>;

  const client = {
    db,
  } as unknown as jest.Mocked<MongoClient>;

  return {
    client,
    db,
    collection,
    countDocuments,
    findOne,
    find,
    findToArray,
    insertOne,
    aggregate,
    aggregateToArray,
  };
}
