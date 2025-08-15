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

  // Time complexity information for binary tree operations
  const timeComplexity = {
    insert: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)', space: 'O(1)' },
    search: { best: 'O(1)', average: 'O(log n)', worst: 'O(n)', space: 'O(1)' },
    delete: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)', space: 'O(1)' },
    traversal: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(h)' }
  };

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
      
      {/* Time Complexity Information */}
      <div className="mb-4 bg-white rounded-lg p-3 shadow-md border border-gray-200">
        <h3 className="text-md font-semibold text-gray-800 mb-2">⏱️ Time Complexity Analysis</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded p-2 border border-green-200">
            <h4 className="font-semibold text-green-800 mb-1">Insert</h4>
            <p className="font-bold text-green-600">{timeComplexity.insert.average}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded p-2 border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-1">Search</h4>
            <p className="font-bold text-blue-600">{timeComplexity.search.average}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded p-2 border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-1">Delete</h4>
            <p className="font-bold text-purple-600">{timeComplexity.delete.average}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded p-2 border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-1">Traversal</h4>
            <p className="font-bold text-yellow-600">{timeComplexity.traversal.average}</p>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          n = nodes, h = height
        </div>
      </div>
      
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