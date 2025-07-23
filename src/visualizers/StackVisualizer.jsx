import React, { useState } from 'react';
import { Stack } from '../dataStructures/Stack';

const StackVisualizer = ({ values }) => {
  const [stack] = useState(() => {
    const s = new Stack();
    values.forEach(v => s.push(v));
    return s;
  });
  const [current, setCurrent] = useState(null);
  const [generator, setGenerator] = useState(null);
  const [step, setStep] = useState(0);

  const start = () => {
    const gen = stack.traverse();
    setGenerator(gen);
    setStep(0);
    setCurrent(null);
  };

  const nextStep = () => {
    if (!generator) return;
    const { value, done } = generator.next();
    if (!done && value !== undefined) {
      setCurrent(value);
      setStep(s => s + 1);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Stack Visualizer</h2>
      <button className="btn btn-primary mr-2" onClick={start}>Start</button>
      <button className="btn btn-secondary" onClick={nextStep}>Next Step</button>
      <div className="flex flex-col-reverse items-center mt-4">
        {stack.items.map((v, idx) => (
          <div key={idx} className={`w-16 h-8 flex items-center justify-center border mb-1 ${current === v ? 'bg-yellow-300' : 'bg-green-300'}`}>{v}</div>
        ))}
      </div>
      <div className="mt-2 text-sm">Step: {step}</div>
    </div>
  );
};

export default StackVisualizer; 