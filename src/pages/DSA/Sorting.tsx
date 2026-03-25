import React, { useState, useEffect, useRef } from 'react';
import AlgorithmVisualizer from '../../components/DSA/AlgorithmVisualizer';

const BUBBLE_SORT_CODE = `void bubbleSort(int arr[], int n) {
  for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - i - 1; j++) {
      // Compare adjacent elements
      if (arr[j] > arr[j + 1]) {
        // Swap them if they are in the wrong order
        swap(&arr[j], &arr[j + 1]);
      }
    }
  }
}`;

export default function SortingVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  
  const [activeLine, setActiveLine] = useState(0);
  const [explanation, setExplanation] = useState("Click Play or Step to begin the Bubble Sort visualization.");
  
  // Sorting state
  const [i, setI] = useState(0);
  const [j, setJ] = useState(0);
  const [comparing, setComparing] = useState<[number, number] | null>(null);
  const [swapping, setSwapping] = useState<[number, number] | null>(null);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [isSorted, setIsSorted] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize random array
  useEffect(() => {
    resetArray();
  }, []);

  const resetArray = () => {
    const newArr = Array.from({ length: 15 }, () => Math.floor(Math.random() * 80) + 10);
    setArray(newArr);
    setI(0);
    setJ(0);
    setComparing(null);
    setSwapping(null);
    setSortedIndices([]);
    setIsSorted(false);
    setActiveLine(0);
    setExplanation("Array reset. Ready to sort.");
    setIsPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const getDelay = () => {
    const delays = { 1: 1500, 2: 1000, 3: 500, 4: 200, 5: 50 };
    return delays[speed as keyof typeof delays] || 500;
  };

  const performStep = () => {
    if (isSorted) {
      setIsPlaying(false);
      return;
    }

    let nextI = i;
    let nextJ = j;
    
    // We are at the end of a pass
    if (nextJ >= array.length - nextI - 1) {
      setSortedIndices(prev => [...prev, array.length - nextI - 1]);
      nextI++;
      nextJ = 0;
      
      if (nextI >= array.length - 1) {
        setIsSorted(true);
        setSortedIndices(prev => [...prev, 0]); // First element is also sorted
        setActiveLine(0);
        setExplanation("Array is fully sorted! Bubble Sort complete.");
        setIsPlaying(false);
        setComparing(null);
        setSwapping(null);
        return;
      }
      
      setI(nextI);
      setJ(nextJ);
      setActiveLine(1);
      setExplanation(`Starting pass ${nextI + 1}. The last ${nextI} elements are already in their correct sorted positions.`);
      setComparing(null);
      setSwapping(null);
      return;
    }

    // Still in the middle of a pass
    if (swapping) {
      // Just finished a swap, move to next compare
      setSwapping(null);
      setJ(nextJ + 1);
      setActiveLine(2);
      setExplanation(`Moving to next pair: elements at index ${nextJ + 1} and ${nextJ + 2}.`);
    } else {
      // We are comparing
      setComparing([nextJ, nextJ + 1]);
      setActiveLine(4);
      setExplanation(`Comparing arr[${nextJ}] (${array[nextJ]}) and arr[${nextJ + 1}] (${array[nextJ + 1]}).`);
      
      if (array[nextJ] > array[nextJ + 1]) {
        // Need to swap
        setTimeout(() => {
          setArray(prev => {
            const arr = [...prev];
            const temp = arr[nextJ];
            arr[nextJ] = arr[nextJ + 1];
            arr[nextJ + 1] = temp;
            return arr;
          });
          setSwapping([nextJ, nextJ + 1]);
          setActiveLine(6);
          setExplanation(`Because ${array[nextJ]} > ${array[nextJ + 1]}, we swap them.`);
        }, getDelay() / 2);
      } else {
        // No swap needed, just move to next
        setTimeout(() => {
          setJ(nextJ + 1);
          setActiveLine(2);
          setExplanation(`They are in correct order. Moving to next pair.`);
        }, getDelay() / 2);
      }
    }
  };

  useEffect(() => {
    if (isPlaying && !isSorted) {
      timerRef.current = setTimeout(() => {
        performStep();
      }, getDelay());
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, i, j, swapping, isSorted, speed, array]);

  const maxVal = Math.max(...array, 100);

  return (
    <div className="p-4 md:p-8">
      <AlgorithmVisualizer
        title="Bubble Sort"
        description="A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order."
        codeSnippet={BUBBLE_SORT_CODE}
        explanationText={explanation}
        activeLine={activeLine}
        complexities={{
          best: "N",
          average: "N²",
          worst: "N²",
          space: "1"
        }}
        theoryContent={
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Concept</h2>
            <p>Bubble Sort is the simplest sorting algorithm that works by repeatedly swapping the adjacent elements if they are in the wrong order. This process is repeated until the array is sorted.</p>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Intuition</h2>
            <p>Think of it like bubbles rising to the surface of water. In each pass, the largest unsorted element "bubbles up" to its correct position at the end of the array.</p>
          </div>
        }
        interviewContent={
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Interview Questions</h2>
            <ul className="list-disc pl-5">
              <li><strong>Can Bubble Sort be optimized?</strong> Yes, by adding a boolean flag to track if any swaps occurred in the inner loop. If no swaps occurred, the array is already sorted, and we can terminate early.</li>
              <li><strong>Is Bubble Sort stable?</strong> Yes, the relative order of items with equal values is preserved (we only swap if {'>'} not {'>='}).</li>
            </ul>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Real-world Usage</h2>
            <p>Bubble Sort is almost never used in production due to its O(N²) worst-case complexity. It is primarily used as an educational tool to introduce the concept of sorting algorithms.</p>
          </div>
        }
        isPlaying={isPlaying}
        canStep={!isSorted}
        speed={speed}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onStep={() => performStep()}
        onReset={resetArray}
        onSpeedChange={setSpeed}
      >
        <div className="flex items-end justify-center gap-1 md:gap-2 h-full w-full max-h-[400px]">
          {array.map((val, idx) => {
            let bgClass = "bg-slate-300 dark:bg-slate-600";
            let translate = "";
            let scaleClass = "";
            
            if (sortedIndices.includes(idx)) {
              bgClass = "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]";
            } else if (swapping && (idx === swapping[0] || idx === swapping[1])) {
              bgClass = "bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]";
              scaleClass = "scale-y-105 z-10";
              // Visual swap animation using translate
              if (idx === swapping[0]) translate = "translate-x-[110%]";
              if (idx === swapping[1]) translate = "-translate-x-[110%]";
            } else if (comparing && (idx === comparing[0] || idx === comparing[1])) {
              bgClass = "bg-primary-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]";
              scaleClass = "scale-y-105";
            }

            return (
              <div 
                key={idx}
                className={`relative flex flex-col items-center justify-end w-8 md:w-12 transition-all duration-300 ease-in-out ${translate} ${scaleClass}`}
                style={{ height: `${(val / maxVal) * 90}%` }}
              >
                <div className={`w-full h-full rounded-t-md ${bgClass} transition-colors duration-300`} />
                <span className="absolute -bottom-6 text-xs font-bold text-slate-600 dark:text-slate-400">
                  {val}
                </span>
              </div>
            );
          })}
        </div>
      </AlgorithmVisualizer>
    </div>
  );
}
