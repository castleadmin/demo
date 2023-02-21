import {
  ArmorType,
  AxeType,
  Category,
  EffectPower,
  PotionType,
  Quality,
  Type,
} from '@castleadmin/product-domain';

/**
 * Generate the base price of an item.
 */
export function basePrice(category: Category, type?: Type): number {
  let price = 0;

  switch (category) {
    case Category.axes:
      switch (type) {
        case AxeType.singleSided:
          price += 80;
          break;
        case AxeType.doubleSided:
          price += 100;
          break;
      }
      break;
    case Category.hammers:
      price += 100;
      break;
    case Category.spears:
      price += 60;
      break;
    case Category.daggers:
      price += 30;
      break;
    case Category.swords:
      price += 100;
      break;
    case Category.bows:
      price += 50;
      break;
    case Category.armors:
      switch (type) {
        case ArmorType.leather:
          price += 60;
          break;
        case ArmorType.chainmail:
          price += 100;
          break;
        case ArmorType.plate:
          price += 140;
          break;
      }
      break;
    case Category.helmets:
      price += 40;
      break;
    case Category.shields:
      price += 60;
      break;
    case Category.wands:
      price += 120;
      break;
    case Category.scrolls:
      price += 20;
      break;
    case Category.potions:
      switch (type) {
        case PotionType.green:
          price += 10;
          break;
        case PotionType.blue:
          price += 20;
          break;
        case PotionType.red:
          price += 30;
          break;
      }
      break;
  }

  if (price === 0) {
    throw new Error("Base price couldn't be calculated");
  }

  return price;
}

/**
 * Generate the additional costs of the item quality.
 */
export function qualityPrice(baseItemPrice: number, quality: Quality): number {
  let price = baseItemPrice;

  switch (quality) {
    case Quality.normal:
      break;
    case Quality.improved:
      price *= 2;
      break;
    case Quality.excellent:
      price *= 3;
      break;
  }
  const result = price - baseItemPrice;

  return result;
}

/**
 * Generate the additional costs of the item's magical effect.
 */
export function effectPrice(
  baseItemPrice: number,
  effectPower: EffectPower
): number {
  let price = baseItemPrice;

  switch (effectPower) {
    case EffectPower.none:
      break;
    case EffectPower.weak:
      price *= 2;
      break;
    case EffectPower.average:
      price *= 3;
      break;
    case EffectPower.strong:
      price *= 4;
      break;
  }

  const result = price - baseItemPrice;

  return result;
}

/**
 * Sum up the base, quality and effect price in order to build the total price of an item.
 */
export function createPriceEur(
  category: Category,
  quality: Quality,
  effectPower: EffectPower,
  type?: Type
): number {
  const baseItemPrice = basePrice(category, type);
  let price = baseItemPrice;
  price += qualityPrice(baseItemPrice, quality);
  price += effectPrice(baseItemPrice, effectPower);

  // price varies by +/- 5%
  // price + round(5% * price * ([0,1) * 2 - 1)) = price + round(5% * price * [-1,1))
  price = price + Math.round(price * 0.05 * (Math.random() * 2 - 1));

  // store price in cents
  // subtract one cent
  price = price * 100 - 1;

  return price;
}
