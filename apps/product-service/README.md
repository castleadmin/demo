# Product Service

## Business Context

The product service is responsible for the management of product (item) master data.
It provides methods to retrieve a single or multiple products.
In the real world, it would also provide methods for adding and changing product master data.
However, due to the fact that the Adventials products are automatically generated this isn't necessary.

## Technical Context

The product service has several endpoints called handlers.
Each handler is build as a serverless function by the Serverless Framework.
The handlers request product master data via the MongoDB Driver.
Sentry is used for error reporting.
The product service also provides the product part of the GraphQL API.
This is accomplished by the definition of a GraphQL Schema and by
a set of AWS AppSync resolvers.
