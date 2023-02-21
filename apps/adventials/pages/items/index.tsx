import { gql } from '@apollo/client';
import { Language } from '@castleadmin/checkout-domain';
import { createApolloClient } from '@castleadmin/frontend-utils';
import {
  Category,
  EffectPower,
  Quality,
  SortOption,
} from '@castleadmin/product-domain';
import { Typography } from '@mui/material';
import { withSentryGetServerSideProps } from '@sentry/nextjs';
import { GetServerSideProps } from 'next';
import { Trans } from 'next-i18next';
import { useRouter } from 'next/router';
import FilterMagicalPower from '../../components/items/filter-magical-power';
import FilterQuality from '../../components/items/filter-quality';
import ResultPagination from '../../components/items/result-pagination';
import SearchResult from '../../components/items/search-result';
import Sort from '../../components/items/sort';
import { environment } from '../../environments/environment';
import { getTranslations } from '../../get-translations';
import {
  itemsPerPage,
  localeToPropertyName,
  SearchResultItem,
} from '../../item';
import styles from './index.module.scss';

/* eslint-disable-next-line */
export interface SearchProps {
  itemsCount: number;
  items: SearchResultItem[];
  itemsPerPage: number;
}

export function Items(props: SearchProps) {
  const router = useRouter();
  const category = router.query['category']?.toString() ?? '';

  const paginationCount = Math.ceil(props.itemsCount / props.itemsPerPage);

  return (
    <div className={styles['items-page']}>
      <div className={styles['items-header']}>
        <div className={styles['options']}>
          <div className={styles['option']}>
            <FilterQuality />
          </div>
          <div className={styles['option']}>
            <FilterMagicalPower />
          </div>
          <div className={styles['option']}>
            <Sort />
          </div>
        </div>
        <div className={styles['items-title']}>
          <div className={styles['title']}>
            <Typography variant="h4" align="center">
              <Trans>{category ? category : 'allCategories'}</Trans>
            </Typography>
          </div>
          <div className={styles['items-count']}>
            <Typography variant="h6" align="center">
              <Trans count={props.itemsCount}>itemsFound</Trans>
            </Typography>
          </div>
        </div>
      </div>
      <div className={styles['search-results']}>
        {props.items.map((item) => (
          <div key={item._id} className={styles['search-result']}>
            <SearchResult item={item} />
          </div>
        ))}
      </div>
      <div className={styles['pagination']}>
        <ResultPagination count={paginationCount} />
      </div>
    </div>
  );
}

export const getServerSideProps = withSentryGetServerSideProps(
  (async (context) => {
    if (!context.locale) {
      throw new Error('Locale is undefined');
    }

    let page = Number.parseInt(context.query['page']?.toString() ?? '');
    if (!Number.isFinite(page)) {
      page = 1;
    }
    const limit = itemsPerPage;
    const skip = Math.max(0, (page - 1) * limit);

    const query = context.query['query']?.toString();
    const category = context.query['category']?.toString() as
      | Category
      | undefined;
    const sort = context.query['sort']?.toString() as SortOption | undefined;
    let qualities = context.query['qualities'] as Quality[] | undefined;
    if (qualities && !Array.isArray(qualities)) {
      qualities = [qualities];
    }
    let powers = context.query['powers'] as EffectPower[] | undefined;
    if (powers && !Array.isArray(powers)) {
      powers = [powers];
    }

    let result: SearchProps = {
      itemsCount: 0,
      items: [],
      itemsPerPage,
    };

    if (query) {
      result = {
        ...result,
        ...(await getItemsBySearchText({
          searchText: query,
          locale: context.locale as Language,
          skip,
          limit,
          category,
          sort,
          qualities,
          powers,
        })),
      };
    } else if (!query && category) {
      result = {
        ...result,
        ...(await getItemsByCategory({
          locale: context.locale as Language,
          skip,
          limit,
          category,
          sort,
          qualities,
          powers,
        })),
      };
    }

    return {
      props: {
        ...(await getTranslations(context.locale)),
        ...result,
      },
    };
  }) as GetServerSideProps<SearchProps>,
  '/items'
);

interface CountItemsOptions {
  category?: Category;
  qualities?: Quality[];
  powers?: EffectPower[];
}

interface GetItemsOptions {
  category?: Category;
  sort?: SortOption;
  qualities?: Quality[];
  powers?: EffectPower[];
}

