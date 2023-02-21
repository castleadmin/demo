import {
  ArmorType,
  AxeType,
  Category,
  Quality,
} from '@castleadmin/product-domain';
import { createQuality } from './quality';
import MockedFunction = jest.MockedFunction;

describe('quality', () => {
  describe('createQuality', () => {
    describe('axes', () => {
      it('Should create quality normal for type singleSided', () => {
        Math.random = jest.fn(() => 0.1);

        expect(createQuality(Category.axes, AxeType.singleSided)).toBe(
          Quality.normal
        );
      });

      it('Should create quality improved for type singleSided', () => {
        Math.random = jest.fn(() => 0.6);

        expect(createQuality(Category.axes, AxeType.singleSided)).toBe(
          Quality.improved
        );
      });

      it('Should create quality excellent for type singleSided', () => {
        Math.random = jest.fn(() => 0.9);

        expect(createQuality(Category.axes, AxeType.singleSided)).toBe(
          Quality.excellent
        );
      });

      it('Should create quality normal for type doubleSided', () => {
        Math.random = jest.fn(() => 0.1);

        expect(createQuality(Category.axes, AxeType.doubleSided)).toBe(
          Quality.normal
        );
      });

      it('Should create quality improved for type doubleSided', () => {
        Math.random = jest.fn(() => 0.6);

        expect(createQuality(Category.axes, AxeType.doubleSided)).toBe(
          Quality.improved
        );
      });

      it('Should create quality excellent for type doubleSided', () => {
        Math.random = jest.fn(() => 0.9);

        expect(createQuality(Category.axes, AxeType.doubleSided)).toBe(
          Quality.excellent
        );
      });
    });

    describe('armors', () => {
      it('Should create quality normal for type leather', () => {
        Math.random = jest.fn(() => 0.1);

        expect(createQuality(Category.armors, ArmorType.leather)).toBe(
          Quality.normal
        );

        (Math.random as MockedFunction<typeof Math.random>).mockReturnValueOnce(
          0.6
        );

        expect(createQuality(Category.armors, ArmorType.leather)).toBe(
          Quality.normal
        );

        (Math.random as MockedFunction<typeof Math.random>).mockReturnValueOnce(
          0.9
        );

        expect(createQuality(Category.armors, ArmorType.leather)).toBe(
          Quality.normal
        );
      });

      it('Should create quality normal for type chainmail', () => {
        Math.random = jest.fn(() => 0.1);

        expect(createQuality(Category.armors, ArmorType.chainmail)).toBe(
          Quality.normal
        );

        (Math.random as MockedFunction<typeof Math.random>).mockReturnValueOnce(
          0.6
        );

        expect(createQuality(Category.armors, ArmorType.chainmail)).toBe(
          Quality.normal
        );

        (Math.random as MockedFunction<typeof Math.random>).mockReturnValueOnce(
          0.9
        );

        expect(createQuality(Category.armors, ArmorType.chainmail)).toBe(
          Quality.normal
        );
      });

      it('Should create quality normal for type plate', () => {
        Math.random = jest.fn(() => 0.1);

        expect(createQuality(Category.armors, ArmorType.plate)).toBe(
          Quality.normal
        );

        (Math.random as MockedFunction<typeof Math.random>).mockReturnValueOnce(
          0.6
        );

        expect(createQuality(Category.armors, ArmorType.plate)).toBe(
          Quality.normal
        );
      });

      it('Should create quality excellent for type plate', () => {
        Math.random = jest.fn(() => 0.9);

        expect(createQuality(Category.armors, ArmorType.plate)).toBe(
          Quality.excellent
        );
      });
    });

    describe('scrolls', () => {
      it('Should create quality normal', () => {
        Math.random = jest.fn(() => 0.1);

        expect(createQuality(Category.scrolls)).toBe(Quality.normal);

        (Math.random as MockedFunction<typeof Math.random>).mockReturnValueOnce(
          0.6
        );

        expect(createQuality(Category.scrolls)).toBe(Quality.normal);

        (Math.random as MockedFunction<typeof Math.random>).mockReturnValueOnce(
          0.9
        );

        expect(createQuality(Category.scrolls)).toBe(Quality.normal);
      });
    });

    describe('potions', () => {
      it('Should create quality normal', () => {
        Math.random = jest.fn(() => 0.1);

        expect(createQuality(Category.potions)).toBe(Quality.normal);

        (Math.random as MockedFunction<typeof Math.random>).mockReturnValueOnce(
          0.6
        );

        expect(createQuality(Category.potions)).toBe(Quality.normal);

        (Math.random as MockedFunction<typeof Math.random>).mockReturnValueOnce(
          0.9
        );

        expect(createQuality(Category.potions)).toBe(Quality.normal);
      });
    });

    describe('others', () => {
      it('Should create quality normal', () => {
        Math.random = jest.fn(() => 0.1);

        expect(createQuality(Category.bows)).toBe(Quality.normal);

        (Math.random as MockedFunction<typeof Math.random>).mockReturnValueOnce(
          0.6
        );

        expect(createQuality(Category.bows)).toBe(Quality.normal);
      });

      it('Should create quality excellent', () => {
        Math.random = jest.fn(() => 0.9);

        expect(createQuality(Category.bows)).toBe(Quality.excellent);
      });
    });
  });
});
