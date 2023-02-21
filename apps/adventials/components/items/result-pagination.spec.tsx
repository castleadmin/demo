import { EffectPower, Quality } from '@castleadmin/product-domain';
import { ThemeProvider } from '@mui/material';
import { act, fireEvent, render } from '@testing-library/react';
import { mockRouter } from '../../specs/mocks';
import { theme } from '../../theme';
import ResultPagination, { stateResultPagination } from './result-pagination';

describe('ResultPagination', () => {
  it('Should render successfully', () => {
    mockRouter({
      pathname: '/items',
      query: {
        page: '2',
      },
    });

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <ResultPagination count={120} />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('Should set the page state to the query parameter', () => {
    mockRouter({
      pathname: '/items',
      query: {
        page: '3',
      },
    });

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <ResultPagination count={120} />
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(stateResultPagination.page).toBe(3);
  });

  it('Should update the page state if the query has been changed by an external component', () => {
    mockRouter({
      pathname: '/items',
      query: {
        page: '2',
      },
    });

    const result = render(
      <ThemeProvider theme={theme}>
        <ResultPagination count={120} />
      </ThemeProvider>
    );
    const baseElement = result.baseElement;

    expect(baseElement).toBeTruthy();
    expect(stateResultPagination.page).toBe(2);

    mockRouter({
      pathname: '/items',
      query: {},
    });

    result.rerender(
      <ThemeProvider theme={theme}>
        <ResultPagination count={120} />
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(stateResultPagination.page).toBe(1);
  });

  it('Should update the page state on a change event', () => {
    const push = jest.fn();
    mockRouter({
      pathname: '/items',
      query: {
        page: '3',
      },
      push,
    });

    const { getByText, baseElement } = render(
      <ThemeProvider theme={theme}>
        <ResultPagination count={120} />
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(stateResultPagination.page).toBe(3);

    const pageButton = getByText(2) as HTMLElement;

    act(() => fireEvent.click(pageButton));

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith({
      pathname: '/items',
      query: { page: 2 },
    });
  });

  it('Should set the page state to 1 if the page parameter is invalid', () => {
    const push = jest.fn();
    mockRouter({
      pathname: '/items',
      query: {
        page: 'a3',
      },
      push,
    });

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <ResultPagination count={120} />
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(stateResultPagination.page).toBe(1);
  });

  it('Should set the page to 1 if the qualities filter changes', () => {
    const push = jest.fn();
    mockRouter({
      pathname: '/items',
      query: {
        page: '2',
        qualities: [Quality.normal, Quality.improved],
      },
      push,
    });

    const result = render(
      <ThemeProvider theme={theme}>
        <ResultPagination count={120} />
      </ThemeProvider>
    );
    const baseElement = result.baseElement;

    expect(baseElement).toBeTruthy();
    expect(stateResultPagination.page).toBe(2);
    expect(stateResultPagination.qualities).toEqual([
      Quality.normal,
      Quality.improved,
    ]);

    mockRouter({
      pathname: '/items',
      query: {
        page: '2',
        qualities: Quality.normal,
      },
      push,
    });

    result.rerender(
      <ThemeProvider theme={theme}>
        <ResultPagination count={120} />
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(stateResultPagination.qualities).toEqual([Quality.normal]);
    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith({
      pathname: '/items',
      query: { page: 1, qualities: Quality.normal },
    });
  });

  it('Should set the page to 1 if the powers filter changes', () => {
    const push = jest.fn();
    mockRouter({
      pathname: '/items',
      query: {
        page: '2',
        powers: [EffectPower.average, EffectPower.strong],
      },
      push,
    });

    const result = render(
      <ThemeProvider theme={theme}>
        <ResultPagination count={120} />
      </ThemeProvider>
    );
    const baseElement = result.baseElement;

    expect(baseElement).toBeTruthy();
    expect(stateResultPagination.page).toBe(2);
    expect(stateResultPagination.powers).toEqual([
      EffectPower.average,
      EffectPower.strong,
    ]);

    mockRouter({
      pathname: '/items',
      query: {
        page: '2',
        powers: EffectPower.average,
      },
      push,
    });

    result.rerender(
      <ThemeProvider theme={theme}>
        <ResultPagination count={120} />
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(stateResultPagination.powers).toEqual([EffectPower.average]);
    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith({
      pathname: '/items',
      query: { page: 1, powers: EffectPower.average },
    });
  });
});
