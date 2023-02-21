import { Item } from '@castleadmin/product-domain';
import { Country } from './country';
import { Language } from './language';
import { PriceService } from './price-service';
import { ShippingOption } from './shipping-option';

/**
 * Used to get shipping information during the checkout process.
 * DDD <<DomainService>>
 */
export const ShippingService = {
  /**
   * Estimates the delivery date based on the order information.
   */
  getDeliveryDate: function (
    item: Item,
    country: Country,
    shippingOption: ShippingOption
  ): string {
    let totalTimeInDays = 0;
    let timeInDays = 0;
    const isInternationalShipment =
      ShippingService.isInternationalShipping(country);

    switch (shippingOption) {
      case ShippingOption.standard:
        if (isInternationalShipment) {
          // range in days [4, 10]
          timeInDays = 4 + Math.floor(Math.random() * 7);
        } else {
          // range in days [2, 3]
          timeInDays = 2 + Math.floor(Math.random() * 2);
        }
        totalTimeInDays += timeInDays;
        break;
      case ShippingOption.express:
        if (isInternationalShipment) {
          // range in days [3, 7]
          timeInDays = 3 + Math.floor(Math.random() * 5);
        } else {
          // range in days [1, 1]
          timeInDays = 1;
        }
        totalTimeInDays += timeInDays;
        break;
    }

    if (!item.isInStock) {
      totalTimeInDays += 7;
    }

    const date = new Date();
    date.setUTCDate(date.getUTCDate() + totalTimeInDays);

    // if the delivery date is sunday
    if (date.getUTCDay() === 0) {
      date.setUTCDate(date.getUTCDate() + 1);
    }

    // remove time from date
    date.setUTCHours(12, 0, 0, 0);

    return date.toISOString();
  },

  /**
   * Calculates the order shipping price in EUR (cents).
   */
  getShippingPriceEur: function (
    country: Country,
    shippingOption: ShippingOption
  ): number {
    let price: number | undefined = undefined;
    const isInternationalShipment =
      ShippingService.isInternationalShipping(country);

    switch (shippingOption) {
      case ShippingOption.standard:
        price = 6;
        break;
      case ShippingOption.express:
        price = 14;
        break;
    }

    if (price === undefined) {
      throw new Error(`Shipping Option isn't supported ${shippingOption}`);
    }

    if (isInternationalShipment) {
      price = price * 2;
    }

    // price in cents
    price = price * 100;

    return price;
  },

  /**
   * Retrieve the shipping price as string.
   */
  getShippingPriceEurString: function (
    country: Country,
    shippingOption: ShippingOption,
    locale: Language
  ): string {
    const price = ShippingService.getShippingPriceEur(country, shippingOption);

    return PriceService.getPriceStringEur(price, locale);
  },

  /**
   * Determine if it is an international shipping.
   */
  isInternationalShipping(country: Country): boolean {
    return country !== Country.Germany && country !== Country.UnitedStates;
  },
};
