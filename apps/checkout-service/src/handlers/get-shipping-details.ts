import {
  Country,
  DeliveryDateItem,
  ShippingOption,
  ShippingService,
} from '@castleadmin/checkout-domain';
import { Item } from '@castleadmin/product-domain';
import { createHandler, ErrorResponse } from '@castleadmin/serverless-utils';
import { Handler } from 'aws-lambda';
import { environment } from '../environments/environment';

interface GetShippingDetailsResponse {
  shippingPrices: {
    EUR: number;
  };
  deliveryDateItems: DeliveryDateItem[];
}

export const handler = createHandler<
  Handler<
    {
      items: Item[];
      country: Country;
      shippingOption: ShippingOption;
    },
    ErrorResponse | GetShippingDetailsResponse
  >
>(environment, async (event) => {
  const items = event.items;
  if (!items) {
    return {
      error: 'Missing items parameter',
    };
  }
  const country = event.country;
  if (!country) {
    return {
      error: 'Missing country parameter',
    };
  }
  const shippingOption = event.shippingOption;
  if (!shippingOption) {
    return {
      error: 'Missing shippingOption parameter',
    };
  }

  const shippingPriceEur = ShippingService.getShippingPriceEur(
    country,
    shippingOption
  );

  const deliveryDateItems = items.map((item) => {
    const deliveryDate = ShippingService.getDeliveryDate(
      item,
      country,
      shippingOption
    );

    return {
      itemId: item._id,
      deliveryDate,
    };
  });

  return {
    shippingPrices: {
      EUR: shippingPriceEur,
    },
    deliveryDateItems,
  } as GetShippingDetailsResponse;
});
