import { Language, PriceService } from '@castleadmin/checkout-domain';
import {
  Box,
  Button,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
} from '@mui/material';
import { Trans } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MouseEvent, useState } from 'react';
import { getEffectImage128, getItemImage128 } from '../../image';
import { CartItem, getItemName, getItemPriceEur } from '../../item';
import { useAppSelector } from '../../store';
import ShoppingCartEditItem from './shopping-cart-edit-item';
import styles from './shopping-cart.module.scss';

/* eslint-disable-next-line */
export interface ShoppingCartProps {
  onCheckout: () => void;
}

export let stateShoppingCart;

export function ShoppingCart(props: ShoppingCartProps) {
  const router = useRouter();
  const locale = router.locale as Language;

  const cartItems: CartItem[] = useAppSelector((state) => state.cart.cartItems);

  const [state, setState] = useState({
    editCartItem: undefined as CartItem | undefined,
  });
  stateShoppingCart = state;

  const onEdit = (event: MouseEvent<HTMLButtonElement>, cartItem: CartItem) => {
    event.stopPropagation();

    setState({ ...state, editCartItem: cartItem });
  };

  const onEditComplete = () => {
    setState({ ...state, editCartItem: undefined });
  };

  const onCheckout = (event) => {
    event.stopPropagation();

    props.onCheckout();
  };

  return (
    <div className={styles['shopping-cart']}>
      {!state.editCartItem && (
        <div className={styles['content']}>
          <div className={styles['total-price']}>
            <Typography color="primary.light">
              <Trans>totalPrice</Trans>
            </Typography>
            <Typography color="primary.light">
              {PriceService.getItemsTotalPriceEurString(cartItems, locale)}
            </Typography>
          </div>
          <div className={styles['checkout']}>
            <Button
              id="shopping-cart-checkout-button"
              variant="outlined"
              color="button"
              startIcon={
                <Icon className="adventials-material-symbols-outlined">
                  shopping_cart_checkout_outlined
                </Icon>
              }
              sx={{ width: '100%' }}
              disabled={cartItems.length === 0}
              onClick={onCheckout}
            >
              <Trans>toCheckout</Trans>
            </Button>
          </div>
          <List
            className={styles['list'] as string}
            subheader={
              <ListSubheader
                component="div"
                disableSticky={true}
                sx={{ mb: -2 }}
              >
                <Trans>cart</Trans>
              </ListSubheader>
            }
          >
            {cartItems.length === 0 && (
              <ListItem>
                <Typography sx={{ mt: 1, fontSize: '0.9375rem' }}>
                  <Trans>cartEmpty</Trans>
                </Typography>
              </ListItem>
            )}
            {cartItems.map((cartItem) => (
              <ListItem
                key={cartItem.item._id}
                className={styles['item'] as string}
                secondaryAction={
                  <IconButton
                    id={`shopping-cart-edit-item-${cartItem.item._id}`}
                    edge="end"
                    onClick={(event) => onEdit(event, cartItem)}
                  >
                    <Icon className="adventials-material-symbols-outlined">
                      edit_outlined
                    </Icon>
                  </IconButton>
                }
              >
                <Link
                  className={styles['link']}
                  href={{ pathname: `/items/${cartItem.item._id}`, query: {} }}
                >
                  <ListItemButton className={styles['item-button'] as string}>
                    <ListItemIcon sx={{ mr: 1 }}>
                      <div className={styles['image-container']}>
                        {cartItem.item.effect && (
                          <Image
                            className={styles['effect-image']}
                            src={getEffectImage128(cartItem.item)}
                            width={64}
                            height={64}
                            alt={getItemName(cartItem.item, locale)}
                          />
                        )}
                        <Image
                          className={styles['item-image']}
                          src={getItemImage128(cartItem.item)}
                          width={64}
                          height={64}
                          alt={getItemName(cartItem.item, locale)}
                        />
                      </div>
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{ component: 'div' }}
                      primary={
                        <span className={styles['item-title']}>
                          {getItemName(cartItem.item, locale)}
                        </span>
                      }
                      secondaryTypographyProps={{ component: 'div' }}
                      secondary={
                        <>
                          <Box
                            id={`shopping-cart-is-in-stock-${cartItem.item._id}`}
                            className={styles['is-in-stock'] as string}
                            color={
                              cartItem.item.isInStock
                                ? 'primary.light'
                                : 'text.secondary'
                            }
                          >
                            <Trans>
                              {cartItem.item.isInStock
                                ? 'inStock'
                                : 'notInStock'}
                            </Trans>
                          </Box>
                          <div className={styles['price-container']}>
                            {cartItem.quantity} x{' '}
                            {getItemPriceEur(cartItem.item, locale)}
                          </div>
                        </>
                      }
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>
        </div>
      )}
      {state.editCartItem && (
        <div className={styles['edit-item']}>
          <ShoppingCartEditItem
            cartItem={state.editCartItem}
            onEditComplete={onEditComplete}
          />
        </div>
      )}
    </div>
  );
}

export default ShoppingCart;
