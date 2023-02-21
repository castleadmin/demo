import {
  ApolloClient,
  FetchResult,
  NormalizedCacheObject,
  Observable,
} from '@apollo/client';
import {
  ApprovalOrder,
  Country,
  CreateOrder,
  Language,
  PaymentMethod,
  ShippingOption,
} from '@castleadmin/checkout-domain';
import { createApolloClient } from '@castleadmin/frontend-utils';
import {
  AxeType,
  Category,
  EffectPower,
  Item,
  Quality,
} from '@castleadmin/product-domain';
import { NextApiResponse } from 'next';
import * as Router from 'next/router';
import { CheckoutFormData } from '../checkout';
import { SearchResultItem } from '../item';
import MockedFunction = jest.MockedFunction;

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

export function createMockSearchResultItem(): SearchResultItem {
  return {
    _id: '63a2166dbe253e85fe0ee41a',
    category: Category.axes,
    effect: 'fog',
    effectPower: EffectPower.strong,
    halfStars: 7,
    isInStock: true,
    prices: {
      EUR: 47999,
    },
    quality: Quality.excellent,
    ratingCount: 37689,
    translations: {
      enUs: {
        name: 'Excellent Axe of greater Fog',
      },
    },
    type: AxeType.singleSided,
  };
}

export function createMockCheckoutFormData(): CheckoutFormData {
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
  };
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
        itemId: 'a1',
        quantity: 1,
      },
      {
        itemId: 'a2',
        quantity: 2,
      },
      {
        itemId: 'a3',
        quantity: 3,
      },
    ],
  };
}

export function createMockApprovalOrder(): ApprovalOrder {
  const mockItem3 = createMockItem('a3');
  mockItem3.isInStock = false;

  return {
    ...createMockCreateOrder(),
    validationResult: {
      isValid: true,
    },
    checkItemsResult: {
      invalidItemIds: [],
      hasValidItems: true,
      checkedItems: [createMockItem('a1'), createMockItem('a2'), mockItem3],
    },
    shippingResult: {
      shippingPrices: {
        EUR: 600,
      },
      deliveryDateItems: [
        {
          itemId: 'a1',
          deliveryDate: '2023-01-05T12:00:00.000Z',
        },
        {
          itemId: 'a2',
          deliveryDate: '2023-01-05T12:00:00.000Z',
        },
        {
          itemId: 'a3',
          deliveryDate: '2023-01-06T12:00:00.000Z',
        },
      ],
    },
  };
}

export function mockRouter(
  returnValueOverride?: object
): jest.SpyInstance<Router.NextRouter, []> {
  const useRouter = jest.spyOn(Router, 'useRouter');

  const callbacks: {
    [eventName: string]: (...eventParameters: any[]) => void;
  } = returnValueOverride?.['callbacks'] ?? {};

  const returnValue = {
    locale: 'en-US',
    pathname: '/items',
    query: {},
    push: jest.fn(),
    events: {
      on: (
        eventName: string,
        callback: (...eventParameters: any[]) => void
      ) => {
        callbacks[eventName] = callback;
      },
      off: (
        eventName: string,
        _callback: (...eventParameters: any[]) => void
      ) => {
        delete callbacks[eventName];
      },
    },
    ...returnValueOverride,
  };

  useRouter.mockImplementation(
    () => returnValue as unknown as ReturnType<typeof Router.useRouter>
  );

  return useRouter;
}

export function mockApolloClient(): {
  apolloClientMock: ApolloClient<NormalizedCacheObject>;
  query: jest.MockedFunction<ApolloClient<NormalizedCacheObject>['query']>;
  mutate: jest.MockedFunction<ApolloClient<NormalizedCacheObject>['mutate']>;
  subscriptions: {
    onNext: jest.MockedFunction<(value: unknown) => void>;
    onError: jest.MockedFunction<(error: unknown) => void>;
    onComplete: jest.MockedFunction<() => void>;
    unsubscribe: jest.MockedFunction<() => void>;
  }[];
} {
  const query = jest.fn();
  const mutate = jest.fn();

  const subscriptions: {
    onNext: jest.MockedFunction<(value: unknown) => void>;
    onError: jest.MockedFunction<(error: unknown) => void>;
    onComplete: jest.MockedFunction<() => void>;
    unsubscribe: jest.MockedFunction<() => void>;
  }[] = [];

  const subscribe = jest.fn(() => {
    const subscription = {
      onNext: jest.fn(),
      onError: jest.fn(),
      onComplete: jest.fn(),
      unsubscribe: jest.fn(),
    };

    const observable = {
      subscribe: jest.fn((onNext, onError, onComplete) => {
        subscription.onNext.mockImplementation(onNext);
        subscription.onError.mockImplementation(onError);
        subscription.onComplete.mockImplementation(onComplete);

        return { unsubscribe: subscription.unsubscribe };
      }),
    } as unknown as Observable<FetchResult<unknown>>;

    subscriptions.push(subscription);

    return observable;
  });

  const apolloClientMock = {
    query,
    mutate,
    subscribe,
  } as unknown as ApolloClient<NormalizedCacheObject>;

  const createApolloClientMock = createApolloClient as MockedFunction<
    typeof createApolloClient
  >;

  createApolloClientMock.mockReset();
  createApolloClientMock.mockImplementation(() =>
    Promise.resolve(apolloClientMock)
  );

  return { apolloClientMock, query, mutate, subscriptions };
}

export function createApiResponseMock(): NextApiResponse {
  const response = {
    json: jest.fn(),
    status: jest.fn(() => response),
    end: jest.fn(),
  } as unknown as NextApiResponse;

  return response;
}
