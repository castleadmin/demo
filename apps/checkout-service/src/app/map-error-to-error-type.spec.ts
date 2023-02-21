import { CheckoutErrorType } from '@castleadmin/checkout-domain';
import { mapErrorToErrorType } from './map-error-to-error-type';

describe('map-error-to-error-type', () => {
  describe('mapErrorToErrorType', () => {
    it('allItemsAreInvalidError should be mapped to allItemsAreInvalidError', () => {
      expect(
        mapErrorToErrorType(CheckoutErrorType.allItemsAreInvalidError)
      ).toBe(CheckoutErrorType.allItemsAreInvalidError);
    });

    it('validationError should be mapped to validationError', () => {
      expect(mapErrorToErrorType(CheckoutErrorType.validationError)).toBe(
        CheckoutErrorType.validationError
      );
    });

    it('userRejectsError should be mapped to userRejectsError', () => {
      expect(mapErrorToErrorType(CheckoutErrorType.userRejectsError)).toBe(
        CheckoutErrorType.userRejectsError
      );
    });

    it("'States.Timeout' should be mapped to CheckoutErrorType.timeoutError", () => {
      expect(mapErrorToErrorType('States.Timeout')).toBe(
        CheckoutErrorType.timeoutError
      );
    });

    it('Any other error should be mapped to CheckoutErrorType.internalError', () => {
      expect(mapErrorToErrorType('Unknown Error')).toBe(
        CheckoutErrorType.internalError
      );
    });
  });
});
