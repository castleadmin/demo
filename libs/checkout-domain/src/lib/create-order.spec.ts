import { ObjectId } from 'mongodb';
import { Country } from './country';
import { CreateOrder, validateCreateOrder } from './create-order';
import { Language } from './language';
import { PaymentMethod } from './payment-method';
import { ShippingOption } from './shipping-option';

describe('create-order', () => {
  describe('validateCreateOrder', () => {
    let createOrder: CreateOrder;

    beforeEach(() => {
      createOrder = {
        firstName: 'Udo',
        lastName: 'Müller',
        businessName: 'SuperFast',
        emailAddress: 'udo@super-fast.com',
        streetAddress: 'Weinstraße 2',
        zipCode: '51234',
        city: 'Neustadt',
        country: Country.Germany,
        shippingOption: ShippingOption.express,
        paymentMethod: PaymentMethod.playMoney,
        language: Language.enUs,
        items: [
          {
            itemId: new ObjectId().toString(),
            quantity: 2,
          },
          {
            itemId: new ObjectId().toString(),
            quantity: 3,
          },
        ],
      };
    });

    it('Should validate the given order successfully', async () => {
      await expect(validateCreateOrder(createOrder)).resolves.toBe(createOrder);
    });

    it("Should validate the given order successfully, if the business name isn't defined", async () => {
      delete createOrder.businessName;

      expect(createOrder.businessName).toBeUndefined();
      await expect(validateCreateOrder(createOrder)).resolves.toBe(createOrder);
    });

    it('Should throw an error if the items list is empty', async () => {
      createOrder.items = [];

      await expect(validateCreateOrder(createOrder)).rejects.toBeInstanceOf(
        Error
      );
    });

    it('Should throw an error if the email address is invalid', async () => {
      createOrder.emailAddress = 'udo@super-fast';

      await expect(validateCreateOrder(createOrder)).rejects.toBeInstanceOf(
        Error
      );
    });

    it('Should throw an error if the shipping option is invalid', async () => {
      createOrder.shippingOption = 'test' as ShippingOption;

      await expect(validateCreateOrder(createOrder)).rejects.toBeInstanceOf(
        Error
      );
    });

    it('Should throw an error if the payment method is invalid', async () => {
      createOrder.paymentMethod = 'test' as PaymentMethod;

      await expect(validateCreateOrder(createOrder)).rejects.toBeInstanceOf(
        Error
      );
    });

    it('Should throw an error if the language is invalid', async () => {
      createOrder.language = 'fr' as Language;

      await expect(validateCreateOrder(createOrder)).rejects.toBeInstanceOf(
        Error
      );
    });

    it('Should throw an error if the item quantity is less than 1', async () => {
      if (createOrder.items[0]) {
        createOrder.items[0].quantity = 0;
      }

      await expect(validateCreateOrder(createOrder)).rejects.toBeInstanceOf(
        Error
      );
    });
  });
});
