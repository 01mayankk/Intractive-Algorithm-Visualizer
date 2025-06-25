export function dfs(startNodeId, edges) {
  const visited = new Set();
  const animations = [];

  const adj = buildAdjList(edges);

  function dfsHelper(node) {
    if (visited.has(node)) return;

    visited.add(node);
    animations.push({ type: 'visit', node });

    for (const neighbor of adj[node] || []) {
      dfsHelper(neighbor);
    }
  }

  dfsHelper(startNodeId);
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
