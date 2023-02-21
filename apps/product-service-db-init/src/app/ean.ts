/**
 * Generate the EAN-13 (European Article Number) number of an item.
 */
export function createEan(): string {
  const eanArray = [];

  for (let i = 0; i < 13; i++) {
    eanArray.push(Math.floor(Math.random() * 10));
  }

  return eanArray.join('');
}
