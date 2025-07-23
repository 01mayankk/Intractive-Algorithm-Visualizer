// Linear Search generator for visualization
export function* linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    yield { current: i, found: arr[i] === target };
    if (arr[i] === target) return;
  }
  yield { current: -1, found: false };
}
