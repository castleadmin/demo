import { Category, EffectPower, SortOption } from '@castleadmin/product-domain';
import { render } from '@testing-library/react';
import 'next-i18next';
import { mockRouter } from '../../specs/mocks';
import MenuItem from './menu-item';

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

describe('MenuItem', () => {
  it('Should render home page item successfully', () => {
    mockRouter({
      pathname: '/',
      query: {},
    });

    const { baseElement } = render(
      <MenuItem name="home" imagePath="/categories48/axe.png" />
    );
    const linkElement = baseElement.querySelector('.link') as HTMLAnchorElement;

    expect(baseElement).toBeTruthy();
    expect(linkElement.href).toBe('http://localhost/');
  });

  it('Should render home page item successfully and discard the query', () => {
    mockRouter({
      pathname: '/items',
      query: {
        category: Category.swords,
        sort: SortOption.review,
        powers: [EffectPower.average, EffectPower.strong],
        page: '1',
      },
    });

    const { baseElement } = render(
      <MenuItem name="home" imagePath="/categories48/axe.png" />
    );
    const linkElement = baseElement.querySelector('.link') as HTMLAnchorElement;

    expect(baseElement).toBeTruthy();
    expect(linkElement.href).toBe('http://localhost/');
  });

  it('Should render category item successfully', () => {
    mockRouter({
      pathname: '/',
      query: {},
    });

    const { baseElement } = render(
      <MenuItem name={Category.axes} imagePath="/categories48/axe.png" />
    );
    const linkElement = baseElement.querySelector('.link') as HTMLAnchorElement;

    expect(baseElement).toBeTruthy();
    expect(linkElement.href).toBe(
      'http://localhost/items?category=axes&sort=popularity&page=1'
    );
  });

  it('Should render category item successfully and add query parameters', () => {
    mockRouter({
      pathname: '/items',
      query: {
        query: 'ice',
        sort: SortOption.review,
        powers: [EffectPower.average, EffectPower.strong],
        page: '2',
      },
    });

    const { baseElement } = render(
      <MenuItem name={Category.axes} imagePath="/categories48/axe.png" />
    );
    const linkElement = baseElement.querySelector('.link') as HTMLAnchorElement;

    expect(baseElement).toBeTruthy();
    expect(linkElement.href).toBe(
      'http://localhost/items?query=ice&sort=review&powers=average&powers=strong&page=1&category=axes'
    );
  });

  it('Should render category item successfully and change the current category', () => {
    mockRouter({
      pathname: '/items',
      query: {
        category: Category.swords,
        sort: SortOption.review,
        powers: [EffectPower.average, EffectPower.strong],
        page: '4',
      },
    });

    const { baseElement } = render(
      <MenuItem name={Category.axes} imagePath="/categories48/axe.png" />
    );
    const linkElement = baseElement.querySelector('.link') as HTMLAnchorElement;

    expect(baseElement).toBeTruthy();
    expect(linkElement.href).toBe(
      'http://localhost/items?category=axes&sort=review&powers=average&powers=strong&page=1'
    );
  });
});
