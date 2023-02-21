import { ThemeProvider } from '@mui/material';
import { act, render, RenderResult } from '@testing-library/react';
import { GetServerSidePropsContext } from 'next';
import 'next-i18next';
import { Provider } from 'react-redux';
import { cartStateKey } from '../../cart.state';
import { checkoutStateKey } from '../../checkout.state';
import CheckoutId, { getServerSideProps } from '../../pages/checkout/[id]';
import { theme } from '../../theme';
import {
  createMockApprovalOrder,
  createMockCheckoutFormData,
  createMockItem,
  mockRouter,
} from '../mocks';

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

describe('CheckoutId', () => {
  it('Should render successfully', async () => {
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

    const { store } = await import('../../store');

    const fetchSpy = jest.spyOn(window, 'fetch');
    fetchSpy.mockImplementation(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            transactionId: '1234-5678',
            token: 'a123',
            approvalOrder: createMockApprovalOrder(),
          }),
          {
            status: 200,
          }
        )
      )
    );

    mockRouter({
      pathname: '/checkout/1234-5678',
    });

    let renderResult: RenderResult = undefined as unknown as RenderResult;

    await act(() => {
      renderResult = render(
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <CheckoutId transactionId="1234-5678" />
          </Provider>
        </ThemeProvider>
      );
    });

    if (!renderResult) {
      throw new Error('render result is undefined');
    }

    expect(renderResult.baseElement).toBeTruthy();
  });

  it('Should execute getServerSideProps successfully', async () => {
    const result = getServerSideProps({
      params: { id: '1234-5678' },
      locale: 'en-US',
    } as unknown as GetServerSidePropsContext);

    await expect(result).resolves.toEqual({
      props: {
        transactionId: '1234-5678',
        _nextI18Next: expect.anything(),
      },
    });
  });

  it('getServerSideProps should throw an error if the locale is undefined', async () => {
    await expect(
      getServerSideProps({
        params: { id: '1234-5678' },
      } as unknown as GetServerSidePropsContext)
    ).rejects.toBeInstanceOf(Error);
  });

  it('getServerSideProps should throw an error if the params id is undefined', async () => {
    await expect(
      getServerSideProps({
        params: {},
        locale: 'en-US',
      } as unknown as GetServerSidePropsContext)
    ).rejects.toBeInstanceOf(Error);
  });
});
