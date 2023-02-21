import { Order } from '@castleadmin/checkout-domain';
import { Callback, Context } from 'aws-lambda';
import * as AwsSdk from 'aws-sdk';
import { createMockOrder } from '../specs/mocks.spec';
import { handler } from './send-confirmation-email';

jest.mock('aws-sdk', () => {
  const originalModule = jest.requireActual('aws-sdk');

  const sendEmailPromise = jest.fn();
  const sendEmailResult = {
    promise: sendEmailPromise,
  };
  const ses = {
    sendEmail: jest.fn(() => sendEmailResult),
  };
  const SESV2 = jest.fn(() => ses);

  return {
    __esModule: true,
    ...originalModule,
    SESV2,
    sendEmailPromise,
  };
});

// eslint-disable @typescript-eslint/no-explicit-any

type HandlerEvent = { transactionId: string; order: Order };

describe('send-confirmation-email', () => {
  it('Should execute successfully', async () => {
    const sendEmailPromise = (AwsSdk as any).sendEmailPromise;
    sendEmailPromise.mockClear();
    sendEmailPromise.mockImplementation(() =>
      Promise.resolve({
        $response: {},
      })
    );

    const result = await handler(
      {
        transactionId: '1234-5678',
        order: createMockOrder('b1'),
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({
      transactionId: '1234-5678',
      order: createMockOrder('b1'),
    });
    expect(sendEmailPromise).toHaveBeenCalledTimes(1);
  });

  it('Should return an error if the input parameter transactionId is missing', async () => {
    const sendEmailPromise = (AwsSdk as any).sendEmailPromise;
    sendEmailPromise.mockClear();
    sendEmailPromise.mockImplementation(() =>
      Promise.resolve({
        $response: {},
      })
    );

    const result = await handler(
      {
        order: createMockOrder('b1'),
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({
      error: expect.anything(),
    });
    expect(sendEmailPromise).toHaveBeenCalledTimes(0);
  });

  it('Should return an error if the input parameter order is missing', async () => {
    const sendEmailPromise = (AwsSdk as any).sendEmailPromise;
    sendEmailPromise.mockClear();
    sendEmailPromise.mockImplementation(() =>
      Promise.resolve({
        $response: {},
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
    expect(sendEmailPromise).toHaveBeenCalledTimes(0);
  });

  it('Should return an error if SES returns an error', async () => {
    const sendEmailPromise = (AwsSdk as any).sendEmailPromise;
    sendEmailPromise.mockClear();
    sendEmailPromise.mockImplementation(() =>
      Promise.resolve({
        $response: {
          error: 'An error',
        },
      })
    );

    const result = await handler(
      {
        transactionId: '1234-5678',
        order: createMockOrder('b1'),
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({
      error: expect.anything(),
    });
    expect(sendEmailPromise).toHaveBeenCalledTimes(1);
  });
});
