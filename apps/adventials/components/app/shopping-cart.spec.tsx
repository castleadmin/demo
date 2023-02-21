import { ThemeProvider } from '@mui/material';
import { act, fireEvent, render } from '@testing-library/react';
import 'next-i18next';
import { Provider } from 'react-redux';
import { cartStateKey } from '../../cart.state';
import { createMockItem, mockRouter } from '../../specs/mocks';
import { theme } from '../../theme';
import ShoppingCart, { stateShoppingCart } from './shopping-cart';

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

describe('ShoppingCart', () => {
  let store;

  beforeEach(async () => {
    const cartItem1 = { quantity: 3, item: createMockItem() };
    cartItem1.item._id = 'item1';
    const cartItem2 = { quantity: 5, item: createMockItem() };
    cartItem2.item._id = 'item2';
    cartItem2.item.isInStock = false;
    const cartItems = { cartItems: [cartItem1, cartItem2] };
    jest.resetModules();
    localStorage.removeItem(cartStateKey);
    localStorage.setItem(cartStateKey, JSON.stringify(cartItems));
    const { store: importedStore } = await import('../../store');
    store = importedStore;
  });

  it('Should render successfully if an item is in stock', () => {
    mockRouter();
    const onCheckout = jest.fn();

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <ShoppingCart onCheckout={onCheckout} />
        </Provider>
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(
      baseElement.querySelector<HTMLElement>(
        `#shopping-cart-is-in-stock-${
          store.getState().cart.cartItems[0].item._id
        }`
      )?.textContent
    ).toBe('inStock');
  });

  it("Should render successfully if an item isn't in stock", () => {
    mockRouter();
    const onCheckout = jest.fn();

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <ShoppingCart onCheckout={onCheckout} />
        </Provider>
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(
      baseElement.querySelector<HTMLElement>(
        `#shopping-cart-is-in-stock-${
          store.getState().cart.cartItems[1].item._id
        }`
      )?.textContent
    ).toBe('notInStock');
  });

  it('Should trigger the checkout', () => {
    mockRouter();
    const onCheckout = jest.fn();

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <ShoppingCart onCheckout={onCheckout} />
        </Provider>
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(onCheckout).toHaveBeenCalledTimes(0);

    act(() =>
      fireEvent.click(
        baseElement.querySelector('#shopping-cart-checkout-button') as Element
      )
    );

    expect(onCheckout).toHaveBeenCalledTimes(1);
  });

  it("Shouldn't trigger the checkout if empty", async () => {
    jest.resetModules();
    localStorage.removeItem(cartStateKey);
    const { store } = await import('../../store');

    mockRouter();
    const onCheckout = jest.fn();

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <ShoppingCart onCheckout={onCheckout} />
        </Provider>
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(onCheckout).toHaveBeenCalledTimes(0);

    act(() =>
      fireEvent.click(
        baseElement.querySelector('#shopping-cart-checkout-button') as Element
      )
    );

    expect(onCheckout).toHaveBeenCalledTimes(0);
  });

  it('Should trigger cart item edit', () => {
    mockRouter();
    const onCheckout = jest.fn();

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <ShoppingCart onCheckout={onCheckout} />
        </Provider>
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(stateShoppingCart.editCartItem).toBe(undefined);

    act(() =>
      fireEvent.click(
        baseElement.querySelector(
          `#shopping-cart-edit-item-${
            store.getState().cart.cartItems[1].item._id
          }`
        ) as Element
      )
    );

    expect(stateShoppingCart.editCartItem).toBe(
      store.getState().cart.cartItems[1]
    );
  });

  it('Should trigger cart item edit and navigate back to the shopping cart', () => {
    mockRouter();
    const onCheckout = jest.fn();

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <ShoppingCart onCheckout={onCheckout} />
        </Provider>
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(stateShoppingCart.editCartItem).toBe(undefined);

    act(() =>
      fireEvent.click(
        baseElement.querySelector(
          `#shopping-cart-edit-item-${
            store.getState().cart.cartItems[1].item._id
          }`
        ) as Element
      )
    );

    expect(stateShoppingCart.editCartItem).toBe(
      store.getState().cart.cartItems[1]
    );

    act(() =>
      fireEvent.click(
        baseElement.querySelector(
          `#shopping-cart-edit-item-back-to-cart`
        ) as Element
      )
    );

    expect(stateShoppingCart.editCartItem).toBe(undefined);
  });
});
