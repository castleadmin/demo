import {
  ArmorType,
  AxeType,
  Category,
  PotionType,
  Type,
} from '@castleadmin/product-domain';

/**
 * Generate the type (variant) of an item.
 * Only axes, armors and potions have a type.
 */
export function createType(category: Category): Type | undefined {
  let type: Type | undefined = undefined;

  switch (category) {
    case Category.axes:
      switch (Math.floor(2 * Math.random())) {
        case 0:
          type = AxeType.singleSided;
          break;
        case 1:
          type = AxeType.doubleSided;
          break;
      }
      break;
    case Category.armors:
      switch (Math.floor(3 * Math.random())) {
        case 0:
          type = ArmorType.leather;
          break;
        case 1:
          type = ArmorType.chainmail;
          break;
        case 2:
          type = ArmorType.plate;
          break;
      }
      break;
    case Category.potions:
      switch (Math.floor(3 * Math.random())) {
        case 0:
          type = PotionType.green;
          break;
        case 1:
          type = PotionType.blue;
          break;
        case 2:
          type = PotionType.red;
          break;
      }
      break;
  }

  return type;
}
