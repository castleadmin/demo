import { Skeleton } from '@mui/material';
import styles from './items-skeleton.module.scss';

/* eslint-disable-next-line */
export interface ItemsSkeletonProps {}

export function ItemsSkeleton(_props: ItemsSkeletonProps) {
  return (
    <div className={styles['items-skeleton-page']}>
      <div className={styles['items-header']}>
        <div className={styles['options']}>
          <div className={styles['option']}>
            <Skeleton variant="rounded" width={288} height={56} />
          </div>
          <div className={styles['option']}>
            <Skeleton variant="rounded" width={288} height={56} />
          </div>
          <div className={styles['option']}>
            <Skeleton variant="rounded" width={288} height={56} />
          </div>
        </div>
        <div className={styles['items-title']}>
          <div className={styles['title']}>
            <Skeleton
              variant="text"
              width={164}
              sx={{ fontSize: '2.125rem', lineHeight: '1.235' }}
            />
          </div>
          <div className={styles['items-count']}>
            <Skeleton
              variant="text"
              width={190}
              sx={{ fontSize: '1.25rem', lineHeight: '1.6' }}
            />
          </div>
        </div>
      </div>
      <div className={styles['search-results']}>
        <div className={styles['search-result']}>
          <Skeleton variant="rounded" width={280} height={302} />
        </div>
        <div className={styles['search-result']}>
          <Skeleton variant="rounded" width={280} height={302} />
        </div>
        <div className={styles['search-result']}>
          <Skeleton variant="rounded" width={280} height={302} />
        </div>
        <div className={styles['search-result']}>
          <Skeleton variant="rounded" width={280} height={302} />
        </div>
      </div>
    </div>
  );
}

export default ItemsSkeleton;
