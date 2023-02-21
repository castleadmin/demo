import { Category } from '@castleadmin/product-domain';
import { categoryEffects } from './effect-library';

describe('effect-library', () => {
  it('Should have a axes effects collection', () => {
    expect(categoryEffects[Category.axes]).toBeDefined();
    expect(categoryEffects[Category.axes]?.[0]?.categories).toContain(
      Category.axes
    );
  });

  it('Should have a hammers effects collection', () => {
    expect(categoryEffects[Category.hammers]).toBeDefined();
    expect(categoryEffects[Category.hammers]?.[0]?.categories).toContain(
      Category.hammers
    );
  });

  it('Should have a spears effects collection', () => {
    expect(categoryEffects[Category.spears]).toBeDefined();
    expect(categoryEffects[Category.spears]?.[0]?.categories).toContain(
      Category.spears
    );
  });

  it('Should have a daggers effects collection', () => {
    expect(categoryEffects[Category.daggers]).toBeDefined();
    expect(categoryEffects[Category.daggers]?.[0]?.categories).toContain(
      Category.daggers
    );
  });

  it('Should have a swords effects collection', () => {
    expect(categoryEffects[Category.swords]).toBeDefined();
    expect(categoryEffects[Category.swords]?.[0]?.categories).toContain(
      Category.swords
    );
  });

  it('Should have a bows effects collection', () => {
    expect(categoryEffects[Category.bows]).toBeDefined();
    expect(categoryEffects[Category.bows]?.[0]?.categories).toContain(
      Category.bows
    );
  });

  it('Should have a armors effects collection', () => {
    expect(categoryEffects[Category.armors]).toBeDefined();
    expect(categoryEffects[Category.armors]?.[0]?.categories).toContain(
      Category.armors
    );
  });

  it('Should have a helmets effects collection', () => {
    expect(categoryEffects[Category.helmets]).toBeDefined();
    expect(categoryEffects[Category.helmets]?.[0]?.categories).toContain(
      Category.helmets
    );
  });

  it('Should have a shields effects collection', () => {
    expect(categoryEffects[Category.shields]).toBeDefined();
    expect(categoryEffects[Category.shields]?.[0]?.categories).toContain(
      Category.shields
    );
  });

  it('Should have a wands effects collection', () => {
    expect(categoryEffects[Category.wands]).toBeDefined();
    expect(categoryEffects[Category.wands]?.[0]?.categories).toContain(
      Category.wands
    );
  });

  it('Should have a scrolls effects collection', () => {
    expect(categoryEffects[Category.scrolls]).toBeDefined();
    expect(categoryEffects[Category.scrolls]?.[0]?.categories).toContain(
      Category.scrolls
    );
  });

  it('Should have a potions effects collection', () => {
    expect(categoryEffects[Category.potions]).toBeDefined();
    expect(categoryEffects[Category.potions]?.[0]?.categories).toContain(
      Category.potions
    );
  });
});
