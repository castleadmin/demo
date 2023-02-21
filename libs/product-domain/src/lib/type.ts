/**
 * Axe types
 */
export enum AxeType {
  singleSided = 'singleSided',
  doubleSided = 'doubleSided',
}

/**
 * Armor types
 */
export enum ArmorType {
  leather = 'leather',
  chainmail = 'chainmail',
  plate = 'plate',
}

/**
 * Potion types
 */
export enum PotionType {
  green = 'green',
  blue = 'blue',
  red = 'red',
}

/**
 * The type of item.
 * Only items of the axes, armors and potions categories have a type.
 */
export type Type = AxeType | ArmorType | PotionType;
