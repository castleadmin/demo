import { PriceService } from '@castleadmin/checkout-domain';
import { ThemeProvider } from '@mui/material';
import { act, fireEvent, render } from '@testing-library/react';
import 'next-i18next';
import { Provider } from 'react-redux';
import { cartStateKey } from '../../cart.state';
import { createMockItem, mockRouter } from '../../specs/mocks';
import { store } from '../../store';
import { theme } from '../../theme';
import ShoppingCartEditItem from './shopping-cart-edit-item';

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

describe('ShoppingCartEditItem', () => {
  it('Should render successfully if the item is in stock', () => {
    mockRouter();

    const cartItem = { quantity: 3, item: createMockItem() };
    const onEditComplete = jest.fn();

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <ShoppingCartEditItem
            cartItem={cartItem}
            onEditComplete={onEditComplete}
          />
        </Provider>
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(
      baseElement.querySelector<HTMLElement>('.is-in-stock span')?.textContent
    ).toBe('inStock');
  });

  it("Should render successfully if the item isn't in stock", () => {
    mockRouter();

    const cartItem = { quantity: 3, item: createMockItem() };
    cartItem.item.isInStock = false;
    const onEditComplete = jest.fn();

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <ShoppingCartEditItem
            cartItem={cartItem}
            onEditComplete={onEditComplete}
          />
        </Provider>
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(
      baseElement.querySelector<HTMLElement>('.is-in-stock span')?.textContent
    ).toBe('notInStock');
  });

  it('Should change the item quantity successfully', async () => {
    mockRouter();

    const cartItem = { quantity: 3, item: createMockItem() };
    const cartItems = { cartItems: [cartItem] };
    jest.resetModules();
    localStorage.removeItem(cartStateKey);
    localStorage.setItem(cartStateKey, JSON.stringify(cartItems));
    const { store } = await import('../../store');
    const onEditComplete = jest.fn();

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <ShoppingCartEditItem
            cartItem={cartItem}
            onEditComplete={onEditComplete}
          />
        </Provider>
      </ThemeProvider>
    );
    const getItemsTotalPriceEurStringSpy = jest.spyOn(
      PriceService,
      'getItemsTotalPriceEurString'
    );

    expect(baseElement).toBeTruthy();
    expect(store.getState().cart).toEqual({
      cartItems: [{ quantity: 3, item: createMockItem() }],
    });
    expect(getItemsTotalPriceEurStringSpy).toHaveBeenCalledTimes(0);

    act(() =>
      fireEvent.mouseDown(
        baseElement.querySelector(
          '#shopping-cart-edit-item-quantity'
        ) as Element
      )
    );

    act(() =>
      fireEvent.click(baseElement.querySelector('[data-value="14"]') as Element)
    );

    expect(store.getState().cart).toEqual({
      cartItems: [{ quantity: 14, item: createMockItem() }],
    });
    expect(getItemsTotalPriceEurStringSpy).toHaveBeenCalledTimes(1);
  });

  it('Should delete the cart item', async () => {
    mockRouter();

    const cartItem = { quantity: 3, item: createMockItem() };
    const cartItems = { cartItems: [cartItem] };
    jest.resetModules();
    localStorage.removeItem(cartStateKey);
    localStorage.setItem(cartStateKey, JSON.stringify(cartItems));
    const { store } = await import('../../store');
    const onEditComplete = jest.fn();

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <ShoppingCartEditItem
            cartItem={cartItem}
            onEditComplete={onEditComplete}
          />
        </Provider>
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(store.getState().cart).toEqual({
      cartItems: [{ quantity: 3, item: createMockItem() }],
    });
    expect(onEditComplete).toHaveBeenCalledTimes(0);

    act(() =>
      fireEvent.click(baseElement.querySelector('.header button') as Element)
    );

    expect(store.getState().cart).toEqual({
      cartItems: [],
    });
    expect(onEditComplete).toHaveBeenCalledTimes(1);
  });

  it('Should navigate back to the shopping cart', () => {
    mockRouter();

    const cartItem = { quantity: 3, item: createMockItem() };
    const onEditComplete = jest.fn();

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <ShoppingCartEditItem
            cartItem={cartItem}
            onEditComplete={onEditComplete}
          />
        </Provider>
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(onEditComplete).toHaveBeenCalledTimes(0);

    act(() =>
      fireEvent.click(
        baseElement.querySelector('.back-to-cart button') as Element
      )
    );

    expect(onEditComplete).toHaveBeenCalledTimes(1);
  });
});
