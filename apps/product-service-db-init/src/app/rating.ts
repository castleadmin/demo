import {
  ArmorType,
  Category,
  EffectPower,
  Quality,
  Type,
} from '@castleadmin/product-domain';

/**
 * Generate the average rating of an item measured in half stars.
 */
export function createHalfStars(
  category: Category,
  quality: Quality,
  effectPower: EffectPower,
  type?: Type
): number {
  let random = 0;
  let halfStars = 0;
  let qualityNumber = 0;
  let effectPowerNumber = 0;

  switch (quality) {
    case Quality.normal:
      break;
    case Quality.improved:
      qualityNumber = 1;
      break;
    case Quality.excellent:
      qualityNumber = 2;
      break;
  }

  switch (effectPower) {
    case EffectPower.none:
      break;
    case EffectPower.weak:
      effectPowerNumber = 1;
      break;
    case EffectPower.average:
      effectPowerNumber = 2;
      break;
    case EffectPower.strong:
      effectPowerNumber = 3;
      break;
  }

  // qualityNumber range [0, 2]
  // effectPowerNumber range [0, 3]

  switch (qualityNumber + effectPowerNumber) {
    case 0:
      // range [0, 7]
      random = Math.floor(8 * Math.random());
      break;
    case 1:
      // range [1, 8]
      random = 1 + Math.floor(8 * Math.random());
      break;
    case 2:
      // range [2, 9]
      random = 2 + Math.floor(8 * Math.random());
      break;
    case 3:
      // range [3, 10]
      random = 3 + Math.floor(8 * Math.random());
      break;
    case 4:
      // range [4, 11]
      random = 4 + Math.floor(8 * Math.random());
      break;
    case 5:
      // range [5, 12]
      random = 5 + Math.floor(8 * Math.random());
      break;
  }

  // for categories that only have normal quality
  if (category === Category.scrolls || category === Category.potions) {
    // range [0, 10] -> [0, 12]
    random = random + Math.floor(3 * Math.random());
  }

  // for types that only have normal quality
  if (type === ArmorType.leather || type === ArmorType.chainmail) {
    // range [0, 10] -> [0, 12]
    random = random + Math.floor(3 * Math.random());
  }

  // range [0, 12] -> [2, 10]
  halfStars = Math.max(2, Math.min(10, random));

  return halfStars;
}

/**
 * Generate the number of reviews of an item.
 */
export function createRatingCount(popularity: number): number {
  const minCount = 1;
  const maxCount = Math.floor(10000 * popularity);
  const range = maxCount - minCount;

  const count = minCount + Math.floor(range * Math.random());

  return count;
}
