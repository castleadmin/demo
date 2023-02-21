import { Language } from '@castleadmin/checkout-domain';
import {
  Category,
  EffectPower,
  Item,
  ItemRepository,
  Quality,
  SortOption,
} from '@castleadmin/product-domain';
import {
  Document,
  Filter,
  MongoClient,
  ObjectId,
  SortDirection,
} from 'mongodb';
import { environment } from '../environments/environment';

type ItemDb = Omit<Item, '_id'> & { _id: ObjectId };

export class ItemRepositoryImplementation implements ItemRepository {
  constructor(private client: MongoClient) {}

  async getItem(id: string): Promise<Item> {
    const database = this.client.db(environment.dbName);
    const collection = database.collection<ItemDb>(
      environment.productsCollectionName
    );

    const itemDb = await collection.findOne({
      _id: new ObjectId(id),
    });
    if (!itemDb) {
      throw Error(`Couldn't get item with id ${id}`);
    }
    const item = itemDb as unknown as Item;
    item._id = itemDb._id.toString();

    return item;
  }

  async countItems(options?: {
    category?: Category;
    qualities?: Quality[];
    powers?: EffectPower[];
  }): Promise<number> {
    const database = this.client.db(environment.dbName);
    const collection = database.collection<ItemDb>(
      environment.productsCollectionName
    );

    let number;

    if (options) {
      const filter: Filter<ItemDb> = {};

      if (options.category) {
        filter.category = options.category;
      }

      if (options.qualities) {
        filter.quality = { $in: options.qualities };
      }

      if (options.powers) {
        filter.effectPower = { $in: options.powers };
      }

      number = await collection.countDocuments(filter);
    } else {
      number = await collection.countDocuments();
    }

    return number;
  }

  async countSearchItems(
    searchText: string,
    locale: string,
    options?: {
      category?: Category;
      qualities?: Quality[];
      powers?: EffectPower[];
    }
  ): Promise<number> {
    const database = this.client.db(environment.dbName);
    const collection = database.collection<ItemDb>(
      environment.productsCollectionName
    );

    let result: { count: number }[];

    if (options) {
      let filter: Filter<ItemDb> | undefined = undefined;

      if (Object.keys(options).length !== 0) {
        filter = {};

        if (options.category) {
          filter.category = options.category;
        }

        if (options.qualities) {
          filter.quality = { $in: options.qualities };
        }

        if (options.powers) {
          filter.effectPower = { $in: options.powers };
        }
      }

      result = await collection
        .aggregate<{ count: number }>(
          this.createCountSearchItemsAggregate(searchText, locale, filter)
        )
        .toArray();
    } else {
      result = await collection
        .aggregate<{ count: number }>(
          this.createCountSearchItemsAggregate(searchText, locale, undefined)
        )
        .toArray();
    }

    let count = undefined as number | undefined;
    if (result.length === 0) {
      count = 0;
    } else if (result.length === 1 && result[0]) {
      count = result[0].count;
    } else {
      throw new Error(`Invalid result length ${result}`);
    }

    if (count === undefined) {
      throw new Error(`Invalid result - count is undefined`);
    }

    return count;
  }

  async getItems(
    skip: number,
    limit: number,
    options?: {
      category?: Category;
      sort?: SortOption;
      qualities?: Quality[];
      powers?: EffectPower[];
    }
  ): Promise<Item[]> {
    const database = this.client.db(environment.dbName);
    const collection = database.collection<ItemDb>(
      environment.productsCollectionName
    );

    let itemsDb;

    if (options) {
      const filter: Filter<ItemDb> = {};

      if (options.category) {
        filter.category = options.category;
      }

      if (options.qualities) {
        filter.quality = { $in: options.qualities };
      }

      if (options.powers) {
        filter.effectPower = { $in: options.powers };
      }

      itemsDb = await collection
        .find(filter, {
          sort: this.getSortOption(options.sort, options.category),
          skip: skip,
          limit: limit,
        })
        .toArray();
    } else {
      itemsDb = await collection
        .find(
          {},
          {
            sort: this.getSortOption(undefined),
            skip: skip,
            limit: limit,
          }
        )
        .toArray();
    }

    const items = itemsDb.map((itemDb) => {
      const item = itemDb as unknown as Item;
      item._id = itemDb._id.toString();

      return item;
    });

    return items;
  }

  async searchItems(
    searchText: string,
    locale: string,
    skip: number,
    limit: number,
    options?: {
      category?: Category;
      sort?: SortOption;
      qualities?: Quality[];
      powers?: EffectPower[];
    }
  ): Promise<Item[]> {
    const database = this.client.db(environment.dbName);
    const collection = database.collection<ItemDb>(
      environment.productsCollectionName
    );

    let itemsDb;

    if (options) {
      let filter: Filter<ItemDb> | undefined = undefined;

      const filterOptions = { ...options };
      delete filterOptions.sort;
      if (Object.keys(filterOptions).length !== 0) {
        filter = {};

        if (filterOptions.category) {
          filter.category = filterOptions.category;
        }

        if (filterOptions.qualities) {
          filter.quality = { $in: filterOptions.qualities };
        }

        if (filterOptions.powers) {
          filter.effectPower = { $in: filterOptions.powers };
        }
      }

      itemsDb = await collection
        .aggregate(
          this.createSearchItemsAggregate({
            searchText,
            locale,
            skip,
            limit,
            category: options.category,
            sort: options.sort,
            filter,
          })
        )
        .toArray();
    } else {
      itemsDb = await collection
        .aggregate(
          this.createSearchItemsAggregate({
            searchText,
            locale,
            skip,
            limit,
            category: undefined,
            sort: undefined,
            filter: undefined,
          })
        )
        .toArray();
    }

    const items = itemsDb.map((itemDb) => {
      const item = itemDb as unknown as Item;
      item._id = itemDb['_id'].toString();

      return item;
    });

    return items;
  }

