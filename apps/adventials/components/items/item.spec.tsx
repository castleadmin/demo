import { Item as ItemDomain } from '@castleadmin/product-domain';
import { ThemeProvider } from '@mui/material';
import { act, fireEvent, render } from '@testing-library/react';
import 'next-i18next';
import { Provider } from 'react-redux';
import * as cartState from '../../cart.state';
import { createMockItem, mockRouter } from '../../specs/mocks';
import { store } from '../../store';
import { theme } from '../../theme';
import Item, { stateItem } from './item';

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

describe('Item', () => {
  let item: ItemDomain;

  beforeEach(() => {
    item = createMockItem();
  });

  it('Should render successfully if the item is in stock', () => {
    mockRouter();

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Item item={item} />
        </Provider>
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(
      baseElement.querySelector<HTMLElement>(
        '.price-container h6:nth-child(even)'
      )?.textContent
    ).toBe('inStock');
  });

  it("Should render successfully if the item isn't in stock", () => {
    mockRouter();

    item.isInStock = false;

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Item item={item} />
        </Provider>
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(
      baseElement.querySelector<HTMLElement>(
        '.price-container h6:nth-child(even)'
      )?.textContent
    ).toBe('notInStock');
  });

  it('Should select quantity 3', () => {
    mockRouter();

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Item item={item} />
        </Provider>
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    expect(stateItem.quantity).toBe(1);

    act(() =>
      fireEvent.mouseDown(
        baseElement.querySelector('#item-quantity') as HTMLElement
      )
    );

    const quantityElement = baseElement.querySelector(
      '[data-value="3"]'
    ) as HTMLElement;

    act(() => fireEvent.click(quantityElement));

    expect(stateItem.quantity).toBe(3);
  });

  it('Should trigger add to cart action', () => {
    mockRouter();

    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Item item={item} />
        </Provider>
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
    const addToCartSpy = jest.spyOn(cartState, 'addToCart');
    stateItem.quantity = 5;

    act(() =>
      fireEvent.click(
        baseElement.querySelector('.add-to-cart button') as HTMLElement
      )
    );

    expect(addToCartSpy).toHaveBeenCalledTimes(1);
    expect(addToCartSpy).toHaveBeenCalledWith({
      quantity: 5,
      item,
    });
  });
});
