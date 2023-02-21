import { CheckoutErrorType } from '@castleadmin/checkout-domain';
import '@castleadmin/frontend-utils';
import {
  requestCheckout,
  resultSubscription,
  startCheckoutProcess,
} from './checkout-request';
import {
  createMockApprovalOrder,
  createMockCreateOrder,
  mockApolloClient,
} from './specs/mocks';

jest.mock('@castleadmin/frontend-utils', () => {
  const originalModule = jest.requireActual('@castleadmin/frontend-utils');

  return {
    __esModule: true,
    ...originalModule,
    createApolloClient: jest.fn(),
  };
});

describe('checkout-request', () => {
  describe('requestCheckout', () => {
    it('Should execute successfully', async () => {
      const { mutate, subscriptions } = mockApolloClient();
      mutate.mockImplementation(() =>
        Promise.resolve({
          data: {
            checkout: '1234-5678',
          },
        })
      );

      const requestCheckoutPromise = requestCheckout(
        '1234-5678',
        createMockCreateOrder()
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

      const result = await requestCheckoutPromise;

      expect(subscriptions.length).toBe(2);
      expect(subscriptions[0]?.unsubscribe).toHaveBeenCalledTimes(1);
      expect(subscriptions[1]?.unsubscribe).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        transactionId: '1234-5678',
        token: 'a123',
        approvalOrder: createMockApprovalOrder(),
      });
    });
  });

  describe('startCheckoutProcess', () => {
    it('Should execute successfully', async () => {
      const { apolloClientMock, mutate } = mockApolloClient();
      mutate.mockImplementation(() =>
        Promise.resolve({
          data: {
            checkout: '1234-5678',
          },
        })
      );

      const result = await startCheckoutProcess(
        apolloClientMock,
        '1234-5678',
        createMockCreateOrder()
      );

      expect(result).toEqual('1234-5678');
    });

    it('Should throw an error if the transaction IDs mismatch', async () => {
      const { apolloClientMock, mutate } = mockApolloClient();
      mutate.mockImplementation(() =>
        Promise.resolve({
          data: {
            checkout: '1234-56781',
          },
        })
      );

      await expect(
        startCheckoutProcess(
          apolloClientMock,
          '1234-5678',
          createMockCreateOrder()
        )
      ).rejects.toBeInstanceOf(Error);
    });
  });

  describe('resultSubscription', () => {
    describe('checkoutApprovalSubscription', () => {
      it('Should execute successfully', async () => {
        const { apolloClientMock, subscriptions } = mockApolloClient();

        const resultSubscriptionPromise = resultSubscription(
          apolloClientMock,
          '1234-5678'
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

        const result = await resultSubscriptionPromise;

        expect(subscriptions.length).toBe(2);
        expect(subscriptions[0]?.unsubscribe).toHaveBeenCalledTimes(1);
        expect(subscriptions[1]?.unsubscribe).toHaveBeenCalledTimes(1);
        expect(result).toEqual({
          transactionId: '1234-5678',
          token: 'a123',
          approvalOrder: createMockApprovalOrder(),
        });
      });

      it('Should reject if the result data structure is unknown', async () => {
        const { apolloClientMock, subscriptions } = mockApolloClient();

        const resultSubscriptionPromise = resultSubscription(
          apolloClientMock,
          '1234-5678'
        );

        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(subscriptions.length).toBe(2);

        subscriptions[1]?.onNext({
          dataUnknown: {
            onRequestCheckoutApproval: {
              transactionId: '1234-5678',
              token: 'a123',
              approvalOrder: createMockApprovalOrder(),
            },
          },
        });

        expect(subscriptions.length).toBe(2);
        expect(subscriptions[0]?.unsubscribe).toHaveBeenCalledTimes(1);
        expect(subscriptions[1]?.unsubscribe).toHaveBeenCalledTimes(1);
        await expect(resultSubscriptionPromise).rejects.toBeTruthy();
      });

      it('Should reject if the transaction IDs mismatch', async () => {
        const { apolloClientMock, subscriptions } = mockApolloClient();

        const resultSubscriptionPromise = resultSubscription(
          apolloClientMock,
          '1234-5678'
        );

        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(subscriptions.length).toBe(2);

        subscriptions[1]?.onNext({
          data: {
            onRequestCheckoutApproval: {
              transactionId: '1234-56781',
              token: 'a123',
              approvalOrder: createMockApprovalOrder(),
            },
          },
        });

        expect(subscriptions.length).toBe(2);
        expect(subscriptions[0]?.unsubscribe).toHaveBeenCalledTimes(1);
        expect(subscriptions[1]?.unsubscribe).toHaveBeenCalledTimes(1);
        await expect(resultSubscriptionPromise).rejects.toBeTruthy();
      });

      it('Should reject in case of an error', async () => {
        const { apolloClientMock, subscriptions } = mockApolloClient();

        const resultSubscriptionPromise = resultSubscription(
          apolloClientMock,
          '1234-5678'
        );

        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(subscriptions.length).toBe(2);

        subscriptions[1]?.onError(new Error('test'));

        expect(subscriptions.length).toBe(2);
        expect(subscriptions[0]?.unsubscribe).toHaveBeenCalledTimes(1);
        expect(subscriptions[1]?.unsubscribe).toHaveBeenCalledTimes(1);
        await expect(resultSubscriptionPromise).rejects.toBeTruthy();
      });
    });

    describe('errorSubscription', () => {
      it('Should reject if an checkout error occurs', async () => {
        const { apolloClientMock, subscriptions } = mockApolloClient();

        const resultSubscriptionPromise = resultSubscription(
          apolloClientMock,
          '1234-5678'
        );

        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(subscriptions.length).toBe(2);

        subscriptions[0]?.onNext({
          data: {
            onSendCheckoutError: {
              transactionId: '1234-5678',
              errorType: CheckoutErrorType.internalError,
            },
          },
        });

        expect(subscriptions.length).toBe(2);
        expect(subscriptions[0]?.unsubscribe).toHaveBeenCalledTimes(1);
        expect(subscriptions[1]?.unsubscribe).toHaveBeenCalledTimes(1);
        await expect(resultSubscriptionPromise).rejects.toBeTruthy();
      });

      it('Should reject if the result data structure is unknown', async () => {
        const { apolloClientMock, subscriptions } = mockApolloClient();

        const resultSubscriptionPromise = resultSubscription(
          apolloClientMock,
          '1234-5678'
        );

        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(subscriptions.length).toBe(2);

        subscriptions[0]?.onNext({
          dataUnknown: {
            onSendCheckoutError: {
              transactionId: '1234-5678',
              errorType: CheckoutErrorType.internalError,
            },
          },
        });

        expect(subscriptions.length).toBe(2);
        expect(subscriptions[0]?.unsubscribe).toHaveBeenCalledTimes(1);
        expect(subscriptions[1]?.unsubscribe).toHaveBeenCalledTimes(1);
        await expect(resultSubscriptionPromise).rejects.toBeTruthy();
      });

      it('Should reject if the transaction IDs mismatch', async () => {
        const { apolloClientMock, subscriptions } = mockApolloClient();

        const resultSubscriptionPromise = resultSubscription(
          apolloClientMock,
          '1234-5678'
        );

        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(subscriptions.length).toBe(2);

        subscriptions[0]?.onNext({
          data: {
            onSendCheckoutError: {
              transactionId: '1234-56781',
              errorType: CheckoutErrorType.internalError,
            },
          },
        });

        expect(subscriptions.length).toBe(2);
        expect(subscriptions[0]?.unsubscribe).toHaveBeenCalledTimes(1);
        expect(subscriptions[1]?.unsubscribe).toHaveBeenCalledTimes(1);
        await expect(resultSubscriptionPromise).rejects.toBeTruthy();
      });

      it('Should reject in case of an error', async () => {
        const { apolloClientMock, subscriptions } = mockApolloClient();

        const resultSubscriptionPromise = resultSubscription(
          apolloClientMock,
          '1234-5678'
        );

        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(subscriptions.length).toBe(2);

        subscriptions[0]?.onError(new Error('test'));

        expect(subscriptions.length).toBe(2);
        expect(subscriptions[0]?.unsubscribe).toHaveBeenCalledTimes(1);
        expect(subscriptions[1]?.unsubscribe).toHaveBeenCalledTimes(1);
        await expect(resultSubscriptionPromise).rejects.toBeTruthy();
      });
    });
  });
});
