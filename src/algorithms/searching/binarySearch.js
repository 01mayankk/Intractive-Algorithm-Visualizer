// Binary Search generator for visualization
export function* binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    yield { left, right, mid, found: arr[mid] === target };
    if (arr[mid] === target) return;
    else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  yield { left: -1, right: -1, mid: -1, found: false };
}
