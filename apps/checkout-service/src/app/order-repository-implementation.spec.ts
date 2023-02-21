import {
  createMockMongoClient,
  createMockOrder,
  createMockOrderDb,
} from '../specs/mocks.spec';
import { OrderRepositoryImplementation } from './order-repository-implementation';

describe('order-repository-implementation', () => {
  describe('createOrder', () => {
    it('Should execute successfully', async () => {
      const { client, insertOne } = createMockMongoClient();

      const repo = new OrderRepositoryImplementation(client);
      insertOne.mockImplementation(() =>
        Promise.resolve({ insertedId: '63b81f946b43c3ac6414be81' })
      );

      const result = await repo.createOrder(
        createMockOrder('63b81f946b43c3ac6414be81')
      );

      expect(result).toEqual('63b81f946b43c3ac6414be81');
      expect(insertOne).toHaveBeenCalledTimes(1);
      expect(insertOne).toHaveBeenCalledWith(
        createMockOrderDb('63b81f946b43c3ac6414be81')
      );
    });

    it("Should throw an error if the returned ID doesn't match with the given ID", async () => {
      const { client, insertOne } = createMockMongoClient();

      const repo = new OrderRepositoryImplementation(client);
      insertOne.mockImplementation(() =>
        Promise.resolve({ insertedId: '63b81f946b43c3ac6414be82' })
      );

      await expect(
        repo.createOrder(createMockOrder('63b81f946b43c3ac6414be81'))
      ).rejects.toBeInstanceOf(Error);
      expect(insertOne).toHaveBeenCalledTimes(1);
      expect(insertOne).toHaveBeenCalledWith(
        createMockOrderDb('63b81f946b43c3ac6414be81')
      );
    });
  });
});
