import {
  AxeType,
  Category,
  EffectPower,
  Quality,
} from '@castleadmin/product-domain';
import { ObjectId } from 'mongodb';
import { Country } from './country';
import { Language } from './language';
import { Order, validateOrder } from './order';
import { OrderStatus } from './order-status';
import { PaymentMethod } from './payment-method';
import { ShippingOption } from './shipping-option';

describe('order', () => {
  describe('validateOrder', () => {
    let order: Order;

    beforeEach(() => {
      order = {
        _id: new ObjectId().toString(),
        createdAt: new Date().toISOString(),
        firstName: 'Udo',
        lastName: 'Müller',
        businessName: 'SuperFast',
        emailAddress: 'udo@super-fast.com',
        streetAddress: 'Weinstraße 2',
        zipCode: '51234',
        city: 'Neustadt',
        country: Country.Germany,
        shippingOption: ShippingOption.express,
        shippingPrices: {
          EUR: 6,
        },
        paymentMethod: PaymentMethod.playMoney,
        language: Language.de,
        status: OrderStatus.confirmed,
        items: [
          {
            _id: new ObjectId().toString(),
            category: Category.axes,
            ean: 'abcdefghij123',
            effect: 'effect',
            effectPower: EffectPower.none,
            halfStars: 8,
            isInStock: true,
            popularity: 0.99,
            prices: {
              EUR: 2,
            },
            quality: Quality.normal,
            ratingCount: 100,
            translations: {
              de: {
                name: 'nameDe',
                description: 'descriptionDe',
              },
              enUs: {
                name: 'nameEnUs',
                description: 'descriptionEnUs',
              },
            },
            type: AxeType.singleSided,
            quantity: 2,
            deliveryDate: new Date().toISOString(),
          },
          {
            _id: new ObjectId().toString(),
            category: Category.axes,
            ean: 'abcdefghij123',
            effect: 'effect',
            effectPower: EffectPower.none,
            halfStars: 8,
            isInStock: true,
            popularity: 0.99,
            prices: {
              EUR: 2,
            },
            quality: Quality.normal,
            ratingCount: 100,
            translations: {
              de: {
                name: 'nameDe',
                description: 'descriptionDe',
              },
              enUs: {
                name: 'nameEnUs',
                description: 'descriptionEnUs',
              },
            },
            type: AxeType.singleSided,
            quantity: 3,
            deliveryDate: new Date().toISOString(),
          },
        ],
      };
    });

    it('Should validate the given order successfully', async () => {
      await expect(validateOrder(order)).resolves.toBe(order);
    });

    it("Should validate the given order successfully, if the business name isn't defined", async () => {
      delete order.businessName;

      expect(order.businessName).toBeUndefined();
      await expect(validateOrder(order)).resolves.toBe(order);
    });

    it('Should throw an error if the _id is missing', async () => {
      order._id = undefined as unknown as string;

      await expect(validateOrder(order)).rejects.toBeInstanceOf(Error);
    });

    it('Should throw an error if created at is missing', async () => {
      order.createdAt = undefined as unknown as string;

      await expect(validateOrder(order)).rejects.toBeInstanceOf(Error);
    });

    it('Should throw an error if created at is invalid', async () => {
      order.createdAt = '2023-01-02T000Z';

      await expect(validateOrder(order)).rejects.toBeInstanceOf(Error);
    });

    it('Should throw an error if the items list is empty', async () => {
      order.items = [];

      await expect(validateOrder(order)).rejects.toBeInstanceOf(Error);
    });

    it('Should throw an error if the email address is invalid', async () => {
      order.emailAddress = 'udo@super-fast';

      await expect(validateOrder(order)).rejects.toBeInstanceOf(Error);
    });

    it('Should throw an error if the shipping option is invalid', async () => {
      order.shippingOption = 'test' as ShippingOption;

      await expect(validateOrder(order)).rejects.toBeInstanceOf(Error);
    });

    it('Should throw an error if the payment method is invalid', async () => {
      order.paymentMethod = 'test' as PaymentMethod;

      await expect(validateOrder(order)).rejects.toBeInstanceOf(Error);
    });

    it('Should throw an error if the language is invalid', async () => {
      order.language = 'fr' as Language;

      await expect(validateOrder(order)).rejects.toBeInstanceOf(Error);
    });

    it('Should throw an error if the item quantity is less than 1', async () => {
      if (order.items[0]) {
        order.items[0].quantity = 0;
      }

      await expect(validateOrder(order)).rejects.toBeInstanceOf(Error);
    });

    it('Should throw an error if the item delivery date is invalid', async () => {
      if (order.items[0]) {
        order.items[0].deliveryDate = '2023-01-02T000Z';
      }

      await expect(validateOrder(order)).rejects.toBeInstanceOf(Error);
    });
  });
});
