import {
  ArmorType,
  AxeType,
  Category,
  PotionType,
} from '@castleadmin/product-domain';
import { createType } from './type';

describe('type', () => {
  describe('createType', () => {
    describe('axes', () => {
      it('Should create type singleSided', () => {
        Math.random = jest.fn(() => 0.4);

        expect(createType(Category.axes)).toBe(AxeType.singleSided);
      });

      it('Should create type doubleSided', () => {
        Math.random = jest.fn(() => 0.6);

        expect(createType(Category.axes)).toBe(AxeType.doubleSided);
      });
    });

    describe('armors', () => {
      it('Should create type leather', () => {
        Math.random = jest.fn(() => 0.2);

        expect(createType(Category.armors)).toBe(ArmorType.leather);
      });

      it('Should create type chainmail', () => {
        Math.random = jest.fn(() => 0.5);

        expect(createType(Category.armors)).toBe(ArmorType.chainmail);
      });

      it('Should create type plate', () => {
        Math.random = jest.fn(() => 0.8);

        expect(createType(Category.armors)).toBe(ArmorType.plate);
      });
    });

    describe('potions', () => {
      it('Should create type green', () => {
        Math.random = jest.fn(() => 0.2);

        expect(createType(Category.potions)).toBe(PotionType.green);
      });

      it('Should create type blue', () => {
        Math.random = jest.fn(() => 0.5);

        expect(createType(Category.potions)).toBe(PotionType.blue);
      });

      it('Should create type red', () => {
        Math.random = jest.fn(() => 0.8);

        expect(createType(Category.potions)).toBe(PotionType.red);
      });
    });

    describe('others', () => {
      it('Should return undefined', () => {
        expect(createType(Category.bows)).toBe(undefined);
      });
    });
  });
});
