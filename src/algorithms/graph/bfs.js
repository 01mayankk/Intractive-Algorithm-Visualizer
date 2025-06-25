export function bfs(startNodeId, edges) {
  const visited = new Set();
  const queue = [startNodeId];
  const animations = [];

  const adj = buildAdjList(edges);

  while (queue.length > 0) {
    const current = queue.shift();

    if (!visited.has(current)) {
      visited.add(current);
      animations.push({ type: 'visit', node: current });

      for (const neighbor of adj[current] || []) {
        if (!visited.has(neighbor)) {
          queue.push(neighbor);
        }
      }
    }
  }

  return animations;
}

function buildAdjList(edges) {
  const adj = {};
  for (const { from, to } of edges) {
    if (!adj[from]) adj[from] = [];
    if (!adj[to]) adj[to] = [];
    adj[from].push(to);
    adj[to].push(from); // Undirected graph
  }
  return adj;
}
