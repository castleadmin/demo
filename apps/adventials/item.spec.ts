import { Language } from '@castleadmin/checkout-domain';
import {
  getItemDescription,
  getItemEffectName,
  getItemName,
  getItemPriceEur,
  localeToPropertyName,
} from './item';
import { createMockItem } from './specs/mocks';

describe('item', () => {
  let item;

  beforeEach(() => {
    item = createMockItem();
  });

  describe('localeToPropertyName', () => {
    it('Should return the enUS property name if the locale is en-US', () => {
      expect(localeToPropertyName(Language.enUs)).toBe('enUs');
    });

    it('Should return the de property name if the locale is de', () => {
      expect(localeToPropertyName(Language.de)).toBe('de');
    });

    it("Should throw an error if the locale isn't supported", () => {
      expect(() => localeToPropertyName('fr' as Language)).toThrow(Error);
    });
  });

  describe('getItemName', () => {
    it('Should return the en-US name if the locale is en-US', () => {
      expect(getItemName(item, Language.enUs)).toBe(
        item.translations.enUs.name
      );
    });

    it('Should return the de name if the locale is de', () => {
      expect(getItemName(item, Language.de)).toBe(item.translations.de.name);
    });

    it('Should return the en-US name if the locale is fr', () => {
      expect(getItemName(item, 'fr' as Language)).toBe(
        item.translations.enUs.name
      );
    });
  });

  describe('getItemDescription', () => {
    it('Should return the en-US description if the locale is en-US', () => {
      expect(getItemDescription(item, Language.enUs)).toBe(
        item.translations.enUs.description
      );
    });

    it('Should return the de description if the locale is de', () => {
      expect(getItemDescription(item, Language.de)).toBe(
        item.translations.de.description
      );
    });

    it('Should return the en-US description if the locale is fr', () => {
      expect(getItemDescription(item, 'fr' as Language)).toBe(
        item.translations.enUs.description
      );
    });
  });

  describe('getItemEffectName', () => {
    it('Should return the en-US effect name if the locale is en-US', () => {
      expect(getItemEffectName(item, Language.enUs)).toBe(
        item.translations.enUs.effectName
      );
    });

    it('Should return the de effect name if the locale is de', () => {
      expect(getItemEffectName(item, Language.de)).toBe(
        item.translations.de.effectName
      );
    });

    it('Should return the en-US effect name if the locale is fr', () => {
      expect(getItemEffectName(item, 'fr' as Language)).toBe(
        item.translations.enUs.effectName
      );
    });

    it('Should return undefined if the item has no effect', () => {
      item.effect = undefined;

      expect(getItemEffectName(item, Language.enUs)).toBe(undefined);
    });

    it("Should throw an error if the effect name isn't defined", () => {
      item.translations.enUs.effectName = undefined;

      expect(() => getItemEffectName(item, Language.enUs)).toThrow(Error);
    });
  });

  describe('getItemPriceEur', () => {
    it('Should return the EUR price formatted according to the locale de', () => {
      expect(getItemPriceEur(item, Language.de)).toBe('479,99\xa0€');
    });

    it('Should return the EUR price formatted according to the locale en-US', () => {
      expect(getItemPriceEur(item, Language.enUs)).toBe('€479.99');
    });
  });
});
