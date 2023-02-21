import { CheckoutErrorType } from '@castleadmin/checkout-domain';

export function mapErrorToErrorType(error: string): CheckoutErrorType {
  let errorType: CheckoutErrorType;

  switch (error) {
    case CheckoutErrorType.allItemsAreInvalidError:
      errorType = CheckoutErrorType.allItemsAreInvalidError;
      break;
    case CheckoutErrorType.validationError:
      errorType = CheckoutErrorType.validationError;
      break;
    case CheckoutErrorType.userRejectsError:
      errorType = CheckoutErrorType.userRejectsError;
      break;
    case 'States.Timeout':
      errorType = CheckoutErrorType.timeoutError;
      break;
    default:
      errorType = CheckoutErrorType.internalError;
      break;
  }

  return errorType;
}
