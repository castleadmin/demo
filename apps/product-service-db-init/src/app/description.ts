import { EffectPower, Quality } from '@castleadmin/product-domain';
import { itemTranslationsDe } from './de/item-translations';
import { Effect } from './effect-library';
import { itemTranslationsEnUs } from './en-US/item-translations';
import {
  firstLetterToUpperCase,
  replaceSpacesWithSingleWhitespace,
} from './utils';

/**
 * Generate the german description text of an item.
 */
export function createDescriptionDe(
  nameDe: string,
  quality: Quality,
  effectPower: EffectPower,
  effect?: Effect
): string {
  const itemDescription =
    itemTranslationsDe.description.beginningWithoutItemName;
  const qualityDescription =
    quality === Quality.improved || quality === Quality.excellent
      ? itemTranslationsDe.description[quality]
      : '';

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

  let effectDescription = '';

  if (effectPowerNumber !== 0) {
    if (!effect) {
      throw new Error("Effect isn't defined");
    }

    const effectPropName = `descriptionDe${effectPowerNumber - 1}`;

    if (
      effectPropName !== 'descriptionDe0' &&
      effectPropName !== 'descriptionDe1' &&
      effectPropName !== 'descriptionDe2'
    ) {
      throw new Error('Invalid Effect property name');
    }

    effectDescription = effect[effectPropName];
  }

  if (
    !nameDe ||
    !itemDescription ||
    qualityDescription === undefined ||
    effectDescription === undefined
  ) {
    throw new Error('Description contains undefined parts');
  }

  let description = '';
  if (!qualityDescription) {
    description = `${nameDe} ${itemDescription}. ${effectDescription}`;
  } else {
    description = `${nameDe} ${itemDescription} ${qualityDescription}. ${effectDescription}`;
  }
  description = description.trim();
  description = firstLetterToUpperCase(description);
  description = replaceSpacesWithSingleWhitespace(description);

  return description;
}

/**
 * Generate the english description text of an item.
 */
export function createDescriptionEnUs(
  nameEnUs: string,
  quality: Quality,
  effectPower: EffectPower,
  effect?: Effect
): string {
  const itemDescription =
    itemTranslationsEnUs.description.beginningWithoutItemName;
  const qualityDescription =
    quality === Quality.improved || quality === Quality.excellent
      ? itemTranslationsEnUs.description[quality]
      : '';

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

  let effectDescription = '';

  if (effectPowerNumber !== 0) {
    if (!effect) {
      throw new Error("Effect isn't defined");
    }

    const effectPropName = `descriptionEnUs${effectPowerNumber - 1}`;

    if (
      effectPropName !== 'descriptionEnUs0' &&
      effectPropName !== 'descriptionEnUs1' &&
      effectPropName !== 'descriptionEnUs2'
    ) {
      throw new Error('Invalid Effect property name');
    }

    effectDescription = effect[effectPropName];
  }

  if (
    !nameEnUs ||
    !itemDescription ||
    qualityDescription === undefined ||
    effectDescription === undefined
  ) {
    throw new Error('Description contains undefined parts');
  }

  let description = `${nameEnUs} ${itemDescription} ${qualityDescription} ${effectDescription}`;
  description = description.trim();
  description = firstLetterToUpperCase(description);
  description = replaceSpacesWithSingleWhitespace(description);

  return description;
}
