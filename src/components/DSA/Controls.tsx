import React from 'react';
import { Play, Pause, SkipForward, RotateCcw, FastForward } from 'lucide-react';

interface ControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onStep: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  canStep: boolean;
}

export default function Controls({
  isPlaying,
  onPlayPause,
  onStep,
  onReset,
  speed,
  onSpeedChange,
  canStep
}: ControlsProps) {
  return (
    <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center gap-6 justify-between w-full shadow-lg border border-slate-200 dark:border-slate-800">
      
      {/* Playback Buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={onReset}
          className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300"
          title="Reset"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={onPlayPause}
          className="p-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg transition-all transform hover:scale-105"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </button>

        <button
          onClick={onStep}
          disabled={isPlaying || !canStep}
          className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-700 dark:text-slate-300"
          title="Step Forward"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Speed Slider */}
      <div className="flex items-center gap-4 w-full md:w-auto flex-1 md:max-w-xs">
        <FastForward className="w-5 h-5 text-slate-500 dark:text-slate-400" />
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
          title="Animation Speed"
        />
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 min-w-[3rem]">
          {speed}x
        </span>
      </div>

    </div>
  );
}
