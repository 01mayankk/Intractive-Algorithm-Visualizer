import React, { useState, useEffect, useRef } from 'react';
import AlgorithmVisualizer from '../../components/DSA/AlgorithmVisualizer';

const DIJKSTRA_CODE = `void dijkstra(int graph[V][V], int src) {
  int dist[V];     
  bool sptSet[V]; 

  for (int i = 0; i < V; i++)
      dist[i] = INT_MAX, sptSet[i] = false;

  dist[src] = 0;

  for (int count = 0; count < V - 1; count++) {
      int u = minDistance(dist, sptSet);
      sptSet[u] = true;

      for (int v = 0; v < V; v++)
          if (!sptSet[v] && graph[u][v] && dist[u] != INT_MAX
              && dist[u] + graph[u][v] < dist[v])
              dist[v] = dist[u] + graph[u][v];
  }
}`;

type Node = { id: number; x: number; y: number };
type Edge = { source: number; target: number; weight: number };

const initialNodes: Node[] = [
  { id: 0, x: 20, y: 50 },
  { id: 1, x: 40, y: 20 },
  { id: 2, x: 40, y: 80 },
  { id: 3, x: 70, y: 30 },
  { id: 4, x: 70, y: 70 },
  { id: 5, x: 90, y: 50 },
];

const initialEdges: Edge[] = [
  { source: 0, target: 1, weight: 4 },
  { source: 0, target: 2, weight: 2 },
  { source: 1, target: 2, weight: 5 },
  { source: 1, target: 3, weight: 10 },
  { source: 2, target: 4, weight: 3 },
  { source: 4, target: 3, weight: 4 },
  { source: 3, target: 5, weight: 11 },
  { source: 4, target: 5, weight: 8 },
];

