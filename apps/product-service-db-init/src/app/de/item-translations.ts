import {
  ArmorType,
  AxeType,
  PotionType,
  Quality,
} from '@castleadmin/product-domain';

/**
 * Various item translations in german.
 */
export const itemTranslationsDe = {
  quality: {
    [Quality.normal]: {
      maskulinum: '',
      femininum: '',
      neutrum: '',
    },
    [Quality.improved]: {
      maskulinum: 'verbesserter',
      femininum: 'verbesserte',
      neutrum: 'verbessertes',
    },
    [Quality.excellent]: {
      maskulinum: 'ausgezeichneter',
      femininum: 'ausgezeichnete',
      neutrum: 'ausgezeichnetes',
    },
  },
  axeType: {
    [AxeType.singleSided]: '',
    [AxeType.doubleSided]: 'doppelseitige',
  },
  armorType: {
    [ArmorType.leather]: 'Lederrüstung',
    [ArmorType.chainmail]: 'Kettenhemd',
    [ArmorType.plate]: 'Plattenpanzer',
  },
  potionType: {
    [PotionType.green]: 'schwacher',
    [PotionType.blue]: '',
    [PotionType.red]: 'starker',
  },
  description: {
    beginningWithoutItemName:
      'ist genau auf die Bedürfnisse seiner Benutzer abgestimmt',
    [Quality.improved]:
      'und zeichnet sich durch seine verbesserte Qualität aus',
    [Quality.excellent]:
      'und zeichnet sich durch seine ausgezeichnete Qualität aus',
  },
};
