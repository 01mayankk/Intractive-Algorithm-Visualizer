import React, { useState } from 'react';
import { BinaryTree } from '../dataStructures/BinaryTree';

const BinaryTreeVisualizer = ({ values }) => {
  const [tree] = useState(() => {
    const t = new BinaryTree();
    values.forEach(v => t.insert(v));
    return t;
  });
  const [current, setCurrent] = useState(null);
  const [generator, setGenerator] = useState(null);
  const [step, setStep] = useState(0);

  const start = () => {
    const gen = tree.inOrder();
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

  // For simplicity, show as a flat list (tree visualization can be improved with D3.js)
  let nodes = [];
  function inOrder(node) {
    if (!node) return;
    inOrder(node.left);
    nodes.push(node);
    inOrder(node.right);
  }
  inOrder(tree.root);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Binary Tree Visualizer (In-Order)</h2>
      <button className="btn btn-primary mr-2" onClick={start}>Start</button>
      <button className="btn btn-secondary" onClick={nextStep}>Next Step</button>
      <div className="flex items-center mt-4">
        {nodes.map((n, idx) => (
          <div key={idx} className={`flex items-center ${current === n ? 'bg-yellow-300' : 'bg-indigo-300'} px-4 py-2 rounded mx-1`}>
            {n.value}
          </div>
        ))}
      </div>
      <div className="mt-2 text-sm">Step: {step}</div>
    </div>
  );
};

export default BinaryTreeVisualizer; 