import { Item } from '@castleadmin/product-domain';
import { AppSyncResolverEvent, Callback, Context } from 'aws-lambda';
import 'mongodb';
import { ItemRepositoryImplementation } from '../app/item-repository-implementation';
import { createMockItem } from '../specs/mocks.spec';
import { handler } from './get-item';

jest.mock('mongodb');

type HandlerEvent = AppSyncResolverEvent<
  { id: string },
  Record<string, any> | null
>;

describe('get-item', () => {
  let getItemSpy: jest.SpyInstance<Promise<Item>, [id: string]>;

  beforeEach(() => {
    getItemSpy = jest.spyOn(ItemRepositoryImplementation.prototype, 'getItem');
    getItemSpy.mockClear();
  });

  it('Should execute successfully', async () => {
    getItemSpy.mockImplementation(() => Promise.resolve(createMockItem()));

    const result = await handler(
      { arguments: { id: '123' } } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({ item: createMockItem() });
    expect(getItemSpy).toHaveBeenCalledTimes(1);
    expect(getItemSpy).toHaveBeenCalledWith('123');
  });

  it('Should return an error if the input parameter id is missing', async () => {
    getItemSpy.mockImplementation(() => Promise.resolve(createMockItem()));

    const result = await handler(
      { arguments: {} } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({ error: expect.anything() });
    expect(getItemSpy).toHaveBeenCalledTimes(0);
  });

  it('Should return an error if get item rejects', async () => {
    getItemSpy.mockImplementation(() => Promise.reject(new Error('test')));

    const consoleWarn = console.warn;
    console.warn = jest.fn();
    const result = await handler(
      { arguments: { id: '123' } } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );
    console.warn = consoleWarn;

    expect(result).toEqual({ error: expect.anything() });
    expect(getItemSpy).toHaveBeenCalledTimes(1);
    expect(getItemSpy).toHaveBeenCalledWith('123');
  });
});
