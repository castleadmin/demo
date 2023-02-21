import { Category } from '@castleadmin/product-domain';
import { List } from '@mui/material';
import styles from './main-menu.module.scss';
import MenuItem from './menu-item';

/* eslint-disable-next-line */
export interface MainMenuProps {}

export function MainMenu(_props: MainMenuProps) {
  return (
    <List className={styles['main-menu'] as string}>
      <MenuItem name="home" imagePath="/categories48/map.png" />
      <MenuItem name={Category.axes} imagePath="/categories48/axe.png" />
      <MenuItem name={Category.hammers} imagePath="/categories48/hammer.png" />
      <MenuItem name={Category.spears} imagePath="/categories48/spear.png" />
      <MenuItem name={Category.swords} imagePath="/categories48/sword.png" />
      <MenuItem name={Category.daggers} imagePath="/categories48/dagger.png" />
      <MenuItem name={Category.bows} imagePath="/categories48/bow.png" />
      <MenuItem name={Category.armors} imagePath="/categories48/armor.png" />
      <MenuItem name={Category.helmets} imagePath="/categories48/helmet.png" />
      <MenuItem name={Category.shields} imagePath="/categories48/shield.png" />
      <MenuItem name={Category.wands} imagePath="/categories48/wand.png" />
      <MenuItem name={Category.scrolls} imagePath="/categories48/scroll.png" />
      <MenuItem
        name={Category.potions}
        imagePath="/categories48/potionBlue.png"
      />
    </List>
  );
}

export default MainMenu;
