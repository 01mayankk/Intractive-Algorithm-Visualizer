import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setGraphAlgorithm,
  setGraphSpeed,
} from '../redux/graphSlice';
import { constrainSpeed } from '../utils/delay';

const GraphControlPanel = ({
  onAddNode = () => {},
  onAddEdge = () => {},
  onReset = () => {},
  onVisualize = () => {},
  onToggleDirected = () => {},
  isDirected = true,
  onToggleEdgeEdit = () => {},
  isEdgeEditMode = false,
  onToggleGoalNodeSelect = () => {},
  isGoalNodeSelectMode = false,
}) => {
  const dispatch = useDispatch();
  const { graphAlgorithm, graphSpeed } = useSelector((state) => state.graph);

  const handleAlgorithmChange = (e) => {
    dispatch(setGraphAlgorithm(e.target.value));
  };

  const handleSpeedChange = (e) => {
    dispatch(setGraphSpeed(constrainSpeed(Number(e.target.value))));
  };

  return (
    <div className="flex flex-col items-center gap-6 mb-6">
      {/* === Algorithm & Controls === */}
      <div className="flex flex-wrap justify-center gap-4">
        <select
          value={graphAlgorithm}
          onChange={handleAlgorithmChange}
          className="px-4 py-2 border rounded shadow"
        >
          <option value="bfs">Breadth First Search (BFS)</option>
          <option value="dfs">Depth First Search (DFS)</option>
          <option value="dijkstra">Dijkstra's Algorithm</option>
          <option value="aStar">A* Search</option>
          {/* Future Tree traversal options can be added here */}
        </select>

        <button
          onClick={onAddNode}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Node
        </button>

        <button
          onClick={onAddEdge}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Add Edge
        </button>

        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
        >
          Reset Graph
        </button>

        <button
          onClick={onVisualize}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Visualize {graphAlgorithm.toUpperCase()}
        </button>
      </div>

      {/* === Speed Slider === */}
      <div className="w-full max-w-md px-4">
        <label className="block text-center text-gray-700 font-medium mb-1">
          Animation Speed: {graphSpeed}ms
        </label>
        <input
          type="range"
          min="100"
          max="1000"
          step="50"
          value={graphSpeed}
          onChange={handleSpeedChange}
          className="w-full"
        />
      </div>

      {/* === Time Complexity Information === */}
      <div className="w-full max-w-2xl px-4">
        <h4 className="text-center text-gray-700 font-medium mb-3">⏱️ Time Complexity Analysis</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-2 border border-green-200">
            <h5 className="font-semibold text-green-800 text-xs mb-1">BFS</h5>
            <p className="text-sm font-bold text-green-600">O(V+E)</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2 border border-blue-200">
            <h5 className="font-semibold text-blue-800 text-xs mb-1">DFS</h5>
            <p className="text-sm font-bold text-blue-600">O(V+E)</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-2 border border-purple-200">
            <h5 className="font-semibold text-purple-800 text-xs mb-1">Dijkstra</h5>
            <p className="text-sm font-bold text-purple-600">O(V²)</p>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-2 border border-pink-200">
            <h5 className="font-semibold text-pink-800 text-xs mb-1">A*</h5>
            <p className="text-sm font-bold text-pink-600">O(V log V)</p>
          </div>
        </div>
        <div className="mt-2 text-center text-xs text-gray-500">
          V = Vertices, E = Edges
        </div>
      </div>

      {/* === Toggles === */}
      <div className="flex flex-wrap justify-center gap-6 mt-4">
        <button
          onClick={onToggleDirected}
          className={`px-4 py-2 rounded ${
            isDirected
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
          }`}
        >
          {isDirected ? 'Directed Graph ON' : 'Directed Graph OFF'}
        </button>

        <button
          onClick={onToggleEdgeEdit}
          className={`px-4 py-2 rounded ${
            isEdgeEditMode
              ? 'bg-pink-600 text-white hover:bg-pink-700'
              : 'bg-pink-100 text-pink-800 hover:bg-pink-200'
          }`}
        >
          {isEdgeEditMode ? 'Edge Edit Mode ON' : 'Edge Edit Mode OFF'}
        </button>

        <button
          onClick={onToggleGoalNodeSelect}
          className={`px-4 py-2 rounded ${
            isGoalNodeSelectMode
              ? 'bg-teal-600 text-white hover:bg-teal-700'
              : 'bg-teal-100 text-teal-800 hover:bg-teal-200'
          }`}
        >
          {isGoalNodeSelectMode ? 'Select Goal Node ON' : 'Select Goal Node OFF'}
        </button>
      </div>
    </div>
  );
};

export default GraphControlPanel;
