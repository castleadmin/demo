import {
  ArmorType,
  Category,
  EffectPower,
  Quality,
} from '@castleadmin/product-domain';
import { createHalfStars, createRatingCount } from './rating';

describe('rating', () => {
  describe('createHalfStars', () => {
    it('Should be 2(0) half stars', () => {
      Math.random = jest.fn(() => 0);

      expect(
        createHalfStars(Category.axes, Quality.normal, EffectPower.none)
      ).toBe(2);
    });

    it('Should be 2(1) half stars', () => {
      Math.random = jest.fn(() => 0);

      expect(
        createHalfStars(Category.axes, Quality.improved, EffectPower.none)
      ).toBe(2);
    });

    it('Should be 2 half stars', () => {
      Math.random = jest.fn(() => 0);

      expect(
        createHalfStars(Category.axes, Quality.excellent, EffectPower.none)
      ).toBe(2);
    });

    it('Should be 3 half stars', () => {
      Math.random = jest.fn(() => 0);

      expect(
        createHalfStars(Category.axes, Quality.excellent, EffectPower.weak)
      ).toBe(3);
    });

    it('Should be 4 half stars', () => {
      Math.random = jest.fn(() => 0);

      expect(
        createHalfStars(Category.axes, Quality.excellent, EffectPower.average)
      ).toBe(4);
    });

    it('Should be 5 half stars', () => {
      Math.random = jest.fn(() => 0);

      expect(
        createHalfStars(Category.axes, Quality.excellent, EffectPower.strong)
      ).toBe(5);
    });

    it('Should be 6 half stars', () => {
      Math.random = jest.fn(() => 0.2);

      expect(
        createHalfStars(Category.axes, Quality.excellent, EffectPower.strong)
      ).toBe(6);
    });

    it('Should be 7 half stars', () => {
      Math.random = jest.fn(() => 0.3);

      expect(
        createHalfStars(Category.axes, Quality.excellent, EffectPower.strong)
      ).toBe(7);
    });

    it('Should be 8 half stars', () => {
      Math.random = jest.fn(() => 0.4);

      expect(
        createHalfStars(Category.axes, Quality.excellent, EffectPower.strong)
      ).toBe(8);
    });

    it('Should be 9 half stars', () => {
      Math.random = jest.fn(() => 0.5);

      expect(
        createHalfStars(Category.axes, Quality.excellent, EffectPower.strong)
      ).toBe(9);
    });

    it('Should be 10 half stars', () => {
      Math.random = jest.fn(() => 0.7);

      expect(
        createHalfStars(Category.axes, Quality.excellent, EffectPower.strong)
      ).toBe(10);
    });

    it('Should be 10(11) half stars', () => {
      Math.random = jest.fn(() => 0.8);

      expect(
        createHalfStars(Category.axes, Quality.excellent, EffectPower.strong)
      ).toBe(10);
    });

    it('Should be 10(12) half stars', () => {
      Math.random = jest.fn(() => 0.9);

      expect(
        createHalfStars(Category.axes, Quality.excellent, EffectPower.strong)
      ).toBe(10);
    });

    describe('armors', () => {
      describe('leather', () => {
        it('Should be 10 half stars', () => {
          Math.random = jest.fn(() => 0.7);

          expect(
            createHalfStars(
              Category.armors,
              Quality.normal,
              EffectPower.strong,
              ArmorType.leather
            )
          ).toBe(10);
        });

        it('Should be 10(11) half stars', () => {
          Math.random = jest.fn(() => 0.8);

          expect(
            createHalfStars(
              Category.armors,
              Quality.normal,
              EffectPower.strong,
              ArmorType.leather
            )
          ).toBe(10);
        });

        it('Should be 10(12) half stars', () => {
          Math.random = jest.fn(() => 0.9);

          expect(
            createHalfStars(
              Category.armors,
              Quality.normal,
              EffectPower.strong,
              ArmorType.leather
            )
          ).toBe(10);
        });
      });

      describe('chainmail', () => {
        it('Should be 10 half stars', () => {
          Math.random = jest.fn(() => 0.7);

          expect(
            createHalfStars(
              Category.armors,
              Quality.normal,
              EffectPower.strong,
              ArmorType.chainmail
            )
          ).toBe(10);
        });

        it('Should be 10(11) half stars', () => {
          Math.random = jest.fn(() => 0.8);

          expect(
            createHalfStars(
              Category.armors,
              Quality.normal,
              EffectPower.strong,
              ArmorType.chainmail
            )
          ).toBe(10);
        });

        it('Should be 10(12) half stars', () => {
          Math.random = jest.fn(() => 0.9);

          expect(
            createHalfStars(
              Category.armors,
              Quality.normal,
              EffectPower.strong,
              ArmorType.chainmail
            )
          ).toBe(10);
        });
      });

      describe('plate', () => {
        it('Should be 8 half stars', () => {
          Math.random = jest.fn(() => 0.7);

          expect(
            createHalfStars(
              Category.armors,
              Quality.normal,
              EffectPower.strong,
              ArmorType.plate
            )
          ).toBe(8);
        });

        it('Should be 9 half stars', () => {
          Math.random = jest.fn(() => 0.8);

          expect(
            createHalfStars(
              Category.armors,
              Quality.normal,
              EffectPower.strong,
              ArmorType.plate
            )
          ).toBe(9);
        });

        it('Should be 10 half stars', () => {
          Math.random = jest.fn(() => 0.9);

          expect(
            createHalfStars(
              Category.armors,
              Quality.normal,
              EffectPower.strong,
              ArmorType.plate
            )
          ).toBe(10);
        });
      });
    });

    describe('potions', () => {
      it('Should be 10 half stars', () => {
        Math.random = jest.fn(() => 0.7);

        expect(
          createHalfStars(Category.potions, Quality.normal, EffectPower.strong)
        ).toBe(10);
      });

      it('Should be 10(11) half stars', () => {
        Math.random = jest.fn(() => 0.8);

        expect(
          createHalfStars(Category.potions, Quality.normal, EffectPower.strong)
        ).toBe(10);
      });

      it('Should be 10(12) half stars', () => {
        Math.random = jest.fn(() => 0.9);

        expect(
          createHalfStars(Category.potions, Quality.normal, EffectPower.strong)
        ).toBe(10);
      });
    });

    describe('scrolls', () => {
      it('Should be 10 half stars', () => {
        Math.random = jest.fn(() => 0.7);

        expect(
          createHalfStars(Category.scrolls, Quality.normal, EffectPower.strong)
        ).toBe(10);
      });

      it('Should be 10(11) half stars', () => {
        Math.random = jest.fn(() => 0.8);

        expect(
          createHalfStars(Category.scrolls, Quality.normal, EffectPower.strong)
        ).toBe(10);
      });

      it('Should be 10(12) half stars', () => {
        Math.random = jest.fn(() => 0.9);

        expect(
          createHalfStars(Category.scrolls, Quality.normal, EffectPower.strong)
        ).toBe(10);
      });
    });
  });

  describe('createRatingCount', () => {
    it('The rating count should be 200', () => {
      Math.random = jest.fn(() => 0.1);
      expect(createRatingCount(0.2)).toBe(200);
    });

    it('The rating count should be 9000', () => {
      Math.random = jest.fn(() => 0.9);
      expect(createRatingCount(1)).toBe(9000);
    });
  });
});
