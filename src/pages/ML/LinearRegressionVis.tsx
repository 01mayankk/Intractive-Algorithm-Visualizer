import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Activity } from 'lucide-react';

export default function LinearRegressionVis() {
  const [points, setPoints] = useState<{x: number, y: number}[]>([]);
  const [m, setM] = useState(0); // slope
  const [b, setB] = useState(50); // intercept
  const [learningRate, setLearningRate] = useState(0.0001);
  const [epochs, setEpochs] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize with some random points around a line
  useEffect(() => {
    resetModel();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetModel = () => {
    const freshPoints = [];
    const trueM = 1.5;
    const trueB = 20;
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 80 + 10;
      const noise = (Math.random() - 0.5) * 30;
      freshPoints.push({ x, y: trueM * x + trueB + noise });
    }
    setPoints(freshPoints);
    setM(0);
    setB(50);
    setEpochs(0);
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = 100 - ((e.clientY - rect.top) / rect.height) * 100;
    setPoints([...points, { x, y }]);
  };

  const gradientDescentStep = () => {
    if (points.length === 0) return;
    
    let mGradient = 0;
    let bGradient = 0;
    const n = points.length;

    for (let i = 0; i < n; i++) {
      const x = points[i].x;
      const y = points[i].y;
      const guess = m * x + b;
      const error = y - guess;
      
      mGradient += -(2 / n) * x * error;
      bGradient += -(2 / n) * error;
    }

    setM(prevM => prevM - mGradient * learningRate);
    setB(prevB => prevB - bGradient * (learningRate * 50)); // Scale b learning rate since x is large (0-100)
    setEpochs(prev => prev + 1);
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        gradientDescentStep();
      }, 50);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, m, b, points]);

  // Calculate current MSE
  const mse = points.length > 0 
    ? points.reduce((acc, p) => acc + Math.pow(p.y - (m * p.x + b), 2), 0) / points.length
    : 0;

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full h-[calc(100vh-8rem)] p-4 md:p-8">
      
      {/* Right Column - Controls (Reversed for layout variety) */}
      <div className="flex-1 min-w-[300px] flex flex-col gap-4">
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Linear Regression</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
            Click on the graph to add data points. Watch Gradient Descent fit the line of best fit by minimizing Mean Squared Error (MSE).
          </p>

          <div className="space-y-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-slate-500">Epochs</span>
                <span className="font-mono font-bold text-primary-600">{epochs}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-slate-500">Loss (MSE)</span>
                <span className="font-mono font-bold text-red-500">{mse.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-500">Equation</span>
                <span className="font-mono font-bold text-emerald-500">y = {m.toFixed(2)}x + {b.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                Learning Rate <span>{learningRate.toFixed(4)}</span>
              </label>
              <input 
                type="range" 
                min="0.00001" 
                max="0.001" 
                step="0.00001"
                value={learningRate}
                onChange={e => setLearningRate(parseFloat(e.target.value))}
                className="w-full accent-primary-600"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-105"
              >
                {isPlaying ? <Pause className="w-5 h-5"/> : <Play className="w-5 h-5"/>}
                {isPlaying ? 'Pause' : 'Train'}
              </button>
              <button
                onClick={gradientDescentStep}
                disabled={isPlaying || points.length === 0}
                className="p-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-xl text-slate-700 dark:text-slate-300 disabled:opacity-50 transition-colors"
                title="Step (1 Epoch)"
              >
                <Activity className="w-6 h-6" />
              </button>
              <button
                onClick={resetModel}
                className="p-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-xl text-slate-700 dark:text-slate-300 transition-colors"
                title="Reset Data"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
            </div>
            
            <button
              onClick={() => {setPoints([]); setM(0); setB(50); setEpochs(0);}}
              className="w-full py-2 border border-red-200 dark:border-red-900/50 text-red-500 rounded-xl font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Clear All Points
            </button>
          </div>
        </div>
      </div>

      {/* Left Column - SVG Canvas */}
      <div className="flex-[2] h-full glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative group">
        
        {/* Helper text on empty */}
        {points.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 px-4 py-2 rounded-full font-medium shadow-sm backdrop-blur-sm">
              Click anywhere to add data points
            </span>
          </div>
        )}

        <svg 
          className="w-full h-full cursor-crosshair bg-slate-50/50 dark:bg-slate-900/50"
          onClick={handleCanvasClick}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {[10,20,30,40,50,60,70,80,90].map(line => (
            <g key={line}>
              <line x1={line} y1="0" x2={line} y2="100" stroke="currentColor" className="text-slate-200 dark:text-slate-700/50" strokeWidth="0.2" />
              <line x1="0" y1={line} x2="100" y2={line} stroke="currentColor" className="text-slate-200 dark:text-slate-700/50" strokeWidth="0.2" />
            </g>
          ))}

          {/* Data Points */}
          {points.map((p, i) => (
            <circle 
              key={i} 
              cx={p.x} 
              cy={100 - p.y} 
              r="1.5" 
              className="fill-primary-500 group-hover:fill-primary-400 transition-colors drop-shadow-md" 
            />
          ))}

          {/* Best Fit Line */}
          {points.length > 0 && (
            <line 
              x1="0" 
              y1={100 - b} 
              x2="100" 
              y2={100 - (m * 100 + b)} 
              className="stroke-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
              strokeWidth="0.8" 
            />
          )}
        </svg>
      </div>
    </div>
  );
}
