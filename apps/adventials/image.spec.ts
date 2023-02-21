import {
  ArmorType,
  AxeType,
  Category,
  EffectPower,
  Item,
  PotionType,
  Quality,
} from '@castleadmin/product-domain';
import {
  getEffectImage128,
  getEffectImage256,
  getEffectImageName,
  getItemImage128,
  getItemImage256,
  getItemImageName,
} from './image';
import { createMockItem } from './specs/mocks';

describe('image', () => {
  let item: Item;

  beforeEach(() => {
    item = createMockItem();
  });

  describe('getItemImageName', () => {
    describe('quality normal', () => {
      it('Should return the image name for an axe', () => {
        item.category = Category.axes;
        item.quality = Quality.normal;
        item.type = AxeType.singleSided;

        expect(getItemImageName(item)).toBe('axe.png');
      });

      it('Should return the image name for a double-sided axe', () => {
        item.category = Category.axes;
        item.quality = Quality.normal;
        item.type = AxeType.doubleSided;

        expect(getItemImageName(item)).toBe('axeDouble.png');
      });

      it('Should return the image name for a hammer', () => {
        item.category = Category.hammers;
        item.quality = Quality.normal;

        expect(getItemImageName(item)).toBe('hammer.png');
      });

      it('Should return the image name for a spear', () => {
        item.category = Category.spears;
        item.quality = Quality.normal;

        expect(getItemImageName(item)).toBe('spear.png');
      });

      it('Should return the image name for a dagger', () => {
        item.category = Category.daggers;
        item.quality = Quality.normal;

        expect(getItemImageName(item)).toBe('dagger.png');
      });

      it('Should return the image name for a sword', () => {
        item.category = Category.swords;
        item.quality = Quality.normal;

        expect(getItemImageName(item)).toBe('sword.png');
      });

      it('Should return the image name for a bow', () => {
        item.category = Category.bows;
        item.quality = Quality.normal;

        expect(getItemImageName(item)).toBe('bow.png');
      });

      it('Should return the image name for a leather armor', () => {
        item.category = Category.armors;
        item.quality = Quality.normal;
        item.type = ArmorType.leather;

        expect(getItemImageName(item)).toBe('leather.png');
      });

      it('Should return the image name for a chainmail', () => {
        item.category = Category.armors;
        item.quality = Quality.normal;
        item.type = ArmorType.chainmail;

        expect(getItemImageName(item)).toBe('leather2.png');
      });

      it('Should return the image name for a plate armor', () => {
        item.category = Category.armors;
        item.quality = Quality.normal;
        item.type = ArmorType.plate;

        expect(getItemImageName(item)).toBe('armor.png');
      });

      it('Should return the image name for a helmet', () => {
        item.category = Category.helmets;
        item.quality = Quality.normal;

        expect(getItemImageName(item)).toBe('helmet.png');
      });

      it('Should return the image name for a shield', () => {
        item.category = Category.shields;
        item.quality = Quality.normal;

        expect(getItemImageName(item)).toBe('shield.png');
      });

      it('Should return the image name for a wand', () => {
        item.category = Category.wands;
        item.quality = Quality.normal;

        expect(getItemImageName(item)).toBe('wand.png');
      });

      it('Should return the image name for a scroll', () => {
        item.category = Category.scrolls;
        item.quality = Quality.normal;

        expect(getItemImageName(item)).toBe('scroll.png');
      });

      it('Should return the image name for a green potion', () => {
        item.category = Category.potions;
        item.quality = Quality.normal;
        item.type = PotionType.green;

        expect(getItemImageName(item)).toBe('potionGreen.png');
      });

      it('Should return the image name for a blue potion', () => {
        item.category = Category.potions;
        item.quality = Quality.normal;
        item.type = PotionType.blue;

        expect(getItemImageName(item)).toBe('potionBlue.png');
      });

      it('Should return the image name for a red potion', () => {
        item.category = Category.potions;
        item.quality = Quality.normal;
        item.type = PotionType.red;

        expect(getItemImageName(item)).toBe('potionRed.png');
      });
    });

    describe('quality improved', () => {
      it('Should return the image name for an axe', () => {
        item.category = Category.axes;
        item.quality = Quality.improved;
        item.type = AxeType.singleSided;

        expect(getItemImageName(item)).toBe('axe2.png');
      });

      it('Should return the image name for a double-sided axe', () => {
        item.category = Category.axes;
        item.quality = Quality.improved;
        item.type = AxeType.doubleSided;

        expect(getItemImageName(item)).toBe('axeDouble2.png');
      });
    });

    describe('quality excellent', () => {
      it('Should return the image name for an axe', () => {
        item.category = Category.axes;
        item.quality = Quality.excellent;
        item.type = AxeType.singleSided;

        expect(getItemImageName(item)).toBe('upg_axe.png');
      });

      it('Should return the image name for a double-sided axe', () => {
        item.category = Category.axes;
        item.quality = Quality.excellent;
        item.type = AxeType.doubleSided;

        expect(getItemImageName(item)).toBe('upg_axeDouble.png');
      });

      it('Should return the image name for a hammer', () => {
        item.category = Category.hammers;
        item.quality = Quality.excellent;

        expect(getItemImageName(item)).toBe('upg_hammer.png');
      });

      it('Should return the image name for a spear', () => {
        item.category = Category.spears;
        item.quality = Quality.excellent;

        expect(getItemImageName(item)).toBe('upg_spear.png');
      });

      it('Should return the image name for a dagger', () => {
        item.category = Category.daggers;
        item.quality = Quality.excellent;

        expect(getItemImageName(item)).toBe('upg_dagger.png');
      });

      it('Should return the image name for a sword', () => {
        item.category = Category.swords;
        item.quality = Quality.excellent;

        expect(getItemImageName(item)).toBe('upg_sword.png');
      });

      it('Should return the image name for a bow', () => {
        item.category = Category.bows;
        item.quality = Quality.excellent;

        expect(getItemImageName(item)).toBe('upg_bow.png');
      });

      it('Should return the image name for a plate armor', () => {
        item.category = Category.armors;
        item.quality = Quality.excellent;
        item.type = ArmorType.plate;

        expect(getItemImageName(item)).toBe('upg_armor.png');
      });

      it('Should return the image name for a helmet', () => {
        item.category = Category.helmets;
        item.quality = Quality.excellent;

        expect(getItemImageName(item)).toBe('upg_helmet.png');
      });

      it('Should return the image name for a shield', () => {
        item.category = Category.shields;
        item.quality = Quality.excellent;

        expect(getItemImageName(item)).toBe('upg_shield.png');
      });

      it('Should return the image name for a wand', () => {
        item.category = Category.wands;
        item.quality = Quality.excellent;

        expect(getItemImageName(item)).toBe('upg_wand.png');
      });
    });

    it("Should throw an error if the category isn't supported", () => {
      item.category = 'abc' as Category;
      item.quality = Quality.normal;
      item.type = AxeType.singleSided;

      expect(() => getItemImageName(item)).toThrow(Error);
    });

    it('Should throw an error if the category is undefined', () => {
      item.category = undefined as unknown as Category;
      item.quality = Quality.normal;
      item.type = AxeType.singleSided;

      expect(() => getItemImageName(item)).toThrow(Error);
    });
  });

  describe('getItemImage128', () => {
    it('Should create the correct image path', () => {
      expect(getItemImage128(item)).toBe('/categories128/upg_axe.png');
    });
  });

  describe('getItemImage256', () => {
    it('Should create the correct image path', () => {
      expect(getItemImage256(item)).toBe('/categories256/upg_axe.png');
    });
  });

  describe('getEffectImageName', () => {
    it("Should return undefined if the effect isn't defined", () => {
      delete item.effect;
      item.effectPower = EffectPower.none;

      expect(getEffectImageName(item)).toBe(undefined);
    });

    it('Should return the correct effect name if the effect power is weak', () => {
      item.effect = 'fog';
      item.effectPower = EffectPower.weak;

      expect(getEffectImageName(item)).toBe('fog-sky-1.png');
    });

    it('Should return the correct effect name if the effect power is average', () => {
      item.effect = 'fog';
      item.effectPower = EffectPower.average;

      expect(getEffectImageName(item)).toBe('fog-sky-2.png');
    });

    it('Should return the correct effect name if the effect power is strong', () => {
      item.effect = 'fog';
      item.effectPower = EffectPower.strong;

      expect(getEffectImageName(item)).toBe('fog-sky-3.png');
    });

    it("Should throw an error if the effect isn't supported", () => {
      item.effect = 'testEffect';
      item.effectPower = EffectPower.weak;

      expect(() => getEffectImageName(item)).toThrow(Error);
    });

    it("Should throw an error if the effect power isn't supported", () => {
      item.effect = 'fog';
      item.effectPower = 'test' as EffectPower;

      expect(() => getEffectImageName(item)).toThrow(Error);
    });
  });

  describe('getEffectImage128', () => {
    it('Should create the correct effect path', () => {
      expect(getEffectImage128(item)).toBe('/effects128/fog-sky-3.png');
    });
  });

  describe('getEffectImage256', () => {
    it('Should create the correct effect path', () => {
      expect(getEffectImage256(item)).toBe('/effects256/fog-sky-3.png');
    });
  });
});
