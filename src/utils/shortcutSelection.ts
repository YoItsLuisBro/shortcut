export function getRandomIndex(
  itemCount: number,
  excludedIndex?: number,
): number {
  if (!Number.isInteger(itemCount) || itemCount <= 0) {
    throw new Error("getRandomIndex requires a positive integer item count.");
  }

  if (itemCount === 1) {
    return 0;
  }

  let nextIndex = Math.floor(Math.random() * itemCount);

  while (nextIndex === excludedIndex) {
    nextIndex = Math.floor(Math.random() * itemCount);
  }

  return nextIndex;
}
