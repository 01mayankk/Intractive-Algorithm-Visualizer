import React, { useState } from 'react';
import Controls from './Controls';
import StepExplanation from './StepExplanation';

interface AlgorithmVisualizerProps {
  title: string;
  description: string;
  codeSnippet: string;
  explanationText: string;
  activeLine: number;
  
  // Animation state
  isPlaying: boolean;
  canStep: boolean;
  speed: number;
  
  // Callbacks
  onPlayPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  
  // Render function for the actual D3/Canvas visual
  children: React.ReactNode;
}

export default function AlgorithmVisualizer({
  title,
  description,
  codeSnippet,
  explanationText,
  activeLine,
  isPlaying,
  canStep,
  speed,
  onPlayPause,
  onStep,
  onReset,
  onSpeedChange,
  children
}: AlgorithmVisualizerProps) {
  
  const [activeTab, setActiveTab] = useState<'visual' | 'theory' | 'interview'>('visual');

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full h-[calc(100vh-8rem)]">
      
      {/* Left Column - Visualization Stage */}
      <div className="flex flex-col gap-4 flex-[2] h-full w-full">
        {/* Header */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary-500 animate-pulse"></span>
              {title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{description}</p>
          </div>
          
          {/* Mode Toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {['visual', 'theory', 'interview'].map(mode => (
              <button
                key={mode}
                onClick={() => setActiveTab(mode as any)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${activeTab === mode ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Animation Stage */}
        <div className="glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex-grow relative overflow-hidden flex items-center justify-center p-8 bg-white/40 dark:bg-slate-900/40">
           {children}
        </div>

        {/* Controls */}
        <Controls 
          isPlaying={isPlaying}
          onPlayPause={onPlayPause}
          onStep={onStep}
          onReset={onReset}
          speed={speed}
          onSpeedChange={onSpeedChange}
          canStep={canStep}
        />
      </div>

      {/* Right Column - Step Explanation & Code */}
      <div className="flex-1 h-full min-w-[300px]">
        <StepExplanation 
          explanationText={explanationText}
          codeSnippet={codeSnippet}
          activeLine={activeLine}
        />
      </div>

    </div>
  );
}
