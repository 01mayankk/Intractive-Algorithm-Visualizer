import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  graphAlgorithm: 'bfs',   // bfs | dfs | preorder | inorder | postorder
  graphSpeed: 300,         // delay in ms between animation steps
  graphMode: 'graph',      // 'graph' or 'tree'
  nodes: [],
  edges: [],
};

const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    setGraphAlgorithm: (state, action) => {
      state.graphAlgorithm = action.payload;
    },
    setGraphSpeed: (state, action) => {
      state.graphSpeed = action.payload;
    },
    setGraphMode: (state, action) => {
      state.graphMode = action.payload;
    },
    setNodes: (state, action) => {
      state.nodes = action.payload;
    },
    setEdges: (state, action) => {
      state.edges = action.payload;
    },
    resetGraphState: (state) => {
      state.nodes = [];
      state.edges = [];
    },
  },
});

export const {
  setGraphAlgorithm,
  setGraphSpeed,
  setGraphMode,
  setNodes,
  setEdges,
  resetGraphState,
} = graphSlice.actions;

export default graphSlice.reducer;
