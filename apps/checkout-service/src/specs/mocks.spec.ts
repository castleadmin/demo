import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import {
  ApprovalOrder,
  Country,
  CreateOrder,
  Language,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  ShippingOption,
} from '@castleadmin/checkout-domain';
import {
  AxeType,
  Category,
  EffectPower,
  Item,
  Quality,
} from '@castleadmin/product-domain';
import { createApolloClient } from '@castleadmin/serverless-utils';
import { Collection, Db, FindCursor, MongoClient, ObjectId } from 'mongodb';

it('mocks', () => {
  return;
});

export type OrderDb = Omit<Order, '_id' | 'createdAt' | 'items'> & {
  _id: ObjectId;
  createdAt: Date;
  items: OrderItemDb[];
};

export type OrderItemDb = Omit<OrderItem, '_id' | 'deliveryDate'> & {
  _id: ObjectId;
  deliveryDate: Date;
};

export function createMockItem(id: string): Item {
  return {
    _id: id,
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

export function createMockCreateOrder(): CreateOrder {
  return {
    firstName: 'Max',
    lastName: 'Mustermann',
    emailAddress: 'test@abc.com',
    businessName: 'testit',
    streetAddress: 'Am Kornfeld 30',
    zipCode: '23456',
    city: 'Neuhausen',
    country: Country.Germany,
    paymentMethod: PaymentMethod.sweets,
    shippingOption: ShippingOption.express,
    language: Language.enUs,
    items: [
      {
        itemId: '63b81f946b43c3ac6414be11',
        quantity: 1,
      },
      {
        itemId: '63b81f946b43c3ac6414be12',
        quantity: 2,
      },
      {
        itemId: '63b81f946b43c3ac6414be13',
        quantity: 3,
      },
    ],
  };
}

export function createMockApprovalOrder(): ApprovalOrder {
  const mockItem3 = createMockItem('63b81f946b43c3ac6414be13');
  mockItem3.isInStock = false;

  return {
    ...createMockCreateOrder(),
    validationResult: {
      isValid: true,
    },
    checkItemsResult: {
      invalidItemIds: [],
      hasValidItems: true,
      checkedItems: [
        createMockItem('63b81f946b43c3ac6414be11'),
        createMockItem('63b81f946b43c3ac6414be12'),
        mockItem3,
      ],
    },
    shippingResult: {
      shippingPrices: {
        EUR: 600,
      },
      deliveryDateItems: [
        {
          itemId: '63b81f946b43c3ac6414be11',
          deliveryDate: '2023-01-05T12:00:00.000Z',
        },
        {
          itemId: '63b81f946b43c3ac6414be12',
          deliveryDate: '2023-01-05T12:00:00.000Z',
        },
        {
          itemId: '63b81f946b43c3ac6414be13',
          deliveryDate: '2023-01-06T12:00:00.000Z',
        },
      ],
    },
  };
}

export function createMockOrder(id: string): Order {
  const mockItem1 = createMockItem('63b81f946b43c3ac6414be11') as OrderItem;
  mockItem1.quantity = 1;
  mockItem1.deliveryDate = '2023-01-05T12:00:00.000Z';
  const mockItem2 = createMockItem('63b81f946b43c3ac6414be12') as OrderItem;
  mockItem2.quantity = 2;
  mockItem2.deliveryDate = '2023-01-05T12:00:00.000Z';
  const mockItem3 = createMockItem('63b81f946b43c3ac6414be13') as OrderItem;
  mockItem3.isInStock = false;
  mockItem3.quantity = 3;
  mockItem3.deliveryDate = '2023-01-06T12:00:00.000Z';

  return {
    _id: id,
    firstName: 'Max',
    lastName: 'Mustermann',
    emailAddress: 'test@abc.com',
    businessName: 'testit',
    streetAddress: 'Am Kornfeld 30',
    zipCode: '23456',
    city: 'Neuhausen',
    country: Country.Germany,
    createdAt: '2023-01-06T12:00:00.000Z',
    paymentMethod: PaymentMethod.sweets,
    shippingOption: ShippingOption.express,
    shippingPrices: {
      EUR: 600,
    },
    status: OrderStatus.confirmed,
    language: Language.enUs,
    items: [mockItem1, mockItem2, mockItem3],
  };
}

export function createMockOrderDb(id: string): OrderDb {
  const mockItem1 = createMockItem(
    '63b81f946b43c3ac6414be11'
  ) as unknown as OrderItemDb;
  mockItem1._id = new ObjectId(mockItem1._id);
  mockItem1.quantity = 1;
  mockItem1.deliveryDate = new Date('2023-01-05T12:00:00.000Z');
  const mockItem2 = createMockItem(
    '63b81f946b43c3ac6414be12'
  ) as unknown as OrderItemDb;
  mockItem2._id = new ObjectId(mockItem2._id);
  mockItem2.quantity = 2;
  mockItem2.deliveryDate = new Date('2023-01-05T12:00:00.000Z');
  const mockItem3 = createMockItem(
    '63b81f946b43c3ac6414be13'
  ) as unknown as OrderItemDb;
  mockItem3.isInStock = false;
  mockItem3._id = new ObjectId(mockItem3._id);
  mockItem3.quantity = 3;
  mockItem3.deliveryDate = new Date('2023-01-06T12:00:00.000Z');

  return {
    _id: new ObjectId(id),
    firstName: 'Max',
    lastName: 'Mustermann',
    emailAddress: 'test@abc.com',
    businessName: 'testit',
    streetAddress: 'Am Kornfeld 30',
    zipCode: '23456',
    city: 'Neuhausen',
    country: Country.Germany,
    createdAt: new Date('2023-01-06T12:00:00.000Z'),
    paymentMethod: PaymentMethod.sweets,
    shippingOption: ShippingOption.express,
    shippingPrices: {
      EUR: 600,
    },
    status: OrderStatus.confirmed,
    language: Language.enUs,
    items: [mockItem1, mockItem2, mockItem3],
  };
}

export function createMockMongoClient(): {
  client: jest.Mocked<MongoClient>;
  db: jest.Mocked<Db>;
  collection: jest.Mocked<Collection>;
  findOne: jest.MockedFunction<Collection['findOne']>;
  countDocuments: jest.MockedFunction<Collection['countDocuments']>;
  find: jest.MockedFunction<Collection['find']>;
  findToArray: jest.MockedFunction<FindCursor['toArray']>;
  insertOne: jest.MockedFunction<Collection['insertOne']>;
} {
  const findOne = jest.fn();
  const countDocuments = jest.fn();

  const findToArray = jest.fn();
  const find = jest.fn(() => ({
    toArray: findToArray,
  })) as unknown as jest.MockedFunction<Collection['find']>;

  const insertOne = jest.fn();

  const collection = jest.fn(() => ({
    findOne,
    countDocuments,
    find,
    insertOne,
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
    findOne,
    countDocuments,
    find,
    findToArray,
    insertOne,
  };
}

export function mockApolloClient(): {
  createApolloClientMock: jest.MockedFunction<typeof createApolloClient>;
  mutate: jest.MockedFunction<ApolloClient<NormalizedCacheObject>['mutate']>;
} {
  const mutate = jest.fn();

  const apolloClientMock = {
    mutate,
  } as unknown as ApolloClient<NormalizedCacheObject>;

  const createApolloClientMock = jest.fn(
    () => apolloClientMock
  ) as unknown as jest.MockedFunction<typeof createApolloClient>;

  return { createApolloClientMock, mutate };
}
