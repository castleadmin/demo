import { Category as CategoryEnum } from '@castleadmin/product-domain';
import styles from './categories.module.scss';
import Category from './category';

/* eslint-disable-next-line */
export interface CategoriesProps {}

export function Categories(_props: CategoriesProps) {
  return (
    <div className={styles['categories']}>
      <div className={styles['category-container']}>
        <Category
          category={CategoryEnum.axes}
          imagePath="/categories128/axe.png"
        />
        <Category
          category={CategoryEnum.hammers}
          imagePath="/categories128/hammer.png"
        />
        <Category
          category={CategoryEnum.spears}
          imagePath="/categories128/spear.png"
        />
        <Category
          category={CategoryEnum.swords}
          imagePath="/categories128/sword.png"
        />
        <Category
          category={CategoryEnum.daggers}
          imagePath="/categories128/dagger.png"
        />
        <Category
          category={CategoryEnum.bows}
          imagePath="/categories128/bow.png"
        />
        <Category
          category={CategoryEnum.armors}
          imagePath="/categories128/armor.png"
        />
        <Category
          category={CategoryEnum.helmets}
          imagePath="/categories128/helmet.png"
        />
        <Category
          category={CategoryEnum.shields}
          imagePath="/categories128/shield.png"
        />
        <Category
          category={CategoryEnum.wands}
          imagePath="/categories128/wand.png"
        />
        <Category
          category={CategoryEnum.scrolls}
          imagePath="/categories128/scroll.png"
        />
        <Category
          category={CategoryEnum.potions}
          imagePath="/categories128/potionBlue.png"
        />
      </div>
    </div>
  );
}

export default Categories;
