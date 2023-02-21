import { Language } from '@castleadmin/checkout-domain';
import {
  Category,
  EffectPower,
  Quality,
  SortOption,
} from '@castleadmin/product-domain';
import { act, fireEvent, render } from '@testing-library/react';
import 'next-i18next';
import { Simulate } from 'react-dom/test-utils';
import { mockRouter } from '../../specs/mocks';
import Search, { stateSearch } from './search';

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

describe('Search', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    const fetchSpy = jest.spyOn(window, 'fetch');
    fetchSpy.mockClear();
    fetchSpy.mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify(['item1']), {
          status: 200,
        })
      )
    );
  });

  afterEach(async () => {
    await act(() => jest.runOnlyPendingTimers());
    jest.useRealTimers();
  });

  it('Should render successfully', () => {
    mockRouter({
      pathname: '/',
      query: {},
    });

    const { baseElement } = render(<Search />);
    expect(baseElement).toBeTruthy();
    expect(stateSearch.query).toBe('');
    expect(stateSearch.searchFieldText).toBe('');
    expect(stateSearch.autocompleteSearchText).toBe('');
  });

  it('Should recognize query changes from other components', () => {
    mockRouter({
      pathname: '/items',
      query: { query: 'test', sort: SortOption.bestResults, page: '1' },
    });

    const result = render(<Search />);
    expect(result.baseElement).toBeTruthy();
    expect(stateSearch.query).toBe('test');
    expect(stateSearch.searchFieldText).toBe('test');
    expect(stateSearch.autocompleteSearchText).toBe('test');

    mockRouter({
      pathname: '/',
      query: {},
    });

    result.rerender(<Search />);
    expect(result.baseElement).toBeTruthy();
    expect(stateSearch.query).toBe('');
    expect(stateSearch.searchFieldText).toBe('');
    expect(stateSearch.autocompleteSearchText).toBe('');
  });

  it('Should update the state if a change event occurs', async () => {
    mockRouter({
      pathname: '/items',
      query: { query: 'test', sort: SortOption.bestResults, page: '1' },
    });

    const result = render(<Search />);
    expect(result.baseElement).toBeTruthy();
    expect(stateSearch.query).toBe('test');
    expect(stateSearch.searchFieldText).toBe('test');
    expect(stateSearch.autocompleteSearchText).toBe('test');

    const searchElement = result.baseElement.querySelector(
      '#search-autocomplete'
    ) as HTMLInputElement;
    searchElement.value = 'searchTest';

    act(() => {
      Simulate.change(searchElement);
    });

    expect(stateSearch.query).toBe('test');
    expect(stateSearch.searchFieldText).toBe('searchTest');
    expect(stateSearch.autocompleteSearchText).toBe('test');
  });

  describe('On home page', () => {
    it('Should navigate to the search page after entering a search query', () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/',
        query: {},
        push,
      });

      const { baseElement } = render(<Search />);
      expect(baseElement).toBeTruthy();
      expect(stateSearch.query).toBe('');
      expect(stateSearch.searchFieldText).toBe('');
      expect(stateSearch.autocompleteSearchText).toBe('');

      let searchElement = baseElement.querySelector(
        '#search-autocomplete'
      ) as HTMLInputElement;
      searchElement.value = 'searchTest';

      act(() => {
        Simulate.change(searchElement);
      });

      expect(stateSearch.query).toBe('');
      expect(stateSearch.searchFieldText).toBe('searchTest');
      expect(stateSearch.autocompleteSearchText).toBe('');

      searchElement = baseElement.querySelector(
        '#search-autocomplete'
      ) as HTMLInputElement;

      act(() => fireEvent.keyDown(searchElement, { key: 'Enter' }));

      expect(stateSearch.query).toBe('');
      expect(stateSearch.searchFieldText).toBe('searchTest');
      expect(stateSearch.autocompleteSearchText).toBe('searchTest');

      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith({
        pathname: '/items',
        query: { query: 'searchTest', sort: SortOption.bestResults, page: '1' },
      });
    });

    it('Should navigate to the search page after entering a search query and pressing the search button', () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/',
        query: {},
        push,
      });

      const { baseElement } = render(<Search />);
      expect(baseElement).toBeTruthy();
      expect(stateSearch.query).toBe('');
      expect(stateSearch.searchFieldText).toBe('');
      expect(stateSearch.autocompleteSearchText).toBe('');

      const searchElement = baseElement.querySelector(
        '#search-autocomplete'
      ) as HTMLInputElement;
      searchElement.value = 'searchTest';

      act(() => {
        Simulate.change(searchElement);
      });

      expect(stateSearch.query).toBe('');
      expect(stateSearch.searchFieldText).toBe('searchTest');
      expect(stateSearch.autocompleteSearchText).toBe('');

      const searchButtonElement = baseElement.querySelector(
        '#search-button'
      ) as HTMLInputElement;

      act(() => fireEvent.click(searchButtonElement));

      expect(stateSearch.query).toBe('');
      expect(stateSearch.searchFieldText).toBe('searchTest');
      expect(stateSearch.autocompleteSearchText).toBe('searchTest');

      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith({
        pathname: '/items',
        query: { query: 'searchTest', sort: SortOption.bestResults, page: '1' },
      });
    });

    it('Should do nothing after removing the search text and pressing the search button (Should never happen)', () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/',
        query: {
          query: 'searchTest', // Should never happen
        },
        push,
      });

      const { baseElement } = render(<Search />);
      expect(baseElement).toBeTruthy();
      expect(stateSearch.query).toBe('searchTest');
      expect(stateSearch.searchFieldText).toBe('searchTest');
      expect(stateSearch.autocompleteSearchText).toBe('searchTest');

      const searchElement = baseElement.querySelector(
        '#search-autocomplete'
      ) as HTMLInputElement;
      searchElement.value = '';

      act(() => {
        Simulate.change(searchElement);
      });

      expect(stateSearch.query).toBe('searchTest');
      expect(stateSearch.searchFieldText).toBe('');
      expect(stateSearch.autocompleteSearchText).toBe('searchTest');

      const searchButtonElement = baseElement.querySelector(
        '#search-button'
      ) as HTMLInputElement;

      act(() => fireEvent.click(searchButtonElement));

      expect(stateSearch.query).toBe('searchTest');
      expect(stateSearch.searchFieldText).toBe('');
      expect(stateSearch.autocompleteSearchText).toBe('');

      expect(push).toHaveBeenCalledTimes(0);
    });

    it("Should do nothing if the 'a' key is pressed", () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/',
        query: {},
        push,
      });

      const { baseElement } = render(<Search />);
      expect(baseElement).toBeTruthy();
      expect(stateSearch.query).toBe('');
      expect(stateSearch.searchFieldText).toBe('');
      expect(stateSearch.autocompleteSearchText).toBe('');

      let searchElement = baseElement.querySelector(
        '#search-autocomplete'
      ) as HTMLInputElement;
      searchElement.value = 'searchTest';

      act(() => {
        Simulate.change(searchElement);
      });

      expect(stateSearch.query).toBe('');
      expect(stateSearch.searchFieldText).toBe('searchTest');
      expect(stateSearch.autocompleteSearchText).toBe('');

      searchElement = baseElement.querySelector(
        '#search-autocomplete'
      ) as HTMLInputElement;

      act(() => fireEvent.keyDown(searchElement, { key: 'a' }));

      expect(stateSearch.query).toBe('');
      expect(stateSearch.searchFieldText).toBe('searchTest');
      expect(stateSearch.autocompleteSearchText).toBe('');

      expect(push).toHaveBeenCalledTimes(0);
    });

    it("Should do nothing if the search text hasn't changed and the search button is pressed", () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/',
        query: {},
        push,
      });

      const { baseElement } = render(<Search />);
      expect(baseElement).toBeTruthy();
      expect(stateSearch.query).toBe('');
      expect(stateSearch.searchFieldText).toBe('');
      expect(stateSearch.autocompleteSearchText).toBe('');

      const searchButtonElement = baseElement.querySelector(
        '#search-button'
      ) as HTMLInputElement;

      act(() => fireEvent.click(searchButtonElement));

      expect(stateSearch.query).toBe('');
      expect(stateSearch.searchFieldText).toBe('');
      expect(stateSearch.autocompleteSearchText).toBe('');

      expect(push).toHaveBeenCalledTimes(0);
    });
  });

  describe('On search page without category parameter', () => {
    it('Should stay on the search page after changing a search query', () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/items',
        query: {
          query: 'test',
          sort: SortOption.bestResults,
          page: '2',
        },
        push,
      });

      const { baseElement } = render(<Search />);
      expect(baseElement).toBeTruthy();
      expect(stateSearch.query).toBe('test');
      expect(stateSearch.searchFieldText).toBe('test');
      expect(stateSearch.autocompleteSearchText).toBe('test');

      let searchElement = baseElement.querySelector(
        '#search-autocomplete'
      ) as HTMLInputElement;
      searchElement.value = 'searchTest';

      act(() => {
        Simulate.change(searchElement);
      });

      expect(stateSearch.query).toBe('test');
      expect(stateSearch.searchFieldText).toBe('searchTest');
      expect(stateSearch.autocompleteSearchText).toBe('test');

      searchElement = baseElement.querySelector(
        '#search-autocomplete'
      ) as HTMLInputElement;

      act(() => fireEvent.keyDown(searchElement, { key: 'Enter' }));

      expect(stateSearch.query).toBe('test');
      expect(stateSearch.searchFieldText).toBe('searchTest');
      expect(stateSearch.autocompleteSearchText).toBe('searchTest');

      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith({
        pathname: '/items',
        query: { query: 'searchTest', sort: SortOption.bestResults, page: '1' },
      });
    });

    it("Should do nothing if the search query isn't changed", () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/items',
        query: {
          query: 'test',
          sort: SortOption.bestResults,
          page: '1',
        },
        push,
      });

      const { baseElement } = render(<Search />);
      expect(baseElement).toBeTruthy();
      expect(stateSearch.query).toBe('test');
      expect(stateSearch.searchFieldText).toBe('test');
      expect(stateSearch.autocompleteSearchText).toBe('test');

      let searchElement = baseElement.querySelector(
        '#search-autocomplete'
      ) as HTMLInputElement;
      searchElement.value = 'test';

      act(() => {
        Simulate.change(searchElement);
      });

      expect(stateSearch.query).toBe('test');
      expect(stateSearch.searchFieldText).toBe('test');
      expect(stateSearch.autocompleteSearchText).toBe('test');

      searchElement = baseElement.querySelector(
        '#search-autocomplete'
      ) as HTMLInputElement;

      act(() => fireEvent.keyDown(searchElement, { key: 'Enter' }));

      expect(stateSearch.query).toBe('test');
      expect(stateSearch.searchFieldText).toBe('test');
      expect(stateSearch.autocompleteSearchText).toBe('test');

      expect(push).toHaveBeenCalledTimes(0);
    });

    it('Should navigate to the home page if the search query is removed', () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/items',
        query: {
          query: 'test',
          sort: SortOption.bestResults,
          page: '1',
        },
        push,
      });

      const { baseElement } = render(<Search />);
      expect(baseElement).toBeTruthy();
      expect(stateSearch.query).toBe('test');
      expect(stateSearch.searchFieldText).toBe('test');
      expect(stateSearch.autocompleteSearchText).toBe('test');

      let searchElement = baseElement.querySelector(
        '#search-autocomplete'
      ) as HTMLInputElement;
      searchElement.value = '';

      act(() => {
        Simulate.change(searchElement);
      });

      expect(stateSearch.query).toBe('test');
      expect(stateSearch.searchFieldText).toBe('');
      expect(stateSearch.autocompleteSearchText).toBe('test');

      searchElement = baseElement.querySelector(
        '#search-autocomplete'
      ) as HTMLInputElement;

      act(() => fireEvent.keyDown(searchElement, { key: 'Enter' }));

      expect(stateSearch.query).toBe('test');
      expect(stateSearch.searchFieldText).toBe('');
      expect(stateSearch.autocompleteSearchText).toBe('');

      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith({ pathname: '/', query: {} });
    });

    it("Should do nothing if the search text hasn't changed and the search button is pressed", () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/items',
        query: {
          query: 'searchTest',
        },
        push,
      });

      const { baseElement } = render(<Search />);
      expect(baseElement).toBeTruthy();
      expect(stateSearch.query).toBe('searchTest');
      expect(stateSearch.searchFieldText).toBe('searchTest');
      expect(stateSearch.autocompleteSearchText).toBe('searchTest');

      const searchButtonElement = baseElement.querySelector(
        '#search-button'
      ) as HTMLInputElement;

      act(() => fireEvent.click(searchButtonElement));

      expect(stateSearch.query).toBe('searchTest');
      expect(stateSearch.searchFieldText).toBe('searchTest');
      expect(stateSearch.autocompleteSearchText).toBe('searchTest');

      expect(push).toHaveBeenCalledTimes(0);
    });
  });

  describe('On search page with category parameter', () => {
    it('Should stay on the search page and keep the category if a query is entered', () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/items',
        query: {
          category: Category.swords,
          sort: SortOption.popularity,
          page: '2',
        },
        push,
      });

      const { baseElement } = render(<Search />);
      expect(baseElement).toBeTruthy();
      expect(stateSearch.query).toBe('');
      expect(stateSearch.searchFieldText).toBe('');
      expect(stateSearch.autocompleteSearchText).toBe('');

      let searchElement = baseElement.querySelector(
        '#search-autocomplete'
      ) as HTMLInputElement;
      searchElement.value = 'searchTest';

      act(() => {
        Simulate.change(searchElement);
      });

      expect(stateSearch.query).toBe('');
      expect(stateSearch.searchFieldText).toBe('searchTest');
      expect(stateSearch.autocompleteSearchText).toBe('');

      searchElement = baseElement.querySelector(
        '#search-autocomplete'
      ) as HTMLInputElement;

      act(() => fireEvent.keyDown(searchElement, { key: 'Enter' }));

      expect(stateSearch.query).toBe('');
      expect(stateSearch.searchFieldText).toBe('searchTest');
      expect(stateSearch.autocompleteSearchText).toBe('searchTest');

      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith({
        pathname: '/items',
        query: {
          query: 'searchTest',
          category: Category.swords,
          sort: SortOption.bestResults,
          page: '1',
        },
      });
    });

    it('Should stay on the search page and keep the category if the query is changed', () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/items',
        query: {
          query: 'test',
          category: Category.swords,
          sort: SortOption.bestResults,
          page: '3',
        },
        push,
      });

      const { baseElement } = render(<Search />);
      expect(baseElement).toBeTruthy();
      expect(stateSearch.query).toBe('test');
      expect(stateSearch.searchFieldText).toBe('test');
      expect(stateSearch.autocompleteSearchText).toBe('test');

      let searchElement = baseElement.querySelector(
        '#search-autocomplete'
      ) as HTMLInputElement;
      searchElement.value = 'searchTest';

      act(() => {
        Simulate.change(searchElement);
      });

      expect(stateSearch.query).toBe('test');
      expect(stateSearch.searchFieldText).toBe('searchTest');
      expect(stateSearch.autocompleteSearchText).toBe('test');

      searchElement = baseElement.querySelector(
        '#search-autocomplete'
      ) as HTMLInputElement;

      act(() => fireEvent.keyDown(searchElement, { key: 'Enter' }));

      expect(stateSearch.query).toBe('test');
      expect(stateSearch.searchFieldText).toBe('searchTest');
      expect(stateSearch.autocompleteSearchText).toBe('searchTest');

      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith({
        pathname: '/items',
        query: {
          query: 'searchTest',
          category: Category.swords,
          sort: SortOption.bestResults,
          page: '1',
        },
      });
    });

    it('Should stay on the search page and change the sort option to popularity if the query is removed and a category exists', () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/items',
        query: {
          query: 'test',
          category: Category.scrolls,
          sort: SortOption.bestResults,
          page: '4',
        },
        push,
      });

      const result = render(<Search />);
      const baseElement = result.baseElement;

      expect(baseElement).toBeTruthy();
      expect(stateSearch.query).toBe('test');
      expect(stateSearch.searchFieldText).toBe('test');
      expect(stateSearch.autocompleteSearchText).toBe('test');

      let searchElement = baseElement.querySelector(
        '#search-autocomplete'
      ) as HTMLInputElement;
      searchElement.value = '';

      act(() => {
        Simulate.change(searchElement);
      });

      expect(stateSearch.query).toBe('test');
      expect(stateSearch.searchFieldText).toBe('');
      expect(stateSearch.autocompleteSearchText).toBe('test');

      searchElement = baseElement.querySelector(
        '#search-autocomplete'
      ) as HTMLInputElement;

      act(() => {
        fireEvent.keyDown(searchElement, { key: 'Enter' });
      });

      expect(stateSearch.query).toBe('test');
      expect(stateSearch.searchFieldText).toBe('');
      expect(stateSearch.autocompleteSearchText).toBe('');

      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith({
        pathname: '/items',
        query: {
          category: Category.scrolls,
          sort: SortOption.popularity,
          page: '1',
        },
      });
    });

    it('Should stay on the search page and keep the sort option if the query is removed and a category exists', () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/items',
        query: {
          query: 'test',
          category: Category.scrolls,
          sort: SortOption.priceDescending,
          page: '4',
        },
        push,
      });

      const result = render(<Search />);
      const baseElement = result.baseElement;

      expect(baseElement).toBeTruthy();
      expect(stateSearch.query).toBe('test');
      expect(stateSearch.searchFieldText).toBe('test');
      expect(stateSearch.autocompleteSearchText).toBe('test');

      let searchElement = baseElement.querySelector(
        '#search-autocomplete'
      ) as HTMLInputElement;
      searchElement.value = '';

      act(() => {
        Simulate.change(searchElement);
      });

      expect(stateSearch.query).toBe('test');
      expect(stateSearch.searchFieldText).toBe('');
      expect(stateSearch.autocompleteSearchText).toBe('test');

      searchElement = baseElement.querySelector(
        '#search-autocomplete'
      ) as HTMLInputElement;

      act(() => {
        fireEvent.keyDown(searchElement, { key: 'Enter' });
      });

      expect(stateSearch.query).toBe('test');
      expect(stateSearch.searchFieldText).toBe('');
      expect(stateSearch.autocompleteSearchText).toBe('');

      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith({
        pathname: '/items',
        query: {
          category: Category.scrolls,
          sort: SortOption.priceDescending,
          page: '1',
        },
      });
    });

    it("Should do nothing if the query isn't changed", () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/items',
        query: {
          query: 'test',
          category: Category.scrolls,
          sort: SortOption.bestResults,
          page: '1',
        },
        push,
      });

      const { baseElement } = render(<Search />);
      expect(baseElement).toBeTruthy();
      expect(stateSearch.query).toBe('test');
      expect(stateSearch.searchFieldText).toBe('test');
      expect(stateSearch.autocompleteSearchText).toBe('test');

      let searchElement = baseElement.querySelector(
        '#search-autocomplete'
      ) as HTMLInputElement;
      searchElement.value = 'test';

      act(() => {
        Simulate.change(searchElement);
      });

      expect(stateSearch.query).toBe('test');
      expect(stateSearch.searchFieldText).toBe('test');
      expect(stateSearch.autocompleteSearchText).toBe('test');

      searchElement = baseElement.querySelector(
        '#search-autocomplete'
      ) as HTMLInputElement;

      act(() => fireEvent.keyDown(searchElement, { key: 'Enter' }));

      expect(stateSearch.query).toBe('test');
      expect(stateSearch.searchFieldText).toBe('test');
      expect(stateSearch.autocompleteSearchText).toBe('test');

      expect(push).toHaveBeenCalledTimes(0);
    });
  });

  describe('autocomplete', () => {
    it('Should fetch new autocomplete options if the search field text changes and the initial search text is empty', async () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/',
        query: {},
        locale: Language.de,
        push,
      });

      const fetchSpy = jest.spyOn(window, 'fetch');
      fetchSpy.mockClear();
      fetchSpy.mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify(['item1', 'item2', 'item3']), {
            status: 200,
          })
        )
      );

      const { baseElement, rerender } = render(<Search />);

      await act(() => jest.runOnlyPendingTimers());

      expect(baseElement).toBeTruthy();
      expect(stateSearch.query).toBe('');
      expect(stateSearch.searchFieldText).toBe('');
      expect(stateSearch.autocompleteSearchText).toBe('');
      expect(stateSearch.autocompleteOptions).toEqual([]);
      expect(fetchSpy).toHaveBeenCalledTimes(0);

      const searchElement = baseElement.querySelector(
        '#search-autocomplete'
      ) as HTMLInputElement;
      searchElement.value = 'searchTest';

      await act(() => {
        Simulate.change(searchElement);
      });

      expect(stateSearch.query).toBe('');
      expect(stateSearch.searchFieldText).toBe('searchTest');
      expect(stateSearch.autocompleteSearchText).toBe('');
      expect(stateSearch.autocompleteOptions).toEqual([]);

      fetchSpy.mockClear();
      fetchSpy.mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify(['item1', 'item2', 'item3', 'item4']), {
            status: 200,
          })
        )
      );

      await act(() => rerender(<Search />));
      await act(() => jest.runOnlyPendingTimers());

      expect(stateSearch.query).toBe('');
      expect(stateSearch.searchFieldText).toBe('searchTest');
      expect(stateSearch.autocompleteSearchText).toBe('');
      expect(stateSearch.autocompleteOptions).toEqual([
        'item1',
        'item2',
        'item3',
        'item4',
      ]);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(
        `/api/get-autocomplete-items?query=searchTest&locale=${Language.de}`,
        {
          method: 'GET',
          mode: 'same-origin',
        }
      );
    });

    it("Should fetch new autocomplete options if the search field text changes and the initial search text isn't empty", async () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/',
        query: {
          query: 'testItem',
        },
        locale: Language.de,
        push,
      });

      const fetchSpy = jest.spyOn(window, 'fetch');
      fetchSpy.mockClear();
      fetchSpy.mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify(['item1', 'item2', 'item3']), {
            status: 200,
          })
        )
      );

      const { baseElement, rerender } = render(<Search />);

      await act(() => jest.runOnlyPendingTimers());

      expect(baseElement).toBeTruthy();
      expect(stateSearch.query).toBe('testItem');
      expect(stateSearch.searchFieldText).toBe('testItem');
      expect(stateSearch.autocompleteSearchText).toBe('testItem');
      expect(stateSearch.autocompleteOptions).toEqual([
        'testItem',
        'item1',
        'item2',
        'item3',
      ]);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(
        `/api/get-autocomplete-items?query=testItem&locale=${Language.de}`,
        {
          method: 'GET',
          mode: 'same-origin',
        }
      );

      const searchElement = baseElement.querySelector(
        '#search-autocomplete'
      ) as HTMLInputElement;
      searchElement.value = 'searchTest';

      await act(() => {
        Simulate.change(searchElement);
      });

      expect(stateSearch.query).toBe('testItem');
      expect(stateSearch.searchFieldText).toBe('searchTest');
      expect(stateSearch.autocompleteSearchText).toBe('testItem');
      expect(stateSearch.autocompleteOptions).toEqual([
        'testItem',
        'item1',
        'item2',
        'item3',
      ]);

      fetchSpy.mockClear();
      fetchSpy.mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify(['item1', 'item2', 'item3', 'item4']), {
            status: 200,
          })
        )
      );

      await act(() => rerender(<Search />));
      await act(() => jest.runOnlyPendingTimers());

      expect(stateSearch.query).toBe('testItem');
      expect(stateSearch.searchFieldText).toBe('searchTest');
      expect(stateSearch.autocompleteSearchText).toBe('testItem');
      expect(stateSearch.autocompleteOptions).toEqual([
        'testItem',
        'item1',
        'item2',
        'item3',
        'item4',
      ]);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(
        `/api/get-autocomplete-items?query=searchTest&locale=${Language.de}`,
        {
          method: 'GET',
          mode: 'same-origin',
        }
      );
    });

    it("Shouldn't fetch autocomplete options if the search field text is removed and the initial search text is empty", async () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/',
        query: {},
        locale: Language.de,
        push,
      });

      const fetchSpy = jest.spyOn(window, 'fetch');
      fetchSpy.mockClear();
      fetchSpy.mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify(['item1', 'item2', 'item3']), {
            status: 200,
          })
        )
      );

      const { baseElement, rerender } = render(<Search />);

      await act(() => jest.runOnlyPendingTimers());

      expect(baseElement).toBeTruthy();
      expect(stateSearch.query).toBe('');
      expect(stateSearch.searchFieldText).toBe('');
      expect(stateSearch.autocompleteSearchText).toBe('');
      expect(stateSearch.autocompleteOptions).toEqual([]);
      expect(fetchSpy).toHaveBeenCalledTimes(0);

      const searchElement = baseElement.querySelector(
        '#search-autocomplete'
      ) as HTMLInputElement;
      searchElement.value = '';

      await act(() => {
        Simulate.change(searchElement);
      });

      expect(stateSearch.query).toBe('');
      expect(stateSearch.searchFieldText).toBe('');
      expect(stateSearch.autocompleteSearchText).toBe('');
      expect(stateSearch.autocompleteOptions).toEqual([]);

      fetchSpy.mockClear();
      fetchSpy.mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify(['item1', 'item2', 'item3', 'item4']), {
            status: 200,
          })
        )
      );

      await act(() => rerender(<Search />));
      await act(() => jest.runOnlyPendingTimers());

      expect(stateSearch.query).toBe('');
      expect(stateSearch.searchFieldText).toBe('');
      expect(stateSearch.autocompleteSearchText).toBe('');
      expect(stateSearch.autocompleteOptions).toEqual([]);
      expect(fetchSpy).toHaveBeenCalledTimes(0);
    });

    it("Shouldn't fetch autocomplete options if the search field text is removed and the initial search text isn't empty", async () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/',
        query: {
          query: 'testItem',
        },
        locale: Language.de,
        push,
      });

      const fetchSpy = jest.spyOn(window, 'fetch');
      fetchSpy.mockClear();
      fetchSpy.mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify(['item1', 'item2', 'item3']), {
            status: 200,
          })
        )
      );

      const { baseElement, rerender } = render(<Search />);

      await act(() => jest.runOnlyPendingTimers());

      expect(baseElement).toBeTruthy();
      expect(stateSearch.query).toBe('testItem');
      expect(stateSearch.searchFieldText).toBe('testItem');
      expect(stateSearch.autocompleteSearchText).toBe('testItem');
      expect(stateSearch.autocompleteOptions).toEqual([
        'testItem',
        'item1',
        'item2',
        'item3',
      ]);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(
        `/api/get-autocomplete-items?query=testItem&locale=${Language.de}`,
        {
          method: 'GET',
          mode: 'same-origin',
        }
      );

      const searchElement = baseElement.querySelector(
        '#search-autocomplete'
      ) as HTMLInputElement;
      searchElement.value = '';

      await act(() => {
        Simulate.change(searchElement);
      });

      expect(stateSearch.query).toBe('testItem');
      expect(stateSearch.searchFieldText).toBe('');
      expect(stateSearch.autocompleteSearchText).toBe('testItem');
      expect(stateSearch.autocompleteOptions).toEqual(['testItem']);

      fetchSpy.mockClear();
      fetchSpy.mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify(['item1', 'item2', 'item3', 'item4']), {
            status: 200,
          })
        )
      );

      await act(() => rerender(<Search />));
      await act(() => jest.runOnlyPendingTimers());

      expect(stateSearch.query).toBe('testItem');
      expect(stateSearch.searchFieldText).toBe('');
      expect(stateSearch.autocompleteSearchText).toBe('testItem');
      expect(stateSearch.autocompleteOptions).toEqual(['testItem']);
      expect(fetchSpy).toHaveBeenCalledTimes(0);
    });

    it('Should fetch new autocomplete options if the search field text changes and all filters are set', async () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/items',
        query: {
          query: 'testItem',
          sort: SortOption.popularity,
          category: Category.shields,
          qualities: Quality.improved,
          powers: [EffectPower.average, EffectPower.strong],
        },
        locale: Language.enUs,
        push,
      });

      const fetchSpy = jest.spyOn(window, 'fetch');
      fetchSpy.mockClear();
      fetchSpy.mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify(['item1', 'item2', 'item3']), {
            status: 200,
          })
        )
      );

      const { baseElement, rerender } = render(<Search />);

      await act(() => jest.runOnlyPendingTimers());

      expect(baseElement).toBeTruthy();
      expect(stateSearch.query).toBe('testItem');
      expect(stateSearch.searchFieldText).toBe('testItem');
      expect(stateSearch.autocompleteSearchText).toBe('testItem');
      expect(stateSearch.autocompleteOptions).toEqual([
        'testItem',
        'item1',
        'item2',
        'item3',
      ]);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(
        `/api/get-autocomplete-items?category=${Category.shields}&qualities=${Quality.improved}&powers=${EffectPower.average}&powers=${EffectPower.strong}&query=testItem&locale=${Language.enUs}`,
        {
          method: 'GET',
          mode: 'same-origin',
        }
      );

      const searchElement = baseElement.querySelector(
        '#search-autocomplete'
      ) as HTMLInputElement;
      searchElement.value = 'searchTest';

      await act(() => {
        Simulate.change(searchElement);
      });

      expect(stateSearch.query).toBe('testItem');
      expect(stateSearch.searchFieldText).toBe('searchTest');
      expect(stateSearch.autocompleteSearchText).toBe('testItem');
      expect(stateSearch.autocompleteOptions).toEqual([
        'testItem',
        'item1',
        'item2',
        'item3',
      ]);

      fetchSpy.mockClear();
      fetchSpy.mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify(['item1', 'item2', 'item3', 'item4']), {
            status: 200,
          })
        )
      );

      await act(() => rerender(<Search />));
      await act(() => jest.runOnlyPendingTimers());

      expect(stateSearch.query).toBe('testItem');
      expect(stateSearch.searchFieldText).toBe('searchTest');
      expect(stateSearch.autocompleteSearchText).toBe('testItem');
      expect(stateSearch.autocompleteOptions).toEqual([
        'testItem',
        'item1',
        'item2',
        'item3',
        'item4',
      ]);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(
        `/api/get-autocomplete-items?category=${Category.shields}&qualities=${Quality.improved}&powers=${EffectPower.average}&powers=${EffectPower.strong}&query=searchTest&locale=${Language.enUs}`,
        {
          method: 'GET',
          mode: 'same-origin',
        }
      );
    });

    it('Should fetch new autocomplete options if the router query changes', async () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/',
        query: {
          query: 'test',
        },
        asPath: '/?query=test',
        locale: Language.enUs,
        push,
      });

      const fetchSpy = jest.spyOn(window, 'fetch');
      fetchSpy.mockClear();
      fetchSpy.mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify(['item1', 'item2', 'item3']), {
            status: 200,
          })
        )
      );

      const { baseElement, rerender } = render(<Search />);

      await act(() => jest.runOnlyPendingTimers());

      expect(baseElement).toBeTruthy();
      expect(stateSearch.query).toBe('test');
      expect(stateSearch.searchFieldText).toBe('test');
      expect(stateSearch.autocompleteSearchText).toBe('test');
      expect(stateSearch.autocompleteOptions).toEqual([
        'test',
        'item1',
        'item2',
        'item3',
      ]);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(
        `/api/get-autocomplete-items?query=test&locale=${Language.enUs}`,
        {
          method: 'GET',
          mode: 'same-origin',
        }
      );

      mockRouter({
        pathname: '/',
        query: {
          query: 'testName',
        },
        asPath: '/?query=testName',
        locale: Language.enUs,
        push,
      });

      fetchSpy.mockClear();
      fetchSpy.mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify(['item1', 'item2', 'item3', 'item4']), {
            status: 200,
          })
        )
      );

      await act(() => rerender(<Search />));
      await act(() => jest.runOnlyPendingTimers());

      expect(stateSearch.query).toBe('testName');
      expect(stateSearch.searchFieldText).toBe('testName');
      expect(stateSearch.autocompleteSearchText).toBe('testName');
      expect(stateSearch.autocompleteOptions).toEqual([
        'testName',
        'item1',
        'item2',
        'item3',
        'item4',
      ]);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(
        `/api/get-autocomplete-items?query=testName&locale=${Language.enUs}`,
        {
          method: 'GET',
          mode: 'same-origin',
        }
      );
    });

    it('Should fetch new autocomplete options if the router path changes', async () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/',
        query: {
          query: 'testName',
        },
        asPath: '/?query=testName',
        locale: Language.enUs,
        push,
      });

      const fetchSpy = jest.spyOn(window, 'fetch');
      fetchSpy.mockClear();
      fetchSpy.mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify(['item1', 'item2', 'item3']), {
            status: 200,
          })
        )
      );

      const { baseElement, rerender } = render(<Search />);

      await act(() => jest.runOnlyPendingTimers());

      expect(baseElement).toBeTruthy();
      expect(stateSearch.query).toBe('testName');
      expect(stateSearch.searchFieldText).toBe('testName');
      expect(stateSearch.autocompleteSearchText).toBe('testName');
      expect(stateSearch.autocompleteOptions).toEqual([
        'testName',
        'item1',
        'item2',
        'item3',
      ]);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(
        `/api/get-autocomplete-items?query=testName&locale=${Language.enUs}`,
        {
          method: 'GET',
          mode: 'same-origin',
        }
      );

      mockRouter({
        pathname: '/items',
        query: {
          query: 'testName',
        },
        asPath: '/items?query=testName',
        locale: Language.enUs,
        push,
      });

      fetchSpy.mockClear();
      fetchSpy.mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify(['item1', 'item2', 'item3', 'item4']), {
            status: 200,
          })
        )
      );

      await act(() => rerender(<Search />));
      await act(() => jest.runOnlyPendingTimers());

      expect(stateSearch.query).toBe('testName');
      expect(stateSearch.searchFieldText).toBe('testName');
      expect(stateSearch.autocompleteSearchText).toBe('testName');
      expect(stateSearch.autocompleteOptions).toEqual([
        'testName',
        'item1',
        'item2',
        'item3',
        'item4',
      ]);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(
        `/api/get-autocomplete-items?query=testName&locale=${Language.enUs}`,
        {
          method: 'GET',
          mode: 'same-origin',
        }
      );
    });

    it('Should fetch new autocomplete options if the router locale changes', async () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/',
        query: {
          query: 'testName',
        },
        asPath: '/?query=testName',
        locale: Language.enUs,
        push,
      });

      const fetchSpy = jest.spyOn(window, 'fetch');
      fetchSpy.mockClear();
      fetchSpy.mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify(['item1', 'item2', 'item3']), {
            status: 200,
          })
        )
      );

      const { baseElement, rerender } = render(<Search />);

      await act(() => jest.runOnlyPendingTimers());

      expect(baseElement).toBeTruthy();
      expect(stateSearch.query).toBe('testName');
      expect(stateSearch.searchFieldText).toBe('testName');
      expect(stateSearch.autocompleteSearchText).toBe('testName');
      expect(stateSearch.autocompleteOptions).toEqual([
        'testName',
        'item1',
        'item2',
        'item3',
      ]);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(
        `/api/get-autocomplete-items?query=testName&locale=${Language.enUs}`,
        {
          method: 'GET',
          mode: 'same-origin',
        }
      );

      mockRouter({
        pathname: '/',
        query: {
          query: 'testName',
        },
        asPath: '/?query=testName',
        locale: Language.de,
        push,
      });

      fetchSpy.mockClear();
      fetchSpy.mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify(['item1', 'item2', 'item3', 'item4']), {
            status: 200,
          })
        )
      );

      await act(() => rerender(<Search />));
      await act(() => jest.runOnlyPendingTimers());

      expect(stateSearch.query).toBe('testName');
      expect(stateSearch.searchFieldText).toBe('testName');
      expect(stateSearch.autocompleteSearchText).toBe('testName');
      expect(stateSearch.autocompleteOptions).toEqual([
        'testName',
        'item1',
        'item2',
        'item3',
        'item4',
      ]);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(
        `/api/get-autocomplete-items?query=testName&locale=${Language.de}`,
        {
          method: 'GET',
          mode: 'same-origin',
        }
      );
    });

    it("Shouldn't fetch new autocomplete options if nothing changes", async () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/',
        query: {
          query: 'testName',
        },
        locale: Language.de,
        push,
      });

      const fetchSpy = jest.spyOn(window, 'fetch');
      fetchSpy.mockClear();
      fetchSpy.mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify(['item1', 'item2', 'item3']), {
            status: 200,
          })
        )
      );

      const { baseElement, rerender } = render(<Search />);

      await act(() => jest.runOnlyPendingTimers());

      expect(baseElement).toBeTruthy();
      expect(stateSearch.query).toBe('testName');
      expect(stateSearch.searchFieldText).toBe('testName');
      expect(stateSearch.autocompleteSearchText).toBe('testName');
      expect(stateSearch.autocompleteOptions).toEqual([
        'testName',
        'item1',
        'item2',
        'item3',
      ]);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(
        `/api/get-autocomplete-items?query=testName&locale=${Language.de}`,
        {
          method: 'GET',
          mode: 'same-origin',
        }
      );

      fetchSpy.mockClear();
      fetchSpy.mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify(['item1', 'item2', 'item3', 'item4']), {
            status: 200,
          })
        )
      );

      await act(() => rerender(<Search />));
      await act(() => jest.runOnlyPendingTimers());

      expect(stateSearch.query).toBe('testName');
      expect(stateSearch.searchFieldText).toBe('testName');
      expect(stateSearch.autocompleteSearchText).toBe('testName');
      expect(stateSearch.autocompleteOptions).toEqual([
        'testName',
        'item1',
        'item2',
        'item3',
      ]);
      expect(fetchSpy).toHaveBeenCalledTimes(0);
    });

    it("Should handle HTTP errors during autocomplete options update if a search text doesn't exist", async () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/',
        query: {},
        locale: Language.de,
        push,
      });

      const fetchSpy = jest.spyOn(window, 'fetch');
      fetchSpy.mockClear();
      fetchSpy.mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify(['item1', 'item2', 'item3']), {
            status: 200,
          })
        )
      );

      const { baseElement, rerender } = render(<Search />);

      await act(() => jest.runOnlyPendingTimers());

      expect(baseElement).toBeTruthy();
      expect(stateSearch.query).toBe('');
      expect(stateSearch.searchFieldText).toBe('');
      expect(stateSearch.autocompleteSearchText).toBe('');
      expect(stateSearch.autocompleteOptions).toEqual([]);
      expect(fetchSpy).toHaveBeenCalledTimes(0);

      const searchElement = baseElement.querySelector(
        '#search-autocomplete'
      ) as HTMLInputElement;
      searchElement.value = 'searchTest';

      await act(() => {
        Simulate.change(searchElement);
      });

      expect(stateSearch.query).toBe('');
      expect(stateSearch.searchFieldText).toBe('searchTest');
      expect(stateSearch.autocompleteSearchText).toBe('');
      expect(stateSearch.autocompleteOptions).toEqual([]);

      fetchSpy.mockClear();
      fetchSpy.mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify(['item1', 'item2', 'item3', 'item4']), {
            status: 405,
          })
        )
      );

      await act(() => rerender(<Search />));
      const consoleError = console.error;
      console.error = () => {
        return;
      };
      await act(() => jest.runOnlyPendingTimers());
      console.error = consoleError;

      expect(stateSearch.query).toBe('');
      expect(stateSearch.searchFieldText).toBe('searchTest');
      expect(stateSearch.autocompleteSearchText).toBe('');
      expect(stateSearch.autocompleteOptions).toEqual([]);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(
        `/api/get-autocomplete-items?query=searchTest&locale=${Language.de}`,
        {
          method: 'GET',
          mode: 'same-origin',
        }
      );
    });

    it('Should handle HTTP errors during autocomplete options update if a search text exist', async () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/',
        query: {
          query: 'testName',
        },
        locale: Language.de,
        push,
      });

      const fetchSpy = jest.spyOn(window, 'fetch');
      fetchSpy.mockClear();
      fetchSpy.mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify(['item1', 'item2', 'item3']), {
            status: 405,
          })
        )
      );

      const { baseElement } = render(<Search />);

      const consoleError = console.error;
      console.error = () => {
        return;
      };
      await act(() => jest.runOnlyPendingTimers());
      console.error = consoleError;

      expect(baseElement).toBeTruthy();
      expect(stateSearch.query).toBe('testName');
      expect(stateSearch.searchFieldText).toBe('testName');
      expect(stateSearch.autocompleteSearchText).toBe('testName');
      expect(stateSearch.autocompleteOptions).toEqual(['testName']);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(
        `/api/get-autocomplete-items?query=testName&locale=${Language.de}`,
        {
          method: 'GET',
          mode: 'same-origin',
        }
      );
    });

    it("Should handle network errors during autocomplete options update if a search text doesn't exist", async () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/',
        query: {},
        locale: Language.de,
        push,
      });

      const fetchSpy = jest.spyOn(window, 'fetch');
      fetchSpy.mockClear();
      fetchSpy.mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify(['item1', 'item2', 'item3']), {
            status: 200,
          })
        )
      );

      const { baseElement, rerender } = render(<Search />);

      await act(() => jest.runOnlyPendingTimers());

      expect(baseElement).toBeTruthy();
      expect(stateSearch.query).toBe('');
      expect(stateSearch.searchFieldText).toBe('');
      expect(stateSearch.autocompleteSearchText).toBe('');
      expect(stateSearch.autocompleteOptions).toEqual([]);
      expect(fetchSpy).toHaveBeenCalledTimes(0);

      const searchElement = baseElement.querySelector(
        '#search-autocomplete'
      ) as HTMLInputElement;
      searchElement.value = 'searchTest';

      await act(() => {
        Simulate.change(searchElement);
      });

      expect(stateSearch.query).toBe('');
      expect(stateSearch.searchFieldText).toBe('searchTest');
      expect(stateSearch.autocompleteSearchText).toBe('');
      expect(stateSearch.autocompleteOptions).toEqual([]);

      fetchSpy.mockClear();
      fetchSpy.mockImplementation(() =>
        Promise.reject(new Error('Network error'))
      );

      await act(() => rerender(<Search />));
      const consoleError = console.error;
      console.error = () => {
        return;
      };
      await act(() => jest.runOnlyPendingTimers());
      console.error = consoleError;

      expect(stateSearch.query).toBe('');
      expect(stateSearch.searchFieldText).toBe('searchTest');
      expect(stateSearch.autocompleteSearchText).toBe('');
      expect(stateSearch.autocompleteOptions).toEqual([]);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(
        `/api/get-autocomplete-items?query=searchTest&locale=${Language.de}`,
        {
          method: 'GET',
          mode: 'same-origin',
        }
      );
    });

    it('Should handle network errors during autocomplete options update if a search text exist', async () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/',
        query: {
          query: 'testName',
        },
        locale: Language.de,
        push,
      });

      const fetchSpy = jest.spyOn(window, 'fetch');
      fetchSpy.mockClear();
      fetchSpy.mockImplementation(() =>
        Promise.reject(new Error('Network error'))
      );

      const { baseElement } = render(<Search />);

      const consoleError = console.error;
      console.error = () => {
        return;
      };
      await act(() => jest.runOnlyPendingTimers());
      console.error = consoleError;

      expect(baseElement).toBeTruthy();
      expect(stateSearch.query).toBe('testName');
      expect(stateSearch.searchFieldText).toBe('testName');
      expect(stateSearch.autocompleteSearchText).toBe('testName');
      expect(stateSearch.autocompleteOptions).toEqual(['testName']);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(
        `/api/get-autocomplete-items?query=testName&locale=${Language.de}`,
        {
          method: 'GET',
          mode: 'same-origin',
        }
      );
    });

    it("Should handle empty options responses during autocomplete options update if a search text doesn't exist", async () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/',
        query: {},
        locale: Language.de,
        push,
      });

      const fetchSpy = jest.spyOn(window, 'fetch');
      fetchSpy.mockClear();
      fetchSpy.mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify(['item1', 'item2', 'item3']), {
            status: 200,
          })
        )
      );

      const { baseElement, rerender } = render(<Search />);

      await act(() => jest.runOnlyPendingTimers());

      expect(baseElement).toBeTruthy();
      expect(stateSearch.query).toBe('');
      expect(stateSearch.searchFieldText).toBe('');
      expect(stateSearch.autocompleteSearchText).toBe('');
      expect(stateSearch.autocompleteOptions).toEqual([]);
      expect(fetchSpy).toHaveBeenCalledTimes(0);

      const searchElement = baseElement.querySelector(
        '#search-autocomplete'
      ) as HTMLInputElement;
      searchElement.value = 'searchTest';

      await act(() => {
        Simulate.change(searchElement);
      });

      expect(stateSearch.query).toBe('');
      expect(stateSearch.searchFieldText).toBe('searchTest');
      expect(stateSearch.autocompleteSearchText).toBe('');
      expect(stateSearch.autocompleteOptions).toEqual([]);

      fetchSpy.mockClear();
      fetchSpy.mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify([]), {
            status: 200,
          })
        )
      );

      await act(() => rerender(<Search />));
      await act(() => jest.runOnlyPendingTimers());

      expect(stateSearch.query).toBe('');
      expect(stateSearch.searchFieldText).toBe('searchTest');
      expect(stateSearch.autocompleteSearchText).toBe('');
      expect(stateSearch.autocompleteOptions).toEqual([]);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(
        `/api/get-autocomplete-items?query=searchTest&locale=${Language.de}`,
        {
          method: 'GET',
          mode: 'same-origin',
        }
      );
    });

    it('Should handle empty options responses during autocomplete options update if a search text exist', async () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/',
        query: {
          query: 'testName',
        },
        locale: Language.de,
        push,
      });

      const fetchSpy = jest.spyOn(window, 'fetch');
      fetchSpy.mockClear();
      fetchSpy.mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify([]), {
            status: 200,
          })
        )
      );

      const { baseElement } = render(<Search />);

      await act(() => jest.runOnlyPendingTimers());

      expect(baseElement).toBeTruthy();
      expect(stateSearch.query).toBe('testName');
      expect(stateSearch.searchFieldText).toBe('testName');
      expect(stateSearch.autocompleteSearchText).toBe('testName');
      expect(stateSearch.autocompleteOptions).toEqual(['testName']);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(
        `/api/get-autocomplete-items?query=testName&locale=${Language.de}`,
        {
          method: 'GET',
          mode: 'same-origin',
        }
      );
    });
  });
});
