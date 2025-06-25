export function selectionSort(array) {
  const animations = [];
  const arr = array.slice();

  for (let i = 0; i < arr.length; i++) {
    let minIndex = i;
    animations.push({ type: "select", index: i });

    for (let j = i + 1; j < arr.length; j++) {
      animations.push({ type: "compare", indices: [minIndex, j] });
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      animations.push({ type: "swap", indices: [i, minIndex] });
    }
  }

  return animations;
}
