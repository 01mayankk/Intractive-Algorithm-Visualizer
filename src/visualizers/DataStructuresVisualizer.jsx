import React, { useState } from 'react';
import BinaryTreeVisualizer from './BinaryTreeVisualizer';
import HashTableVisualizer from './HashTableVisualizer';
import HeapDSVisualizer from './HeapDSVisualizer';
import LinkedListVisualizer from './LinkedListVisualizer';
import QueueVisualizer from './QueueVisualizer';
import StackVisualizer from './StackVisualizer';
import TrieVisualizer from './TrieVisualizer';

const DataStructuresVisualizer = () => {
  const [selectedDS, setSelectedDS] = useState('binary-tree');

  const dataStructures = [
    { id: 'binary-tree', name: 'Binary Tree', component: BinaryTreeVisualizer },
    { id: 'hash-table', name: 'Hash Table', component: HashTableVisualizer },
    { id: 'heap', name: 'Heap', component: HeapDSVisualizer },
    { id: 'linked-list', name: 'Linked List', component: LinkedListVisualizer },
    { id: 'queue', name: 'Queue', component: QueueVisualizer },
    { id: 'stack', name: 'Stack', component: StackVisualizer },
    { id: 'trie', name: 'Trie', component: TrieVisualizer },
  ];

  const SelectedComponent = dataStructures.find(ds => ds.id === selectedDS)?.component;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Data Structures Visualizer</h2>
      
      {/* Data Structure Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Data Structure:
        </label>
        <select
          value={selectedDS}
          onChange={(e) => setSelectedDS(e.target.value)}
          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {dataStructures.map((ds) => (
            <option key={ds.id} value={ds.id}>
              {ds.name}
            </option>
          ))}
        </select>
      </div>

      {/* Selected Data Structure Visualizer */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {SelectedComponent && <SelectedComponent />}
      </div>
    </div>
  );
};

export default DataStructuresVisualizer; 