import {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
} from '@apollo/client';
import { Language } from '@castleadmin/checkout-domain';
import '@castleadmin/frontend-utils';
import {
  Category,
  EffectPower,
  Quality,
  SortOption,
} from '@castleadmin/product-domain';
import { NextApiRequest } from 'next';
import getAutocompleteItemsHandler from '../../pages/api/get-autocomplete-items';
import { createApiResponseMock, mockApolloClient } from '../mocks';

jest.mock('@castleadmin/frontend-utils', () => {
  const originalModule = jest.requireActual('@castleadmin/frontend-utils');

  return {
    __esModule: true,
    ...originalModule,
    createApolloClient: jest.fn(),
  };
});

describe('get-autocomplete-items', () => {
  describe('getAutocompleteItemsHandler', () => {
    let query: jest.MockedFunction<
      ApolloClient<NormalizedCacheObject>['query']
    >;

    beforeEach(() => {
      const { query: apolloQuery } = mockApolloClient();
      apolloQuery.mockImplementation(
        () =>
          Promise.resolve({
            data: {
              searchItems: [
                {
                  translations: { enUs: { name: 'item1' } },
                },
                {
                  translations: { enUs: { name: 'item2' } },
                },
                {
                  translations: { enUs: { name: 'item3' } },
                },
              ],
            },
          }) as Promise<
            ApolloQueryResult<{
              searchItems: { translations: { enUs: { name: string } } }[];
            }>
          >
      );
      query = apolloQuery;
    });

    it('Should execute successfully', async () => {
      const response = createApiResponseMock();

      await getAutocompleteItemsHandler(
        {
          method: 'GET',
          query: {
            locale: Language.enUs,
            query: 'fire shield',
          },
        } as unknown as NextApiRequest,
        response
      );

      expect(query).toHaveBeenCalledTimes(1);
      expect(query).toHaveBeenCalledWith({
        variables: {
          searchText: 'fire shield',
          locale: Language.enUs,
          skip: 0,
          limit: 32,
          searchItemsOptions: {
            sort: SortOption.bestResults,
          },
        },
        query: expect.anything(),
      });
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith(['item1', 'item2', 'item3']);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.end).toHaveBeenCalledTimes(1);
    });

    it('Should return an error if the query is missing the locale', async () => {
      const response = createApiResponseMock();

      await getAutocompleteItemsHandler(
        {
          method: 'GET',
          query: {
            query: 'fire shield',
          },
        } as unknown as NextApiRequest,
        response
      );

      expect(query).toHaveBeenCalledTimes(0);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.end).toHaveBeenCalledTimes(1);
    });

    it('Should return an error if the query is missing the search query', async () => {
      const response = createApiResponseMock();

      await getAutocompleteItemsHandler(
        {
          method: 'GET',
          query: {
            locale: Language.enUs,
          },
        } as unknown as NextApiRequest,
        response
      );

      expect(query).toHaveBeenCalledTimes(0);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.end).toHaveBeenCalledTimes(1);
    });

    it("Should return an error if the HTTP method isn't get", async () => {
      const response = createApiResponseMock();

      await getAutocompleteItemsHandler(
        {
          method: 'POST',
          query: {
            locale: Language.enUs,
            query: 'fire shield',
          },
        } as unknown as NextApiRequest,
        response
      );

      expect(query).toHaveBeenCalledTimes(0);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(405);
      expect(response.end).toHaveBeenCalledTimes(1);
    });

    it('Should return an empty array if the search query is empty', async () => {
      const response = createApiResponseMock();

      await getAutocompleteItemsHandler(
        {
          method: 'GET',
          query: {
            locale: Language.enUs,
            query: '',
          },
        } as unknown as NextApiRequest,
        response
      );

      expect(query).toHaveBeenCalledTimes(0);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith([]);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.end).toHaveBeenCalledTimes(1);
    });

    it('Should add the category to the backend request', async () => {
      const response = createApiResponseMock();

      await getAutocompleteItemsHandler(
        {
          method: 'GET',
          query: {
            locale: Language.enUs,
            query: 'fire shield',
            category: Category.swords,
          },
        } as unknown as NextApiRequest,
        response
      );

      expect(query).toHaveBeenCalledTimes(1);
      expect(query).toHaveBeenCalledWith({
        variables: {
          searchText: 'fire shield',
          locale: Language.enUs,
          skip: 0,
          limit: 32,
          searchItemsOptions: {
            category: Category.swords,
            sort: SortOption.bestResults,
          },
        },
        query: expect.anything(),
      });
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith(['item1', 'item2', 'item3']);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.end).toHaveBeenCalledTimes(1);
    });

    it('Should add a single quality filter to the backend request', async () => {
      const response = createApiResponseMock();

      await getAutocompleteItemsHandler(
        {
          method: 'GET',
          query: {
            locale: Language.enUs,
            query: 'fire shield',
            qualities: Quality.excellent,
          },
        } as unknown as NextApiRequest,
        response
      );

      expect(query).toHaveBeenCalledTimes(1);
      expect(query).toHaveBeenCalledWith({
        variables: {
          searchText: 'fire shield',
          locale: Language.enUs,
          skip: 0,
          limit: 32,
          searchItemsOptions: {
            qualities: [Quality.excellent],
            sort: SortOption.bestResults,
          },
        },
        query: expect.anything(),
      });
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith(['item1', 'item2', 'item3']);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.end).toHaveBeenCalledTimes(1);
    });

    it('Should add multiple quality filters to the backend request', async () => {
      const response = createApiResponseMock();

      await getAutocompleteItemsHandler(
        {
          method: 'GET',
          query: {
            locale: Language.enUs,
            query: 'fire shield',
            qualities: [Quality.normal, Quality.improved, Quality.excellent],
          },
        } as unknown as NextApiRequest,
        response
      );

      expect(query).toHaveBeenCalledTimes(1);
      expect(query).toHaveBeenCalledWith({
        variables: {
          searchText: 'fire shield',
          locale: Language.enUs,
          skip: 0,
          limit: 32,
          searchItemsOptions: {
            qualities: [Quality.normal, Quality.improved, Quality.excellent],
            sort: SortOption.bestResults,
          },
        },
        query: expect.anything(),
      });
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith(['item1', 'item2', 'item3']);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.end).toHaveBeenCalledTimes(1);
    });

    it('Should add a single effect power filter to the backend request', async () => {
      const response = createApiResponseMock();

      await getAutocompleteItemsHandler(
        {
          method: 'GET',
          query: {
            locale: Language.enUs,
            query: 'fire shield',
            powers: EffectPower.strong,
          },
        } as unknown as NextApiRequest,
        response
      );

      expect(query).toHaveBeenCalledTimes(1);
      expect(query).toHaveBeenCalledWith({
        variables: {
          searchText: 'fire shield',
          locale: Language.enUs,
          skip: 0,
          limit: 32,
          searchItemsOptions: {
            powers: [EffectPower.strong],
            sort: SortOption.bestResults,
          },
        },
        query: expect.anything(),
      });
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith(['item1', 'item2', 'item3']);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.end).toHaveBeenCalledTimes(1);
    });

    it('Should add multiple effect power filters to the backend request', async () => {
      const response = createApiResponseMock();

      await getAutocompleteItemsHandler(
        {
          method: 'GET',
          query: {
            locale: Language.enUs,
            query: 'fire shield',
            powers: [EffectPower.weak, EffectPower.strong],
          },
        } as unknown as NextApiRequest,
        response
      );

      expect(query).toHaveBeenCalledTimes(1);
      expect(query).toHaveBeenCalledWith({
        variables: {
          searchText: 'fire shield',
          locale: Language.enUs,
          skip: 0,
          limit: 32,
          searchItemsOptions: {
            powers: [EffectPower.weak, EffectPower.strong],
            sort: SortOption.bestResults,
          },
        },
        query: expect.anything(),
      });
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith(['item1', 'item2', 'item3']);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.end).toHaveBeenCalledTimes(1);
    });

    it('Should add all filters to the backend request', async () => {
      query.mockImplementation(
        () =>
          Promise.resolve({
            data: {
              searchItems: [
                {
                  translations: { de: { name: 'item1' } },
                },
                {
                  translations: { de: { name: 'item2' } },
                },
                {
                  translations: { de: { name: 'item3' } },
                },
              ],
            },
          }) as Promise<
            ApolloQueryResult<{
              searchItems: { translations: { de: { name: string } } }[];
            }>
          >
      );

      const response = createApiResponseMock();

      await getAutocompleteItemsHandler(
        {
          method: 'GET',
          query: {
            locale: Language.de,
            query: 'fire shield',
            category: Category.swords,
            qualities: [Quality.normal, Quality.improved, Quality.excellent],
            powers: [EffectPower.weak, EffectPower.strong],
          },
        } as unknown as NextApiRequest,
        response
      );

      expect(query).toHaveBeenCalledTimes(1);
      expect(query).toHaveBeenCalledWith({
        variables: {
          searchText: 'fire shield',
          locale: Language.de,
          skip: 0,
          limit: 32,
          searchItemsOptions: {
            category: Category.swords,
            qualities: [Quality.normal, Quality.improved, Quality.excellent],
            powers: [EffectPower.weak, EffectPower.strong],
            sort: SortOption.bestResults,
          },
        },
        query: expect.anything(),
      });
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith(['item1', 'item2', 'item3']);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.end).toHaveBeenCalledTimes(1);
    });
  });
});
