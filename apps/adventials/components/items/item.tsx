import { Language } from '@castleadmin/checkout-domain';
import { Item as ItemDomain } from '@castleadmin/product-domain';
import {
  Button,
  Card,
  CardContent,
  FormControl,
  Icon,
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
import { useState } from 'react';
import { addToCart } from '../../cart.state';
import { getEffectImage256, getItemImage256 } from '../../image';
import {
  cartItemMaxQuantity,
  getItemDescription,
  getItemEffectName,
  getItemName,
  getItemPriceEur,
} from '../../item';
import { useAppDispatch } from '../../store';
import styles from './item.module.scss';

/* eslint-disable-next-line */
export interface ItemProps {
  item: ItemDomain;
}

export let stateItem;

export function Item(props: ItemProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const router = useRouter();
  const locale = router.locale as Language;

  const [state, setState] = useState({
    quantity: 1,
  });
  stateItem = state;

  const item = props.item;
  const itemName = getItemName(item, locale);

  const onQuantityChange = (event: SelectChangeEvent<number>) => {
    setState({ ...state, quantity: event.target.value as number });
  };

  const onAddToCart = () => {
    dispatch(
      addToCart({
        quantity: state.quantity,
        item,
      })
    );
  };

  return (
    <div className={styles['item']}>
      <div className={styles['title']}>
        <Typography variant="h4">{itemName}</Typography>
      </div>
      <div className={styles['content-container']}>
        <div className={styles['image-card']}>
          <div className={styles['image-container']}>
            {item.effect && (
              <Image
                className={styles['effect-image']}
                src={getEffectImage256(item)}
                width={256}
                height={256}
                alt={itemName}
              />
            )}
            <Image
              className={styles['item-image']}
              src={getItemImage256(item)}
              width={256}
              height={256}
              alt={itemName}
            />
          </div>
        </div>
        <Card className={styles['add-to-cart-card'] as string}>
          <CardContent>
            <div className={styles['price-container']}>
              <Typography
                variant="h6"
                sx={{ fontSize: '1.125rem', fontWeight: '400' }}
                color="text.primary"
              >
                {getItemPriceEur(item, locale)}
              </Typography>
              <Typography
                variant="subtitle1"
                color={item.isInStock ? 'primary.light' : 'text.secondary'}
                sx={{ fontWeight: '500' }}
              >
                <Trans>{item.isInStock ? 'inStock' : 'notInStock'}</Trans>
              </Typography>
            </div>
            <div className={styles['quantity'] as string}>
              <FormControl fullWidth>
                <InputLabel id="quantity-label" color="label">
                  <Trans>quantity</Trans>
                </InputLabel>
                <Select
                  id="item-quantity"
                  labelId="quantity-label"
                  label={t('quantity')}
                  value={state.quantity}
                  onChange={onQuantityChange}
                  color="secondary"
                >
                  {Array.from(
                    { length: cartItemMaxQuantity },
                    (_, index) => index + 1
                  ).map((index) => (
                    <MenuItem key={index} value={index}>
                      {index}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className={styles['add-to-cart'] as string}>
              <Button
                variant="outlined"
                color="button"
                startIcon={
                  <Icon className="adventials-material-symbols-outlined">
                    add_shopping_cart_outlined
                  </Icon>
                }
                sx={{ width: '100%' }}
                onClick={onAddToCart}
              >
                <Trans>addToCart</Trans>
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className={styles['details-card'] as string}>
          <CardContent>
            <div className={styles['properties-container']}>
              <Typography
                variant="h6"
                sx={{ fontSize: '1.125rem', fontWeight: '400' }}
              >
                <Trans>properties</Trans>
              </Typography>
              <div className={styles['property-table']}>
                {item.type && (
                  <Typography
                    className={styles['property-item'] as string}
                    variant="body2"
                    color="text.secondary"
                  >
                    <Trans>type</Trans>
                  </Typography>
                )}
                {item.type && (
                  <Typography className={styles['property-item'] as string}>
                    <Trans>{`type${item.type
                      .charAt(0)
                      .toUpperCase()}${item.type.substring(1)}`}</Trans>
                  </Typography>
                )}
                <Typography
                  className={styles['property-item'] as string}
                  variant="body2"
                  color="text.secondary"
                >
                  <Trans>quality</Trans>
                </Typography>
                <Typography className={styles['property-item'] as string}>
                  <Trans>{`quality${item.quality
                    .charAt(0)
                    .toUpperCase()}${item.quality.substring(1)}`}</Trans>
                </Typography>
                <Typography
                  className={styles['property-item'] as string}
                  variant="body2"
                  color="text.secondary"
                >
                  <Trans>magicalPower</Trans>
                </Typography>
                <Typography className={styles['property-item'] as string}>
                  <Trans>{`magicalPower${item.effectPower
                    .charAt(0)
                    .toUpperCase()}${item.effectPower.substring(1)}`}</Trans>
                </Typography>
                {item.effect && (
                  <Typography
                    className={styles['property-item'] as string}
                    variant="body2"
                    color="text.secondary"
                  >
                    <Trans>magicalEffect</Trans>
                  </Typography>
                )}
                {item.effect && (
                  <Typography className={styles['property-item'] as string}>
                    {getItemEffectName(item, locale)}
                  </Typography>
                )}
                <Typography
                  className={styles['property-item'] as string}
                  variant="body2"
                  color="text.secondary"
                >
                  EAN
                </Typography>
                <Typography className={styles['property-item'] as string}>
                  {item.ean}
                </Typography>
              </div>
            </div>
            <div className={styles['rating']}>
              <Typography
                variant="h6"
                sx={{ fontSize: '1.125rem', fontWeight: '400' }}
              >
                <Trans>rating</Trans>
              </Typography>
              <div className={styles['rating-container']}>
                <Rating
                  key={item._id}
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
            <div className={styles['description']}>
              <Typography
                variant="h6"
                sx={{ fontSize: '1.125rem', fontWeight: '400' }}
              >
                <Trans>description</Trans>
              </Typography>
              <Typography className={styles['description-text'] as string}>
                {getItemDescription(item, locale)}
              </Typography>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Item;
