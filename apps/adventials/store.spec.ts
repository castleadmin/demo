import { addToCart, cartStateKey } from './cart.state';
import { addCheckoutFormData, checkoutStateKey } from './checkout.state';
import { createMockCheckoutFormData, createMockItem } from './specs/mocks';
import { store } from './store';

describe('store', () => {
  beforeEach(() => {
    localStorage.removeItem(cartStateKey);
    localStorage.removeItem(checkoutStateKey);
  });

  it('Should create store successfully', async () => {
    jest.resetModules();
    const { store } = await import('./store');

    expect(store).toBeTruthy();
  });

  it('Should persist the cart state after an update', async () => {
    expect(store.getState().cart).toEqual({ cartItems: [] });
    expect(localStorage.getItem(cartStateKey)).toBe(null);

    store.dispatch(
      addToCart({
        quantity: 2,
        item: createMockItem(),
      })
    );

    expect(store.getState().cart).toEqual({
      cartItems: [
        {
          quantity: 2,
          item: createMockItem(),
        },
      ],
    });
    expect(localStorage.getItem(cartStateKey)).toBe(
      JSON.stringify({
        cartItems: [
          {
            quantity: 2,
            item: createMockItem(),
          },
        ],
      })
    );
  });

  it('Should persist the checkout state after an update', async () => {
    expect(store.getState().checkout).toEqual({});
    expect(localStorage.getItem(checkoutStateKey)).toBe(null);

    store.dispatch(addCheckoutFormData(createMockCheckoutFormData()));

    expect(store.getState().checkout).toEqual({
      checkoutFormData: createMockCheckoutFormData(),
    });
    expect(localStorage.getItem(checkoutStateKey)).toBe(
      JSON.stringify({
        checkoutFormData: createMockCheckoutFormData(),
      })
    );
  });
});
