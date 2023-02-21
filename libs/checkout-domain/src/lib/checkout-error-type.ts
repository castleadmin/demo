/**
 * Errors that can occur during the checkout process.
 */
export enum CheckoutErrorType {
  internalError = 'internalError',
  validationError = 'validationError',
  allItemsAreInvalidError = 'allItemsAreInvalidError',
  userRejectsError = 'userRejectsError',
  timeoutError = 'timeoutError',
}
