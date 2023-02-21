import { Category, EffectPower } from '@castleadmin/product-domain';
import { categoryEffects, Effect } from './effect-library';

/**
 * Generate the magical effect of an item.
 */
export function createEffect(
  category: Category,
  effectPower: EffectPower
): Effect | undefined {
  let effect = undefined;
  let effects: Effect[] | undefined = undefined;

  if (effectPower === EffectPower.none) {
    return undefined;
  }

  switch (category) {
    case Category.axes:
      effects = categoryEffects[Category.axes];
      break;
    case Category.hammers:
      effects = categoryEffects[Category.hammers];
      break;
    case Category.spears:
      effects = categoryEffects[Category.spears];
      break;
    case Category.daggers:
      effects = categoryEffects[Category.daggers];
      break;
    case Category.swords:
      effects = categoryEffects[Category.swords];
      break;
    case Category.bows:
      effects = categoryEffects[Category.bows];
      break;
    case Category.armors:
      effects = categoryEffects[Category.armors];
      break;
    case Category.helmets:
      effects = categoryEffects[Category.helmets];
      break;
    case Category.shields:
      effects = categoryEffects[Category.shields];
      break;
    case Category.wands:
      effects = categoryEffects[Category.wands];
      break;
    case Category.scrolls:
      effects = categoryEffects[Category.scrolls];
      break;
    case Category.potions:
      effects = categoryEffects[Category.potions];
      break;
  }

  if (!effects) {
    throw new Error("Couldn't find category effects");
  }

  effect = effects[Math.floor(effects.length * Math.random())];

  return effect;
}

/**
 * Generate the magical effect power of an item.
 */
export function createEffectPower(category: Category): EffectPower {
  let hasEffect = false;

  switch (category) {
    case Category.scrolls:
    case Category.potions:
      hasEffect = true;
      break;
    default:
      // Range after Math.floor [0, 9]
      // >= 1 -> Chance has effect 9/10 = 90%
      hasEffect = Math.floor(10 * Math.random()) >= 1;
      break;
  }

  let effectPowerNumber = 0;

  if (hasEffect) {
    // Range after Math.floor [0, 2]
    // Chance of effect 1, 2 or 3 is 33%
    effectPowerNumber = 1 + Math.floor(3 * Math.random());
  }

  if (effectPowerNumber === 1) {
    return EffectPower.weak;
  } else if (effectPowerNumber === 2) {
    return EffectPower.average;
  } else if (effectPowerNumber === 3) {
    return EffectPower.strong;
  }

  return EffectPower.none;
}
