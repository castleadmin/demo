import { Language } from '@castleadmin/checkout-domain';
import {
  Category,
  EffectPower,
  Quality,
  SortOption,
} from '@castleadmin/product-domain';
import { ObjectId } from 'mongodb';
import { environment } from '../environments/environment';
import { createMockItem, createMockMongoClient } from '../specs/mocks.spec';
import { ItemRepositoryImplementation } from './item-repository-implementation';

describe('item-repository-implementation', () => {
  describe('getItem', () => {
    it('Should execute successfully', async () => {
      const { client, findOne } = createMockMongoClient();

      const repo = new ItemRepositoryImplementation(client);
      findOne.mockImplementation(() =>
        Promise.resolve(createMockItem('63b81f946b43c3ac6414be81'))
      );

      const result = await repo.getItem('63b81f946b43c3ac6414be81');

      expect(result).toEqual(createMockItem('63b81f946b43c3ac6414be81'));
      expect(findOne).toHaveBeenCalledTimes(1);
      expect(findOne).toHaveBeenCalledWith({
        _id: new ObjectId('63b81f946b43c3ac6414be81'),
      });
    });

    it('Should throw an error if the returned item is undefined', async () => {
      const { client, findOne } = createMockMongoClient();

      const repo = new ItemRepositoryImplementation(client);
      findOne.mockImplementation(() => Promise.resolve(undefined));

      await expect(
        repo.getItem('63b81f946b43c3ac6414be81')
      ).rejects.toBeInstanceOf(Error);
      expect(findOne).toHaveBeenCalledTimes(1);
      expect(findOne).toHaveBeenCalledWith({
        _id: new ObjectId('63b81f946b43c3ac6414be81'),
      });
    });
  });

  describe('countItems', () => {
    it('Should execute successfully without options', async () => {
      const { client, countDocuments } = createMockMongoClient();

      const repo = new ItemRepositoryImplementation(client);
      countDocuments.mockImplementation(() => Promise.resolve(30));

      const result = await repo.countItems();

      expect(result).toEqual(30);
      expect(countDocuments).toHaveBeenCalledTimes(1);
      expect(countDocuments).toHaveBeenCalledWith();
    });

    it('Should execute successfully with full options', async () => {
      const { client, countDocuments } = createMockMongoClient();

      const repo = new ItemRepositoryImplementation(client);
      countDocuments.mockImplementation(() => Promise.resolve(40));

      const result = await repo.countItems({
        category: Category.axes,
        qualities: [Quality.excellent],
        powers: [EffectPower.average, EffectPower.strong],
      });

      expect(result).toEqual(40);
      expect(countDocuments).toHaveBeenCalledTimes(1);
      expect(countDocuments).toHaveBeenCalledWith({
        category: Category.axes,
        quality: { $in: [Quality.excellent] },
        effectPower: { $in: [EffectPower.average, EffectPower.strong] },
      });
    });
  });

  describe('countSearchItems', () => {
    it('Should execute successfully without options', async () => {
      environment.searchIndexName = 'search-products-test';
      const { client, aggregate, aggregateToArray } = createMockMongoClient();

      const repo = new ItemRepositoryImplementation(client);
      aggregateToArray.mockImplementation(() =>
        Promise.resolve([{ count: 30 }])
      );

      const result = await repo.countSearchItems('axe', Language.enUs);

      expect(result).toEqual(30);
      expect(aggregate).toHaveBeenCalledTimes(1);
      expect(aggregate).toHaveBeenCalledWith([
        {
          $search: {
            index: environment.searchIndexName,
            returnStoredSource: true,
            compound: {
              should: [
                {
                  autocomplete: {
                    path: 'translations.enUs.name',
                    query: 'axe',
                    fuzzy: { maxEdits: 1 },
                    score: {
                      boost: {
                        value: 3,
                      },
                    },
                  },
                },
                {
                  text: {
                    path: 'translations.enUs.name',
                    query: 'axe',
                    fuzzy: {
                      maxEdits: 1,
                    },
                  },
                },
              ],
            },
          },
        },
        { $count: 'count' },
      ]);
    });

    it('Should execute successfully with empty options', async () => {
      environment.searchIndexName = 'search-products-test';
      const { client, aggregate, aggregateToArray } = createMockMongoClient();

      const repo = new ItemRepositoryImplementation(client);
      aggregateToArray.mockImplementation(() =>
        Promise.resolve([{ count: 30 }])
      );

      const result = await repo.countSearchItems('axe', Language.enUs, {});

      expect(result).toEqual(30);
      expect(aggregate).toHaveBeenCalledTimes(1);
      expect(aggregate).toHaveBeenCalledWith([
        {
          $search: {
            index: environment.searchIndexName,
            returnStoredSource: true,
            compound: {
              should: [
                {
                  autocomplete: {
                    path: 'translations.enUs.name',
                    query: 'axe',
                    fuzzy: { maxEdits: 1 },
                    score: {
                      boost: {
                        value: 3,
                      },
                    },
                  },
                },
                {
                  text: {
                    path: 'translations.enUs.name',
                    query: 'axe',
                    fuzzy: {
                      maxEdits: 1,
                    },
                  },
                },
              ],
            },
          },
        },
        { $count: 'count' },
      ]);
    });

    it('Should execute successfully with full options', async () => {
      environment.searchIndexName = 'search-products-test';
      const { client, aggregate, aggregateToArray } = createMockMongoClient();

      const repo = new ItemRepositoryImplementation(client);
      aggregateToArray.mockImplementation(() =>
        Promise.resolve([{ count: 40 }])
      );

      const result = await repo.countSearchItems('axe', Language.de, {
        category: Category.axes,
        qualities: [Quality.excellent],
        powers: [EffectPower.average, EffectPower.strong],
      });

      expect(result).toEqual(40);
      expect(aggregate).toHaveBeenCalledTimes(1);
      expect(aggregate).toHaveBeenCalledWith([
        {
          $search: {
            index: environment.searchIndexName,
            returnStoredSource: true,
            compound: {
              should: [
                {
                  autocomplete: {
                    path: 'translations.de.name',
                    query: 'axe',
                    fuzzy: { maxEdits: 1 },
                    score: {
                      boost: {
                        value: 3,
                      },
                    },
                  },
                },
                {
                  text: {
                    path: 'translations.de.name',
                    query: 'axe',
                    fuzzy: {
                      maxEdits: 1,
                    },
                  },
                },
              ],
            },
          },
        },
        {
          $match: {
            category: Category.axes,
            quality: { $in: [Quality.excellent] },
            effectPower: { $in: [EffectPower.average, EffectPower.strong] },
          },
        },
        { $count: 'count' },
      ]);
    });

    it('Should execute successfully and return 0 if the result array has size 0', async () => {
      environment.searchIndexName = 'search-products-test';
      const { client, aggregate, aggregateToArray } = createMockMongoClient();

      const repo = new ItemRepositoryImplementation(client);
      aggregateToArray.mockImplementation(() => Promise.resolve([]));

      const result = await repo.countSearchItems('axe', Language.enUs);

      expect(result).toBe(0);
      expect(aggregate).toHaveBeenCalledTimes(1);
      expect(aggregate).toHaveBeenCalledWith([
        {
          $search: {
            index: environment.searchIndexName,
            returnStoredSource: true,
            compound: {
              should: [
                {
                  autocomplete: {
                    path: 'translations.enUs.name',
                    query: 'axe',
                    fuzzy: { maxEdits: 1 },
                    score: {
                      boost: {
                        value: 3,
                      },
                    },
                  },
                },
                {
                  text: {
                    path: 'translations.enUs.name',
                    query: 'axe',
                    fuzzy: {
                      maxEdits: 1,
                    },
                  },
                },
              ],
            },
          },
        },
        { $count: 'count' },
      ]);
    });

    it('Should throw an error if the result array has size 2', async () => {
      environment.searchIndexName = 'search-products-test';
      const { client, aggregate, aggregateToArray } = createMockMongoClient();

      const repo = new ItemRepositoryImplementation(client);
      aggregateToArray.mockImplementation(() =>
        Promise.resolve([{ count: 30 }, { count: 30 }])
      );

      const result = repo.countSearchItems('axe', Language.enUs);

      await expect(result).rejects.toBeInstanceOf(Error);
      expect(aggregate).toHaveBeenCalledTimes(1);
      expect(aggregate).toHaveBeenCalledWith([
        {
          $search: {
            index: environment.searchIndexName,
            returnStoredSource: true,
            compound: {
              should: [
                {
                  autocomplete: {
                    path: 'translations.enUs.name',
                    query: 'axe',
                    fuzzy: { maxEdits: 1 },
                    score: {
                      boost: {
                        value: 3,
                      },
                    },
                  },
                },
                {
                  text: {
                    path: 'translations.enUs.name',
                    query: 'axe',
                    fuzzy: {
                      maxEdits: 1,
                    },
                  },
                },
              ],
            },
          },
        },
        { $count: 'count' },
      ]);
    });

    it('Should throw an error if the result array has an invalid count', async () => {
      environment.searchIndexName = 'search-products-test';
      const { client, aggregate, aggregateToArray } = createMockMongoClient();

      const repo = new ItemRepositoryImplementation(client);
      aggregateToArray.mockImplementation(() => Promise.resolve([{}]));

      const result = repo.countSearchItems('axe', Language.enUs);

      await expect(result).rejects.toBeInstanceOf(Error);
      expect(aggregate).toHaveBeenCalledTimes(1);
      expect(aggregate).toHaveBeenCalledWith([
        {
          $search: {
            index: environment.searchIndexName,
            returnStoredSource: true,
            compound: {
              should: [
                {
                  autocomplete: {
                    path: 'translations.enUs.name',
                    query: 'axe',
                    fuzzy: { maxEdits: 1 },
                    score: {
                      boost: {
                        value: 3,
                      },
                    },
                  },
                },
                {
                  text: {
                    path: 'translations.enUs.name',
                    query: 'axe',
                    fuzzy: {
                      maxEdits: 1,
                    },
                  },
                },
              ],
            },
          },
        },
        { $count: 'count' },
      ]);
    });

    it("Should throw an error if the locale isn't supported", async () => {
      environment.searchIndexName = 'search-products-test';
      const { client, aggregate, aggregateToArray } = createMockMongoClient();

      const repo = new ItemRepositoryImplementation(client);
      aggregateToArray.mockImplementation(() =>
        Promise.resolve([{ count: 30 }])
      );

      const result = repo.countSearchItems('axe', 'fr' as Language);

      await expect(result).rejects.toBeInstanceOf(Error);
      expect(aggregate).toHaveBeenCalledTimes(0);
    });
  });

  describe('getItems', () => {
    it('Should execute successfully without options', async () => {
      const { client, find, findToArray } = createMockMongoClient();

      const repo = new ItemRepositoryImplementation(client);
      findToArray.mockImplementation(() =>
        Promise.resolve([
          createMockItem('63b81f946b43c3ac6414be81'),
          createMockItem('63b81f946b43c3ac6414be82'),
        ])
      );

      const result = await repo.getItems(0, 10);

      expect(result).toEqual([
        createMockItem('63b81f946b43c3ac6414be81'),
        createMockItem('63b81f946b43c3ac6414be82'),
      ]);
      expect(find).toHaveBeenCalledTimes(1);
      expect(find).toHaveBeenCalledWith(
        {},
        {
          sort: { _id: 1 },
          skip: 0,
          limit: 10,
        }
      );
    });

    it('Should execute successfully with full options', async () => {
      const { client, find, findToArray } = createMockMongoClient();

      const repo = new ItemRepositoryImplementation(client);
      findToArray.mockImplementation(() =>
        Promise.resolve([
          createMockItem('63b81f946b43c3ac6414be81'),
          createMockItem('63b81f946b43c3ac6414be82'),
        ])
      );

      const result = await repo.getItems(3, 20, {
        category: Category.swords,
        qualities: [Quality.excellent, Quality.normal],
        powers: [EffectPower.average],
        sort: SortOption.review,
      });

      expect(result).toEqual([
        createMockItem('63b81f946b43c3ac6414be81'),
        createMockItem('63b81f946b43c3ac6414be82'),
      ]);
      expect(find).toHaveBeenCalledTimes(1);
      expect(find).toHaveBeenCalledWith(
        {
          category: Category.swords,
          quality: { $in: [Quality.excellent, Quality.normal] },
          effectPower: { $in: [EffectPower.average] },
        },
        {
          sort: { halfStars: -1, ratingCount: -1, _id: 1 },
          skip: 3,
          limit: 20,
        }
      );
    });

    describe('sort options', () => {
      it('Should execute successfully without sort option', async () => {
        const { client, find, findToArray } = createMockMongoClient();

        const repo = new ItemRepositoryImplementation(client);
        findToArray.mockImplementation(() =>
          Promise.resolve([
            createMockItem('63b81f946b43c3ac6414be81'),
            createMockItem('63b81f946b43c3ac6414be82'),
          ])
        );

        const result = await repo.getItems(1, 11);

        expect(result).toEqual([
          createMockItem('63b81f946b43c3ac6414be81'),
          createMockItem('63b81f946b43c3ac6414be82'),
        ]);
        expect(find).toHaveBeenCalledTimes(1);
        expect(find).toHaveBeenCalledWith(
          {},
          {
            sort: { _id: 1 },
            skip: 1,
            limit: 11,
          }
        );
      });

      it('Should execute successfully without sort option and with category option', async () => {
        const { client, find, findToArray } = createMockMongoClient();

        const repo = new ItemRepositoryImplementation(client);
        findToArray.mockImplementation(() =>
          Promise.resolve([
            createMockItem('63b81f946b43c3ac6414be81'),
            createMockItem('63b81f946b43c3ac6414be82'),
          ])
        );

        const result = await repo.getItems(1, 11, {
          category: Category.swords,
        });

        expect(result).toEqual([
          createMockItem('63b81f946b43c3ac6414be81'),
          createMockItem('63b81f946b43c3ac6414be82'),
        ]);
        expect(find).toHaveBeenCalledTimes(1);
        expect(find).toHaveBeenCalledWith(
          { category: Category.swords },
          {
            sort: { category: 1, _id: 1 },
            skip: 1,
            limit: 11,
          }
        );
      });

      it('Should execute successfully with sort option bestResults', async () => {
        const { client, find, findToArray } = createMockMongoClient();

        const repo = new ItemRepositoryImplementation(client);
        findToArray.mockImplementation(() =>
          Promise.resolve([
            createMockItem('63b81f946b43c3ac6414be81'),
            createMockItem('63b81f946b43c3ac6414be82'),
          ])
        );

        const result = await repo.getItems(1, 11, {
          sort: SortOption.bestResults,
        });

        expect(result).toEqual([
          createMockItem('63b81f946b43c3ac6414be81'),
          createMockItem('63b81f946b43c3ac6414be82'),
        ]);
        expect(find).toHaveBeenCalledTimes(1);
        expect(find).toHaveBeenCalledWith(
          {},
          {
            sort: { _id: 1 },
            skip: 1,
            limit: 11,
          }
        );
      });

      it('Should execute successfully with sort option popularity', async () => {
        const { client, find, findToArray } = createMockMongoClient();

        const repo = new ItemRepositoryImplementation(client);
        findToArray.mockImplementation(() =>
          Promise.resolve([
            createMockItem('63b81f946b43c3ac6414be81'),
            createMockItem('63b81f946b43c3ac6414be82'),
          ])
        );

        const result = await repo.getItems(1, 11, {
          sort: SortOption.popularity,
        });

        expect(result).toEqual([
          createMockItem('63b81f946b43c3ac6414be81'),
          createMockItem('63b81f946b43c3ac6414be82'),
        ]);
        expect(find).toHaveBeenCalledTimes(1);
        expect(find).toHaveBeenCalledWith(
          {},
          {
            sort: { popularity: -1, _id: 1 },
            skip: 1,
            limit: 11,
          }
        );
      });

      it('Should execute successfully with sort option price ascending', async () => {
        const { client, find, findToArray } = createMockMongoClient();

        const repo = new ItemRepositoryImplementation(client);
        findToArray.mockImplementation(() =>
          Promise.resolve([
            createMockItem('63b81f946b43c3ac6414be81'),
            createMockItem('63b81f946b43c3ac6414be82'),
          ])
        );

        const result = await repo.getItems(1, 11, {
          sort: SortOption.priceAscending,
        });

        expect(result).toEqual([
          createMockItem('63b81f946b43c3ac6414be81'),
          createMockItem('63b81f946b43c3ac6414be82'),
        ]);
        expect(find).toHaveBeenCalledTimes(1);
        expect(find).toHaveBeenCalledWith(
          {},
          {
            sort: { 'prices.EUR': 1, _id: 1 },
            skip: 1,
            limit: 11,
          }
        );
      });

      it('Should execute successfully with sort option price descending', async () => {
        const { client, find, findToArray } = createMockMongoClient();

        const repo = new ItemRepositoryImplementation(client);
        findToArray.mockImplementation(() =>
          Promise.resolve([
            createMockItem('63b81f946b43c3ac6414be81'),
            createMockItem('63b81f946b43c3ac6414be82'),
          ])
        );

        const result = await repo.getItems(1, 11, {
          sort: SortOption.priceDescending,
        });

        expect(result).toEqual([
          createMockItem('63b81f946b43c3ac6414be81'),
          createMockItem('63b81f946b43c3ac6414be82'),
        ]);
        expect(find).toHaveBeenCalledTimes(1);
        expect(find).toHaveBeenCalledWith(
          {},
          {
            sort: { 'prices.EUR': -1, _id: 1 },
            skip: 1,
            limit: 11,
          }
        );
      });

      it('Should execute successfully with sort option review', async () => {
        const { client, find, findToArray } = createMockMongoClient();

        const repo = new ItemRepositoryImplementation(client);
        findToArray.mockImplementation(() =>
          Promise.resolve([
            createMockItem('63b81f946b43c3ac6414be81'),
            createMockItem('63b81f946b43c3ac6414be82'),
          ])
        );

        const result = await repo.getItems(1, 11, { sort: SortOption.review });

        expect(result).toEqual([
          createMockItem('63b81f946b43c3ac6414be81'),
          createMockItem('63b81f946b43c3ac6414be82'),
        ]);
        expect(find).toHaveBeenCalledTimes(1);
        expect(find).toHaveBeenCalledWith(
          {},
          {
            sort: { halfStars: -1, ratingCount: -1, _id: 1 },
            skip: 1,
            limit: 11,
          }
        );
      });
    });
  });

  describe('searchItems', () => {
    it('Should execute successfully without options', async () => {
      environment.productsCollectionName = 'products-test';
      environment.searchIndexName = 'search-products-test';
      const { client, aggregate, aggregateToArray } = createMockMongoClient();

      const repo = new ItemRepositoryImplementation(client);
      aggregateToArray.mockImplementation(() =>
        Promise.resolve([
          createMockItem('63b81f946b43c3ac6414be81'),
          createMockItem('63b81f946b43c3ac6414be82'),
        ])
      );

      const result = await repo.searchItems('axe', Language.enUs, 0, 10);

      expect(result).toEqual([
        createMockItem('63b81f946b43c3ac6414be81'),
        createMockItem('63b81f946b43c3ac6414be82'),
      ]);
      expect(aggregate).toHaveBeenCalledTimes(1);
      expect(aggregate).toHaveBeenCalledWith([
        {
          $search: {
            index: environment.searchIndexName,
            returnStoredSource: true,
            compound: {
              should: [
                {
                  autocomplete: {
                    path: 'translations.enUs.name',
                    query: 'axe',
                    fuzzy: { maxEdits: 1 },
                    score: {
                      boost: {
                        value: 3,
                      },
                    },
                  },
                },
                {
                  text: {
                    path: 'translations.enUs.name',
                    query: 'axe',
                    fuzzy: {
                      maxEdits: 1,
                    },
                  },
                },
              ],
            },
          },
        },
        { $sort: { _id: 1 } },
        { $skip: 0 },
        { $limit: 10 },
        {
          $lookup: {
            as: 'itemLookup',
            foreignField: '_id',
            from: environment.productsCollectionName,
            localField: '_id',
          },
        },
        { $replaceRoot: { newRoot: { $arrayElemAt: ['$itemLookup', 0] } } },
      ]);
    });

    it('Should execute successfully with empty options', async () => {
      environment.productsCollectionName = 'products-test';
      environment.searchIndexName = 'search-products-test';
      const { client, aggregate, aggregateToArray } = createMockMongoClient();

      const repo = new ItemRepositoryImplementation(client);
      aggregateToArray.mockImplementation(() =>
        Promise.resolve([
          createMockItem('63b81f946b43c3ac6414be81'),
          createMockItem('63b81f946b43c3ac6414be82'),
        ])
      );

      const result = await repo.searchItems('axe', Language.enUs, 0, 10, {});

      expect(result).toEqual([
        createMockItem('63b81f946b43c3ac6414be81'),
        createMockItem('63b81f946b43c3ac6414be82'),
      ]);
      expect(aggregate).toHaveBeenCalledTimes(1);
      expect(aggregate).toHaveBeenCalledWith([
        {
          $search: {
            index: environment.searchIndexName,
            returnStoredSource: true,
            compound: {
              should: [
                {
                  autocomplete: {
                    path: 'translations.enUs.name',
                    query: 'axe',
                    fuzzy: { maxEdits: 1 },
                    score: {
                      boost: {
                        value: 3,
                      },
                    },
                  },
                },
                {
                  text: {
                    path: 'translations.enUs.name',
                    query: 'axe',
                    fuzzy: {
                      maxEdits: 1,
                    },
                  },
                },
              ],
            },
          },
        },
        { $sort: { _id: 1 } },
        { $skip: 0 },
        { $limit: 10 },
        {
          $lookup: {
            as: 'itemLookup',
            foreignField: '_id',
            from: environment.productsCollectionName,
            localField: '_id',
          },
        },
        { $replaceRoot: { newRoot: { $arrayElemAt: ['$itemLookup', 0] } } },
      ]);
    });

    it('Should execute successfully with full options', async () => {
      environment.productsCollectionName = 'products-test';
      environment.searchIndexName = 'search-products-test';
      const { client, aggregate, aggregateToArray } = createMockMongoClient();

      const repo = new ItemRepositoryImplementation(client);
      aggregateToArray.mockImplementation(() =>
        Promise.resolve([
          createMockItem('63b81f946b43c3ac6414be81'),
          createMockItem('63b81f946b43c3ac6414be82'),
        ])
      );

      const result = await repo.searchItems('axe', Language.de, 3, 20, {
        category: Category.swords,
        qualities: [Quality.excellent, Quality.normal],
        powers: [EffectPower.average],
        sort: SortOption.review,
      });

      expect(result).toEqual([
        createMockItem('63b81f946b43c3ac6414be81'),
        createMockItem('63b81f946b43c3ac6414be82'),
      ]);
      expect(aggregate).toHaveBeenCalledTimes(1);
      expect(aggregate).toHaveBeenCalledWith([
        {
          $search: {
            index: environment.searchIndexName,
            returnStoredSource: true,
            compound: {
              should: [
                {
                  autocomplete: {
                    path: 'translations.de.name',
                    query: 'axe',
                    fuzzy: { maxEdits: 1 },
                    score: {
                      boost: {
                        value: 3,
                      },
                    },
                  },
                },
                {
                  text: {
                    path: 'translations.de.name',
                    query: 'axe',
                    fuzzy: {
                      maxEdits: 1,
                    },
                  },
                },
              ],
            },
          },
        },
        {
          $match: {
            category: Category.swords,
            quality: { $in: [Quality.excellent, Quality.normal] },
            effectPower: { $in: [EffectPower.average] },
          },
        },
        { $sort: { halfStars: -1, ratingCount: -1, _id: 1 } },
        { $skip: 3 },
        { $limit: 20 },
        {
          $lookup: {
            as: 'itemLookup',
            foreignField: '_id',
            from: environment.productsCollectionName,
            localField: '_id',
          },
        },
        { $replaceRoot: { newRoot: { $arrayElemAt: ['$itemLookup', 0] } } },
      ]);
    });

    it("Should throw an error if the locale isn't supported", async () => {
      environment.productsCollectionName = 'products-test';
      environment.searchIndexName = 'search-products-test';
      const { client, aggregate, aggregateToArray } = createMockMongoClient();

      const repo = new ItemRepositoryImplementation(client);
      aggregateToArray.mockImplementation(() =>
        Promise.resolve([
          createMockItem('63b81f946b43c3ac6414be81'),
          createMockItem('63b81f946b43c3ac6414be82'),
        ])
      );

      const result = repo.searchItems('axe', 'fr' as Language, 0, 10);

      await expect(result).rejects.toBeInstanceOf(Error);
      expect(aggregate).toHaveBeenCalledTimes(0);
    });

    describe('sort options', () => {
      it('Should execute successfully without sort option', async () => {
        environment.productsCollectionName = 'products-test';
        environment.searchIndexName = 'search-products-test';
        const { client, aggregate, aggregateToArray } = createMockMongoClient();

        const repo = new ItemRepositoryImplementation(client);
        aggregateToArray.mockImplementation(() =>
          Promise.resolve([
            createMockItem('63b81f946b43c3ac6414be81'),
            createMockItem('63b81f946b43c3ac6414be82'),
          ])
        );

        const result = await repo.searchItems('axe', Language.enUs, 1, 11);

        expect(result).toEqual([
          createMockItem('63b81f946b43c3ac6414be81'),
          createMockItem('63b81f946b43c3ac6414be82'),
        ]);
        expect(aggregate).toHaveBeenCalledTimes(1);
        expect(aggregate).toHaveBeenCalledWith([
          {
            $search: {
              index: environment.searchIndexName,
              returnStoredSource: true,
              compound: {
                should: [
                  {
                    autocomplete: {
                      path: 'translations.enUs.name',
                      query: 'axe',
                      fuzzy: { maxEdits: 1 },
                      score: {
                        boost: {
                          value: 3,
                        },
                      },
                    },
                  },
                  {
                    text: {
                      path: 'translations.enUs.name',
                      query: 'axe',
                      fuzzy: {
                        maxEdits: 1,
                      },
                    },
                  },
                ],
              },
            },
          },
          { $sort: { _id: 1 } },
          { $skip: 1 },
          { $limit: 11 },
          {
            $lookup: {
              as: 'itemLookup',
              foreignField: '_id',
              from: environment.productsCollectionName,
              localField: '_id',
            },
          },
          { $replaceRoot: { newRoot: { $arrayElemAt: ['$itemLookup', 0] } } },
        ]);
      });

      it('Should execute successfully without sort option and with category option', async () => {
        environment.productsCollectionName = 'products-test';
        environment.searchIndexName = 'search-products-test';
        const { client, aggregate, aggregateToArray } = createMockMongoClient();

        const repo = new ItemRepositoryImplementation(client);
        aggregateToArray.mockImplementation(() =>
          Promise.resolve([
            createMockItem('63b81f946b43c3ac6414be81'),
            createMockItem('63b81f946b43c3ac6414be82'),
          ])
        );

        const result = await repo.searchItems('axe', Language.enUs, 1, 11, {
          category: Category.swords,
        });

        expect(result).toEqual([
          createMockItem('63b81f946b43c3ac6414be81'),
          createMockItem('63b81f946b43c3ac6414be82'),
        ]);
        expect(aggregate).toHaveBeenCalledTimes(1);
        expect(aggregate).toHaveBeenCalledWith([
          {
            $search: {
              index: environment.searchIndexName,
              returnStoredSource: true,
              compound: {
                should: [
                  {
                    autocomplete: {
                      path: 'translations.enUs.name',
                      query: 'axe',
                      fuzzy: { maxEdits: 1 },
                      score: {
                        boost: {
                          value: 3,
                        },
                      },
                    },
                  },
                  {
                    text: {
                      path: 'translations.enUs.name',
                      query: 'axe',
                      fuzzy: {
                        maxEdits: 1,
                      },
                    },
                  },
                ],
              },
            },
          },
          { $match: { category: Category.swords } },
          { $sort: { category: 1, _id: 1 } },
          { $skip: 1 },
          { $limit: 11 },
          {
            $lookup: {
              as: 'itemLookup',
              foreignField: '_id',
              from: environment.productsCollectionName,
              localField: '_id',
            },
          },
          { $replaceRoot: { newRoot: { $arrayElemAt: ['$itemLookup', 0] } } },
        ]);
      });

      it('Should execute successfully with sort option bestResults', async () => {
        environment.productsCollectionName = 'products-test';
        environment.searchIndexName = 'search-products-test';
        const { client, aggregate, aggregateToArray } = createMockMongoClient();

        const repo = new ItemRepositoryImplementation(client);
        aggregateToArray.mockImplementation(() =>
          Promise.resolve([
            createMockItem('63b81f946b43c3ac6414be81'),
            createMockItem('63b81f946b43c3ac6414be82'),
          ])
        );

        const result = await repo.searchItems('axe', Language.enUs, 1, 11, {
          sort: SortOption.bestResults,
        });

        expect(result).toEqual([
          createMockItem('63b81f946b43c3ac6414be81'),
          createMockItem('63b81f946b43c3ac6414be82'),
        ]);
        expect(aggregate).toHaveBeenCalledTimes(1);
        expect(aggregate).toHaveBeenCalledWith([
          {
            $search: {
              index: environment.searchIndexName,
              returnStoredSource: true,
              compound: {
                should: [
                  {
                    autocomplete: {
                      path: 'translations.enUs.name',
                      query: 'axe',
                      fuzzy: { maxEdits: 1 },
                      score: {
                        boost: {
                          value: 3,
                        },
                      },
                    },
                  },
                  {
                    text: {
                      path: 'translations.enUs.name',
                      query: 'axe',
                      fuzzy: {
                        maxEdits: 1,
                      },
                    },
                  },
                ],
              },
            },
          },
          { $skip: 1 },
          { $limit: 11 },
          {
            $lookup: {
              as: 'itemLookup',
              foreignField: '_id',
              from: environment.productsCollectionName,
              localField: '_id',
            },
          },
          { $replaceRoot: { newRoot: { $arrayElemAt: ['$itemLookup', 0] } } },
        ]);
      });

      it('Should execute successfully with sort option popularity', async () => {
        environment.productsCollectionName = 'products-test';
        environment.searchIndexName = 'search-products-test';
        const { client, aggregate, aggregateToArray } = createMockMongoClient();

        const repo = new ItemRepositoryImplementation(client);
        aggregateToArray.mockImplementation(() =>
          Promise.resolve([
            createMockItem('63b81f946b43c3ac6414be81'),
            createMockItem('63b81f946b43c3ac6414be82'),
          ])
        );

        const result = await repo.searchItems('axe', Language.enUs, 1, 11, {
          sort: SortOption.popularity,
        });

        expect(result).toEqual([
          createMockItem('63b81f946b43c3ac6414be81'),
          createMockItem('63b81f946b43c3ac6414be82'),
        ]);
        expect(aggregate).toHaveBeenCalledTimes(1);
        expect(aggregate).toHaveBeenCalledWith([
          {
            $search: {
              index: environment.searchIndexName,
              returnStoredSource: true,
              compound: {
                should: [
                  {
                    autocomplete: {
                      path: 'translations.enUs.name',
                      query: 'axe',
                      fuzzy: { maxEdits: 1 },
                      score: {
                        boost: {
                          value: 3,
                        },
                      },
                    },
                  },
                  {
                    text: {
                      path: 'translations.enUs.name',
                      query: 'axe',
                      fuzzy: {
                        maxEdits: 1,
                      },
                    },
                  },
                ],
              },
            },
          },
          { $sort: { popularity: -1, _id: 1 } },
          { $skip: 1 },
          { $limit: 11 },
          {
            $lookup: {
              as: 'itemLookup',
              foreignField: '_id',
              from: environment.productsCollectionName,
              localField: '_id',
            },
          },
          { $replaceRoot: { newRoot: { $arrayElemAt: ['$itemLookup', 0] } } },
        ]);
      });

      it('Should execute successfully with sort option price ascending', async () => {
        environment.productsCollectionName = 'products-test';
        environment.searchIndexName = 'search-products-test';
        const { client, aggregate, aggregateToArray } = createMockMongoClient();

        const repo = new ItemRepositoryImplementation(client);
        aggregateToArray.mockImplementation(() =>
          Promise.resolve([
            createMockItem('63b81f946b43c3ac6414be81'),
            createMockItem('63b81f946b43c3ac6414be82'),
          ])
        );

        const result = await repo.searchItems('axe', Language.enUs, 1, 11, {
          sort: SortOption.priceAscending,
        });

        expect(result).toEqual([
          createMockItem('63b81f946b43c3ac6414be81'),
          createMockItem('63b81f946b43c3ac6414be82'),
        ]);
        expect(aggregate).toHaveBeenCalledTimes(1);
        expect(aggregate).toHaveBeenCalledWith([
          {
            $search: {
              index: environment.searchIndexName,
              returnStoredSource: true,
              compound: {
                should: [
                  {
                    autocomplete: {
                      path: 'translations.enUs.name',
                      query: 'axe',
                      fuzzy: { maxEdits: 1 },
                      score: {
                        boost: {
                          value: 3,
                        },
                      },
                    },
                  },
                  {
                    text: {
                      path: 'translations.enUs.name',
                      query: 'axe',
                      fuzzy: {
                        maxEdits: 1,
                      },
                    },
                  },
                ],
              },
            },
          },
          { $sort: { 'prices.EUR': 1, _id: 1 } },
          { $skip: 1 },
          { $limit: 11 },
          {
            $lookup: {
              as: 'itemLookup',
              foreignField: '_id',
              from: environment.productsCollectionName,
              localField: '_id',
            },
          },
          { $replaceRoot: { newRoot: { $arrayElemAt: ['$itemLookup', 0] } } },
        ]);
      });

      it('Should execute successfully with sort option price descending', async () => {
        environment.productsCollectionName = 'products-test';
        environment.searchIndexName = 'search-products-test';
        const { client, aggregate, aggregateToArray } = createMockMongoClient();

        const repo = new ItemRepositoryImplementation(client);
        aggregateToArray.mockImplementation(() =>
          Promise.resolve([
            createMockItem('63b81f946b43c3ac6414be81'),
            createMockItem('63b81f946b43c3ac6414be82'),
          ])
        );

        const result = await repo.searchItems('axe', Language.enUs, 1, 11, {
          sort: SortOption.priceDescending,
        });

        expect(result).toEqual([
          createMockItem('63b81f946b43c3ac6414be81'),
          createMockItem('63b81f946b43c3ac6414be82'),
        ]);
        expect(aggregate).toHaveBeenCalledTimes(1);
        expect(aggregate).toHaveBeenCalledWith([
          {
            $search: {
              index: environment.searchIndexName,
              returnStoredSource: true,
              compound: {
                should: [
                  {
                    autocomplete: {
                      path: 'translations.enUs.name',
                      query: 'axe',
                      fuzzy: { maxEdits: 1 },
                      score: {
                        boost: {
                          value: 3,
                        },
                      },
                    },
                  },
                  {
                    text: {
                      path: 'translations.enUs.name',
                      query: 'axe',
                      fuzzy: {
                        maxEdits: 1,
                      },
                    },
                  },
                ],
              },
            },
          },
          { $sort: { 'prices.EUR': -1, _id: 1 } },
          { $skip: 1 },
          { $limit: 11 },
          {
            $lookup: {
              as: 'itemLookup',
              foreignField: '_id',
              from: environment.productsCollectionName,
              localField: '_id',
            },
          },
          { $replaceRoot: { newRoot: { $arrayElemAt: ['$itemLookup', 0] } } },
        ]);
      });

      it('Should execute successfully with sort option review', async () => {
        environment.productsCollectionName = 'products-test';
        environment.searchIndexName = 'search-products-test';
        const { client, aggregate, aggregateToArray } = createMockMongoClient();

        const repo = new ItemRepositoryImplementation(client);
        aggregateToArray.mockImplementation(() =>
          Promise.resolve([
            createMockItem('63b81f946b43c3ac6414be81'),
            createMockItem('63b81f946b43c3ac6414be82'),
          ])
        );

        const result = await repo.searchItems('axe', Language.enUs, 1, 11, {
          sort: SortOption.review,
        });

        expect(result).toEqual([
          createMockItem('63b81f946b43c3ac6414be81'),
          createMockItem('63b81f946b43c3ac6414be82'),
        ]);
        expect(aggregate).toHaveBeenCalledTimes(1);
        expect(aggregate).toHaveBeenCalledWith([
          {
            $search: {
              index: environment.searchIndexName,
              returnStoredSource: true,
              compound: {
                should: [
                  {
                    autocomplete: {
                      path: 'translations.enUs.name',
                      query: 'axe',
                      fuzzy: { maxEdits: 1 },
                      score: {
                        boost: {
                          value: 3,
                        },
                      },
                    },
                  },
                  {
                    text: {
                      path: 'translations.enUs.name',
                      query: 'axe',
                      fuzzy: {
                        maxEdits: 1,
                      },
                    },
                  },
                ],
              },
            },
          },
          { $sort: { halfStars: -1, ratingCount: -1, _id: 1 } },
          { $skip: 1 },
          { $limit: 11 },
          {
            $lookup: {
              as: 'itemLookup',
              foreignField: '_id',
              from: environment.productsCollectionName,
              localField: '_id',
            },
          },
          { $replaceRoot: { newRoot: { $arrayElemAt: ['$itemLookup', 0] } } },
        ]);
      });
    });
  });

  describe('getItemsById', () => {
    it('Should execute successfully', async () => {
      const { client, find, findToArray } = createMockMongoClient();

      const repo = new ItemRepositoryImplementation(client);
      findToArray.mockImplementation(() =>
        Promise.resolve([
          createMockItem('63b81f946b43c3ac6414be81'),
          createMockItem('63b81f946b43c3ac6414be82'),
        ])
      );

      const result = await repo.getItemsById([
        '63b81f946b43c3ac6414be81',
        '63b81f946b43c3ac6414be82',
      ]);

      expect(result).toEqual({
        hasValidItems: true,
        invalidIds: [],
        items: [
          createMockItem('63b81f946b43c3ac6414be81'),
          createMockItem('63b81f946b43c3ac6414be82'),
        ],
      });
      expect(find).toHaveBeenCalledTimes(1);
      expect(find).toHaveBeenCalledWith(
        {
          _id: {
            $in: [
              new ObjectId('63b81f946b43c3ac6414be81'),
              new ObjectId('63b81f946b43c3ac6414be82'),
            ],
          },
        },
        {
          sort: { _id: 1 },
        }
      );
    });

    it('Should execute successfully with invalid IDs', async () => {
      const { client, find, findToArray } = createMockMongoClient();

      const repo = new ItemRepositoryImplementation(client);
      findToArray.mockImplementation(() =>
        Promise.resolve([
          createMockItem('63b81f946b43c3ac6414be81'),
          createMockItem('63b81f946b43c3ac6414be82'),
        ])
      );

      const result = await repo.getItemsById([
        '63b81f946b43c3ac6414be81',
        '63b81f946b43c3ac6414be8a',
        '63b81f946b43c3ac6414be8b',
        '63b81f946b43c3ac6414be82',
      ]);

      expect(result).toEqual({
        hasValidItems: true,
        invalidIds: ['63b81f946b43c3ac6414be8a', '63b81f946b43c3ac6414be8b'],
        items: [
          createMockItem('63b81f946b43c3ac6414be81'),
          createMockItem('63b81f946b43c3ac6414be82'),
        ],
      });
      expect(find).toHaveBeenCalledTimes(1);
      expect(find).toHaveBeenCalledWith(
        {
          _id: {
            $in: [
              new ObjectId('63b81f946b43c3ac6414be81'),
              new ObjectId('63b81f946b43c3ac6414be8a'),
              new ObjectId('63b81f946b43c3ac6414be8b'),
              new ObjectId('63b81f946b43c3ac6414be82'),
            ],
          },
        },
        {
          sort: { _id: 1 },
        }
      );
    });

    it('Should execute successfully with only invalid IDs', async () => {
      const { client, find, findToArray } = createMockMongoClient();

      const repo = new ItemRepositoryImplementation(client);
      findToArray.mockImplementation(() => Promise.resolve([]));

      const result = await repo.getItemsById([
        '63b81f946b43c3ac6414be8a',
        '63b81f946b43c3ac6414be8b',
      ]);

      expect(result).toEqual({
        hasValidItems: false,
        invalidIds: ['63b81f946b43c3ac6414be8a', '63b81f946b43c3ac6414be8b'],
        items: [],
      });
      expect(find).toHaveBeenCalledTimes(1);
      expect(find).toHaveBeenCalledWith(
        {
          _id: {
            $in: [
              new ObjectId('63b81f946b43c3ac6414be8a'),
              new ObjectId('63b81f946b43c3ac6414be8b'),
            ],
          },
        },
        {
          sort: { _id: 1 },
        }
      );
    });
  });
});
