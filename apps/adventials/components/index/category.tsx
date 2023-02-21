import {
  Category as CategoryEnum,
  SortOption,
} from '@castleadmin/product-domain';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { Trans, useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import styles from './category.module.scss';

export interface CategoryProps {
  category: CategoryEnum;
  imagePath: string;
}

export function Category(props: CategoryProps) {
  const { t } = useTranslation();

  return (
    <Card
      className={styles['card'] as string}
      sx={{ bgcolor: 'menu.main', boxShadow: 4 }}
    >
      <Link
        className={styles['link']}
        href={{
          pathname: '/items',
          query: {
            category: props.category,
            sort: SortOption.popularity,
            page: '1',
          },
        }}
      >
        <Button className={styles['card-button'] as string} color="secondary">
          <CardContent>
            <Image
              className={styles['image']}
              src={props.imagePath}
              width={128}
              height={128}
              alt={t(props.category)}
            />
            <Typography
              className={styles['category'] as string}
              variant="h5"
              align="center"
              color="text.primary"
            >
              <Trans>{props.category}</Trans>
            </Typography>
          </CardContent>
        </Button>
      </Link>
    </Card>
  );
}

export default Category;
