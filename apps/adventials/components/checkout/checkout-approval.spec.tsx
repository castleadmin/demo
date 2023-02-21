import { Language } from '@castleadmin/checkout-domain';
import { ThemeProvider } from '@mui/material';
import { act, fireEvent, render, RenderResult } from '@testing-library/react';
import 'next-i18next';
import { Provider } from 'react-redux';
import {
  ApproveCheckoutRequest,
  CheckoutResponse,
  RejectCheckoutRequest,
} from '../../api';
import { cartStateKey } from '../../cart.state';
import { toDeliveryDateOrder } from '../../checkout';
import { requestCheckout } from '../../checkout-request';
import { checkoutStateKey } from '../../checkout.state';
import {
  createMockApprovalOrder,
  createMockCheckoutFormData,
  createMockItem,
  mockRouter,
} from '../../specs/mocks';
import { theme } from '../../theme';
import CheckoutApproval, { stateCheckoutApproval } from './checkout-approval';

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

jest.mock('../../checkout-request', () => {
  const originalModule = jest.requireActual('../../checkout-request');

  return {
    __esModule: true,
    ...originalModule,
    requestCheckout: jest.fn(),
  };
});

const checkoutResponse: CheckoutResponse = {
  transactionId: '1234-5678',
  token: 'a123',
  approvalOrder: createMockApprovalOrder(),
};
const deliveryDateOrderEnUs = toDeliveryDateOrder(
  checkoutResponse.approvalOrder,
  Language.enUs
);

const isLoadingStateMock = {
  isLoading: true,
  error: undefined,
  response: undefined,
  deliveryDateOrder: undefined,
  isCompleted: false,
};

const responseStateMock = {
  isLoading: false,
  error: undefined,
  response: checkoutResponse,
  deliveryDateOrder: deliveryDateOrderEnUs,
  isCompleted: false,
};

const errorStateMock = {
  isLoading: false,
  error: new Error('test'),
  response: undefined,
  deliveryDateOrder: undefined,
  isCompleted: false,
};

const isCompletedStateMock = {
  isLoading: false,
  error: undefined,
  response: checkoutResponse,
  deliveryDateOrder: deliveryDateOrderEnUs,
  isCompleted: true,
};

function mockRequestCheckout(response: CheckoutResponse) {
  const requestCheckoutMock = requestCheckout as jest.MockedFunction<
    typeof requestCheckout
  >;
  requestCheckoutMock.mockClear();
  requestCheckoutMock.mockImplementation(
    () =>
      // eslint-disable-next-line no-async-promise-executor
      new Promise(async (resolve) => {
        await new Promise((innerResolve) => setTimeout(innerResolve, 100));

        resolve(response);
      })
  );

  return requestCheckoutMock;
}

function mockFetchResponse(response: Response) {
  const fetchSpy = jest.spyOn(window, 'fetch');
  fetchSpy.mockClear();
  fetchSpy.mockImplementation(
    () =>
      // eslint-disable-next-line no-async-promise-executor
      new Promise(async (resolve) => {
        await new Promise((innerResolve) => setTimeout(innerResolve, 100));

        resolve(response);
      })
  );

  return fetchSpy;
}

function mockRequestCheckoutError() {
  const requestCheckoutMock = requestCheckout as jest.MockedFunction<
    typeof requestCheckout
  >;
  requestCheckoutMock.mockClear();
  requestCheckoutMock.mockImplementation(
    () =>
      // eslint-disable-next-line no-async-promise-executor
      new Promise(async (_, reject) => {
        await new Promise((innerResolve) => setTimeout(innerResolve, 100));

        reject(new Error('test'));
      })
  );

  return requestCheckoutMock;
}

async function createRenderResult(store): Promise<RenderResult> {
  let renderResult: RenderResult = undefined as unknown as RenderResult;

  await act(() => {
    renderResult = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <CheckoutApproval transactionId="1234-5678" />
        </Provider>
      </ThemeProvider>
    );
  });

  if (!renderResult) {
    throw new Error('render result is undefined');
  }

  return renderResult;
}

