import {
  ArmorType,
  Category,
  Quality,
  Type,
} from '@castleadmin/product-domain';

function randomQualityNormalOrExcellent(): Quality {
  // Probability
  // 0    80%
  // 2    20%

  // Range after Math.floor [0, 9]
  // >= 8 -> Chance excellent 2/10 = 20%
  const qualityNumber = Math.floor(10 * Math.random()) >= 8 ? 2 : 0;

  if (qualityNumber === 2) {
    return Quality.excellent;
  }

  return Quality.normal;
}

function randomQualityAll(): Quality {
  // Probability
  // 0    50%
  // 1    30%
  // 2    20%

  let qualityNumber = 0;
  // Range after Math.floor [0, 9]
  const random = Math.floor(10 * Math.random());
  // >= 5 -> Chance not normal 5/10 = 50%
  if (random >= 5) {
    // [0, 9] >= 8 -> Chance excellent 2/10 = 20%
    if (random >= 8) {
      qualityNumber = 2;
    } else {
      qualityNumber = 1;
    }
  }

  if (qualityNumber === 1) {
    return Quality.improved;
  } else if (qualityNumber === 2) {
    return Quality.excellent;
  }

  return Quality.normal;
}

/**
 * Generate the item quality.
 */
export function createQuality(category: Category, type?: Type): Quality {
  let quality = Quality.normal;

  switch (category) {
    case Category.axes:
      quality = randomQualityAll();
      break;
    case Category.armors:
      switch (type) {
        case ArmorType.leather:
          // normal quality
          break;
        case ArmorType.chainmail:
          // normal quality
          break;
        case ArmorType.plate:
          quality = randomQualityNormalOrExcellent();
          break;
      }
      break;
    case Category.scrolls:
      // normal quality
      break;
    case Category.potions:
      // normal quality
      break;
    default:
      quality = randomQualityNormalOrExcellent();
      break;
  }

  return quality;
}
