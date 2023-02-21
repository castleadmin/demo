import '@castleadmin/frontend-utils';
import { NextApiRequest } from 'next';
import { CheckoutRequest } from '../../api';
import checkoutHandler from '../../pages/api/checkout';
import {
  createApiResponseMock,
  createMockApprovalOrder,
  createMockCreateOrder,
  mockApolloClient,
} from '../mocks';

jest.mock('@castleadmin/frontend-utils', () => {
  const originalModule = jest.requireActual('@castleadmin/frontend-utils');

  return {
    __esModule: true,
    ...originalModule,
    createApolloClient: jest.fn(),
  };
});

describe('checkout', () => {
  describe('checkoutHandler', () => {
    it('Should execute successfully', async () => {
      const { mutate, subscriptions } = mockApolloClient();
      mutate.mockImplementation(() =>
        Promise.resolve({
          data: {
            checkout: '1234-5678',
          },
        })
      );
      const response = createApiResponseMock();

      const checkoutHandlerPromise = checkoutHandler(
        {
          method: 'POST',
          body: {
            transactionId: '1234-5678',
            createOrder: createMockCreateOrder(),
          } as CheckoutRequest,
        } as unknown as NextApiRequest,
        response
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(subscriptions.length).toBe(2);

      subscriptions[1]?.onNext({
        data: {
          onRequestCheckoutApproval: {
            transactionId: '1234-5678',
            token: 'a123',
            approvalOrder: createMockApprovalOrder(),
          },
        },
      });

      await checkoutHandlerPromise;

      expect(subscriptions.length).toBe(2);
      expect(subscriptions[0]?.unsubscribe).toHaveBeenCalledTimes(1);
      expect(subscriptions[1]?.unsubscribe).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith({
        transactionId: '1234-5678',
        token: 'a123',
        approvalOrder: createMockApprovalOrder(),
      });
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.end).toHaveBeenCalledTimes(1);
    });

    it('Should return an error if the body is missing the transaction ID', async () => {
      const { mutate, subscriptions } = mockApolloClient();
      mutate.mockImplementation(() =>
        Promise.resolve({
          data: {
            checkout: '1234-5678',
          },
        })
      );
      const response = createApiResponseMock();

      const checkoutHandlerPromise = checkoutHandler(
        {
          method: 'POST',
          body: {
            createOrder: createMockCreateOrder(),
          } as CheckoutRequest,
        } as unknown as NextApiRequest,
        response
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(subscriptions.length).toBe(0);

      await checkoutHandlerPromise;

      expect(subscriptions.length).toBe(0);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.end).toHaveBeenCalledTimes(1);
    });

    it('Should return an error if the body is missing the createOrder', async () => {
      const { mutate, subscriptions } = mockApolloClient();
      mutate.mockImplementation(() =>
        Promise.resolve({
          data: {
            checkout: '1234-5678',
          },
        })
      );
      const response = createApiResponseMock();

      const checkoutHandlerPromise = checkoutHandler(
        {
          method: 'POST',
          body: {
            transactionId: '1234-5678',
          } as CheckoutRequest,
        } as unknown as NextApiRequest,
        response
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(subscriptions.length).toBe(0);

      await checkoutHandlerPromise;

      expect(subscriptions.length).toBe(0);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.end).toHaveBeenCalledTimes(1);
    });

    it("Should return an error if the HTTP method isn't post", async () => {
      const { mutate, subscriptions } = mockApolloClient();
      mutate.mockImplementation(() =>
        Promise.resolve({
          data: {
            checkout: '1234-5678',
          },
        })
      );
      const response = createApiResponseMock();

      const checkoutHandlerPromise = checkoutHandler(
        {
          method: 'GET',
          body: {
            transactionId: '1234-5678',
            createOrder: createMockCreateOrder(),
          } as CheckoutRequest,
        } as unknown as NextApiRequest,
        response
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(subscriptions.length).toBe(0);

      await checkoutHandlerPromise;

      expect(subscriptions.length).toBe(0);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(405);
      expect(response.end).toHaveBeenCalledTimes(1);
    });
  });
});
