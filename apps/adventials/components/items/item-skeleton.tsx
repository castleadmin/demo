import { Skeleton } from '@mui/material';
import styles from './item-skeleton.module.scss';

/* eslint-disable-next-line */
export interface ItemSkeletonProps {}

export function ItemSkeleton(_props: ItemSkeletonProps) {
  return (
    <div className={styles['item-skeleton-page']}>
      <div className={styles['item']}>
        <div className={styles['title']}>
          <Skeleton
            variant="text"
            width={320 - 2 * 16}
            sx={{ fontSize: '2.125rem', lineHeight: '1.235' }}
          />
        </div>
        <div className={styles['content-container']}>
          <div className={styles['image-card']}>
            <div className={styles['image-container']}>
              <Skeleton variant="rectangular" width={256} height={256} />
            </div>
          </div>
          <Skeleton
            className={styles['add-to-cart-card'] as string}
            variant="rounded"
            height={234}
          />
          <Skeleton
            className={styles['details-card'] as string}
            variant="rounded"
            height={369}
          />
        </div>
      </div>
    </div>
  );
}

export default ItemSkeleton;
