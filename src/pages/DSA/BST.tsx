import React, { useState, useEffect, useRef } from 'react';
import AlgorithmVisualizer from '../../components/DSA/AlgorithmVisualizer';
import { motion } from 'framer-motion';

const BST_CODE = `void inorder(Node* root) {
  if (root == NULL) return;
  
  inorder(root->left);  // Process left child
  
  // Visit current node
  cout << root->value << " ";
  
  inorder(root->right); // Process right child
}`;

type TreeNode = {
  id: number;
  val: number;
  x: number;
  y: number;
  left: number | null;
  right: number | null;
};

// Hardcoded BST structure for visualization simplicity
const bstNodes: Record<number, TreeNode> = {
  1: { id: 1, val: 50, x: 50, y: 15, left: 2, right: 3 },
  2: { id: 2, val: 30, x: 25, y: 40, left: 4, right: 5 },
  3: { id: 3, val: 70, x: 75, y: 40, left: 6, right: 7 },
  4: { id: 4, val: 20, x: 12, y: 65, left: null, right: null },
  5: { id: 5, val: 40, x: 38, y: 65, left: null, right: null },
  6: { id: 6, val: 60, x: 62, y: 65, left: null, right: null },
  7: { id: 7, val: 80, x: 88, y: 65, left: null, right: null },
};

export default function BSTVis() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [activeLine, setActiveLine] = useState(0);
  const [explanation, setExplanation] = useState("Click Play to start In-Order Traversal.");
  
  const [visited, setVisited] = useState<number[]>([]);
  const [currentNode, setCurrentNode] = useState<number | null>(null);
  const [isDone, setIsDone] = useState(false);
  
  const [stepQueue, setStepQueue] = useState<any[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    precomputeTraversal();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const precomputeTraversal = () => {
    const queue: any[] = [];
    const vis: number[] = [];

    const traverse = (nodeId: number | null) => {
      if (nodeId === null) {
        queue.push({
          activeLine: 2,
          explanation: "Node is NULL. Returning to parent.",
          currentNode: null,
          visited: [...vis],
        });
        return;
      }

      const node = bstNodes[nodeId];

      queue.push({
        activeLine: 1,
        explanation: `Called inorder() on Node \${node.val}.`,
        currentNode: nodeId,
        visited: [...vis],
      });

      queue.push({
        activeLine: 4,
        explanation: `Node \${node.val} is not NULL. Recursively passing to the Left child.`,
        currentNode: nodeId,
        visited: [...vis],
      });

      traverse(node.left);

      vis.push(node.val);
      queue.push({
        activeLine: 7,
        explanation: `Back to Node \${node.val}. Visiting it now and appending to result!`,
        currentNode: nodeId,
        visited: [...vis],
      });

      queue.push({
        activeLine: 9,
        explanation: `Recursively passing to the Right child of Node \${node.val}.`,
        currentNode: nodeId,
        visited: [...vis],
      });

      traverse(node.right);
      
      queue.push({
        activeLine: 10,
        explanation: `Finished processing subtree for Node \${node.val}. Returning.`,
        currentNode: nodeId,
        visited: [...vis],
      });
    };

    queue.push({
      activeLine: 0,
      explanation: "Starting In-Order Traversal from the Root.",
      currentNode: 1,
      visited: [],
    });

    traverse(1);

    queue.push({
      activeLine: 11,
      explanation: "Traversal Complete! The nodes are sorted in ascending order.",
      currentNode: null,
      visited: [...vis],
      isDone: true
    });

    setStepQueue(queue);
    applyStep(0, queue);
  };

  const applyStep = (idx: number, queue: any[]) => {
    if (idx >= queue.length) return;
    const step = queue[idx];
    setVisited(step.visited);
    setCurrentNode(step.currentNode);
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
        title="BST Traversal (In-Order)"
        description="Depth-First Search (DFS) variant on a Binary Search Tree."
        codeSnippet={BST_CODE}
        explanationText={explanation}
        activeLine={activeLine}
        complexities={{
          best: "O(n)",
          average: "O(n)",
          worst: "O(n)",
          space: "O(h)"
        }}
        theoryContent={
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Concept</h2>
            <p>Tree traversal means visiting every node in the tree exactly once. In-Order traversal processes the left subtree, then visits the node, then right subtree.</p>
            <h2 className="text-xl font-bold">Intuition</h2>
            <p>For a Binary Search Tree (where left children are smaller and right children are larger), In-Order traversal magically yields the elements in perfectly sorted ascending order!</p>
          </div>
        }
        interviewContent={
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Common Types</h2>
            <ul className="list-disc pl-5">
              <li><strong>In-Order (Left, Root, Right):</strong> Useful to flatten a BST to a sorted array.</li>
              <li><strong>Pre-Order (Root, Left, Right):</strong> Useful to create a copy of the tree.</li>
              <li><strong>Post-Order (Left, Right, Root):</strong> Useful to delete the tree (deletes children before the parent).</li>
            </ul>
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
        <div className="w-full h-full p-4 flex flex-col items-center">
          
          <div className="w-full max-w-[500px] h-[300px] relative mt-4">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              {/* Edges */}
              {Object.values(bstNodes).map((node) => {
                const edges = [];
                if (node.left && bstNodes[node.left]) {
                  const target = bstNodes[node.left];
                  edges.push(<line key={\`e-\${node.id}-l\`} x1={node.x} y1={node.y} x2={target.x} y2={target.y} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth="0.5" />);
                }
                if (node.right && bstNodes[node.right]) {
                  const target = bstNodes[node.right];
                  edges.push(<line key={\`e-\${node.id}-r\`} x1={node.x} y1={node.y} x2={target.x} y2={target.y} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth="0.5" />);
                }
                return <g key={\`edges-\${node.id}\`}>{edges}</g>;
              })}

              {/* Nodes */}
              {Object.values(bstNodes).map((node) => {
                const isCurrent = currentNode === node.id;
                const isVis = visited.includes(node.val);

                let fillClass = "fill-white dark:fill-slate-800";
                let strokeClass = "stroke-slate-300 dark:stroke-slate-600";
                
                if (isCurrent) {
                  fillClass = "fill-primary-500";
                  strokeClass = "stroke-primary-600";
                } else if (isVis) {
                  fillClass = "fill-emerald-500";
                  strokeClass = "stroke-emerald-600";
                }

                return (
                  <g key={node.id}>
                    {isCurrent && <circle cx={node.x} cy={node.y} r="8" className="fill-primary-500/20 animate-ping" />}
                    
                    <circle 
                      cx={node.x} cy={node.y} r="5" 
                      className={\`\${fillClass} \${strokeClass} transition-colors duration-300\`} 
                      strokeWidth="0.5" 
                    />
                    <text 
                      x={node.x} y={node.y + 1.2} 
                      textAnchor="middle" 
                      fontSize="3.5" 
                      className={\`\${isCurrent || isVis ? 'fill-white' : 'fill-slate-700 dark:fill-slate-300'} font-bold font-mono\`}
                    >
                      {node.val}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-8 w-full max-w-lg glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Output Array</span>
            <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
              {visited.map((v, i) => (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  key={i} 
                  className="px-3 py-1 bg-emerald-500 text-white font-bold rounded shadow-sm text-sm"
                >
                  {v}
                </motion.div>
              ))}
              {visited.length === 0 && <span className="text-slate-400 italic text-sm my-auto pl-2">Waiting for traversal...</span>}
            </div>
          </div>
        </div>
      </AlgorithmVisualizer>
    </div>
  );
}
