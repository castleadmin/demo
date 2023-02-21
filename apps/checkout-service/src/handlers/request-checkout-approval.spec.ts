import { ApprovalOrder } from '@castleadmin/checkout-domain';
import * as ServerlessUtils from '@castleadmin/serverless-utils';
import { Callback, Context } from 'aws-lambda';
import { createMockApprovalOrder } from '../specs/mocks.spec';
import { handler } from './request-checkout-approval';

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

// eslint-disable @typescript-eslint/no-explicit-any

type HandlerEvent = {
  transactionId: string;
  token: string;
  approvalOrder: ApprovalOrder;
};

describe('request-checkout-approval', () => {
  it('Should execute successfully', async () => {
    const mutate = (ServerlessUtils as any).mutate;
    mutate.mockClear();
    mutate.mockImplementation(() =>
      Promise.resolve({
        data: {
          requestCheckoutApproval: {
            transactionId: '1234-5678',
            token: 'a123',
            approvalOrder: createMockApprovalOrder(),
          },
        },
      })
    );

    const result = await handler(
      {
        transactionId: '1234-5678',
        token: 'a123',
        approvalOrder: createMockApprovalOrder(),
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({
      transactionId: '1234-5678',
    });
    expect(mutate).toHaveBeenCalledTimes(1);
    expect(mutate).toHaveBeenCalledWith({
      variables: {
        transactionId: '1234-5678',
        token: 'a123',
        approvalOrder: createMockApprovalOrder(),
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
          requestCheckoutApproval: {
            transactionId: '1234-5678',
            token: 'a123',
            approvalOrder: createMockApprovalOrder(),
          },
        },
      })
    );

    const result = await handler(
      {
        token: 'a123',
        approvalOrder: createMockApprovalOrder(),
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({
      error: expect.anything(),
    });
    expect(mutate).toHaveBeenCalledTimes(0);
  });

  it('Should return an error if the input parameter token is missing', async () => {
    const mutate = (ServerlessUtils as any).mutate;
    mutate.mockClear();
    mutate.mockImplementation(() =>
      Promise.resolve({
        data: {
          requestCheckoutApproval: {
            transactionId: '1234-5678',
            token: 'a123',
            approvalOrder: createMockApprovalOrder(),
          },
        },
      })
    );

    const result = await handler(
      {
        transactionId: '1234-5678',
        approvalOrder: createMockApprovalOrder(),
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({
      error: expect.anything(),
    });
    expect(mutate).toHaveBeenCalledTimes(0);
  });

  it('Should return an error if the input parameter approvalOrder is missing', async () => {
    const mutate = (ServerlessUtils as any).mutate;
    mutate.mockClear();
    mutate.mockImplementation(() =>
      Promise.resolve({
        data: {
          requestCheckoutApproval: {
            transactionId: '1234-5678',
            token: 'a123',
            approvalOrder: createMockApprovalOrder(),
          },
        },
      })
    );

    const result = await handler(
      {
        transactionId: '1234-5678',
        token: 'a123',
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
          requestCheckoutApproval: {
            transactionId: '1234-56781',
            token: 'a123',
            approvalOrder: createMockApprovalOrder(),
          },
        },
      })
    );

    const result = await handler(
      {
        transactionId: '1234-5678',
        token: 'a123',
        approvalOrder: createMockApprovalOrder(),
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
        token: 'a123',
        approvalOrder: createMockApprovalOrder(),
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
        token: 'a123',
        approvalOrder: createMockApprovalOrder(),
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
        token: 'a123',
        approvalOrder: createMockApprovalOrder(),
      },
      mutation: expect.anything(),
    });
  });
});
