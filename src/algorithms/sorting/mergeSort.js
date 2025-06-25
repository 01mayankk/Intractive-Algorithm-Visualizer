export function mergeSort(array) {
  const animations = [];
  if (array.length <= 1) return animations;

  const auxArray = array.slice();
  mergeSortHelper(array, 0, array.length - 1, auxArray, animations);
  return animations;
}

function mergeSortHelper(mainArray, startIdx, endIdx, auxArray, animations) {
  if (startIdx === endIdx) return;

  const midIdx = Math.floor((startIdx + endIdx) / 2);
  mergeSortHelper(auxArray, startIdx, midIdx, mainArray, animations);
  mergeSortHelper(auxArray, midIdx + 1, endIdx, mainArray, animations);
  doMerge(mainArray, startIdx, midIdx, endIdx, auxArray, animations);
}

function doMerge(mainArray, startIdx, midIdx, endIdx, auxArray, animations) {
  let k = startIdx;
  let i = startIdx;
  let j = midIdx + 1;

  while (i <= midIdx && j <= endIdx) {
    animations.push({ type: "compare", indices: [i, j] });

    if (auxArray[i] <= auxArray[j]) {
      animations.push({ type: "overwrite", index: k, value: auxArray[i] });
      mainArray[k++] = auxArray[i++];
    } else {
      animations.push({ type: "overwrite", index: k, value: auxArray[j] });
      mainArray[k++] = auxArray[j++];
    }
  }

  while (i <= midIdx) {
    animations.push({ type: "overwrite", index: k, value: auxArray[i] });
    mainArray[k++] = auxArray[i++];
  }

  while (j <= endIdx) {
    animations.push({ type: "overwrite", index: k, value: auxArray[j] });
    mainArray[k++] = auxArray[j++];
  }
}
