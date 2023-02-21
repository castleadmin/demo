import { render } from '@testing-library/react';
import 'next-i18next';
import Categories from './categories';

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

describe('Categories', () => {
  it('Should render successfully', () => {
    const { baseElement } = render(<Categories />);
    expect(baseElement).toBeTruthy();
  });
});
