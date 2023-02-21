import { Quality } from '@castleadmin/product-domain';
import { ThemeProvider } from '@mui/material';
import { act, fireEvent, render } from '@testing-library/react';
import 'next-i18next';
import { mockRouter } from '../../specs/mocks';
import { theme } from '../../theme';
import FilterQuality, { stateFilterQuality } from './filter-quality';

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

describe('FilterQuality', () => {
  it('Should render successfully', () => {
    mockRouter();

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <FilterQuality />
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(stateFilterQuality.qualities).toEqual([]);
  });

  it('Should update the qualities state if the query has been changed by an external component', () => {
    mockRouter({
      pathname: '/items',
      query: {
        qualities: [Quality.improved],
      },
    });

    const result = render(
      <ThemeProvider theme={theme}>
        <FilterQuality />
      </ThemeProvider>
    );
    const baseElement = result.baseElement;

    expect(baseElement).toBeTruthy();
    expect(stateFilterQuality.qualities).toEqual([Quality.improved]);

    mockRouter({
      pathname: '/items',
      query: {
        qualities: [],
      },
    });

    result.rerender(
      <ThemeProvider theme={theme}>
        <FilterQuality />
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(stateFilterQuality.qualities).toEqual([]);
  });

  describe('Should set the qualities state according to the query parameter', () => {
    it('0 query qualities', () => {
      mockRouter({
        pathname: '/items',
        query: {},
      });

      const { baseElement } = render(
        <ThemeProvider theme={theme}>
          <FilterQuality />
        </ThemeProvider>
      );

      expect(baseElement).toBeTruthy();
      expect(stateFilterQuality.qualities).toEqual([]);
    });

    it('1 query quality', () => {
      mockRouter({
        pathname: '/items',
        query: {
          qualities: [Quality.improved],
        },
      });

      const { baseElement } = render(
        <ThemeProvider theme={theme}>
          <FilterQuality />
        </ThemeProvider>
      );

      expect(baseElement).toBeTruthy();
      expect(stateFilterQuality.qualities).toEqual([Quality.improved]);
    });

    it('1 query quality as string', () => {
      mockRouter({
        pathname: '/items',
        query: {
          qualities: Quality.improved,
        },
      });

      const { baseElement } = render(
        <ThemeProvider theme={theme}>
          <FilterQuality />
        </ThemeProvider>
      );

      expect(baseElement).toBeTruthy();
      expect(stateFilterQuality.qualities).toEqual([Quality.improved]);
    });

    it('2 query qualities', () => {
      mockRouter({
        pathname: '/items',
        query: {
          qualities: [Quality.improved, Quality.normal],
        },
      });

      const { baseElement } = render(
        <ThemeProvider theme={theme}>
          <FilterQuality />
        </ThemeProvider>
      );

      expect(baseElement).toBeTruthy();
      expect(stateFilterQuality.qualities).toEqual([
        Quality.improved,
        Quality.normal,
      ]);
    });
  });

  describe('Should update the qualities state on a change event', () => {
    it('Selected 0 -> 1', () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/items',
        query: {
          qualities: [],
        },
        push,
      });

      const { baseElement } = render(
        <ThemeProvider theme={theme}>
          <FilterQuality />
        </ThemeProvider>
      );

      expect(baseElement).toBeTruthy();
      expect(stateFilterQuality.qualities).toEqual([]);

      const qualitiesInput = baseElement.querySelector(
        '#filter-quality-input'
      ) as Element;

      act(() => fireEvent.mouseDown(qualitiesInput));

      const itemElement = baseElement.querySelector(
        `[data-value=${Quality.excellent}]`
      ) as Element;

      act(() => fireEvent.click(itemElement));

      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith({
        pathname: '/items',
        query: { qualities: [Quality.excellent], page: '1' },
      });
    });

    it('Selected 1 -> many', () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/items',
        query: {
          qualities: [Quality.improved],
        },
        push,
      });

      const { baseElement } = render(
        <ThemeProvider theme={theme}>
          <FilterQuality />
        </ThemeProvider>
      );

      expect(baseElement).toBeTruthy();
      expect(stateFilterQuality.qualities).toEqual([Quality.improved]);

      const qualitiesInput = baseElement.querySelector(
        '#filter-quality-input'
      ) as Element;

      act(() => fireEvent.mouseDown(qualitiesInput));

      const itemElement = baseElement.querySelector(
        `[data-value=${Quality.excellent}]`
      ) as Element;

      act(() => fireEvent.click(itemElement));

      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith({
        pathname: '/items',
        query: { qualities: [Quality.improved, Quality.excellent], page: '1' },
      });
    });

    it('Selected many -> 1', () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/items',
        query: {
          qualities: [Quality.improved, Quality.normal],
        },
        push,
      });

      const { baseElement } = render(
        <ThemeProvider theme={theme}>
          <FilterQuality />
        </ThemeProvider>
      );

      expect(baseElement).toBeTruthy();
      expect(stateFilterQuality.qualities).toEqual([
        Quality.improved,
        Quality.normal,
      ]);

      const qualitiesInput = baseElement.querySelector(
        '#filter-quality-input'
      ) as Element;

      act(() => fireEvent.mouseDown(qualitiesInput));

      const itemElement = baseElement.querySelector(
        `[data-value=${Quality.normal}]`
      ) as Element;

      act(() => fireEvent.click(itemElement));

      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith({
        pathname: '/items',
        query: { qualities: [Quality.improved], page: '1' },
      });
    });

    it('Selected 1 -> 0', () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/items',
        query: {
          qualities: [Quality.normal],
        },
        push,
      });

      const { baseElement } = render(
        <ThemeProvider theme={theme}>
          <FilterQuality />
        </ThemeProvider>
      );

      expect(baseElement).toBeTruthy();
      expect(stateFilterQuality.qualities).toEqual([Quality.normal]);

      const qualitiesInput = baseElement.querySelector(
        '#filter-quality-input'
      ) as Element;

      act(() => fireEvent.mouseDown(qualitiesInput));

      const itemElement = baseElement.querySelector(
        `[data-value=${Quality.normal}]`
      ) as Element;

      act(() => fireEvent.click(itemElement));

      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith({
        pathname: '/items',
        query: { qualities: [], page: '1' },
      });
    });
  });
});
