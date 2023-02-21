import { Item } from '@castleadmin/product-domain';
import { Country } from './country';
import { Language } from './language';
import { PaymentMethod } from './payment-method';
import { ShippingOption } from './shipping-option';

/**
 * Used to create an order during the checkout process.
 * DDD <<ValueObject>>
 */
export interface CreateOrder {
  firstName: string;
  lastName: string;
  businessName?: string;
  emailAddress: string;
  streetAddress: string;
  zipCode: string;
  city: string;
  country: Country;
  shippingOption: ShippingOption;
  paymentMethod: PaymentMethod;
  language: Language;
  items: CreateOrderItem[];
}

/**
 * Create order item that references a shop item.
 * DDD <<ValueObject>>
 */
export interface CreateOrderItem {
  itemId: string;
  quantity: number;
}

/**
 * Adds the validation result to the order creation structure.
 * DDD <<ValueObject>>
 */
export type WithValidation<T extends CreateOrder> = T & {
  validationResult: {
    isValid: true;
  };
};

/**
 * Adds the check items result to the order creation structure.
 * DDD <<ValueObject>>
 */
export type WithCheckItems<T extends CreateOrder> = T & {
  checkItemsResult: {
    hasValidItems: boolean;
    invalidItemIds: string[];
    checkedItems: Item[];
  };
};

/**
 * Delivery date item that references a shop item.
 * DDD <<ValueObject>>
 */
export interface DeliveryDateItem {
  itemId: string;
  deliveryDate: string;
}

/**
 * Adds the shipping result to the order creation structure.
 * DDD <<ValueObject>>
 */
export type WithShipping<T extends CreateOrder> = T & {
  shippingResult: {
    shippingPrices: {
      EUR: number;
    };
    deliveryDateItems: DeliveryDateItem[];
  };
};

/**
 * The approval order is used to request the customer approval of the order creation.
 * DDD <<ValueObject>>
 */
export type ApprovalOrder = WithShipping<
  WithCheckItems<WithValidation<CreateOrder>>
>;

const createOrderSchema = {
  type: 'object',
  properties: {
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
    paymentMethod: {
      type: 'string',
      enum: ['playMoney', 'sweets', 'greetingCards'],
    },
    language: {
      type: 'string',
      enum: ['de', 'en-US'],
    },
    items: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        properties: {
          itemId: {
            type: 'string',
          },
          quantity: {
            type: 'integer',
            exclusiveMinimum: 0,
            maximum: 20,
          },
        },
        additionalProperties: false,
        required: ['itemId', 'quantity'],
      },
    },
  },
  additionalProperties: false,
  required: [
    'firstName',
    'lastName',
    'emailAddress',
    'streetAddress',
    'zipCode',
    'city',
    'country',
    'shippingOption',
    'paymentMethod',
    'language',
    'items',
  ],
};

/**
 * Validates the properties of a create-order.
 */
export async function validateCreateOrder(
  createOrder: CreateOrder
): Promise<CreateOrder> {
  const Ajv = (await import('ajv')).default;
  const addFormats = (await import('ajv-formats')).default;

  const ajv = new Ajv();
  addFormats(ajv, ['email']);

  const validateFunction = ajv.compile(createOrderSchema);
  const isValid = validateFunction(createOrder);

  if (!isValid) {
    throw new Error(
      `ValidationError - ${JSON.stringify(validateFunction.errors, null, 2)}`
    );
  }

  return createOrder;
}
