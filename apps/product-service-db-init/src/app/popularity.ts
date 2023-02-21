/**
 * Generate the popularity of an item.
 */
export function createPopularity(halfStarsRating: number): number {
  // popularity range [0,1)
  let popularity: number | undefined = undefined;

  while (popularity === undefined) {
    const random = Math.random();

    // 2, 3
    if (halfStarsRating <= 3 && random <= 0.33) {
      popularity = random;
    }
    // 4, 5, 6
    else if (halfStarsRating > 3 && halfStarsRating <= 6 && random <= 0.66) {
      popularity = random;
    }
    // 7, 8, 9, 10
    else if (halfStarsRating > 6) {
      popularity = random;
    }
  }

  return popularity;
}
