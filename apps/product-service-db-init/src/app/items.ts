import { Category, Item } from '@castleadmin/product-domain';
import { sortProperties } from '@castleadmin/serverless-utils';
import { ObjectId } from 'mongodb';
import { createDescriptionDe, createDescriptionEnUs } from './description';
import { createEan } from './ean';
import { createEffect, createEffectPower } from './effect';
import { createNameDe, createNameEnUs } from './name';
import { createPopularity } from './popularity';
import { createPriceEur } from './price';
import { createQuality } from './quality';
import { createHalfStars, createRatingCount } from './rating';
import { createIsInStock } from './stock';
import { createType } from './type';

/**
 * Generate a specified number of items in the given category.
 */
export function createItemsInCategory(
  category: Category,
  count: number
): Item[] {
  const items: Item[] = [];

  for (let i = 0; i < count; i++) {
    const ean = createEan();
    const type = createType(category);
    const quality = createQuality(category, type);
    const effectPower = createEffectPower(category);
    const effect = createEffect(category, effectPower);
    const priceEur = createPriceEur(category, quality, effectPower, type);
    const isInStock = createIsInStock();
    const halfStars = createHalfStars(category, quality, effectPower, type);
    const popularity = createPopularity(halfStars);
    const ratingCount = createRatingCount(popularity);
    const nameEnUs = createNameEnUs(
      category,
      quality,
      effectPower,
      effect,
      type
    );
    const nameDe = createNameDe(category, quality, effectPower, effect, type);
    const descriptionEnUs = createDescriptionEnUs(
      nameEnUs,
      quality,
      effectPower,
      effect
    );
    const descriptionDe = createDescriptionDe(
      nameDe,
      quality,
      effectPower,
      effect
    );

    let item: Item = {
      _id: new ObjectId().toString(),
      ean,
      category,
      quality,
      effectPower,
      prices: {
        EUR: priceEur,
      },
      isInStock,
      popularity,
      halfStars,
      ratingCount,
      translations: {
        de: {
          name: nameDe,
          description: descriptionDe,
        },
        enUs: {
          name: nameEnUs,
          description: descriptionEnUs,
        },
      },
    };

    if (type) {
      item.type = type;
    }

    if (effect) {
      item.effect = effect.id;
      item.translations.de.effectName = effect.effectNameDe;
      item.translations.enUs.effectName = effect.effectNameEnUs;
    }

    item = sortProperties<Item>(item);

    items.push(item);
  }

  return items;
}

/**
 * Generate items across all categories.
 */
export function createItems(): Item[] {
  const items: Item[] = [];

  // inclusive
  const minCount = 100;
  // exclusive
  const maxCount = 360;
  const randomCount = (min: number, max: number): number => {
    const range = Math.floor((max - min) * Math.random());
    return min + range;
  };
  Object.values(Category).forEach((category) =>
    createItemsInCategory(category, randomCount(minCount, maxCount)).forEach(
      (item: Item) => items.push(item)
    )
  );

  return items;
}
