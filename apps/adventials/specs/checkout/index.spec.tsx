import { ThemeProvider } from '@mui/material';
import { render } from '@testing-library/react';
import 'next-i18next';
import { Provider } from 'react-redux';
import Checkout, { getStaticProps } from '../../pages/checkout/index';
import { store } from '../../store';
import { theme } from '../../theme';
import { mockRouter } from '../mocks';

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

describe('Checkout', () => {
  it('Should render successfully', () => {
    mockRouter({
      pathname: '/checkout',
    });

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Checkout />
        </Provider>
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('Should execute getStaticProps successfully', async () => {
    const result = getStaticProps({ locale: 'en-US' });
    await expect(result).resolves.toBeTruthy();
  });

  it('getStaticProps should throw an error if the locale is undefined', async () => {
    await expect(getStaticProps({})).rejects.toBeInstanceOf(Error);
  });
});
