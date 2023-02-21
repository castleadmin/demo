import { Category, EffectPower } from '@castleadmin/product-domain';
import { createEffect, createEffectPower } from './effect';
import MockedFunction = jest.MockedFunction;

describe('effect', () => {
  describe('createEffect', () => {
    it('Should create an axes effect', () => {
      expect(
        createEffect(Category.axes, EffectPower.weak)?.categories
      ).toContain(Category.axes);
    });
    it('Should create a hammers effect', () => {
      expect(
        createEffect(Category.hammers, EffectPower.weak)?.categories
      ).toContain(Category.hammers);
    });
    it('Should create a spears effect', () => {
      expect(
        createEffect(Category.spears, EffectPower.weak)?.categories
      ).toContain(Category.spears);
    });
    it('Should create a daggers effect', () => {
      expect(
        createEffect(Category.daggers, EffectPower.weak)?.categories
      ).toContain(Category.daggers);
    });
    it('Should create a swords effect', () => {
      expect(
        createEffect(Category.swords, EffectPower.weak)?.categories
      ).toContain(Category.swords);
    });
    it('Should create a bows effect', () => {
      expect(
        createEffect(Category.bows, EffectPower.weak)?.categories
      ).toContain(Category.bows);
    });
    it('Should create an armors effect', () => {
      expect(
        createEffect(Category.armors, EffectPower.weak)?.categories
      ).toContain(Category.armors);
    });
    it('Should create a helmets effect', () => {
      expect(
        createEffect(Category.helmets, EffectPower.weak)?.categories
      ).toContain(Category.helmets);
    });
    it('Should create a shields effect', () => {
      expect(
        createEffect(Category.shields, EffectPower.weak)?.categories
      ).toContain(Category.shields);
    });
    it('Should create a wands effect', () => {
      expect(
        createEffect(Category.wands, EffectPower.weak)?.categories
      ).toContain(Category.wands);
    });
    it('Should create a scrolls effect', () => {
      expect(
        createEffect(Category.scrolls, EffectPower.weak)?.categories
      ).toContain(Category.scrolls);
    });
    it('Should create a potions effect', () => {
      expect(
        createEffect(Category.potions, EffectPower.weak)?.categories
      ).toContain(Category.potions);
    });
    it(`Shouldn't create an effect if the effectPower is none`, () => {
      expect(createEffect(Category.potions, EffectPower.none)).toBe(undefined);
    });
    it('Should throw an error if the category is invalid', () => {
      expect(() =>
        createEffect(undefined as unknown as Category, EffectPower.weak)
      ).toThrow(Error);
    });
  });

  describe('createEffectPower', () => {
    it('Potions should always have an effect', () => {
      expect(createEffectPower(Category.potions)).not.toBe(EffectPower.none);
    });
    it('Scrolls should always have an effect', () => {
      expect(createEffectPower(Category.scrolls)).not.toBe(EffectPower.none);
    });

    it('Should have an effect', () => {
      Math.random = jest.fn(() => 0.2);

      expect(createEffectPower(Category.axes)).toBe(EffectPower.weak);

      (Math.random as MockedFunction<typeof Math.random>).mockReturnValue(0.5);

      expect(createEffectPower(Category.swords)).toBe(EffectPower.average);

      (Math.random as MockedFunction<typeof Math.random>).mockReturnValue(0.9);

      expect(createEffectPower(Category.armors)).toBe(EffectPower.strong);
    });

    it(`Shouldn't have an effect`, () => {
      Math.random = jest.fn(() => 0.05);

      expect(createEffectPower(Category.axes)).toBe(EffectPower.none);
    });
  });
});
