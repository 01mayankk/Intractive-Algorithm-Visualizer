import React, { useState } from 'react';
import { Trie } from '../dataStructures/Trie';

const TrieVisualizer = ({ words }) => {
  const [trie] = useState(() => {
    const t = new Trie();
    words.forEach(w => t.insert(w));
    return t;
  });
  const [current, setCurrent] = useState(null);
  const [generator, setGenerator] = useState(null);
  const [step, setStep] = useState(0);

  const start = () => {
    const gen = trie.traverse();
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
      <h2 className="text-lg font-bold mb-2">Trie Visualizer</h2>
      <button className="btn btn-primary mr-2" onClick={start}>Start</button>
      <button className="btn btn-secondary" onClick={nextStep}>Next Step</button>
      <div className="flex flex-col mt-4">
        <div>Words in Trie (traversal):</div>
        <div className="flex flex-wrap mt-2">
          {current && <span className="bg-yellow-300 px-2 py-1 rounded mx-1">{current}</span>}
        </div>
      </div>
      <div className="mt-2 text-sm">Step: {step}</div>
    </div>
  );
};

export default TrieVisualizer; 