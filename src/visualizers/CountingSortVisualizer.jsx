import React, { useState } from 'react';
import { countingSort } from '../algorithms/sorting/countingSort';

const CountingSortVisualizer = ({ array }) => {
  const [state, setState] = useState({ arr: [...array], count: [], phase: '', index: -1 });
  const [generator, setGenerator] = useState(null);
  const [step, setStep] = useState(0);

  const start = () => {
    const gen = countingSort([...array]);
    setGenerator(gen);
    setStep(0);
    setState({ arr: [...array], count: [], phase: '', index: -1 });
  };

  const nextStep = () => {
    if (!generator) return;
    const { value, done } = generator.next();
    if (!done && value) {
      setState(value);
      setStep((s) => s + 1);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Counting Sort Visualizer</h2>
      <button className="btn btn-primary mr-2" onClick={start}>Start</button>
      <button className="btn btn-secondary" onClick={nextStep}>Next Step</button>
      <div className="flex space-x-1 mt-4">
        {state.arr.map((val, idx) => (
          <div key={idx} className={`bg-green-400 w-6 flex items-end justify-center text-white ${state.index === idx ? 'border-2 border-yellow-400' : ''}`} style={{height: `${val * 2 + 10}px`}}>{val}</div>
        ))}
      </div>
      <div className="flex space-x-1 mt-4">
        {state.count && state.count.map((val, idx) => (
          <div key={idx} className="bg-gray-300 w-6 h-8 flex items-center justify-center text-xs text-black">{val}</div>
        ))}
      </div>
      <div className="mt-2 text-sm">Step: {step} | Phase: {state.phase}</div>
    </div>
  );
};

export default CountingSortVisualizer; 