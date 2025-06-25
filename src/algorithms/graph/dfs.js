export function dfs(graph, startNode, visited = []) {
  if (!visited.includes(startNode)) {
    visited.push(startNode);
    graph[startNode].forEach((neighbor) => {
      dfs(graph, neighbor, visited);
    });
  }

  return visited;
}
