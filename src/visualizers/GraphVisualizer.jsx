import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GraphCanvas from '../components/GraphCanvas';
import GraphControlPanel from '../components/GraphControlPanel';
import { bfs } from '../algorithms/graph/bfs';
import { dfs } from '../algorithms/graph/dfs';
import {
  setNodes,
  setEdges,
  setSelectedNode,
  resetGraphState,
} from '../redux/graphSlice';

const PRIMARY_COLOR = '#4f46e5';
const ACTIVE_COLOR = '#facc15';
const VISITED_COLOR = '#10b981';

const GraphVisualizer = () => {
  const dispatch = useDispatch();
  const {
    nodes,
    edges,
    graphAlgorithm,
    graphSpeed,
    selectedNode,
  } = useSelector((state) => state.graph);

  const [isDirected, setIsDirected] = useState(false);
  const [isEdgeEditMode, setIsEdgeEditMode] = useState(false);

  const onAddNode = (coords) => {
    const newNode = {
      id: nodes.length,
      ...coords,
    };
    dispatch(setNodes([...nodes, newNode]));
  };

  const onAddEdge = (fromId, toId, weight = 1) => {
    const exists = edges.some(
      (e) =>
        (e.from === fromId && e.to === toId) ||
        (!isDirected && e.from === toId && e.to === fromId)
    );

    if (!exists) {
      dispatch(setEdges([...edges, { from: fromId, to: toId, weight }]));
    } else if (isEdgeEditMode) {
      let newWeight = prompt(`Edit weight for edge ${fromId} → ${toId}:`, '1');
      newWeight = parseInt(newWeight);
      if (isNaN(newWeight) || newWeight < 0) newWeight = 1;

      const updated = edges.map((e) => {
        if (
          (e.from === fromId && e.to === toId) ||
          (!isDirected && e.from === toId && e.to === fromId)
        ) {
          return { ...e, weight: newWeight };
        }
        return e;
      });
      dispatch(setEdges(updated));
    }
  };

  const onUpdateEdgeWeight = (targetEdge, newWeight) => {
    const updatedEdges = edges.map((e) =>
      e.from === targetEdge.from && e.to === targetEdge.to
        ? { ...e, weight: newWeight }
        : e
    );
    dispatch(setEdges(updatedEdges));
  };

  const onReset = () => {
    dispatch(resetGraphState());
    document.querySelectorAll('circle').forEach((c) =>
      c.setAttribute('fill', PRIMARY_COLOR)
    );
  };

  const visualize = () => {
    if (selectedNode === null) return;

    document.querySelectorAll('circle').forEach((c) =>
      c.setAttribute('fill', PRIMARY_COLOR)
    );

    const animations =
      graphAlgorithm === 'bfs'
        ? bfs(selectedNode, edges, isDirected)
        : dfs(selectedNode, edges, isDirected);

    animations.forEach((step, i) => {
      setTimeout(() => {
        const node = nodes.find((n) => n.id === step.node);
        if (!node) return;

        const selector = `circle[cx="${node.x}"][cy="${node.y}"]`;
        const element = document.querySelector(selector);

        if (element) {
          element.setAttribute('fill', ACTIVE_COLOR);
          setTimeout(() => {
            element.setAttribute('fill', VISITED_COLOR);
          }, graphSpeed / 2);
        }
      }, i * graphSpeed);
    });
  };

  return (
    <div className="text-center py-6">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">
        Graph Visualizer (BFS / DFS)
      </h2>

      <GraphControlPanel
        onAddNode={onAddNode}
        onAddEdge={onAddEdge}
        onReset={onReset}
        onVisualize={visualize}
        onToggleDirected={() => setIsDirected((prev) => !prev)}
        onToggleEdgeEdit={() => setIsEdgeEditMode((prev) => !prev)}
        isDirected={isDirected}
        isEdgeEditMode={isEdgeEditMode}
      />

      <GraphCanvas
        nodes={nodes}
        edges={edges}
        onAddNode={onAddNode}
        onAddEdge={onAddEdge}
        setActiveNodeId={(id) => dispatch(setSelectedNode(id))}
        activeNodeId={selectedNode}
        isDirected={isDirected}
        isEdgeEditMode={isEdgeEditMode}
        onUpdateEdgeWeight={onUpdateEdgeWeight}
      />
    </div>
  );
};

export default GraphVisualizer;
