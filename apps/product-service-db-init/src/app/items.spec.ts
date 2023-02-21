import { Category } from '@castleadmin/product-domain';
import { createItems, createItemsInCategory } from './items';

describe('items', () => {
  describe('createItemsInCategory', () => {
    it('Should create 100 items in category swords', () => {
      const result = createItemsInCategory(Category.swords, 100);

      expect(result.length).toBe(100);
      result.forEach((item) => {
        expect(item.category).toBe(Category.swords);
      });
    });
    it('Should create 200 items in category axes', () => {
      const result = createItemsInCategory(Category.axes, 200);

      expect(result.length).toBe(200);
      result.forEach((item) => {
        expect(item.category).toBe(Category.axes);
      });
    });
  });

  describe('createItems', () => {
    it('Should create items', () => {
      const result = createItems();

      expect(result.length).toBeGreaterThan(0);

      expect(
        result.filter((item) => item.category === Category.axes).length
      ).toBeGreaterThan(0);
      expect(
        result.filter((item) => item.category === Category.hammers).length
      ).toBeGreaterThan(0);
      expect(
        result.filter((item) => item.category === Category.spears).length
      ).toBeGreaterThan(0);
      expect(
        result.filter((item) => item.category === Category.daggers).length
      ).toBeGreaterThan(0);
      expect(
        result.filter((item) => item.category === Category.swords).length
      ).toBeGreaterThan(0);

      expect(
        result.filter((item) => item.category === Category.bows).length
      ).toBeGreaterThan(0);
      expect(
        result.filter((item) => item.category === Category.armors).length
      ).toBeGreaterThan(0);
      expect(
        result.filter((item) => item.category === Category.helmets).length
      ).toBeGreaterThan(0);
      expect(
        result.filter((item) => item.category === Category.shields).length
      ).toBeGreaterThan(0);
      expect(
        result.filter((item) => item.category === Category.wands).length
      ).toBeGreaterThan(0);

      expect(
        result.filter((item) => item.category === Category.scrolls).length
      ).toBeGreaterThan(0);
      expect(
        result.filter((item) => item.category === Category.potions).length
      ).toBeGreaterThan(0);
    });
  });
});
