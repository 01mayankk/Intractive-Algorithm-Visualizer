import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  graphAlgorithm: 'bfs',       // bfs | dfs | preorder | inorder | postorder
  graphSpeed: 300,             // Delay between steps
  graphMode: 'graph',          // 'graph' or 'tree'

  nodes: [],                   // { id, x, y }
  edges: [],                   // { from, to }

  selectedNode: null,          // For building edges
  visitedNodes: [],            // Track visited nodes during animation
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
      state.selectedNode = null;
      state.visitedNodes = [];
    },
    setSelectedNode: (state, action) => {
      state.selectedNode = action.payload;
    },
    setVisitedNodes: (state, action) => {
      state.visitedNodes = action.payload;
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
  setSelectedNode,
  setVisitedNodes,
} = graphSlice.actions;

export default graphSlice.reducer;
