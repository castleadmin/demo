import { createEan } from './ean';

describe('ean', () => {
  describe('createEan', () => {
    it('Should create EAN-13 number', () => {
      const result = createEan();

      expect(result.length).toBe(13);
      expect(result).toMatch(/^[0-9]{13}$/);
    });
  });
});
