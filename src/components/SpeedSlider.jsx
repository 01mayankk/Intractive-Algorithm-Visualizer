import React from 'react';

const SpeedSlider = ({ speed, setSpeed, min = 100, max = 2000, step = 100 }) => {
  return (
    <div className="flex items-center space-x-2">
      <label className="font-medium">Speed:</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={speed}
        onChange={e => setSpeed(Number(e.target.value))}
        className="w-40 accent-blue-500"
      />
      <span className="text-sm">{speed} ms</span>
    </div>
  );
};

export default SpeedSlider;
