export function bubbleSort(array) {
  const animations = [];
  const arr = array.slice();

  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      animations.push({ type: "compare", indices: [j, j + 1] });

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        animations.push({ type: "swap", indices: [j, j + 1] });
      } else {
        animations.push({ type: "no-swap", indices: [j, j + 1] });
      }
    }
  }

  return animations;
}
