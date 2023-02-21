import { Language } from '@castleadmin/checkout-domain';
import {
  Category,
  EffectPower,
  Item,
  Quality,
  SortOption,
} from '@castleadmin/product-domain';
import { AppSyncResolverEvent, Callback, Context } from 'aws-lambda';
import 'mongodb';
import { ItemRepositoryImplementation } from '../app/item-repository-implementation';
import { createMockItems } from '../specs/mocks.spec';
import { handler } from './search-items';

jest.mock('mongodb');

type HandlerEvent = AppSyncResolverEvent<
  {
    searchText: string;
    locale: string;
    skip: number;
    limit: number;
    options?: {
      category?: Category;
      sort?: SortOption;
      qualities?: Quality[];
      powers?: EffectPower[];
    };
  },
  Record<string, any> | null
>;

describe('search-items', () => {
  let searchItemsSpy: jest.SpyInstance<
    Promise<Item[]>,
    [
      searchText: string,
      locale: string,
      skip: number,
      limit: number,
      options?:
        | {
            category?: Category;
            sort?: SortOption;
            qualities?: Quality[];
            powers?: EffectPower[];
          }
        | undefined
    ]
  >;

  beforeEach(() => {
    searchItemsSpy = jest.spyOn(
      ItemRepositoryImplementation.prototype,
      'searchItems'
    );
    searchItemsSpy.mockClear();
  });

  it('Should execute successfully with a searchText, locale, skip and limit parameter', async () => {
    searchItemsSpy.mockImplementation(() => Promise.resolve(createMockItems()));

    const result = await handler(
      {
        arguments: {
          searchText: 'ice',
          locale: Language.enUs,
          skip: 20,
          limit: 10,
        },
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({ items: createMockItems() });
    expect(searchItemsSpy).toHaveBeenCalledTimes(1);
    expect(searchItemsSpy).toHaveBeenCalledWith(
      'ice',
      Language.enUs,
      20,
      10,
      undefined
    );
  });

  it('Should execute successfully with a skip and limit parameter and partial options parameter', async () => {
    searchItemsSpy.mockImplementation(() => Promise.resolve(createMockItems()));

    const result = await handler(
      {
        arguments: {
          searchText: 'ice',
          locale: Language.enUs,
          skip: 20,
          limit: 32,
          options: {
            category: Category.axes,
          },
        },
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({ items: createMockItems() });
    expect(searchItemsSpy).toHaveBeenCalledTimes(1);
    expect(searchItemsSpy).toHaveBeenCalledWith('ice', Language.enUs, 20, 32, {
      category: Category.axes,
    });
  });

  it('Should execute successfully with a searchText, locale, skip and limit parameter and a full options parameter', async () => {
    searchItemsSpy.mockImplementation(() => Promise.resolve(createMockItems()));

    const result = await handler(
      {
        arguments: {
          searchText: 'ice',
          locale: Language.enUs,
          skip: 0,
          limit: 10,
          options: {
            category: Category.axes,
            qualities: [Quality.excellent],
            powers: [EffectPower.weak, EffectPower.strong],
            sort: SortOption.priceAscending,
          },
        },
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({ items: createMockItems() });
    expect(searchItemsSpy).toHaveBeenCalledTimes(1);
    expect(searchItemsSpy).toHaveBeenCalledWith('ice', Language.enUs, 0, 10, {
      category: Category.axes,
      qualities: [Quality.excellent],
      powers: [EffectPower.weak, EffectPower.strong],
      sort: SortOption.priceAscending,
    });
  });

  it('Should return an error if the input parameter searchText is undefined', async () => {
    searchItemsSpy.mockImplementation(() => Promise.resolve(createMockItems()));

    const result = await handler(
      {
        arguments: { locale: Language.enUs, skip: 20, limit: 10 },
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({ error: expect.anything() });
    expect(searchItemsSpy).toHaveBeenCalledTimes(0);
  });

  it('Should return an error if the input parameter locale is undefined', async () => {
    searchItemsSpy.mockImplementation(() => Promise.resolve(createMockItems()));

    const result = await handler(
      { arguments: { searchText: 'ice', skip: 20, limit: 10 } } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({ error: expect.anything() });
    expect(searchItemsSpy).toHaveBeenCalledTimes(0);
  });

  it('Should return an error if the input parameter skip is null', async () => {
    searchItemsSpy.mockImplementation(() => Promise.resolve(createMockItems()));

    const result = await handler(
      {
        arguments: {
          searchText: 'ice',
          locale: Language.enUs,
          skip: null as unknown as number,
          limit: 10,
        },
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({ error: expect.anything() });
    expect(searchItemsSpy).toHaveBeenCalledTimes(0);
  });

  it('Should return an error if the input parameter skip is undefined', async () => {
    searchItemsSpy.mockImplementation(() => Promise.resolve(createMockItems()));

    const result = await handler(
      {
        arguments: {
          searchText: 'ice',
          locale: Language.enUs,
          skip: undefined as unknown as number,
          limit: 10,
        },
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({ error: expect.anything() });
    expect(searchItemsSpy).toHaveBeenCalledTimes(0);
  });

  it('Should return an error if the input parameter skip less than 0', async () => {
    searchItemsSpy.mockImplementation(() => Promise.resolve(createMockItems()));

    const result = await handler(
      {
        arguments: {
          searchText: 'ice',
          locale: Language.enUs,
          skip: -1,
          limit: 10,
        },
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({ error: expect.anything() });
    expect(searchItemsSpy).toHaveBeenCalledTimes(0);
  });

  it('Should return an error if the input parameter limit is null', async () => {
    searchItemsSpy.mockImplementation(() => Promise.resolve(createMockItems()));

    const result = await handler(
      {
        arguments: {
          searchText: 'ice',
          locale: Language.enUs,
          skip: 20,
          limit: null as unknown as number,
        },
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({ error: expect.anything() });
    expect(searchItemsSpy).toHaveBeenCalledTimes(0);
  });

  it('Should return an error if the input parameter limit is undefined', async () => {
    searchItemsSpy.mockImplementation(() => Promise.resolve(createMockItems()));

    const result = await handler(
      {
        arguments: {
          searchText: 'ice',
          locale: Language.enUs,
          skip: 20,
          limit: undefined as unknown as number,
        },
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({ error: expect.anything() });
    expect(searchItemsSpy).toHaveBeenCalledTimes(0);
  });

  it('Should return an error if the input parameter limit is less than 0', async () => {
    searchItemsSpy.mockImplementation(() => Promise.resolve(createMockItems()));

    const result = await handler(
      {
        arguments: {
          searchText: 'ice',
          locale: Language.enUs,
          skip: 20,
          limit: -1,
        },
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({ error: expect.anything() });
    expect(searchItemsSpy).toHaveBeenCalledTimes(0);
  });

  it('Should return an error if the input parameter limit is greater than 32', async () => {
    searchItemsSpy.mockImplementation(() => Promise.resolve(createMockItems()));

    const result = await handler(
      {
        arguments: {
          searchText: 'ice',
          locale: Language.enUs,
          skip: 20,
          limit: 33,
        },
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({ error: expect.anything() });
    expect(searchItemsSpy).toHaveBeenCalledTimes(0);
  });

  it('Should return an error if search items rejects', async () => {
    searchItemsSpy.mockImplementation(() => Promise.reject(new Error('test')));

    const consoleWarn = console.warn;
    console.warn = jest.fn();
    const result = await handler(
      {
        arguments: {
          searchText: 'ice',
          locale: Language.enUs,
          skip: 20,
          limit: 10,
        },
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );
    console.warn = consoleWarn;

    expect(result).toEqual({ error: expect.anything() });
    expect(searchItemsSpy).toHaveBeenCalledTimes(1);
    expect(searchItemsSpy).toHaveBeenCalledWith(
      'ice',
      Language.enUs,
      20,
      10,
      undefined
    );
  });
});
