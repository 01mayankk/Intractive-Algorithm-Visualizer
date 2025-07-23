import React, { useState } from 'react';
import { heapSort } from '../algorithms/sorting/heapSort';

const HeapSortVisualizer = ({ array }) => {
  const [currentArray, setCurrentArray] = useState([...array]);
  const [generator, setGenerator] = useState(null);
  const [step, setStep] = useState(0);

  const start = () => {
    const gen = heapSort([...array]);
    setGenerator(gen);
    setStep(0);
    setCurrentArray([...array]);
  };

  const nextStep = () => {
    if (!generator) return;
    const { value, done } = generator.next();
    if (!done && value) {
      setCurrentArray(value);
      setStep((s) => s + 1);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Heap Sort Visualizer</h2>
      <button className="btn btn-primary mr-2" onClick={start}>Start</button>
      <button className="btn btn-secondary" onClick={nextStep}>Next Step</button>
      <div className="flex space-x-1 mt-4">
        {currentArray.map((val, idx) => (
          <div key={idx} className="bg-blue-400 w-6 h-16 flex items-end justify-center text-white" style={{height: `${val * 2 + 10}px`}}>{val}</div>
        ))}
      </div>
      <div className="mt-2 text-sm">Step: {step}</div>
    </div>
  );
};

export default HeapSortVisualizer; 