import '@castleadmin/frontend-utils';
import { NextApiRequest } from 'next';
import { RejectCheckoutRequest } from '../../api';
import rejectCheckoutHandler, {
  rejectCheckout,
} from '../../pages/api/reject-checkout';
import { createApiResponseMock, mockApolloClient } from '../mocks';

jest.mock('@castleadmin/frontend-utils', () => {
  const originalModule = jest.requireActual('@castleadmin/frontend-utils');

  return {
    __esModule: true,
    ...originalModule,
    createApolloClient: jest.fn(),
  };
});

describe('reject-checkout', () => {
  describe('rejectCheckoutHandler', () => {
    it('Should execute successfully', async () => {
      const { mutate } = mockApolloClient();
      mutate.mockImplementation(() =>
        Promise.resolve({
          data: {
            rejectCheckout: '1234-5678',
          },
        })
      );
      const response = createApiResponseMock();

      await rejectCheckoutHandler(
        {
          method: 'POST',
          body: {
            transactionId: '1234-5678',
            token: 'a123',
          } as RejectCheckoutRequest,
        } as unknown as NextApiRequest,
        response
      );

      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith({
        transactionId: '1234-5678',
      });
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.end).toHaveBeenCalledTimes(1);
    });

    it('Should return an error if the body is missing the transaction ID', async () => {
      const { mutate } = mockApolloClient();
      mutate.mockImplementation(() =>
        Promise.resolve({
          data: {
            rejectCheckout: '1234-5678',
          },
        })
      );
      const response = createApiResponseMock();

      await rejectCheckoutHandler(
        {
          method: 'POST',
          body: {
            token: 'a123',
          } as RejectCheckoutRequest,
        } as unknown as NextApiRequest,
        response
      );

      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.end).toHaveBeenCalledTimes(1);
    });

    it('Should return an error if the body is missing the token', async () => {
      const { mutate } = mockApolloClient();
      mutate.mockImplementation(() =>
        Promise.resolve({
          data: {
            rejectCheckout: '1234-5678',
          },
        })
      );
      const response = createApiResponseMock();

      await rejectCheckoutHandler(
        {
          method: 'POST',
          body: {
            transactionId: '1234-5678',
          } as RejectCheckoutRequest,
        } as unknown as NextApiRequest,
        response
      );

      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.end).toHaveBeenCalledTimes(1);
    });

    it("Should return an error if the HTTP method isn't post", async () => {
      const { mutate } = mockApolloClient();
      mutate.mockImplementation(() =>
        Promise.resolve({
          data: {
            rejectCheckout: '1234-5678',
          },
        })
      );
      const response = createApiResponseMock();

      await rejectCheckoutHandler(
        {
          method: 'GET',
          body: {
            transactionId: '1234-5678',
            token: 'a123',
          } as RejectCheckoutRequest,
        } as unknown as NextApiRequest,
        response
      );

      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(405);
      expect(response.end).toHaveBeenCalledTimes(1);
    });
  });

  describe('rejectCheckout', () => {
    it('Should execute successfully', async () => {
      const { apolloClientMock, mutate } = mockApolloClient();
      mutate.mockImplementation(() =>
        Promise.resolve({
          data: {
            rejectCheckout: '1234-5678',
          },
        })
      );

      const result = rejectCheckout(apolloClientMock, '1234-5678', 'a123');

      await expect(result).resolves.toBe('1234-5678');
    });

    it("Should throw an error if the returned transaction ID doesn't match with the given transaction ID", async () => {
      const { apolloClientMock, mutate } = mockApolloClient();
      mutate.mockImplementation(() =>
        Promise.resolve({
          data: {
            rejectCheckout: '1234-56781',
          },
        })
      );

      const result = rejectCheckout(apolloClientMock, '1234-5678', 'a123');

      await expect(result).rejects.toBeInstanceOf(Error);
    });
  });
});
