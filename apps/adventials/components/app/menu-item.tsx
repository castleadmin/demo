import { Category, SortOption } from '@castleadmin/product-domain';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { UrlObject } from 'url';
import styles from './menu-item.module.scss';

/* eslint-disable-next-line */
export interface MenuItemProps {
  name: Category | 'home';
  imagePath: string;
}

export function MenuItem(props: MenuItemProps) {
  const { t } = useTranslation();
  const { pathname, query } = useRouter();

  const getHref = (): UrlObject => {
    if (props.name === 'home') {
      return { pathname: '/', query: {} };
    }

    // If not on the items page
    if (pathname !== '/items') {
      // Navigate to the items page
      return {
        pathname: '/items',
        query: {
          category: props.name,
          sort: SortOption.popularity,
          page: '1',
        },
      };
    }

    // If on the items page
    return {
      pathname: '/items',
      query: {
        ...query, // Preserve the existing query
        category: props.name, // Update the category parameter
        page: '1', // Navigate to the first page, since the result set has changed
      },
    };
  };

  const href = getHref();

  return (
    <Link className={styles['link']} href={href}>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <Image
              src={props.imagePath}
              width={48}
              height={48}
              alt={t(props.name)}
            />
          </ListItemIcon>
          <ListItemText primary={t(props.name)} />
        </ListItemButton>
      </ListItem>
    </Link>
  );
}

export default MenuItem;
