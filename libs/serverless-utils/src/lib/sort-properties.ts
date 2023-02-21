/**
 * Sort the object properties in order to make it easier to read.
 * Technically the unsorted object is equivalent to the sorted object.
 */
export function sortProperties<T extends object>(value: T): T {
  const result: Partial<T> = {};

  (Object.keys(value) as (keyof T)[]).sort().forEach((key) => {
    (result[key] as unknown) = value[key];
  });

  return result as T;
}
