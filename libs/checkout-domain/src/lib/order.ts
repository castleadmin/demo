import { Item } from '@castleadmin/product-domain';
import { Country } from './country';
import { Language } from './language';
import { OrderStatus } from './order-status';
import { PaymentMethod } from './payment-method';
import { ShippingOption } from './shipping-option';

/**
 * Represents a shop order.
 * DDD <<Entity>> <<RootAggregate>>
 */
export interface Order {
  _id: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  businessName?: string;
  emailAddress: string;
  streetAddress: string;
  zipCode: string;
  city: string;
  country: Country;
  shippingOption: ShippingOption;
  shippingPrices: {
    EUR: number;
  };
  paymentMethod: PaymentMethod;
  language: Language;
  status: OrderStatus;
  items: OrderItem[];
}

/**
 * Represents a shop order item.
 * DDD <<Entity>> <<Aggregate>>
 */
export interface OrderItem extends Item {
  quantity: number;
  deliveryDate: string;
}

const orderSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    businessName: { type: 'string' },
    emailAddress: { type: 'string', format: 'email' },
    streetAddress: { type: 'string' },
    zipCode: { type: 'string' },
    city: { type: 'string' },
    country: {
      type: 'string',
      enum: [
        'Austria',
        'Belgium',
        'Bulgaria',
        'Canada',
        'Croatia',
        'Cyprus',
        'Czech Republic',
        'Denmark',
        'Estonia',
        'Finland',
        'France',
        'Germany',
        'Greece',
        'Hungary',
        'Ireland',
        'Italy',
        'Japan',
        'Latvia',
        'Lithuania',
        'Luxembourg',
        'Malta',
        'Netherlands',
        'Poland',
        'Portugal',
        'Romania',
        'Slovakia',
        'Slovenia',
        'Spain',
        'Sweden',
        'United Kingdom',
        'United States',
      ],
    },
    shippingOption: {
      type: 'string',
      enum: ['standard', 'express'],
    },
    shippingPrices: {
      type: 'object',
      properties: {
        EUR: { type: 'integer', minimum: 0 },
      },
      additionalProperties: false,
      required: ['EUR'],
    },
    paymentMethod: {
      type: 'string',
      enum: ['playMoney', 'sweets', 'greetingCards'],
    },
    language: {
      type: 'string',
      enum: ['de', 'en-US'],
    },
    status: {
      type: 'string',
      enum: ['confirmed'],
    },
    items: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          ean: { type: 'string', minLength: 13, maxLength: 13 },
          category: {
            type: 'string',
            enum: [
              'axes',
              'hammers',
              'spears',
              'daggers',
              'swords',
              'bows',
              'armors',
              'helmets',
              'shields',
              'wands',
              'scrolls',
              'potions',
            ],
          },
          type: {
            type: 'string',
            enum: [
              'singleSided',
              'doubleSided',

              'leather',
              'chainmail',
              'plate',

              'green',
              'blue',
              'red',
            ],
          },
          quality: {
            type: 'string',
            enum: ['normal', 'improved', 'excellent'],
          },
          effect: { type: 'string' },
          effectPower: {
            type: 'string',
            enum: ['none', 'weak', 'average', 'strong'],
          },
          prices: {
            type: 'object',
            properties: {
              EUR: { type: 'integer', exclusiveMinimum: 0 },
            },
            additionalProperties: false,
            required: ['EUR'],
          },
          isInStock: { type: 'boolean' },
          popularity: {
            type: 'number',
            minimum: 0,
            exclusiveMaximum: 1,
          },
          halfStars: { type: 'integer', minimum: 2, maximum: 10 },
          ratingCount: { type: 'integer', minimum: 0 },
          translations: {
            type: 'object',
            properties: {
              de: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  effectName: { type: 'string' },
                },
                required: ['name', 'description'],
                additionalProperties: false,
              },
              enUs: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  effectName: { type: 'string' },
                },
                required: ['name', 'description'],
                additionalProperties: false,
              },
            },
            required: ['de', 'enUs'],
            additionalProperties: false,
          },
          quantity: { type: 'integer', exclusiveMinimum: 0, maximum: 20 },
          deliveryDate: { type: 'string', format: 'date-time' },
        },
        required: [
          '_id',
          'ean',
          'category',
          'quality',
          'effectPower',
          'prices',
          'isInStock',
          'popularity',
          'halfStars',
          'ratingCount',
          'translations',
          'quantity',
          'deliveryDate',
        ],
        additionalProperties: false,
      },
    },
  },
  additionalProperties: false,
  required: [
    '_id',
    'createdAt',
    'firstName',
    'lastName',
    'emailAddress',
    'streetAddress',
    'zipCode',
    'city',
    'country',
    'shippingOption',
    'shippingPrices',
    'paymentMethod',
    'language',
    'status',
    'items',
  ],
};

/**
 * Validates the properties of an order.
 */
export async function validateOrder(order: Order): Promise<Order> {
  const Ajv = (await import('ajv')).default;
  const addFormats = (await import('ajv-formats')).default;

  const ajv = new Ajv();
  addFormats(ajv, ['email', 'date-time']);

  const validateFunction = ajv.compile(orderSchema);
  const isValid = validateFunction(order);

  if (!isValid) {
    throw new Error(
      `ValidationError - ${JSON.stringify(validateFunction.errors, null, 2)}`
    );
  }

  return order;
}
