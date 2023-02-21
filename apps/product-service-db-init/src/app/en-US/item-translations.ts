import {
  ArmorType,
  AxeType,
  PotionType,
  Quality,
} from '@castleadmin/product-domain';

/**
 * Various item translations in english.
 */
export const itemTranslationsEnUs = {
  quality: {
    [Quality.normal]: '',
    [Quality.improved]: 'improved',
    [Quality.excellent]: 'excellent',
  },
  axeType: {
    [AxeType.singleSided]: '',
    [AxeType.doubleSided]: 'double-sided',
  },
  armorType: {
    [ArmorType.leather]: 'Leather Armor',
    [ArmorType.chainmail]: 'Chain Mail',
    [ArmorType.plate]: 'Plate Armor',
  },
  potionType: {
    [PotionType.green]: 'weak',
    [PotionType.blue]: '',
    [PotionType.red]: 'strong',
  },
  description: {
    beginningWithoutItemName: 'is exactly tailored to the needs of its users.',
    [Quality.improved]: 'It is characterized by its improved quality.',
    [Quality.excellent]: 'It is characterized by its excellent quality.',
  },
};
