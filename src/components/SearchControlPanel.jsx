import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSearchAlgorithm,
  setSearchTarget,
} from '../redux/algoSlice';

const SearchControlPanel = ({ onReset, onVisualize }) => {
  const dispatch = useDispatch();
  const { searchAlgorithm, searchTarget } = useSelector((state) => state.algo);

  const handleAlgorithmChange = (e) => {
    dispatch(setSearchAlgorithm(e.target.value));
  };

  const handleTargetChange = (e) => {
    dispatch(setSearchTarget(e.target.value));
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 my-4">
      <div className="flex flex-col gap-2 items-start">
        <label className="text-sm font-semibold">Search Algorithm</label>
        <select
          value={searchAlgorithm}
          onChange={handleAlgorithmChange}
          className="px-3 py-2 border rounded"
        >
          <option value="linearSearch">Linear Search</option>
          {/* Add more algorithms here like Binary Search */}
        </select>
      </div>

      <div className="flex flex-col gap-2 items-start">
        <label className="text-sm font-semibold">Target Value</label>
        <input
          type="number"
          value={searchTarget ?? ''}
          onChange={handleTargetChange}
          placeholder="Enter target"
          className="px-3 py-2 border rounded w-36"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-700 text-white rounded"
        >
          Reset Array
        </button>
        <button
          onClick={onVisualize}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Start Search
        </button>
      </div>
    </div>
  );
};

export default SearchControlPanel;
