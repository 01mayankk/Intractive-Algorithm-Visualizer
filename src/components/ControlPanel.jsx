import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAlgorithm, setArraySize, setSpeed } from '../redux/algoSlice';

const ControlPanel = ({ onReset, onVisualize }) => {
  const dispatch = useDispatch();
  const { algorithm, arraySize, speed, isSorting } = useSelector((state) => state.algo);

  const handleAlgoChange = (e) => dispatch(setAlgorithm(e.target.value));
  const handleSizeChange = (e) => dispatch(setArraySize(Number(e.target.value)));
  const handleSpeedChange = (e) => dispatch(setSpeed(Number(e.target.value)));

  return (
    <div className="w-full flex flex-col items-center gap-4 py-4">
      <div className="flex gap-4 flex-wrap justify-center">
        <select
          value={algorithm}
          onChange={handleAlgoChange}
          disabled={isSorting}
          className={`px-3 py-2 border rounded ${
            isSorting ? 'bg-gray-300 cursor-not-allowed' : ''
          }`}
        >
          <option value="bubbleSort">Bubble Sort</option>
          <option value="insertionSort">Insertion Sort</option>
          <option value="selectionSort">Selection Sort</option>
          <option value="mergeSort">Merge Sort</option>
          <option value="quickSort">Quick Sort</option>
        </select>

        <button
          onClick={onReset}
          disabled={isSorting}
          className={`px-4 py-2 text-white rounded ${
            isSorting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-700'
          }`}
        >
          Reset Array
        </button>

        <button
          onClick={onVisualize}
          disabled={isSorting}
          className={`px-4 py-2 text-white rounded ${
            isSorting ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600'
          }`}
        >
          Visualize
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <label className="flex flex-col items-center">
          Array Size
          <input
            type="range"
            min="10"
            max="100"
            value={arraySize}
            onChange={handleSizeChange}
            disabled={isSorting}
            className={`${isSorting ? 'cursor-not-allowed opacity-70' : ''}`}
          />
        </label>

        <label className="flex flex-col items-center">
          Speed
          <input
            type="range"
            min="10"
            max="200"
            value={speed}
            onChange={handleSpeedChange}
            disabled={isSorting}
            className={`${isSorting ? 'cursor-not-allowed opacity-70' : ''}`}
          />
        </label>
      </div>
    </div>
  );
};

export default ControlPanel;
