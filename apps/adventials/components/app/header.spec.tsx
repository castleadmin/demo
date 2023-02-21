import { ThemeProvider } from '@mui/material';
import { act, fireEvent, render } from '@testing-library/react';
import 'next-i18next';
import { Provider } from 'react-redux';
import { addToCart, cartStateKey, removeAllFromCart } from '../../cart.state';
import { createMockItem, mockRouter } from '../../specs/mocks';
import { theme } from '../../theme';
import Header, { stateHeader } from './header';

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

describe('Header', () => {
  let store;

  beforeEach(async () => {
    jest.resetModules();
    localStorage.removeItem(cartStateKey);
    const { store: importedStore } = await import('../../store');
    store = importedStore;
  });

  it('Should render successfully', () => {
    mockRouter();

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Header />
        </Provider>
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();

    expect(stateHeader.menuOpen).toBe(false);
  });

  describe('menu', () => {
    it('Should open the menu', () => {
      mockRouter();

      const { baseElement } = render(
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <Header />
          </Provider>
        </ThemeProvider>
      );
      expect(baseElement).toBeTruthy();

      expect(stateHeader.menuOpen).toBe(false);

      const headerMenu = baseElement.querySelector('#header-menu') as Element;

      act(() => fireEvent.click(headerMenu));

      expect(stateHeader.menuOpen).toBe(true);
    });

    it('Should close the menu if the drawer is clicked', () => {
      mockRouter();

      const { baseElement } = render(
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <Header />
          </Provider>
        </ThemeProvider>
      );
      expect(baseElement).toBeTruthy();

      expect(stateHeader.menuOpen).toBe(false);

      const headerMenu = baseElement.querySelector('#header-menu') as Element;

      act(() => fireEvent.click(headerMenu));

      expect(stateHeader.menuOpen).toBe(true);

      const headerMenuDrawer = baseElement.querySelector(
        '#header-menu-drawer'
      ) as Element;

      act(() => fireEvent.click(headerMenuDrawer));

      expect(stateHeader.menuOpen).toBe(false);
    });

    it('Should close the menu if the backdrop is clicked', () => {
      mockRouter();

      const { baseElement } = render(
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <Header />
          </Provider>
        </ThemeProvider>
      );
      expect(baseElement).toBeTruthy();

      expect(stateHeader.menuOpen).toBe(false);

      const headerMenu = baseElement.querySelector('#header-menu') as Element;

      act(() => fireEvent.click(headerMenu));

      expect(stateHeader.menuOpen).toBe(true);

      const backdrops = baseElement.querySelectorAll('.MuiBackdrop-root');

      act(() => backdrops.forEach((backdrop) => fireEvent.click(backdrop)));

      expect(stateHeader.menuOpen).toBe(false);
    });
  });

  describe('cart', () => {
    it('Should open the cart', () => {
      mockRouter();

      const { baseElement } = render(
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <Header />
          </Provider>
        </ThemeProvider>
      );
      expect(baseElement).toBeTruthy();

      expect(stateHeader.cartOpen).toBe(false);

      const headerCart = baseElement.querySelector('#header-cart') as Element;

      act(() => fireEvent.click(headerCart));

      expect(stateHeader.cartOpen).toBe(true);
    });

    it('Should open the cart via the options menu', () => {
      mockRouter();

      const { baseElement } = render(
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <Header />
          </Provider>
        </ThemeProvider>
      );
      expect(baseElement).toBeTruthy();

      expect(stateHeader.cartOpen).toBe(false);
      expect(stateHeader.optionsMenuTarget).toBe(null);

      const headerOptions = baseElement.querySelector(
        '#header-options'
      ) as Element;

      act(() => fireEvent.click(headerOptions));

      expect(stateHeader.cartOpen).toBe(false);
      expect(stateHeader.optionsMenuTarget).toBeTruthy();

      const cartOptions = baseElement.querySelector(
        '#header-options-cart'
      ) as Element;

      act(() => fireEvent.click(cartOptions));

      expect(stateHeader.cartOpen).toBe(true);
      expect(stateHeader.optionsMenuTarget).toBe(null);
    });

    it('Should open the cart if an item is added to the cart', () => {
      mockRouter();

      const { baseElement } = render(
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <Header />
          </Provider>
        </ThemeProvider>
      );

      expect(baseElement).toBeTruthy();
      expect(stateHeader.cartOpen).toBe(false);
      expect(store.getState().cart).toEqual({
        cartItems: [],
      });

      act(() =>
        store.dispatch(
          addToCart({
            quantity: 3,
            item: createMockItem(),
          })
        )
      );

      expect(stateHeader.cartOpen).toBe(true);
      expect(store.getState().cart).toEqual({
        cartItems: [
          {
            quantity: 3,
            item: createMockItem(),
          },
        ],
      });
    });

    it("Shouldn't open the cart if all items are removed", () => {
      mockRouter();

      act(() =>
        store.dispatch(
          addToCart({
            quantity: 3,
            item: createMockItem(),
          })
        )
      );

      const { baseElement } = render(
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <Header />
          </Provider>
        </ThemeProvider>
      );

      expect(baseElement).toBeTruthy();
      expect(stateHeader.cartOpen).toBe(false);
      expect(store.getState().cart).toEqual({
        cartItems: [
          {
            quantity: 3,
            item: createMockItem(),
          },
        ],
      });

      act(() => store.dispatch(removeAllFromCart()));

      expect(stateHeader.cartOpen).toBe(false);
      expect(store.getState().cart).toEqual({
        cartItems: [],
      });
    });

    it('Should open the cart if the quantity of an item is changed', () => {
      mockRouter();

      act(() =>
        store.dispatch(
          addToCart({
            quantity: 3,
            item: createMockItem(),
          })
        )
      );

      const { baseElement } = render(
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <Header />
          </Provider>
        </ThemeProvider>
      );

      expect(baseElement).toBeTruthy();
      expect(stateHeader.cartOpen).toBe(false);
      expect(store.getState().cart).toEqual({
        cartItems: [
          {
            quantity: 3,
            item: createMockItem(),
          },
        ],
      });

      act(() =>
        store.dispatch(
          addToCart({
            quantity: 2,
            item: createMockItem(),
          })
        )
      );

      expect(stateHeader.cartOpen).toBe(true);
      expect(store.getState().cart).toEqual({
        cartItems: [
          {
            quantity: 5,
            item: createMockItem(),
          },
        ],
      });
    });

    it('Should close the cart if the drawer is clicked', () => {
      mockRouter();

      const { baseElement } = render(
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <Header />
          </Provider>
        </ThemeProvider>
      );
      expect(baseElement).toBeTruthy();

      expect(stateHeader.cartOpen).toBe(false);

      const headerCart = baseElement.querySelector('#header-cart') as Element;

      act(() => fireEvent.click(headerCart));

      expect(stateHeader.cartOpen).toBe(true);

      const headerCartDrawer = baseElement.querySelector(
        '#header-cart-drawer'
      ) as Element;

      act(() => fireEvent.click(headerCartDrawer));

      expect(stateHeader.cartOpen).toBe(false);
    });

    it('Should close the cart if the backdrop is clicked', () => {
      mockRouter();

      const { baseElement } = render(
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <Header />
          </Provider>
        </ThemeProvider>
      );
      expect(baseElement).toBeTruthy();

      expect(stateHeader.cartOpen).toBe(false);

      const headerCart = baseElement.querySelector('#header-cart') as Element;

      act(() => fireEvent.click(headerCart));

      expect(stateHeader.cartOpen).toBe(true);

      const backdrops = baseElement.querySelectorAll('.MuiBackdrop-root');

      act(() => backdrops.forEach((backdrop) => fireEvent.click(backdrop)));

      expect(stateHeader.cartOpen).toBe(false);
    });
  });

  describe('language', () => {
    it('Should choose de via the language menu', () => {
      const push = jest.fn();
      mockRouter({
        asPath: '/items',
        push,
      });

      const { baseElement } = render(
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <Header />
          </Provider>
        </ThemeProvider>
      );
      expect(baseElement).toBeTruthy();

      expect(push).toHaveBeenCalledTimes(0);
      expect(stateHeader.languageMenuTarget).toBe(null);

      const headerLanguage = baseElement.querySelector(
        '#header-language'
      ) as Element;

      act(() => fireEvent.click(headerLanguage));

      expect(push).toHaveBeenCalledTimes(0);
      expect(stateHeader.languageMenuTarget).toBeTruthy();

      const de = baseElement.querySelector(
        '#header-language-menu-de'
      ) as Element;

      act(() => fireEvent.click(de));

      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(expect.anything(), expect.anything(), {
        locale: 'de',
      });
      expect(stateHeader.languageMenuTarget).toBe(null);
    });

    it('Should choose en-US via the language menu', () => {
      const push = jest.fn();
      mockRouter({
        asPath: '/items',
        push,
      });

      const { baseElement } = render(
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <Header />
          </Provider>
        </ThemeProvider>
      );
      expect(baseElement).toBeTruthy();

      expect(push).toHaveBeenCalledTimes(0);
      expect(stateHeader.languageMenuTarget).toBe(null);

      const headerLanguage = baseElement.querySelector(
        '#header-language'
      ) as Element;

      act(() => fireEvent.click(headerLanguage));

      expect(push).toHaveBeenCalledTimes(0);
      expect(stateHeader.languageMenuTarget).toBeTruthy();

      const enUs = baseElement.querySelector(
        '#header-language-menu-en-us'
      ) as Element;

      act(() => fireEvent.click(enUs));

      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(expect.anything(), expect.anything(), {
        locale: 'en-US',
      });
      expect(stateHeader.languageMenuTarget).toBe(null);
    });

    it('Should choose de via the options menu', () => {
      const push = jest.fn();
      mockRouter({
        asPath: '/items',
        push,
      });

      const { baseElement } = render(
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <Header />
          </Provider>
        </ThemeProvider>
      );
      expect(baseElement).toBeTruthy();

      expect(push).toHaveBeenCalledTimes(0);
      expect(stateHeader.optionsMenuTarget).toBe(null);

      const headerOptions = baseElement.querySelector(
        '#header-options'
      ) as Element;

      act(() => fireEvent.click(headerOptions));

      expect(push).toHaveBeenCalledTimes(0);
      expect(stateHeader.optionsMenuTarget).toBeTruthy();

      const de = baseElement.querySelector(
        '#header-options-language-de'
      ) as Element;

      act(() => fireEvent.click(de));

      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(expect.anything(), expect.anything(), {
        locale: 'de',
      });
      expect(stateHeader.optionsMenuTarget).toBe(null);
    });

    it('Should choose en-US via the options menu', () => {
      const push = jest.fn();
      mockRouter({
        asPath: '/items',
        push,
      });

      const { baseElement } = render(
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <Header />
          </Provider>
        </ThemeProvider>
      );
      expect(baseElement).toBeTruthy();

      expect(push).toHaveBeenCalledTimes(0);
      expect(stateHeader.optionsMenuTarget).toBe(null);

      const headerOptions = baseElement.querySelector(
        '#header-options'
      ) as Element;

      act(() => fireEvent.click(headerOptions));

      expect(push).toHaveBeenCalledTimes(0);
      expect(stateHeader.optionsMenuTarget).toBeTruthy();

      const enUs = baseElement.querySelector(
        '#header-options-language-en-us'
      ) as Element;

      act(() => fireEvent.click(enUs));

      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(expect.anything(), expect.anything(), {
        locale: 'en-US',
      });
      expect(stateHeader.optionsMenuTarget).toBe(null);
    });
  });

  describe('options', () => {
    it('Should open and close the options menu', () => {
      mockRouter();

      const { baseElement } = render(
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <Header />
          </Provider>
        </ThemeProvider>
      );

      expect(baseElement).toBeTruthy();
      expect(stateHeader.optionsMenuTarget).toBe(null);

      const headerOptions = baseElement.querySelector(
        '#header-options'
      ) as Element;

      act(() => fireEvent.click(headerOptions));

      expect(stateHeader.optionsMenuTarget).toBeTruthy();

      const backdrops = baseElement.querySelectorAll('.MuiBackdrop-root');

      act(() => backdrops.forEach((backdrop) => fireEvent.click(backdrop)));

      expect(stateHeader.optionsMenuTarget).toBe(null);
    });
  });

  it('Should navigate to checkout page', () => {
    const push = jest.fn();
    mockRouter({
      push,
    });

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Header />
        </Provider>
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();

    expect(stateHeader.cartOpen).toBe(false);

    act(() =>
      store.dispatch(
        addToCart({
          quantity: 3,
          item: createMockItem(),
        })
      )
    );

    expect(stateHeader.cartOpen).toBe(true);
    expect(push).toHaveBeenCalledTimes(0);

    act(() =>
      fireEvent.click(
        baseElement.querySelector('#shopping-cart-checkout-button') as Element
      )
    );

    expect(stateHeader.cartOpen).toBe(false);
    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith({ pathname: '/checkout', query: {} });
  });
});
