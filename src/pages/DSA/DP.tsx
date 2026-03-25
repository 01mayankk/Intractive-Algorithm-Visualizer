import React, { useState, useEffect, useRef } from 'react';
import AlgorithmVisualizer from '../../components/DSA/AlgorithmVisualizer';
import { motion } from 'framer-motion';

const KNAPSACK_CODE = `int knapSack(int W, int wt[], int val[], int n) {
  int i, w;
  int K[n + 1][W + 1];

  for (i = 0; i <= n; i++) {
      for (w = 0; w <= W; w++) {
          if (i == 0 || w == 0)
              K[i][w] = 0;
          else if (wt[i - 1] <= w)
              K[i][w] = max(val[i - 1] + K[i - 1][w - wt[i - 1]], K[i - 1][w]);
          else
              K[i][w] = K[i - 1][w];
      }
  }
  return K[n][W];
}`;

export default function DPVis() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [activeLine, setActiveLine] = useState(0);
  const [explanation, setExplanation] = useState("Initializing the DP table for 0/1 Knapsack.");
  
  // Weights and values
  const weights = [2, 3, 4, 5];
  const values = [3, 4, 5, 6];
  const W = 5;
  const n = weights.length;

  const [dpTable, setDpTable] = useState<number[][]>(() => {
    const table = Array(n + 1).fill(0).map(() => Array(W + 1).fill(-1));
    for(let i=0; i<=n; i++) table[i][0] = 0;
    for(let w=0; w<=W; w++) table[0][w] = 0;
    return table;
  });
  
  const [currentRow, setCurrentRow] = useState(1);
  const [currentCol, setCurrentCol] = useState(1);
  const [isDone, setIsDone] = useState(false);
  
  // Highlight cells
  const [comparingTop, setComparingTop] = useState<{r:number, c:number}|null>(null);
  const [comparingLeft, setComparingLeft] = useState<{r:number, c:number}|null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    resetVis();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetVis = () => {
    const table = Array(n + 1).fill(0).map(() => Array(W + 1).fill(-1));
    for(let i=0; i<=n; i++) table[i][0] = 0;
    for(let w=0; w<=W; w++) table[0][w] = 0;
    setDpTable(table);
    setCurrentRow(1);
    setCurrentCol(1);
    setIsDone(false);
    setActiveLine(0);
    setExplanation("Initializing the DP table. Row 0 and Col 0 are zeros.");
    setIsPlaying(false);
    setComparingTop(null);
    setComparingLeft(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const performStep = () => {
    if (isDone) {
      setIsPlaying(false);
      return;
    }

    const i = currentRow;
    const w = currentCol;
    
    // We are currently deciding cell dp[i][w]
    if (activeLine === 0 || activeLine === 5 || activeLine === 6 || activeLine === 15) {
      setActiveLine(9);
      setExplanation(`Can item ${i} (Weight: ${weights[i-1]}, Value: ${values[i-1]}) fit in knapsack of capacity ${w}?`);
      setComparingTop(null);
      setComparingLeft(null);
      return;
    }

    if (activeLine === 9) {
      if (weights[i-1] <= w) {
        setActiveLine(10);
        setExplanation(`Yes, it fits! We can either include it or exclude it. We take the max of: \n1) Excluding it: Value is ${dpTable[i-1][w]} \n2) Including it: Value ${values[i-1]} + DP[${i-1}][${w - weights[i-1]}] = ${values[i-1] + dpTable[i-1][w - weights[i-1]]}`);
        setComparingTop({ r: i-1, c: w });
        setComparingLeft({ r: i-1, c: w - weights[i-1] });
      } else {
        setActiveLine(12);
        setExplanation(`No, item ${i} is too heavy (${weights[i-1]} > ${w}). We must exclude it.`);
      }
      return;
    }

    if (activeLine === 10 || activeLine === 12) {
      const newTable = [...dpTable.map(row => [...row])];
      if (weights[i-1] <= w) {
        newTable[i][w] = Math.max(
          values[i-1] + newTable[i-1][w - weights[i-1]], 
          newTable[i-1][w]
        );
      } else {
        newTable[i][w] = newTable[i-1][w];
        setActiveLine(13);
      }
      setDpTable(newTable);
      setExplanation(`Cell DP[${i}][${w}] is calculated as ${newTable[i][w]}. Moving to next cell.`);
      setComparingTop(null);
      setComparingLeft(null);
      setActiveLine(15);
      return;
    }

    // Move to next iteration
    if (activeLine === 15 || activeLine === 13) {
      if (currentCol < W) {
        setCurrentCol(c => c + 1);
        setActiveLine(6);
      } else if (currentRow < n) {
        setCurrentRow(r => r + 1);
        setCurrentCol(1);
        setActiveLine(5);
      } else {
        setIsDone(true);
        setActiveLine(17);
        setExplanation(`Completed! The maximum value we can obtain with capacity ${W} is ${dpTable[n][W]}.`);
        setIsPlaying(false);
      }
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
  }, [isPlaying, currentRow, currentCol, activeLine, isDone, speed, dpTable]);

  return (
    <div className="p-4 md:p-8">
      <AlgorithmVisualizer
        title="0/1 Knapsack (DP)"
        description="Dynamic Programming approach to solve the classic 0/1 Knapsack problem."
        codeSnippet={KNAPSACK_CODE}
        explanationText={explanation}
        activeLine={activeLine}
        complexities={{
          best: "O(n*W)",
          average: "O(n*W)",
          worst: "O(n*W)",
          space: "O(n*W)"
        }}
        theoryContent={
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Concept</h2>
            <p>Given a set of items, each with a weight and a value, determine the number of each item to include in a collection so that the total weight is less than or equal to a given limit and the total value is as large as possible.</p>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Intuition</h2>
            <p>Dynamic Programming solves this by breaking it into subproblems. For every item, we have two choices: either include it in the knapsack (if weight permits) or exclude it. We build a table where row `i` represents using first `i` items, and column `w` represents capacity `w`.</p>
          </div>
        }
        interviewContent={
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Common DP Patterns</h2>
            <ul className="list-disc pl-5">
              <li><strong>Fractional Knapsack:</strong> Uses Greedy algorithm, NOT DP! (Allowed to take fractions of items)</li>
              <li><strong>Subset Sum:</strong> A direct variation of 0/1 Knapsack where value == weight.</li>
              <li><strong>Target Sum:</strong> Another variation on Leetcode using similar state limits.</li>
            </ul>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Gotchas</h2>
            <p>The space complexity can be optimized to O(W) instead of O(n*W) by only storing the previous row, because DP[i][w] only ever looks up DP[i-1][x]!</p>
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
        <div className="w-full h-full p-4 flex flex-col items-center">
          
          <div className="flex gap-8 mb-6 text-sm md:text-base w-full max-w-2xl justify-center">
            <div className="flex flex-col">
              <span className="font-bold text-slate-500 mb-2">Item Values</span>
              <div className="flex gap-2">
                {values.map((v, i) => (
                   <div key={i} className={`w-8 h-8 md:w-10 md:h-10 border rounded flex items-center justify-center font-bold ${currentRow === i+1 ? 'bg-indigo-500 text-white border-indigo-600' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'}`}>{v}</div>
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-500 mb-2">Item Wts</span>
              <div className="flex gap-2">
                {weights.map((w, i) => (
                   <div key={i} className={`w-8 h-8 md:w-10 md:h-10 border rounded flex items-center justify-center font-bold ${currentRow === i+1 ? 'bg-rose-500 text-white border-rose-600' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'}`}>{w}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto w-full max-w-2xl">
            <table className="border-collapse mx-auto">
              <thead>
                <tr>
                  <th className="p-2 border border-slate-300 dark:border-slate-700 font-semibold text-slate-500">i \ w</th>
                  {Array(W + 1).fill(0).map((_, i) => (
                    <th key={i} className={`p-2 border border-slate-300 dark:border-slate-700 min-w-[3rem] text-center font-semibold ${currentCol === i && currentRow > 0 ? 'text-primary-500' : 'text-slate-500'}`}>{i}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dpTable.map((row, r) => (
                  <tr key={r}>
                    <td className={`p-2 border border-slate-300 dark:border-slate-700 font-semibold text-center ${currentRow === r ? 'text-primary-500' : 'text-slate-500'}`}>
                      {r} {r > 0 ? `(wt:${weights[r-1]})` : ''}
                    </td>
                    {row.map((val, c) => {
                       const isCurrentCell = currentRow === r && currentCol === c && !isDone && r>0;
                       const isComparingTop = comparingTop?.r === r && comparingTop?.c === c;
                       const isComparingLeft = comparingLeft?.r === r && comparingLeft?.c === c;
                       
                       let bgClass = "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300";
                       if (isCurrentCell) bgClass = "bg-primary-500 text-white font-bold ring-2 ring-primary-300 scale-105 z-10 transition-transform shadow-md";
                       else if (isComparingTop || isComparingLeft) bgClass = "bg-amber-400 text-amber-900 font-bold animate-pulse ring-2 ring-amber-300";
                       else if (val === -1) bgClass = "bg-slate-50 dark:bg-slate-900/50 text-slate-300 dark:text-slate-700";
                       else if (val === 0) bgClass = "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-500";
                       else bgClass = "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-bold";

                       return (
                         <td key={c} className={`p-2 md:p-4 border border-slate-300 dark:border-slate-700 text-center transition-all duration-300 relative ${bgClass}`}>
                           {val === -1 ? '' : val}
                           {isCurrentCell && <motion.div layoutId="highlight" className="absolute inset-0 bg-primary-400/20 z-0 pointer-events-none" />}
                         </td>
                       );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AlgorithmVisualizer>
    </div>
  );
}
