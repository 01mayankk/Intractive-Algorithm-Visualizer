// Radix Sort generator for visualization (non-negative integers)
export function* radixSort(arr) {
  if (arr.length === 0) return;
  let max = Math.max(...arr);
  let exp = 1;
  while (Math.floor(max / exp) > 0) {
    let output = new Array(arr.length).fill(0);
    let count = new Array(10).fill(0);
    for (let i = 0; i < arr.length; i++) {
      count[Math.floor(arr[i] / exp) % 10]++;
      yield { arr: [...arr], count: [...count], exp, phase: 'counting', index: i };
    }
    for (let i = 1; i < 10; i++) count[i] += count[i - 1];
    for (let i = arr.length - 1; i >= 0; i--) {
      output[--count[Math.floor(arr[i] / exp) % 10]] = arr[i];
      yield { arr: [...arr], output: [...output], count: [...count], exp, phase: 'output', index: i };
    }
    for (let i = 0; i < arr.length; i++) arr[i] = output[i];
    yield { arr: [...arr], count: [...count], exp, phase: 'sorted', index: -1 };
    exp *= 10;
  }
  yield { arr: [...arr], phase: 'done', index: -1 };
} 