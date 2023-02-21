import { ApolloQueryResult } from '@apollo/client';
import { Category } from '@castleadmin/product-domain';
import { ThemeProvider } from '@mui/material';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import ItemsId, {
  getStaticPaths,
  getStaticProps,
} from '../../pages/items/[id]';
import { store } from '../../store';
import { theme } from '../../theme';
import { createMockItem, mockApolloClient, mockRouter } from '../mocks';

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

describe('ItemsId', () => {
  it('Should render successfully', async () => {
    mockRouter({
      locale: 'en-US',
      pathname: '/items/a123',
    });

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <ItemsId item={createMockItem()} />
        </Provider>
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  describe('getStaticPaths', () => {
    it('Should generate all paths for the given ids and locales', async () => {
      const { query } = mockApolloClient();
      query.mockImplementation((options) => {
        const category = (
          options as unknown as {
            variables: {
              getItemsOptions: { category: string };
            };
          }
        ).variables.getItemsOptions.category;

        return Promise.resolve({
          data: {
            getItems: [
              { _id: `${category}11` },
              { _id: `${category}12` },
              { _id: `${category}13` },
            ],
          },
        } as ApolloQueryResult<unknown>);
      });

      const result = await getStaticPaths({
        locales: ['en-US', 'de'],
      });

      expect(result).toEqual({
        paths: Object.values(Category).flatMap((category) => [
          { params: { id: `${category}11` }, locale: 'en-US' },
          { params: { id: `${category}11` }, locale: 'de' },
          { params: { id: `${category}12` }, locale: 'en-US' },
          { params: { id: `${category}12` }, locale: 'de' },
          { params: { id: `${category}13` }, locale: 'en-US' },
          { params: { id: `${category}13` }, locale: 'de' },
        ]),
        fallback: 'blocking',
      });
    });

    it('Should throw an error if the locales are undefined', async () => {
      const { query } = mockApolloClient();
      query.mockImplementation((options) => {
        const category = (
          options as unknown as {
            variables: {
              getItemsOptions: { category: string };
            };
          }
        ).variables.getItemsOptions.category;

        return Promise.resolve({
          data: {
            getItems: [
              { _id: `${category}11` },
              { _id: `${category}12` },
              { _id: `${category}13` },
            ],
          },
        } as ApolloQueryResult<unknown>);
      });

      await expect(() => getStaticPaths({})).rejects.toBeInstanceOf(Error);
    });
  });

  describe('getStaticProps', () => {
    it('Should create the props successfully', async () => {
      const { query } = mockApolloClient();
      query.mockImplementationOnce(() =>
        Promise.resolve({
          data: {
            getItem: createMockItem(),
          },
        } as ApolloQueryResult<unknown>)
      );

      const result = await getStaticProps({
        locale: 'en-US',
        params: { id: 'a11' },
      });

      expect(result).toEqual({
        props: {
          item: createMockItem(),
          _nextI18Next: expect.anything(),
        },
      });
    });

    it("Should throw an error if the locale isn't defined", async () => {
      const { query } = mockApolloClient();
      query.mockImplementationOnce(() =>
        Promise.resolve({
          data: {
            getItem: createMockItem(),
          },
        } as ApolloQueryResult<unknown>)
      );

      await expect(() =>
        getStaticProps({
          params: { id: 'a11' },
        })
      ).rejects.toBeInstanceOf(Error);
    });

    it("Should throw an error if the params aren't defined", async () => {
      const { query } = mockApolloClient();
      query.mockImplementationOnce(() =>
        Promise.resolve({
          data: {
            getItem: createMockItem(),
          },
        } as ApolloQueryResult<unknown>)
      );

      await expect(() =>
        getStaticProps({
          locale: 'en-US',
        })
      ).rejects.toBeInstanceOf(Error);
    });

    it("Should throw an error if the params id isn't defined", async () => {
      const { query } = mockApolloClient();
      query.mockImplementationOnce(() =>
        Promise.resolve({
          data: {
            getItem: createMockItem(),
          },
        } as ApolloQueryResult<unknown>)
      );

      await expect(() =>
        getStaticProps({
          locale: 'en-US',
          params: {},
        })
      ).rejects.toBeInstanceOf(Error);
    });
  });
});
