import { SortOption } from '@castleadmin/product-domain';
import { ThemeProvider } from '@mui/material';
import { act, fireEvent, render } from '@testing-library/react';
import 'next-i18next';
import { mockRouter } from '../../specs/mocks';
import { theme } from '../../theme';
import Sort, { stateSort } from './sort';

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

describe('Sort', () => {
  it('Should render successfully', () => {
    mockRouter();

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Sort />
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(stateSort.sort).toBe('');
  });

  it('Should set the sort state to the query parameter', () => {
    mockRouter({
      pathname: '/items',
      query: {
        sort: SortOption.review,
      },
    });

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Sort />
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(stateSort.sort).toBe(SortOption.review);
  });

  it('Should update the sort state if the query has been changed by an external component', () => {
    mockRouter({
      pathname: '/items',
      query: {
        sort: SortOption.review,
      },
    });

    const result = render(
      <ThemeProvider theme={theme}>
        <Sort />
      </ThemeProvider>
    );
    const baseElement = result.baseElement;

    expect(baseElement).toBeTruthy();
    expect(stateSort.sort).toBe(SortOption.review);

    mockRouter({
      pathname: '/items',
      query: {},
    });

    result.rerender(
      <ThemeProvider theme={theme}>
        <Sort />
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(stateSort.sort).toBe('');
  });

  it('Should update the sort state on a change event', () => {
    const push = jest.fn();
    mockRouter({
      pathname: '/items',
      query: {
        sort: SortOption.review,
      },
      push,
    });

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Sort />
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(stateSort.sort).toBe(SortOption.review);

    const sortInput = baseElement.querySelector('#sort-input') as Element;

    act(() => fireEvent.mouseDown(sortInput));

    const itemElement = baseElement.querySelector(
      `[data-value=${SortOption.priceAscending}]`
    ) as Element;

    act(() => fireEvent.click(itemElement));

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith({
      pathname: '/items',
      query: { sort: SortOption.priceAscending, page: '1' },
    });
  });

  it("Shouldn't update the sort state on a change event if the sort option is still the same", () => {
    const push = jest.fn();
    mockRouter({
      pathname: '/items',
      query: {
        sort: SortOption.review,
      },
      push,
    });

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Sort />
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(stateSort.sort).toBe(SortOption.review);

    const sortInput = baseElement.querySelector('#sort-input') as Element;

    act(() => fireEvent.mouseDown(sortInput));

    const itemElement = baseElement.querySelector(
      `[data-value=${SortOption.review}]`
    ) as Element;

    act(() => fireEvent.click(itemElement));

    expect(push).toHaveBeenCalledTimes(0);
  });
});
