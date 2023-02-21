import { gql } from '@apollo/client';
import { Language } from '@castleadmin/checkout-domain';
import { createApolloClient } from '@castleadmin/frontend-utils';
import {
  Category,
  EffectPower,
  Quality,
  SortOption,
} from '@castleadmin/product-domain';
import { withSentry } from '@sentry/nextjs';
import { NextApiHandler } from 'next';
import { environment } from '../../environments/environment';
import { itemsPerPage, localeToPropertyName } from '../../item';

export const getAutocompleteItemsHandler = withSentry(
  async function (req, res) {
    if (req.method !== 'GET') {
      return res.status(405).end();
    }

    if (
      !req.query['locale'] ||
      req.query['query'] === null ||
      req.query['query'] === undefined
    ) {
      return res.status(400).end();
    }

    const locale = req.query['locale']?.toString();
    const query = req.query['query']?.toString();
    const category = req.query['category']?.toString() as Category | undefined;
    let qualities = req.query['qualities'] as Quality[] | undefined;
    if (qualities && !Array.isArray(qualities)) {
      qualities = [qualities];
    }
    let powers = req.query['powers'] as EffectPower[] | undefined;
    if (powers && !Array.isArray(powers)) {
      powers = [powers];
    }

    if (query === '') {
      res.json([]);

      return res.status(200).end();
    }

    const result = await getAutocompleteItems({
      searchText: query,
      locale: locale as Language,
      category,
      qualities,
      powers,
    });

    res.json(result);

    return res.status(200).end();
  } as NextApiHandler<string[] | void>,
  '/api/get-autocomplete-items'
);

interface SearchItemsOptions {
  category?: Category;
  sort?: SortOption;
  qualities?: Quality[];
  powers?: EffectPower[];
}

async function getAutocompleteItems(options: {
  searchText: string;
  locale: Language;
  category: Category | undefined;
  qualities: Quality[] | undefined;
  powers: EffectPower[] | undefined;
}): Promise<string[]> {
  const { searchText, locale, category, qualities, powers } = options;
  const skip = 0;
  const limit = itemsPerPage;

  let items: {
    translations: { de: { name: string } } | { enUs: { name: string } };
  }[] = [];

  const searchItemsOptions: SearchItemsOptions = {};
  if (category) {
    searchItemsOptions.category = category;
  }
  searchItemsOptions.sort = SortOption.bestResults;
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
      searchItems: {
        translations: { de: { name: string } } | { enUs: { name: string } };
      }[];
    },
    {
      searchText: string;
      locale: string;
      skip: number;
      limit: number;
      searchItemsOptions: SearchItemsOptions;
    }
  >({
    variables: {
      searchText,
      locale,
      skip,
      limit,
      searchItemsOptions,
    },
    query: gql`
          query getAutocompleteItemsQuery(
            $searchText: String!
            $locale: String!
            $skip: Int!
            $limit: Int!
            $searchItemsOptions: GetItemsOptions!
          ) {
            searchItems(searchText: $searchText, locale: $locale, skip: $skip, limit: $limit, options: $searchItemsOptions) {
              translations {
                ${localePropertyName} {
                  name
                }
              }
            }
          }
        `,
  });

  items = result.data.searchItems;

  const itemNames: string[] = items.map(
    (item) => item.translations[localePropertyName].name
  );

  return itemNames;
}

export default getAutocompleteItemsHandler;
