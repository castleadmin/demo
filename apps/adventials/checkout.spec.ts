import { Language, ShippingOption } from '@castleadmin/checkout-domain';
import { toDeliveryDateOrder } from './checkout';
import { createMockApprovalOrder, createMockItem } from './specs/mocks';

describe('checkout', () => {
  describe('toDeliveryDateOrder', () => {
    it('Should execute successfully with locale de', () => {
      const result = toDeliveryDateOrder(
        createMockApprovalOrder(),
        Language.de
      );
      const mockItem3 = createMockItem('a3');
      mockItem3.isInStock = false;

      expect(result).toEqual({
        groups: [
          {
            deliveryDate: '2023-01-05T12:00:00.000Z',
            items: [
              {
                item: createMockItem('a1'),
                quantity: 1,
              },
              {
                item: createMockItem('a2'),
                quantity: 2,
              },
            ],
          },
          {
            deliveryDate: '2023-01-06T12:00:00.000Z',
            items: [
              {
                item: mockItem3,
                quantity: 3,
              },
            ],
          },
        ],
        shippingOption: ShippingOption.express,
        totalPriceItemsEur: '2.879,94\xa0€',
        shippingPriceEur: '6,00\xa0€',
        totalPriceEur: '2.885,94\xa0€',
      });
    });

    it('Should execute successfully with locale en-US', () => {
      const result = toDeliveryDateOrder(
        createMockApprovalOrder(),
        Language.enUs
      );
      const mockItem3 = createMockItem('a3');
      mockItem3.isInStock = false;

      expect(result).toEqual({
        groups: [
          {
            deliveryDate: '2023-01-05T12:00:00.000Z',
            items: [
              {
                item: createMockItem('a1'),
                quantity: 1,
              },
              {
                item: createMockItem('a2'),
                quantity: 2,
              },
            ],
          },
          {
            deliveryDate: '2023-01-06T12:00:00.000Z',
            items: [
              {
                item: mockItem3,
                quantity: 3,
              },
            ],
          },
        ],
        shippingOption: ShippingOption.express,
        totalPriceItemsEur: '€2,879.94',
        shippingPriceEur: '€6.00',
        totalPriceEur: '€2,885.94',
      });
    });

    it('Should throw an error if the quantity of an item id is undefined', () => {
      const order = createMockApprovalOrder();
      order.items.pop();

      expect(() => toDeliveryDateOrder(order, Language.de)).toThrow(Error);
    });

    it('Should throw an error if the checked item of an item id is undefined', () => {
      const order = createMockApprovalOrder();
      order.checkItemsResult.checkedItems.pop();

      expect(() => toDeliveryDateOrder(order, Language.de)).toThrow(Error);
    });
  });
});
