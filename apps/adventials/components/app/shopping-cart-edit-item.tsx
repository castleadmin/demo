import { Language, PriceService } from '@castleadmin/checkout-domain';
import {
  Button,
  Divider,
  FormControl,
  Icon,
  IconButton,
  InputLabel,
  MenuItem,
  Rating,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { Trans, useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { MouseEvent, useState } from 'react';
import { changeQuantity, removeFromCart } from '../../cart.state';
import { getEffectImage128, getItemImage128 } from '../../image';
import {
  CartItem,
  cartItemMaxQuantity,
  getItemName,
  getItemPriceEur,
} from '../../item';
import { useAppDispatch } from '../../store';
import styles from './shopping-cart-edit-item.module.scss';

/* eslint-disable-next-line */
export interface ShoppingCartEditItemProps {
  cartItem: CartItem;
  onEditComplete: () => void;
}

export let stateShoppingCartEditItem;

export function ShoppingCartEditItem(props: ShoppingCartEditItemProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const router = useRouter();
  const locale = router.locale as Language;

  const cartItem = props.cartItem;
  const item = cartItem.item;
  const itemName = getItemName(item, locale);

  const [state, setState] = useState({
    quantity: cartItem.quantity,
  });
  stateShoppingCartEditItem = state;

  const onBack = (event) => {
    event.stopPropagation();

    props.onEditComplete();
  };

  const onQuantityChange = (event: SelectChangeEvent<number>) => {
    const quantity = event.target.value as number;

    setState({ ...state, quantity });
    dispatch(changeQuantity({ ...props.cartItem, quantity }));
  };

  const onRemove = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    dispatch(removeFromCart(props.cartItem));
    props.onEditComplete();
  };

  return (
    <div className={styles['edit-item']}>
      <div className={styles['header']}>
        <Typography
          variant="h6"
          color="text.primary"
          sx={{ fontSize: '1.125rem', fontWeight: '400' }}
        >
          {itemName}
        </Typography>
        <IconButton edge="end" sx={{ ml: 2, pt: 0, pb: 0 }} onClick={onRemove}>
          <Icon className="adventials-material-symbols-outlined">
            delete_outlined
          </Icon>
        </IconButton>
      </div>
      <div className={styles['is-in-stock']}>
        <Typography
          variant="subtitle2"
          variantMapping={{ subtitle2: 'span' }}
          color={item.isInStock ? 'primary.light' : 'text.secondary'}
        >
          <Trans>{item.isInStock ? 'inStock' : 'notInStock'}</Trans>
        </Typography>
      </div>
      <div className={styles['image-container']}>
        {item.effect && (
          <Image
            className={styles['effect-image']}
            src={getEffectImage128(item)}
            width={128}
            height={128}
            alt={itemName}
          />
        )}
        <Image
          className={styles['item-image']}
          src={getItemImage128(item)}
          width={128}
          height={128}
          alt={itemName}
        />
      </div>
      <div className={styles['item-properties']}>
        <div className={styles['rating-container']}>
          <div className={styles['rating']}>
            <Rating
              defaultValue={item.halfStars / 2}
              precision={0.5}
              readOnly
            />
            <span className={styles['rating-count']}>
              <Typography
                variant="subtitle1"
                variantMapping={{ subtitle1: 'span' }}
                color="text.primary"
              >
                ({item.ratingCount})
              </Typography>
            </span>
          </div>
        </div>
        <div className={styles['item-price']}>
          <FormControl size="small" sx={{ width: '96px' }}>
            <InputLabel
              id="shopping-cart-edit-item-quantity-label"
              color="label"
            >
              <Trans>quantity</Trans>
            </InputLabel>
            <Select
              id="shopping-cart-edit-item-quantity"
              labelId="shopping-cart-edit-item-quantity-label"
              label={t('quantity')}
              value={state.quantity}
              onChange={onQuantityChange}
              color="secondary"
            >
              {Array.from(
                { length: cartItemMaxQuantity },
                (_, index) => index + 1
              ).map((index) => (
                <MenuItem
                  key={index}
                  value={index}
                  onClick={(event) => event.stopPropagation()}
                >
                  {index}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography color="text.primary">
            {getItemPriceEur(item, locale)}
          </Typography>
        </div>
        <Divider />
        <div className={styles['total-price']}>
          <Typography color="text.primary">
            <Trans>totalPrice</Trans>
          </Typography>
          <Typography color="text.primary">
            {PriceService.getItemsTotalPriceEurString(
              [{ ...cartItem, quantity: state.quantity }],
              locale
            )}
          </Typography>
        </div>
        <div className={styles['back-to-cart']}>
          <Button
            id="shopping-cart-edit-item-back-to-cart"
            variant="outlined"
            color="button"
            startIcon={
              <Icon className="adventials-material-symbols-outlined">
                arrow_back_outlined
              </Icon>
            }
            sx={{ width: '100%' }}
            onClick={onBack}
          >
            <Trans>backToCart</Trans>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCartEditItem;
