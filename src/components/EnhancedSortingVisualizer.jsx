import React, { useState, useEffect, useRef } from 'react';

const EnhancedSortingVisualizer = ({ array, algorithm, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [steps, setSteps] = useState([]);
  const [currentArray, setCurrentArray] = useState([]);
  const [explanation, setExplanation] = useState('');
  const [animationType, setAnimationType] = useState('bubble');
  const intervalRef = useRef(null);

  useEffect(() => {
    if (array && array.length > 0) {
      generateSteps();
    }
  }, [array, algorithm]);

  useEffect(() => {
    if (steps.length > 0) {
      setCurrentArray(steps[currentStep]?.array || array);
      setExplanation(steps[currentStep]?.explanation || '');
    }
  }, [currentStep, steps]);

  const generateSteps = () => {
    const newSteps = [];
    const arr = [...array];
    
    switch (algorithm) {
      case 'Bubble Sort':
        generateBubbleSortSteps(arr, newSteps);
        break;
      case 'Quick Sort':
        generateQuickSortSteps(arr, newSteps);
        break;
      case 'Merge Sort':
        generateMergeSortSteps(arr, newSteps);
        break;
      case 'Insertion Sort':
        generateInsertionSortSteps(arr, newSteps);
        break;
      case 'Selection Sort':
        generateSelectionSortSteps(arr, newSteps);
        break;
      case 'Heap Sort':
        generateHeapSortSteps(arr, newSteps);
        break;
      case 'Counting Sort':
        generateCountingSortSteps(arr, newSteps);
        break;
      case 'Radix Sort':
        generateRadixSortSteps(arr, newSteps);
        break;
    }
    
    setSteps(newSteps);
    setCurrentStep(0);
  };

  const generateBubbleSortSteps = (arr, steps) => {
    const array = [...arr];
    let stepCount = 0;
    
    for (let i = 0; i < array.length - 1; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        // Comparison step
        steps.push({
          array: [...array],
          explanation: `Step ${stepCount + 1}: Comparing elements at positions ${j} and ${j + 1}. 
          Current values: ${array[j]} and ${array[j + 1]}. 
          ${array[j] > array[j + 1] ? 'They are in wrong order, will swap.' : 'They are in correct order, no swap needed.'}`,
          highlighted: [j, j + 1],
          animation: 'bubble'
        });
        stepCount++;
        
        if (array[j] > array[j + 1]) {
          // Swap step
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          steps.push({
            array: [...array],
            explanation: `Step ${stepCount + 1}: Swapping ${array[j + 1]} and ${array[j]}. 
            The larger element bubbles up to its correct position.`,
            highlighted: [j, j + 1],
            animation: 'swap'
          });
          stepCount++;
        }
      }
    }
  };

  const generateQuickSortSteps = (arr, steps) => {
    const array = [...arr];
    let stepCount = 0;
    
    const partition = (low, high) => {
      const pivot = array[high];
      let i = low - 1;
      
      steps.push({
        array: [...array],
        explanation: `Step ${stepCount + 1}: Starting partition with pivot ${pivot} at position ${high}. 
        We'll place all elements smaller than ${pivot} to the left.`,
        highlighted: [high],
        animation: 'pivot'
      });
      stepCount++;
      
      for (let j = low; j < high; j++) {
        steps.push({
          array: [...array],
          explanation: `Step ${stepCount + 1}: Comparing element ${array[j]} with pivot ${pivot}. 
          ${array[j] < pivot ? 'Element is smaller, will move to left partition.' : 'Element is larger, stays in right partition.'}`,
          highlighted: [j, high],
          animation: 'compare'
        });
        stepCount++;
        
        if (array[j] < pivot) {
          i++;
          [array[i], array[j]] = [array[j], array[i]];
          steps.push({
            array: [...array],
            explanation: `Step ${stepCount + 1}: Swapping ${array[j]} to position ${i} in left partition.`,
            highlighted: [i, j],
            animation: 'swap'
          });
          stepCount++;
        }
      }
      
      [array[i + 1], array[high]] = [array[high], array[i + 1]];
      steps.push({
        array: [...array],
        explanation: `Step ${stepCount + 1}: Placing pivot ${pivot} in its final position ${i + 1}. 
        All elements to the left are smaller, all to the right are larger.`,
        highlighted: [i + 1, high],
        animation: 'pivot-place'
      });
      stepCount++;
      
      return i + 1;
    };
    
    const quickSortHelper = (low, high) => {
      if (low < high) {
        const pi = partition(low, high);
        quickSortHelper(low, pi - 1);
        quickSortHelper(pi + 1, high);
      }
    };
    
    quickSortHelper(0, array.length - 1);
  };

  const generateMergeSortSteps = (arr, steps) => {
    const array = [...arr];
    let stepCount = 0;
    
    const merge = (left, mid, right) => {
      steps.push({
        array: [...array],
        explanation: `Step ${stepCount + 1}: Merging two sorted subarrays from positions ${left} to ${mid} and ${mid + 1} to ${right}. 
        We'll combine them into one sorted array.`,
        highlighted: Array.from({ length: right - left + 1 }, (_, i) => left + i),
        animation: 'merge-start'
      });
      stepCount++;
      
      const leftArray = array.slice(left, mid + 1);
      const rightArray = array.slice(mid + 1, right + 1);
      
      let i = 0, j = 0, k = left;
      
      while (i < leftArray.length && j < rightArray.length) {
        steps.push({
          array: [...array],
          explanation: `Step ${stepCount + 1}: Comparing ${leftArray[i]} from left subarray with ${rightArray[j]} from right subarray. 
          Taking the smaller element.`,
          highlighted: [left + i, mid + 1 + j],
          animation: 'merge-compare'
        });
        stepCount++;
        
        if (leftArray[i] <= rightArray[j]) {
          array[k] = leftArray[i];
          i++;
        } else {
          array[k] = rightArray[j];
          j++;
        }
        
        steps.push({
          array: [...array],
          explanation: `Step ${stepCount + 1}: Placed ${array[k]} in position ${k}. 
          Continuing to merge remaining elements.`,
          highlighted: [k],
          animation: 'merge-place'
        });
        stepCount++;
        k++;
      }
      
      // Add remaining elements
      while (i < leftArray.length) {
        array[k] = leftArray[i];
        steps.push({
          array: [...array],
          explanation: `Step ${stepCount + 1}: Adding remaining element ${leftArray[i]} from left subarray.`,
          highlighted: [k],
          animation: 'merge-remaining'
        });
        stepCount++;
        i++;
        k++;
      }
      
      while (j < rightArray.length) {
        array[k] = rightArray[j];
        steps.push({
          array: [...array],
          explanation: `Step ${stepCount + 1}: Adding remaining element ${rightArray[j]} from right subarray.`,
          highlighted: [k],
          animation: 'merge-remaining'
        });
        stepCount++;
        j++;
        k++;
      }
    };
    
    const mergeSortHelper = (left, right) => {
      if (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        steps.push({
          array: [...array],
          explanation: `Step ${stepCount + 1}: Dividing array from position ${left} to ${right} at midpoint ${mid}. 
          We'll sort the left half (${left} to ${mid}) and right half (${mid + 1} to ${right}) separately.`,
          highlighted: [left, mid, right],
          animation: 'divide'
        });
        stepCount++;
        
        mergeSortHelper(left, mid);
        mergeSortHelper(mid + 1, right);
        merge(left, mid, right);
      }
    };
    
    mergeSortHelper(0, array.length - 1);
  };

  const generateInsertionSortSteps = (arr, steps) => {
    const array = [...arr];
    let stepCount = 0;
    
    for (let i = 1; i < array.length; i++) {
      const key = array[i];
      
      steps.push({
        array: [...array],
        explanation: `Step ${stepCount + 1}: Starting with element ${key} at position ${i}. 
        We'll insert it into the correct position in the sorted subarray to the left.`,
        highlighted: [i],
        animation: 'insertion-start'
      });
      stepCount++;
      
      let j = i - 1;
      
      while (j >= 0 && array[j] > key) {
        steps.push({
          array: [...array],
          explanation: `Step ${stepCount + 1}: Comparing ${key} with ${array[j]} at position ${j}. 
          ${array[j]} is larger, so we shift it one position to the right.`,
          highlighted: [j, j + 1],
          animation: 'insertion-shift'
        });
        stepCount++;
        
        array[j + 1] = array[j];
        j--;
      }
      
      array[j + 1] = key;
      steps.push({
        array: [...array],
        explanation: `Step ${stepCount + 1}: Inserting ${key} into its correct position ${j + 1}. 
        The sorted subarray now includes elements from position 0 to ${i}.`,
        highlighted: [j + 1],
        animation: 'insertion-place'
      });
      stepCount++;
    }
  };

  const generateSelectionSortSteps = (arr, steps) => {
    const array = [...arr];
    let stepCount = 0;
    
    for (let i = 0; i < array.length - 1; i++) {
      let minIndex = i;
      
      steps.push({
        array: [...array],
        explanation: `Step ${stepCount + 1}: Starting pass ${i + 1}. 
        We'll find the minimum element in the unsorted portion (positions ${i} to ${array.length - 1}).`,
        highlighted: [i],
        animation: 'selection-start'
      });
      stepCount++;
      
      for (let j = i + 1; j < array.length; j++) {
        steps.push({
          array: [...array],
          explanation: `Step ${stepCount + 1}: Comparing current minimum ${array[minIndex]} with ${array[j]}. 
          ${array[j] < array[minIndex] ? 'Found a smaller element, updating minimum.' : 'Current minimum is still smaller.'}`,
          highlighted: [minIndex, j],
          animation: 'selection-compare'
        });
        stepCount++;
        
        if (array[j] < array[minIndex]) {
          minIndex = j;
        }
      }
      
      if (minIndex !== i) {
        [array[i], array[minIndex]] = [array[minIndex], array[i]];
        steps.push({
          array: [...array],
          explanation: `Step ${stepCount + 1}: Swapping minimum element ${array[i]} to position ${i}. 
          Position ${i} is now sorted.`,
          highlighted: [i, minIndex],
          animation: 'selection-swap'
        });
        stepCount++;
      }
    }
  };

  const generateHeapSortSteps = (arr, steps) => {
    const array = [...arr];
    let stepCount = 0;
    
    const heapify = (n, i) => {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      
      if (left < n) {
        steps.push({
          array: [...array],
          explanation: `Step ${stepCount + 1}: Comparing parent ${array[i]} with left child ${array[left]}.`,
          highlighted: [i, left],
          animation: 'heap-compare'
        });
        stepCount++;
        
        if (array[left] > array[largest]) {
          largest = left;
        }
      }
      
      if (right < n) {
        steps.push({
          array: [...array],
          explanation: `Step ${stepCount + 1}: Comparing current largest ${array[largest]} with right child ${array[right]}.`,
          highlighted: [largest, right],
          animation: 'heap-compare'
        });
        stepCount++;
        
        if (array[right] > array[largest]) {
          largest = right;
        }
      }
      
      if (largest !== i) {
        [array[i], array[largest]] = [array[largest], array[i]];
        steps.push({
          array: [...array],
          explanation: `Step ${stepCount + 1}: Swapping ${array[i]} with ${array[largest]} to maintain heap property.`,
          highlighted: [i, largest],
          animation: 'heap-swap'
        });
        stepCount++;
        
        heapify(n, largest);
      }
    };
    
    // Build max heap
    for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
      steps.push({
        array: [...array],
        explanation: `Step ${stepCount + 1}: Building max heap - heapifying subtree rooted at position ${i}.`,
        highlighted: [i],
        animation: 'heap-build'
      });
      stepCount++;
      
      heapify(array.length, i);
    }
    
    // Extract elements from heap
    for (let i = array.length - 1; i > 0; i--) {
      [array[0], array[i]] = [array[i], array[0]];
      steps.push({
        array: [...array],
        explanation: `Step ${stepCount + 1}: Moving root (maximum element) ${array[i]} to position ${i}. 
        This element is now in its final sorted position.`,
        highlighted: [0, i],
        animation: 'heap-extract'
      });
      stepCount++;
      
      heapify(i, 0);
    }
  };

  const generateCountingSortSteps = (arr, steps) => {
    const array = [...arr];
    let stepCount = 0;
    const max = Math.max(...array);
    const count = new Array(max + 1).fill(0);
    const output = new Array(array.length);
    
    // Count occurrences
    for (let i = 0; i < array.length; i++) {
      steps.push({
        array: [...array],
        explanation: `Step ${stepCount + 1}: Counting occurrence of element ${array[i]}. 
        Incrementing count array at index ${array[i]}.`,
        highlighted: [i],
        animation: 'counting-count'
      });
      stepCount++;
      
      count[array[i]]++;
    }
    
    // Calculate positions
    for (let i = 1; i <= max; i++) {
      count[i] += count[i - 1];
      steps.push({
        array: [...array],
        explanation: `Step ${stepCount + 1}: Calculating cumulative count for element ${i}. 
        This gives us the final position for each element.`,
        highlighted: [],
        animation: 'counting-cumulative'
      });
      stepCount++;
    }
    
    // Build output array
    for (let i = array.length - 1; i >= 0; i--) {
      output[count[array[i]] - 1] = array[i];
      count[array[i]]--;
      
      steps.push({
        array: [...output],
        explanation: `Step ${stepCount + 1}: Placing element ${array[i]} in output array at position ${count[array[i]]}.`,
        highlighted: [count[array[i]]],
        animation: 'counting-place'
      });
      stepCount++;
    }
    
    // Copy back to original array
    for (let i = 0; i < array.length; i++) {
      array[i] = output[i];
      steps.push({
        array: [...array],
        explanation: `Step ${stepCount + 1}: Copying sorted element ${output[i]} back to original array.`,
        highlighted: [i],
        animation: 'counting-copy'
      });
      stepCount++;
    }
  };

  const generateRadixSortSteps = (arr, steps) => {
    const array = [...arr];
    let stepCount = 0;
    
    const getMax = () => Math.max(...array);
    const countSort = (exp) => {
      const output = new Array(array.length);
      const count = new Array(10).fill(0);
      
      steps.push({
        array: [...array],
        explanation: `Step ${stepCount + 1}: Starting radix sort for digit position ${exp}. 
        We'll sort based on the ${exp === 1 ? '1st' : exp === 10 ? '10th' : '100th'} digit.`,
        highlighted: [],
        animation: 'radix-start'
      });
      stepCount++;
      
      // Count occurrences of each digit
      for (let i = 0; i < array.length; i++) {
        const digit = Math.floor(array[i] / exp) % 10;
        count[digit]++;
        
        steps.push({
          array: [...array],
          explanation: `Step ${stepCount + 1}: Counting digit ${digit} at position ${i}. 
          Element ${array[i]} has digit ${digit} at current position.`,
          highlighted: [i],
          animation: 'radix-count'
        });
        stepCount++;
      }
      
      // Calculate positions
      for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
      }
      
      // Build output array
      for (let i = array.length - 1; i >= 0; i--) {
        const digit = Math.floor(array[i] / exp) % 10;
        output[count[digit] - 1] = array[i];
        count[digit]--;
        
        steps.push({
          array: [...output],
          explanation: `Step ${stepCount + 1}: Placing element ${array[i]} in output array based on digit ${digit}.`,
          highlighted: [count[digit]],
          animation: 'radix-place'
        });
        stepCount++;
      }
      
      // Copy back to original array
      for (let i = 0; i < array.length; i++) {
        array[i] = output[i];
        steps.push({
          array: [...array],
          explanation: `Step ${stepCount + 1}: Copying element ${output[i]} back to original array.`,
          highlighted: [i],
          animation: 'radix-copy'
        });
        stepCount++;
      }
    };
    
    const max = getMax();
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      countSort(exp);
    }
  };

  const play = () => {
    if (currentStep < steps.length - 1) {
      setIsPlaying(true);
      setIsPaused(false);
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            clearInterval(intervalRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
  };

  const pause = () => {
    setIsPlaying(false);
    setIsPaused(true);
    clearInterval(intervalRef.current);
  };

  const stop = () => {
    setIsPlaying(false);
    setIsPaused(false);
    clearInterval(intervalRef.current);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  // Helper function to determine if an element is sorted
  const isElementSorted = (index) => {
    if (currentStep === 0) return false;
    const sortedArray = [...array].sort((a, b) => a - b);
    return currentArray[index] === sortedArray[index];
  };

  // Helper function to get bar gradient based on state
  const getBarGradient = (index, isHighlighted) => {
    if (isHighlighted) {
      return 'from-yellow-400 to-teal-400'; // Bright teal for active comparison
    }
    
    if (isElementSorted(index)) {
      return 'from-blue-400 to-violet-500'; // Blue to violet for sorted
    }
    
    return 'from-orange-400 to-red-500'; // Orange to red for unsorted
  };

  return (
    <div className="space-y-6" style={{
      background: 'linear-gradient(135deg, #ff6ec4 0%, #7873f5 100%)',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      {/* Controls */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
        <h3 className="text-xl font-semibold text-[#ff4e88] mb-4">Playback Controls</h3>
        
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={play}
            disabled={isPlaying || currentStep >= steps.length - 1}
            className="bg-[#4CAF50] hover:bg-[#45a049] disabled:bg-gray-400 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none font-medium"
          >
            ▶️ Play
          </button>
          <button
            onClick={pause}
            disabled={!isPlaying}
            className="bg-[#FFA500] hover:bg-[#ff8c00] disabled:bg-gray-400 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none font-medium"
          >
            ⏸️ Pause
          </button>
          <button
            onClick={stop}
            className="bg-[#E53935] hover:bg-[#d32f2f] text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-medium"
          >
            ⏹️ Stop
          </button>
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="bg-[#0099ff] hover:bg-[#007acc] disabled:bg-gray-400 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none font-medium"
          >
            ⏮️ Previous
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep >= steps.length - 1}
            className="bg-[#0099ff] hover:bg-[#007acc] disabled:bg-gray-400 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none font-medium"
          >
            ⏭️ Next
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-[#4a4a4a] mb-2 font-medium">Animation Speed:</label>
          <input
            type="range"
            min="100"
            max="3000"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: 'linear-gradient(to right, #ff6ec4, #7873f5)'
            }}
          />
          <div className="text-center text-[#ff4e88] font-bold mt-2">{speed}ms per step</div>
        </div>

        <div className="mb-4">
          <label className="block text-[#4a4a4a] mb-2 font-medium">Step Progress:</label>
          <input
            type="range"
            min="0"
            max={Math.max(0, steps.length - 1)}
            value={currentStep}
            onChange={(e) => goToStep(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: 'linear-gradient(to right, #ff6ec4, #7873f5)'
            }}
          />
          <div className="text-center text-[#ff4e88] font-bold mt-2">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
        <h3 className="text-xl font-semibold text-[#ff4e88] mb-4">Step Explanation</h3>
        <div className="bg-gray-50 rounded-xl p-4 text-[#4a4a4a] leading-relaxed border border-gray-100">
          {explanation || 'Click "Play" to start the algorithm visualization and see step-by-step explanations.'}
        </div>
      </div>

      {/* Visualization */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
        <h3 className="text-xl font-semibold text-[#ff4e88] mb-4">Algorithm Visualization</h3>
        
        {currentArray.length > 0 ? (
          <div className="space-y-4">
            <div className="text-center text-[#4a4a4a] font-medium">
              <p>Current Array: [{currentArray.join(', ')}]</p>
            </div>
            
            <div className="flex justify-center items-end space-x-2 h-64 bg-gray-50 rounded-xl p-4 overflow-x-auto border border-gray-100">
              {currentArray.map((value, index) => {
                const isHighlighted = steps[currentStep]?.highlighted?.includes(index);
                const animation = steps[currentStep]?.animation || '';
                const gradientClass = getBarGradient(index, isHighlighted);
                
                return (
                  <div
                    key={index}
                    className={`text-white text-xs flex items-end justify-center min-w-8 rounded-t-xl transition-all duration-500 shadow-md ${
                      isHighlighted 
                        ? `bg-gradient-to-t ${gradientClass} shadow-lg scale-110 ring-2 ring-yellow-300 ring-opacity-50` 
                        : `bg-gradient-to-t ${gradientClass}`
                    }`}
                    style={{ 
                      height: `${Math.max(value * 2, 20)}px`,
                      animation: animation === 'bubble' ? 'bubble 1s ease-in-out' : 
                               animation === 'swap' ? 'swap 0.5s ease-in-out' :
                               animation === 'pivot' ? 'pivot 1s ease-in-out' :
                               animation === 'merge-start' ? 'mergeStart 1s ease-in-out' :
                               animation === 'divide' ? 'divide 1s ease-in-out' : 'none'
                    }}
                  >
                    <span className="mb-1 font-bold drop-shadow-sm">{value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No array to visualize</p>
        )}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff6ec4, #7873f5);
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff6ec4, #7873f5);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        
        @keyframes bubble {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes swap {
          0% { transform: translateX(0); }
          50% { transform: translateX(10px); }
          100% { transform: translateX(0); }
        }
        
        @keyframes pivot {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        
        @keyframes mergeStart {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
        
        @keyframes divide {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(5deg); }
        }
      `}</style>
    </div>
  );
};

export default EnhancedSortingVisualizer; 