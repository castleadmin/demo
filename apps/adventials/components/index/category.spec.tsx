import { Category as CategoryEnum } from '@castleadmin/product-domain';
import { render } from '@testing-library/react';
import 'next-i18next';
import { mockRouter } from '../../specs/mocks';
import Category from './category';

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

describe('Category', () => {
  it('Should render successfully', () => {
    mockRouter({
      pathname: '/',
      query: {},
    });

    const { baseElement } = render(
      <Category
        category={CategoryEnum.axes}
        imagePath="/categories128/axe.png"
      />
    );
    const linkElement = baseElement.querySelector('.link') as HTMLAnchorElement;

    expect(baseElement).toBeTruthy();
    expect(linkElement.href).toBe(
      'http://localhost/items?category=axes&sort=popularity&page=1'
    );
  });
});
