export type Comparator<T> = (a: T, b: T) => number;
/**
 * Sort an array using the merge sort algorithm.
 *
 * @param comparatorFn The comparator function.
 * @param arr The array to sort.
 * @returns The sorted array.
 */
declare function mergeSort<T>(comparatorFn: Comparator<T>, arr: T[]): T[];
export default mergeSort;
