import React, { useState, useEffect, useRef } from 'react';
import AlgorithmVisualizer from '../../components/DSA/AlgorithmVisualizer';
import { motion } from 'framer-motion';

const KADANE_CODE = `int maxSubArray(int nums[], int n) {
  int max_so_far = nums[0];
  int current_max = nums[0];

  for (int i = 1; i < n; i++) {
      current_max = max(nums[i], current_max + nums[i]);
      max_so_far = max(max_so_far, current_max);
  }

  return max_so_far;
}`;

export default function KadaneVis() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [activeLine, setActiveLine] = useState(0);
  const [explanation, setExplanation] = useState("Click Play or Step to begin Kadane's Algorithm.");
  
  const array = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentMax, setCurrentMax] = useState(-Infinity);
  const [maxSoFar, setMaxSoFar] = useState(-Infinity);
  const [bestStart, setBestStart] = useState(0);
  const [bestEnd, setBestEnd] = useState(0);
  const [tempStart, setTempStart] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    resetVis();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetVis = () => {
    setCurrentIndex(1);
    setCurrentMax(array[0]);
    setMaxSoFar(array[0]);
    setBestStart(0);
    setBestEnd(0);
    setTempStart(0);
    setIsDone(false);
    setActiveLine(0);
    setExplanation(`Initialized max_so_far = \${array[0]}, current_max = \${array[0]}. Started loop from index 1 (\${array[1]}).`);
    setIsPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const performStep = () => {
    if (isDone) {
      setIsPlaying(false);
      return;
    }

    if (activeLine === 0 || activeLine === 4 || activeLine === 7) {
      if (currentIndex >= array.length) {
         setActiveLine(10);
         setExplanation(`Finished processing the array. The Maximum Subarray Sum is \${maxSoFar}.`);
         setIsDone(true);
         setIsPlaying(false);
         return;
      }
      
      setActiveLine(5);
      setExplanation(`Looking at index \${currentIndex} (value: \${array[currentIndex]}). Should we start a new subarray here, or extend the previous one?`);
      return;
    }

    if (activeLine === 5) {
      const val = array[currentIndex];
      let newCurrentMax = currentMax + val;
      
      if (val > newCurrentMax) {
        setTempStart(currentIndex);
        newCurrentMax = val;
        setExplanation(`Starting a new subarray is better! current_max = \${val}`);
      } else {
        setExplanation(`Extending current subarray is better: \${currentMax} + \${val} = \${newCurrentMax}`);
      }
      
      setCurrentMax(newCurrentMax);
      setActiveLine(6);
      return;
    }

    if (activeLine === 6) {
       if (currentMax > maxSoFar) {
          setMaxSoFar(currentMax);
          setBestStart(tempStart);
          setBestEnd(currentIndex);
          setExplanation(`Found a new global maximum sum! max_so_far is now \${currentMax}. Best subarray starts at index \${tempStart} and ends at \${currentIndex}.`);
       } else {
          setExplanation(`current_max (\${currentMax}) is not strictly greater than max_so_far (\${maxSoFar}). No global update.`);
       }
       setActiveLine(7);
       setCurrentIndex(idx => idx + 1);
       return;
    }
  };

  const getDelay = () => {
    const delays = { 1: 2000, 2: 1200, 3: 800, 4: 400, 5: 100 };
    return delays[speed as keyof typeof delays] || 800;
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
  }, [isPlaying, currentIndex, activeLine, isDone, speed, currentMax, maxSoFar]);

  return (
    <div className="p-4 md:p-8">
      <AlgorithmVisualizer
        title="Kadane's Algorithm"
        description="Finds the contiguous subarray within a one-dimensional array of numbers which has the largest sum."
        codeSnippet={KADANE_CODE}
        explanationText={explanation}
        activeLine={activeLine}
        complexities={{
          best: "O(n)",
          average: "O(n)",
          worst: "O(n)",
          space: "O(1)"
        }}
        theoryContent={
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Concept</h2>
            <p>Kadane's Algorithm is an iterative dynamic programming algorithm to find the maximum sum of a contiguous subarray in an array of numbers.</p>
            <h2 className="text-xl font-bold">Intuition</h2>
            <p>At each index 'i', we decide whether to add the element to the current running subarray sum, or start a completely new subarray at 'i'. If adding the current element makes our running sum WORSE than just the element itself, we throw away the history and start fresh.</p>
          </div>
        }
        interviewContent={
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Variations</h2>
            <ul className="list-disc pl-5">
               <li><strong>Maximum Product Subarray:</strong> Keep track of BOTH min and max products since multiplying two negative numbers can suddenly produce a huge positive!</li>
               <li><strong>Circular array:</strong> Finding max sum if array wraps around. Compare Kadane's on standard array with total_sum - Kadane's on INVERTED array.</li>
            </ul>
             <h2 className="text-xl font-bold">Gotchas</h2>
             <p>If ALL numbers in the array are negative, Kadane's algorithm (as written) will still return the single largest negative number. (Unless written to return 0, which is an interview clarification you MUST ask!)</p>
          </div>
        }
        isPlaying={isPlaying}
        canStep={!isDone}
        speed={speed}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onStep={performStep}
        onReset={resetVis}
        onSpeedChange={setSpeed}
      >
        <div className="w-full h-full p-4 flex flex-col items-center justify-center gap-12">
          
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 max-w-3xl">
            {array.map((val, idx) => {
               const isCurrent = idx === currentIndex && activeLine >= 5 && activeLine < 7;
               const isBestSubarray = idx >= bestStart && idx <= bestEnd;
               const isCurrentSubarray = idx >= tempStart && idx <= currentIndex && !isBestSubarray;

               let bgClass = "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700";
               
               if (isBestSubarray) {
                 bgClass = "bg-emerald-500 text-white border-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-110 z-10";
               } else if (isCurrent) {
                 bgClass = "bg-primary-500 text-white border-primary-600 scale-105 ring-4 ring-primary-300/50";
               } else if (isCurrentSubarray) {
                 bgClass = "bg-amber-400 text-amber-900 border-amber-500";
               }

               return (
                 <motion.div 
                   layout
                   key={idx}
                   className={\`w-12 h-12 md:w-16 md:h-16 flex flex-col items-center justify-center font-bold text-xl border rounded-xl transition-all duration-300 relative \${bgClass}\`}
                 >
                   {val}
                   <span className="absolute -bottom-6 text-xs text-slate-400 font-semibold">{idx}</span>
                 </motion.div>
               );
            })}
          </div>

          <div className="flex gap-8 w-full max-w-2xl mt-8">
             <div className="flex-1 glass-panel p-6 rounded-2xl border-l-4 border-l-amber-500 shadow-md">
               <span className="text-sm font-bold text-slate-500 uppercase tracking-wider block mb-2">Running Subarray Sum</span>
               <span className="text-4xl font-black text-amber-600 dark:text-amber-400">{currentMax === -Infinity ? '-' : currentMax}</span>
             </div>
             <div className="flex-1 glass-panel p-6 rounded-2xl border-l-4 border-l-emerald-500 shadow-md">
               <span className="text-sm font-bold text-slate-500 uppercase tracking-wider block mb-2">Global Maximum Sum</span>
               <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">{maxSoFar === -Infinity ? '-' : maxSoFar}</span>
             </div>
          </div>

        </div>
      </AlgorithmVisualizer>
    </div>
  );
}
