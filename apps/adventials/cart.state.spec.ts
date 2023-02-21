import {
  addToCart,
  cartStateKey,
  changeQuantity,
  removeAllFromCart,
  removeFromCart,
} from './cart.state';
import { createMockItem } from './specs/mocks';

describe('cart.state', () => {
  beforeEach(() => {
    localStorage.removeItem(cartStateKey);
  });

  describe('initialize', () => {
    it('Should initialize as empty array if the local storage is empty', async () => {
      jest.resetModules();
      const { store } = await import('./store');

      expect(store.getState().cart).toEqual({ cartItems: [] });
    });

    it('Should initialize from local storage', async () => {
      jest.resetModules();
      localStorage.setItem(
        cartStateKey,
        JSON.stringify({
          cartItems: [
            {
              quantity: 3,
              item: createMockItem(),
            },
          ],
        })
      );
      const { store } = await import('./store');

      expect(store.getState().cart).toEqual({
        cartItems: [
          {
            quantity: 3,
            item: createMockItem(),
          },
        ],
      });
    });

    it('Should initialize as empty array on server-side', async () => {
      jest.resetModules();
      const { environment } = await import('./environments/environment');
      environment.serverSide = {
        graphqlUrl: '',
        graphqlApiKey: '',
      };

      const { store } = await import('./store');

      expect(store.getState().cart).toEqual({
        cartItems: [],
      });
    });
  });

  describe('addToCart', () => {
    it('Should add the item to the cart', async () => {
      jest.resetModules();
      localStorage.setItem(
        cartStateKey,
        JSON.stringify({
          cartItems: [
            {
              quantity: 3,
              item: createMockItem(),
            },
          ],
        })
      );
      const { store } = await import('./store');

      expect(store.getState().cart).toEqual({
        cartItems: [
          {
            quantity: 3,
            item: createMockItem(),
          },
        ],
      });

      const item = createMockItem();
      item._id = 'addToCart123';

      store.dispatch(
        addToCart({
          quantity: 5,
          item,
        })
      );

      expect(store.getState().cart).toEqual({
        cartItems: [
          {
            quantity: 3,
            item: createMockItem(),
          },
          {
            quantity: 5,
            item,
          },
        ],
      });
    });

    it('Should increase the item quantity if it is already inside the cart', async () => {
      jest.resetModules();
      localStorage.setItem(
        cartStateKey,
        JSON.stringify({
          cartItems: [
            {
              quantity: 3,
              item: createMockItem(),
            },
          ],
        })
      );
      const { store } = await import('./store');

      expect(store.getState().cart).toEqual({
        cartItems: [
          {
            quantity: 3,
            item: createMockItem(),
          },
        ],
      });

      store.dispatch(
        addToCart({
          quantity: 5,
          item: createMockItem(),
        })
      );

      expect(store.getState().cart).toEqual({
        cartItems: [
          {
            quantity: 8,
            item: createMockItem(),
          },
        ],
      });
    });

    it('Should increase the item quantity if it is already inside the cart and limit the quantity increase to the maximal quantity', async () => {
      jest.resetModules();
      localStorage.setItem(
        cartStateKey,
        JSON.stringify({
          cartItems: [
            {
              quantity: 3,
              item: createMockItem(),
            },
          ],
        })
      );
      const { store } = await import('./store');

      expect(store.getState().cart).toEqual({
        cartItems: [
          {
            quantity: 3,
            item: createMockItem(),
          },
        ],
      });

      store.dispatch(
        addToCart({
          quantity: 18,
          item: createMockItem(),
        })
      );

      expect(store.getState().cart).toEqual({
        cartItems: [
          {
            quantity: 20,
            item: createMockItem(),
          },
        ],
      });
    });
  });

  describe('removeFromCart', () => {
    let store;
    let item;

    beforeEach(async () => {
      jest.resetModules();

      item = createMockItem();
      item._id = 'mockItem123';

      localStorage.setItem(
        cartStateKey,
        JSON.stringify({
          cartItems: [
            {
              quantity: 3,
              item: createMockItem(),
            },
            {
              quantity: 5,
              item,
            },
          ],
        })
      );
      const { store: importedStore } = await import('./store');
      store = importedStore;
    });

    it('Remove an item of the cart', () => {
      store.dispatch(
        removeFromCart({
          quantity: 3,
          item: createMockItem(),
        })
      );

      expect(store.getState().cart).toEqual({
        cartItems: [
          {
            quantity: 5,
            item,
          },
        ],
      });
    });

    it("Should throw an error if the item doesn't exist", () => {
      const fakeItem = createMockItem();
      fakeItem._id = 'ab12';

      expect(() =>
        store.dispatch(
          removeFromCart({
            quantity: 3,
            item: fakeItem,
          })
        )
      ).toThrow(Error);
    });
  });

  describe('removeAllFromCart', () => {
    it('Remove all items of the cart', async () => {
      jest.resetModules();

      const item = createMockItem();
      item._id = 'mockItem123';

      localStorage.setItem(
        cartStateKey,
        JSON.stringify({
          cartItems: [
            {
              quantity: 3,
              item: createMockItem(),
            },
            {
              quantity: 5,
              item,
            },
          ],
        })
      );
      const { store } = await import('./store');

      expect(store.getState().cart).toEqual({
        cartItems: [
          {
            quantity: 3,
            item: createMockItem(),
          },
          {
            quantity: 5,
            item,
          },
        ],
      });

      store.dispatch(removeAllFromCart());

      expect(store.getState().cart).toEqual({
        cartItems: [],
      });
    });
  });

  describe('changeQuantity', () => {
    let store;
    let item;

    beforeEach(async () => {
      jest.resetModules();

      item = createMockItem();
      item._id = 'mockItem123';

      localStorage.setItem(
        cartStateKey,
        JSON.stringify({
          cartItems: [
            {
              quantity: 3,
              item: createMockItem(),
            },
            {
              quantity: 5,
              item,
            },
          ],
        })
      );
      const { store: importedStore } = await import('./store');
      store = importedStore;
    });

    it('Change the quantity of an item of the cart', () => {
      store.dispatch(
        changeQuantity({
          quantity: 20,
          item: createMockItem(),
        })
      );

      expect(store.getState().cart).toEqual({
        cartItems: [
          {
            quantity: 20,
            item: createMockItem(),
          },
          {
            quantity: 5,
            item,
          },
        ],
      });
    });

    it("Should throw an error if the item doesn't exist", () => {
      const fakeItem = createMockItem();
      fakeItem._id = 'ab12';

      expect(() =>
        store.dispatch(
          changeQuantity({
            quantity: 7,
            item: fakeItem,
          })
        )
      ).toThrow(Error);
    });

    it('Should throw an error if the quantity is greater than the maximal quantity (20)', () => {
      expect(() =>
        store.dispatch(
          changeQuantity({
            quantity: 21,
            item: createMockItem(),
          })
        )
      ).toThrow(Error);
    });
  });
});
