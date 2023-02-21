import { render } from '@testing-library/react';
import 'next-i18next';
import { SearchResultItem } from '../../item';
import { createMockItem, mockRouter } from '../../specs/mocks';
import SearchResult from './search-result';

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

describe('SearchResult', () => {
  let item: SearchResultItem;

  beforeEach(() => {
    item = createMockItem();
  });

  it('Should render successfully if the item is in stock', () => {
    mockRouter();

    const { baseElement } = render(<SearchResult item={item} />);

    expect(baseElement).toBeTruthy();
    expect(
      baseElement.querySelector<HTMLElement>('#search-result-is-in-stock')
        ?.textContent
    ).toBe('inStock');
  });

  it("Should render successfully if the item isn't in stock", () => {
    mockRouter();

    item.isInStock = false;

    const { baseElement } = render(<SearchResult item={item} />);

    expect(baseElement).toBeTruthy();
    expect(
      baseElement.querySelector<HTMLElement>('#search-result-is-in-stock')
        ?.textContent
    ).toBe('notInStock');
  });
});
