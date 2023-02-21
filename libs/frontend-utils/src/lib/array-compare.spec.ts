import { stringArrayEquals } from './array-compare';

describe('array-compare', () => {
  describe('stringArrayEquals', () => {
    it('Should return true if both arrays are equal', () => {
      const a = ['a', 'b', 'c'];
      const b = ['a', 'b', 'c'];

      expect(stringArrayEquals(a, b)).toBe(true);
    });

    it('Should return true if both arrays only differ in element order', () => {
      const a = ['a', 'c', 'b'];
      const b = ['b', 'a', 'c'];

      expect(stringArrayEquals(a, b)).toBe(true);
    });

    it('Should return false if the arrays have different length', () => {
      const a = ['a', 'b', 'c'];
      const b = ['a', 'b'];

      expect(stringArrayEquals(a, b)).toBe(false);
    });

    it('Should return false if the arrays have different elements', () => {
      const a = ['a', 'b', 'c'];
      const b = ['a', 'b', 'd'];

      expect(stringArrayEquals(a, b)).toBe(false);
    });
  });
});
