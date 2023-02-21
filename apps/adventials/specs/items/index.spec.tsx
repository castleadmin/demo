import { ApolloQueryResult } from '@apollo/client';
import { Language } from '@castleadmin/checkout-domain';
import {
  Category,
  EffectPower,
  Quality,
  SortOption,
} from '@castleadmin/product-domain';
import { ThemeProvider } from '@mui/material';
import { render } from '@testing-library/react';
import { GetServerSidePropsContext } from 'next';
import 'next-i18next';
import Items, { getServerSideProps } from '../../pages/items/index';
import { theme } from '../../theme';
import {
  createMockSearchResultItem,
  mockApolloClient,
  mockRouter,
} from '../mocks';

jest.mock('next-i18next', () => ({
  Trans: (props) => <span>{props.children}</span>,
  useTranslation: () => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => undefined),
      },
    };
  },
}));

jest.mock('@castleadmin/frontend-utils', () => {
  const originalModule = jest.requireActual('@castleadmin/frontend-utils');

  return {
    __esModule: true,
    ...originalModule,
    createApolloClient: jest.fn(),
  };
});

describe('Items', () => {
  it('Should render successfully without a parameter', async () => {
    mockRouter({
      query: {},
    });

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Items
          items={[createMockSearchResultItem()]}
          itemsCount={1}
          itemsPerPage={32}
        />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('Should render successfully with a query parameter', async () => {
    mockRouter({
      query: {
        query: 'test',
      },
    });

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Items
          items={[createMockSearchResultItem()]}
          itemsCount={1}
          itemsPerPage={32}
        />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('Should render successfully with a category parameter', async () => {
    mockRouter({
      query: {
        category: Category.axes,
      },
    });

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Items
          items={[createMockSearchResultItem()]}
          itemsCount={1}
          itemsPerPage={32}
        />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  describe('getServerSideProps', () => {
    it('Should execute getServerSideProps successfully with a no parameter', async () => {
      const result = await getServerSideProps({
        locale: 'en-US',
        query: {},
      } as unknown as GetServerSidePropsContext);

      expect(result['props'].itemsCount).toBe(0);
      expect(result['props'].items).toEqual([]);
    });

    describe('with query parameter', () => {
      it('Should execute getServerSideProps successfully with a query parameter', async () => {
        const { query: queryMock } = mockApolloClient();
        queryMock.mockImplementationOnce(() =>
          Promise.resolve({
            data: {
              countSearchItems: 1,
              searchItems: [createMockSearchResultItem()],
            },
          } as ApolloQueryResult<unknown>)
        );

        const result = await getServerSideProps({
          locale: 'en-US',
          query: { query: 'ice' },
        } as unknown as GetServerSidePropsContext);

        expect(queryMock).toHaveBeenCalledTimes(1);
        expect(queryMock).toHaveBeenCalledWith({
          variables: {
            searchText: 'ice',
            locale: Language.enUs,
            skip: 0,
            limit: 32,
            countSearchItemsOptions: {},
            searchItemsOptions: {},
          },
          query: expect.anything(),
        });
        expect(result['props'].itemsCount).toBe(1);
        expect(result['props'].items).toEqual([createMockSearchResultItem()]);
      });

      it('Should execute getServerSideProps successfully with a query and an invalid page parameter', async () => {
        const { query: queryMock } = mockApolloClient();
        queryMock.mockImplementationOnce(() =>
          Promise.resolve({
            data: {
              countSearchItems: 1,
              searchItems: [createMockSearchResultItem()],
            },
          } as ApolloQueryResult<unknown>)
        );

        const result = await getServerSideProps({
          locale: 'en-US',
          query: { query: 'ice', page: 'a123' },
        } as unknown as GetServerSidePropsContext);

        expect(queryMock).toHaveBeenCalledTimes(1);
        expect(queryMock).toHaveBeenCalledWith({
          variables: {
            searchText: 'ice',
            locale: Language.enUs,
            skip: 0,
            limit: 32,
            countSearchItemsOptions: {},
            searchItemsOptions: {},
          },
          query: expect.anything(),
        });
        expect(result['props'].itemsCount).toBe(1);
        expect(result['props'].items).toEqual([createMockSearchResultItem()]);
      });

      it('Should execute getServerSideProps successfully with a query and a valid page parameter', async () => {
        const { query: queryMock } = mockApolloClient();
        queryMock.mockImplementationOnce(() =>
          Promise.resolve({
            data: {
              countSearchItems: 1,
              searchItems: [createMockSearchResultItem()],
            },
          } as ApolloQueryResult<unknown>)
        );

        const result = await getServerSideProps({
          locale: 'en-US',
          query: { query: 'ice', page: '3' },
        } as unknown as GetServerSidePropsContext);

        expect(queryMock).toHaveBeenCalledTimes(1);
        expect(queryMock).toHaveBeenCalledWith({
          variables: {
            searchText: 'ice',
            locale: Language.enUs,
            skip: 64,
            limit: 32,
            countSearchItemsOptions: {},
            searchItemsOptions: {},
          },
          query: expect.anything(),
        });
        expect(result['props'].itemsCount).toBe(1);
        expect(result['props'].items).toEqual([createMockSearchResultItem()]);
      });

      it('Should execute getServerSideProps successfully with a query and a sort parameter', async () => {
        const { query: queryMock } = mockApolloClient();
        queryMock.mockImplementationOnce(() =>
          Promise.resolve({
            data: {
              countSearchItems: 1,
              searchItems: [createMockSearchResultItem()],
            },
          } as ApolloQueryResult<unknown>)
        );

        const result = await getServerSideProps({
          locale: 'en-US',
          query: { query: 'ice', sort: SortOption.priceAscending },
        } as unknown as GetServerSidePropsContext);

        expect(queryMock).toHaveBeenCalledTimes(1);
        expect(queryMock).toHaveBeenCalledWith({
          variables: {
            searchText: 'ice',
            locale: Language.enUs,
            skip: 0,
            limit: 32,
            countSearchItemsOptions: {},
            searchItemsOptions: {
              sort: SortOption.priceAscending,
            },
          },
          query: expect.anything(),
        });
        expect(result['props'].itemsCount).toBe(1);
        expect(result['props'].items).toEqual([createMockSearchResultItem()]);
      });

      it('Should execute getServerSideProps successfully with a query and a category parameter', async () => {
        const { query: queryMock } = mockApolloClient();
        queryMock.mockImplementationOnce(() =>
          Promise.resolve({
            data: {
              countSearchItems: 1,
              searchItems: [createMockSearchResultItem()],
            },
          } as ApolloQueryResult<unknown>)
        );

        const result = await getServerSideProps({
          locale: 'de',
          query: { query: 'ice', category: Category.scrolls },
        } as unknown as GetServerSidePropsContext);

        expect(queryMock).toHaveBeenCalledTimes(1);
        expect(queryMock).toHaveBeenCalledWith({
          variables: {
            searchText: 'ice',
            locale: Language.de,
            skip: 0,
            limit: 32,
            countSearchItemsOptions: {
              category: Category.scrolls,
            },
            searchItemsOptions: {
              category: Category.scrolls,
            },
          },
          query: expect.anything(),
        });
        expect(result['props'].itemsCount).toBe(1);
        expect(result['props'].items).toEqual([createMockSearchResultItem()]);
      });

      it('Should execute getServerSideProps successfully with a query and a single qualities parameter', async () => {
        const { query: queryMock } = mockApolloClient();
        queryMock.mockImplementationOnce(() =>
          Promise.resolve({
            data: {
              countSearchItems: 1,
              searchItems: [createMockSearchResultItem()],
            },
          } as ApolloQueryResult<unknown>)
        );

        const result = await getServerSideProps({
          locale: 'en-US',
          query: { query: 'ice', qualities: Quality.improved },
        } as unknown as GetServerSidePropsContext);

        expect(queryMock).toHaveBeenCalledTimes(1);
        expect(queryMock).toHaveBeenCalledWith({
          variables: {
            searchText: 'ice',
            locale: Language.enUs,
            skip: 0,
            limit: 32,
            countSearchItemsOptions: {
              qualities: [Quality.improved],
            },
            searchItemsOptions: {
              qualities: [Quality.improved],
            },
          },
          query: expect.anything(),
        });
        expect(result['props'].itemsCount).toBe(1);
        expect(result['props'].items).toEqual([createMockSearchResultItem()]);
      });

      it('Should execute getServerSideProps successfully with a query and multiple qualities parameter', async () => {
        const { query: queryMock } = mockApolloClient();
        queryMock.mockImplementationOnce(() =>
          Promise.resolve({
            data: {
              countSearchItems: 1,
              searchItems: [createMockSearchResultItem()],
            },
          } as ApolloQueryResult<unknown>)
        );

        const result = await getServerSideProps({
          locale: 'en-US',
          query: {
            query: 'ice',
            qualities: [Quality.improved, Quality.excellent],
          },
        } as unknown as GetServerSidePropsContext);

        expect(queryMock).toHaveBeenCalledTimes(1);
        expect(queryMock).toHaveBeenCalledWith({
          variables: {
            searchText: 'ice',
            locale: Language.enUs,
            skip: 0,
            limit: 32,
            countSearchItemsOptions: {
              qualities: [Quality.improved, Quality.excellent],
            },
            searchItemsOptions: {
              qualities: [Quality.improved, Quality.excellent],
            },
          },
          query: expect.anything(),
        });
        expect(result['props'].itemsCount).toBe(1);
        expect(result['props'].items).toEqual([createMockSearchResultItem()]);
      });

      it('Should execute getServerSideProps successfully with a query and a single powers parameter', async () => {
        const { query: queryMock } = mockApolloClient();
        queryMock.mockImplementationOnce(() =>
          Promise.resolve({
            data: {
              countSearchItems: 1,
              searchItems: [createMockSearchResultItem()],
            },
          } as ApolloQueryResult<unknown>)
        );

        const result = await getServerSideProps({
          locale: 'en-US',
          query: { query: 'ice', powers: EffectPower.average },
        } as unknown as GetServerSidePropsContext);

        expect(queryMock).toHaveBeenCalledTimes(1);
        expect(queryMock).toHaveBeenCalledWith({
          variables: {
            searchText: 'ice',
            locale: Language.enUs,
            skip: 0,
            limit: 32,
            countSearchItemsOptions: {
              powers: [EffectPower.average],
            },
            searchItemsOptions: {
              powers: [EffectPower.average],
            },
          },
          query: expect.anything(),
        });
        expect(result['props'].itemsCount).toBe(1);
        expect(result['props'].items).toEqual([createMockSearchResultItem()]);
      });

      it('Should execute getServerSideProps successfully with a query and multiple powers parameter', async () => {
        const { query: queryMock } = mockApolloClient();
        queryMock.mockImplementationOnce(() =>
          Promise.resolve({
            data: {
              countSearchItems: 1,
              searchItems: [createMockSearchResultItem()],
            },
          } as ApolloQueryResult<unknown>)
        );

        const result = await getServerSideProps({
          locale: 'en-US',
          query: {
            query: 'ice',
            powers: [EffectPower.average, EffectPower.weak],
          },
        } as unknown as GetServerSidePropsContext);

        expect(queryMock).toHaveBeenCalledTimes(1);
        expect(queryMock).toHaveBeenCalledWith({
          variables: {
            searchText: 'ice',
            locale: Language.enUs,
            skip: 0,
            limit: 32,
            countSearchItemsOptions: {
              powers: [EffectPower.average, EffectPower.weak],
            },
            searchItemsOptions: {
              powers: [EffectPower.average, EffectPower.weak],
            },
          },
          query: expect.anything(),
        });
        expect(result['props'].itemsCount).toBe(1);
        expect(result['props'].items).toEqual([createMockSearchResultItem()]);
      });

      it('Should execute getServerSideProps successfully with a query parameter and all other parameters', async () => {
        const { query: queryMock } = mockApolloClient();
        queryMock.mockImplementationOnce(() =>
          Promise.resolve({
            data: {
              countSearchItems: 1,
              searchItems: [createMockSearchResultItem()],
            },
          } as ApolloQueryResult<unknown>)
        );

        const result = await getServerSideProps({
          locale: 'en-US',
          query: {
            query: 'ice',
            sort: SortOption.priceDescending,
            category: Category.swords,
            qualities: [Quality.improved, Quality.excellent],
            powers: [EffectPower.average, EffectPower.weak],
          },
        } as unknown as GetServerSidePropsContext);

        expect(queryMock).toHaveBeenCalledTimes(1);
        expect(queryMock).toHaveBeenCalledWith({
          variables: {
            searchText: 'ice',
            locale: Language.enUs,
            skip: 0,
            limit: 32,
            countSearchItemsOptions: {
              category: Category.swords,
              qualities: [Quality.improved, Quality.excellent],
              powers: [EffectPower.average, EffectPower.weak],
            },
            searchItemsOptions: {
              sort: SortOption.priceDescending,
              category: Category.swords,
              qualities: [Quality.improved, Quality.excellent],
              powers: [EffectPower.average, EffectPower.weak],
            },
          },
          query: expect.anything(),
        });
        expect(result['props'].itemsCount).toBe(1);
        expect(result['props'].items).toEqual([createMockSearchResultItem()]);
      });
    });

    describe('with category and without query parameter', () => {
      it('Should execute getServerSideProps successfully with a category parameter', async () => {
        const { query: queryMock } = mockApolloClient();
        queryMock.mockImplementationOnce(() =>
          Promise.resolve({
            data: {
              countItems: 1,
              getItems: [createMockSearchResultItem()],
            },
          } as ApolloQueryResult<unknown>)
        );

        const result = await getServerSideProps({
          locale: 'en-US',
          query: { category: Category.axes },
        } as unknown as GetServerSidePropsContext);

        expect(queryMock).toHaveBeenCalledTimes(1);
        expect(queryMock).toHaveBeenCalledWith({
          variables: {
            skip: 0,
            limit: 32,
            countItemsOptions: {
              category: Category.axes,
            },
            getItemsOptions: {
              category: Category.axes,
            },
          },
          query: expect.anything(),
        });
        expect(result['props'].itemsCount).toBe(1);
        expect(result['props'].items).toEqual([createMockSearchResultItem()]);
      });

      it('Should execute getServerSideProps successfully with a category and an invalid page parameter', async () => {
        const { query: queryMock } = mockApolloClient();
        queryMock.mockImplementationOnce(() =>
          Promise.resolve({
            data: {
              countItems: 1,
              getItems: [createMockSearchResultItem()],
            },
          } as ApolloQueryResult<unknown>)
        );

        const result = await getServerSideProps({
          locale: 'en-US',
          query: { category: Category.axes, page: 'a123' },
        } as unknown as GetServerSidePropsContext);

        expect(queryMock).toHaveBeenCalledTimes(1);
        expect(queryMock).toHaveBeenCalledWith({
          variables: {
            skip: 0,
            limit: 32,
            countItemsOptions: {
              category: Category.axes,
            },
            getItemsOptions: {
              category: Category.axes,
            },
          },
          query: expect.anything(),
        });
        expect(result['props'].itemsCount).toBe(1);
        expect(result['props'].items).toEqual([createMockSearchResultItem()]);
      });

      it('Should execute getServerSideProps successfully with a category and a valid page parameter', async () => {
        const { query: queryMock } = mockApolloClient();
        queryMock.mockImplementationOnce(() =>
          Promise.resolve({
            data: {
              countItems: 1,
              getItems: [createMockSearchResultItem()],
            },
          } as ApolloQueryResult<unknown>)
        );

        const result = await getServerSideProps({
          locale: 'en-US',
          query: { category: Category.axes, page: '3' },
        } as unknown as GetServerSidePropsContext);

        expect(queryMock).toHaveBeenCalledTimes(1);
        expect(queryMock).toHaveBeenCalledWith({
          variables: {
            skip: 64,
            limit: 32,
            countItemsOptions: {
              category: Category.axes,
            },
            getItemsOptions: {
              category: Category.axes,
            },
          },
          query: expect.anything(),
        });
        expect(result['props'].itemsCount).toBe(1);
        expect(result['props'].items).toEqual([createMockSearchResultItem()]);
      });

      it('Should execute getServerSideProps successfully with a category and a sort parameter', async () => {
        const { query: queryMock } = mockApolloClient();
        queryMock.mockImplementationOnce(() =>
          Promise.resolve({
            data: {
              countItems: 1,
              getItems: [createMockSearchResultItem()],
            },
          } as ApolloQueryResult<unknown>)
        );

        const result = await getServerSideProps({
          locale: 'en-US',
          query: { category: Category.axes, sort: SortOption.priceAscending },
        } as unknown as GetServerSidePropsContext);

        expect(queryMock).toHaveBeenCalledTimes(1);
        expect(queryMock).toHaveBeenCalledWith({
          variables: {
            skip: 0,
            limit: 32,
            countItemsOptions: {
              category: Category.axes,
            },
            getItemsOptions: {
              category: Category.axes,
              sort: SortOption.priceAscending,
            },
          },
          query: expect.anything(),
        });
        expect(result['props'].itemsCount).toBe(1);
        expect(result['props'].items).toEqual([createMockSearchResultItem()]);
      });

      it('Should execute getServerSideProps successfully with a category and a single qualities parameter', async () => {
        const { query: queryMock } = mockApolloClient();
        queryMock.mockImplementationOnce(() =>
          Promise.resolve({
            data: {
              countItems: 1,
              getItems: [createMockSearchResultItem()],
            },
          } as ApolloQueryResult<unknown>)
        );

        const result = await getServerSideProps({
          locale: 'en-US',
          query: { category: Category.axes, qualities: Quality.improved },
        } as unknown as GetServerSidePropsContext);

        expect(queryMock).toHaveBeenCalledTimes(1);
        expect(queryMock).toHaveBeenCalledWith({
          variables: {
            skip: 0,
            limit: 32,
            countItemsOptions: {
              category: Category.axes,
              qualities: [Quality.improved],
            },
            getItemsOptions: {
              category: Category.axes,
              qualities: [Quality.improved],
            },
          },
          query: expect.anything(),
        });
        expect(result['props'].itemsCount).toBe(1);
        expect(result['props'].items).toEqual([createMockSearchResultItem()]);
      });

      it('Should execute getServerSideProps successfully with a category and multiple qualities parameter', async () => {
        const { query: queryMock } = mockApolloClient();
        queryMock.mockImplementationOnce(() =>
          Promise.resolve({
            data: {
              countItems: 1,
              getItems: [createMockSearchResultItem()],
            },
          } as ApolloQueryResult<unknown>)
        );

        const result = await getServerSideProps({
          locale: 'en-US',
          query: {
            category: Category.axes,
            qualities: [Quality.improved, Quality.excellent],
          },
        } as unknown as GetServerSidePropsContext);

        expect(queryMock).toHaveBeenCalledTimes(1);
        expect(queryMock).toHaveBeenCalledWith({
          variables: {
            skip: 0,
            limit: 32,
            countItemsOptions: {
              category: Category.axes,
              qualities: [Quality.improved, Quality.excellent],
            },
            getItemsOptions: {
              category: Category.axes,
              qualities: [Quality.improved, Quality.excellent],
            },
          },
          query: expect.anything(),
        });
        expect(result['props'].itemsCount).toBe(1);
        expect(result['props'].items).toEqual([createMockSearchResultItem()]);
      });

      it('Should execute getServerSideProps successfully with a category and a single powers parameter', async () => {
        const { query: queryMock } = mockApolloClient();
        queryMock.mockImplementationOnce(() =>
          Promise.resolve({
            data: {
              countItems: 1,
              getItems: [createMockSearchResultItem()],
            },
          } as ApolloQueryResult<unknown>)
        );

        const result = await getServerSideProps({
          locale: 'en-US',
          query: { category: Category.axes, powers: EffectPower.average },
        } as unknown as GetServerSidePropsContext);

        expect(queryMock).toHaveBeenCalledTimes(1);
        expect(queryMock).toHaveBeenCalledWith({
          variables: {
            skip: 0,
            limit: 32,
            countItemsOptions: {
              category: Category.axes,
              powers: [EffectPower.average],
            },
            getItemsOptions: {
              category: Category.axes,
              powers: [EffectPower.average],
            },
          },
          query: expect.anything(),
        });
        expect(result['props'].itemsCount).toBe(1);
        expect(result['props'].items).toEqual([createMockSearchResultItem()]);
      });

      it('Should execute getServerSideProps successfully with a category and multiple powers parameter', async () => {
        const { query: queryMock } = mockApolloClient();
        queryMock.mockImplementationOnce(() =>
          Promise.resolve({
            data: {
              countItems: 1,
              getItems: [createMockSearchResultItem()],
            },
          } as ApolloQueryResult<unknown>)
        );

        const result = await getServerSideProps({
          locale: 'en-US',
          query: {
            category: Category.axes,
            powers: [EffectPower.average, EffectPower.weak],
          },
        } as unknown as GetServerSidePropsContext);

        expect(queryMock).toHaveBeenCalledTimes(1);
        expect(queryMock).toHaveBeenCalledWith({
          variables: {
            skip: 0,
            limit: 32,
            countItemsOptions: {
              category: Category.axes,
              powers: [EffectPower.average, EffectPower.weak],
            },
            getItemsOptions: {
              category: Category.axes,
              powers: [EffectPower.average, EffectPower.weak],
            },
          },
          query: expect.anything(),
        });
        expect(result['props'].itemsCount).toBe(1);
        expect(result['props'].items).toEqual([createMockSearchResultItem()]);
      });

      it('Should execute getServerSideProps successfully with a category parameter and all other parameters', async () => {
        const { query: queryMock } = mockApolloClient();
        queryMock.mockImplementationOnce(() =>
          Promise.resolve({
            data: {
              countItems: 1,
              getItems: [createMockSearchResultItem()],
            },
          } as ApolloQueryResult<unknown>)
        );

        const result = await getServerSideProps({
          locale: 'en-US',
          query: {
            category: Category.axes,
            sort: SortOption.priceDescending,
            qualities: [Quality.improved, Quality.excellent],
            powers: [EffectPower.average, EffectPower.weak],
          },
        } as unknown as GetServerSidePropsContext);

        expect(queryMock).toHaveBeenCalledTimes(1);
        expect(queryMock).toHaveBeenCalledWith({
          variables: {
            skip: 0,
            limit: 32,
            countItemsOptions: {
              category: Category.axes,
              qualities: [Quality.improved, Quality.excellent],
              powers: [EffectPower.average, EffectPower.weak],
            },
            getItemsOptions: {
              category: Category.axes,
              sort: SortOption.priceDescending,
              qualities: [Quality.improved, Quality.excellent],
              powers: [EffectPower.average, EffectPower.weak],
            },
          },
          query: expect.anything(),
        });
        expect(result['props'].itemsCount).toBe(1);
        expect(result['props'].items).toEqual([createMockSearchResultItem()]);
      });
    });

    it("Should throw an error if the locale isn't defined", async () => {
      await expect(
        getServerSideProps({
          query: { category: Category.axes },
        } as unknown as GetServerSidePropsContext)
      ).rejects.toBeInstanceOf(Error);
    });
  });
});
