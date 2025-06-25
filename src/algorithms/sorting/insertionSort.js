export function insertionSort(array) {
  const animations = [];
  const arr = array.slice();

  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;

    animations.push({ type: "select", index: i });

    while (j >= 0 && arr[j] > key) {
      animations.push({ type: "compare", indices: [j, j + 1] });
      arr[j + 1] = arr[j];
      animations.push({ type: "overwrite", index: j + 1, value: arr[j] });
      j--;
    }

    arr[j + 1] = key;
    animations.push({ type: "insert", index: j + 1, value: key });
  }

  return animations;
}
