export function bfs(graph, startNode) {
  const visited = [];
  const queue = [startNode];

  while (queue.length > 0) {
    const node = queue.shift();
    if (!visited.includes(node)) {
      visited.push(node);
      graph[node].forEach((neighbor) => {
        if (!visited.includes(neighbor)) queue.push(neighbor);
      });
    }
  }

  return visited;
}
