import {
  ArmorType,
  AxeType,
  Category,
  EffectPower,
  PotionType,
  Quality,
} from '@castleadmin/product-domain';
import { categoryEffects } from './effect-library';
import { createNameDe, createNameEnUs } from './name';

describe('name', () => {
  describe('createNameDe', () => {
    describe('quality normal', () => {
      it('Should return the german text for an item of the axes category and type single-sided', () => {
        expect(
          createNameDe(
            Category.axes,
            Quality.normal,
            EffectPower.none,
            undefined,
            AxeType.singleSided
          )
        ).toBe('Axt');
      });

      it('Should return the german text for an item of the axes category and type double-sided', () => {
        expect(
          createNameDe(
            Category.axes,
            Quality.normal,
            EffectPower.none,
            undefined,
            AxeType.doubleSided
          )
        ).toBe('Doppelseitige Axt');
      });

      it('Should return the german text for an item of the hammers category', () => {
        expect(
          createNameDe(Category.hammers, Quality.normal, EffectPower.none)
        ).toBe('Hammer');
      });

      it('Should return the german text for an item of the spears category', () => {
        expect(
          createNameDe(Category.spears, Quality.normal, EffectPower.none)
        ).toBe('Speer');
      });

      it('Should return the german text for an item of the daggers category', () => {
        expect(
          createNameDe(Category.daggers, Quality.normal, EffectPower.none)
        ).toBe('Dolch');
      });

      it('Should return the german text for an item of the swords category', () => {
        expect(
          createNameDe(Category.swords, Quality.normal, EffectPower.none)
        ).toBe('Schwert');
      });

      it('Should return the german text for an item of the bows category', () => {
        expect(
          createNameDe(Category.bows, Quality.normal, EffectPower.none)
        ).toBe('Bogen');
      });

      it('Should return the german text for an item of the armors category and type leather', () => {
        expect(
          createNameDe(
            Category.armors,
            Quality.normal,
            EffectPower.none,
            undefined,
            ArmorType.leather
          )
        ).toBe('Lederrüstung');
      });

      it('Should return the german text for an item of the armors category and type chainmail', () => {
        expect(
          createNameDe(
            Category.armors,
            Quality.normal,
            EffectPower.none,
            undefined,
            ArmorType.chainmail
          )
        ).toBe('Kettenhemd');
      });

      it('Should return the german text for an item of the armors category and type plate', () => {
        expect(
          createNameDe(
            Category.armors,
            Quality.normal,
            EffectPower.none,
            undefined,
            ArmorType.plate
          )
        ).toBe('Plattenpanzer');
      });

      it('Should return the german text for an item of the helmets category', () => {
        expect(
          createNameDe(Category.helmets, Quality.normal, EffectPower.none)
        ).toBe('Helm');
      });

      it('Should return the german text for an item of the shields category', () => {
        expect(
          createNameDe(Category.shields, Quality.normal, EffectPower.none)
        ).toBe('Schild');
      });

      it('Should return the german text for an item of the wands category', () => {
        expect(
          createNameDe(Category.wands, Quality.normal, EffectPower.none)
        ).toBe('Zauberstab');
      });

      it('Should return the german text for an item of the scrolls category', () => {
        expect(
          createNameDe(Category.scrolls, Quality.normal, EffectPower.none)
        ).toBe('Schriftrolle');
      });

      it('Should return the german text for an item of the potions category and type green', () => {
        expect(
          createNameDe(
            Category.potions,
            Quality.normal,
            EffectPower.none,
            undefined,
            PotionType.green
          )
        ).toBe('Schwacher Zaubertrank');
      });

      it('Should return the german text for an item of the potions category and type blue', () => {
        expect(
          createNameDe(
            Category.potions,
            Quality.normal,
            EffectPower.none,
            undefined,
            PotionType.blue
          )
        ).toBe('Zaubertrank');
      });

      it('Should return the german text for an item of the potions category and type red', () => {
        expect(
          createNameDe(
            Category.potions,
            Quality.normal,
            EffectPower.none,
            undefined,
            PotionType.red
          )
        ).toBe('Starker Zaubertrank');
      });
    });

    describe('quality improved', () => {
      it('Should return the german text for an item of the axes category and type single-sided', () => {
        expect(
          createNameDe(
            Category.axes,
            Quality.improved,
            EffectPower.none,
            undefined,
            AxeType.singleSided
          )
        ).toBe('Verbesserte Axt');
      });

      it('Should return the german text for an item of the axes category and type double-sided', () => {
        expect(
          createNameDe(
            Category.axes,
            Quality.improved,
            EffectPower.none,
            undefined,
            AxeType.doubleSided
          )
        ).toBe('Verbesserte doppelseitige Axt');
      });

      it('Should return the german text for an item of the hammers category', () => {
        expect(
          createNameDe(Category.hammers, Quality.improved, EffectPower.none)
        ).toBe('Verbesserter Hammer');
      });

      it('Should return the german text for an item of the spears category', () => {
        expect(
          createNameDe(Category.spears, Quality.improved, EffectPower.none)
        ).toBe('Verbesserter Speer');
      });

      it('Should return the german text for an item of the daggers category', () => {
        expect(
          createNameDe(Category.daggers, Quality.improved, EffectPower.none)
        ).toBe('Verbesserter Dolch');
      });

      it('Should return the german text for an item of the swords category', () => {
        expect(
          createNameDe(Category.swords, Quality.improved, EffectPower.none)
        ).toBe('Verbessertes Schwert');
      });

      it('Should return the german text for an item of the bows category', () => {
        expect(
          createNameDe(Category.bows, Quality.improved, EffectPower.none)
        ).toBe('Verbesserter Bogen');
      });

      it('Should return the german text for an item of the armors category and type leather', () => {
        expect(
          createNameDe(
            Category.armors,
            Quality.improved,
            EffectPower.none,
            undefined,
            ArmorType.leather
          )
        ).toBe('Verbesserte Lederrüstung');
      });

      it('Should return the german text for an item of the armors category and type chainmail', () => {
        expect(
          createNameDe(
            Category.armors,
            Quality.improved,
            EffectPower.none,
            undefined,
            ArmorType.chainmail
          )
        ).toBe('Verbessertes Kettenhemd');
      });

      it('Should return the german text for an item of the armors category and type plate', () => {
        expect(
          createNameDe(
            Category.armors,
            Quality.improved,
            EffectPower.none,
            undefined,
            ArmorType.plate
          )
        ).toBe('Verbesserter Plattenpanzer');
      });

      it('Should return the german text for an item of the helmets category', () => {
        expect(
          createNameDe(Category.helmets, Quality.improved, EffectPower.none)
        ).toBe('Verbesserter Helm');
      });

      it('Should return the german text for an item of the shields category', () => {
        expect(
          createNameDe(Category.shields, Quality.improved, EffectPower.none)
        ).toBe('Verbessertes Schild');
      });

      it('Should return the german text for an item of the wands category', () => {
        expect(
          createNameDe(Category.wands, Quality.improved, EffectPower.none)
        ).toBe('Verbesserter Zauberstab');
      });

      it('Should return the german text for an item of the scrolls category', () => {
        expect(
          createNameDe(Category.scrolls, Quality.improved, EffectPower.none)
        ).toBe('Verbesserte Schriftrolle');
      });

      it('Should return the german text for an item of the potions category and type green', () => {
        expect(
          createNameDe(
            Category.potions,
            Quality.improved,
            EffectPower.none,
            undefined,
            PotionType.green
          )
        ).toBe('Verbesserter schwacher Zaubertrank');
      });

      it('Should return the german text for an item of the potions category and type blue', () => {
        expect(
          createNameDe(
            Category.potions,
            Quality.improved,
            EffectPower.none,
            undefined,
            PotionType.blue
          )
        ).toBe('Verbesserter Zaubertrank');
      });

      it('Should return the german text for an item of the potions category and type red', () => {
        expect(
          createNameDe(
            Category.potions,
            Quality.improved,
            EffectPower.none,
            undefined,
            PotionType.red
          )
        ).toBe('Verbesserter starker Zaubertrank');
      });
    });

    describe('quality excellent', () => {
      it('Should return the german text for an item of the axes category and type single-sided', () => {
        expect(
          createNameDe(
            Category.axes,
            Quality.excellent,
            EffectPower.none,
            undefined,
            AxeType.singleSided
          )
        ).toBe('Ausgezeichnete Axt');
      });

      it('Should return the german text for an item of the axes category and type double-sided', () => {
        expect(
          createNameDe(
            Category.axes,
            Quality.excellent,
            EffectPower.none,
            undefined,
            AxeType.doubleSided
          )
        ).toBe('Ausgezeichnete doppelseitige Axt');
      });

      it('Should return the german text for an item of the hammers category', () => {
        expect(
          createNameDe(Category.hammers, Quality.excellent, EffectPower.none)
        ).toBe('Ausgezeichneter Hammer');
      });

      it('Should return the german text for an item of the spears category', () => {
        expect(
          createNameDe(Category.spears, Quality.excellent, EffectPower.none)
        ).toBe('Ausgezeichneter Speer');
      });

      it('Should return the german text for an item of the daggers category', () => {
        expect(
          createNameDe(Category.daggers, Quality.excellent, EffectPower.none)
        ).toBe('Ausgezeichneter Dolch');
      });

      it('Should return the german text for an item of the swords category', () => {
        expect(
          createNameDe(Category.swords, Quality.excellent, EffectPower.none)
        ).toBe('Ausgezeichnetes Schwert');
      });

      it('Should return the german text for an item of the bows category', () => {
        expect(
          createNameDe(Category.bows, Quality.excellent, EffectPower.none)
        ).toBe('Ausgezeichneter Bogen');
      });

      it('Should return the german text for an item of the armors category and type leather', () => {
        expect(
          createNameDe(
            Category.armors,
            Quality.excellent,
            EffectPower.none,
            undefined,
            ArmorType.leather
          )
        ).toBe('Ausgezeichnete Lederrüstung');
      });

      it('Should return the german text for an item of the armors category and type chainmail', () => {
        expect(
          createNameDe(
            Category.armors,
            Quality.excellent,
            EffectPower.none,
            undefined,
            ArmorType.chainmail
          )
        ).toBe('Ausgezeichnetes Kettenhemd');
      });

      it('Should return the german text for an item of the armors category and type plate', () => {
        expect(
          createNameDe(
            Category.armors,
            Quality.excellent,
            EffectPower.none,
            undefined,
            ArmorType.plate
          )
        ).toBe('Ausgezeichneter Plattenpanzer');
      });

      it('Should return the german text for an item of the helmets category', () => {
        expect(
          createNameDe(Category.helmets, Quality.excellent, EffectPower.none)
        ).toBe('Ausgezeichneter Helm');
      });

      it('Should return the german text for an item of the shields category', () => {
        expect(
          createNameDe(Category.shields, Quality.excellent, EffectPower.none)
        ).toBe('Ausgezeichnetes Schild');
      });

      it('Should return the german text for an item of the wands category', () => {
        expect(
          createNameDe(Category.wands, Quality.excellent, EffectPower.none)
        ).toBe('Ausgezeichneter Zauberstab');
      });

      it('Should return the german text for an item of the scrolls category', () => {
        expect(
          createNameDe(Category.scrolls, Quality.excellent, EffectPower.none)
        ).toBe('Ausgezeichnete Schriftrolle');
      });

      it('Should return the german text for an item of the potions category and type green', () => {
        expect(
          createNameDe(
            Category.potions,
            Quality.excellent,
            EffectPower.none,
            undefined,
            PotionType.green
          )
        ).toBe('Ausgezeichneter schwacher Zaubertrank');
      });

      it('Should return the german text for an item of the potions category and type blue', () => {
        expect(
          createNameDe(
            Category.potions,
            Quality.excellent,
            EffectPower.none,
            undefined,
            PotionType.blue
          )
        ).toBe('Ausgezeichneter Zaubertrank');
      });

      it('Should return the german text for an item of the potions category and type red', () => {
        expect(
          createNameDe(
            Category.potions,
            Quality.excellent,
            EffectPower.none,
            undefined,
            PotionType.red
          )
        ).toBe('Ausgezeichneter starker Zaubertrank');
      });
    });

    describe('effect', () => {
      it('Should return the german text for an item of the axes category and type double-sided with a weak effect', () => {
        expect(
          createNameDe(
            Category.axes,
            Quality.excellent,
            EffectPower.weak,
            categoryEffects[Category.axes]?.[0],
            AxeType.doubleSided
          )
        ).toBe('Ausgezeichnete doppelseitige Axt der kleinen Luftdetonation');
      });

      it('Should return the german text for an item of the axes category and type double-sided with an average effect', () => {
        expect(
          createNameDe(
            Category.axes,
            Quality.excellent,
            EffectPower.average,
            categoryEffects[Category.axes]?.[0],
            AxeType.doubleSided
          )
        ).toBe('Ausgezeichnete doppelseitige Axt der Luftdetonation');
      });

      it('Should return the german text for an item of the axes category and type double-sided with a strong effect', () => {
        expect(
          createNameDe(
            Category.axes,
            Quality.excellent,
            EffectPower.strong,
            categoryEffects[Category.axes]?.[0],
            AxeType.doubleSided
          )
        ).toBe('Ausgezeichnete doppelseitige Axt der großen Luftdetonation');
      });
    });

    describe('errors', () => {
      it('Should throw an error for an item of the axes category and invalid type', () => {
        expect(() =>
          createNameDe(
            Category.axes,
            Quality.normal,
            EffectPower.none,
            undefined,
            ArmorType.leather
          )
        ).toThrow(Error);
      });

      it('Should throw an error for an item of the armors category and invalid type', () => {
        expect(() =>
          createNameDe(
            Category.armors,
            Quality.normal,
            EffectPower.none,
            undefined,
            AxeType.singleSided
          )
        ).toThrow(Error);
      });

      it('Should throw an error for an item of the potions category and invalid type', () => {
        expect(() =>
          createNameDe(
            Category.potions,
            Quality.normal,
            EffectPower.none,
            undefined,
            ArmorType.leather
          )
        ).toThrow(Error);
      });

      it('Should throw an error if no effect has been defined and the effect power is weak', () => {
        expect(() =>
          createNameDe(
            Category.swords,
            Quality.normal,
            EffectPower.weak,
            undefined
          )
        ).toThrow(Error);
      });

      it('Should throw an error if no effect has been defined and the effect power is average', () => {
        expect(() =>
          createNameDe(
            Category.swords,
            Quality.normal,
            EffectPower.average,
            undefined
          )
        ).toThrow(Error);
      });

      it('Should throw an error if no effect has been defined and the effect power is strong', () => {
        expect(() =>
          createNameDe(
            Category.swords,
            Quality.normal,
            EffectPower.strong,
            undefined
          )
        ).toThrow(Error);
      });

      it('Should throw an error if the effect power is invalid', () => {
        expect(() =>
          createNameDe(
            Category.swords,
            Quality.normal,
            undefined as unknown as EffectPower,
            categoryEffects[Category.axes]?.[0]
          )
        ).toThrow(Error);
      });

      it('Should throw an error if no effect name is found', () => {
        const axesCategory = categoryEffects[Category.axes];
        if (axesCategory && axesCategory[0]) {
          axesCategory[0].nameDe0 = undefined as unknown as string;
        }
        expect(() =>
          createNameDe(
            Category.swords,
            Quality.normal,
            EffectPower.weak,
            categoryEffects[Category.axes]?.[0]
          )
        ).toThrow(Error);
      });
    });
  });

  describe('createNameEnUs', () => {
    describe('quality normal', () => {
      it('Should return the english text for an item of the axes category and type single-sided', () => {
        expect(
          createNameEnUs(
            Category.axes,
            Quality.normal,
            EffectPower.none,
            undefined,
            AxeType.singleSided
          )
        ).toBe('Axe');
      });

      it('Should return the english text for an item of the axes category and type double-sided', () => {
        expect(
          createNameEnUs(
            Category.axes,
            Quality.normal,
            EffectPower.none,
            undefined,
            AxeType.doubleSided
          )
        ).toBe('Double-sided Axe');
      });

      it('Should return the english text for an item of the hammers category', () => {
        expect(
          createNameEnUs(Category.hammers, Quality.normal, EffectPower.none)
        ).toBe('Hammer');
      });

      it('Should return the english text for an item of the spears category', () => {
        expect(
          createNameEnUs(Category.spears, Quality.normal, EffectPower.none)
        ).toBe('Spear');
      });

      it('Should return the english text for an item of the daggers category', () => {
        expect(
          createNameEnUs(Category.daggers, Quality.normal, EffectPower.none)
        ).toBe('Dagger');
      });

      it('Should return the english text for an item of the swords category', () => {
        expect(
          createNameEnUs(Category.swords, Quality.normal, EffectPower.none)
        ).toBe('Sword');
      });

      it('Should return the english text for an item of the bows category', () => {
        expect(
          createNameEnUs(Category.bows, Quality.normal, EffectPower.none)
        ).toBe('Bow');
      });

      it('Should return the english text for an item of the armors category and type leather', () => {
        expect(
          createNameEnUs(
            Category.armors,
            Quality.normal,
            EffectPower.none,
            undefined,
            ArmorType.leather
          )
        ).toBe('Leather Armor');
      });

      it('Should return the english text for an item of the armors category and type chainmail', () => {
        expect(
          createNameEnUs(
            Category.armors,
            Quality.normal,
            EffectPower.none,
            undefined,
            ArmorType.chainmail
          )
        ).toBe('Chain Mail');
      });

      it('Should return the english text for an item of the armors category and type plate', () => {
        expect(
          createNameEnUs(
            Category.armors,
            Quality.normal,
            EffectPower.none,
            undefined,
            ArmorType.plate
          )
        ).toBe('Plate Armor');
      });

      it('Should return the english text for an item of the helmets category', () => {
        expect(
          createNameEnUs(Category.helmets, Quality.normal, EffectPower.none)
        ).toBe('Helmet');
      });

      it('Should return the english text for an item of the shields category', () => {
        expect(
          createNameEnUs(Category.shields, Quality.normal, EffectPower.none)
        ).toBe('Shield');
      });

      it('Should return the english text for an item of the wands category', () => {
        expect(
          createNameEnUs(Category.wands, Quality.normal, EffectPower.none)
        ).toBe('Wand');
      });

      it('Should return the english text for an item of the scrolls category', () => {
        expect(
          createNameEnUs(Category.scrolls, Quality.normal, EffectPower.none)
        ).toBe('Scroll');
      });

      it('Should return the english text for an item of the potions category and type green', () => {
        expect(
          createNameEnUs(
            Category.potions,
            Quality.normal,
            EffectPower.none,
            undefined,
            PotionType.green
          )
        ).toBe('Weak Potion');
      });

      it('Should return the english text for an item of the potions category and type blue', () => {
        expect(
          createNameEnUs(
            Category.potions,
            Quality.normal,
            EffectPower.none,
            undefined,
            PotionType.blue
          )
        ).toBe('Potion');
      });

      it('Should return the english text for an item of the potions category and type red', () => {
        expect(
          createNameEnUs(
            Category.potions,
            Quality.normal,
            EffectPower.none,
            undefined,
            PotionType.red
          )
        ).toBe('Strong Potion');
      });
    });

    describe('quality improved', () => {
      it('Should return the english text for an item of the axes category and type single-sided', () => {
        expect(
          createNameEnUs(
            Category.axes,
            Quality.improved,
            EffectPower.none,
            undefined,
            AxeType.singleSided
          )
        ).toBe('Improved Axe');
      });

      it('Should return the english text for an item of the axes category and type double-sided', () => {
        expect(
          createNameEnUs(
            Category.axes,
            Quality.improved,
            EffectPower.none,
            undefined,
            AxeType.doubleSided
          )
        ).toBe('Improved double-sided Axe');
      });

      it('Should return the english text for an item of the hammers category', () => {
        expect(
          createNameEnUs(Category.hammers, Quality.improved, EffectPower.none)
        ).toBe('Improved Hammer');
      });

      it('Should return the english text for an item of the spears category', () => {
        expect(
          createNameEnUs(Category.spears, Quality.improved, EffectPower.none)
        ).toBe('Improved Spear');
      });

      it('Should return the english text for an item of the daggers category', () => {
        expect(
          createNameEnUs(Category.daggers, Quality.improved, EffectPower.none)
        ).toBe('Improved Dagger');
      });

      it('Should return the english text for an item of the swords category', () => {
        expect(
          createNameEnUs(Category.swords, Quality.improved, EffectPower.none)
        ).toBe('Improved Sword');
      });

      it('Should return the english text for an item of the bows category', () => {
        expect(
          createNameEnUs(Category.bows, Quality.improved, EffectPower.none)
        ).toBe('Improved Bow');
      });

      it('Should return the english text for an item of the armors category and type leather', () => {
        expect(
          createNameEnUs(
            Category.armors,
            Quality.improved,
            EffectPower.none,
            undefined,
            ArmorType.leather
          )
        ).toBe('Improved Leather Armor');
      });

      it('Should return the english text for an item of the armors category and type chainmail', () => {
        expect(
          createNameEnUs(
            Category.armors,
            Quality.improved,
            EffectPower.none,
            undefined,
            ArmorType.chainmail
          )
        ).toBe('Improved Chain Mail');
      });

      it('Should return the english text for an item of the armors category and type plate', () => {
        expect(
          createNameEnUs(
            Category.armors,
            Quality.improved,
            EffectPower.none,
            undefined,
            ArmorType.plate
          )
        ).toBe('Improved Plate Armor');
      });

      it('Should return the english text for an item of the helmets category', () => {
        expect(
          createNameEnUs(Category.helmets, Quality.improved, EffectPower.none)
        ).toBe('Improved Helmet');
      });

      it('Should return the english text for an item of the shields category', () => {
        expect(
          createNameEnUs(Category.shields, Quality.improved, EffectPower.none)
        ).toBe('Improved Shield');
      });

      it('Should return the english text for an item of the wands category', () => {
        expect(
          createNameEnUs(Category.wands, Quality.improved, EffectPower.none)
        ).toBe('Improved Wand');
      });

      it('Should return the english text for an item of the scrolls category', () => {
        expect(
          createNameEnUs(Category.scrolls, Quality.improved, EffectPower.none)
        ).toBe('Improved Scroll');
      });

      it('Should return the english text for an item of the potions category and type green', () => {
        expect(
          createNameEnUs(
            Category.potions,
            Quality.improved,
            EffectPower.none,
            undefined,
            PotionType.green
          )
        ).toBe('Improved weak Potion');
      });

      it('Should return the english text for an item of the potions category and type blue', () => {
        expect(
          createNameEnUs(
            Category.potions,
            Quality.improved,
            EffectPower.none,
            undefined,
            PotionType.blue
          )
        ).toBe('Improved Potion');
      });

      it('Should return the english text for an item of the potions category and type red', () => {
        expect(
          createNameEnUs(
            Category.potions,
            Quality.improved,
            EffectPower.none,
            undefined,
            PotionType.red
          )
        ).toBe('Improved strong Potion');
      });
    });

    describe('quality excellent', () => {
      it('Should return the english text for an item of the axes category and type single-sided', () => {
        expect(
          createNameEnUs(
            Category.axes,
            Quality.excellent,
            EffectPower.none,
            undefined,
            AxeType.singleSided
          )
        ).toBe('Excellent Axe');
      });

      it('Should return the english text for an item of the axes category and type double-sided', () => {
        expect(
          createNameEnUs(
            Category.axes,
            Quality.excellent,
            EffectPower.none,
            undefined,
            AxeType.doubleSided
          )
        ).toBe('Excellent double-sided Axe');
      });

      it('Should return the english text for an item of the hammers category', () => {
        expect(
          createNameEnUs(Category.hammers, Quality.excellent, EffectPower.none)
        ).toBe('Excellent Hammer');
      });

      it('Should return the english text for an item of the spears category', () => {
        expect(
          createNameEnUs(Category.spears, Quality.excellent, EffectPower.none)
        ).toBe('Excellent Spear');
      });

      it('Should return the english text for an item of the daggers category', () => {
        expect(
          createNameEnUs(Category.daggers, Quality.excellent, EffectPower.none)
        ).toBe('Excellent Dagger');
      });

      it('Should return the english text for an item of the swords category', () => {
        expect(
          createNameEnUs(Category.swords, Quality.excellent, EffectPower.none)
        ).toBe('Excellent Sword');
      });

      it('Should return the english text for an item of the bows category', () => {
        expect(
          createNameEnUs(Category.bows, Quality.excellent, EffectPower.none)
        ).toBe('Excellent Bow');
      });

      it('Should return the english text for an item of the armors category and type leather', () => {
        expect(
          createNameEnUs(
            Category.armors,
            Quality.excellent,
            EffectPower.none,
            undefined,
            ArmorType.leather
          )
        ).toBe('Excellent Leather Armor');
      });

      it('Should return the english text for an item of the armors category and type chainmail', () => {
        expect(
          createNameEnUs(
            Category.armors,
            Quality.excellent,
            EffectPower.none,
            undefined,
            ArmorType.chainmail
          )
        ).toBe('Excellent Chain Mail');
      });

      it('Should return the english text for an item of the armors category and type plate', () => {
        expect(
          createNameEnUs(
            Category.armors,
            Quality.excellent,
            EffectPower.none,
            undefined,
            ArmorType.plate
          )
        ).toBe('Excellent Plate Armor');
      });

      it('Should return the english text for an item of the helmets category', () => {
        expect(
          createNameEnUs(Category.helmets, Quality.excellent, EffectPower.none)
        ).toBe('Excellent Helmet');
      });

      it('Should return the english text for an item of the shields category', () => {
        expect(
          createNameEnUs(Category.shields, Quality.excellent, EffectPower.none)
        ).toBe('Excellent Shield');
      });

      it('Should return the english text for an item of the wands category', () => {
        expect(
          createNameEnUs(Category.wands, Quality.excellent, EffectPower.none)
        ).toBe('Excellent Wand');
      });

      it('Should return the english text for an item of the scrolls category', () => {
        expect(
          createNameEnUs(Category.scrolls, Quality.excellent, EffectPower.none)
        ).toBe('Excellent Scroll');
      });

      it('Should return the english text for an item of the potions category and type green', () => {
        expect(
          createNameEnUs(
            Category.potions,
            Quality.excellent,
            EffectPower.none,
            undefined,
            PotionType.green
          )
        ).toBe('Excellent weak Potion');
      });

      it('Should return the english text for an item of the potions category and type blue', () => {
        expect(
          createNameEnUs(
            Category.potions,
            Quality.excellent,
            EffectPower.none,
            undefined,
            PotionType.blue
          )
        ).toBe('Excellent Potion');
      });

      it('Should return the english text for an item of the potions category and type red', () => {
        expect(
          createNameEnUs(
            Category.potions,
            Quality.excellent,
            EffectPower.none,
            undefined,
            PotionType.red
          )
        ).toBe('Excellent strong Potion');
      });
    });

    describe('effect', () => {
      it('Should return the english text for an item of the axes category and type double-sided with a weak effect', () => {
        expect(
          createNameEnUs(
            Category.axes,
            Quality.excellent,
            EffectPower.weak,
            categoryEffects[Category.axes]?.[0],
            AxeType.doubleSided
          )
        ).toBe('Excellent double-sided Axe of lesser Air Burst');
      });

      it('Should return the english text for an item of the axes category and type double-sided with an average effect', () => {
        expect(
          createNameEnUs(
            Category.axes,
            Quality.excellent,
            EffectPower.average,
            categoryEffects[Category.axes]?.[0],
            AxeType.doubleSided
          )
        ).toBe('Excellent double-sided Axe of Air Burst');
      });

      it('Should return the english text for an item of the axes category and type double-sided with a strong effect', () => {
        expect(
          createNameEnUs(
            Category.axes,
            Quality.excellent,
            EffectPower.strong,
            categoryEffects[Category.axes]?.[0],
            AxeType.doubleSided
          )
        ).toBe('Excellent double-sided Axe of greater Air Burst');
      });
    });

    describe('errors', () => {
      it('Should throw an error for an item of the axes category and invalid type', () => {
        expect(() =>
          createNameEnUs(
            Category.axes,
            Quality.normal,
            EffectPower.none,
            undefined,
            ArmorType.leather
          )
        ).toThrow(Error);
      });

      it('Should throw an error for an item of the armors category and invalid type', () => {
        expect(() =>
          createNameEnUs(
            Category.armors,
            Quality.normal,
            EffectPower.none,
            undefined,
            AxeType.singleSided
          )
        ).toThrow(Error);
      });

      it('Should throw an error for an item of the potions category and invalid type', () => {
        expect(() =>
          createNameEnUs(
            Category.potions,
            Quality.normal,
            EffectPower.none,
            undefined,
            ArmorType.leather
          )
        ).toThrow(Error);
      });

      it('Should throw an error if no effect has been defined and the effect power is weak', () => {
        expect(() =>
          createNameEnUs(
            Category.swords,
            Quality.normal,
            EffectPower.weak,
            undefined
          )
        ).toThrow(Error);
      });

      it('Should throw an error if no effect has been defined and the effect power is average', () => {
        expect(() =>
          createNameEnUs(
            Category.swords,
            Quality.normal,
            EffectPower.average,
            undefined
          )
        ).toThrow(Error);
      });

      it('Should throw an error if no effect has been defined and the effect power is strong', () => {
        expect(() =>
          createNameEnUs(
            Category.swords,
            Quality.normal,
            EffectPower.strong,
            undefined
          )
        ).toThrow(Error);
      });

      it('Should throw an error if the effect power is invalid', () => {
        expect(() =>
          createNameEnUs(
            Category.swords,
            Quality.normal,
            undefined as unknown as EffectPower,
            categoryEffects[Category.axes]?.[0]
          )
        ).toThrow(Error);
      });

      it('Should throw an error if no effect name is found', () => {
        const axesCategory = categoryEffects[Category.axes];
        if (axesCategory && axesCategory[0]) {
          axesCategory[0].nameEnUs0 = undefined as unknown as string;
        }
        expect(() =>
          createNameEnUs(
            Category.swords,
            Quality.normal,
            EffectPower.weak,
            categoryEffects[Category.axes]?.[0]
          )
        ).toThrow(Error);
      });
    });
  });
});
