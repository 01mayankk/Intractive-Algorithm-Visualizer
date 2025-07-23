import React, { useState } from 'react';
import { HashTable } from '../dataStructures/HashTable';

const HashTableVisualizer = ({ pairs }) => {
  const [table] = useState(() => {
    const ht = new HashTable();
    pairs.forEach(([k, v]) => ht.set(k, v));
    return ht;
  });
  const [current, setCurrent] = useState(null);
  const [generator, setGenerator] = useState(null);
  const [step, setStep] = useState(0);

  const start = () => {
    const gen = table.traverse();
    setGenerator(gen);
    setStep(0);
    setCurrent(null);
  };

  const nextStep = () => {
    if (!generator) return;
    const { value, done } = generator.next();
    if (!done && value) {
      setCurrent(value);
      setStep(s => s + 1);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Hash Table Visualizer</h2>
      <button className="btn btn-primary mr-2" onClick={start}>Start</button>
      <button className="btn btn-secondary" onClick={nextStep}>Next Step</button>
      <div className="flex flex-col mt-4">
        {table.table.map((bucket, idx) => (
          <div key={idx} className="flex items-center mb-1">
            <span className="w-8 text-xs text-gray-500">{idx}</span>
            <div className="flex">
              {bucket.map((pair, j) => (
                <div key={j} className={`mx-1 px-2 py-1 rounded ${current === pair ? 'bg-yellow-300' : 'bg-gray-200'}`}>{pair[0]}: {pair[1]}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 text-sm">Step: {step}</div>
    </div>
  );
};

export default HashTableVisualizer; 