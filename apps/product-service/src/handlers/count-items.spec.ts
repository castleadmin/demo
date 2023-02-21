import { Category, EffectPower, Quality } from '@castleadmin/product-domain';
import { AppSyncResolverEvent, Callback, Context } from 'aws-lambda';
import 'mongodb';
import { ItemRepositoryImplementation } from '../app/item-repository-implementation';
import { handler } from './count-items';

jest.mock('mongodb');

type HandlerEvent = AppSyncResolverEvent<
  {
    options?: {
      category?: Category;
      qualities?: Quality[];
      powers?: EffectPower[];
    };
  },
  Record<string, any> | null
>;

describe('count-items', () => {
  let countItemsSpy: jest.SpyInstance<
    Promise<number>,
    [
      options?:
        | { category?: Category; qualities?: Quality[]; powers?: EffectPower[] }
        | undefined
    ]
  >;

  beforeEach(() => {
    countItemsSpy = jest.spyOn(
      ItemRepositoryImplementation.prototype,
      'countItems'
    );
    countItemsSpy.mockClear();
  });

  it('Should execute successfully without options', async () => {
    countItemsSpy.mockImplementation(() => Promise.resolve(30));

    const result = await handler(
      { arguments: {} } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({ count: 30 });
    expect(countItemsSpy).toHaveBeenCalledTimes(1);
    expect(countItemsSpy).toHaveBeenCalledWith(undefined);
  });

  it('Should execute successfully with partial options', async () => {
    countItemsSpy.mockImplementation(() => Promise.resolve(30));

    const result = await handler(
      {
        arguments: {
          options: {
            category: Category.axes,
          },
        },
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({ count: 30 });
    expect(countItemsSpy).toHaveBeenCalledTimes(1);
    expect(countItemsSpy).toHaveBeenCalledWith({
      category: Category.axes,
    });
  });

  it('Should execute successfully with full options', async () => {
    countItemsSpy.mockImplementation(() => Promise.resolve(30));

    const result = await handler(
      {
        arguments: {
          options: {
            category: Category.axes,
            qualities: [Quality.improved, Quality.excellent],
            powers: [EffectPower.strong],
          },
        },
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({ count: 30 });
    expect(countItemsSpy).toHaveBeenCalledTimes(1);
    expect(countItemsSpy).toHaveBeenCalledWith({
      category: Category.axes,
      qualities: [Quality.improved, Quality.excellent],
      powers: [EffectPower.strong],
    });
  });

  it('Should return an error if count items rejects', async () => {
    countItemsSpy.mockImplementation(() => Promise.reject(new Error('test')));

    const consoleWarn = console.warn;
    console.warn = jest.fn();
    const result = await handler(
      {
        arguments: {},
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );
    console.warn = consoleWarn;

    expect(result).toEqual({ error: expect.anything() });
    expect(countItemsSpy).toHaveBeenCalledTimes(1);
    expect(countItemsSpy).toHaveBeenCalledWith(undefined);
  });

  it("Should return an error if count isn't an integer", async () => {
    countItemsSpy.mockImplementation(() => Promise.resolve(3.23));

    const result = await handler(
      {
        arguments: {},
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({ error: expect.anything() });
    expect(countItemsSpy).toHaveBeenCalledTimes(1);
    expect(countItemsSpy).toHaveBeenCalledWith(undefined);
  });
});
