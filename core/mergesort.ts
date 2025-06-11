export type Comparator<T> = (a: T, b: T) => number;

/**
 * Sort an array using the merge sort algorithm.
 *
 * @param comparatorFn The comparator function.
 * @param arr The array to sort.
 * @returns The sorted array.
 */
function mergeSort<T>(comparatorFn: Comparator<T>, arr: T[]): T[] {
  const len = arr.length;
  if (len >= 2) {
    const firstHalf = arr.slice(0, len / 2);
    const secondHalf = arr.slice(len / 2, len);
    return merge(
      comparatorFn,
      mergeSort(comparatorFn, firstHalf),
      mergeSort(comparatorFn, secondHalf)
    );
  } else {
    return arr.slice();
  }
}

/**
 * The merge part of the merge sort algorithm.
 *
 * @param comparatorFn The comparator function.
 * @param arr1 The first sorted array.
 * @param arr2 The second sorted array.
 * @returns The merged and sorted array.
 */
function merge<T>(comparatorFn: Comparator<T>, arr1: T[], arr2: T[]): T[] {
  const result: T[] = [];
  let left1 = arr1.length;
  let left2 = arr2.length;

  while (left1 > 0 && left2 > 0) {
    if (comparatorFn(arr1[0], arr2[0]) <= 0) {
      result.push(arr1.shift()!); // non-null assertion: safe since we just checked length
      left1--;
    } else {
      result.push(arr2.shift()!);
      left2--;
    }
  }

  if (left1 > 0) {
    result.push(...arr1);
  } else {
    result.push(...arr2);
  }

  return result;
}

export default mergeSort;
