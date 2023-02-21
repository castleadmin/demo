import { Category } from './category';
import { EffectPower } from './effect-power';
import { Item } from './item';
import { Quality } from './quality';
import { SortOption } from './sort-option';

/**
 * The item repository is used to retrieve shop items from a persistent storage.
 * DDD <<Repository>>
 */
export interface ItemRepository {
  /**
   * Retrieve a single item by id.
   */
  getItem(id: string): Promise<Item>;

  /**
   * Retrieves the item count.
   */
  countItems(options?: {
    category?: Category;
    qualities?: Quality[];
    powers?: EffectPower[];
  }): Promise<number>;

  /**
   * Retrieves the item count of the search operation.
   */
  countSearchItems(
    searchText: string,
    locale: string,
    options?: {
      category?: Category;
      qualities?: Quality[];
      powers?: EffectPower[];
    }
  ): Promise<number>;

  /**
   * Retrieve a list of items.
   * Pagination is supported through the skip and limit properties.
   * Search filters and the sort order can be defined.
   * The result is sorted by the id in ascending order in case of a missing sort option.
   */
  getItems(
    skip: number,
    limit: number,
    options?: {
      category?: Category;
      sort?: SortOption;
      qualities?: Quality[];
      powers?: EffectPower[];
    }
  ): Promise<Item[]>;

  /**
   * Retrieve a list of items.
   * Pagination is supported through the skip and limit properties.
   * Search filters and the sort order can be defined.
   * The result is sorted by the id in ascending order in case of a missing sort option.
   */
  searchItems(
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
  ): Promise<Item[]>;

  /**
   * Retrieve a list of items by taking the given id list into account.
   * The result is sorted by the id in ascending order.
   */
  getItemsById(
    ids: string[]
  ): Promise<{ hasValidItems: boolean; invalidIds: string[]; items: Item[] }>;
}
