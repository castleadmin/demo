import { createIsInStock } from './stock';

describe('stock', () => {
  describe('createIsInStock', () => {
    it('Should be in stock', () => {
      Math.random = jest.fn(() => 0.2);

      expect(createIsInStock()).toBe(true);
    });

    it(`Shouldn't be in stock`, () => {
      Math.random = jest.fn(() => 0.8);

      expect(createIsInStock()).toBe(false);
    });
  });
});
