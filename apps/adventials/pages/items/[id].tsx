import { gql } from '@apollo/client';
import { createApolloClient } from '@castleadmin/frontend-utils';
import {
  Category,
  EffectPower,
  Item,
  Quality,
  SortOption,
} from '@castleadmin/product-domain';
import { withSentryGetStaticProps } from '@sentry/nextjs';
import { GetStaticPaths, GetStaticProps } from 'next';
import ItemComponent from '../../components/items/item';
import { environment } from '../../environments/environment';
import { getTranslations } from '../../get-translations';
import { itemsPerPage } from '../../item';
import styles from './[id].module.scss';

/* eslint-disable-next-line */
export interface IdProps {
  item: Item;
}

export function ItemsId(props: IdProps) {
  return (
    <div className={styles['item-page']}>
      <ItemComponent item={props.item} />
    </div>
  );
}

interface GetItemsOptions {
  category?: Category;
  sort?: SortOption;
  qualities?: Quality[];
  powers?: EffectPower[];
}

export const getStaticPaths: GetStaticPaths<{ id: string }> = async (
  context
) => {
  if (!context.locales) {
    throw new Error('Locales are undefined');
  }

  const locales = context.locales;

  const client = await createApolloClient(environment);

  // Get the items of the first page of each category sorted by popularity.
  // Getting all items isn't possible, because of the vercel 5000 uploads per day limit.
  const result = await Promise.all(
    Object.values(Category).map((category: Category) =>
      client.query<
        {
          getItems: [
            {
              _id: string;
            }
          ];
        },
        {
          skip: number;
          limit: number;
          getItemsOptions: GetItemsOptions;
        }
      >({
        variables: {
          skip: 0,
          limit: itemsPerPage,
          getItemsOptions: {
            category,
            sort: SortOption.popularity,
          },
        },
        query: gql`
          query getItemIds(
            $skip: Int!
            $limit: Int!
            $getItemsOptions: GetItemsOptions!
          ) {
            getItems(skip: $skip, limit: $limit, options: $getItemsOptions) {
              _id
            }
          }
        `,
      })
    )
  );

  const paths: { params: { id: string }; locale: string }[] = result.flatMap(
    (categoryResult) =>
      categoryResult.data.getItems.flatMap((item) =>
        locales.map((locale) => ({ params: { id: item._id }, locale }))
      )
  );

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps = withSentryGetStaticProps(
  (async (context) => {
    if (!context.locale) {
      throw new Error('Locale is undefined');
    }

    if (!context.params) {
      throw new Error('Params are undefined');
    }

    const id = context.params.id;

    if (!id) {
      throw new Error(`Invalid id ${id}`);
    }

    const client = await createApolloClient(environment);

    const result = await client.query<
      {
        getItem: Item;
      },
      {
        id: string;
      }
    >({
      variables: {
        id,
      },
      query: gql`
        query getItem($id: ID!) {
          getItem(id: $id) {
            _id
            ean
            category
            type
            quality
            effect
            effectPower
            prices {
              EUR
            }
            isInStock
            popularity
            halfStars
            ratingCount
            translations {
              de {
                name
                description
                effectName
              }
              enUs {
                name
                description
                effectName
              }
            }
          }
        }
      `,
    });

    return {
      props: {
        ...(await getTranslations(context.locale)),
        item: result.data.getItem,
      },
    };
  }) as GetStaticProps<IdProps, { id: string }> as unknown as GetStaticProps<
    {
      [key: string]: unknown;
    },
    { id: string }
  >,
  '/items/[id]'
);

export default ItemsId;
