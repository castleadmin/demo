import {
  addCheckoutFormData,
  checkoutStateKey,
  removeCheckoutFormData,
} from './checkout.state';
import { createMockCheckoutFormData } from './specs/mocks';

describe('checkout.state', () => {
  beforeEach(() => {
    localStorage.removeItem(checkoutStateKey);
  });

  describe('initialize', () => {
    it('Should initialize as empty object if the local storage is empty', async () => {
      jest.resetModules();
      const { store } = await import('./store');

      expect(store.getState().checkout).toEqual({});
    });

    it('Should initialize from local storage', async () => {
      jest.resetModules();
      localStorage.setItem(
        checkoutStateKey,
        JSON.stringify({
          checkoutFormData: createMockCheckoutFormData(),
        })
      );
      const { store } = await import('./store');

      expect(store.getState().checkout).toEqual({
        checkoutFormData: createMockCheckoutFormData(),
      });
    });

    it('Should initialize as empty object on server-side', async () => {
      jest.resetModules();
      const { environment } = await import('./environments/environment');
      environment.serverSide = {
        graphqlUrl: '',
        graphqlApiKey: '',
      };

      const { store } = await import('./store');

      expect(store.getState().checkout).toEqual({});
    });
  });

  describe('addCheckoutFormData', () => {
    it('Should add the checkout form data to the state', async () => {
      jest.resetModules();
      localStorage.setItem(checkoutStateKey, JSON.stringify({}));
      const { store } = await import('./store');

      expect(store.getState().checkout).toEqual({});

      const formData = createMockCheckoutFormData();

      store.dispatch(addCheckoutFormData(formData));

      expect(store.getState().checkout).toEqual({
        checkoutFormData: formData,
      });
    });

    it('Should replace the checkout form data inside the state', async () => {
      jest.resetModules();
      localStorage.setItem(
        checkoutStateKey,
        JSON.stringify({
          checkoutFormData: createMockCheckoutFormData(),
        })
      );
      const { store } = await import('./store');

      expect(store.getState().checkout).toEqual({
        checkoutFormData: createMockCheckoutFormData(),
      });

      const formData = createMockCheckoutFormData();
      formData.firstName = 'Heinz';

      store.dispatch(addCheckoutFormData(formData));

      expect(store.getState().checkout).toEqual({
        checkoutFormData: formData,
      });
    });
  });

  describe('removeFromCheckout', () => {
    it('Should remove the checkout form data from the state', async () => {
      jest.resetModules();
      localStorage.setItem(
        checkoutStateKey,
        JSON.stringify({
          checkoutFormData: createMockCheckoutFormData(),
        })
      );
      const { store } = await import('./store');

      expect(store.getState().checkout).toEqual({
        checkoutFormData: createMockCheckoutFormData(),
      });

      store.dispatch(removeCheckoutFormData());

      expect(store.getState().checkout).toEqual({});
    });
  });
});
