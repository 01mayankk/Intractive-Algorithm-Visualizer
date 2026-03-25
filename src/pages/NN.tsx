import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Plus, Minus, Settings2, Network } from 'lucide-react';

export default function NeuralNetworkVis() {
  const [layers, setLayers] = useState<number[]>([2, 4, 3, 1]); // input, hidden1, hidden2, output
  const [isPropagating, setIsPropagating] = useState(false);
  const [activeLayer, setActiveLayer] = useState(-1);
  const [nodeValues, setNodeValues] = useState<number[][]>([]);
  const [epoch, setEpoch] = useState(0);

  // Initialize node values to zero
  useEffect(() => {
    resetNetwork();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layers]);

  const resetNetwork = () => {
    setNodeValues(layers.map(layerSize => Array(layerSize).fill(0)));
    setActiveLayer(-1);
    setIsPropagating(false);
    setEpoch(0);
  };

  const forwardPropagate = () => {
    if (isPropagating) return;
    setIsPropagating(true);
    setActiveLayer(0);

    // Set input values to random
    const newValues = layers.map(layerSize => Array(layerSize).fill(0));
    newValues[0] = Array(layers[0]).fill(0).map(() => Math.random());
    setNodeValues(newValues);

    let currentLayer = 0;
    
    // Animate through layers
    const interval = setInterval(() => {
      currentLayer++;
      
      if (currentLayer >= layers.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsPropagating(false);
          setActiveLayer(-1);
          setEpoch(e => e + 1);
        }, 1000);
        return;
      }

      setActiveLayer(currentLayer);
      
      setNodeValues(prev => {
        const next = [...prev];
        // Simulate activation function (sigmoid-like randomness)
        next[currentLayer] = next[currentLayer].map(() => Math.random() * 0.8 + 0.2);
        return next;
      });

    }, 800);
  };

  const updateLayer = (layerIndex: number, delta: number) => {
    setLayers(prev => {
      const newLayers = [...prev];
      const newSize = prev[layerIndex] + delta;
      if (newSize > 0 && newSize <= 8) {
        newLayers[layerIndex] = newSize;
      }
      return newLayers;
    });
  };

  const addHiddenLayer = () => {
    if (layers.length >= 6) return;
    setLayers(prev => {
      const newLayers = [...prev];
      newLayers.splice(prev.length - 1, 0, 4); // Insert before output
      return newLayers;
    });
  };

  const removeHiddenLayer = () => {
    if (layers.length <= 2) return;
    setLayers(prev => {
      const newLayers = [...prev];
      newLayers.splice(prev.length - 2, 1);
      return newLayers;
    });
  };

  // Helper to generate coordinates for SVG drawing
  const getCoordinates = (layerIdx: number, nodeIdx: number, layerSize: number) => {
    const x = (layerIdx / (layers.length - 1)) * 80 + 10;
    // Center the nodes vertically
    const ySpacing = 80 / Math.max(...layers);
    const yStart = 50 - ((layerSize - 1) * ySpacing) / 2;
    const y = yStart + nodeIdx * ySpacing;
    return { x, y };
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full min-h-[calc(100vh-8rem)] p-4 md:p-8">
      
      {/* Left Column - Network Configuration */}
      <div className="flex-1 min-w-[300px] flex flex-col gap-4">
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Network className="w-6 h-6 text-primary-500" /> Neural Network
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
              Build your architecture and watch forward propagation light up the nodes layer by layer.
            </p>
          </div>

          <div className="space-y-6 flex-grow">
            
            {/* Layer Controls */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <Settings2 className="w-4 h-4" /> Architecture
                </span>
                <div className="flex gap-2">
                  <button onClick={removeHiddenLayer} disabled={layers.length <= 2} className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 text-xs font-semibold uppercase tracking-wider">
                    - Layer
                  </button>
                  <button onClick={addHiddenLayer} disabled={layers.length >= 6} className="px-2 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-400 rounded hover:bg-primary-200 dark:hover:bg-primary-900 disabled:opacity-50 text-xs font-semibold uppercase tracking-wider">
                    + Layer
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {layers.map((size, idx) => {
                  let label = `Hidden Layer ${idx}`;
                  if (idx === 0) label = "Input Layer";
                  if (idx === layers.length - 1) label = "Output Layer";
                  
                  return (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-sm text-slate-500 font-medium">{label}</span>
                      <div className="flex items-center gap-3">
                        <button onClick={() => updateLayer(idx, -1)} disabled={size <= 1} className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-600 dark:text-slate-300 disabled:opacity-50">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-4 text-center font-bold text-slate-900 dark:text-white">{size}</span>
                        <button onClick={() => updateLayer(idx, 1)} disabled={size >= 8} className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-600 dark:text-slate-300 disabled:opacity-50">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-900/20 rounded-2xl border border-primary-100 dark:border-primary-800/50">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Total Epochs</span>
              <span className="font-mono text-2xl font-black text-primary-600 flex items-center">
                {epoch}
              </span>
            </div>

          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={forwardPropagate}
              disabled={isPropagating}
              className="flex-1 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-105 disabled:transform-none disabled:opacity-70 disabled:cursor-wait shadow-md"
            >
              <Play className="w-5 h-5"/>
              Forward Propagate
            </button>
            <button
              onClick={resetNetwork}
              disabled={isPropagating}
              className="px-6 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-xl text-slate-700 dark:text-slate-300 transition-colors disabled:opacity-50"
              title="Reset Weights"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Column - Neural Network Canvas */}
      <div className="flex-[2] glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative bg-white/40 dark:bg-slate-900/40 p-6 flex flex-col justify-center min-h-[500px]">
        
        {/* Layer Labels */}
        <div className="flex justify-between w-full absolute top-6 px-[10%] left-0 z-10">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Input</span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hidden</span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Output</span>
        </div>

        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Edges */}
          {layers.map((layerSize, layerIdx) => {
            if (layerIdx === layers.length - 1) return null;
            
            const nextLayerSize = layers[layerIdx + 1];
            const edges = [];
            
            for (let i = 0; i < layerSize; i++) {
              for (let j = 0; j < nextLayerSize; j++) {
                const start = getCoordinates(layerIdx, i, layerSize);
                const end = getCoordinates(layerIdx + 1, j, nextLayerSize);
                
                // If it's the active layer, color the edges leading out of it
                const isActiveEdge = activeLayer === layerIdx;
                const strokeClass = isActiveEdge 
                  ? "stroke-primary-500 drop-shadow-[0_0_5px_rgba(99,102,241,0.8)]" 
                  : "stroke-slate-200 dark:stroke-slate-700";
                
                edges.push(
                  <line 
                    key={`e-${layerIdx}-${i}-${j}`}
                    x1={start.x} 
                    y1={start.y} 
                    x2={end.x} 
                    y2={end.y} 
                    className={`${strokeClass} transition-all duration-500`}
                    strokeWidth={isActiveEdge ? "0.6" : "0.2"} 
                  />
                );
              }
            }
            return <g key={`edges-${layerIdx}`}>{edges}</g>;
          })}

          {/* Nodes */}
          {layers.map((layerSize, layerIdx) => {
            const nodes = [];
            for (let i = 0; i < layerSize; i++) {
              const { x, y } = getCoordinates(layerIdx, i, layerSize);
              
              const val = nodeValues[layerIdx]?.[i] || 0;
              const isActiveNode = activeLayer >= layerIdx;
              const isCurrentlyProcessing = activeLayer === layerIdx;
              
              const baseFill = "fill-white dark:fill-slate-800 text-white";
              const strokeColor = isActiveNode ? "stroke-primary-500" : "stroke-slate-300 dark:stroke-slate-600";
              const fillOpacity = val > 0 ? val : 0;

              nodes.push(
                <g key={`n-${layerIdx}-${i}`}>
                  {/* Glowing halo if processing */}
                  {isCurrentlyProcessing && (
                    <circle cx={x} cy={y} r="6" className="fill-primary-500/20 animate-ping" />
                  )}
                  {/* Active fill */}
                  {isActiveNode && (
                    <circle cx={x} cy={y} r="2.5" className="fill-primary-500 transition-opacity duration-300" style={{opacity: fillOpacity}} />
                  )}
                  {/* Outer stroke */}
                  <circle cx={x} cy={y} r="2.5" className={`${baseFill} ${strokeColor} transition-colors duration-500`} strokeWidth="0.5" fillOpacity={isActiveNode ? 0 : 1} />
                </g>
              );
            }
            return <g key={`nodes-${layerIdx}`}>{nodes}</g>;
          })}
        </svg>

      </div>
    </div>
  );
}
