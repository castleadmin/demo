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
import { handler } from './get-items';

jest.mock('mongodb');

type HandlerEvent = AppSyncResolverEvent<
  {
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

describe('get-items', () => {
  let getItemsSpy: jest.SpyInstance<
    Promise<Item[]>,
    [
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
    getItemsSpy = jest.spyOn(
      ItemRepositoryImplementation.prototype,
      'getItems'
    );
    getItemsSpy.mockClear();
  });

  it('Should execute successfully with a skip and limit parameter', async () => {
    getItemsSpy.mockImplementation(() => Promise.resolve(createMockItems()));

    const result = await handler(
      { arguments: { skip: 20, limit: 10 } } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({ items: createMockItems() });
    expect(getItemsSpy).toHaveBeenCalledTimes(1);
    expect(getItemsSpy).toHaveBeenCalledWith(20, 10, undefined);
  });

  it('Should execute successfully with a skip and limit parameter and partial options parameter', async () => {
    getItemsSpy.mockImplementation(() => Promise.resolve(createMockItems()));

    const result = await handler(
      {
        arguments: {
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
    expect(getItemsSpy).toHaveBeenCalledTimes(1);
    expect(getItemsSpy).toHaveBeenCalledWith(20, 32, {
      category: Category.axes,
    });
  });

  it('Should execute successfully with a skip and limit parameter and a full options parameter', async () => {
    getItemsSpy.mockImplementation(() => Promise.resolve(createMockItems()));

    const result = await handler(
      {
        arguments: {
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
    expect(getItemsSpy).toHaveBeenCalledTimes(1);
    expect(getItemsSpy).toHaveBeenCalledWith(0, 10, {
      category: Category.axes,
      qualities: [Quality.excellent],
      powers: [EffectPower.weak, EffectPower.strong],
      sort: SortOption.priceAscending,
    });
  });

  it('Should return an error if the input parameter skip is null', async () => {
    getItemsSpy.mockImplementation(() => Promise.resolve(createMockItems()));

    const result = await handler(
      {
        arguments: { skip: null as unknown as number, limit: 10 },
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({ error: expect.anything() });
    expect(getItemsSpy).toHaveBeenCalledTimes(0);
  });

  it('Should return an error if the input parameter skip is undefined', async () => {
    getItemsSpy.mockImplementation(() => Promise.resolve(createMockItems()));

    const result = await handler(
      {
        arguments: { skip: undefined as unknown as number, limit: 10 },
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({ error: expect.anything() });
    expect(getItemsSpy).toHaveBeenCalledTimes(0);
  });

  it('Should return an error if the input parameter skip less than 0', async () => {
    getItemsSpy.mockImplementation(() => Promise.resolve(createMockItems()));

    const result = await handler(
      { arguments: { skip: -1, limit: 10 } } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({ error: expect.anything() });
    expect(getItemsSpy).toHaveBeenCalledTimes(0);
  });

  it('Should return an error if the input parameter limit is null', async () => {
    getItemsSpy.mockImplementation(() => Promise.resolve(createMockItems()));

    const result = await handler(
      {
        arguments: { skip: 20, limit: null as unknown as number },
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({ error: expect.anything() });
    expect(getItemsSpy).toHaveBeenCalledTimes(0);
  });

  it('Should return an error if the input parameter limit is undefined', async () => {
    getItemsSpy.mockImplementation(() => Promise.resolve(createMockItems()));

    const result = await handler(
      {
        arguments: { skip: 20, limit: undefined as unknown as number },
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({ error: expect.anything() });
    expect(getItemsSpy).toHaveBeenCalledTimes(0);
  });

  it('Should return an error if the input parameter limit is less than 0', async () => {
    getItemsSpy.mockImplementation(() => Promise.resolve(createMockItems()));

    const result = await handler(
      { arguments: { skip: 20, limit: -1 } } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({ error: expect.anything() });
    expect(getItemsSpy).toHaveBeenCalledTimes(0);
  });

  it('Should return an error if the input parameter limit is greater than 32', async () => {
    getItemsSpy.mockImplementation(() => Promise.resolve(createMockItems()));

    const result = await handler(
      { arguments: { skip: 20, limit: 33 } } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({ error: expect.anything() });
    expect(getItemsSpy).toHaveBeenCalledTimes(0);
  });

  it('Should return an error if get items rejects', async () => {
    getItemsSpy.mockImplementation(() => Promise.reject(new Error('test')));

    const consoleWarn = console.warn;
    console.warn = jest.fn();
    const result = await handler(
      { arguments: { skip: 20, limit: 10 } } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );
    console.warn = consoleWarn;

    expect(result).toEqual({ error: expect.anything() });
    expect(getItemsSpy).toHaveBeenCalledTimes(1);
    expect(getItemsSpy).toHaveBeenCalledWith(20, 10, undefined);
  });
});
