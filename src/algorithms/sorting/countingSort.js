// Counting Sort generator for visualization (non-negative integers)
export function* countingSort(arr) {
  if (arr.length === 0) return;
  let max = Math.max(...arr);
  let count = new Array(max + 1).fill(0);
  for (let i = 0; i < arr.length; i++) {
    count[arr[i]]++;
    yield { count: [...count], arr: [...arr], phase: 'counting', index: i };
  }
  let idx = 0;
  for (let i = 0; i < count.length; i++) {
    while (count[i]-- > 0) {
      arr[idx++] = i;
      yield { count: [...count], arr: [...arr], phase: 'sorting', index: idx - 1 };
    }
  }
  yield { count: [...count], arr: [...arr], phase: 'done', index: -1 };
} 