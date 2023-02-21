import { Category, EffectPower, Quality } from '@castleadmin/product-domain';
import { createDescriptionDe, createDescriptionEnUs } from './description';
import { categoryEffects } from './effect-library';

describe('description', () => {
  describe('createDescriptionDe', () => {
    describe('effect power none', () => {
      it('Should create a description for quality normal', () => {
        expect(
          createDescriptionDe('Test', Quality.normal, EffectPower.none)
        ).toBe(
          'Test ist genau auf die Bedürfnisse seiner Benutzer abgestimmt.'
        );
      });

      it('Should create a description for quality improved', () => {
        expect(
          createDescriptionDe('Test', Quality.improved, EffectPower.none)
        ).toBe(
          'Test ist genau auf die Bedürfnisse seiner Benutzer abgestimmt und zeichnet sich durch seine verbesserte Qualität aus.'
        );
      });

      it('Should create a description for quality excellent', () => {
        expect(
          createDescriptionDe('Test', Quality.excellent, EffectPower.none)
        ).toBe(
          'Test ist genau auf die Bedürfnisse seiner Benutzer abgestimmt und zeichnet sich durch seine ausgezeichnete Qualität aus.'
        );
      });
    });

    describe('effect power weak', () => {
      it('Should create a description for quality normal with a weak effect', () => {
        expect(
          createDescriptionDe(
            'Test',
            Quality.normal,
            EffectPower.weak,
            categoryEffects[Category.axes]?.[0]
          )
        ).toBe(
          'Test ist genau auf die Bedürfnisse seiner Benutzer abgestimmt. Getroffene Gegner erleiden durch eine kleine Luftdetonation schaden und werden zurückgeworfen.'
        );
      });

      it('Should create a description for quality improved with a weak effect', () => {
        expect(
          createDescriptionDe(
            'Test',
            Quality.improved,
            EffectPower.weak,
            categoryEffects[Category.axes]?.[0]
          )
        ).toBe(
          'Test ist genau auf die Bedürfnisse seiner Benutzer abgestimmt und zeichnet sich durch seine verbesserte Qualität aus. Getroffene Gegner erleiden durch eine kleine Luftdetonation schaden und werden zurückgeworfen.'
        );
      });

      it('Should create a description for quality excellent with a weak effect', () => {
        expect(
          createDescriptionDe(
            'Test',
            Quality.excellent,
            EffectPower.weak,
            categoryEffects[Category.axes]?.[0]
          )
        ).toBe(
          'Test ist genau auf die Bedürfnisse seiner Benutzer abgestimmt und zeichnet sich durch seine ausgezeichnete Qualität aus. Getroffene Gegner erleiden durch eine kleine Luftdetonation schaden und werden zurückgeworfen.'
        );
      });
    });

    describe('effect power average', () => {
      it('Should create a description for quality normal with a average effect', () => {
        expect(
          createDescriptionDe(
            'Test',
            Quality.normal,
            EffectPower.average,
            categoryEffects[Category.axes]?.[0]
          )
        ).toBe(
          'Test ist genau auf die Bedürfnisse seiner Benutzer abgestimmt. Getroffene Gegner erleiden durch eine Luftdetonation schaden und werden zurückgeworfen.'
        );
      });

      it('Should create a description for quality improved with a average effect', () => {
        expect(
          createDescriptionDe(
            'Test',
            Quality.improved,
            EffectPower.average,
            categoryEffects[Category.axes]?.[0]
          )
        ).toBe(
          'Test ist genau auf die Bedürfnisse seiner Benutzer abgestimmt und zeichnet sich durch seine verbesserte Qualität aus. Getroffene Gegner erleiden durch eine Luftdetonation schaden und werden zurückgeworfen.'
        );
      });

      it('Should create a description for quality excellent with a average effect', () => {
        expect(
          createDescriptionDe(
            'Test',
            Quality.excellent,
            EffectPower.average,
            categoryEffects[Category.axes]?.[0]
          )
        ).toBe(
          'Test ist genau auf die Bedürfnisse seiner Benutzer abgestimmt und zeichnet sich durch seine ausgezeichnete Qualität aus. Getroffene Gegner erleiden durch eine Luftdetonation schaden und werden zurückgeworfen.'
        );
      });
    });

    describe('effect power strong', () => {
      it('Should create a description for quality normal with a strong effect', () => {
        expect(
          createDescriptionDe(
            'Test',
            Quality.normal,
            EffectPower.strong,
            categoryEffects[Category.axes]?.[0]
          )
        ).toBe(
          'Test ist genau auf die Bedürfnisse seiner Benutzer abgestimmt. Getroffene Gegner erleiden durch eine große Luftdetonation schaden und werden zurückgeworfen.'
        );
      });

      it('Should create a description for quality improved with a strong effect', () => {
        expect(
          createDescriptionDe(
            'Test',
            Quality.improved,
            EffectPower.strong,
            categoryEffects[Category.axes]?.[0]
          )
        ).toBe(
          'Test ist genau auf die Bedürfnisse seiner Benutzer abgestimmt und zeichnet sich durch seine verbesserte Qualität aus. Getroffene Gegner erleiden durch eine große Luftdetonation schaden und werden zurückgeworfen.'
        );
      });

      it('Should create a description for quality excellent with a strong effect', () => {
        expect(
          createDescriptionDe(
            'Test',
            Quality.excellent,
            EffectPower.strong,
            categoryEffects[Category.axes]?.[0]
          )
        ).toBe(
          'Test ist genau auf die Bedürfnisse seiner Benutzer abgestimmt und zeichnet sich durch seine ausgezeichnete Qualität aus. Getroffene Gegner erleiden durch eine große Luftdetonation schaden und werden zurückgeworfen.'
        );
      });
    });

    describe('errors', () => {
      it('Should throw an error if no effect has been defined and the effect power is weak', () => {
        expect(() =>
          createDescriptionDe(
            'Test',
            Quality.normal,
            EffectPower.weak,
            undefined
          )
        ).toThrow(Error);
      });

      it('Should throw an error if no effect has been defined and the effect power is average', () => {
        expect(() =>
          createDescriptionDe(
            'Test',
            Quality.normal,
            EffectPower.average,
            undefined
          )
        ).toThrow(Error);
      });

      it('Should throw an error if no effect has been defined and the effect power is strong', () => {
        expect(() =>
          createDescriptionDe(
            'Test',
            Quality.normal,
            EffectPower.strong,
            undefined
          )
        ).toThrow(Error);
      });

      it('Should throw an error if the effect power is invalid', () => {
        expect(() =>
          createDescriptionDe(
            'Test',
            Quality.normal,
            undefined as unknown as EffectPower,
            categoryEffects[Category.axes]?.[0]
          )
        ).toThrow(Error);
      });

      it('Should throw an error if the item name is empty', () => {
        expect(() =>
          createDescriptionDe('', Quality.normal, EffectPower.none)
        ).toThrow(Error);
      });

      it('Should throw an error if the item name is undefined', () => {
        expect(() =>
          createDescriptionDe(
            undefined as unknown as string,
            Quality.normal,
            EffectPower.none
          )
        ).toThrow(Error);
      });
    });
  });

  describe('createDescriptionEnUs', () => {
    describe('effect power none', () => {
      it('Should create a description for quality normal', () => {
        expect(
          createDescriptionEnUs('Test', Quality.normal, EffectPower.none)
        ).toBe('Test is exactly tailored to the needs of its users.');
      });

      it('Should create a description for quality improved', () => {
        expect(
          createDescriptionEnUs('Test', Quality.improved, EffectPower.none)
        ).toBe(
          'Test is exactly tailored to the needs of its users. It is characterized by its improved quality.'
        );
      });

      it('Should create a description for quality excellent', () => {
        expect(
          createDescriptionEnUs('Test', Quality.excellent, EffectPower.none)
        ).toBe(
          'Test is exactly tailored to the needs of its users. It is characterized by its excellent quality.'
        );
      });
    });

    describe('effect power weak', () => {
      it('Should create a description for quality normal with a weak effect', () => {
        expect(
          createDescriptionEnUs(
            'Test',
            Quality.normal,
            EffectPower.weak,
            categoryEffects[Category.axes]?.[0]
          )
        ).toBe(
          'Test is exactly tailored to the needs of its users. Attacked enemies suffer from a lesser air detonation and are thrown back.'
        );
      });

      it('Should create a description for quality improved with a weak effect', () => {
        expect(
          createDescriptionEnUs(
            'Test',
            Quality.improved,
            EffectPower.weak,
            categoryEffects[Category.axes]?.[0]
          )
        ).toBe(
          'Test is exactly tailored to the needs of its users. It is characterized by its improved quality. Attacked enemies suffer from a lesser air detonation and are thrown back.'
        );
      });

      it('Should create a description for quality excellent with a weak effect', () => {
        expect(
          createDescriptionEnUs(
            'Test',
            Quality.excellent,
            EffectPower.weak,
            categoryEffects[Category.axes]?.[0]
          )
        ).toBe(
          'Test is exactly tailored to the needs of its users. It is characterized by its excellent quality. Attacked enemies suffer from a lesser air detonation and are thrown back.'
        );
      });
    });

    describe('effect power average', () => {
      it('Should create a description for quality normal with a average effect', () => {
        expect(
          createDescriptionEnUs(
            'Test',
            Quality.normal,
            EffectPower.average,
            categoryEffects[Category.axes]?.[0]
          )
        ).toBe(
          'Test is exactly tailored to the needs of its users. Attacked enemies suffer from an air detonation and are thrown back.'
        );
      });

      it('Should create a description for quality improved with a average effect', () => {
        expect(
          createDescriptionEnUs(
            'Test',
            Quality.improved,
            EffectPower.average,
            categoryEffects[Category.axes]?.[0]
          )
        ).toBe(
          'Test is exactly tailored to the needs of its users. It is characterized by its improved quality. Attacked enemies suffer from an air detonation and are thrown back.'
        );
      });

      it('Should create a description for quality excellent with a average effect', () => {
        expect(
          createDescriptionEnUs(
            'Test',
            Quality.excellent,
            EffectPower.average,
            categoryEffects[Category.axes]?.[0]
          )
        ).toBe(
          'Test is exactly tailored to the needs of its users. It is characterized by its excellent quality. Attacked enemies suffer from an air detonation and are thrown back.'
        );
      });
    });

    describe('effect power strong', () => {
      it('Should create a description for quality normal with a strong effect', () => {
        expect(
          createDescriptionEnUs(
            'Test',
            Quality.normal,
            EffectPower.strong,
            categoryEffects[Category.axes]?.[0]
          )
        ).toBe(
          'Test is exactly tailored to the needs of its users. Attacked enemies suffer from a greater air detonation and are thrown back.'
        );
      });

      it('Should create a description for quality improved with a strong effect', () => {
        expect(
          createDescriptionEnUs(
            'Test',
            Quality.improved,
            EffectPower.strong,
            categoryEffects[Category.axes]?.[0]
          )
        ).toBe(
          'Test is exactly tailored to the needs of its users. It is characterized by its improved quality. Attacked enemies suffer from a greater air detonation and are thrown back.'
        );
      });

      it('Should create a description for quality excellent with a strong effect', () => {
        expect(
          createDescriptionEnUs(
            'Test',
            Quality.excellent,
            EffectPower.strong,
            categoryEffects[Category.axes]?.[0]
          )
        ).toBe(
          'Test is exactly tailored to the needs of its users. It is characterized by its excellent quality. Attacked enemies suffer from a greater air detonation and are thrown back.'
        );
      });
    });

    describe('errors', () => {
      it('Should throw an error if no effect has been defined and the effect power is weak', () => {
        expect(() =>
          createDescriptionEnUs(
            'Test',
            Quality.normal,
            EffectPower.weak,
            undefined
          )
        ).toThrow(Error);
      });

      it('Should throw an error if no effect has been defined and the effect power is average', () => {
        expect(() =>
          createDescriptionEnUs(
            'Test',
            Quality.normal,
            EffectPower.average,
            undefined
          )
        ).toThrow(Error);
      });

      it('Should throw an error if no effect has been defined and the effect power is strong', () => {
        expect(() =>
          createDescriptionEnUs(
            'Test',
            Quality.normal,
            EffectPower.strong,
            undefined
          )
        ).toThrow(Error);
      });

      it('Should throw an error if the effect power is invalid', () => {
        expect(() =>
          createDescriptionEnUs(
            'Test',
            Quality.normal,
            undefined as unknown as EffectPower,
            categoryEffects[Category.axes]?.[0]
          )
        ).toThrow(Error);
      });

      it('Should throw an error if the item name is empty', () => {
        expect(() =>
          createDescriptionEnUs('', Quality.normal, EffectPower.none)
        ).toThrow(Error);
      });

      it('Should throw an error if the item name is undefined', () => {
        expect(() =>
          createDescriptionEnUs(
            undefined as unknown as string,
            Quality.normal,
            EffectPower.none
          )
        ).toThrow(Error);
      });
    });
  });
});
