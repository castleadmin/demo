import {
  ArmorType,
  AxeType,
  Category,
  EffectPower,
  Item,
  PotionType,
  Quality,
} from '@castleadmin/product-domain';
import { CheckoutApprovalOrderItem, SearchResultItem } from './item';

/**
 * Get the item image name.
 */
export function getItemImageName(
  item: Item | SearchResultItem | CheckoutApprovalOrderItem
): string {
  const category = item.category;
  const quality = item.quality;
  const type = item.type;

  let imageName: string | undefined = undefined;

  switch (category) {
    case Category.axes:
      switch (type) {
        case AxeType.singleSided:
          imageName = 'axe';
          break;
        case AxeType.doubleSided:
          imageName = 'axeDouble';
          break;
      }
      break;
    case Category.hammers:
      imageName = 'hammer';
      break;
    case Category.spears:
      imageName = 'spear';
      break;
    case Category.daggers:
      imageName = 'dagger';
      break;
    case Category.swords:
      imageName = 'sword';
      break;
    case Category.bows:
      imageName = 'bow';
      break;
    case Category.armors:
      switch (type) {
        case ArmorType.leather:
          imageName = 'leather';
          break;
        case ArmorType.chainmail:
          imageName = 'leather2';
          break;
        case ArmorType.plate:
          imageName = 'armor';
          break;
      }
      break;
    case Category.helmets:
      imageName = 'helmet';
      break;
    case Category.shields:
      imageName = 'shield';
      break;
    case Category.wands:
      imageName = 'wand';
      break;
    case Category.scrolls:
      imageName = 'scroll';
      break;
    case Category.potions:
      switch (type) {
        case PotionType.green:
          imageName = 'potionGreen';
          break;
        case PotionType.blue:
          imageName = 'potionBlue';
          break;
        case PotionType.red:
          imageName = 'potionRed';
          break;
      }
      break;
  }

  switch (quality) {
    case Quality.normal:
      break;
    case Quality.improved:
      imageName = `${imageName}2`;
      break;
    case Quality.excellent:
      imageName = `upg_${imageName}`;
      break;
  }

  if (imageName === undefined) {
    throw new Error('Image name is undefined');
  }

  imageName = `${imageName}.png`;

  return imageName;
}

/**
 * Get the path to the 128x128 item image.
 */
export function getItemImage128(
  item: Item | SearchResultItem | CheckoutApprovalOrderItem
): string {
  return `/categories128/${getItemImageName(item)}`;
}

/**
 * Get the path to the 256x256 item image.
 */
export function getItemImage256(
  item: Item | SearchResultItem | CheckoutApprovalOrderItem
): string {
  return `/categories256/${getItemImageName(item)}`;
}

/**
 * Get the item effect image name.
 */
export function getEffectImageName(
  item: Item | SearchResultItem | CheckoutApprovalOrderItem
): string | undefined {
  if (!item.effect) {
    return undefined;
  }

  const effectImage = effectToImageNameMapping[item.effect];

  if (!effectImage) {
    throw new Error(`Couldn't find an effect image for effect ${item.effect}`);
  }

  const effectPowerImage = effectPowerToNumberMapping[item.effectPower];

  if (effectPowerImage === null || effectPowerImage === undefined) {
    throw new Error(
      `Couldn't find an effect power image for effect power ${item.effectPower}`
    );
  }

  return `${effectImage}-${effectPowerImage}.png`;
}

/**
 * Get the path to the 128x128 effect image.
 */
export function getEffectImage128(
  item: Item | SearchResultItem | CheckoutApprovalOrderItem
): string {
  return `/effects128/${getEffectImageName(item)}`;
}

/**
 * Get the path to the 256x256 effect image.
 */
export function getEffectImage256(
  item: Item | SearchResultItem | CheckoutApprovalOrderItem
): string {
  return `/effects256/${getEffectImageName(item)}`;
}

const effectPowerToNumberMapping = {
  [EffectPower.none]: 0,
  [EffectPower.weak]: 1,
  [EffectPower.average]: 2,
  [EffectPower.strong]: 3,
};

export const effectToImageNameMapping = {
  'air-burst': 'air-burst-sky',
  'acid-beam': 'beam-acid',
  'ice-beam': 'beam-blue',
  'fire-beam': 'beam-orange',
  'spirit-beam': 'beam-royal',
  'acid-coat': 'enchant-acid',
  'ice-coat': 'enchant-blue',
  'fire-coat': 'enchant-orange',
  'spirit-coat': 'enchant-royal',
  'fire-explosion': 'explosion-orange',
  'spirit-explosion': 'explosion-royal',
  'fire-arrows': 'fire-arrows',
  'spirit-arrows': 'fire-arrows-royal',
  acidball: 'fireball-acid',
  fireball: 'fireball-red',
  fog: 'fog-sky',
  haste: 'haste-royal',
  heal: 'heal-sky',
  horror: 'horror-red',
  'ice-storm': 'ice-blue',
  'spirit-of-nature': 'leaf-acid',
  light: 'light-sky',
  lightning: 'lighting-sky',
  'acid-rain': 'needles-acid',
  'ice-rain': 'needles-blue',
  'acid-protection': 'protect-acid',
  'ice-protection': 'protect-blue',
  'fire-protection': 'protect-orange',
  'spirit-protection': 'protect-royal',
  rock: 'rock-sky',
  'rune-of-ice': 'runes-blue',
  'rune-of-fire': 'runes-orange',
  'rune-of-spirit': 'runes-royal',
  entangle: 'vines-jade',
  whirlwind: 'wind-sky',
};
