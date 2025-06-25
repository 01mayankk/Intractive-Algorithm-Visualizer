import React from 'react';
import SortingVisualizer from './visualizers/SortingVisualizer';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold my-6 text-indigo-700">
        Interactive Algorithm Visualizer
      </h1>
      <SortingVisualizer />
    </div>
  );
}

export default App;
