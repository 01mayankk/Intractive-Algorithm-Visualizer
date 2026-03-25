import React, { useState, useEffect, useRef } from 'react';
import AlgorithmVisualizer from '../../components/DSA/AlgorithmVisualizer';

const LINEAR_SEARCH_CODE = `int linearSearch(int arr[], int n, int target) {
  for (int i = 0; i < n; i++) {
    // Check if the current element matches the target
    if (arr[i] == target) {
      return i; // Target found
    }
  }
  return -1; // Target not found
}`;

export default function SearchingVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [target, setTarget] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  
  const [activeLine, setActiveLine] = useState(0);
  const [explanation, setExplanation] = useState("Click Play or Step to begin the Linear Search visualization.");
  
  // Search state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [isDone, setIsDone] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    resetSearch();
  }, []);

  const resetSearch = () => {
    const newArr = Array.from({ length: 15 }, () => Math.floor(Math.random() * 80) + 10);
    setArray(newArr);
    // Pick a random target from the array (80% chance) or random number (20% chance)
    const newTarget = Math.random() > 0.2 
      ? newArr[Math.floor(Math.random() * newArr.length)] 
      : Math.floor(Math.random() * 80) + 10;
      
    setTarget(newTarget);
    setCurrentIndex(0);
    setFoundIndex(null);
    setIsDone(false);
    setActiveLine(0);
    setExplanation(`Array generated. Target is ${newTarget}. Ready to search.`);
    setIsPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const getDelay = () => {
    const delays = { 1: 1500, 2: 1000, 3: 500, 4: 200, 5: 50 };
    return delays[speed as keyof typeof delays] || 500;
  };

  const performStep = () => {
    if (isDone) {
      setIsPlaying(false);
      return;
    }

    // Entering the loop or moving to next element
    if (activeLine === 0 || activeLine === 2) {
      if (currentIndex >= array.length) {
        setIsDone(true);
        setActiveLine(8);
        setExplanation(`Checked all elements. Target ${target} was not found in the array.`);
        setIsPlaying(false);
        return;
      }
      
      setActiveLine(4);
      setExplanation(`Checking element at index ${currentIndex} (value: ${array[currentIndex]}). Is it equal to ${target}?`);
      return;
    }

    // Checking the condition
    if (activeLine === 4) {
      if (array[currentIndex] === target) {
        setActiveLine(5);
        setFoundIndex(currentIndex);
        setIsDone(true);
        setExplanation(`Match found! Element ${array[currentIndex]} equals ${target} at index ${currentIndex}.`);
        setIsPlaying(false);
      } else {
        setActiveLine(2);
        setCurrentIndex(prev => prev + 1);
        setExplanation(`${array[currentIndex]} != ${target}. Moving to the next index.`);
      }
      return;
    }
  };

  useEffect(() => {
    if (isPlaying && !isDone) {
      timerRef.current = setTimeout(() => {
        performStep();
      }, getDelay());
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentIndex, activeLine, isDone, speed, array, target]);

  return (
    <div className="p-4 md:p-8">
      <AlgorithmVisualizer
        title="Linear Search"
        description="A simple search algorithm that checks every element in the list sequentially until the target is found."
        codeSnippet={LINEAR_SEARCH_CODE}
        explanationText={explanation}
        activeLine={activeLine}
        isPlaying={isPlaying}
        canStep={!isDone}
        speed={speed}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onStep={performStep}
        onReset={resetSearch}
        onSpeedChange={setSpeed}
      >
        <div className="flex flex-col items-center w-full h-full max-h-[400px]">
          
          {/* Target Indicator */}
          <div className="mb-12 glass-panel px-6 py-3 rounded-2xl flex items-center gap-4 border-2 border-primary-500">
            <span className="text-slate-500 font-semibold uppercase tracking-wider text-sm">Target Value</span>
            <span className="text-3xl font-bold text-primary-600">{target}</span>
          </div>

          <div className="flex flex-wrap justify-center gap-3 w-full">
            {array.map((val, idx) => {
              let bgClass = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300";
              let shadow = "";
              let scale = "";

              if (foundIndex === idx) {
                bgClass = "bg-green-500 border-green-600 text-white";
                shadow = "shadow-[0_0_20px_rgba(34,197,94,0.5)]";
                scale = "scale-110 z-10";
              } else if (idx === currentIndex && !isDone) {
                bgClass = "bg-primary-500 border-primary-600 text-white";
                shadow = "shadow-[0_0_20px_rgba(99,102,241,0.5)]";
                scale = "scale-110 z-10 animate-bounce";
              } else if (idx < currentIndex) {
                bgClass = "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400 opacity-50";
              }

              return (
                <div 
                  key={idx}
                  className={`relative flex flex-col items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-xl border-2 font-bold text-xl transition-all duration-300 ${bgClass} ${shadow} ${scale}`}
                >
                  {val}
                  <span className="absolute -bottom-6 text-xs font-semibold text-slate-400">
                    {idx}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </AlgorithmVisualizer>
    </div>
  );
}
