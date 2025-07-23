import { dijkstra } from './dijkstra';

describe('dijkstra', () => {
  it('should find the shortest path in a simple graph', () => {
    const nodes = [
      { id: 0, x: 0, y: 0 },
      { id: 1, x: 0, y: 0 },
      { id: 2, x: 0, y: 0 },
      { id: 3, x: 0, y: 0 },
    ];
    const edges = [
      { from: 0, to: 1, weight: 1 },
      { from: 0, to: 2, weight: 4 },
      { from: 1, to: 2, weight: 2 },
      { from: 1, to: 3, weight: 5 },
      { from: 2, to: 3, weight: 1 },
    ];
    const animations = dijkstra(0, 3, nodes, edges, false);
    const pathAnimation = animations.find(anim => anim.type === 'path');
    expect(pathAnimation.nodes).toEqual([0, 1, 2, 3]);
  });
}); 