import { sortProperties } from './sort-properties';

describe('sortProperties', () => {
  it('Should sort properties', () => {
    expect(
      sortProperties({
        translations: {
          de: {
            name: 'nameDe',
            description: 'descriptionDe',
          },
          enUs: {
            name: 'nameEnUs',
            description: 'descriptionEnUs',
          },
        },
        prices: {
          EUR: 2,
        },
        _id: 'abcdef123456abcdef123456',
        category: 'axes',
        isInStock: true,
        quality: 'normal',
        effectPower: 'none',
        ean: 'ean',
        halfStars: 8,
        effect: 'effect',
        ratingCount: 100,
        type: 'singleSided',
        popularity: 1,
      })
    ).toEqual({
      _id: 'abcdef123456abcdef123456',
      category: 'axes',
      ean: 'ean',
      effect: 'effect',
      effectPower: 'none',
      halfStars: 8,
      isInStock: true,
      popularity: 1,
      prices: {
        EUR: 2,
      },
      quality: 'normal',
      ratingCount: 100,
      translations: {
        de: {
          name: 'nameDe',
          description: 'descriptionDe',
        },
        enUs: {
          name: 'nameEnUs',
          description: 'descriptionEnUs',
        },
      },
      type: 'singleSided',
    });
  });
});
