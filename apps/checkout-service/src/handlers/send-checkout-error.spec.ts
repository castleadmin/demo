import { CheckoutErrorType } from '@castleadmin/checkout-domain';
import * as ServerlessUtils from '@castleadmin/serverless-utils';
import { Callback, Context } from 'aws-lambda';
import { handler } from './send-checkout-error';

// eslint-disable @typescript-eslint/no-explicit-any

jest.mock('@castleadmin/serverless-utils', () => {
  const originalModule = jest.requireActual('@castleadmin/serverless-utils');
  const mocksModule = jest.requireActual('../specs/mocks.spec');

  const { createApolloClientMock, mutate } = mocksModule.mockApolloClient();

  return {
    __esModule: true,
    ...originalModule,
    createApolloClient: createApolloClientMock,
    mutate,
  };
});

type HandlerEvent = {
  transactionId: string;
  checkoutError: {
    Error: string;
    Cause: string;
  };
};

describe('send-checkout-error', () => {
  it('Should execute successfully', async () => {
    const mutate = (ServerlessUtils as any).mutate;
    mutate.mockClear();
    mutate.mockImplementation(() =>
      Promise.resolve({
        data: {
          sendCheckoutError: {
            transactionId: '1234-5678',
            errorType: CheckoutErrorType.validationError,
          },
        },
      })
    );

    const result = await handler(
      {
        transactionId: '1234-5678',
        checkoutError: {
          Error: CheckoutErrorType.validationError,
          Cause: 'Some Cause',
        },
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({
      transactionId: '1234-5678',
      checkoutError: {
        errorType: CheckoutErrorType.validationError,
        error: CheckoutErrorType.validationError,
        cause: 'Some Cause',
      },
    });
    expect(mutate).toHaveBeenCalledTimes(1);
    expect(mutate).toHaveBeenCalledWith({
      variables: {
        transactionId: '1234-5678',
        errorType: CheckoutErrorType.validationError,
      },
      mutation: expect.anything(),
    });
  });

  it('Should return an error if the input parameter transactionId is missing', async () => {
    const mutate = (ServerlessUtils as any).mutate;
    mutate.mockClear();
    mutate.mockImplementation(() =>
      Promise.resolve({
        data: {
          sendCheckoutError: {
            transactionId: '1234-5678',
            errorType: CheckoutErrorType.validationError,
          },
        },
      })
    );

    const result = await handler(
      {
        checkoutError: {
          Error: CheckoutErrorType.validationError,
          Cause: 'Some Cause',
        },
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({
      error: expect.anything(),
    });
    expect(mutate).toHaveBeenCalledTimes(0);
  });

  it('Should return an error if the input parameter checkoutError is missing', async () => {
    const mutate = (ServerlessUtils as any).mutate;
    mutate.mockClear();
    mutate.mockImplementation(() =>
      Promise.resolve({
        data: {
          sendCheckoutError: {
            transactionId: '1234-5678',
            errorType: CheckoutErrorType.validationError,
          },
        },
      })
    );

    const result = await handler(
      {
        transactionId: '1234-5678',
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({
      error: expect.anything(),
    });
    expect(mutate).toHaveBeenCalledTimes(0);
  });

  it('Should return an error if the input parameter Error is missing', async () => {
    const mutate = (ServerlessUtils as any).mutate;
    mutate.mockClear();
    mutate.mockImplementation(() =>
      Promise.resolve({
        data: {
          sendCheckoutError: {
            transactionId: '1234-5678',
            errorType: CheckoutErrorType.validationError,
          },
        },
      })
    );

    const result = await handler(
      {
        transactionId: '1234-5678',
        checkoutError: {
          Cause: 'Some Cause',
        },
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({
      error: expect.anything(),
    });
    expect(mutate).toHaveBeenCalledTimes(0);
  });

  it('Should return an error if the input parameter Cause is missing', async () => {
    const mutate = (ServerlessUtils as any).mutate;
    mutate.mockClear();
    mutate.mockImplementation(() =>
      Promise.resolve({
        data: {
          sendCheckoutError: {
            transactionId: '1234-5678',
            errorType: CheckoutErrorType.validationError,
          },
        },
      })
    );

    const result = await handler(
      {
        transactionId: '1234-5678',
        checkoutError: {
          Error: CheckoutErrorType.validationError,
        },
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({
      error: expect.anything(),
    });
    expect(mutate).toHaveBeenCalledTimes(0);
  });

  it('Should return an error if the transaction IDs mismatch', async () => {
    const mutate = (ServerlessUtils as any).mutate;
    mutate.mockClear();
    mutate.mockImplementation(() =>
      Promise.resolve({
        data: {
          sendCheckoutError: {
            transactionId: '1234-56781',
            errorType: CheckoutErrorType.validationError,
          },
        },
      })
    );

    const result = await handler(
      {
        transactionId: '1234-5678',
        checkoutError: {
          Error: CheckoutErrorType.validationError,
          Cause: 'Some Cause',
        },
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({
      error: expect.anything(),
    });
    expect(mutate).toHaveBeenCalledTimes(1);
    expect(mutate).toHaveBeenCalledWith({
      variables: {
        transactionId: '1234-5678',
        errorType: CheckoutErrorType.validationError,
      },
      mutation: expect.anything(),
    });
  });

  it('Should return an error if the mutate result is invalid', async () => {
    const mutate = (ServerlessUtils as any).mutate;
    mutate.mockClear();
    mutate.mockImplementation(() => Promise.resolve({}));

    const result = await handler(
      {
        transactionId: '1234-5678',
        checkoutError: {
          Error: CheckoutErrorType.validationError,
          Cause: 'Some Cause',
        },
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({
      error: expect.anything(),
    });
    expect(mutate).toHaveBeenCalledTimes(1);
    expect(mutate).toHaveBeenCalledWith({
      variables: {
        transactionId: '1234-5678',
        errorType: CheckoutErrorType.validationError,
      },
      mutation: expect.anything(),
    });
  });
});
