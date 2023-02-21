import { Language } from '@castleadmin/checkout-domain';
import {
  AppBar,
  Divider,
  Drawer,
  Icon,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
} from '@mui/material';
import equal from 'fast-deep-equal';
import { Trans } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { CartItem } from '../../item';
import { useAppSelector } from '../../store';
import styles from './header.module.scss';
import MainMenu from './main-menu';
import Search from './search';
import ShoppingCart from './shopping-cart';

/* eslint-disable-next-line */
export interface HeaderProps {}

export let stateHeader;

export function Header(_props: HeaderProps) {
  const router = useRouter();
  const { pathname, asPath, query } = router;

  const cartItems: CartItem[] = useAppSelector((state) => state.cart.cartItems);

  const [state, setState] = useState({
    menuOpen: false,
    cartOpen: false,
    cartItems: cartItems,
    languageMenuTarget: null as HTMLElement | null,
    optionsMenuTarget: null as HTMLElement | null,
  });
  stateHeader = state;

  if (!equal(state.cartItems, cartItems)) {
    // Show shopping cart, if it has been changed.
    if (cartItems.length === 0) {
      setState({ ...state, cartItems });
    } else {
      setState({ ...state, cartItems, cartOpen: true });
    }
  }

  const onOpenMenu = () => {
    setState({ ...state, menuOpen: true });
  };

  const onCloseMenu = () => {
    setState({ ...state, menuOpen: false });
  };

  const onOpenCart = () => {
    setState({ ...state, cartOpen: true });
  };

  const onCloseCart = () => {
    setState({ ...state, cartOpen: false });
  };

  const onOpenLanguageMenu = (event: React.MouseEvent<HTMLElement>) => {
    setState({ ...state, languageMenuTarget: event.currentTarget });
  };

  const onCloseLanguageMenu = (language?: Language) => {
    setState({ ...state, languageMenuTarget: null });

    if (language) {
      router.push({ pathname, query }, asPath, { locale: language });
    }
  };

  const onOpenOptionsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setState({ ...state, optionsMenuTarget: event.currentTarget });
  };

  const onCloseOptionsMenu = (option?: {
    type: 'cart' | 'language';
    language?: Language;
  }) => {
    if (option && option.type === 'cart') {
      setState({ ...state, optionsMenuTarget: null, cartOpen: true });
    } else if (option && option.type === 'language' && option.language) {
      setState({ ...state, optionsMenuTarget: null });

      router.push({ pathname, query }, asPath, { locale: option.language });
    } else {
      setState({ ...state, optionsMenuTarget: null });
    }
  };

  const onCheckout = () => {
    setState({ ...state, cartOpen: false });

    router.push({ pathname: '/checkout', query: {} });
  };

  return (
    <>
      <AppBar sx={{ boxShadow: 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton
            className={styles['header-menu'] as string}
            id="header-menu"
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
            onClick={onOpenMenu}
          >
            <Icon className="adventials-material-symbols-outlined">
              menu_outlined
            </Icon>
          </IconButton>
          <div className={styles['header-search']}>
            <Search />
          </div>
          <IconButton
            className={styles['header-cart'] as string}
            id="header-cart"
            size="large"
            edge="end"
            color="inherit"
            sx={{ ml: 2 }}
            onClick={onOpenCart}
          >
            <Icon className="adventials-material-symbols-outlined">
              shopping_cart_outlined
            </Icon>
          </IconButton>
          <IconButton
            className={styles['header-language'] as string}
            id="header-language"
            size="large"
            edge="end"
            color="inherit"
            sx={{ ml: 2 }}
            onClick={onOpenLanguageMenu}
          >
            <Icon className="adventials-material-symbols-outlined">
              language_outlined
            </Icon>
          </IconButton>
          <Menu
            id="header-language-menu"
            anchorEl={state.languageMenuTarget}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(state.languageMenuTarget)}
            onClose={() => onCloseLanguageMenu(undefined)}
          >
            <MenuItem
              id="header-language-menu-de"
              onClick={() => onCloseLanguageMenu(Language.de)}
            >
              de
            </MenuItem>
            <MenuItem
              id="header-language-menu-en-us"
              onClick={() => onCloseLanguageMenu(Language.enUs)}
            >
              en-US
            </MenuItem>
          </Menu>
          <IconButton
            className={styles['header-options'] as string}
            id="header-options"
            size="large"
            edge="end"
            color="inherit"
            sx={{ ml: 2 }}
            onClick={onOpenOptionsMenu}
          >
            <Icon className="adventials-material-symbols-outlined">
              more_vert_outlined
            </Icon>
          </IconButton>
          <Menu
            id="header-options-menu"
            anchorEl={state.optionsMenuTarget}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(state.optionsMenuTarget)}
            onClose={() => onCloseOptionsMenu(undefined)}
          >
            <MenuItem
              id="header-options-cart"
              onClick={() => onCloseOptionsMenu({ type: 'cart' })}
            >
              <ListItemIcon>
                <Icon
                  className="adventials-material-symbols-outlined-small"
                  fontSize="small"
                >
                  shopping_cart_outlined
                </Icon>
              </ListItemIcon>
              <ListItemText>
                <Trans>cart</Trans>
              </ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem
              id="header-options-language-de"
              onClick={() =>
                onCloseOptionsMenu({ type: 'language', language: Language.de })
              }
            >
              <ListItemIcon>
                <Icon
                  className="adventials-material-symbols-outlined-small"
                  fontSize="small"
                >
                  language_outlined
                </Icon>
              </ListItemIcon>
              <ListItemText>de</ListItemText>
            </MenuItem>
            <MenuItem
              id="header-options-language-en-us"
              onClick={() =>
                onCloseOptionsMenu({
                  type: 'language',
                  language: Language.enUs,
                })
              }
            >
              <ListItemIcon>
                <Icon
                  className="adventials-material-symbols-outlined-small"
                  fontSize="small"
                >
                  language_outlined
                </Icon>
              </ListItemIcon>
              <ListItemText>en-US</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        id="header-menu-drawer"
        anchor="left"
        open={state.menuOpen}
        onClick={onCloseMenu}
        onClose={onCloseMenu}
        PaperProps={{ sx: { bgcolor: 'menu.main' } }}
      >
        <MainMenu />
      </Drawer>
      <Drawer
        id="header-cart-drawer"
        anchor="right"
        open={state.cartOpen}
        onClick={onCloseCart}
        onClose={onCloseCart}
        PaperProps={{ sx: { bgcolor: 'menu.main' } }}
      >
        <ShoppingCart onCheckout={onCheckout} />
      </Drawer>
    </>
  );
}

export default Header;
