import {
  AxeType,
  Category,
  EffectPower,
  Item,
  Quality,
} from '@castleadmin/product-domain';
import { Interval, intervalToDuration } from 'date-fns';
import { Country } from './country';
import { Language } from './language';
import { ShippingOption } from './shipping-option';
import { ShippingService } from './shipping-service';

describe('ShippingService', () => {
  describe('getDeliveryDate', () => {
    let item: Item;

    beforeEach(() => {
      item = {
        _id: 'abcdef123456abcdef123456',
        category: Category.axes,
        ean: 'ean',
        effect: 'effect',
        effectPower: EffectPower.none,
        halfStars: 8,
        isInStock: true,
        popularity: 1,
        prices: {
          EUR: 2,
        },
        quality: Quality.normal,
        ratingCount: 100,
        translations: {
          de: {
            name: 'nameDe',
            description: 'descriptionDe',
          },
          enUs: {
            name: 'nameEnUs',
            description: 'descriptionEnUs',
          },
        },
        type: AxeType.singleSided,
      } as Item;
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('Should be a delay of 2 days for standard national shipping in Germany', () => {
      const startDate = new Date('2023-01-02T08:10:12.000Z');
      jest.useFakeTimers({ now: startDate });

      Math.random = jest.fn(() => 0.1);

      const result = ShippingService.getDeliveryDate(
        item,
        Country.Germany,
        ShippingOption.standard
      );
      const resultDate = new Date(result);

      const interval = {
        start: startDate,
        end: resultDate,
      } as Interval;

      expect(intervalToDuration(interval).days).toBe(2);
    });

    it('Should be a delay of 2 days for standard national shipping in the United States', () => {
      const startDate = new Date('2023-01-02T08:10:12.000Z');
      jest.useFakeTimers({ now: startDate });

      Math.random = jest.fn(() => 0.1);

      const result = ShippingService.getDeliveryDate(
        item,
        Country.UnitedStates,
        ShippingOption.standard
      );
      const resultDate = new Date(result);

      const interval = {
        start: startDate,
        end: resultDate,
      } as Interval;

      expect(intervalToDuration(interval).days).toBe(2);
    });

    it('Should be a delay of 3 days for standard national shipping', () => {
      const startDate = new Date('2023-01-02T08:10:12.000Z');
      jest.useFakeTimers({ now: startDate });

      Math.random = jest.fn(() => 0.8);

      const result = ShippingService.getDeliveryDate(
        item,
        Country.Germany,
        ShippingOption.standard
      );
      const resultDate = new Date(result);

      const interval = {
        start: startDate,
        end: resultDate,
      } as Interval;

      expect(intervalToDuration(interval).days).toBe(3);
    });

    it('Should be a delay of 1 day for express national shipping', () => {
      const startDate = new Date('2023-01-02T08:10:12.000Z');
      jest.useFakeTimers({ now: startDate });

      Math.random = jest.fn(() => 0.8);

      const result = ShippingService.getDeliveryDate(
        item,
        Country.Germany,
        ShippingOption.express
      );
      const resultDate = new Date(result);

      const interval = {
        start: startDate,
        end: resultDate,
      } as Interval;

      expect(intervalToDuration(interval).days).toBe(1);
    });

    it('Should be a delay of 4 days for standard international shipping', () => {
      const startDate = new Date('2023-01-02T08:10:12.000Z');
      jest.useFakeTimers({ now: startDate });

      Math.random = jest.fn(() => 0.01);

      const result = ShippingService.getDeliveryDate(
        item,
        Country.France,
        ShippingOption.standard
      );
      const resultDate = new Date(result);

      const interval = {
        start: startDate,
        end: resultDate,
      } as Interval;

      expect(intervalToDuration(interval).days).toBe(4);
    });

    it('Should be a delay of 10 days for standard international shipping', () => {
      const startDate = new Date('2023-01-02T08:10:12.000Z');
      jest.useFakeTimers({ now: startDate });

      Math.random = jest.fn(() => 0.999);

      const result = ShippingService.getDeliveryDate(
        item,
        Country.France,
        ShippingOption.standard
      );
      const resultDate = new Date(result);

      const interval = {
        start: startDate,
        end: resultDate,
      } as Interval;

      expect(intervalToDuration(interval).days).toBe(10);
    });

    it('Should be a delay of 3 days for express international shipping', () => {
      const startDate = new Date('2023-01-02T08:10:12.000Z');
      jest.useFakeTimers({ now: startDate });

      Math.random = jest.fn(() => 0.001);

      const result = ShippingService.getDeliveryDate(
        item,
        Country.France,
        ShippingOption.express
      );
      const resultDate = new Date(result);

      const interval = {
        start: startDate,
        end: resultDate,
      } as Interval;

      expect(intervalToDuration(interval).days).toBe(3);
    });

    it('Should be a delay of 7 days for express international shipping', () => {
      const startDate = new Date('2023-01-02T08:10:12.000Z');
      jest.useFakeTimers({ now: startDate });

      Math.random = jest.fn(() => 0.999);

      const result = ShippingService.getDeliveryDate(
        item,
        Country.France,
        ShippingOption.express
      );
      const resultDate = new Date(result);

      const interval = {
        start: startDate,
        end: resultDate,
      } as Interval;

      expect(intervalToDuration(interval).days).toBe(7);
    });

    it("Should be a delay of 10 days for standard national shipping if the item isn't in stock", () => {
      const startDate = new Date('2023-01-02T08:10:12.000Z');
      jest.useFakeTimers({ now: startDate });

      item.isInStock = false;

      Math.random = jest.fn(() => 0.8);

      const result = ShippingService.getDeliveryDate(
        item,
        Country.Germany,
        ShippingOption.standard
      );
      const resultDate = new Date(result);

      const interval = {
        start: startDate,
        end: resultDate,
      } as Interval;

      expect(intervalToDuration(interval).days).toBe(10);
    });

    it('Should be a delay of 4 days for standard national shipping if the delivery date is sunday', () => {
      const startDate = new Date('2023-01-05T08:10:12.000Z');
      jest.useFakeTimers({ now: startDate });

      const result = ShippingService.getDeliveryDate(
        item,
        Country.Germany,
        ShippingOption.standard
      );
      const resultDate = new Date(result);

      const interval = {
        start: startDate,
        end: resultDate,
      } as Interval;

      expect(intervalToDuration(interval).days).toBe(4);
    });

    it('Should remove the time component of the date', () => {
      const startDate = new Date('2023-01-02T08:10:12.000Z');
      jest.useFakeTimers({ now: startDate });

      Math.random = jest.fn(() => 0.1);

      const result = ShippingService.getDeliveryDate(
        item,
        Country.Germany,
        ShippingOption.standard
      );
      const resultDate = new Date(result);

      const interval = {
        start: startDate,
        end: resultDate,
      } as Interval;

      expect(intervalToDuration(interval).days).toBe(2);
      expect(resultDate.toISOString()).toBe('2023-01-04T12:00:00.000Z');
    });
  });

  describe('getShippingPriceEur', () => {
    it('Should return the correct price of a national standard shipping (Germany)', () => {
      expect(
        ShippingService.getShippingPriceEur(
          Country.Germany,
          ShippingOption.standard
        )
      ).toBe(600);
    });

    it('Should return the correct price of a national standard shipping (United States)', () => {
      expect(
        ShippingService.getShippingPriceEur(
          Country.UnitedStates,
          ShippingOption.standard
        )
      ).toBe(600);
    });

    it('Should return the correct price of a national express shipping (Germany)', () => {
      expect(
        ShippingService.getShippingPriceEur(
          Country.Germany,
          ShippingOption.express
        )
      ).toBe(1400);
    });

    it('Should return the correct price of a national express shipping (United States)', () => {
      expect(
        ShippingService.getShippingPriceEur(
          Country.UnitedStates,
          ShippingOption.express
        )
      ).toBe(1400);
    });

    it('Should return the correct price of an international standard shipping', () => {
      expect(
        ShippingService.getShippingPriceEur(
          Country.France,
          ShippingOption.standard
        )
      ).toBe(1200);
    });

    it('Should return the correct price of an international express shipping', () => {
      expect(
        ShippingService.getShippingPriceEur(
          Country.France,
          ShippingOption.express
        )
      ).toBe(2800);
    });

    it("Should throw an error if the shipping option isn't supported", () => {
      expect(() =>
        ShippingService.getShippingPriceEur(
          Country.Germany,
          'test' as ShippingOption
        )
      ).toThrow(Error);
    });
  });

  describe('getShippingPriceEurString', () => {
    describe('locale de', () => {
      it('Should return the correct price of a national standard shipping (Germany)', () => {
        expect(
          ShippingService.getShippingPriceEurString(
            Country.Germany,
            ShippingOption.standard,
            Language.de
          )
        ).toBe('6,00\xa0€');
      });

      it('Should return the correct price of a national standard shipping (United States)', () => {
        expect(
          ShippingService.getShippingPriceEurString(
            Country.UnitedStates,
            ShippingOption.standard,
            Language.de
          )
        ).toBe('6,00\xa0€');
      });

      it('Should return the correct price of a national express shipping (Germany)', () => {
        expect(
          ShippingService.getShippingPriceEurString(
            Country.Germany,
            ShippingOption.express,
            Language.de
          )
        ).toBe('14,00\xa0€');
      });

      it('Should return the correct price of a national express shipping (United States)', () => {
        expect(
          ShippingService.getShippingPriceEurString(
            Country.UnitedStates,
            ShippingOption.express,
            Language.de
          )
        ).toBe('14,00\xa0€');
      });

      it('Should return the correct price of an international standard shipping', () => {
        expect(
          ShippingService.getShippingPriceEurString(
            Country.France,
            ShippingOption.standard,
            Language.de
          )
        ).toBe('12,00\xa0€');
      });

      it('Should return the correct price of an international express shipping', () => {
        expect(
          ShippingService.getShippingPriceEurString(
            Country.France,
            ShippingOption.express,
            Language.de
          )
        ).toBe('28,00\xa0€');
      });

      it("Should throw an error if the shipping option isn't supported", () => {
        expect(() =>
          ShippingService.getShippingPriceEurString(
            Country.Germany,
            'test' as ShippingOption,
            Language.de
          )
        ).toThrow(Error);
      });
    });

    describe('locale en-US', () => {
      it('Should return the correct price of a national standard shipping (Germany)', () => {
        expect(
          ShippingService.getShippingPriceEurString(
            Country.Germany,
            ShippingOption.standard,
            Language.enUs
          )
        ).toBe('€6.00');
      });

      it('Should return the correct price of a national standard shipping (United States)', () => {
        expect(
          ShippingService.getShippingPriceEurString(
            Country.UnitedStates,
            ShippingOption.standard,
            Language.enUs
          )
        ).toBe('€6.00');
      });

      it('Should return the correct price of a national express shipping (Germany)', () => {
        expect(
          ShippingService.getShippingPriceEurString(
            Country.Germany,
            ShippingOption.express,
            Language.enUs
          )
        ).toBe('€14.00');
      });

      it('Should return the correct price of a national express shipping (United States)', () => {
        expect(
          ShippingService.getShippingPriceEurString(
            Country.UnitedStates,
            ShippingOption.express,
            Language.enUs
          )
        ).toBe('€14.00');
      });

      it('Should return the correct price of an international standard shipping', () => {
        expect(
          ShippingService.getShippingPriceEurString(
            Country.France,
            ShippingOption.standard,
            Language.enUs
          )
        ).toBe('€12.00');
      });

      it('Should return the correct price of an international express shipping', () => {
        expect(
          ShippingService.getShippingPriceEurString(
            Country.France,
            ShippingOption.express,
            Language.enUs
          )
        ).toBe('€28.00');
      });

      it("Should throw an error if the shipping option isn't supported", () => {
        expect(() =>
          ShippingService.getShippingPriceEurString(
            Country.Germany,
            'test' as ShippingOption,
            Language.enUs
          )
        ).toThrow(Error);
      });
    });
  });

  describe('isInternationalShipping', () => {
    it('Should return false if the country is Germany or the United States', () => {
      expect(ShippingService.isInternationalShipping(Country.Germany)).toBe(
        false
      );
      expect(
        ShippingService.isInternationalShipping(Country.UnitedStates)
      ).toBe(false);
    });

    it("Should return true if the country isn't Germany and isn't the United States", () => {
      Object.values(Country)
        .filter(
          (country) =>
            country !== Country.Germany && country !== Country.UnitedStates
        )
        .forEach((country) =>
          expect(ShippingService.isInternationalShipping(country)).toBe(true)
        );
    });
  });
});
