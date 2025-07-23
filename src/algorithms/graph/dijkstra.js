import { PriorityQueue } from '../../dataStructures/PriorityQueue';

export function dijkstra(startNodeId, goalNodeId, nodes, edges, isDirected) {
  const animations = [];
  const dist = {};
  const prev = {};
  const pq = new PriorityQueue();
  const adj = buildAdjList(edges, isDirected);

  nodes.forEach(node => {
    dist[node.id] = Infinity;
    prev[node.id] = null;
  });

  dist[startNodeId] = 0;
  pq.enqueue(startNodeId, 0);

  while (!pq.isEmpty()) {
    const u = pq.dequeue().element;

    animations.push({ type: 'visit', node: u });

    if (u === goalNodeId) {
      // Reconstruct path
      const path = [];
      let current = goalNodeId;
      while (current !== null) {
        path.unshift(current);
        current = prev[current];
      }
      animations.push({ type: 'path', nodes: path });
      return animations;
    }

    if (u === undefined || dist[u] === Infinity) {
      continue;
    }

    (adj[u] || []).forEach(neighbor => {
      const edge = edges.find(
        (e) => (e.from === u && e.to === neighbor) || (!isDirected && e.from === neighbor && e.to === u)
      );
      const weight = edge ? edge.weight : 1;
      const newDist = dist[u] + weight;

      if (newDist < dist[neighbor]) {
        dist[neighbor] = newDist;
        prev[neighbor] = u;
        pq.enqueue(neighbor, newDist);
      }
    });
  }

  return animations;
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