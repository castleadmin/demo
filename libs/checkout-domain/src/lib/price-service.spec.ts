import { Language } from './language';
import { PriceService } from './price-service';

describe('PriceService', () => {
  describe('getItemsTotalPriceEur', () => {
    it('Should return 0 if the item list is empty', () => {
      expect(PriceService.getItemsTotalPriceEur([])).toBe(0);
    });

    it('Should return the correct EUR price in cents', () => {
      const mockItem1 = { prices: { EUR: 15000 } };
      const mockItem2 = { prices: { EUR: 25001 } };
      const mockItem3 = { prices: { EUR: 35002 } };

      const items = [
        {
          quantity: 1,
          item: mockItem1,
        },
        {
          quantity: 2,
          item: mockItem2,
        },
        {
          quantity: 3,
          item: mockItem3,
        },
      ];

      expect(PriceService.getItemsTotalPriceEur(items)).toBe(170008);
    });
  });

  describe('getItemsTotalPriceEurString', () => {
    it('Should return 0 € if the item list is empty and the locale is de', () => {
      expect(PriceService.getItemsTotalPriceEurString([], Language.de)).toBe(
        '0\xa0€'
      );
    });

    it('Should return 0 € if the item list is empty and the locale is en-US', () => {
      expect(PriceService.getItemsTotalPriceEurString([], Language.enUs)).toBe(
        '€0'
      );
    });

    it('Should return the correct EUR price formatted according to locale de', () => {
      const mockItem1 = { prices: { EUR: 15000 } };
      const mockItem2 = { prices: { EUR: 25001 } };
      const mockItem3 = { prices: { EUR: 35002 } };

      const items = [
        {
          quantity: 1,
          item: mockItem1,
        },
        {
          quantity: 2,
          item: mockItem2,
        },
        {
          quantity: 3,
          item: mockItem3,
        },
      ];

      expect(PriceService.getItemsTotalPriceEurString(items, Language.de)).toBe(
        '1.700,08\xa0€'
      );
    });

    it('Should return the correct EUR price formatted according to locale en-US', () => {
      const mockItem1 = { prices: { EUR: 15000 } };
      const mockItem2 = { prices: { EUR: 25001 } };
      const mockItem3 = { prices: { EUR: 35002 } };

      const items = [
        {
          quantity: 1,
          item: mockItem1,
        },
        {
          quantity: 2,
          item: mockItem2,
        },
        {
          quantity: 3,
          item: mockItem3,
        },
      ];

      expect(
        PriceService.getItemsTotalPriceEurString(items, Language.enUs)
      ).toBe('€1,700.08');
    });
  });

  describe('getPriceStringEur', () => {
    describe('positive price', () => {
      it('Should return the price for 0 cents formatted according to locale de', () => {
        expect(PriceService.getPriceStringEur(0, Language.de)).toBe('0\xa0€');
      });

      it('Should return the price for 0 cents formatted according to locale en-US', () => {
        expect(PriceService.getPriceStringEur(0, Language.enUs)).toBe('€0');
      });

      it('Should return the price for 3 cents formatted according to locale de', () => {
        expect(PriceService.getPriceStringEur(3, Language.de)).toBe(
          '0,03\xa0€'
        );
      });

      it('Should return the price for 3 cents formatted according to locale en-US', () => {
        expect(PriceService.getPriceStringEur(3, Language.enUs)).toBe('€0.03');
      });

      it('Should return the price for 52 cents formatted according to locale de', () => {
        expect(PriceService.getPriceStringEur(52, Language.de)).toBe(
          '0,52\xa0€'
        );
      });

      it('Should return the price for 52 cents formatted according to locale en-US', () => {
        expect(PriceService.getPriceStringEur(52, Language.enUs)).toBe('€0.52');
      });

      it('Should return the price for 452 cents formatted according to locale de', () => {
        expect(PriceService.getPriceStringEur(452, Language.de)).toBe(
          '4,52\xa0€'
        );
      });

      it('Should return the price for 452 cents formatted according to locale en-US', () => {
        expect(PriceService.getPriceStringEur(452, Language.enUs)).toBe(
          '€4.52'
        );
      });

      it('Should return the price for 432152 cents formatted according to locale de', () => {
        expect(PriceService.getPriceStringEur(432152, Language.de)).toBe(
          '4.321,52\xa0€'
        );
      });

      it('Should return the price for 432152 cents formatted according to locale en-US', () => {
        expect(PriceService.getPriceStringEur(432152, Language.enUs)).toBe(
          '€4,321.52'
        );
      });
    });

    describe('negative price', () => {
      it('Should return the price for -0 cents formatted according to locale de', () => {
        expect(PriceService.getPriceStringEur(-0, Language.de)).toBe('0\xa0€');
      });

      it('Should return the price for -0 cents formatted according to locale en-US', () => {
        expect(PriceService.getPriceStringEur(-0, Language.enUs)).toBe('€0');
      });

      it('Should return the price for -3 cents formatted according to locale de', () => {
        expect(PriceService.getPriceStringEur(-3, Language.de)).toBe(
          '-0,03\xa0€'
        );
      });

      it('Should return the price for -3 cents formatted according to locale en-US', () => {
        expect(PriceService.getPriceStringEur(-3, Language.enUs)).toBe(
          '-€0.03'
        );
      });

      it('Should return the price for -52 cents formatted according to locale de', () => {
        expect(PriceService.getPriceStringEur(-52, Language.de)).toBe(
          '-0,52\xa0€'
        );
      });

      it('Should return the price for -52 cents formatted according to locale en-US', () => {
        expect(PriceService.getPriceStringEur(-52, Language.enUs)).toBe(
          '-€0.52'
        );
      });

      it('Should return the price for -452 cents formatted according to locale de', () => {
        expect(PriceService.getPriceStringEur(-452, Language.de)).toBe(
          '-4,52\xa0€'
        );
      });

      it('Should return the price for -452 cents formatted according to locale en-US', () => {
        expect(PriceService.getPriceStringEur(-452, Language.enUs)).toBe(
          '-€4.52'
        );
      });

      it('Should return the price for -432152 cents formatted according to locale de', () => {
        expect(PriceService.getPriceStringEur(-432152, Language.de)).toBe(
          '-4.321,52\xa0€'
        );
      });

      it('Should return the price for -432152 cents formatted according to locale en-US', () => {
        expect(PriceService.getPriceStringEur(-432152, Language.enUs)).toBe(
          '-€4,321.52'
        );
      });
    });

    it("Should throw an error if the number isn't finite", () => {
      expect(() =>
        PriceService.getPriceStringEur(Number.NaN, Language.de)
      ).toThrow(Error);
    });
  });
});
