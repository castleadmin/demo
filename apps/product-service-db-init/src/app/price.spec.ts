import {
  ArmorType,
  AxeType,
  Category,
  EffectPower,
  PotionType,
  Quality,
} from '@castleadmin/product-domain';
import { basePrice, createPriceEur, effectPrice, qualityPrice } from './price';

describe('price', () => {
  describe('basePrice', () => {
    it('The price for an item of category axes and type singleSided should be 80', () => {
      expect(basePrice(Category.axes, AxeType.singleSided)).toBe(80);
    });

    it('The price for an item of category axes and type doubleSided should be 100', () => {
      expect(basePrice(Category.axes, AxeType.doubleSided)).toBe(100);
    });

    it('The price for an item of category hammers should be 100', () => {
      expect(basePrice(Category.hammers)).toBe(100);
    });

    it('The price for an item of category spears should be 60', () => {
      expect(basePrice(Category.spears)).toBe(60);
    });

    it('The price for an item of category daggers should be 30', () => {
      expect(basePrice(Category.daggers)).toBe(30);
    });

    it('The price for an item of category swords should be 100', () => {
      expect(basePrice(Category.swords)).toBe(100);
    });

    it('The price for an item of category bows should be 50', () => {
      expect(basePrice(Category.bows)).toBe(50);
    });

    it('The price for an item of category armors and type leather should be 60', () => {
      expect(basePrice(Category.armors, ArmorType.leather)).toBe(60);
    });

    it('The price for an item of category armors and type chainmail should be 100', () => {
      expect(basePrice(Category.armors, ArmorType.chainmail)).toBe(100);
    });

    it('The price for an item of category armors and type plate should be 140', () => {
      expect(basePrice(Category.armors, ArmorType.plate)).toBe(140);
    });

    it('The price for an item of category helmets should be 40', () => {
      expect(basePrice(Category.helmets)).toBe(40);
    });

    it('The price for an item of category shields should be 60', () => {
      expect(basePrice(Category.shields)).toBe(60);
    });

    it('The price for an item of category wands should be 120', () => {
      expect(basePrice(Category.wands)).toBe(120);
    });

    it('The price for an item of category scrolls should be 20', () => {
      expect(basePrice(Category.scrolls)).toBe(20);
    });

    it('The price for an item of category potions and type green should be 10', () => {
      expect(basePrice(Category.potions, PotionType.green)).toBe(10);
    });

    it('The price for an item of category potions and type blue should be 20', () => {
      expect(basePrice(Category.potions, PotionType.blue)).toBe(20);
    });

    it('The price for an item of category potions and type red should be 30', () => {
      expect(basePrice(Category.potions, PotionType.red)).toBe(30);
    });

    it('The price calculation for an item of unknown category should lead to an error', () => {
      expect(() => basePrice('testCategory' as unknown as Category)).toThrow(
        Error
      );
    });
  });

  describe('qualityPrice', () => {
    it(`The price shouldn't change if the quality is normal`, () => {
      expect(qualityPrice(100, Quality.normal)).toBe(0);
    });

    it('The price should double if the quality is improved', () => {
      expect(qualityPrice(100, Quality.improved)).toBe(100);
    });

    it('The price should triple if the quality is excellent', () => {
      expect(qualityPrice(100, Quality.excellent)).toBe(200);
    });
  });

  describe('effectPrice', () => {
    it(`The price shouldn't change if the effect power is none`, () => {
      expect(effectPrice(100, EffectPower.none)).toBe(0);
    });

    it('The price should double if the effect power is weak', () => {
      expect(effectPrice(100, EffectPower.weak)).toBe(100);
    });

    it('The price should triple if the effect power is average', () => {
      expect(effectPrice(100, EffectPower.average)).toBe(200);
    });

    it('The price should be 4 times as high if the effect power is strong', () => {
      expect(effectPrice(100, EffectPower.strong)).toBe(300);
    });
  });

  describe('createPriceEur', () => {
    it('Should create a valid price', () => {
      Math.random = jest.fn(() => 0.4);
      expect(
        createPriceEur(Category.swords, Quality.normal, EffectPower.average)
      ).toBe((300.0 + Math.round((0.4 * 2 - 1) * 300.0 * 0.05)) * 100 - 1);

      Math.random = jest.fn(() => 0.7);
      expect(
        createPriceEur(
          Category.axes,
          Quality.normal,
          EffectPower.average,
          AxeType.singleSided
        )
      ).toBe((240.0 + Math.round((0.7 * 2 - 1) * 240.0 * 0.05)) * 100 - 1);
    });
  });
});
