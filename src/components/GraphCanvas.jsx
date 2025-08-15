import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { bfs } from '../algorithms/graph/bfs';
import { dfs } from '../algorithms/graph/dfs';
import { constrainSpeed } from '../utils/delay';

const NODE_RADIUS = 20;
const EDGE_COLOR = '#888';
const NODE_COLOR = '#4f46e5';
const VISITED_COLOR = '#10b981';
const SELECTED_COLOR = '#facc15';
const GOAL_COLOR = '#e11d48'; // A nice red color for the goal
const PATH_COLOR = '#3b82f6'; // A blue for the final path

const GraphCanvas = ({
  nodes,
  edges,
  onAddNode,
  onAddEdge,
  activeNodeId,
  goalNodeId,
  setActiveNodeId,
  isDirected,
  isEdgeEditMode,
  onUpdateEdgeWeight,
  onVisualize,
  animations,
}) => {
  const canvasRef = useRef(null);
  const { graphSpeed } = useSelector((state) => state.graph);
  const visitedRef = useRef(new Set());
  const pathRef = useRef(new Set());

  useEffect(() => {
    drawGraph();
  }, [nodes, edges, activeNodeId, goalNodeId, isDirected]);

  useEffect(() => {
    if (animations && animations.length > 0) {
      animate(animations);
    }
  }, [animations]);

  const animate = async (animations) => {
    visitedRef.current.clear();
    pathRef.current.clear();

    for (const anim of animations) {
      if (anim.type === 'visit') {
        visitedRef.current.add(anim.node);
      } else if (anim.type === 'path') {
        anim.nodes.forEach(nodeId => pathRef.current.add(nodeId));
      }
      drawGraph();
      await new Promise((res) => setTimeout(res, constrainSpeed(graphSpeed)));
    }
  };

  const drawArrow = (ctx, from, to, isPath) => {
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const headlen = 10;

    const startX = from.x + NODE_RADIUS * Math.cos(angle);
    const startY = from.y + NODE_RADIUS * Math.sin(angle);
    const endX = to.x - NODE_RADIUS * Math.cos(angle);
    const endY = to.y - NODE_RADIUS * Math.sin(angle);

    ctx.save();
    ctx.strokeStyle = isPath ? PATH_COLOR : EDGE_COLOR;
    ctx.lineWidth = isPath ? 4 : 2;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - headlen * Math.cos(angle - Math.PI / 6),
      endY - headlen * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      endX - headlen * Math.cos(angle + Math.PI / 6),
      endY - headlen * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fillStyle = isPath ? PATH_COLOR : EDGE_COLOR;
    ctx.fill();
    ctx.restore();
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = EDGE_COLOR;
    ctx.lineWidth = 2;
    ctx.font = '14px Arial';
    ctx.fillStyle = '#000';

    edges.forEach((edge) => {
      const from = nodes.find((n) => n.id === edge.from);
      const to = nodes.find((n) => n.id === edge.to);
      if (!from || !to) return;

      const isPath = pathRef.current.has(from.id) && pathRef.current.has(to.id);

      if (isDirected) {
        drawArrow(ctx, from, to, isPath);
      } else {
        ctx.save();
        ctx.strokeStyle = isPath ? PATH_COLOR : EDGE_COLOR;
        ctx.lineWidth = isPath ? 4 : 2;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
        ctx.restore();
      }

      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2;
      ctx.fillText(edge.weight ?? 1, midX, midY - 6);
    });

    nodes.forEach((node) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_RADIUS, 0, 2 * Math.PI);

      if (pathRef.current.has(node.id)) {
        ctx.fillStyle = PATH_COLOR;
      } else if (visitedRef.current.has(node.id)) {
        ctx.fillStyle = VISITED_COLOR;
      } else if (node.id === activeNodeId) {
        ctx.fillStyle = SELECTED_COLOR;
      } else if (node.id === goalNodeId) {
        ctx.fillStyle = GOAL_COLOR;
      } else {
        ctx.fillStyle = NODE_COLOR;
      }

      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.id, node.x, node.y);
    });
  };

  const getClickedNode = (x, y) => {
    return nodes.find((node) => Math.hypot(node.x - x, node.y - y) <= NODE_RADIUS + 5);
  };

  const getClickedEdge = (x, y) => {
    for (let edge of edges) {
      const from = nodes.find((n) => n.id === edge.from);
      const to = nodes.find((n) => n.id === edge.to);
      if (!from || !to) continue;

      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const lengthSq = dx * dx + dy * dy;
      const t = ((x - from.x) * dx + (y - from.y) * dy) / lengthSq;

      if (t > 0 && t < 1) {
        const closestX = from.x + t * dx;
        const closestY = from.y + t * dy;
        const dist = Math.hypot(x - closestX, y - closestY);
        if (dist < 10) return edge;
      }
    }
    return null;
  };

  const buildAdjList = () => {
    const adjList = {};
    nodes.forEach((n) => (adjList[n.id] = []));
    edges.forEach(({ from, to }) => {
      adjList[from].push(to);
      if (!isDirected) adjList[to].push(from);
    });
    return adjList;
  };

  const animateTraversal = async (order) => {
    visitedRef.current.clear();
    for (let i = 0; i < order.length; i++) {
      visitedRef.current.add(order[i]);
      drawGraph();
      await new Promise((res) => setTimeout(res, constrainSpeed(graphSpeed)));
    }
  };

  const handleCanvasClick = async (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isEdgeEditMode) {
      const edge = getClickedEdge(x, y);
      if (edge) {
        const newWeight = parseInt(prompt('Update edge weight:', edge.weight));
        if (!isNaN(newWeight)) {
          onUpdateEdgeWeight(edge, newWeight);
        }
        return;
      }
    }

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
        onVisualize();
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
