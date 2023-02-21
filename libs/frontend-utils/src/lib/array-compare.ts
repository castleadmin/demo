/**
 * Compares the content of 2 string arrays independent of the item order
 * and returns true if the arrays are equal.
 */
export function stringArrayEquals(a: string[], b: string[]): boolean {
  if (a.length !== b.length) {
    return false;
  }

  const aSorted = [...a].sort();
  const bSorted = [...b].sort();

  for (let i = 0; i < aSorted.length; i++) {
    if (aSorted[i] !== bSorted[i]) {
      return false;
    }
  }

  return true;
}
