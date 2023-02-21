import { EffectPower } from '@castleadmin/product-domain';
import { ThemeProvider } from '@mui/material';
import { act, fireEvent, render } from '@testing-library/react';
import 'next-i18next';
import { mockRouter } from '../../specs/mocks';
import { theme } from '../../theme';
import FilterMagicalPower, {
  stateFilterMagicalPower,
} from './filter-magical-power';

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

describe('FilterMagicalPower', () => {
  it('Should render successfully', () => {
    mockRouter();

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <FilterMagicalPower />
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(stateFilterMagicalPower.powers).toEqual([]);
  });

  it('Should update the powers state if the query has been changed by an external component', () => {
    mockRouter({
      pathname: '/items',
      query: {
        powers: [EffectPower.average],
      },
    });

    const result = render(
      <ThemeProvider theme={theme}>
        <FilterMagicalPower />
      </ThemeProvider>
    );
    const baseElement = result.baseElement;

    expect(baseElement).toBeTruthy();
    expect(stateFilterMagicalPower.powers).toEqual([EffectPower.average]);

    mockRouter({
      pathname: '/items',
      query: {
        powers: [],
      },
    });

    result.rerender(
      <ThemeProvider theme={theme}>
        <FilterMagicalPower />
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(stateFilterMagicalPower.powers).toEqual([]);
  });

  describe('Should set the powers state according to the query parameter', () => {
    it('0 query powers', () => {
      mockRouter({
        pathname: '/items',
        query: {},
      });

      const { baseElement } = render(
        <ThemeProvider theme={theme}>
          <FilterMagicalPower />
        </ThemeProvider>
      );

      expect(baseElement).toBeTruthy();
      expect(stateFilterMagicalPower.powers).toEqual([]);
    });

    it('1 query power', () => {
      mockRouter({
        pathname: '/items',
        query: {
          powers: [EffectPower.weak],
        },
      });

      const { baseElement } = render(
        <ThemeProvider theme={theme}>
          <FilterMagicalPower />
        </ThemeProvider>
      );

      expect(baseElement).toBeTruthy();
      expect(stateFilterMagicalPower.powers).toEqual([EffectPower.weak]);
    });

    it('1 query magical-power as string', () => {
      mockRouter({
        pathname: '/items',
        query: {
          powers: EffectPower.weak,
        },
      });

      const { baseElement } = render(
        <ThemeProvider theme={theme}>
          <FilterMagicalPower />
        </ThemeProvider>
      );

      expect(baseElement).toBeTruthy();
      expect(stateFilterMagicalPower.powers).toEqual([EffectPower.weak]);
    });

    it('2 query powers', () => {
      mockRouter({
        pathname: '/items',
        query: {
          powers: [EffectPower.strong, EffectPower.average],
        },
      });

      const { baseElement } = render(
        <ThemeProvider theme={theme}>
          <FilterMagicalPower />
        </ThemeProvider>
      );

      expect(baseElement).toBeTruthy();
      expect(stateFilterMagicalPower.powers).toEqual([
        EffectPower.strong,
        EffectPower.average,
      ]);
    });
  });

  describe('Should update the powers state on a change event', () => {
    it('Selected 0 -> 1', () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/items',
        query: {
          powers: [],
        },
        push,
      });

      const { baseElement } = render(
        <ThemeProvider theme={theme}>
          <FilterMagicalPower />
        </ThemeProvider>
      );

      expect(baseElement).toBeTruthy();
      expect(stateFilterMagicalPower.powers).toEqual([]);

      const powersInput = baseElement.querySelector(
        '#filter-magical-power-input'
      ) as Element;

      act(() => fireEvent.mouseDown(powersInput));

      const itemElement = baseElement.querySelector(
        `[data-value=${EffectPower.none}]`
      ) as Element;

      act(() => fireEvent.click(itemElement));

      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith({
        pathname: '/items',
        query: { powers: [EffectPower.none], page: '1' },
      });
    });

    it('Selected 1 -> many', () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/items',
        query: {
          powers: [EffectPower.average],
        },
        push,
      });

      const { baseElement } = render(
        <ThemeProvider theme={theme}>
          <FilterMagicalPower />
        </ThemeProvider>
      );

      expect(baseElement).toBeTruthy();
      expect(stateFilterMagicalPower.powers).toEqual([EffectPower.average]);

      const powersInput = baseElement.querySelector(
        '#filter-magical-power-input'
      ) as Element;

      act(() => fireEvent.mouseDown(powersInput));

      const itemElement = baseElement.querySelector(
        `[data-value=${EffectPower.strong}]`
      ) as Element;

      act(() => fireEvent.click(itemElement));

      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith({
        pathname: '/items',
        query: { powers: [EffectPower.average, EffectPower.strong], page: '1' },
      });
    });

    it('Selected many -> 1', () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/items',
        query: {
          powers: [EffectPower.strong, EffectPower.average],
        },
        push,
      });

      const { baseElement } = render(
        <ThemeProvider theme={theme}>
          <FilterMagicalPower />
        </ThemeProvider>
      );

      expect(baseElement).toBeTruthy();
      expect(stateFilterMagicalPower.powers).toEqual([
        EffectPower.strong,
        EffectPower.average,
      ]);

      const powersInput = baseElement.querySelector(
        '#filter-magical-power-input'
      ) as Element;

      act(() => fireEvent.mouseDown(powersInput));

      const itemElement = baseElement.querySelector(
        `[data-value=${EffectPower.average}]`
      ) as Element;

      act(() => fireEvent.click(itemElement));

      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith({
        pathname: '/items',
        query: { powers: [EffectPower.strong], page: '1' },
      });
    });

    it('Selected 1 -> 0', () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/items',
        query: {
          powers: [EffectPower.none],
        },
        push,
      });

      const { baseElement } = render(
        <ThemeProvider theme={theme}>
          <FilterMagicalPower />
        </ThemeProvider>
      );

      expect(baseElement).toBeTruthy();
      expect(stateFilterMagicalPower.powers).toEqual([EffectPower.none]);

      const powersInput = baseElement.querySelector(
        '#filter-magical-power-input'
      ) as Element;

      act(() => fireEvent.mouseDown(powersInput));

      const itemElement = baseElement.querySelector(
        `[data-value=${EffectPower.none}]`
      ) as Element;

      act(() => fireEvent.click(itemElement));

      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith({
        pathname: '/items',
        query: { powers: [], page: '1' },
      });
    });
  });
});
