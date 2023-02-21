import { render } from '@testing-library/react';
import 'next-i18next';
import { mockRouter } from '../../specs/mocks';
import MainMenu from './main-menu';

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

describe('MainMenu', () => {
  it('Should render successfully', () => {
    mockRouter({
      pathname: '/',
      query: {},
    });

    const { baseElement } = render(<MainMenu />);
    expect(baseElement).toBeTruthy();
  });
});
