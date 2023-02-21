import { Language, PriceService } from '@castleadmin/checkout-domain';
import { Item } from '@castleadmin/product-domain';

type SearchResultItemTranslation = {
  translations: { de: { name: string } } | { enUs: { name: string } };
};

/**
 * Represents an item which is used as a search result.
 */
export type SearchResultItem = Omit<
  Item,
  'ean' | 'popularity' | 'translations'
> &
  SearchResultItemTranslation;

/**
 * Represents an item in a shopping cart.
 */
export interface CartItem {
  quantity: number;
  item: Item;
}

/**
 * Represents an item which is used during the checkout approval.
 */
export type CheckoutApprovalOrderItem = Omit<
  Item,
  'ean' | 'popularity' | 'halfStars' | 'ratingCount'
>;

/**
 * Represents an item with a quantity which is used during the checkout approval.
 */
export interface DeliveryDateItem {
  item: CheckoutApprovalOrderItem;
  quantity: number;
}

/**
 * The number of items per page.
 */
export const itemsPerPage = 32;

/**
 * The maximum item quantity inside the shopping cart.
 */
export const cartItemMaxQuantity = 20;

/**
 * Converts a locale to an item property name.
 */
export function localeToPropertyName(locale: Language) {
  let propName;

  switch (locale) {
    case Language.enUs:
      propName = 'enUs';
      break;
    case Language.de:
      propName = 'de';
      break;
  }

  if (!propName) {
    throw new Error(`Couldn't find property name of locale ${locale}`);
  }

  return propName;
}

/**
 * Get the correct translation of the item name.
 */
export function getItemName(
  item: Item | SearchResultItem | CheckoutApprovalOrderItem,
  locale: Language
): string {
  let name: string;

  switch (locale) {
    case Language.enUs:
      name = (item as Item).translations.enUs.name;
      break;
    case Language.de:
      name = (item as Item).translations.de.name;
      break;
    default:
      name = (item as Item).translations.enUs.name;
      break;
  }

  return name;
}

/**
 * Get the correct translation of the item description.
 */
export function getItemDescription(item: Item, locale: Language): string {
  let name: string;

  switch (locale) {
    case Language.enUs:
      name = item.translations.enUs.description;
      break;
    case Language.de:
      name = item.translations.de.description;
      break;
    default:
      name = item.translations.enUs.description;
      break;
  }

  return name;
}

/**
 * Get the correct translation of the item effect name.
 */
export function getItemEffectName(
  item: Item,
  locale: Language
): string | undefined {
  if (!item.effect) {
    return undefined;
  }

  let effectName: string | undefined;

  switch (locale) {
    case Language.enUs:
      effectName = item.translations.enUs.effectName;
      break;
    case Language.de:
      effectName = item.translations.de.effectName;
      break;
    default:
      effectName = item.translations.enUs.effectName;
      break;
  }

  if (!effectName) {
    throw new Error(`Effect name isn't defined for item ${item._id}`);
  }

  return effectName;
}

/**
 * Get the item EUR price with a currency indicator.
 */
export function getItemPriceEur(
  item: Item | SearchResultItem | CheckoutApprovalOrderItem,
  locale: Language
): string {
  return PriceService.getPriceStringEur(item.prices.EUR, locale);
}