  async getItemsById(
    ids: string[]
  ): Promise<{ hasValidItems: boolean; invalidIds: string[]; items: Item[] }> {
    const database = this.client.db(environment.dbName);
    const collection = database.collection<ItemDb>(
      environment.productsCollectionName
    );

    const itemsDb = await collection
      .find(
        { _id: { $in: ids.map((id) => new ObjectId(id)) } },
        {
          sort: { _id: 1 },
        }
      )
      .toArray();

    const items = itemsDb.map((itemDb) => {
      const item = itemDb as unknown as Item;
      item._id = itemDb._id.toString();

      return item;
    });

    const idMap = new Map<string, boolean>();
    items.forEach((item) => idMap.set(item._id, true));
    const invalidIds = ids.filter((id) => !idMap.has(id));

    return {
      hasValidItems: items.length > 0,
      invalidIds,
      items,
    };
  }

  private getSortOption(
    sort: SortOption | undefined,
    category?: Category
  ): {
    [key: string]: SortDirection;
  } {
    switch (sort) {
      case SortOption.bestResults:
        break;
      case SortOption.popularity:
        return { popularity: -1, _id: 1 };
      case SortOption.priceAscending:
        return { 'prices.EUR': 1, _id: 1 };
      case SortOption.priceDescending:
        return { 'prices.EUR': -1, _id: 1 };
      case SortOption.review:
        return { halfStars: -1, ratingCount: -1, _id: 1 };
    }

    return category ? { category: 1, _id: 1 } : { _id: 1 };
  }

  private createCountSearchItemsAggregate(
    searchText: string,
    locale: string,
    filter: Filter<ItemDb> | undefined
  ): Document[] {
    const aggregatePipeline = [];

    let path = undefined as string | undefined;

    switch (locale) {
      case Language.enUs:
        path = 'translations.enUs.name';
        break;
      case Language.de:
        path = 'translations.de.name';
        break;
    }

    if (!path) {
      throw new Error(`Locale ${locale} isn't supported`);
    }

    aggregatePipeline.push({
      $search: {
        index: environment.searchIndexName,
        returnStoredSource: true,
        compound: {
          should: [
            {
              autocomplete: {
                query: searchText,
                path,
                fuzzy: {
                  maxEdits: 1,
                },
                score: {
                  boost: {
                    value: 3,
                  },
                },
              },
            },
            {
              text: {
                query: searchText,
                path,
                fuzzy: {
                  maxEdits: 1,
                },
              },
            },
          ],
        },
      },
    });

    if (filter) {
      aggregatePipeline.push({
        $match: filter,
      });
    }

    aggregatePipeline.push({
      $count: 'count',
    });

    return aggregatePipeline;
  }

  private createSearchItemsAggregate(options: {
    searchText: string;
    locale: string;
    skip: number;
    limit: number;
    category: Category | undefined;
    sort: SortOption | undefined;
    filter: Filter<ItemDb> | undefined;
  }): Document[] {
    const { searchText, locale, skip, limit, category, sort, filter } = options;
    const aggregatePipeline = [];

    let path = undefined as string | undefined;

    switch (locale) {
      case Language.enUs:
        path = 'translations.enUs.name';
        break;
      case Language.de:
        path = 'translations.de.name';
        break;
    }

    if (!path) {
      throw new Error(`Locale ${locale} isn't supported`);
    }

    const sortDb = this.getSortOption(sort, category);

    aggregatePipeline.push({
      $search: {
        index: environment.searchIndexName,
        returnStoredSource: true,
        compound: {
          should: [
            {
              autocomplete: {
                query: searchText,
                path,
                fuzzy: {
                  maxEdits: 1,
                },
                score: {
                  boost: {
                    value: 3,
                  },
                },
              },
            },
            {
              text: {
                query: searchText,
                path,
                fuzzy: {
                  maxEdits: 1,
                },
              },
            },
          ],
        },
      },
    });

    if (filter) {
      aggregatePipeline.push({
        $match: filter,
      });
    }

    // search results are automatically sorted by best match
    if (sort !== SortOption.bestResults) {
      aggregatePipeline.push({
        $sort: sortDb,
      });
    }

    aggregatePipeline.push({
      $skip: skip,
    });

    aggregatePipeline.push({
      $limit: limit,
    });

    aggregatePipeline.push({
      $lookup: {
        from: environment.productsCollectionName,
        localField: '_id',
        foreignField: '_id',
        as: 'itemLookup',
      },
    });

    aggregatePipeline.push({
      $replaceRoot: {
        newRoot: { $arrayElemAt: ['$itemLookup', 0] },
      },
    });

    return aggregatePipeline;
  }
}
