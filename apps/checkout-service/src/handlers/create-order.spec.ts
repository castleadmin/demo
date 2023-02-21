import { ApprovalOrder, Order } from '@castleadmin/checkout-domain';
import { Callback, Context } from 'aws-lambda';
import 'mongodb';
import { OrderRepositoryImplementation } from '../app/order-repository-implementation';
import { createMockApprovalOrder, createMockOrder } from '../specs/mocks.spec';
import { handler } from './create-order';

jest.mock('mongodb', () => {
  const originalModule = jest.requireActual('mongodb');

  return {
    __esModule: true,
    ...originalModule,
    MongoClient: jest.fn(),
    ObjectId: jest.fn((value) => {
      if (value) {
        return new originalModule.ObjectId(value);
      }

      return new originalModule.ObjectId('63b81f946b43c3ac6414be81');
    }),
  };
});

type HandlerEvent = { transactionId: string; approvalOrder: ApprovalOrder };

describe('create-order', () => {
  let createOrderSpy: jest.SpyInstance<Promise<string>, [order: Order]>;

  beforeEach(() => {
    createOrderSpy = jest.spyOn(
      OrderRepositoryImplementation.prototype,
      'createOrder'
    );
    createOrderSpy.mockClear();

    jest.useFakeTimers({
      now: new Date('2023-01-06T12:00:00.000Z'),
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('Should execute successfully', async () => {
    createOrderSpy.mockImplementation(() =>
      Promise.resolve('63b81f946b43c3ac6414be81')
    );

    const result = await handler(
      {
        transactionId: 'a123',
        approvalOrder: createMockApprovalOrder(),
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({
      transactionId: 'a123',
      order: createMockOrder('63b81f946b43c3ac6414be81'),
    });
    expect(
      (
        result as {
          transactionId: string;
          order: Order;
        }
      ).order.businessName
    ).toBe('testit');
    expect(createOrderSpy).toHaveBeenCalledTimes(1);
    expect(createOrderSpy).toHaveBeenCalledWith(
      createMockOrder('63b81f946b43c3ac6414be81')
    );
  });

  it('Should return an error if the transaction ID is missing', async () => {
    createOrderSpy.mockImplementation(() =>
      Promise.resolve('63b81f946b43c3ac6414be81')
    );

    const result = await handler(
      {
        approvalOrder: createMockApprovalOrder(),
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({
      error: expect.anything(),
    });
    expect(createOrderSpy).toHaveBeenCalledTimes(0);
  });

  it('Should return an error if the approval order is missing', async () => {
    createOrderSpy.mockImplementation(() =>
      Promise.resolve('63b81f946b43c3ac6414be81')
    );

    const result = await handler(
      {
        transactionId: 'a123',
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({
      error: expect.anything(),
    });
    expect(createOrderSpy).toHaveBeenCalledTimes(0);
  });
});
