import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setGraphAlgorithm,
  setGraphSpeed,
  setGraphMode, // future-proofing for tree
} from '../redux/graphSlice'; // You’ll create this slice

const GraphControlPanel = ({
  onAddNode,
  onAddEdge,
  onReset,
  onVisualize,
}) => {
  const dispatch = useDispatch();
  const { graphAlgorithm, graphSpeed } = useSelector((state) => state.graph);

  const handleAlgorithmChange = (e) => {
    dispatch(setGraphAlgorithm(e.target.value));
  };

  const handleSpeedChange = (e) => {
    dispatch(setGraphSpeed(Number(e.target.value)));
  };

  return (
    <div className="flex flex-col items-center gap-4 mb-6">
      <div className="flex flex-wrap justify-center gap-4">
        <select
          value={graphAlgorithm}
          onChange={handleAlgorithmChange}
          className="px-4 py-2 border rounded"
        >
          <option value="bfs">Breadth First Search (BFS)</option>
          <option value="dfs">Depth First Search (DFS)</option>
          {/* Tree options will go here later */}
        </select>

        <button
          onClick={onAddNode}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Add Node
        </button>

        <button
          onClick={onAddEdge}
          className="px-4 py-2 bg-yellow-600 text-white rounded"
        >
          Add Edge
        </button>

        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-700 text-white rounded"
        >
          Reset Graph
        </button>

        <button
          onClick={onVisualize}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Visualize
        </button>
      </div>

      <div className="w-full max-w-md">
        <label className="block text-center text-gray-700 font-medium mb-2">
          Animation Speed
        </label>
        <input
          type="range"
          min="50"
          max="1000"
          value={graphSpeed}
          onChange={handleSpeedChange}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default GraphControlPanel;
