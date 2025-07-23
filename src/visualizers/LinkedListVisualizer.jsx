import React, { useState } from 'react';
import { LinkedList } from '../dataStructures/LinkedList';

const LinkedListVisualizer = ({ values }) => {
  const [list] = useState(() => {
    const l = new LinkedList();
    values.forEach(v => l.insert(v));
    return l;
  });
  const [current, setCurrent] = useState(null);
  const [generator, setGenerator] = useState(null);
  const [step, setStep] = useState(0);

  const start = () => {
    const gen = list.traverse();
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

  let nodes = [];
  let node = list.head;
  while (node) {
    nodes.push(node);
    node = node.next;
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Linked List Visualizer</h2>
      <button className="btn btn-primary mr-2" onClick={start}>Start</button>
      <button className="btn btn-secondary" onClick={nextStep}>Next Step</button>
      <div className="flex items-center mt-4">
        {nodes.map((n, idx) => (
          <div key={idx} className={`flex items-center ${current === n ? 'bg-yellow-300' : 'bg-blue-300'} px-4 py-2 rounded mx-1`}>
            {n.value}
            {idx < nodes.length - 1 && <span className="mx-2">→</span>}
          </div>
        ))}
      </div>
      <div className="mt-2 text-sm">Step: {step}</div>
    </div>
  );
};

export default LinkedListVisualizer; 