import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setIsSorting
} from '../redux/algoSlice';

import { bubbleSort } from '../algorithms/sorting/bubbleSort';
import { insertionSort } from '../algorithms/sorting/insertionSort';
import { selectionSort } from '../algorithms/sorting/selectionSort';
import { mergeSort } from '../algorithms/sorting/mergeSort';
import { quickSort } from '../algorithms/sorting/quickSort';

import './SortingVisualizer.css';

const PRIMARY_COLOR = '#4f46e5';
const SECONDARY_COLOR = '#ef4444';

const SortingVisualizer = forwardRef((props, ref) => {
  const [array, setArray] = useState([]);
  const dispatch = useDispatch();

  const { algorithm, arraySize, speed } = useSelector((state) => state.algo);

  useEffect(() => {
    resetArray();
  }, [arraySize]);

  useImperativeHandle(ref, () => ({
    resetArray,
    startVisualization,
  }));

  const resetArray = () => {
    const newArray = Array.from({ length: arraySize }, () =>
      Math.floor(Math.random() * 300 + 10)
    );
    setArray(newArray);
  };

  const getAnimations = () => {
    switch (algorithm) {
      case 'bubbleSort':
        return bubbleSort(array);
      case 'insertionSort':
        return insertionSort(array);
      case 'selectionSort':
        return selectionSort(array);
      case 'mergeSort':
        return mergeSort(array);
      case 'quickSort':
        return quickSort(array);
      default:
        return [];
    }
  };

  const startVisualization = () => {
    const animations = getAnimations();
    const bars = document.getElementsByClassName('bar');

    dispatch(setIsSorting(true)); // Disable controls

    animations.forEach((anim, i) => {
      setTimeout(() => {
        const { type, indices, index, value } = anim;

        if (type === 'compare') {
          const [i1, i2] = indices;
          bars[i1].style.backgroundColor = SECONDARY_COLOR;
          bars[i2].style.backgroundColor = SECONDARY_COLOR;

          setTimeout(() => {
            bars[i1].style.backgroundColor = PRIMARY_COLOR;
            bars[i2].style.backgroundColor = PRIMARY_COLOR;
          }, speed);
        }

        if (type === 'swap') {
          const [i1, i2] = indices;
          const temp = bars[i1].style.height;
          bars[i1].style.height = bars[i2].style.height;
          bars[i2].style.height = temp;
        }

        if (type === 'overwrite') {
          bars[index].style.height = `${value}px`;
        }

        if (i === animations.length - 1) {
          setTimeout(() => {
            dispatch(setIsSorting(false)); // Enable controls
          }, speed);
        }
      }, i * speed);
    });
  };

  return (
    <div className="w-full text-center">
      <div className="flex items-end justify-center gap-1 h-72 px-4">
        {array.map((value, idx) => (
          <div
            key={idx}
            className="bar bg-indigo-600"
            style={{
              height: `${value}px`,
              width: '10px',
              transition: 'height 0.2s ease-in-out',
            }}
          ></div>
        ))}
      </div>
    </div>
  );
});

export default SortingVisualizer;
