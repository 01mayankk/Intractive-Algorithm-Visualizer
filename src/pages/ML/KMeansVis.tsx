import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Activity } from 'lucide-react';

interface Point {
  x: number;
  y: number;
  cluster: number | null;
}

interface Centroid {
  x: number;
  y: number;
}

const COLORS = [
  'fill-blue-500', 
  'fill-red-500', 
  'fill-emerald-500', 
  'fill-amber-500', 
  'fill-purple-500'
];

const STROKES = [
  'stroke-blue-500', 
  'stroke-red-500', 
  'stroke-emerald-500', 
  'stroke-amber-500', 
  'stroke-purple-500'
];

export default function KMeansVis() {
  const [points, setPoints] = useState<Point[]>([]);
  const [centroids, setCentroids] = useState<Centroid[]>([]);
  const [numClusters, setNumClusters] = useState(3);
  const [epochs, setEpochs] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState("Click 'Initialize Centroids' to start.");
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize random blobs of data
  useEffect(() => {
    resetData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetData = () => {
    const newPoints: Point[] = [];
    // Generate 3 random clusters of points
    for (let c = 0; c < 3; c++) {
      const cx = Math.random() * 60 + 20;
      const cy = Math.random() * 60 + 20;
      for (let i = 0; i < 40; i++) {
        // Box-Muller transform for normal distribution
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
        
        const x = Math.max(5, Math.min(95, cx + z0 * 5));
        const y = Math.max(5, Math.min(95, cy + z1 * 5));
        
        newPoints.push({ x, y, cluster: null });
      }
    }
    setPoints(newPoints);
    setCentroids([]);
    setEpochs(0);
    setIsPlaying(false);
    setStatus("Click 'Initialize Centroids' to place random K centroids.");
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const initializeCentroids = () => {
    if (points.length === 0) return;
    const newCentroids: Centroid[] = [];
    const usedIndices = new Set<number>();
    
    // Pick K random distinct points as initial centroids (Forgy method)
    while (newCentroids.length < numClusters) {
      const pIdx = Math.floor(Math.random() * points.length);
      if (!usedIndices.has(pIdx)) {
        usedIndices.add(pIdx);
        newCentroids.push({ x: points[pIdx].x, y: points[pIdx].y });
      }
    }
    
    setCentroids(newCentroids);
    setEpochs(0);
    
    // Reset points
    setPoints(pts => pts.map(p => ({ ...p, cluster: null })));
    setStatus("Centroids placed. Next step: Assign points to nearest centroid.");
  };

  const getDistanceSq = (p1: Point | Centroid, p2: Point | Centroid) => {
    return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
  };

  const stepKMeans = () => {
    if (centroids.length === 0) return;

    if (epochs % 2 === 0) {
      // Step 1: Assign points
      let changed = false;
      const newPoints = points.map(p => {
        let minDist = Infinity;
        let cIdx = -1;
        for (let i = 0; i < centroids.length; i++) {
          const d = getDistanceSq(p, centroids[i]);
          if (d < minDist) {
            minDist = d;
            cIdx = i;
          }
        }
        if (p.cluster !== cIdx) changed = true;
        return { ...p, cluster: cIdx };
      });
      
      setPoints(newPoints);
      setStatus("Step 1/2: Assigned points to their nearest centroid.");
      if (!changed && epochs > 0) {
        setStatus("Algorithm Converged! Points no longer change clusters.");
        setIsPlaying(false);
      }
    } else {
      // Step 2: Update centroids
      const sums = Array(numClusters).fill(0).map(() => ({ x: 0, y: 0, count: 0 }));
      points.forEach(p => {
        if (p.cluster !== null) {
          sums[p.cluster].x += p.x;
          sums[p.cluster].y += p.y;
          sums[p.cluster].count += 1;
        }
      });
      
      const newCentroids = sums.map((s, i) => {
        if (s.count === 0) return centroids[i]; // If empty cluster, keep it there
        return { x: s.x / s.count, y: s.y / s.count };
      });
      
      setCentroids(newCentroids);
      setStatus("Step 2/2: Centroids moved to the mean of their clusters.");
    }
    
    setEpochs(e => e + 1);
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        stepKMeans();
      }, 800);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, points, centroids, epochs, numClusters]);

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (centroids.length > 0) return; // Don't allow manual point addition after starting
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100; // SVG coordinates top=0
    setPoints([...points, { x, y, cluster: null }]);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full h-[calc(100vh-8rem)] p-4 md:p-8">
      
      {/* Right Column - Controls */}
      <div className="flex-1 min-w-[300px] flex flex-col gap-4">
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">K-Means Clustering</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
            An Unsupervised algorithm that partitions unlabeled data into K distinct clusters.
          </p>

          <div className="space-y-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
               <div className="font-semibold text-primary-600 dark:text-primary-400 mb-2">{status}</div>
               <div className="flex justify-between items-center text-sm">
                 <span className="font-semibold text-slate-500">Iterations (Steps)</span>
                 <span className="font-mono font-bold">{Math.floor(epochs / 2)}</span>
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                Number of Clusters (K): <span>{numClusters}</span>
              </label>
              <input 
                type="range" 
                min="2" 
                max="5" 
                step="1"
                value={numClusters}
                disabled={centroids.length > 0}
                onChange={e => setNumClusters(parseInt(e.target.value))}
                className="w-full accent-primary-600 disabled:opacity-50"
              />
            </div>

            <div className="flex flex-col gap-3 pt-4">
              {centroids.length === 0 ? (
                <button
                  onClick={initializeCentroids}
                  className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-all transform hover:scale-105"
                >
                  Initialize Centroids
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex-[2] py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    {isPlaying ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>}
                    {isPlaying ? 'Pause' : 'Auto Play'}
                  </button>
                  <button
                    onClick={stepKMeans}
                    disabled={isPlaying}
                    className="flex-1 p-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-300 disabled:opacity-50 transition-colors"
                    title="Step"
                  >
                    <Activity className="w-5 h-5" /> Step
                  </button>
                </div>
              )}

              <button
                onClick={resetData}
                className="w-full p-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-xl text-slate-700 dark:text-slate-300 transition-colors mt-2"
                title="Reset Data"
              >
                 Reset Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Left Column - SVG Canvas */}
      <div className="flex-[2] h-full glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative group">
        <svg 
          className="w-full h-full bg-slate-50/50 dark:bg-slate-900/50"
          onClick={handleCanvasClick}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Voronoi / Centroid lines (connecting points to their centroids) */}
          {points.map((p, i) => {
            if (p.cluster !== null && centroids[p.cluster]) {
              const c = centroids[p.cluster];
              return (
                <line 
                  key={`l-${i}`}
                  x1={p.x} y1={p.y} x2={c.x} y2={c.y}
                  className={`${STROKES[p.cluster % STROKES.length]} opacity-20`}
                  strokeWidth="0.2"
                />
              )
            }
            return null;
          })}

          {/* Data Points */}
          {points.map((p, i) => (
            <circle 
              key={`p-${i}`} 
              cx={p.x} cy={p.y} r="1.5"
              className={`${p.cluster !== null ? COLORS[p.cluster % COLORS.length] : 'fill-slate-400'} transition-colors duration-500`}
            />
          ))}

          {/* Centroids */}
          {centroids.map((c, i) => (
            <g key={`c-${i}`} className="transition-all duration-1000 ease-in-out" style={{ transform: `translate(${c.x}px, ${c.y}px)` }}>
              {/* Outer Glow */}
              <circle cx="0" cy="0" r="4" className={`${COLORS[i % COLORS.length]} opacity-30 animate-pulse`} />
              {/* Cross shape for Centroid */}
              <path d="M-2,0 L2,0 M0,-2 L0,2" className={`${STROKES[i % STROKES.length]} drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]`} strokeWidth="0.8" />
              {/* Center Dot */}
              <circle cx="0" cy="0" r="1.2" fill="#fff" />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