async function getItemsBySearchText(options: {
  searchText: string;
  locale: Language;
  skip: number;
  limit: number;
  category: Category | undefined;
  sort: SortOption | undefined;
  qualities: Quality[] | undefined;
  powers: EffectPower[] | undefined;
}): Promise<Omit<SearchProps, 'itemsPerPage'>> {
  const { searchText, locale, skip, limit, category, sort, qualities, powers } =
    options;
  let itemsCount = 0;
  let items: SearchResultItem[] = [];

  const countSearchItemsOptions: CountItemsOptions = {};
  if (category) {
    countSearchItemsOptions.category = category;
  }
  if (qualities) {
    countSearchItemsOptions.qualities = qualities;
  }
  if (powers) {
    countSearchItemsOptions.powers = powers;
  }

  const searchItemsOptions: GetItemsOptions = {};
  if (category) {
    searchItemsOptions.category = category;
  }
  if (sort) {
    searchItemsOptions.sort = sort;
  }
  if (qualities) {
    searchItemsOptions.qualities = qualities;
  }
  if (powers) {
    searchItemsOptions.powers = powers;
  }

  const localePropertyName = localeToPropertyName(locale);

  const client = await createApolloClient(environment);
  const result = await client.query<
    {
      countSearchItems: number;
      searchItems: SearchResultItem[];
    },
    {
      searchText: string;
      locale: string;
      skip: number;
      limit: number;
      countSearchItemsOptions: CountItemsOptions;
      searchItemsOptions: GetItemsOptions;
    }
  >({
    variables: {
      searchText,
      locale,
      skip,
      limit,
      countSearchItemsOptions,
      searchItemsOptions,
    },
    query: gql`
          query getItemsBySearchTextQuery(
            $searchText: String!
            $locale: String!
            $skip: Int!
            $limit: Int!
            $countSearchItemsOptions: CountItemsOptions!
            $searchItemsOptions: GetItemsOptions!
          ) {
            countSearchItems(searchText: $searchText, locale: $locale, options: $countSearchItemsOptions)
            searchItems(searchText: $searchText, locale: $locale, skip: $skip, limit: $limit, options: $searchItemsOptions) {
              _id
              category
              type
              quality
              effect
              effectPower
              prices {
                EUR
              }
              isInStock
              halfStars
              ratingCount
              translations {
                ${localePropertyName} {
                  name
                }
              }
            }
          }
        `,
  });

  itemsCount = result.data.countSearchItems;
  items = result.data.searchItems;

  return {
    itemsCount,
    items,
  };
}

async function getItemsByCategory(options: {
  locale: Language;
  skip: number;
  limit: number;
  category: Category;
  sort: SortOption | undefined;
  qualities: Quality[] | undefined;
  powers: EffectPower[] | undefined;
}): Promise<Omit<SearchProps, 'itemsPerPage'>> {
  const { locale, skip, limit, category, sort, qualities, powers } = options;
  let itemsCount = 0;
  let items: SearchResultItem[] = [];

  const countItemsOptions: CountItemsOptions = {};
  countItemsOptions.category = category;
  if (qualities) {
    countItemsOptions.qualities = qualities;
  }
  if (powers) {
    countItemsOptions.powers = powers;
  }

  const getItemsOptions: GetItemsOptions = {};
  getItemsOptions.category = category;
  if (sort) {
    getItemsOptions.sort = sort;
  }
  if (qualities) {
    getItemsOptions.qualities = qualities;
  }
  if (powers) {
    getItemsOptions.powers = powers;
  }

  const localePropertyName = localeToPropertyName(locale);

  const client = await createApolloClient(environment);
  const result = await client.query<
    {
      countItems: number;
      getItems: SearchResultItem[];
    },
    {
      skip: number;
      limit: number;
      countItemsOptions: CountItemsOptions;
      getItemsOptions: GetItemsOptions;
    }
  >({
    variables: {
      skip,
      limit,
      countItemsOptions,
      getItemsOptions,
    },
    query: gql`
          query getItemsByCategoryQuery(
            $skip: Int!
            $limit: Int!
            $countItemsOptions: CountItemsOptions!
            $getItemsOptions: GetItemsOptions!
          ) {
            countItems(options: $countItemsOptions)
            getItems(skip: $skip, limit: $limit, options: $getItemsOptions) {
              _id
              category
              type
              quality
              effect
              effectPower
              prices {
                EUR
              }
              isInStock
              halfStars
              ratingCount
              translations {
                ${localePropertyName} {
                  name
                }
              }
            }
          }
        `,
  });

  itemsCount = result.data.countItems;
  items = result.data.getItems;

  return {
    itemsCount,
    items,
  };
}

export default Items;
