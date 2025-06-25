import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import SearchControlPanel from '../components/SearchControlPanel';
import { linearSearch } from '../algorithms/searching/linearSearch';
import { binarySearch } from '../algorithms/searching/binarySearch';


const PRIMARY_COLOR = '#4f46e5';
const COMPARE_COLOR = '#f59e0b';
const FOUND_COLOR = '#10b981';
const NOT_FOUND_COLOR = '#dc2626';

const SearchingVisualizer = () => {
  const { searchAlgorithm, searchTarget } = useSelector((state) => state.algo);

  const [array, setArray] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    resetArray();
  }, [searchAlgorithm]);

  const resetArray = () => {
    const newArray = Array.from({ length: 20 }, () =>
      Math.floor(Math.random() * 100)
    );

    const displayedArray =
      searchAlgorithm === 'binarySearch'
        ? [...newArray].sort((a, b) => a - b)
        : newArray;

    setArray(displayedArray);
    setNotFound(false);

    const bars = document.getElementsByClassName('bar-search');
    Array.from(bars).forEach((bar) => {
      bar.style.backgroundColor = PRIMARY_COLOR;
    });
  };

  const getAnimations = () => {
    const target = parseInt(searchTarget);
    if (isNaN(target)) return [];

    switch (searchAlgorithm) {
      case 'linearSearch':
        return linearSearch(array, target);
      case 'binarySearch':
        return binarySearch(array, target);
      default:
        return [];
    }
  };

  const visualize = () => {
    const animations = getAnimations();
    const bars = document.getElementsByClassName('bar-search');
    setIsRunning(true);

    let found = false;

    animations.forEach((anim, i) => {
      setTimeout(() => {
        const { type, index, indices } = anim;

        if (type === 'compare') {
          const [idx] = indices;
          bars[idx].style.backgroundColor = COMPARE_COLOR;
          setTimeout(() => {
            bars[idx].style.backgroundColor = PRIMARY_COLOR;
          }, 250);
        }

        if (type === 'found') {
          bars[index].style.backgroundColor = FOUND_COLOR;
          found = true;
        }

        if (i === animations.length - 1) {
          setTimeout(() => {
            setIsRunning(false);
            if (!found) {
              flashNotFound();
            }
          }, 400);
        }
      }, i * 400);
    });
  };

  const flashNotFound = () => {
    const bars = document.getElementsByClassName('bar-search');
    Array.from(bars).forEach((bar) => {
      bar.style.backgroundColor = NOT_FOUND_COLOR;
    });

    setNotFound(true);

    setTimeout(() => {
      Array.from(bars).forEach((bar) => {
        bar.style.backgroundColor = PRIMARY_COLOR;
      });
    }, 1000);
  };

  return (
    <div className="text-center py-6">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">
        Searching Visualizer
      </h2>

      <SearchControlPanel onReset={resetArray} onVisualize={visualize} />

      {notFound && (
        <p className="text-red-600 font-semibold mt-2">🔍 Element Not Found</p>
      )}

      <div className="flex items-end justify-center gap-1 px-4 mt-6">
        {array.map((value, idx) => (
          <div
            key={idx}
            className="bar-search bg-indigo-600 text-white text-sm flex items-end justify-center"
            style={{
              height: `${value * 3}px`,
              width: '30px',
              transition: '0.3s',
              backgroundColor: PRIMARY_COLOR,
            }}
          >
            {value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchingVisualizer;
