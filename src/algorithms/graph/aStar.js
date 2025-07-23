import { PriorityQueue } from '../../dataStructures/PriorityQueue';

export function aStar(startNodeId, goalNodeId, nodes, edges, isDirected, heuristic) {
  const animations = [];
  const openSet = new PriorityQueue();
  const cameFrom = {};
  const gScore = {};
  const fScore = {};
  const adj = buildAdjList(edges, isDirected);

  nodes.forEach(node => {
    gScore[node.id] = Infinity;
    fScore[node.id] = Infinity;
    cameFrom[node.id] = null;
  });

  gScore[startNodeId] = 0;
  fScore[startNodeId] = heuristic(nodes.find(n => n.id === startNodeId), nodes.find(n => n.id === goalNodeId));
  openSet.enqueue(startNodeId, fScore[startNodeId]);

  const openSetNodes = new Set([startNodeId]);

  while (!openSet.isEmpty()) {
    const currentId = openSet.dequeue().element;
    openSetNodes.delete(currentId);

    animations.push({ type: 'visit', node: currentId });

    if (currentId === goalNodeId) {
      const path = [];
      let current = goalNodeId;
      while (current !== null) {
        path.unshift(current);
        current = cameFrom[current];
      }
      animations.push({ type: 'path', nodes: path });
      return animations;
    }

    (adj[currentId] || []).forEach(neighborId => {
      const edge = edges.find(
        (e) => (e.from === currentId && e.to === neighborId) || (!isDirected && e.from === neighborId && e.to === currentId)
      );
      const weight = edge ? edge.weight : 1;
      const tentativeGScore = gScore[currentId] + weight;

      if (tentativeGScore < gScore[neighborId]) {
        cameFrom[neighborId] = currentId;
        gScore[neighborId] = tentativeGScore;
        fScore[neighborId] = gScore[neighborId] + heuristic(nodes.find(n => n.id === neighborId), nodes.find(n => n.id === goalNodeId));
        if (!openSetNodes.has(neighborId)) {
          openSet.enqueue(neighborId, fScore[neighborId]);
          openSetNodes.add(neighborId);
        }
      }
    });
  }

  return animations; // Goal not found
}


function buildAdjList(edges, isDirected) {
  const adj = {};
  for (const { from, to } of edges) {
    if (!adj[from]) adj[from] = [];
    if (!adj[to]) adj[to] = [];
    adj[from].push(to);
    if (!isDirected) adj[to].push(from);
  }
  return adj;
} 