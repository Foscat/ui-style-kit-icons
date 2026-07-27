export function edgeMaskSimilarity(first, second) {
  if (
    first.length === 0 ||
    first.length !== second.length ||
    first.some((value) => !Number.isFinite(value)) ||
    second.some((value) => !Number.isFinite(value))
  ) {
    return 0;
  }

  let dotProduct = 0;
  let firstMagnitude = 0;
  let secondMagnitude = 0;

  for (let index = 0; index < first.length; index += 1) {
    dotProduct += first[index] * second[index];
    firstMagnitude += first[index] ** 2;
    secondMagnitude += second[index] ** 2;
  }

  if (firstMagnitude === 0 || secondMagnitude === 0) {
    return 0;
  }

  return dotProduct / Math.sqrt(firstMagnitude * secondMagnitude);
}
