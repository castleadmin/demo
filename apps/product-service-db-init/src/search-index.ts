export const searchIndex = {
  storedSource: {
    include: [
      'popularity', // used for sorting
      'prices.EUR', // used for sorting
      'halfStars', // used for sorting
      'ratingCount', // used for sorting
      'category', // used for sorting and filtering
      'quality', // used for filtering
      'effectPower', // used for filtering
    ],
  },
  mappings: {
    dynamic: false,
    fields: {
      translations: {
        type: 'document',
        fields: {
          de: {
            type: 'document',
            fields: {
              name: [
                {
                  type: 'autocomplete',
                  analyzer: 'lucene.german',
                  minGrams: 4, // recommended default for nGram
                  maxGrams: 30, // average word length * 3
                  tokenization: 'nGram', // In the german language words are concatenated. Therefore, nGram is used.
                  foldDiacritics: true,
                },
                {
                  type: 'string',
                  analyzer: 'lucene.german',
                  indexOptions: 'freqs',
                  store: false,
                },
              ],
            },
          },
          enUs: {
            type: 'document',
            fields: {
              name: [
                {
                  type: 'autocomplete',
                  analyzer: 'lucene.english',
                  minGrams: 2,
                  maxGrams: 15, // average word length * 3
                  tokenization: 'edgeGram',
                  foldDiacritics: true,
                },
                {
                  type: 'string',
                  analyzer: 'lucene.english',
                  indexOptions: 'freqs',
                  store: false,
                },
              ],
            },
          },
        },
      },
    },
  },
};
