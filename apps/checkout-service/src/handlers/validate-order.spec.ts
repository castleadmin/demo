import { CreateOrder, Language } from '@castleadmin/checkout-domain';
import { Callback, Context } from 'aws-lambda';
import { createMockCreateOrder } from '../specs/mocks.spec';
import { handler } from './validate-order';

type HandlerEvent = { createOrder: CreateOrder };

describe('validate-order', () => {
  it("Should return true if the 'create order' is valid", async () => {
    const result = await handler(
      {
        createOrder: createMockCreateOrder(),
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toBe(true);
  });

  it("Should return false if the input parameter 'create order' is missing", async () => {
    const consoleWarn = console.warn;
    console.warn = jest.fn();
    const result = await handler(
      {} as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );
    console.warn = consoleWarn;

    expect(result).toBe(false);
  });

  it("Should return false if the 'create order' is invalid", async () => {
    const createOrder = createMockCreateOrder();
    createOrder.language = undefined as unknown as Language;

    const consoleWarn = console.warn;
    console.warn = jest.fn();
    const result = await handler(
      {
        createOrder,
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );
    console.warn = consoleWarn;

    expect(result).toBe(false);
  });
});