export default function DijkstraVis() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [activeLine, setActiveLine] = useState(0);
  const [explanation, setExplanation] = useState("Click Play or Step to begin Dijkstra's Algorithm from Node 0.");
  
  const [distances, setDistances] = useState<number[]>(Array(6).fill(Infinity));
  const [visited, setVisited] = useState<boolean[]>(Array(6).fill(false));
  const [currentNode, setCurrentNode] = useState<number | null>(null);
  const [checkingNeighbor, setCheckingNeighbor] = useState<number | null>(null);
  const [isDone, setIsDone] = useState(false);
  
  // Simulation Queue: Stores state snapshots for playback
  const [stepQueue, setStepQueue] = useState<any[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    precomputeDijkstra();
  }, []);

  const precomputeDijkstra = () => {
    const queue: any[] = [];
    const dist = Array(6).fill(Infinity);
    const vis = Array(6).fill(false);
    
    // Initial state
    dist[0] = 0;
    queue.push({
      activeLine: 7,
      explanation: "Initialize all distances to Infinity, except the source node (0) which is 0.",
      distances: [...dist],
      visited: [...vis],
      currentNode: null,
      checkingNeighbor: null
    });

    for (let count = 0; count < 6; count++) {
      // Find min unvisited
      let min = Infinity;
      let u = -1;
      for (let i = 0; i < 6; i++) {
        if (!vis[i] && dist[i] <= min) {
          min = dist[i];
          u = i;
        }
      }

      if (u === -1) break;

      queue.push({
        activeLine: 10,
        explanation: `Select unvisited node \${u} with the smallest tentative distance (\${dist[u]}).`,
        distances: [...dist],
        visited: [...vis],
        currentNode: u,
        checkingNeighbor: null
      });

      vis[u] = true;
      
      queue.push({
        activeLine: 11,
        explanation: `Mark Node \${u} as visited.`,
        distances: [...dist],
        visited: [...vis],
        currentNode: u,
        checkingNeighbor: null
      });

      // Update neighbors
      const neighbors = initialEdges.filter(e => e.source === u || e.target === u);
      for (const edge of neighbors) {
        const v = edge.source === u ? edge.target : edge.source;
        if (!vis[v]) {
          queue.push({
            activeLine: 14,
            explanation: `Checking unvisited neighbor Node \${v} of Node \${u}.`,
            distances: [...dist],
            visited: [...vis],
            currentNode: u,
            checkingNeighbor: v
          });

          if (dist[u] !== Infinity && dist[u] + edge.weight < dist[v]) {
            dist[v] = dist[u] + edge.weight;
            queue.push({
              activeLine: 16,
              explanation: `Found a shorter path to Node \${v} through Node \${u}. Updating distance to \${dist[v]}.`,
              distances: [...dist],
              visited: [...vis],
              currentNode: u,
              checkingNeighbor: v
            });
          } else {
             queue.push({
              activeLine: 15,
              explanation: `Path to Node \${v} through Node \${u} is NOT shorter. Keeping current distance.`,
              distances: [...dist],
              visited: [...vis],
              currentNode: u,
              checkingNeighbor: v
            });
          }
        }
      }
    }
    
    queue.push({
      activeLine: 18,
      explanation: "Algorithm complete! All shortest paths from Node 0 have been found.",
      distances: [...dist],
      visited: [...vis],
      currentNode: null,
      checkingNeighbor: null,
      isDone: true
    });

    setStepQueue(queue);
    applyStep(0, queue);
  };

  const applyStep = (idx: number, queue: any[]) => {
    if (idx >= queue.length) return;
    const step = queue[idx];
    setDistances(step.distances);
    setVisited(step.visited);
    setCurrentNode(step.currentNode);
    setCheckingNeighbor(step.checkingNeighbor);
    setActiveLine(step.activeLine);
    setExplanation(step.explanation);
    setCurrentStepIdx(idx);
    if (step.isDone) {
      setIsDone(true);
      setIsPlaying(false);
    }
  };

  const performStep = () => {
    if (currentStepIdx < stepQueue.length - 1) {
      applyStep(currentStepIdx + 1, stepQueue);
    }
  };

  const resetVis = () => {
    setIsPlaying(false);
    setIsDone(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    applyStep(0, stepQueue);
  };

  const getDelay = () => {
    const delays = { 1: 2000, 2: 1200, 3: 800, 4: 400, 5: 100 };
    return delays[speed as keyof typeof delays] || 800;
  };

  useEffect(() => {
    if (isPlaying && !isDone) {
      timerRef.current = setTimeout(() => {
        performStep();
      }, getDelay());
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIdx, isDone, speed]);

  return (
    <div className="p-4 md:p-8">
      <AlgorithmVisualizer
        title="Dijkstra's Algorithm"
        description="Finds the shortest paths between nodes in a graph, which may represent, for example, road networks."
        codeSnippet={DIJKSTRA_CODE}
        explanationText={explanation}
        activeLine={activeLine}
        complexities={{
          best: "O(E + V log V)",
          average: "O(E + V log V)",
          worst: "O(E + V log V)",
          space: "O(V)"
        }}
        theoryContent={
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Concept</h2>
            <p>Dijkstra's algorithm guarantees the shortest path from a starting node to all other nodes in a weighted graph with non-negative edge weights.</p>
            <h2 className="text-xl font-bold">Intuition</h2>
            <p>It works like water flowing through pipes; the water will always reach the closest nodes first before flowing to further ones. We always greedily pick the closest unvisited node and update the distances to its neighbors.</p>
          </div>
        }
        interviewContent={
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Common Variations</h2>
            <ul className="list-disc pl-5">
              <li><strong>Network Routing:</strong> OSPF protocol uses Dijkstra's.</li>
              <li><strong>Map Navigation:</strong> Finding the fastest route between two cities requires Dijkstra or A*.</li>
            </ul>
            <h2 className="text-xl font-bold">Gotchas</h2>
            <p>Dijkstra's algorithm FAILS if there are negative weight edges. In those cases, use Bellman-Ford algorithm.</p>
          </div>
        }
        isPlaying={isPlaying}
        canStep={!isDone}
        speed={speed}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onStep={performStep}
        onReset={resetVis}
        onSpeedChange={setSpeed}
      >
        <div className="w-full h-full p-4 relative flex items-center justify-center">
          <svg className="w-full max-w-[500px] h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {/* Edges */}
            {initialEdges.map((e, idx) => {
              const src = initialNodes[e.source];
              const tgt = initialNodes[e.target];
              const isChecking = (currentNode === e.source && checkingNeighbor === e.target) || 
                                 (currentNode === e.target && checkingNeighbor === e.source);
              
              const isPartOfPath = false; // Advanced: We could track parents array to highlight the SPT
              
              const strokeClass = isChecking 
                ? "stroke-amber-500 animate-pulse drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]" 
                : "stroke-slate-300 dark:stroke-slate-700";

              return (
                <g key={idx}>
                  <line 
                    x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y} 
                    className={`${strokeClass} transition-all duration-300`} 
                    strokeWidth={isChecking ? "1" : "0.5"} 
                  />
                  <rect 
                    x={(src.x + tgt.x) / 2 - 3} 
                    y={(src.y + tgt.y) / 2 - 2} 
                    width="6" height="4" 
                    className="fill-white dark:fill-slate-800" rx="1" 
                  />
                  <text 
                    x={(src.x + tgt.x) / 2} 
                    y={(src.y + tgt.y) / 2 + 1} 
                    textAnchor="middle" 
                    fontSize="3" 
                    className="fill-slate-600 dark:fill-slate-400 font-bold font-mono"
                  >
                    {e.weight}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {initialNodes.map((n) => {
              const dist = distances[n.id];
              const isVis = visited[n.id];
              const isCurrent = currentNode === n.id;
              const isChecking = checkingNeighbor === n.id;

              let fillClass = "fill-slate-100 dark:fill-slate-800";
              let strokeClass = "stroke-slate-300 dark:stroke-slate-600";
              
              if (isCurrent) {
                fillClass = "fill-primary-500";
                strokeClass = "stroke-primary-600";
              } else if (isChecking) {
                fillClass = "fill-amber-500";
                strokeClass = "stroke-amber-600";
              } else if (isVis) {
                fillClass = "fill-emerald-500";
                strokeClass = "stroke-emerald-600";
              }

              return (
                <g key={n.id}>
                  {isCurrent && <circle cx={n.x} cy={n.y} r="8" className="fill-primary-500/20 animate-ping" />}
                  
                  <circle 
                    cx={n.x} cy={n.y} r="4" 
                    className={`${fillClass} ${strokeClass} transition-colors duration-300`} 
                    strokeWidth="1" 
                  />
                  <text 
                    x={n.x} y={n.y + 1} 
                    textAnchor="middle" 
                    fontSize="3.5" 
                    className={`${isCurrent || isChecking || isVis ? 'fill-white' : 'fill-slate-700 dark:fill-slate-300'} font-bold`}
                  >
                    {dist === Infinity ? '∞' : dist}
                  </text>
                  
                  {/* Node ID label outside */}
                  <text 
                    x={n.x} y={n.y - 6} 
                    textAnchor="middle" 
                    fontSize="2.5" 
                    className="fill-slate-400 font-bold"
                  >
                    Node {n.id}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </AlgorithmVisualizer>
    </div>
  );
}
