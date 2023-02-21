import { createPopularity } from './popularity';

describe('popularity', () => {
  describe('createPopularity', () => {
    it('Should return a popularity <= 0.33', () => {
      for (let i = 0; i < 10; i++) {
        expect(createPopularity(2)).toBeLessThanOrEqual(0.33);
        expect(createPopularity(3)).toBeLessThanOrEqual(0.33);
      }
    });

    it('Should return a popularity <= 0.66', () => {
      for (let i = 0; i < 10; i++) {
        expect(createPopularity(4)).toBeLessThanOrEqual(0.66);
        expect(createPopularity(5)).toBeLessThanOrEqual(0.66);
        expect(createPopularity(6)).toBeLessThanOrEqual(0.66);
      }
    });

    it('Should return a popularity < 1', () => {
      for (let i = 0; i < 10; i++) {
        expect(createPopularity(7)).toBeLessThan(1);
        expect(createPopularity(8)).toBeLessThan(1);
        expect(createPopularity(9)).toBeLessThan(1);
        expect(createPopularity(10)).toBeLessThan(1);
      }
    });
  });
});
