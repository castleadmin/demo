import {
  ArmorType,
  AxeType,
  Category,
  EffectPower,
  PotionType,
  Quality,
  Type,
} from '@castleadmin/product-domain';
import { categoryTranslationsDe } from './de/category-translations';
import { itemTranslationsDe } from './de/item-translations';
import { Effect } from './effect-library';
import { categoryTranslationsEnUs } from './en-US/category-translations';
import { itemTranslationsEnUs } from './en-US/item-translations';
import {
  firstLetterToUpperCase,
  replaceSpacesWithSingleWhitespace,
} from './utils';

/**
 * Generate the german name of an item.
 */
export function createNameDe(
  category: Category,
  quality: Quality,
  effectPower: EffectPower,
  effect?: Effect,
  type?: Type
): string {
  let categoryName = categoryTranslationsDe[category];
  let qualityName: string | undefined = undefined;
  let typeName: string | undefined = undefined;

  switch (category) {
    case Category.axes:
    case Category.scrolls:
      qualityName = itemTranslationsDe.quality[quality].femininum;
      break;
    case Category.hammers:
    case Category.spears:
    case Category.daggers:
    case Category.bows:
    case Category.helmets:
    case Category.wands:
    case Category.potions:
      qualityName = itemTranslationsDe.quality[quality].maskulinum;
      break;
    case Category.swords:
    case Category.shields:
      qualityName = itemTranslationsDe.quality[quality].neutrum;
      break;
    case Category.armors:
      switch (type) {
        case ArmorType.leather:
          qualityName = itemTranslationsDe.quality[quality].femininum;
          break;
        case ArmorType.chainmail:
          qualityName = itemTranslationsDe.quality[quality].neutrum;
          break;
        case ArmorType.plate:
          qualityName = itemTranslationsDe.quality[quality].maskulinum;
          break;
      }
      break;
  }

  switch (category) {
    case Category.axes:
      if (
        !(
          type &&
          (type === AxeType.singleSided || type === AxeType.doubleSided)
        )
      ) {
        throw new Error("Axe type hasn't been defined");
      }
      typeName = itemTranslationsDe.axeType[type];
      break;
    case Category.armors:
      if (
        !(
          type &&
          (type === ArmorType.leather ||
            type === ArmorType.chainmail ||
            type === ArmorType.plate)
        )
      ) {
        throw new Error("Armor type hasn't been defined");
      }
      categoryName = '';
      typeName = itemTranslationsDe.armorType[type];
      break;
    case Category.potions:
      if (
        !(
          type &&
          (type === PotionType.green ||
            type === PotionType.blue ||
            type === PotionType.red)
        )
      ) {
        throw new Error("Potion type hasn't been defined");
      }
      typeName = itemTranslationsDe.potionType[type];
      break;
    default:
      typeName = '';
      break;
  }

  let effectPowerNumber = -1;

  if (effectPower === EffectPower.none) {
    effectPowerNumber = 0;
  } else if (effectPower === EffectPower.weak) {
    effectPowerNumber = 1;
  } else if (effectPower === EffectPower.average) {
    effectPowerNumber = 2;
  } else if (effectPower === EffectPower.strong) {
    effectPowerNumber = 3;
  }

  let effectName = '';

  if (effectPowerNumber !== 0) {
    if (!effect) {
      throw new Error("Effect isn't defined");
    }

    const effectPropName = `nameDe${effectPowerNumber - 1}`;

    if (
      effectPropName !== 'nameDe0' &&
      effectPropName !== 'nameDe1' &&
      effectPropName !== 'nameDe2'
    ) {
      throw new Error('Invalid Effect property name');
    }

    effectName = effect[effectPropName];
  }

  if (
    qualityName === undefined ||
    typeName === undefined ||
    categoryName === undefined ||
    effectName === undefined
  ) {
    throw new Error('Name contains undefined parts');
  }

  let name = `${qualityName} ${typeName} ${categoryName} ${effectName}`;
  name = name.trim();
  name = firstLetterToUpperCase(name);
  name = replaceSpacesWithSingleWhitespace(name);

  return name;
}

/**
 * Generate the english name of an item.
 */
export function createNameEnUs(
  category: Category,
  quality: Quality,
  effectPower: EffectPower,
  effect?: Effect,
  type?: Type
): string {
  let categoryName = categoryTranslationsEnUs[category];
  const qualityName = itemTranslationsEnUs.quality[quality];
  let typeName: string | undefined = undefined;

  switch (category) {
    case Category.axes:
      if (
        !(
          type &&
          (type === AxeType.singleSided || type === AxeType.doubleSided)
        )
      ) {
        throw new Error("Axe type hasn't been defined");
      }
      typeName = itemTranslationsEnUs.axeType[type];
      break;
    case Category.armors:
      if (
        !(
          type &&
          (type === ArmorType.leather ||
            type === ArmorType.chainmail ||
            type === ArmorType.plate)
        )
      ) {
        throw new Error("Armor type hasn't been defined");
      }
      categoryName = '';
      typeName = itemTranslationsEnUs.armorType[type];
      break;
    case Category.potions:
      if (
        !(
          type &&
          (type === PotionType.green ||
            type === PotionType.blue ||
            type === PotionType.red)
        )
      ) {
        throw new Error("Potion type hasn't been defined");
      }
      typeName = itemTranslationsEnUs.potionType[type];
      break;
    default:
      typeName = '';
      break;
  }

  let effectPowerNumber = -1;

  if (effectPower === EffectPower.none) {
    effectPowerNumber = 0;
  } else if (effectPower === EffectPower.weak) {
    effectPowerNumber = 1;
  } else if (effectPower === EffectPower.average) {
    effectPowerNumber = 2;
  } else if (effectPower === EffectPower.strong) {
    effectPowerNumber = 3;
  }

  let effectName = '';

  if (effectPowerNumber !== 0) {
    if (!effect) {
      throw new Error("Effect isn't defined");
    }

    const effectPropName = `nameEnUs${effectPowerNumber - 1}`;

    if (
      effectPropName !== 'nameEnUs0' &&
      effectPropName !== 'nameEnUs1' &&
      effectPropName !== 'nameEnUs2'
    ) {
      throw new Error('Invalid Effect property name');
    }

    effectName = effect[effectPropName];
  }

  if (
    qualityName === undefined ||
    typeName === undefined ||
    categoryName === undefined ||
    effectName === undefined
  ) {
    throw new Error('Name contains undefined parts');
  }

  let name = `${qualityName} ${typeName} ${categoryName} ${effectName}`;
  name = name.trim();
  name = firstLetterToUpperCase(name);
  name = replaceSpacesWithSingleWhitespace(name);

  return name;
}
