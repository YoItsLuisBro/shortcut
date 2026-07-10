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

export function getRandomItem<T>(
  items: readonly T[],
  excludedItem?: T,
): T | undefined {
  if (items.length === 0) {
    return undefined;
  }

  if (items.length === 1) {
    return items[0];
  }

  let excludedIndex: number | undefined;

  if (excludedItem !== undefined) {
    const foundIndex = items.indexOf(excludedItem);

    if (foundIndex >= 0) {
      excludedIndex = foundIndex;
    }
  }

  const randomIndex = getRandomIndex(items.length, excludedIndex);

  return items[randomIndex];
}
