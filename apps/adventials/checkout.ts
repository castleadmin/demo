import {
  ApprovalOrder,
  CreateOrder,
  Language,
  PriceService,
  ShippingOption,
} from '@castleadmin/checkout-domain';
import { CheckoutApprovalOrderItem, DeliveryDateItem } from './item';

export type CheckoutFormData = Omit<CreateOrder, 'language' | 'items'>;

export type CheckoutApprovalOrder = Omit<
  ApprovalOrder,
  'language' | 'validationResult' | 'checkItemsResult'
> & {
  checkItemsResult: {
    hasValidItems: boolean;
    invalidItemIds: string[];
    checkedItems: CheckoutApprovalOrderItem[];
  };
};

export interface DeliveryDateItemGroup {
  deliveryDate: string;
  items: DeliveryDateItem[];
}

export interface DeliveryDateOrder {
  groups: DeliveryDateItemGroup[];
  shippingOption: ShippingOption;
  /**
   * in cents
   */
  totalPriceItemsEur: string;
  /**
   * in cents
   */
  shippingPriceEur: string;
  /**
   * in cents
   */
  totalPriceEur: string;
}

export function toDeliveryDateOrder(
  order: CheckoutApprovalOrder,
  locale: Language
): DeliveryDateOrder {
  const quantityMap = new Map<string, number>();
  order.items.forEach((item) => quantityMap.set(item.itemId, item.quantity));

  const itemMap = new Map<string, CheckoutApprovalOrderItem>();
  order.checkItemsResult.checkedItems.forEach((item) =>
    itemMap.set(item._id, item)
  );

  const deliveryDateSet = new Set<string>();
  const idsMap = new Map<string, string[]>();
  order.shippingResult.deliveryDateItems.forEach((item) => {
    deliveryDateSet.add(item.deliveryDate);
    const ids = idsMap.get(item.deliveryDate) ?? [];
    ids.push(item.itemId);
    idsMap.set(item.deliveryDate, ids);
  });

  const sortedDeliveryDates = Array.from(deliveryDateSet).sort();

  const groups = sortedDeliveryDates.map((deliveryDate) => {
    const ids = idsMap.get(deliveryDate) as string[];

    const items = ids.map((id) => {
      const quantity = quantityMap.get(id);
      if (quantity === undefined) {
        throw new Error(`The quantity related to the id ${id} is undefined`);
      }

      const item = itemMap.get(id);
      if (!item) {
        throw new Error(`The item related to the id ${id} is undefined`);
      }

      return {
        quantity,
        item,
      } as DeliveryDateItem;
    });

    return {
      deliveryDate,
      items,
    } as DeliveryDateItemGroup;
  });

  const allItems = groups.flatMap((group) => group.items);
  const totalPriceItemsEur = PriceService.getItemsTotalPriceEur(allItems);
  const totalPriceItemsEurString = PriceService.getPriceStringEur(
    totalPriceItemsEur,
    locale
  );
  const shippingPriceEurString = PriceService.getPriceStringEur(
    order.shippingResult.shippingPrices.EUR,
    locale
  );
  const totalPriceEurString = PriceService.getPriceStringEur(
    totalPriceItemsEur + order.shippingResult.shippingPrices.EUR,
    locale
  );

  return {
    groups,
    shippingOption: order.shippingOption,
    totalPriceItemsEur: totalPriceItemsEurString,
    shippingPriceEur: shippingPriceEurString,
    totalPriceEur: totalPriceEurString,
  } as DeliveryDateOrder;
}
