import { configureStore } from '@reduxjs/toolkit';
import algoReducer from './algoSlice';
import graphReducer from './graphSlice';

const store = configureStore({
  reducer: {
    algo: algoReducer,
    graph: graphReducer,
  },
});

export default store;
