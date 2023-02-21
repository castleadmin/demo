import { Item } from '@castleadmin/product-domain';
import { Callback, Context } from 'aws-lambda';
import 'mongodb';
import { ItemRepositoryImplementation } from '../app/item-repository-implementation';
import { createMockItems } from '../specs/mocks.spec';
import { handler } from './get-items-by-id';

jest.mock('mongodb');

type HandlerEvent = { ids: string[] };

describe('get-items-by-id', () => {
  let getItemsByIdSpy: jest.SpyInstance<
    Promise<{ hasValidItems: boolean; invalidIds: string[]; items: Item[] }>,
    [ids: string[]]
  >;

  beforeEach(() => {
    getItemsByIdSpy = jest.spyOn(
      ItemRepositoryImplementation.prototype,
      'getItemsById'
    );
    getItemsByIdSpy.mockClear();
  });

  it('Should execute successfully', async () => {
    getItemsByIdSpy.mockImplementation(() =>
      Promise.resolve({
        hasValidItems: true,
        invalidIds: [],
        items: createMockItems(),
      })
    );

    const result = await handler(
      { ids: ['a1', 'a2', 'a3', 'a4', 'a5'] } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({
      hasValidItems: true,
      invalidIds: [],
      items: createMockItems(),
    });
    expect(getItemsByIdSpy).toHaveBeenCalledTimes(1);
    expect(getItemsByIdSpy).toHaveBeenCalledWith([
      'a1',
      'a2',
      'a3',
      'a4',
      'a5',
    ]);
  });

  it('Should return an error if the input parameter ids is missing', async () => {
    getItemsByIdSpy.mockImplementation(() =>
      Promise.resolve({
        hasValidItems: true,
        invalidIds: [],
        items: createMockItems(),
      })
    );

    const result = await handler(
      {} as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({ error: expect.anything() });
    expect(getItemsByIdSpy).toHaveBeenCalledTimes(0);
  });

  it('Should return an error if the input parameter ids has length 0', async () => {
    getItemsByIdSpy.mockImplementation(() =>
      Promise.resolve({
        hasValidItems: true,
        invalidIds: [],
        items: createMockItems(),
      })
    );

    const result = await handler(
      { ids: [] } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({ error: expect.anything() });
    expect(getItemsByIdSpy).toHaveBeenCalledTimes(0);
  });

  it('Should return an error if get items by id rejects', async () => {
    getItemsByIdSpy.mockImplementation(() => Promise.reject(new Error('test')));

    const consoleWarn = console.warn;
    console.warn = jest.fn();
    const result = await handler(
      { ids: ['a1', 'a2', 'a3', 'a4', 'a5'] } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );
    console.warn = consoleWarn;

    expect(result).toEqual({ error: expect.anything() });
    expect(getItemsByIdSpy).toHaveBeenCalledTimes(1);
    expect(getItemsByIdSpy).toHaveBeenCalledWith([
      'a1',
      'a2',
      'a3',
      'a4',
      'a5',
    ]);
  });
});
