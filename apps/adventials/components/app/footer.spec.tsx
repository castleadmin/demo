import { ThemeProvider } from '@mui/material';
import { render } from '@testing-library/react';
import 'next-i18next';
import { theme } from '../../theme';
import Footer from './footer';

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

describe('Footer', () => {
  it('Should render successfully', () => {
    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Footer />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