describe('CheckoutApproval', () => {
  let store;

  beforeEach(async () => {
    jest.useFakeTimers();
    jest.resetModules();
    localStorage.removeItem(cartStateKey);
    localStorage.removeItem(checkoutStateKey);

    localStorage.setItem(
      cartStateKey,
      JSON.stringify({
        cartItems: [
          {
            quantity: 3,
            item: createMockItem('a1'),
          },
          {
            quantity: 5,
            item: createMockItem('a2'),
          },
        ],
      })
    );
    localStorage.setItem(
      checkoutStateKey,
      JSON.stringify({
        checkoutFormData: createMockCheckoutFormData(),
      })
    );

    const { store: importedStore } = await import('../../store');
    store = importedStore;
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('Should render successfully', async () => {
    mockRouter({
      pathname: '/checkout/1234-5678',
    });

    mockRequestCheckout(checkoutResponse);

    const renderResult = await createRenderResult(store);

    expect(renderResult.baseElement).toBeTruthy();
    expect(stateCheckoutApproval).toEqual(isLoadingStateMock);

    await act(() => jest.advanceTimersByTime(100));

    expect(stateCheckoutApproval).toEqual(responseStateMock);
    expect(
      renderResult.baseElement.querySelector(
        '#checkout-approval-is-in-stock-item-a1'
      )?.textContent
    ).toBe('inStock');
    expect(
      renderResult.baseElement.querySelector(
        '#checkout-approval-is-in-stock-item-a2'
      )?.textContent
    ).toBe('inStock');
    expect(
      renderResult.baseElement.querySelector(
        '#checkout-approval-is-in-stock-item-a3'
      )?.textContent
    ).toBe('notInStock');

    renderResult.unmount();
  });

  it('Should throw an error if the cart is empty', async () => {
    jest.resetModules();
    localStorage.removeItem(cartStateKey);
    const { store } = await import('../../store');

    expect(store.getState().cart.cartItems.length).toBe(0);

    mockRouter({
      pathname: '/checkout/1234-5678',
    });

    mockRequestCheckout(checkoutResponse);

    console.error = jest.fn();
    const renderResult = await createRenderResult(store);

    expect(console.error).toHaveBeenCalledTimes(1);

    renderResult.unmount();
  });

  it('Should throw an error if the checkout form data is undefined', async () => {
    jest.resetModules();
    localStorage.removeItem(checkoutStateKey);
    const { store } = await import('../../store');

    expect(store.getState().checkout.checkoutFormData).toBe(undefined);

    mockRouter({
      pathname: '/checkout/1234-5678',
    });

    mockRequestCheckout(checkoutResponse);

    console.error = jest.fn();
    const renderResult = await createRenderResult(store);

    expect(console.error).toHaveBeenCalledTimes(1);

    renderResult.unmount();
  });

  describe('reject button', () => {
    it('Should trigger the rejection procedure with the UI in the isLoading state', async () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/checkout/1234-5678',
        push,
      });

      mockRequestCheckout(checkoutResponse);

      const renderResult = await createRenderResult(store);

      expect(renderResult.baseElement).toBeTruthy();
      expect(stateCheckoutApproval).toEqual(isLoadingStateMock);

      expect(push).toHaveBeenCalledTimes(0);

      const fetchSpy = mockFetchResponse(
        new Response('', {
          status: 200,
        })
      );

      await act(() =>
        fireEvent.click(
          renderResult.baseElement.querySelector(
            '#checkout-approval-reject-checkout-button'
          ) as Element
        )
      );
      await act(() => jest.advanceTimersByTime(100));

      expect(fetchSpy).toHaveBeenCalledTimes(0);
      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith({ pathname: '/', query: {} });

      renderResult.unmount();
    });

    it('Should trigger the rejection procedure with the UI in the response state', async () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/checkout/1234-5678',
        push,
      });

      mockRequestCheckout(checkoutResponse);

      const renderResult = await createRenderResult(store);

      expect(renderResult.baseElement).toBeTruthy();
      expect(stateCheckoutApproval).toEqual(isLoadingStateMock);

      await act(() => jest.advanceTimersByTime(100));

      expect(stateCheckoutApproval).toEqual(responseStateMock);
      expect(push).toHaveBeenCalledTimes(0);

      const fetchSpy = mockFetchResponse(
        new Response('', {
          status: 200,
        })
      );

      await act(() =>
        fireEvent.click(
          renderResult.baseElement.querySelector(
            '#checkout-approval-reject-checkout-button'
          ) as Element
        )
      );
      await act(() => jest.advanceTimersByTime(100));

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith('/api/reject-checkout', {
        mode: 'same-origin',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId: '1234-5678',
          token: 'a123',
        } as RejectCheckoutRequest),
      });
      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith({ pathname: '/', query: {} });

      renderResult.unmount();
    });

    it('Should throw an error with the UI in the response state and an undefined token', async () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/checkout/1234-5678',
        push,
      });

      mockRequestCheckout(checkoutResponse);

      const renderResult = await createRenderResult(store);

      expect(renderResult.baseElement).toBeTruthy();
      expect(stateCheckoutApproval).toEqual(isLoadingStateMock);

      await act(() => jest.advanceTimersByTime(100));

      expect(stateCheckoutApproval).toEqual(responseStateMock);
      expect(push).toHaveBeenCalledTimes(0);

      const fetchSpy = mockFetchResponse(
        new Response('', {
          status: 200,
        })
      );
      (stateCheckoutApproval.response as CheckoutResponse).token = '';

      const consoleError = console.error;
      console.error = jest.fn();
      await act(() =>
        fireEvent.click(
          renderResult.baseElement.querySelector(
            '#checkout-approval-reject-checkout-button'
          ) as Element
        )
      );
      await act(() => jest.advanceTimersByTime(100));
      console.error = consoleError;

      expect(fetchSpy).toHaveBeenCalledTimes(0);
      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith({ pathname: '/', query: {} });

      (stateCheckoutApproval.response as CheckoutResponse).token = 'a123';
      renderResult.unmount();
    });

    it('Should trigger the rejection procedure with the UI in the error state', async () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/checkout/1234-5678',
        push,
      });

      mockRequestCheckoutError();

      const renderResult = await createRenderResult(store);

      expect(renderResult.baseElement).toBeTruthy();
      expect(stateCheckoutApproval).toEqual(isLoadingStateMock);

      const consoleError = console.error;
      console.error = jest.fn();
      await act(() => jest.advanceTimersByTime(100));
      console.error = consoleError;

      expect(stateCheckoutApproval).toEqual(errorStateMock);
      expect(push).toHaveBeenCalledTimes(0);

      const fetchSpy = mockFetchResponse(
        new Response('', {
          status: 200,
        })
      );

      await act(() =>
        fireEvent.click(
          renderResult.baseElement.querySelector(
            '#checkout-approval-reject-checkout-button'
          ) as Element
        )
      );
      await act(() => jest.advanceTimersByTime(100));

      expect(fetchSpy).toHaveBeenCalledTimes(0);
      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith({ pathname: '/', query: {} });

      renderResult.unmount();
    });
  });

  describe('approve button', () => {
    it('Should trigger the approval procedure with the UI in the isLoading state', async () => {
      mockRouter({
        pathname: '/checkout/1234-5678',
      });

      mockRequestCheckout(checkoutResponse);

      const renderResult = await createRenderResult(store);

      expect(renderResult.baseElement).toBeTruthy();
      expect(stateCheckoutApproval).toEqual(isLoadingStateMock);

      const fetchSpy = mockFetchResponse(
        new Response('', {
          status: 200,
        })
      );

      await act(() =>
        fireEvent.click(
          renderResult.baseElement.querySelector(
            '#checkout-approval-approve-checkout-button'
          ) as Element
        )
      );
      await act(() => jest.advanceTimersByTime(100));

      expect(fetchSpy).toHaveBeenCalledTimes(0);

      renderResult.unmount();
    });

    it('Should trigger the approval procedure with the UI in the response state', async () => {
      mockRouter({
        pathname: '/checkout/1234-5678',
      });

      mockRequestCheckout(checkoutResponse);

      const renderResult = await createRenderResult(store);

      expect(renderResult.baseElement).toBeTruthy();
      expect(stateCheckoutApproval).toEqual(isLoadingStateMock);

      await act(() => jest.advanceTimersByTime(100));

      expect(stateCheckoutApproval).toEqual(responseStateMock);

      const fetchSpy = mockFetchResponse(
        new Response('', {
          status: 200,
        })
      );

      await act(() =>
        fireEvent.click(
          renderResult.baseElement.querySelector(
            '#checkout-approval-approve-checkout-button'
          ) as Element
        )
      );
      await act(() => jest.advanceTimersByTime(100));

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith('/api/approve-checkout', {
        mode: 'same-origin',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId: '1234-5678',
          token: 'a123',
        } as ApproveCheckoutRequest),
      });
      expect(stateCheckoutApproval).toEqual(isCompletedStateMock);
      expect(store.getState().cart.cartItems.length).toBe(0);

      renderResult.unmount();
    });

    it('Should throw an error with the UI in the response state and an undefined token', async () => {
      mockRouter({
        pathname: '/checkout/1234-5678',
      });

      mockRequestCheckout(checkoutResponse);

      const renderResult = await createRenderResult(store);

      expect(renderResult.baseElement).toBeTruthy();
      expect(stateCheckoutApproval).toEqual(isLoadingStateMock);

      await act(() => jest.advanceTimersByTime(100));

      expect(stateCheckoutApproval).toEqual(responseStateMock);

      const fetchSpy = mockFetchResponse(
        new Response('', {
          status: 200,
        })
      );
      (stateCheckoutApproval.response as CheckoutResponse).token = '';

      const consoleError = console.error;
      console.error = jest.fn();
      await act(() =>
        fireEvent.click(
          renderResult.baseElement.querySelector(
            '#checkout-approval-approve-checkout-button'
          ) as Element
        )
      );
      await act(() => jest.advanceTimersByTime(100));
      console.error = consoleError;

      expect(fetchSpy).toHaveBeenCalledTimes(0);

      (stateCheckoutApproval.response as CheckoutResponse).token = 'a123';
      renderResult.unmount();
    });

    it('Should trigger the approval procedure with the UI in the error state', async () => {
      mockRouter({
        pathname: '/checkout/1234-5678',
      });

      mockRequestCheckoutError();

      const renderResult = await createRenderResult(store);

      expect(renderResult.baseElement).toBeTruthy();
      expect(stateCheckoutApproval).toEqual(isLoadingStateMock);

      const consoleError = console.error;
      console.error = jest.fn();
      await act(() => jest.advanceTimersByTime(100));
      console.error = consoleError;

      expect(stateCheckoutApproval).toEqual(errorStateMock);

      const fetchSpy = mockFetchResponse(
        new Response('', {
          status: 200,
        })
      );

      await act(() =>
        fireEvent.click(
          renderResult.baseElement.querySelector(
            '#checkout-approval-approve-checkout-button'
          ) as Element
        )
      );
      await act(() => jest.advanceTimersByTime(100));

      expect(fetchSpy).toHaveBeenCalledTimes(0);

      renderResult.unmount();
    });

    it('Should trigger the approval procedure with the UI in the response state and continue shopping', async () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/checkout/1234-5678',
        push,
      });

      mockRequestCheckout(checkoutResponse);

      const renderResult = await createRenderResult(store);

      expect(renderResult.baseElement).toBeTruthy();
      expect(stateCheckoutApproval).toEqual(isLoadingStateMock);

      await act(() => jest.advanceTimersByTime(100));

      expect(stateCheckoutApproval).toEqual(responseStateMock);

      mockFetchResponse(
        new Response('', {
          status: 200,
        })
      );

      await act(() =>
        fireEvent.click(
          renderResult.baseElement.querySelector(
            '#checkout-approval-approve-checkout-button'
          ) as Element
        )
      );
      await act(() => jest.advanceTimersByTime(100));

      expect(stateCheckoutApproval).toEqual(isCompletedStateMock);
      expect(store.getState().cart.cartItems.length).toBe(0);
      expect(push).toHaveBeenCalledTimes(0);

      await act(() =>
        fireEvent.click(
          renderResult.baseElement.querySelector(
            '#checkout-approval-continue-shopping-button'
          ) as Element
        )
      );

      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith({ pathname: '/', query: {} });

      renderResult.unmount();
    });
  });

  describe('heartbeat interval', () => {
    it("Shouldn't fire the heartbeat in the isLoading state", async () => {
      mockRouter({
        pathname: '/checkout/1234-5678',
      });

      mockRequestCheckout(checkoutResponse);

      const renderResult = await createRenderResult(store);

      expect(renderResult.baseElement).toBeTruthy();
      expect(stateCheckoutApproval).toEqual(isLoadingStateMock);

      const fetchSpy = mockFetchResponse(
        new Response('', {
          status: 200,
        })
      );

      await act(() => jest.advanceTimersByTime(30 * 1000));

      expect(fetchSpy).toHaveBeenCalledTimes(0);

      renderResult.unmount();
    });

    it('Should fire the heartbeat in the response state', async () => {
      mockRouter({
        pathname: '/checkout/1234-5678',
      });

      mockRequestCheckout(checkoutResponse);

      const renderResult = await createRenderResult(store);

      expect(renderResult.baseElement).toBeTruthy();
      expect(stateCheckoutApproval).toEqual(isLoadingStateMock);

      await act(() => jest.advanceTimersByTime(100));

      expect(stateCheckoutApproval).toEqual(responseStateMock);

      const fetchSpy = mockFetchResponse(
        new Response('', {
          status: 200,
        })
      );

      await act(() => jest.advanceTimersByTime(30 * 1000));

      expect(fetchSpy).toHaveBeenCalledTimes(1);

      renderResult.unmount();
    });

    it('The heartbeat should throw an error if the UI is in the response state and the token is undefined', async () => {
      mockRouter({
        pathname: '/checkout/1234-5678',
      });

      mockRequestCheckout(checkoutResponse);

      const renderResult = await createRenderResult(store);

      expect(renderResult.baseElement).toBeTruthy();
      expect(stateCheckoutApproval).toEqual(isLoadingStateMock);

      await act(() => jest.advanceTimersByTime(100));

      expect(stateCheckoutApproval).toEqual(responseStateMock);

      const fetchSpy = mockFetchResponse(
        new Response('', {
          status: 200,
        })
      );
      (stateCheckoutApproval.response as CheckoutResponse).token = '';

      const consoleError = console.error;
      console.error = jest.fn();
      await act(() => jest.advanceTimersByTime(30 * 1000));
      console.error = consoleError;

      expect(fetchSpy).toHaveBeenCalledTimes(0);

      (stateCheckoutApproval.response as CheckoutResponse).token = 'a123';
      renderResult.unmount();
    });

    it("Shouldn't fire the heartbeat in the error state", async () => {
      mockRouter({
        pathname: '/checkout/1234-5678',
      });

      mockRequestCheckoutError();

      const renderResult = await createRenderResult(store);

      expect(renderResult.baseElement).toBeTruthy();
      expect(stateCheckoutApproval).toEqual(isLoadingStateMock);

      const consoleError = console.error;
      console.error = jest.fn();
      await act(() => jest.advanceTimersByTime(100));
      console.error = consoleError;

      expect(stateCheckoutApproval).toEqual(errorStateMock);

      const fetchSpy = mockFetchResponse(
        new Response('', {
          status: 200,
        })
      );

      await act(() => jest.advanceTimersByTime(30 * 1000));

      expect(fetchSpy).toHaveBeenCalledTimes(0);

      renderResult.unmount();
    });

    it("Shouldn't fire the heartbeat in the isCompleted state", async () => {
      const push = jest.fn();
      mockRouter({
        pathname: '/checkout/1234-5678',
        push,
      });

      mockRequestCheckout(checkoutResponse);

      const renderResult = await createRenderResult(store);

      expect(renderResult.baseElement).toBeTruthy();
      expect(stateCheckoutApproval).toEqual(isLoadingStateMock);

      await act(() => jest.advanceTimersByTime(100));

      expect(stateCheckoutApproval).toEqual(responseStateMock);

      mockFetchResponse(
        new Response('', {
          status: 200,
        })
      );

      await act(() =>
        fireEvent.click(
          renderResult.baseElement.querySelector(
            '#checkout-approval-approve-checkout-button'
          ) as Element
        )
      );
      await act(() => jest.advanceTimersByTime(100));

      expect(stateCheckoutApproval).toEqual(isCompletedStateMock);
      expect(store.getState().cart.cartItems.length).toBe(0);

      const fetchSpy = mockFetchResponse(
        new Response('', {
          status: 200,
        })
      );

      await act(() => jest.advanceTimersByTime(30 * 1000));

      expect(fetchSpy).toHaveBeenCalledTimes(0);

      renderResult.unmount();
    });
  });
});
