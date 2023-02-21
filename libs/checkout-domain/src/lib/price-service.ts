import { Item } from '@castleadmin/product-domain';
import { Language } from './language';

/**
 * Reduced form of an item which is used for price calculations.
 */
export type PriceItem = Pick<Item, 'prices'>;

/**
 * Represents an item with an associated quantity.
 */
export interface PriceItemWithQuantity {
  item: PriceItem;
  quantity: number;
}

/**
 * Used to calculate and format prices during the checkout process.
 * DDD <<DomainService>>
 */
export const PriceService = {
  /**
   * Get the total price of the given items in EUR.
   */
  getItemsTotalPriceEur: function (items: PriceItemWithQuantity[]): number {
    const totalPrice = items.reduce((sum, item) => {
      sum += item.item.prices.EUR * item.quantity;

      return sum;
    }, 0);

    return totalPrice;
  },

  /**
   * Get the total price as string of the given items in EUR.
   */
  getItemsTotalPriceEurString: function (
    items: PriceItemWithQuantity[],
    locale: Language
  ): string {
    const totalPrice = PriceService.getItemsTotalPriceEur(items);

    return PriceService.getPriceStringEur(totalPrice, locale);
  },

  /**
   * Get the price as string with a currency indicator.
   */
  getPriceStringEur: function (price: number, locale: Language) {
    if (!Number.isFinite(price)) {
      throw new Error(`Invalid price ${price}`);
    }

    if (price === 0) {
      const eurZeroFormatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });

      return eurZeroFormatter.format(0);
    }

    const eurFormatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return eurFormatter.format(price / 100);
  },
};
