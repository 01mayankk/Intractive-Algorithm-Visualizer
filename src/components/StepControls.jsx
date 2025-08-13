import React from 'react';

const StepControls = ({ onPlay, onPause, onStep, onReset, isPlaying, canStep }) => {
  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={isPlaying ? onPause : onPlay}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        {isPlaying ? '⏸️ Pause' : '▶️ Play'}
      </button>
      <button
        onClick={onStep}
        disabled={!canStep}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ⏭️ Step
      </button>
      <button
        onClick={onReset}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        🔄 Reset
      </button>
    </div>
  );
};

export default StepControls; 