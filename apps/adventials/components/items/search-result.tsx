import { Language } from '@castleadmin/checkout-domain';
import { Button, Card, CardContent, Rating, Typography } from '@mui/material';
import { Trans } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getEffectImage128, getItemImage128 } from '../../image';
import { getItemName, getItemPriceEur, SearchResultItem } from '../../item';
import styles from './search-result.module.scss';

/* eslint-disable-next-line */
export interface SearchResultProps {
  item: SearchResultItem;
}

export function SearchResult(props: SearchResultProps) {
  const router = useRouter();
  const locale = router.locale as Language;

  const item = props.item;
  const itemName = getItemName(item, locale as Language);

  return (
    <Card
      className={styles['search-result'] as string}
      sx={{ bgcolor: 'menu.main', boxShadow: 4 }}
    >
      <Link
        className={styles['result-link']}
        href={{ pathname: `/items/${item._id}`, query: {} }}
      >
        <Button className={styles['result-button'] as string} color="secondary">
          <CardContent className={styles['card-content'] as string}>
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
              <div>
                <Typography
                  variant="h6"
                  color="text.primary"
                  sx={{ fontSize: '1.125rem', fontWeight: '400' }}
                >
                  {itemName}
                </Typography>
              </div>
              <div className={styles['price-container']}>
                <span>
                  <Typography
                    id="search-result-is-in-stock"
                    variant="subtitle2"
                    variantMapping={{ subtitle2: 'span' }}
                    color={item.isInStock ? 'primary.light' : 'text.secondary'}
                  >
                    <Trans>{item.isInStock ? 'inStock' : 'notInStock'}</Trans>
                  </Typography>
                </span>
                <span className={styles['price']}>
                  <Typography
                    variant="subtitle1"
                    variantMapping={{ subtitle1: 'span' }}
                    color="text.primary"
                  >
                    {getItemPriceEur(item, locale)}
                  </Typography>
                </span>
              </div>
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
          </CardContent>
        </Button>
      </Link>
    </Card>
  );
}

export default SearchResult;
