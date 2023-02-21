# Adventials

## Business Context

The Adventials frontend provides the following functionalities to the customer.

### Internationalization

- The german language and the german number formatting is available for german customers.
- The american english language variety and the american number formatting is available for american customers.

### Searching

- The customer is able to search for items by category and by search text.
- The search results can be filtered by quality and by effect power.
- The search results can be sorted
  - by the best search results (only for text searches).
  - by a popularity index.
  - by the price descending.
  - by the price ascending.
  - by the average customer rating and review count.

### Shopping Cart

- The customer is able to add items to the shopping cart.
- The customer is able to change the quantity of the items inside the shopping cart.
- The customer can remove items from the shopping cart.

### Checkout

- The customer has to provide the delivery address.
- Initially it is sufficient that the invoice address always equals the delivery address.
- The customer has to provide an email address.
- The customer has to choose a payment method.
- The accepted payment methods are play money, sweets and greeting cards.
- The customer has to choose a shipping option.
- The accepted shipping options are standard and express shipping.
- The customer has to approve the Adventials privacy policy.

### Checkout Approval

- The customer has the chance to review all important information.
- The important information include
  - the delivery address.
  - the email address.
  - the payment method.
  - the shipping option.
  - all items of the shopping cart and their associated quantity.
  - the shipping price.
  - the total price.
- The customer is able to reject the proposed order.
- The customer is able to approve the proposed order.
- Upon approval a confirmation is shown to the customer.
- Upon approval a confirmation email is send to the customer.

## Technical Context

The Adventials frontend has been build with Next.js and React.
It makes use of Server-Side Rendering (SSR) and Static Site Generation (SSG).
The use of SSG is unfortunately limited by the Vercel Hobby Plan that is used.
The frontend uses a GraphQL API to request data from the backend.
The requests are sent with the help of the Apollo client. Sentry is used for
error reporting. In order to provide plurals in translations and
to enable interpolation, next-i18next has been chosen as internationalization library.
