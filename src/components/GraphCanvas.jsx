import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { bfs } from '../algorithms/graph/bfs';
import { dfs } from '../algorithms/graph/dfs';

const NODE_RADIUS = 20;
const EDGE_COLOR = '#888';
const NODE_COLOR = '#4f46e5';
const VISITED_COLOR = '#10b981';
const SELECTED_COLOR = '#facc15';

const GraphCanvas = ({
  nodes,
  edges,
  onAddNode,
  onAddEdge,
  activeNodeId,
  setActiveNodeId,
}) => {
  const canvasRef = useRef(null);
  const { graphAlgorithm, graphSpeed } = useSelector((state) => state.graph);
  const visitedRef = useRef(new Set());

  useEffect(() => {
    drawGraph();
  }, [nodes, edges, activeNodeId]);

  const drawGraph = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges with weights
    ctx.strokeStyle = EDGE_COLOR;
    ctx.lineWidth = 2;
    ctx.font = '14px Arial';
    ctx.fillStyle = '#000';

    edges.forEach((edge) => {
      const from = nodes.find((n) => n.id === edge.from);
      const to = nodes.find((n) => n.id === edge.to);
      if (from && to) {
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();

        // Draw weight label at the midpoint
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;
        ctx.fillText(edge.weight ?? 1, midX, midY - 6);
      }
    });

    // Draw nodes
    nodes.forEach((node) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_RADIUS, 0, 2 * Math.PI);

      if (visitedRef.current.has(node.id)) {
        ctx.fillStyle = VISITED_COLOR;
      } else if (node.id === activeNodeId) {
        ctx.fillStyle = SELECTED_COLOR;
      } else {
        ctx.fillStyle = NODE_COLOR;
      }

      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.stroke();

      // Node label
      ctx.fillStyle = '#fff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.id, node.x, node.y);
    });
  };

  const getClickedNode = (x, y) => {
    return nodes.find(
      (node) => Math.hypot(node.x - x, node.y - y) <= NODE_RADIUS + 5
    );
  };

  const buildAdjList = () => {
    const adjList = {};
    nodes.forEach((n) => (adjList[n.id] = []));
    edges.forEach(({ from, to }) => {
      adjList[from].push(to);
      adjList[to].push(from);
    });
    return adjList;
  };

  const animateTraversal = async (order) => {
    visitedRef.current.clear();
    for (let i = 0; i < order.length; i++) {
      visitedRef.current.add(order[i]);
      drawGraph();
      await new Promise((res) => setTimeout(res, graphSpeed));
    }
  };

  const handleCanvasClick = async (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const clickedNode = getClickedNode(x, y);

    if (!clickedNode) {
      onAddNode({ x, y });
    } else {
      if (activeNodeId === null) {
        setActiveNodeId(clickedNode.id);
      } else if (activeNodeId !== clickedNode.id) {
        const weightInput = prompt('Enter edge weight (default is 1):', '1');
        const weight = parseInt(weightInput);
        const validWeight = isNaN(weight) ? 1 : weight;
        onAddEdge(activeNodeId, clickedNode.id, validWeight);
        setActiveNodeId(null);
      } else {
        const graph = buildAdjList();
        let order = [];

        if (graphAlgorithm === 'bfs') {
          order = bfs(graph, clickedNode.id);
        } else if (graphAlgorithm === 'dfs') {
          order = dfs(graph, clickedNode.id);
        }

        await animateTraversal(order);
        setActiveNodeId(null);
      }
    }
  };

  return (
    <div className="w-full flex justify-center mt-4">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        width={800}
        height={500}
        className="border rounded shadow-lg cursor-pointer"
      />
    </div>
  );
};

export default GraphCanvas;
