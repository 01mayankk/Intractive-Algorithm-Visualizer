import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

// Grid Dimensions
const ROWS = 5;
const COLS = 5;

// Cell Types
enum CellType {
  EMPTY,
  OBSTACLE,
  GOAL,
  TRAP
}

// Q-Table structure: [row][col][action]
type QTable = number[][][];

const ACTIONS = [
  { dr: -1, dc: 0, icon: '↑' }, // UP
  { dr: 1, dc: 0, icon: '↓' },  // DOWN
  { dr: 0, dc: -1, icon: '←' }, // LEFT
  { dr: 0, dc: 1, icon: '→' }   // RIGHT
];

export default function QLearningGrid() {
  const [grid, setGrid] = useState<CellType[][]>(() => {
    const initialGrid = Array(ROWS).fill(0).map(() => Array(COLS).fill(CellType.EMPTY));
    initialGrid[4][4] = CellType.GOAL;
    initialGrid[2][2] = CellType.OBSTACLE;
    initialGrid[2][3] = CellType.OBSTACLE;
    initialGrid[1][4] = CellType.TRAP;
    initialGrid[3][1] = CellType.TRAP;
    return initialGrid;
  });

  const [qTable, setQTable] = useState<QTable>(() => 
    Array(ROWS).fill(0).map(() => Array(COLS).fill(0).map(() => Array(4).fill(0)))
  );

  const [agentPos, setAgentPos] = useState({ r: 0, c: 0 });
  const [episodes, setEpisodes] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [status, setStatus] = useState("Click 'Train Agent' to start background episodic training, or 'Step' to watch live.");
  
  // Hyperparameters
  const alpha = 0.1;   // Learning Rate
  const gamma = 0.9;   // Discount Factor
  const epsilonRef = useRef(1.0); // Exploration Rate
  const minEpsilon = 0.01;
  const epsilonDecay = 0.995;

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetAgent = () => {
    setAgentPos({ r: 0, c: 0 });
  };

  const getReward = (r: number, c: number) => {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return -10; // Wall penalty
    if (grid[r][c] === CellType.GOAL) return 100;
    if (grid[r][c] === CellType.TRAP) return -100;
    return -1; // Living penalty
  };

  const stepAgent = () => {
    let { r, c } = agentPos;
    
    // If agent reached terminal state, reset for next episode
    if (grid[r][c] === CellType.GOAL || grid[r][c] === CellType.TRAP) {
      resetAgent();
      setEpisodes(e => e + 1);
      epsilonRef.current = Math.max(minEpsilon, epsilonRef.current * epsilonDecay);
      setStatus(`Episode ${episodes + 1} complete. Resetting agent. Epsilon = ${epsilonRef.current.toFixed(2)}`);
      return;
    }

    // Epsilon-Greedy Action Selection
    let actionIdx = 0;
    if (Math.random() < epsilonRef.current) {
      // Explore
      actionIdx = Math.floor(Math.random() * 4);
    } else {
      // Exploit (argmax Q)
      const qValues = qTable[r][c];
      const maxQ = Math.max(...qValues);
      
      // If multiple actions have the same max Q, pick randomly among them
      const maxIndices = [];
      for (let i = 0; i < 4; i++) {
        if (qValues[i] === maxQ) maxIndices.push(i);
      }
      actionIdx = maxIndices[Math.floor(Math.random() * maxIndices.length)];
    }

    const action = ACTIONS[actionIdx];
    let nextR = r + action.dr;
    let nextC = c + action.dc;

    // Check bounds & obstacles
    if (nextR < 0 || nextR >= ROWS || nextC < 0 || nextC >= COLS || grid[nextR][nextC] === CellType.OBSTACLE) {
       nextR = r; // Bounce back
       nextC = c;
    }

    const reward = getReward(nextR, nextC);

    // Q-Learning formula: Q(s,a) = Q(s,a) + alpha * (reward + gamma * max(Q(s')) - Q(s,a))
    const maxNextQ = Math.max(...qTable[nextR][nextC]);
    const newQList = [...qTable];
    newQList[r][c][actionIdx] += alpha * (reward + gamma * maxNextQ - newQList[r][c][actionIdx]);
    
    setQTable(newQList);
    setAgentPos({ r: nextR, c: nextC });
    
    setStatus(`Agent moved ${action.icon}. Reward: ${reward}. Updated Q(${r},${c}) for action ${action.icon}.`);
  };

  // Background Fast Training
  const trainFast = () => {
     setIsTraining(true);
     setIsPlaying(false);
     
     let currentEps = epsilonRef.current;
     let tempQ = [...qTable.map(row => [...row.map(cell => [...cell])])];
     
     // Run 500 episodes instantly
     for(let ep = 0; ep < 500; ep++) {
        let r = 0, c = 0;
        let steps = 0;
        
        while(grid[r][c] !== CellType.GOAL && grid[r][c] !== CellType.TRAP && steps < 100) {
           let actionIdx = 0;
           if (Math.random() < currentEps) {
             actionIdx = Math.floor(Math.random() * 4);
           } else {
             const maxQ = Math.max(...tempQ[r][c]);
             const maxIndices = tempQ[r][c].map((v, i) => v === maxQ ? i : -1).filter(v => v !== -1);
             actionIdx = maxIndices[Math.floor(Math.random() * maxIndices.length)];
           }
           
           const action = ACTIONS[actionIdx];
           let nextR = r + action.dr;
           let nextC = c + action.dc;
           if (nextR < 0 || nextR >= ROWS || nextC < 0 || nextC >= COLS || grid[nextR][nextC] === CellType.OBSTACLE) {
              nextR = r; nextC = c;
           }
           const reward = getReward(nextR, nextC);
           const maxNextQ = Math.max(...tempQ[nextR][nextC]);
           
           tempQ[r][c][actionIdx] += alpha * (reward + gamma * maxNextQ - tempQ[r][c][actionIdx]);
           r = nextR;
           c = nextC;
           steps++;
        }
        currentEps = Math.max(minEpsilon, currentEps * epsilonDecay);
     }
     
     setQTable(tempQ);
     epsilonRef.current = currentEps;
     setEpisodes(e => e + 500);
     resetAgent();
     setIsTraining(false);
     setStatus("Fast trained 500 episodes! Agent is much smarter now. Watch it exploit the learned policy.");
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        stepAgent();
      }, 300); // Live step speed
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, agentPos, qTable]);

  const resetAll = () => {
    setQTable(Array(ROWS).fill(0).map(() => Array(COLS).fill(0).map(() => Array(4).fill(0))));
    epsilonRef.current = 1.0;
    setEpisodes(0);
    resetAgent();
    setIsPlaying(false);
    setStatus("Q-Table reset. Agent has lost all memory.");
  };

  const getMaxActionIndicator = (r: number, c: number) => {
    if (grid[r][c] === CellType.GOAL || grid[r][c] === CellType.TRAP || grid[r][c] === CellType.OBSTACLE) return null;
    const qValues = qTable[r][c];
    if (qValues.every(v => v === 0)) return null; // No explored actions yet
    
    const maxQ = Math.max(...qValues);
    const actionIdx = qValues.indexOf(maxQ);
    
    return (
      <span className="text-slate-400 absolute text-[10px] sm:text-lg opacity-50 font-bold pointer-events-none">
        {ACTIONS[actionIdx].icon}
      </span>
    );
  };

  const handleCellClick = (r: number, c: number) => {
    if (r === 0 && c === 0) return; // Can't change spawn
    if (r === 4 && c === 4) return; // Can't change target
    
    // Cycle cell type
    const newGrid = [...grid.map(row => [...row])];
    const current = newGrid[r][c];
    if (current === CellType.EMPTY) newGrid[r][c] = CellType.OBSTACLE;
    else if (current === CellType.OBSTACLE) newGrid[r][c] = CellType.TRAP;
    else if (current === CellType.TRAP) newGrid[r][c] = CellType.EMPTY;
    
    setGrid(newGrid);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full h-[calc(100vh-8rem)] p-4 md:p-8">
      
      {/* Right Column - Controls */}
      <div className="flex-1 min-w-[300px] flex flex-col gap-4">
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Q-Learning Agent</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
            A Reinforcement Learning algorithm that learns optimal actions by exploring and updating a Q-Table.
          </p>

          <div className="space-y-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 text-sm">
               <div className="font-semibold text-primary-600 dark:text-primary-400 mb-4">{status}</div>
               <div className="flex justify-between items-center mb-2">
                 <span className="font-semibold text-slate-500">Total Episodes</span>
                 <span className="font-mono font-bold">{episodes}</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="font-semibold text-slate-500">Exploration Rate (ε)</span>
                 <span className="font-mono font-bold text-amber-500">{epsilonRef.current.toFixed(2)}</span>
               </div>
            </div>

            <div className="text-xs text-slate-500 italic pb-2">
              Tip: Click on grid cells to manually place/remove Walls and Traps!
            </div>

            <div className="flex flex-col gap-3 pt-2">
               <button
                 onClick={trainFast}
                 disabled={isTraining}
                 className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-all transform hover:scale-105 disabled:opacity-50"
               >
                 {isTraining ? 'Training...' : 'Fast Train (500 Eps)'}
               </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex-[2] py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                >
                  {isPlaying ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>}
                  {isPlaying ? 'Pause Live' : 'Watch Live'}
                </button>
                <button
                  onClick={stepAgent}
                  disabled={isPlaying}
                  className="flex-1 p-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-300 disabled:opacity-50 transition-colors"
                  title="Step Episode"
                >
                  <Activity className="w-5 h-5" /> Step
                </button>
              </div>

              <button
                onClick={resetAll}
                className="w-full p-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-xl text-slate-700 dark:text-slate-300 transition-colors mt-2"
              >
                 Reset Q-Table & Brain
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Left Column - Grid Canvas */}
      <div className="flex-[2] h-full glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col items-center justify-center p-4">
        
        {/* Grid Map */}
        <div 
          className="grid gap-1 sm:gap-2 w-full max-w-lg aspect-square"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
        >
          {grid.map((row, r) => (
            row.map((cellType, c) => {
              const isAgentHere = agentPos.r === r && agentPos.c === c;
              
              let bgClass = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700";
              let content = null;

              if (cellType === CellType.OBSTACLE) {
                bgClass = "bg-slate-800 dark:bg-slate-300 border-slate-900 dark:border-slate-100";
              } else if (cellType === CellType.GOAL) {
                bgClass = "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700";
                content = <span className="text-2xl">🏆</span>;
              } else if (cellType === CellType.TRAP) {
                bgClass = "bg-rose-100 dark:bg-rose-900/30 border-rose-300 dark:border-rose-700";
                content = <span className="text-2xl">🔥</span>;
              }

              return (
                <div 
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className={`border-2 rounded-xl flex flex-col items-center justify-center relative transition-colors duration-300 cursor-pointer ${bgClass}`}
                >
                  {content}
                  
                  {/* Subtle Q-Value Heatmap underlay could go here */}
                  
                  {/* Best Learned Action Indicator */}
                  {!isAgentHere && getMaxActionIndicator(r, c)}

                  {/* Agent */}
                  {isAgentHere && (
                    <motion.div 
                      layoutId="agent"
                      className="absolute inset-2 bg-primary-500 rounded-lg shadow-lg flex items-center justify-center z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <span className="text-white font-bold text-xs sm:text-base">🤖</span>
                    </motion.div>
                  )}
                </div>
              );
            })
          ))}
        </div>

      </div>
    </div>
  );
}
