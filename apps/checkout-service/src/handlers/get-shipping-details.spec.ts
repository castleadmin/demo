import {
  Country,
  ShippingOption,
  ShippingService,
} from '@castleadmin/checkout-domain';
import { Item } from '@castleadmin/product-domain';
import { Callback, Context } from 'aws-lambda';
import { createMockItems } from '../specs/mocks.spec';
import { handler } from './get-shipping-details';

type HandlerEvent = {
  items: Item[];
  country: Country;
  shippingOption: ShippingOption;
};

describe('get-shipping-details', () => {
  it('Should execute successfully', async () => {
    const getDeliveryDateSpy = jest.spyOn(ShippingService, 'getDeliveryDate');
    getDeliveryDateSpy.mockImplementation(() => '2023-01-06T12:00:00.000Z');

    const result = await handler(
      {
        items: createMockItems(),
        country: Country.Germany,
        shippingOption: ShippingOption.express,
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({
      shippingPrices: {
        EUR: 1400,
      },
      deliveryDateItems: [
        {
          itemId: 'a1',
          deliveryDate: '2023-01-06T12:00:00.000Z',
        },
        {
          itemId: 'a2',
          deliveryDate: '2023-01-06T12:00:00.000Z',
        },
        {
          itemId: 'a3',
          deliveryDate: '2023-01-06T12:00:00.000Z',
        },
        {
          itemId: 'a4',
          deliveryDate: '2023-01-06T12:00:00.000Z',
        },
        {
          itemId: 'a5',
          deliveryDate: '2023-01-06T12:00:00.000Z',
        },
      ],
    });
  });

  it('Should return an error if the input parameter items is undefined', async () => {
    const getDeliveryDateSpy = jest.spyOn(ShippingService, 'getDeliveryDate');
    getDeliveryDateSpy.mockImplementation(() => '2023-01-06T12:00:00.000Z');

    const result = await handler(
      {
        country: Country.Germany,
        shippingOption: ShippingOption.express,
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({
      error: expect.anything(),
    });
  });

  it('Should return an error if the input parameter country is undefined', async () => {
    const getDeliveryDateSpy = jest.spyOn(ShippingService, 'getDeliveryDate');
    getDeliveryDateSpy.mockImplementation(() => '2023-01-06T12:00:00.000Z');

    const result = await handler(
      {
        items: createMockItems(),
        shippingOption: ShippingOption.express,
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({
      error: expect.anything(),
    });
  });

  it('Should return an error if the input parameter shippingOption is undefined', async () => {
    const getDeliveryDateSpy = jest.spyOn(ShippingService, 'getDeliveryDate');
    getDeliveryDateSpy.mockImplementation(() => '2023-01-06T12:00:00.000Z');

    const result = await handler(
      {
        items: createMockItems(),
        country: Country.Germany,
      } as HandlerEvent,
      {} as unknown as Context,
      undefined as unknown as Callback
    );

    expect(result).toEqual({
      error: expect.anything(),
    });
  });
});
