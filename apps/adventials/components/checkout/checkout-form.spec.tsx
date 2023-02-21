import {
  Country,
  PaymentMethod,
  ShippingOption,
} from '@castleadmin/checkout-domain';
import { ThemeProvider } from '@mui/material';
import { act, fireEvent, render } from '@testing-library/react';
import 'next-i18next';
import { Provider } from 'react-redux';
import 'uuid';
import { checkoutStateKey } from '../../checkout.state';
import { createMockCheckoutFormData, mockRouter } from '../../specs/mocks';
import { theme } from '../../theme';
import CheckoutForm, {
  formStateCheckoutForm,
  setValueCheckoutForm,
} from './checkout-form';

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

jest.mock('uuid', () => {
  const originalModule = jest.requireActual('uuid');

  return {
    __esModule: true,
    ...originalModule,
    v4: jest.fn(() => '1234-5678'),
  };
});

describe('CheckoutForm', () => {
  let store;

  beforeEach(async () => {
    jest.resetModules();
    localStorage.removeItem(checkoutStateKey);
    const { store: importedStore } = await import('../../store');
    store = importedStore;
  });

  it('Should render successfully', () => {
    mockRouter({
      pathname: '/checkout',
    });

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <CheckoutForm />
        </Provider>
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
  });

  it('Should issue errors for the required fields on submit', async () => {
    const push = jest.fn();
    mockRouter({
      pathname: '/checkout',
      push,
    });

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <CheckoutForm />
        </Provider>
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(formStateCheckoutForm.submitCount).toBe(0);
    expect(formStateCheckoutForm.errors).toEqual({});
    expect(store.getState().checkout).toEqual({});
    expect(push).toHaveBeenCalledTimes(0);

    await act(() =>
      fireEvent.submit(baseElement.querySelector('.checkout-form') as Element)
    );

    expect(formStateCheckoutForm.submitCount).toBe(1);

    expect(formStateCheckoutForm.errors.firstName).toBeTruthy();
    expect(formStateCheckoutForm.errors.lastName).toBeTruthy();
    expect(formStateCheckoutForm.errors.emailAddress).toBeTruthy();
    expect(formStateCheckoutForm.errors.businessName).toBeFalsy();
    expect(formStateCheckoutForm.errors.streetAddress).toBeTruthy();
    expect(formStateCheckoutForm.errors.zipCode).toBeTruthy();
    expect(formStateCheckoutForm.errors.city).toBeTruthy();
    expect(formStateCheckoutForm.errors.country).toBeFalsy();
    expect(formStateCheckoutForm.errors.paymentMethod).toBeFalsy();
    expect(formStateCheckoutForm.errors.shippingOption).toBeFalsy();
    expect(formStateCheckoutForm.errors.privacyPolicy).toBeTruthy();

    expect(store.getState().checkout).toEqual({});
    expect(push).toHaveBeenCalledTimes(0);
  });

  it('Should submit the filled out form', async () => {
    const push = jest.fn();
    mockRouter({
      pathname: '/checkout',
      push,
    });

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <CheckoutForm />
        </Provider>
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(formStateCheckoutForm.submitCount).toBe(0);
    expect(formStateCheckoutForm.errors).toEqual({});
    expect(store.getState().checkout).toEqual({});
    expect(push).toHaveBeenCalledTimes(0);

    const mockFormData = createMockCheckoutFormData();

    await act(() =>
      setValueCheckoutForm('firstName', mockFormData.firstName, {
        shouldValidate: true,
      })
    );
    await act(() =>
      setValueCheckoutForm('lastName', mockFormData.lastName, {
        shouldValidate: true,
      })
    );
    await act(() =>
      setValueCheckoutForm('emailAddress', mockFormData.emailAddress, {
        shouldValidate: true,
      })
    );
    await act(() =>
      setValueCheckoutForm('businessName', mockFormData.businessName, {
        shouldValidate: true,
      })
    );
    await act(() =>
      setValueCheckoutForm('streetAddress', mockFormData.streetAddress, {
        shouldValidate: true,
      })
    );
    await act(() =>
      setValueCheckoutForm('zipCode', mockFormData.zipCode, {
        shouldValidate: true,
      })
    );
    await act(() =>
      setValueCheckoutForm('city', mockFormData.city, { shouldValidate: true })
    );
    await act(() =>
      setValueCheckoutForm('country', mockFormData.country, {
        shouldValidate: true,
      })
    );
    await act(() =>
      setValueCheckoutForm('paymentMethod', mockFormData.paymentMethod, {
        shouldValidate: true,
      })
    );
    await act(() =>
      setValueCheckoutForm('shippingOption', mockFormData.shippingOption, {
        shouldValidate: true,
      })
    );
    await act(() =>
      setValueCheckoutForm('privacyPolicy', true, { shouldValidate: true })
    );

    await act(() =>
      fireEvent.submit(baseElement.querySelector('.checkout-form') as Element)
    );

    expect(formStateCheckoutForm.submitCount).toBe(0);
    expect(formStateCheckoutForm.errors).toEqual({});
    expect(store.getState().checkout).toEqual({
      checkoutFormData: mockFormData,
    });
    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith({
      pathname: '/checkout/1234-5678',
      query: {},
    });
  });

  it('Should submit the filled out form after a first unsuccessful attempt', async () => {
    const push = jest.fn();
    mockRouter({
      pathname: '/checkout',
      push,
    });

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <CheckoutForm />
        </Provider>
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(formStateCheckoutForm.submitCount).toBe(0);
    expect(formStateCheckoutForm.errors).toEqual({});
    expect(store.getState().checkout).toEqual({});
    expect(push).toHaveBeenCalledTimes(0);

    await act(() =>
      fireEvent.submit(baseElement.querySelector('.checkout-form') as Element)
    );

    expect(formStateCheckoutForm.submitCount).toBe(1);
    expect(formStateCheckoutForm.errors).not.toEqual({});
    expect(store.getState().checkout).toEqual({});
    expect(push).toHaveBeenCalledTimes(0);

    const mockFormData = createMockCheckoutFormData();

    await act(() =>
      setValueCheckoutForm('firstName', mockFormData.firstName, {
        shouldValidate: true,
      })
    );
    await act(() =>
      setValueCheckoutForm('lastName', mockFormData.lastName, {
        shouldValidate: true,
      })
    );
    await act(() =>
      setValueCheckoutForm('emailAddress', mockFormData.emailAddress, {
        shouldValidate: true,
      })
    );
    await act(() =>
      setValueCheckoutForm('businessName', mockFormData.businessName, {
        shouldValidate: true,
      })
    );
    await act(() =>
      setValueCheckoutForm('streetAddress', mockFormData.streetAddress, {
        shouldValidate: true,
      })
    );
    await act(() =>
      setValueCheckoutForm('zipCode', mockFormData.zipCode, {
        shouldValidate: true,
      })
    );
    await act(() =>
      setValueCheckoutForm('city', mockFormData.city, { shouldValidate: true })
    );
    await act(() =>
      setValueCheckoutForm('country', mockFormData.country, {
        shouldValidate: true,
      })
    );
    await act(() =>
      setValueCheckoutForm('paymentMethod', mockFormData.paymentMethod, {
        shouldValidate: true,
      })
    );
    await act(() =>
      setValueCheckoutForm('shippingOption', mockFormData.shippingOption, {
        shouldValidate: true,
      })
    );
    await act(() =>
      setValueCheckoutForm('privacyPolicy', true, { shouldValidate: true })
    );

    await act(() =>
      fireEvent.submit(baseElement.querySelector('.checkout-form') as Element)
    );

    expect(formStateCheckoutForm.submitCount).toBe(0);
    expect(formStateCheckoutForm.errors).toEqual({});
    expect(store.getState().checkout).toEqual({
      checkoutFormData: mockFormData,
    });
    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith({
      pathname: '/checkout/1234-5678',
      query: {},
    });
  });

  it('Should submit the filled out form without optional values and locale en-US', async () => {
    const push = jest.fn();
    mockRouter({
      pathname: '/checkout',
      locale: 'en-US',
      push,
    });

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <CheckoutForm />
        </Provider>
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(formStateCheckoutForm.submitCount).toBe(0);
    expect(formStateCheckoutForm.errors).toEqual({});
    expect(store.getState().checkout).toEqual({});
    expect(push).toHaveBeenCalledTimes(0);

    const mockFormData = createMockCheckoutFormData();

    await act(() =>
      setValueCheckoutForm('firstName', mockFormData.firstName, {
        shouldValidate: true,
      })
    );
    await act(() =>
      setValueCheckoutForm('lastName', mockFormData.lastName, {
        shouldValidate: true,
      })
    );
    await act(() =>
      setValueCheckoutForm('emailAddress', mockFormData.emailAddress, {
        shouldValidate: true,
      })
    );
    await act(() =>
      setValueCheckoutForm('streetAddress', mockFormData.streetAddress, {
        shouldValidate: true,
      })
    );
    await act(() =>
      setValueCheckoutForm('zipCode', mockFormData.zipCode, {
        shouldValidate: true,
      })
    );
    await act(() =>
      setValueCheckoutForm('city', mockFormData.city, { shouldValidate: true })
    );
    await act(() =>
      setValueCheckoutForm('privacyPolicy', true, { shouldValidate: true })
    );

    await act(() =>
      fireEvent.submit(baseElement.querySelector('.checkout-form') as Element)
    );

    expect(formStateCheckoutForm.submitCount).toBe(0);
    expect(formStateCheckoutForm.errors).toEqual({});
    expect(store.getState().checkout).toEqual({
      checkoutFormData: {
        ...mockFormData,
        businessName: '',
        country: Country.UnitedStates,
        paymentMethod: PaymentMethod.playMoney,
        shippingOption: ShippingOption.standard,
      },
    });
    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith({
      pathname: '/checkout/1234-5678',
      query: {},
    });
  });

  it('Should submit the filled out form without optional values and locale de', async () => {
    const push = jest.fn();
    mockRouter({
      pathname: '/checkout',
      locale: 'de',
      push,
    });

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <CheckoutForm />
        </Provider>
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(formStateCheckoutForm.submitCount).toBe(0);
    expect(formStateCheckoutForm.errors).toEqual({});
    expect(store.getState().checkout).toEqual({});
    expect(push).toHaveBeenCalledTimes(0);

    const mockFormData = createMockCheckoutFormData();

    await act(() =>
      setValueCheckoutForm('firstName', mockFormData.firstName, {
        shouldValidate: true,
      })
    );
    await act(() =>
      setValueCheckoutForm('lastName', mockFormData.lastName, {
        shouldValidate: true,
      })
    );
    await act(() =>
      setValueCheckoutForm('emailAddress', mockFormData.emailAddress, {
        shouldValidate: true,
      })
    );
    await act(() =>
      setValueCheckoutForm('streetAddress', mockFormData.streetAddress, {
        shouldValidate: true,
      })
    );
    await act(() =>
      setValueCheckoutForm('zipCode', mockFormData.zipCode, {
        shouldValidate: true,
      })
    );
    await act(() =>
      setValueCheckoutForm('city', mockFormData.city, { shouldValidate: true })
    );
    await act(() =>
      setValueCheckoutForm('privacyPolicy', true, { shouldValidate: true })
    );

    await act(() =>
      fireEvent.submit(baseElement.querySelector('.checkout-form') as Element)
    );

    expect(formStateCheckoutForm.submitCount).toBe(0);
    expect(formStateCheckoutForm.errors).toEqual({});
    expect(store.getState().checkout).toEqual({
      checkoutFormData: {
        ...mockFormData,
        businessName: '',
        country: Country.Germany,
        paymentMethod: PaymentMethod.playMoney,
        shippingOption: ShippingOption.standard,
      },
    });
    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith({
      pathname: '/checkout/1234-5678',
      query: {},
    });
  });

  it('Should issue an error if the email @ sign is missing', async () => {
    const push = jest.fn();
    mockRouter({
      pathname: '/checkout',
      push,
    });

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <CheckoutForm />
        </Provider>
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(formStateCheckoutForm.submitCount).toBe(0);
    expect(formStateCheckoutForm.errors).toEqual({});
    expect(store.getState().checkout).toEqual({});
    expect(push).toHaveBeenCalledTimes(0);

    await act(() =>
      setValueCheckoutForm('emailAddress', 'testabc.com', {
        shouldValidate: true,
      })
    );

    await act(() =>
      fireEvent.submit(baseElement.querySelector('.checkout-form') as Element)
    );

    expect(formStateCheckoutForm.submitCount).toBe(1);
    expect(formStateCheckoutForm.errors.emailAddress).toBeTruthy();
    expect(store.getState().checkout).toEqual({});
    expect(push).toHaveBeenCalledTimes(0);
  });

  it('Should issue an error if the email domain is missing', async () => {
    const push = jest.fn();
    mockRouter({
      pathname: '/checkout',
      push,
    });

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <CheckoutForm />
        </Provider>
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(formStateCheckoutForm.submitCount).toBe(0);
    expect(formStateCheckoutForm.errors).toEqual({});
    expect(store.getState().checkout).toEqual({});
    expect(push).toHaveBeenCalledTimes(0);

    await act(() =>
      setValueCheckoutForm('emailAddress', 'test@abc', { shouldValidate: true })
    );

    await act(() =>
      fireEvent.submit(baseElement.querySelector('.checkout-form') as Element)
    );

    expect(formStateCheckoutForm.submitCount).toBe(1);
    expect(formStateCheckoutForm.errors.emailAddress).toBeTruthy();
    expect(store.getState().checkout).toEqual({});
    expect(push).toHaveBeenCalledTimes(0);
  });
});
