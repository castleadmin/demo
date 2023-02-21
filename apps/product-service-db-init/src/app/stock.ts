/**
 * Generate if the item is in stock.
 */
export function createIsInStock(): boolean {
  const random = Math.floor(10 * Math.random());

  // Range after Math.floor [0, 9]
  // >= 8 -> Chance not in stock 2/10 = 20%
  if (random >= 8) {
    return false;
  }

  return true;
}
