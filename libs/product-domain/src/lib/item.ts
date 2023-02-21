import { Category } from './category';
import { EffectPower } from './effect-power';
import { Quality } from './quality';
import { Type } from './type';

/**
 * Represents a shop item
 * DDD <<Entity>> <<RootAggregate>>
 */
export interface Item {
  _id: string;
  ean: string;
  category: Category;
  type?: Type;
  quality: Quality;
  effect?: string;
  effectPower: EffectPower;
  prices: {
    EUR: number;
  };
  isInStock: boolean;
  popularity: number;
  halfStars: number;
  ratingCount: number;
  translations: {
    de: ItemTranslation;
    enUs: ItemTranslation;
  };
}

/**
 * Represents a shop item translation
 * DDD <<ValueObject>>
 */
export interface ItemTranslation {
  name: string;
  description: string;
  effectName?: string;
}
