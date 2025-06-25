import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Sorting settings
  algorithm: 'bubbleSort',
  arraySize: 50,
  speed: 50,
  isSorting: false,

  // Searching settings
  searchAlgorithm: 'linearSearch',
  searchTarget: null,
  isSearching: false,
};

const algoSlice = createSlice({
  name: 'algo',
  initialState,
  reducers: {
    // Sorting reducers
    setAlgorithm: (state, action) => {
      state.algorithm = action.payload;
    },
    setArraySize: (state, action) => {
      state.arraySize = action.payload;
    },
    setSpeed: (state, action) => {
      state.speed = action.payload;
    },
    setIsSorting: (state, action) => {
      state.isSorting = action.payload;
    },

    // Searching reducers
    setSearchAlgorithm: (state, action) => {
      state.searchAlgorithm = action.payload;
    },
    setSearchTarget: (state, action) => {
      state.searchTarget = action.payload;
    },
    setIsSearching: (state, action) => {
      state.isSearching = action.payload;
    },
  },
});

export const {
  setAlgorithm,
  setArraySize,
  setSpeed,
  setIsSorting,
  setSearchAlgorithm,
  setSearchTarget,
  setIsSearching,
} = algoSlice.actions;

export default algoSlice.reducer;
