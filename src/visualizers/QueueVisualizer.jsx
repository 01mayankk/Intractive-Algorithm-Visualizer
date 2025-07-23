import React, { useState } from 'react';
import { Queue } from '../dataStructures/Queue';

const QueueVisualizer = ({ values }) => {
  const [queue] = useState(() => {
    const q = new Queue();
    values.forEach(v => q.enqueue(v));
    return q;
  });
  const [current, setCurrent] = useState(null);
  const [generator, setGenerator] = useState(null);
  const [step, setStep] = useState(0);

  const start = () => {
    const gen = queue.traverse();
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
      <h2 className="text-lg font-bold mb-2">Queue Visualizer</h2>
      <button className="btn btn-primary mr-2" onClick={start}>Start</button>
      <button className="btn btn-secondary" onClick={nextStep}>Next Step</button>
      <div className="flex items-center mt-4">
        {queue.items.map((v, idx) => (
          <div key={idx} className={`w-12 h-8 flex items-center justify-center border mx-1 ${current === v ? 'bg-yellow-300' : 'bg-pink-300'}`}>{v}</div>
        ))}
      </div>
      <div className="mt-2 text-sm">Step: {step}</div>
    </div>
  );
};

export default QueueVisualizer; 