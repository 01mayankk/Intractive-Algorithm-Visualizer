import React, { useState, useEffect, useRef } from 'react';
import { constrainSpeed } from './utils/delay';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('welcome');
  const [customArray, setCustomArray] = useState('');
  const [searchTarget, setSearchTarget] = useState('');
  const [arraySize, setArraySize] = useState(8);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [isSorting, setIsSorting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentArray, setCurrentArray] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');
  const [selectedSearchAlgorithm, setSelectedSearchAlgorithm] = useState('');
  const [steps, setSteps] = useState([]);
  const [explanation, setExplanation] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  // Graph Builder State
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [graphSteps, setGraphSteps] = useState([]);
  const [currentGraphStep, setCurrentGraphStep] = useState(0);
  const [isGraphPlaying, setIsGraphPlaying] = useState(false);
  const [graphType, setGraphType] = useState('undirected'); // 'directed' or 'undirected'
  const [graphMode, setGraphMode] = useState('cyclic'); // 'cyclic' or 'acyclic'
  const [selectedDataStructure, setSelectedDataStructure] = useState('');
  
  // Data Structure States
  const [binaryTreeData, setBinaryTreeData] = useState([]);
  const [hashTableData, setHashTableData] = useState({});
  const [heapData, setHeapData] = useState([]);
  const [linkedListData, setLinkedListData] = useState([]);
  const [queueData, setQueueData] = useState([]);
  const [stackData, setStackData] = useState([]);
  const [trieData, setTrieData] = useState({});
  
  // Operation States
  const [operationInput, setOperationInput] = useState('');
  const [operationResult, setOperationResult] = useState('');
  const [operationHistory, setOperationHistory] = useState([]);
  
  // Step-by-step visualization states
  const [dsCurrentStep, setDsCurrentStep] = useState(0);
  const [dsTotalSteps, setDsTotalSteps] = useState(0);
  const [dsIsPlaying, setDsIsPlaying] = useState(false);
  const [dsPlaybackSpeed, setDsPlaybackSpeed] = useState(1000); // milliseconds (minimum 100ms)
  const [stepExplanations, setStepExplanations] = useState([]);
  const [currentDataState, setCurrentDataState] = useState({});
  const [stepDataStates, setStepDataStates] = useState([]);
  const [dsIntervalRef, setDsIntervalRef] = useState(null);
  
  const canvasRef = useRef(null);

  // Initialize with random array
  useEffect(() => {
    generateRandomArray();
  }, [arraySize]);

  const generateRandomArray = () => {
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 50) + 1);
    setCustomArray(newArray.join(', '));
    setCurrentArray([...newArray]);
  };

  const handleArrayInput = (e) => {
    setCustomArray(e.target.value);
    const parsed = parseArray();
    setCurrentArray(parsed);
  };

  const parseArray = () => {
    if (!customArray.trim()) return [];
    return customArray.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
  };

  // Graph Builder Functions
  const handleCanvasClick = (e) => {
    if (isDragging) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newNode = {
      id: `node-${Date.now()}`,
      x: x,
      y: y,
      label: `Node ${nodes.length + 1}`,
      visited: false,
      distance: Infinity,
      parent: null
    };
    
    setNodes([...nodes, newNode]);
  };

  const handleNodeMouseDown = (nodeId) => {
    setSelectedNode(nodeId);
    setIsDragging(true);
  };

  const handleCanvasMouseMove = (e) => {
    if (!isDragging || !selectedNode) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setNodes(nodes.map(node => 
      node.id === selectedNode 
        ? { ...node, x: x, y: y }
        : node
    ));
  };

  const handleCanvasMouseUp = () => {
    if (selectedNode && isDragging) {
      // Check if we're connecting to another node
      const targetNode = nodes.find(node => 
        node.id !== selectedNode &&
        Math.sqrt(Math.pow(node.x - nodes.find(n => n.id === selectedNode).x, 2) + 
                 Math.pow(node.y - nodes.find(n => n.id === selectedNode).y, 2)) < 50
      );
      
      if (targetNode) {
        const newEdge = {
          id: `edge-${Date.now()}`,
          from: selectedNode,
          to: targetNode.id,
          weight: Math.floor(Math.random() * 10) + 1
        };
        
        // Check if edge already exists
        const edgeExists = edges.some(edge => 
          (edge.from === newEdge.from && edge.to === newEdge.to) ||
          (edge.from === newEdge.to && edge.to === newEdge.from)
        );
        
        if (!edgeExists) {
          setEdges([...edges, newEdge]);
        }
      }
    }
    
    setSelectedNode(null);
    setIsDragging(false);
  };

  const clearGraph = () => {
    setNodes([]);
    setEdges([]);
    setGraphSteps([]);
    setCurrentGraphStep(0);
    setIsGraphPlaying(false);
  };

  const addRandomNodes = () => {
    const numNewNodes = Math.floor(Math.random() * 3) + 2; // 2-4 new nodes
    const newNodes = [];
    
    for (let i = 0; i < numNewNodes; i++) {
      const newNode = {
        id: `node-${Date.now()}-${i}`,
        x: Math.random() * 400 + 50,
        y: Math.random() * 300 + 50,
        label: `Node ${nodes.length + i + 1}`,
        visited: false,
        distance: Infinity,
        parent: null
      };
      newNodes.push(newNode);
    }
    
    setNodes([...nodes, ...newNodes]);
  };

  const generateRandomGraph = () => {
    const newNodes = [];
    const newEdges = [];
    
    // Generate 6-8 random nodes
    const numNodes = Math.floor(Math.random() * 3) + 6;
    
    for (let i = 0; i < numNodes; i++) {
      const node = {
        id: `node-${i}`,
        x: Math.random() * 400 + 50,
        y: Math.random() * 300 + 50,
        label: `Node ${i + 1}`,
        visited: false,
        distance: Infinity,
        parent: null
      };
      newNodes.push(node);
    }
    
    // Generate random edges based on graph type and mode
    const maxEdges = graphMode === 'acyclic' ? numNodes - 1 : numNodes * 1.5;
    
    for (let i = 0; i < maxEdges; i++) {
      const from = Math.floor(Math.random() * numNodes);
      const to = Math.floor(Math.random() * numNodes);
      
      if (from !== to) {
        const edge = {
          id: `edge-${i}`,
          from: `node-${from}`,
          to: `node-${to}`,
          weight: Math.floor(Math.random() * 10) + 1
        };
        
        const edgeExists = newEdges.some(e => 
          (e.from === edge.from && e.to === edge.to) ||
          (graphType === 'undirected' && e.from === edge.to && e.to === edge.from)
        );
        
        if (!edgeExists) {
          newEdges.push(edge);
        }
      }
    }
    
    setNodes(newNodes);
    setEdges(newEdges);
    setGraphSteps([]);
    setCurrentGraphStep(0);
    setIsGraphPlaying(false);
  };

  const runBFS = () => {
    if (nodes.length === 0) return;
    
    const steps = [];
    const visited = new Set();
    const queue = [{ node: nodes[0], distance: 0, parent: null }];
    
    steps.push({
      nodes: nodes.map(n => ({ ...n, visited: false, distance: Infinity, parent: null })),
      edges: edges,
      explanation: `Starting BFS from ${nodes[0].label}. Queue: [${nodes[0].label}]`,
      current: nodes[0].id
    });
    
    while (queue.length > 0) {
      const { node, distance, parent } = queue.shift();
      
      if (visited.has(node.id)) continue;
      
      visited.add(node.id);
      
      const updatedNodes = nodes.map(n => ({
        ...n,
        visited: visited.has(n.id),
        distance: n.id === node.id ? distance : n.distance,
        parent: n.id === node.id ? parent : n.parent
      }));
      
      steps.push({
        nodes: updatedNodes,
        edges: edges,
        explanation: `Visiting ${node.label} (distance: ${distance}). Adding unvisited neighbors to queue.`,
        current: node.id
      });
      
      // Add unvisited neighbors to queue
      const neighbors = edges
        .filter(edge => edge.from === node.id || edge.to === node.id)
        .map(edge => edge.from === node.id ? edge.to : edge.from)
        .filter(neighborId => !visited.has(neighborId));
      
      for (const neighborId of neighbors) {
        const neighbor = nodes.find(n => n.id === neighborId);
        queue.push({ node: neighbor, distance: distance + 1, parent: node.id });
      }
      
      if (neighbors.length > 0) {
        steps.push({
          nodes: updatedNodes,
          edges: edges,
          explanation: `Added neighbors to queue: [${neighbors.map(id => nodes.find(n => n.id === id).label).join(', ')}]`,
          current: node.id
        });
      }
    }
    
    setGraphSteps(steps);
    setCurrentGraphStep(0);
    setIsGraphPlaying(false);
  };

  const runDFS = () => {
    if (nodes.length === 0) return;
    
    const steps = [];
    const visited = new Set();
    
    const dfsHelper = (node, distance, parent) => {
      if (visited.has(node.id)) return;
      
      visited.add(node.id);
      
      const updatedNodes = nodes.map(n => ({
        ...n,
        visited: visited.has(n.id),
        distance: n.id === node.id ? distance : n.distance,
        parent: n.id === node.id ? parent : n.parent
      }));
      
      steps.push({
        nodes: updatedNodes,
        edges: edges,
        explanation: `Visiting ${node.label} (distance: ${distance}). Exploring deeper into the graph.`,
        current: node.id
      });
      
      // Find unvisited neighbors
      const neighbors = edges
        .filter(edge => edge.from === node.id || edge.to === node.id)
        .map(edge => edge.from === node.id ? edge.to : edge.from)
        .filter(neighborId => !visited.has(neighborId));
      
      for (const neighborId of neighbors) {
        const neighbor = nodes.find(n => n.id === neighborId);
        dfsHelper(neighbor, distance + 1, node.id);
      }
    };
    
    steps.push({
      nodes: nodes.map(n => ({ ...n, visited: false, distance: Infinity, parent: null })),
      edges: edges,
      explanation: `Starting DFS from ${nodes[0].label}.`,
      current: nodes[0].id
    });
    
    dfsHelper(nodes[0], 0, null);
    
    setGraphSteps(steps);
    setCurrentGraphStep(0);
    setIsGraphPlaying(false);
  };

  const runDijkstra = () => {
    if (nodes.length === 0) return;
    
    const steps = [];
    const distances = {};
    const visited = new Set();
    const startNode = nodes[0];
    
    // Initialize distances
    nodes.forEach(node => {
      distances[node.id] = node.id === startNode.id ? 0 : Infinity;
    });
    
    steps.push({
      nodes: nodes.map(n => ({ 
        ...n, 
        visited: false, 
        distance: distances[n.id], 
        parent: null 
      })),
      edges: edges,
      explanation: `Starting Dijkstra's algorithm from ${startNode.label}. Initial distances set.`,
      current: startNode.id
    });
    
    while (visited.size < nodes.length) {
      // Find unvisited node with minimum distance
      let minNode = null;
      let minDistance = Infinity;
      
      nodes.forEach(node => {
        if (!visited.has(node.id) && distances[node.id] < minDistance) {
          minDistance = distances[node.id];
          minNode = node;
        }
      });
      
      if (!minNode) break;
      
      visited.add(minNode.id);
      
      const updatedNodes = nodes.map(n => ({
        ...n,
        visited: visited.has(n.id),
        distance: distances[n.id],
        parent: n.parent
      }));
      
      steps.push({
        nodes: updatedNodes,
        edges: edges,
        explanation: `Visiting ${minNode.label} (distance: ${distances[minNode.id]}). Updating neighbor distances.`,
        current: minNode.id
      });
      
      // Update distances to neighbors
      edges
        .filter(edge => edge.from === minNode.id || edge.to === minNode.id)
        .forEach(edge => {
          const neighborId = edge.from === minNode.id ? edge.to : edge.from;
          const newDistance = distances[minNode.id] + edge.weight;
          
          if (newDistance < distances[neighborId]) {
            distances[neighborId] = newDistance;
            const neighbor = nodes.find(n => n.id === neighborId);
            neighbor.parent = minNode.id;
          }
        });
    }
    
    setGraphSteps(steps);
    setCurrentGraphStep(0);
    setIsGraphPlaying(false);
  };

  const playGraphAnimation = () => {
    if (currentGraphStep < graphSteps.length - 1) {
      setIsGraphPlaying(true);
      const interval = setInterval(() => {
        setCurrentGraphStep(prev => {
          if (prev >= graphSteps.length - 1) {
            setIsGraphPlaying(false);
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const handleDataStructureSelect = (dataStructure) => {
    setSelectedDataStructure(dataStructure);
    setOperationInput('');
    setOperationResult('');
    setOperationHistory([]);
  };

  // Binary Tree Operations
  const insertBinaryTreeNode = () => {
    if (!operationInput.trim()) return;
    const value = parseInt(operationInput);
    if (isNaN(value)) {
      setOperationResult('Please enter a valid number');
      return;
    }
    
    // Generate step-by-step visualization
    const steps = [];
    const currentTree = [...binaryTreeData];
    
    // Step 1: Show current tree state
    steps.push({
      data: [...currentTree],
      explanation: `Step 1: 📋 Current Binary Tree State\nWe have ${currentTree.length} nodes in the tree.`,
      operation: 'start',
      highlight: []
    });
    
    // Step 2: Show the new value to insert
    steps.push({
      data: [...currentTree],
      explanation: `Step 2: ➕ Preparing to insert new node with value ${value}\nThis value will be added to the tree.`,
      operation: 'prepare',
      highlight: [],
      newValue: value
    });
    
    // Step 3: Insert the new node
    const newNode = { value, left: null, right: null };
    currentTree.push(newNode);
    steps.push({
      data: [...currentTree],
      explanation: `Step 3: ✨ Successfully inserted node with value ${value}\nThe new node has been added to the tree.`,
      operation: 'insert',
      highlight: [currentTree.length - 1],
      newValue: value
    });
    
    // Step 4: Show final tree state
    steps.push({
      data: [...currentTree],
      explanation: `Step 4: 🎯 Final Tree State\nTree now contains ${currentTree.length} nodes: ${currentTree.map(n => n.value).join(', ')}`,
      operation: 'complete',
      highlight: [],
      newValue: value
    });
    
    // Set up step-by-step visualization
    setStepDataStates(steps);
    setDsTotalSteps(steps.length);
    setDsCurrentStep(0);
    setDsIsPlaying(false);
    setStepExplanations(steps.map(step => step.explanation));
    setCurrentDataState(steps[0]);
    
    // Update the actual data
    setBinaryTreeData([...currentTree]);
    setOperationHistory(prev => [...prev, `Inserted node with value ${value}`]);
    setOperationResult(`Successfully inserted node with value ${value}`);
    setOperationInput('');
  };

  const searchBinaryTreeNode = () => {
    if (!operationInput.trim()) return;
    const value = parseInt(operationInput);
    if (isNaN(value)) {
      setOperationResult('Please enter a valid number');
      return;
    }
    
    // Generate step-by-step visualization
    const steps = [];
    const currentTree = [...binaryTreeData];
    
    // Step 1: Show current tree state
    steps.push({
      data: [...currentTree],
      explanation: `Step 1: 📋 Current Binary Tree State\nWe have ${currentTree.length} nodes in the tree.`,
      operation: 'start',
      highlight: []
    });
    
    // Step 2: Show search target
    steps.push({
      data: [...currentTree],
      explanation: `Step 2: 🔍 Searching for node with value ${value}\nWe'll check each node in the tree.`,
      operation: 'search-start',
      highlight: [],
      searchTarget: value
    });
    
    // Step 3: Show search process
    let found = false;
    let foundIndex = -1;
    
    for (let i = 0; i < currentTree.length; i++) {
      steps.push({
        data: [...currentTree],
        explanation: `Step ${3 + i}: 🔍 Checking node ${i + 1} with value ${currentTree[i].value}\n${currentTree[i].value === value ? '🎯 Target found!' : 'Not the target, continuing search...'}`,
        operation: 'search-check',
        highlight: [i],
        searchTarget: value,
        currentCheck: i
      });
      
      if (currentTree[i].value === value) {
        found = true;
        foundIndex = i;
        break;
      }
    }
    
    // Step 4: Show result
    if (found) {
      steps.push({
        data: [...currentTree],
        explanation: `Step ${3 + currentTree.length}: ✅ Search Complete!\nTarget value ${value} found at position ${foundIndex + 1} in the tree.`,
        operation: 'search-success',
        highlight: [foundIndex],
        searchTarget: value
      });
    } else {
      steps.push({
        data: [...currentTree],
        explanation: `Step ${3 + currentTree.length}: ❌ Search Complete!\nTarget value ${value} not found in the tree after checking all ${currentTree.length} nodes.`,
        operation: 'search-not-found',
        highlight: [],
        searchTarget: value
      });
    }
    
    // Set up step-by-step visualization
    setStepDataStates(steps);
    setDsTotalSteps(steps.length);
    setDsCurrentStep(0);
    setDsIsPlaying(false);
    setStepExplanations(steps.map(step => step.explanation));
    setCurrentDataState(steps[0]);
    
    // Update result
    if (found) {
      setOperationResult(`Found node with value ${value}`);
    } else {
      setOperationResult(`Node with value ${value} not found`);
    }
    
    setOperationHistory(prev => [...prev, `Searched for node with value ${value}`]);
    setOperationInput('');
  };

  const deleteBinaryTreeNode = () => {
    if (!operationInput.trim()) return;
    const value = parseInt(operationInput);
    if (isNaN(value)) {
      setOperationResult('Please enter a valid number');
      return;
    }
    
    // Generate step-by-step visualization
    const steps = [];
    const currentTree = [...binaryTreeData];
    
    // Step 1: Show current tree state
    steps.push({
      data: [...currentTree],
      explanation: `Step 1: 📋 Current Binary Tree State\nWe have ${currentTree.length} nodes in the tree.`,
      operation: 'start',
      highlight: []
    });
    
    // Step 2: Show delete target
    steps.push({
      data: [...currentTree],
      explanation: `Step 2: 🗑️ Preparing to delete node with value ${value}\nWe'll search for this value first.`,
      operation: 'delete-prepare',
      highlight: [],
      deleteTarget: value
    });
    
    // Step 3: Search for the node to delete
    let foundIndex = -1;
    for (let i = 0; i < currentTree.length; i++) {
      if (currentTree[i].value === value) {
        foundIndex = i;
        break;
      }
    }
    
    if (foundIndex !== -1) {
      steps.push({
        data: [...currentTree],
        explanation: `Step 3: 🔍 Found node with value ${value} at position ${foundIndex + 1}\nNow we'll remove it from the tree.`,
        operation: 'delete-found',
        highlight: [foundIndex],
        deleteTarget: value
      });
      
      // Step 4: Remove the node
      const newTree = currentTree.filter((_, index) => index !== foundIndex);
      steps.push({
        data: [...newTree],
        explanation: `Step 4: ✨ Successfully deleted node with value ${value}\nThe tree now contains ${newTree.length} nodes.`,
        operation: 'delete-success',
        highlight: [],
        deleteTarget: value
      });
      
      // Update the actual data
      setBinaryTreeData(newTree);
      setOperationResult(`Successfully deleted node with value ${value}`);
    } else {
      steps.push({
        data: [...currentTree],
        explanation: `Step 3: ❌ Node with value ${value} not found\nCannot delete a node that doesn't exist.`,
        operation: 'delete-not-found',
        highlight: [],
        deleteTarget: value
      });
      setOperationResult(`Node with value ${value} not found`);
    }
    
    // Set up step-by-step visualization
    setStepDataStates(steps);
    setDsTotalSteps(steps.length);
    setDsCurrentStep(0);
    setDsIsPlaying(false);
    setStepExplanations(steps.map(step => step.explanation));
    setCurrentDataState(steps[0]);
    
    setOperationHistory(prev => [...prev, `Attempted to delete node with value ${value}`]);
    setOperationInput('');
  };

  // Hash Table Operations
  const insertHashTableEntry = () => {
    if (!operationInput.trim()) return;
    const [key, value] = operationInput.split(':').map(s => s.trim());
    if (!key || !value) {
      setOperationResult('Please enter key:value format');
      return;
    }
    
    // Generate step-by-step visualization
    const steps = [];
    const currentTable = { ...hashTableData };
    
    // Step 1: Show current hash table state
    steps.push({
      data: { ...currentTable },
      explanation: `Step 1: 📊 Current Hash Table State\nWe have ${Object.keys(currentTable).length} key-value pairs.`,
      operation: 'start',
      highlight: []
    });
    
    // Step 2: Show the new entry to insert
    steps.push({
      data: { ...currentTable },
      explanation: `Step 2: ➕ Preparing to insert new entry\nKey: "${key}", Value: "${value}"`,
      operation: 'prepare',
      highlight: [],
      newKey: key,
      newValue: value
    });
    
    // Step 3: Insert the new entry
    currentTable[key] = value;
    steps.push({
      data: { ...currentTable },
      explanation: `Step 3: ✨ Successfully inserted entry\nKey: "${key}" → Value: "${value}"\nHash table now contains ${Object.keys(currentTable).length} entries.`,
      operation: 'insert',
      highlight: [key],
      newKey: key,
      newValue: value
    });
    
    // Set up step-by-step visualization
    setStepDataStates(steps);
    setDsTotalSteps(steps.length);
    setDsCurrentStep(0);
    setDsIsPlaying(false);
    setStepExplanations(steps.map(step => step.explanation));
    setCurrentDataState(steps[0]);
    
    // Update the actual data
    setHashTableData(currentTable);
    setOperationHistory(prev => [...prev, `Inserted key: ${key}, value: ${value}`]);
    setOperationResult(`Successfully inserted key: ${key}, value: ${value}`);
    setOperationInput('');
  };

  const getHashTableValue = () => {
    if (!operationInput.trim()) return;
    const key = operationInput.trim();
    
    const value = hashTableData[key];
    if (value !== undefined) {
      setOperationResult(`Value for key "${key}": ${value}`);
    } else {
      setOperationResult(`Key "${key}" not found`);
    }
    
    setOperationHistory(prev => [...prev, `Retrieved value for key: ${key}`]);
    setOperationInput('');
  };

  const removeHashTableKey = () => {
    if (!operationInput.trim()) return;
    const key = operationInput.trim();
    
    if (hashTableData[key] !== undefined) {
      const newData = { ...hashTableData };
      delete newData[key];
      setHashTableData(newData);
      setOperationResult(`Successfully removed key: ${key}`);
    } else {
      setOperationResult(`Key "${key}" not found`);
    }
    
    setOperationHistory(prev => [...prev, `Attempted to remove key: ${key}`]);
    setOperationInput('');
  };

  // Heap Operations
  const insertHeapElement = () => {
    if (!operationInput.trim()) return;
    const value = parseInt(operationInput);
    if (isNaN(value)) {
      setOperationResult('Please enter a valid number');
      return;
    }
    
    // Generate step-by-step visualization
    const steps = [];
    const currentHeap = [...heapData];
    
    // Step 1: Show current heap state
    steps.push({
      data: [...currentHeap],
      explanation: `Step 1: 📚 Current Max Heap State\nWe have ${currentHeap.length} elements in the heap.`,
      operation: 'start',
      highlight: []
    });
    
    // Step 2: Show the new element to insert
    steps.push({
      data: [...currentHeap],
      explanation: `Step 2: ➕ Preparing to insert new element: ${value}\nThis element will be added to the heap.`,
      operation: 'prepare',
      highlight: [],
      newValue: value
    });
    
    // Step 3: Add element to heap
    const newHeap = [...currentHeap, value];
    steps.push({
      data: [...newHeap],
      explanation: `Step 3: ✨ Added element ${value} to the heap\nHeap now contains ${newHeap.length} elements.`,
      operation: 'add',
      highlight: [newHeap.length - 1],
      newValue: value
    });
    
    // Step 4: Heapify (maintain max heap property)
    const sortedHeap = [...newHeap].sort((a, b) => b - a);
    steps.push({
      data: [...sortedHeap],
      explanation: `Step 4: 🔄 Heapified the heap\nElements are now arranged to maintain max heap property.\nMax element: ${sortedHeap[0]}`,
      operation: 'heapify',
      highlight: [0],
      newValue: value
    });
    
    // Set up step-by-step visualization
    setStepDataStates(steps);
    setDsTotalSteps(steps.length);
    setDsCurrentStep(0);
    setDsIsPlaying(false);
    setStepExplanations(steps.map(step => step.explanation));
    setCurrentDataState(steps[0]);
    
    // Update the actual data
    setHeapData(sortedHeap);
    setOperationHistory(prev => [...prev, `Inserted element: ${value}`]);
    setOperationResult(`Successfully inserted element: ${value}`);
    setOperationInput('');
  };

  const extractHeapMax = () => {
    if (heapData.length === 0) {
      setOperationResult('Heap is empty');
      return;
    }
    
    const max = heapData[0];
    const newHeap = heapData.slice(1).sort((a, b) => b - a);
    setHeapData(newHeap);
    setOperationHistory(prev => [...prev, `Extracted max element: ${max}`]);
    setOperationResult(`Extracted max element: ${max}`);
  };

  const heapifyHeap = () => {
    if (heapData.length === 0) {
      setOperationResult('Heap is empty');
      return;
    }
    
    const sorted = [...heapData].sort((a, b) => b - a);
    setHeapData(sorted);
    setOperationHistory(prev => [...prev, 'Heapified the heap']);
    setOperationResult('Heap has been heapified');
  };

  // Linked List Operations
  const addLinkedListNode = () => {
    if (!operationInput.trim()) return;
    const value = operationInput.trim();
    
    // Generate step-by-step visualization
    const steps = [];
    const currentList = [...linkedListData];
    
    // Step 1: Show current linked list state
    steps.push({
      data: [...currentList],
      explanation: `Step 1: 🔗 Current Linked List State\nWe have ${currentList.length} nodes in the list.`,
      operation: 'start',
      highlight: []
    });
    
    // Step 2: Show the new node to add
    steps.push({
      data: [...currentList],
      explanation: `Step 2: ➕ Preparing to add new node with value: "${value}"\nThis node will be added to the end of the list.`,
      operation: 'prepare',
      highlight: [],
      newValue: value
    });
    
    // Step 3: Add the new node
    const newList = [...currentList, value];
    steps.push({
      data: [...newList],
      explanation: `Step 3: ✨ Successfully added node "${value}"\nLinked list now contains ${newList.length} nodes.\nList: ${newList.join(' → ')}`,
      operation: 'add',
      highlight: [newList.length - 1],
      newValue: value
    });
    
    // Set up step-by-step visualization
    setStepDataStates(steps);
    setDsTotalSteps(steps.length);
    setDsCurrentStep(0);
    setDsIsPlaying(false);
    setStepExplanations(steps.map(step => step.explanation));
    setCurrentDataState(steps[0]);
    
    // Update the actual data
    setLinkedListData(newList);
    setOperationHistory(prev => [...prev, `Added node: ${value}`]);
    setOperationResult(`Successfully added node: ${value}`);
    setOperationInput('');
  };

  const findLinkedListNode = () => {
    if (!operationInput.trim()) return;
    const value = operationInput.trim();
    
    const index = linkedListData.findIndex(node => node === value);
    if (index !== -1) {
      setOperationResult(`Found "${value}" at position ${index}`);
    } else {
      setOperationResult(`"${value}" not found in linked list`);
    }
    
    setOperationHistory(prev => [...prev, `Searched for: ${value}`]);
    setOperationInput('');
  };

  const removeLinkedListNode = () => {
    if (!operationInput.trim()) return;
    const value = operationInput.trim();
    
    const index = linkedListData.findIndex(node => node === value);
    if (index !== -1) {
      const newList = linkedListData.filter((_, i) => i !== index);
      setLinkedListData(newList);
      setOperationResult(`Successfully removed "${value}"`);
    } else {
      setOperationResult(`"${value}" not found in linked list`);
    }
    
    setOperationHistory(prev => [...prev, `Attempted to remove: ${value}`]);
    setOperationInput('');
  };

  // Queue Operations
  const enqueueElement = () => {
    if (!operationInput.trim()) return;
    const value = operationInput.trim();
    
    // Generate step-by-step visualization
    const steps = [];
    const currentQueue = [...queueData];
    
    // Step 1: Show current queue state
    steps.push({
      data: [...currentQueue],
      explanation: `Step 1: 📋 Current Queue State (FIFO)\nWe have ${currentQueue.length} elements in the queue.`,
      operation: 'start',
      highlight: []
    });
    
    // Step 2: Show the new element to enqueue
    steps.push({
      data: [...currentQueue],
      explanation: `Step 2: ➕ Preparing to enqueue element: "${value}"\nThis element will be added to the back of the queue.`,
      operation: 'prepare',
      highlight: [],
      newValue: value
    });
    
    // Step 3: Enqueue the element
    const newQueue = [...currentQueue, value];
    steps.push({
      data: [...newQueue],
      explanation: `Step 3: ✨ Successfully enqueued "${value}"\nQueue now contains ${newQueue.length} elements.\nFront: ${newQueue[0]}, Back: ${newQueue[newQueue.length - 1]}`,
      operation: 'enqueue',
      highlight: [newQueue.length - 1],
      newValue: value
    });
    
    // Set up step-by-step visualization
    setStepDataStates(steps);
    setDsTotalSteps(steps.length);
    setDsCurrentStep(0);
    setDsIsPlaying(false);
    setStepExplanations(steps.map(step => step.explanation));
    setCurrentDataState(steps[0]);
    
    // Update the actual data
    setQueueData(newQueue);
    setOperationHistory(prev => [...prev, `Enqueued: ${value}`]);
    setOperationResult(`Successfully enqueued: ${value}`);
    setOperationInput('');
  };

  const dequeueElement = () => {
    if (queueData.length === 0) {
      setOperationResult('Queue is empty');
      return;
    }
    
    const [first, ...rest] = queueData;
    setQueueData(rest);
    setOperationHistory(prev => [...prev, `Dequeued: ${first}`]);
    setOperationResult(`Dequeued: ${first}`);
  };

  const peekQueue = () => {
    if (queueData.length === 0) {
      setOperationResult('Queue is empty');
      return;
    }
    
    const first = queueData[0];
    setOperationHistory(prev => [...prev, `Peeked: ${first}`]);
    setOperationResult(`Front of queue: ${first}`);
  };

  // Stack Operations
  const pushStackElement = () => {
    if (!operationInput.trim()) return;
    const value = operationInput.trim();
    
    // Generate step-by-step visualization
    const steps = [];
    const currentStack = [...stackData];
    
    // Step 1: Show current stack state
    steps.push({
      data: [...currentStack],
      explanation: `Step 1: 📚 Current Stack State (LIFO)\nWe have ${currentStack.length} elements in the stack.`,
      operation: 'start',
      highlight: []
    });
    
    // Step 2: Show the new element to push
    steps.push({
      data: [...currentStack],
      explanation: `Step 2: ➕ Preparing to push element: "${value}"\nThis element will be added to the top of the stack.`,
      operation: 'prepare',
      highlight: [],
      newValue: value
    });
    
    // Step 3: Push the element
    const newStack = [...currentStack, value];
    steps.push({
      data: [...newStack],
      explanation: `Step 3: ✨ Successfully pushed "${value}"\nStack now contains ${newStack.length} elements.\nTop of stack: ${newStack[newStack.length - 1]}`,
      operation: 'push',
      highlight: [newStack.length - 1],
      newValue: value
    });
    
    // Set up step-by-step visualization
    setStepDataStates(steps);
    setDsTotalSteps(steps.length);
    setDsCurrentStep(0);
    setDsIsPlaying(false);
    setStepExplanations(steps.map(step => step.explanation));
    setCurrentDataState(steps[0]);
    
    // Update the actual data
    setStackData(newStack);
    setOperationHistory(prev => [...prev, `Pushed: ${value}`]);
    setOperationResult(`Successfully pushed: ${value}`);
    setOperationInput('');
  };

  const popStackElement = () => {
    if (stackData.length === 0) {
      setOperationResult('Stack is empty');
      return;
    }
    
    const last = stackData[stackData.length - 1];
    const newStack = stackData.slice(0, -1);
    setStackData(newStack);
    setOperationHistory(prev => [...prev, `Popped: ${last}`]);
    setOperationResult(`Popped: ${last}`);
  };

  const peekStack = () => {
    if (stackData.length === 0) {
      setOperationResult('Stack is empty');
      return;
    }
    
    const top = stackData[stackData.length - 1];
    setOperationHistory(prev => [...prev, `Peeked: ${top}`]);
    setOperationResult(`Top of stack: ${top}`);
  };

  // Trie Operations
  const insertTrieWord = () => {
    if (!operationInput.trim()) return;
    const word = operationInput.trim().toLowerCase();
    
    // Generate step-by-step visualization
    const steps = [];
    const currentTrie = { ...trieData };
    
    // Step 1: Show current trie state
    steps.push({
      data: { ...currentTrie },
      explanation: `Step 1: 🌐 Current Trie State\nWe have ${Object.keys(currentTrie).length} words in the trie.`,
      operation: 'start',
      highlight: []
    });
    
    // Step 2: Show the new word to insert
    steps.push({
      data: { ...currentTrie },
      explanation: `Step 2: ➕ Preparing to insert new word: "${word}"\nThis word will be added to the trie.`,
      operation: 'prepare',
      highlight: [],
      newWord: word
    });
    
    // Step 3: Insert the word
    const newTrie = { ...currentTrie, [word]: true };
    steps.push({
      data: { ...newTrie },
      explanation: `Step 3: ✨ Successfully inserted word "${word}"\nTrie now contains ${Object.keys(newTrie).length} words.\nWords: ${Object.keys(newTrie).join(', ')}`,
      operation: 'insert',
      highlight: [word],
      newWord: word
    });
    
    // Set up step-by-step visualization
    setStepDataStates(steps);
    setDsTotalSteps(steps.length);
    setDsCurrentStep(0);
    setDsIsPlaying(false);
    setStepExplanations(steps.map(step => step.explanation));
    setCurrentDataState(steps[0]);
    
    // Update the actual data
    setTrieData(newTrie);
    setOperationHistory(prev => [...prev, `Inserted word: ${word}`]);
    setOperationResult(`Successfully inserted word: ${word}`);
    setOperationInput('');
  };

  const searchTrieWord = () => {
    if (!operationInput.trim()) return;
    const word = operationInput.trim().toLowerCase();
    
    const found = trieData[word];
    if (found) {
      setOperationResult(`Found word: ${word}`);
    } else {
      setOperationResult(`Word "${word}" not found`);
    }
    
    setOperationHistory(prev => [...prev, `Searched for: ${word}`]);
    setOperationInput('');
  };

  const deleteTrieWord = () => {
    if (!operationInput.trim()) return;
    const word = operationInput.trim().toLowerCase();
    
    if (trieData[word]) {
      const newData = { ...trieData };
      delete newData[word];
      setTrieData(newData);
      setOperationResult(`Successfully deleted word: ${word}`);
    } else {
      setOperationResult(`Word "${word}" not found`);
    }
    
    setOperationHistory(prev => [...prev, `Attempted to delete: ${word}`]);
    setOperationInput('');
  };

  // Data Structure Step-by-Step Control Functions
  const dsPlay = () => {
    if (dsCurrentStep < dsTotalSteps - 1) {
      setDsIsPlaying(true);
      const interval = setInterval(() => {
        setDsCurrentStep(prev => {
          if (prev >= dsTotalSteps - 1) {
            setDsIsPlaying(false);
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, dsPlaybackSpeed);
      setDsIntervalRef(interval);
    }
  };

  const dsPause = () => {
    setDsIsPlaying(false);
    if (dsIntervalRef) {
      clearInterval(dsIntervalRef);
      setDsIntervalRef(null);
    }
  };

  const dsStop = () => {
    setDsIsPlaying(false);
    if (dsIntervalRef) {
      clearInterval(dsIntervalRef);
      setDsIntervalRef(null);
    }
    setDsCurrentStep(0);
  };

  const dsNextStep = () => {
    if (dsCurrentStep < dsTotalSteps - 1) {
      setDsCurrentStep(prev => prev + 1);
    }
  };

  const dsPrevStep = () => {
    if (dsCurrentStep > 0) {
      setDsCurrentStep(prev => prev - 1);
    }
  };

  const dsGoToStep = (step) => {
    setDsCurrentStep(step);
  };

  // Update current data state when step changes
  useEffect(() => {
    if (stepDataStates.length > 0 && dsCurrentStep < stepDataStates.length) {
      setCurrentDataState(stepDataStates[dsCurrentStep]);
    }
  }, [dsCurrentStep, stepDataStates]);

  // Enhanced sorting algorithms with detailed steps
  const generateBubbleSortSteps = (arr) => {
    const steps = [];
    const array = [...arr];
    let stepCount = 0;
    
    for (let i = 0; i < array.length - 1; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        // Comparison step
        steps.push({
          array: [...array],
          explanation: `Step ${stepCount + 1}: 🫧 Comparing elements at positions ${j} and ${j + 1}. 
          Current values: ${array[j]} and ${array[j + 1]}. 
          ${array[j] > array[j + 1] ? 'They are in wrong order, will swap! 🔄' : 'They are in correct order, no swap needed! ✅'}`,
          highlighted: [j, j + 1],
          animation: 'bubble'
        });
        stepCount++;
        
        if (array[j] > array[j + 1]) {
          // Swap step
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          steps.push({
            array: [...array],
            explanation: `Step ${stepCount + 1}: 🔄 Swapping ${array[j + 1]} and ${array[j]}. 
            The larger element bubbles up to its correct position! 🫧`,
            highlighted: [j, j + 1],
            animation: 'swap'
          });
          stepCount++;
        }
      }
    }
    
    return steps;
  };

  const generateQuickSortSteps = (arr) => {
    const steps = [];
    const array = [...arr];
    let stepCount = 0;
    
    const partition = (low, high) => {
      const pivot = array[high];
      
      steps.push({
        array: [...array],
        explanation: `Step ${stepCount + 1}: 🎯 Starting partition with pivot ${pivot} at position ${high}. 
        We'll place all elements smaller than ${pivot} to the left!`,
        highlighted: [high],
        animation: 'pivot'
      });
      stepCount++;
      
      let i = low - 1;
      
      for (let j = low; j < high; j++) {
        steps.push({
          array: [...array],
          explanation: `Step ${stepCount + 1}: 🔍 Comparing element ${array[j]} with pivot ${pivot}. 
          ${array[j] < pivot ? 'Element is smaller, will move to left partition! ⬅️' : 'Element is larger, stays in right partition! ➡️'}`,
          highlighted: [j, high],
          animation: 'compare'
        });
        stepCount++;
        
        if (array[j] < pivot) {
          i++;
          [array[i], array[j]] = [array[j], array[i]];
          steps.push({
            array: [...array],
            explanation: `Step ${stepCount + 1}: 🔄 Swapping ${array[j]} to position ${i} in left partition.`,
            highlighted: [i, j],
            animation: 'swap'
          });
          stepCount++;
        }
      }
      
      [array[i + 1], array[high]] = [array[high], array[i + 1]];
      steps.push({
        array: [...array],
        explanation: `Step ${stepCount + 1}: 🎯 Placing pivot ${pivot} in its final position ${i + 1}. 
        All elements to the left are smaller, all to the right are larger! ✨`,
        highlighted: [i + 1, high],
        animation: 'pivot-place'
      });
      stepCount++;
      
      return i + 1;
    };
    
    const quickSortHelper = (low, high) => {
      if (low < high) {
        const pi = partition(low, high);
        quickSortHelper(low, pi - 1);
        quickSortHelper(pi + 1, high);
      }
    };
    
    quickSortHelper(0, array.length - 1);
    return steps;
  };

  const generateMergeSortSteps = (arr) => {
    const steps = [];
    const array = [...arr];
    let stepCount = 0;
    
    const merge = (left, mid, right) => {
      steps.push({
        array: [...array],
        explanation: `Step ${stepCount + 1}: 🔀 Merging two sorted subarrays from positions ${left} to ${mid} and ${mid + 1} to ${right}. 
        We'll combine them into one sorted array! 🎯`,
        highlighted: Array.from({ length: right - left + 1 }, (_, i) => left + i),
        animation: 'merge-start'
      });
      stepCount++;
      
      const leftArray = array.slice(left, mid + 1);
      const rightArray = array.slice(mid + 1, right + 1);
      
      let i = 0, j = 0, k = left;
      
      while (i < leftArray.length && j < rightArray.length) {
        steps.push({
          array: [...array],
          explanation: `Step ${stepCount + 1}: 🔍 Comparing ${leftArray[i]} from left subarray with ${rightArray[j]} from right subarray. 
          Taking the smaller element! ⬇️`,
          highlighted: [left + i, mid + 1 + j],
          animation: 'merge-compare'
        });
        stepCount++;
        
        if (leftArray[i] <= rightArray[j]) {
          array[k] = leftArray[i];
          i++;
        } else {
          array[k] = rightArray[j];
          j++;
        }
        
        steps.push({
          array: [...array],
          explanation: `Step ${stepCount + 1}: ✨ Placed ${array[k]} in position ${k}. 
          Continuing to merge remaining elements! 🔄`,
          highlighted: [k],
          animation: 'merge-place'
        });
        stepCount++;
        k++;
      }
      
      // Add remaining elements
      while (i < leftArray.length) {
        array[k] = leftArray[i];
        steps.push({
          array: [...array],
          explanation: `Step ${stepCount + 1}: ➡️ Adding remaining element ${leftArray[i]} from left subarray.`,
          highlighted: [k],
          animation: 'merge-remaining'
        });
        stepCount++;
        i++;
        k++;
      }
      
      while (j < rightArray.length) {
        array[k] = rightArray[j];
        steps.push({
          array: [...array],
          explanation: `Step ${stepCount + 1}: ➡️ Adding remaining element ${rightArray[j]} from right subarray.`,
          highlighted: [k],
          animation: 'merge-remaining'
        });
        stepCount++;
        j++;
        k++;
      }
    };
    
    const mergeSortHelper = (left, right) => {
      if (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        steps.push({
          array: [...array],
          explanation: `Step ${stepCount + 1}: ✂️ Dividing array from position ${left} to ${right} at midpoint ${mid}. 
          We'll sort the left half (${left} to ${mid}) and right half (${mid + 1} to ${right}) separately! 🔄`,
          highlighted: [left, mid, right],
          animation: 'divide'
        });
        stepCount++;
        
        mergeSortHelper(left, mid);
        mergeSortHelper(mid + 1, right);
        merge(left, mid, right);
      }
    };
    
    mergeSortHelper(0, array.length - 1);
    return steps;
  };

  const generateInsertionSortSteps = (arr) => {
    const steps = [];
    const array = [...arr];
    let stepCount = 0;
    
    for (let i = 1; i < array.length; i++) {
      const key = array[i];
      
      steps.push({
        array: [...array],
        explanation: `Step ${stepCount + 1}: 📥 Starting with element ${key} at position ${i}. 
        We'll insert it into the correct position in the sorted subarray to the left.`,
        highlighted: [i],
        animation: 'insertion-start'
      });
      stepCount++;
      
      let j = i - 1;
      
      while (j >= 0 && array[j] > key) {
        steps.push({
          array: [...array],
          explanation: `Step ${stepCount + 1}: 🔍 Comparing ${key} with ${array[j]} at position ${j}. 
          ${array[j]} is larger, so we shift it one position to the right.`,
          highlighted: [j, j + 1],
          animation: 'insertion-shift'
        });
        stepCount++;
        
        array[j + 1] = array[j];
        j--;
      }
      
      array[j + 1] = key;
      steps.push({
        array: [...array],
        explanation: `Step ${stepCount + 1}: ✨ Inserting ${key} into its correct position ${j + 1}. 
        The sorted subarray now includes elements from position 0 to ${i}.`,
        highlighted: [j + 1],
        animation: 'insertion-place'
      });
      stepCount++;
    }
    
    return steps;
  };

  const generateSelectionSortSteps = (arr) => {
    const steps = [];
    const array = [...arr];
    let stepCount = 0;
    
    for (let i = 0; i < array.length - 1; i++) {
      let minIndex = i;
      
      steps.push({
        array: [...array],
        explanation: `Step ${stepCount + 1}: 🎯 Starting pass ${i + 1}. 
        We'll find the minimum element in the unsorted portion (positions ${i} to ${array.length - 1}).`,
        highlighted: [i],
        animation: 'selection-start'
      });
      stepCount++;
      
      for (let j = i + 1; j < array.length; j++) {
        steps.push({
          array: [...array],
          explanation: `Step ${stepCount + 1}: 🔍 Comparing current minimum ${array[minIndex]} with ${array[j]}. 
          ${array[j] < array[minIndex] ? 'Found a smaller element, updating minimum.' : 'Current minimum is still smaller.'}`,
          highlighted: [minIndex, j],
          animation: 'selection-compare'
        });
        stepCount++;
        
        if (array[j] < array[minIndex]) {
          minIndex = j;
        }
      }
      
      if (minIndex !== i) {
        [array[i], array[minIndex]] = [array[minIndex], array[i]];
        steps.push({
          array: [...array],
          explanation: `Step ${stepCount + 1}: 🔄 Swapping minimum element ${array[i]} to position ${i}. 
          Position ${i} is now sorted.`,
          highlighted: [i, minIndex],
          animation: 'selection-swap'
        });
        stepCount++;
      }
    }
    
    return steps;
  };

  const generateHeapSortSteps = (arr) => {
    const steps = [];
    const array = [...arr];
    let stepCount = 0;
    
    const heapify = (n, i) => {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      
      if (left < n) {
        steps.push({
          array: [...array],
          explanation: `Step ${stepCount + 1}: 🔍 Comparing parent ${array[i]} with left child ${array[left]}.`,
          highlighted: [i, left],
          animation: 'heap-compare'
        });
        stepCount++;
        
        if (array[left] > array[largest]) {
          largest = left;
        }
      }
      
      if (right < n) {
        steps.push({
          array: [...array],
          explanation: `Step ${stepCount + 1}: 🔍 Comparing current largest ${array[largest]} with right child ${array[right]}.`,
          highlighted: [largest, right],
          animation: 'heap-compare'
        });
        stepCount++;
        
        if (array[right] > array[largest]) {
          largest = right;
        }
      }
      
      if (largest !== i) {
        [array[i], array[largest]] = [array[largest], array[i]];
        steps.push({
          array: [...array],
          explanation: `Step ${stepCount + 1}: 🔄 Swapping ${array[i]} with ${array[largest]} to maintain heap property.`,
          highlighted: [i, largest],
          animation: 'heap-swap'
        });
        stepCount++;
        
        heapify(n, largest);
      }
    };
    
    // Build max heap
    for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
      steps.push({
        array: [...array],
        explanation: `Step ${stepCount + 1}: 🌳 Building max heap - heapifying subtree rooted at position ${i}.`,
        highlighted: [i],
        animation: 'heap-build'
      });
      stepCount++;
      
      heapify(array.length, i);
    }
    
    // Extract elements from heap
    for (let i = array.length - 1; i > 0; i--) {
      [array[0], array[i]] = [array[i], array[0]];
      steps.push({
        array: [...array],
        explanation: `Step ${stepCount + 1}: 🎯 Moving root (maximum element) ${array[i]} to position ${i}. 
        This element is now in its final sorted position.`,
        highlighted: [0, i],
        animation: 'heap-extract'
      });
      stepCount++;
      
      heapify(i, 0);
    }
    
    return steps;
  };

  const generateLinearSearchSteps = (arr, target) => {
    const steps = [];
    const array = [...arr];
    let stepCount = 0;
    
    steps.push({
      array: [...array],
      explanation: `Step ${stepCount + 1}: 🔍 Starting Linear Search for target ${target}. 
      We'll check each element from left to right until we find the target.`,
      highlighted: [],
      animation: 'search-start'
    });
    stepCount++;
    
    for (let i = 0; i < array.length; i++) {
      steps.push({
        array: [...array],
        explanation: `Step ${stepCount + 1}: 🔍 Checking element at position ${i}: ${array[i]}. 
        ${array[i] === target ? 'Target found! 🎯' : 'Not the target, moving to next element.'}`,
        highlighted: [i],
        animation: array[i] === target ? 'search-found' : 'search-check'
      });
      stepCount++;
      
      if (array[i] === target) {
        steps.push({
          array: [...array],
          explanation: `Step ${stepCount + 1}: ✅ Success! Target ${target} found at position ${i}. 
          Linear Search completed in ${i + 1} comparisons.`,
          highlighted: [i],
          animation: 'search-success'
        });
        stepCount++;
        break;
      }
    }
    
    if (!array.includes(target)) {
      steps.push({
        array: [...array],
        explanation: `Step ${stepCount + 1}: ❌ Target ${target} not found in the array. 
        Linear Search checked all ${array.length} elements.`,
        highlighted: [],
        animation: 'search-not-found'
      });
    }
    
    return steps;
  };

  const generateBinarySearchSteps = (arr, target) => {
    const steps = [];
    const array = [...arr].sort((a, b) => a - b);
    let stepCount = 0;
    
    steps.push({
      array: [...array],
      explanation: `Step ${stepCount + 1}: 🔍 Starting Binary Search for target ${target}. 
      Array must be sorted: [${array.join(', ')}].`,
      highlighted: [],
      animation: 'search-start'
    });
    stepCount++;
    
    let left = 0;
    let right = array.length - 1;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      steps.push({
        array: [...array],
        explanation: `Step ${stepCount + 1}: 🎯 Checking middle element at position ${mid}: ${array[mid]}. 
        Left: ${left}, Right: ${right}, Mid: ${mid}`,
        highlighted: [mid],
        animation: 'search-check'
      });
      stepCount++;
      
      if (array[mid] === target) {
        steps.push({
          array: [...array],
          explanation: `Step ${stepCount + 1}: ✅ Success! Target ${target} found at position ${mid}. 
          Binary Search completed in ${stepCount} steps.`,
          highlighted: [mid],
          animation: 'search-success'
        });
        stepCount++;
        return steps;
      } else if (array[mid] < target) {
        steps.push({
          array: [...array],
          explanation: `Step ${stepCount + 1}: ➡️ Target ${target} is greater than ${array[mid]}. 
          Moving right: left = ${mid + 1}, right = ${right}`,
          highlighted: [mid],
          animation: 'search-right'
        });
        stepCount++;
        left = mid + 1;
      } else {
        steps.push({
          array: [...array],
          explanation: `Step ${stepCount + 1}: ⬅️ Target ${target} is less than ${array[mid]}. 
          Moving left: left = ${left}, right = ${mid - 1}`,
          highlighted: [mid],
          animation: 'search-left'
        });
        stepCount++;
        right = mid - 1;
      }
    }
    
    steps.push({
      array: [...array],
      explanation: `Step ${stepCount + 1}: ❌ Target ${target} not found in the array. 
      Binary Search completed in ${stepCount} steps.`,
      highlighted: [],
      animation: 'search-not-found'
    });
    
    return steps;
  };

  const runSearchAlgorithm = async (algorithmName) => {
    if (isSearching) return;
    
    setIsSearching(true);
    setSelectedSearchAlgorithm(algorithmName);
    setCurrentStep(0);
    setIsPlaying(false);
    setIsPaused(false);
    
    const array = parseArray();
    const target = parseInt(searchTarget);
    
    if (array.length === 0 || isNaN(target)) {
      setIsSearching(false);
      return;
    }
    
    let newSteps = [];
    
    switch (algorithmName) {
      case 'Linear Search':
        newSteps = generateLinearSearchSteps(array, target);
        break;
      case 'Binary Search':
        newSteps = generateBinarySearchSteps(array, target);
        break;
      default:
        setIsSearching(false);
        return;
    }
    
    setSteps(newSteps);
    setTotalSteps(newSteps.length);
    setCurrentArray(newSteps[0]?.array || array);
    setExplanation(newSteps[0]?.explanation || '');
    setIsSearching(false);
  };

  const runSortingAlgorithm = async (algorithmName) => {
    if (isSorting) return;
    
    setIsSorting(true);
    setSelectedAlgorithm(algorithmName);
    setCurrentStep(0);
    setIsPlaying(false);
    setIsPaused(false);
    
    const array = parseArray();
    if (array.length === 0) {
      setIsSorting(false);
      return;
    }
    
    let newSteps = [];
    
    switch (algorithmName) {
      case 'Bubble Sort':
        newSteps = generateBubbleSortSteps(array);
        break;
      case 'Quick Sort':
        newSteps = generateQuickSortSteps(array);
        break;
      case 'Merge Sort':
        newSteps = generateMergeSortSteps(array);
        break;
      case 'Insertion Sort':
        newSteps = generateInsertionSortSteps(array);
        break;
      case 'Selection Sort':
        newSteps = generateSelectionSortSteps(array);
        break;
      case 'Heap Sort':
        newSteps = generateHeapSortSteps(array);
        break;
      default:
        setIsSorting(false);
        return;
    }
    
    setSteps(newSteps);
    setTotalSteps(newSteps.length);
    setCurrentArray(newSteps[0]?.array || array);
    setExplanation(newSteps[0]?.explanation || '');
    setIsSorting(false);
  };

  const play = () => {
    if (currentStep < steps.length - 1) {
      setIsPlaying(true);
      setIsPaused(false);
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            clearInterval(intervalRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, animationSpeed);
    }
  };

  const pause = () => {
    setIsPlaying(false);
    setIsPaused(true);
    clearInterval(intervalRef.current);
  };

  const stop = () => {
    setIsPlaying(false);
    setIsPaused(false);
    clearInterval(intervalRef.current);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length) {
      setCurrentArray(steps[currentStep]?.array || []);
      setExplanation(steps[currentStep]?.explanation || '');
    }
  }, [currentStep, steps]);

  const renderWelcomeSection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-5xl font-bold mb-6 text-[#ff4e88]">
          Welcome to the Magical World of Algorithms! ✨
        </h2>
        <p className="text-[#4a4a4a] text-xl leading-relaxed max-w-4xl mx-auto">
          🌟 Experience algorithms like never before with our adorable interactive visualizations! 
          Watch complex algorithms come to life with cute animations and step-by-step explanations.
        </p>
      </div>
      
      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          className="group bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
          onClick={() => setActiveSection('sorting')}
        >
          <div className="text-5xl mb-4 animate-bounce">🫧</div>
          <h3 className="font-bold text-[#ff4e88] mb-3 text-xl">Sorting Algorithms</h3>
          <p className="text-[#4a4a4a] text-sm leading-relaxed">
            8 magical sorting algorithms including Bubble, Quick, Merge, and more with adorable animations! ✨
          </p>
          <div className="mt-4 text-xs text-[#0099ff] font-medium">
            ⚡ O(n log n) to O(n²) complexity
          </div>
        </div>
        
        <div 
          className="group bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
          onClick={() => setActiveSection('searching')}
        >
          <div className="text-5xl mb-4 animate-pulse">🔍</div>
          <h3 className="font-bold text-[#ff4e88] mb-3 text-xl">Searching Algorithms</h3>
          <p className="text-[#4a4a4a] text-sm leading-relaxed">
            Linear and Binary search with cute step-by-step visualization and performance analysis! 🎯
          </p>
          <div className="mt-4 text-xs text-[#0099ff] font-medium">
            ⚡ O(1) to O(log n) complexity
          </div>
        </div>
        
        <div 
          className="group bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
          onClick={() => setActiveSection('graph')}
        >
          <div className="text-5xl mb-4 animate-bounce">🕸️</div>
          <h3 className="font-bold text-[#ff4e88] mb-3 text-xl">Graph Algorithms</h3>
          <p className="text-[#4a4a4a] text-sm leading-relaxed">
            BFS, DFS, Dijkstra's, and A* algorithms with interactive graph creation and pathfinding! 🌟
          </p>
          <div className="mt-4 text-xs text-[#0099ff] font-medium">
            ⚡ Advanced pathfinding & traversal
          </div>
        </div>
        
        <div 
          className="group bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
          onClick={() => setActiveSection('datastructures')}
        >
          <div className="text-5xl mb-4 animate-bounce">🏗️</div>
          <h3 className="font-bold text-[#ff4e88] mb-3 text-xl">Data Structures</h3>
          <p className="text-[#4a4a4a] text-sm leading-relaxed">
            7 essential data structures including Trees, Heaps, Hash Tables, and more with cute operations! 🌈
          </p>
          <div className="mt-4 text-xs text-[#0099ff] font-medium">
            ⚡ Memory efficient & optimized
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 text-center shadow-xl border border-gray-100">
          <div className="text-4xl font-bold text-[#ff4e88] mb-2">22+</div>
          <div className="text-[#4a4a4a]">Algorithms & Data Structures</div>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center shadow-xl border border-gray-100">
          <div className="text-4xl font-bold text-[#ff4e88] mb-2">100%</div>
          <div className="text-[#4a4a4a]">Interactive Visualizations</div>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center shadow-xl border border-gray-100">
          <div className="text-4xl font-bold text-[#ff4e88] mb-2">Real-time</div>
          <div className="text-[#4a4a4a]">Step-by-step Execution</div>
        </div>
      </div>
    </div>
  );

  const renderSortingSection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-[#ff4e88] mb-4">🫧 Sorting Algorithms</h2>
        <p className="text-[#4a4a4a] text-lg">Test different sorting algorithms with your own data! ✨</p>
      </div>

      {/* Input Controls */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
        <h3 className="text-2xl font-semibold text-[#ff4e88] mb-4">🎮 Input Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[#4a4a4a] mb-2 font-medium">Array Size:</label>
            <input
              type="range"
              min="5"
              max="15"
              value={arraySize}
              onChange={(e) => setArraySize(parseInt(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: 'linear-gradient(to right, #ff6ec4, #7873f5)'
              }}
            />
            <div className="text-center text-[#ff4e88] font-bold mt-2">{arraySize} elements</div>
          </div>
          
          <div>
            <label className="block text-[#4a4a4a] mb-2 font-medium">Animation Speed:</label>
            <input
              type="range"
              min="100"
              max="3000"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(constrainSpeed(parseInt(e.target.value)))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: 'linear-gradient(to right, #ff6ec4, #7873f5)'
              }}
            />
            <div className="text-center text-[#ff4e88] font-bold mt-2">{animationSpeed}ms</div>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-[#4a4a4a] mb-2 font-medium">Custom Array (comma-separated):</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customArray}
              onChange={handleArrayInput}
              placeholder="e.g., 64, 34, 25, 12, 22, 11, 90"
              className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-[#4a4a4a] placeholder-gray-400 focus:outline-none focus:border-[#ff4e88] transition-colors"
            />
            <button
              onClick={generateRandomArray}
              className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-medium"
            >
              🎲 Random
            </button>
          </div>
        </div>

        {/* Algorithm Buttons */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-[#ff4e88] mb-3">Choose Algorithm:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Bubble Sort', 'Quick Sort', 'Merge Sort', 'Insertion Sort', 'Selection Sort', 'Heap Sort'].map((algo) => (
              <button
                key={algo}
                onClick={() => runSortingAlgorithm(algo)}
                disabled={isSorting}
                className={`px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                  isSorting 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : selectedAlgorithm === algo
                    ? 'bg-[#4CAF50] text-white shadow-lg'
                    : 'bg-gray-100 hover:bg-gray-200 text-[#4a4a4a] border border-gray-200'
                }`}
              >
                {algo}
              </button>
            ))}
          </div>
        </div>

        {/* Time Complexity Information */}
        {selectedAlgorithm && (
          <div className="mt-6 bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <h4 className="text-lg font-semibold text-[#ff4e88] mb-4">⏱️ Time Complexity Analysis</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 border border-green-200">
                <h5 className="font-semibold text-green-800 text-xs mb-1">Best Case</h5>
                <p className="text-lg font-bold text-green-600">
                  {selectedAlgorithm === 'Bubble Sort' ? 'O(n)' :
                   selectedAlgorithm === 'Quick Sort' ? 'O(n log n)' :
                   selectedAlgorithm === 'Merge Sort' ? 'O(n log n)' :
                   selectedAlgorithm === 'Insertion Sort' ? 'O(n)' :
                   selectedAlgorithm === 'Selection Sort' ? 'O(n²)' :
                   selectedAlgorithm === 'Heap Sort' ? 'O(n log n)' : 'N/A'}
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-3 border border-yellow-200">
                <h5 className="font-semibold text-yellow-800 text-xs mb-1">Average Case</h5>
                <p className="text-lg font-bold text-yellow-600">
                  {selectedAlgorithm === 'Bubble Sort' ? 'O(n²)' :
                   selectedAlgorithm === 'Quick Sort' ? 'O(n log n)' :
                   selectedAlgorithm === 'Merge Sort' ? 'O(n log n)' :
                   selectedAlgorithm === 'Insertion Sort' ? 'O(n²)' :
                   selectedAlgorithm === 'Selection Sort' ? 'O(n²)' :
                   selectedAlgorithm === 'Heap Sort' ? 'O(n log n)' : 'N/A'}
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-3 border border-red-200">
                <h5 className="font-semibold text-red-800 text-xs mb-1">Worst Case</h5>
                <p className="text-lg font-bold text-red-600">
                  {selectedAlgorithm === 'Bubble Sort' ? 'O(n²)' :
                   selectedAlgorithm === 'Quick Sort' ? 'O(n²)' :
                   selectedAlgorithm === 'Merge Sort' ? 'O(n log n)' :
                   selectedAlgorithm === 'Insertion Sort' ? 'O(n²)' :
                   selectedAlgorithm === 'Selection Sort' ? 'O(n²)' :
                   selectedAlgorithm === 'Heap Sort' ? 'O(n log n)' : 'N/A'}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border border-blue-200">
                <h5 className="font-semibold text-blue-800 text-xs mb-1">Space</h5>
                <p className="text-lg font-bold text-blue-600">
                  {selectedAlgorithm === 'Bubble Sort' ? 'O(1)' :
                   selectedAlgorithm === 'Quick Sort' ? 'O(log n)' :
                   selectedAlgorithm === 'Merge Sort' ? 'O(n)' :
                   selectedAlgorithm === 'Insertion Sort' ? 'O(1)' :
                   selectedAlgorithm === 'Selection Sort' ? 'O(1)' :
                   selectedAlgorithm === 'Heap Sort' ? 'O(1)' : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Visualization and Controls Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Playback Controls */}
          {steps.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <h3 className="text-xl font-semibold text-[#ff4e88] mb-4">🎮 Controls</h3>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={play}
                  disabled={isPlaying || currentStep >= steps.length - 1}
                  className="bg-[#4CAF50] hover:bg-[#45a049] disabled:bg-gray-400 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none font-medium text-sm"
                >
                  ▶️ Play
                </button>
                <button
                  onClick={pause}
                  disabled={!isPlaying}
                  className="bg-[#FFA500] hover:bg-[#ff8c00] disabled:bg-gray-400 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none font-medium text-sm"
                >
                  ⏸️ Pause
                </button>
                <button
                  onClick={stop}
                  className="bg-[#E53935] hover:bg-[#d32f2f] text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
                >
                  ⏹️ Stop
                </button>
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="bg-[#0099ff] hover:bg-[#007acc] disabled:bg-gray-400 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none font-medium text-sm"
                >
                  ⏮️ Prev
                </button>
                <button
                  onClick={nextStep}
                  disabled={currentStep >= steps.length - 1}
                  className="bg-[#0099ff] hover:bg-[#007acc] disabled:bg-gray-400 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none font-medium text-sm"
                >
                  ⏭️ Next
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-[#4a4a4a] mb-2 font-medium text-sm">Step Progress:</label>
                <input
                  type="range"
                  min="0"
                  max={Math.max(0, steps.length - 1)}
                  value={currentStep}
                  onChange={(e) => goToStep(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: 'linear-gradient(to right, #ff6ec4, #7873f5)'
                  }}
                />
                <div className="text-center text-[#ff4e88] font-bold mt-2 text-sm">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>
            </div>
          )}

          {/* Explanation */}
          {explanation && (
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <h3 className="text-xl font-semibold text-[#ff4e88] mb-4">📚 Step Explanation</h3>
              <div className="bg-gray-50 rounded-xl p-4 text-[#4a4a4a] leading-relaxed border border-gray-100 text-sm">
                {explanation}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Visualization */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <h3 className="text-2xl font-semibold text-[#ff4e88] mb-4">🎨 Algorithm Visualization</h3>
            
            {currentArray.length > 0 ? (
              <div className="space-y-4">
                <div className="text-center text-[#4a4a4a] font-medium">
                  <p>Current Array: [{currentArray.join(', ')}]</p>
                </div>
                
                <div className="flex justify-center items-end space-x-3 h-64 bg-gray-50 rounded-xl p-6 overflow-x-auto border border-gray-100">
                  {currentArray.map((value, index) => {
                    const isHighlighted = steps[currentStep]?.highlighted?.includes(index);
                    const animation = steps[currentStep]?.animation || '';
                    
                    return (
                      <div
                        key={index}
                        className={`text-white text-sm flex items-end justify-center min-w-10 rounded-t-xl transition-all duration-500 shadow-md ${
                          isHighlighted 
                            ? 'bg-gradient-to-t from-yellow-400 to-teal-400 shadow-lg scale-110 ring-2 ring-yellow-300 ring-opacity-50' 
                            : 'bg-gradient-to-t from-orange-400 to-red-500'
                        }`}
                        style={{ 
                          height: `${Math.max(value * 3, 30)}px`,
                          animation: animation === 'bubble' ? 'bubble 1s ease-in-out' : 
                                   animation === 'swap' ? 'swap 0.5s ease-in-out' :
                                   animation === 'pivot' ? 'pivot 1s ease-in-out' :
                                   animation === 'merge-start' ? 'mergeStart 1s ease-in-out' :
                                   animation === 'divide' ? 'divide 1s ease-in-out' : 'none'
                        }}
                      >
                        <span className="mb-2 font-bold text-lg drop-shadow-sm">{value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 text-lg">Enter an array above to see the visualization ✨</p>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => setActiveSection('welcome')}
        className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-8 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-medium"
      >
        ← Back to Home
      </button>
    </div>
  );

  const renderSearchingSection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-[#ff4e88] mb-4">🔍 Searching Algorithms</h2>
        <p className="text-[#4a4a4a] text-lg">Test search algorithms with custom data and targets! 🎯</p>
      </div>

      {/* Input Controls */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
        <h3 className="text-2xl font-semibold text-[#ff4e88] mb-4">🎮 Search Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[#4a4a4a] mb-2 font-medium">Array (sorted for binary search):</label>
            <input
              type="text"
              value={customArray}
              onChange={handleArrayInput}
              placeholder="e.g., 1, 3, 5, 7, 9, 11, 13, 15"
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-[#4a4a4a] placeholder-gray-400 focus:outline-none focus:border-[#ff4e88] transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-[#4a4a4a] mb-2 font-medium">Search Target:</label>
            <input
              type="number"
              value={searchTarget}
              onChange={(e) => setSearchTarget(e.target.value)}
              placeholder="Enter number to search"
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-[#4a4a4a] placeholder-gray-400 focus:outline-none focus:border-[#ff4e88] transition-colors"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => {
              const sortedArray = Array.from({ length: 10 }, (_, i) => i * 2 + 1);
              setCustomArray(sortedArray.join(', '));
            }}
            className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-medium"
          >
            🎲 Generate Sorted Array
          </button>
          <button
            onClick={() => setSearchTarget(Math.floor(Math.random() * 20) + 1)}
            className="bg-[#0099ff] hover:bg-[#007acc] text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-medium"
          >
            🎯 Random Target
          </button>
        </div>

        {/* Algorithm Buttons */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-[#ff4e88] mb-3">Choose Algorithm:</h4>
          <div className="flex gap-3">
            {['Linear Search', 'Binary Search'].map((algo) => (
              <button
                key={algo}
                onClick={() => runSearchAlgorithm(algo)}
                disabled={isSearching}
                className={`px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-medium ${
                  isSearching 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : selectedSearchAlgorithm === algo
                    ? 'bg-[#4CAF50] text-white shadow-lg'
                    : 'bg-[#0099ff] hover:bg-[#007acc] text-white'
                }`}
              >
                {algo}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Visualization and Controls Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Playback Controls */}
          {steps.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <h3 className="text-xl font-semibold text-[#ff4e88] mb-4">🎮 Controls</h3>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={play}
                  disabled={isPlaying || currentStep >= steps.length - 1}
                  className="bg-[#4CAF50] hover:bg-[#45a049] disabled:bg-gray-400 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none font-medium text-sm"
                >
                  ▶️ Play
                </button>
                <button
                  onClick={pause}
                  disabled={!isPlaying}
                  className="bg-[#FFA500] hover:bg-[#ff8c00] disabled:bg-gray-400 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none font-medium text-sm"
                >
                  ⏸️ Pause
                </button>
                <button
                  onClick={stop}
                  className="bg-[#E53935] hover:bg-[#d32f2f] text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
                >
                  ⏹️ Stop
                </button>
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="bg-[#0099ff] hover:bg-[#007acc] disabled:bg-gray-400 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none font-medium text-sm"
                >
                  ⏮️ Prev
                </button>
                <button
                  onClick={nextStep}
                  disabled={currentStep >= steps.length - 1}
                  className="bg-[#0099ff] hover:bg-[#007acc] disabled:bg-gray-400 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none font-medium text-sm"
                >
                  ⏭️ Next
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-[#4a4a4a] mb-2 font-medium text-sm">Step Progress:</label>
                <input
                  type="range"
                  min="0"
                  max={Math.max(0, steps.length - 1)}
                  value={currentStep}
                  onChange={(e) => goToStep(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: 'linear-gradient(to right, #ff6ec4, #7873f5)'
                  }}
                />
                <div className="text-center text-[#ff4e88] font-bold mt-2 text-sm">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>
            </div>
          )}

          {/* Explanation */}
          {explanation && (
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <h3 className="text-xl font-semibold text-[#ff4e88] mb-4">📚 Step Explanation</h3>
              <div className="bg-gray-50 rounded-xl p-4 text-[#4a4a4a] leading-relaxed border border-gray-100 text-sm">
                {explanation}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Visualization */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <h3 className="text-2xl font-semibold text-[#ff4e88] mb-4">🎨 Search Visualization</h3>
            
            {currentArray.length > 0 ? (
              <div className="space-y-4">
                <div className="text-center text-[#4a4a4a] font-medium">
                  <p>Searching for: <span className="text-[#ff4e88] font-bold">{searchTarget}</span></p>
                  <p>Array: [{currentArray.join(', ')}]</p>
                </div>
                
                <div className="flex justify-center items-end space-x-3 h-64 bg-gray-50 rounded-xl p-6 overflow-x-auto border border-gray-100">
                  {currentArray.map((value, index) => {
                    const isHighlighted = steps[currentStep]?.highlighted?.includes(index);
                    const isFound = steps[currentStep]?.found === index;
                    const animation = steps[currentStep]?.animation || '';
                    
                    return (
                      <div
                        key={index}
                        className={`text-white text-sm flex items-end justify-center min-w-10 rounded-t-xl transition-all duration-500 shadow-md ${
                          isFound
                            ? 'bg-gradient-to-t from-green-400 to-green-600 shadow-lg scale-110 ring-2 ring-green-300'
                            : isHighlighted 
                            ? 'bg-gradient-to-t from-yellow-400 to-teal-400 shadow-lg scale-110 ring-2 ring-yellow-300 ring-opacity-50' 
                            : parseInt(searchTarget) === value
                            ? 'bg-gradient-to-t from-green-400 to-emerald-500'
                            : 'bg-gradient-to-t from-blue-400 to-violet-500'
                        }`}
                        style={{ 
                          height: `${Math.max(value * 3, 30)}px`,
                          animation: animation === 'search-start' ? 'searchStart 1s ease-in-out' : 
                                   animation === 'search-check' ? 'searchCheck 0.5s ease-in-out' :
                                   animation === 'search-found' ? 'searchFound 1s ease-in-out' :
                                   animation === 'search-success' ? 'searchSuccess 1s ease-in-out' :
                                   animation === 'search-not-found' ? 'searchNotFound 1s ease-in-out' : 'none'
                        }}
                      >
                        <span className="mb-2 font-bold text-lg drop-shadow-sm">{value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 text-lg">Enter an array and search target to see the visualization ✨</p>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => setActiveSection('welcome')}
        className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-8 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-medium"
      >
        ← Back to Home
      </button>
    </div>
  );

  const renderGraphSection = () => {
    const currentNodes = graphSteps.length > 0 ? graphSteps[currentGraphStep]?.nodes : nodes;
    const currentExplanation = graphSteps.length > 0 ? graphSteps[currentGraphStep]?.explanation : '';

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-[#ff4e88] mb-4">🕸️ Graph Algorithms</h2>
          <p className="text-[#4a4a4a] text-lg">Create and visualize graph algorithms with interactive nodes! 🌟</p>
        </div>

        {/* Graph Configuration */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
          <h3 className="text-2xl font-semibold text-[#ff4e88] mb-4">⚙️ Graph Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[#4a4a4a] mb-2 font-medium">Graph Type:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setGraphType('undirected')}
                  className={`px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium ${
                    graphType === 'undirected'
                      ? 'bg-[#4CAF50] text-white shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200 text-[#4a4a4a] border border-gray-200'
                  }`}
                >
                  🔄 Undirected
                </button>
                <button
                  onClick={() => setGraphType('directed')}
                  className={`px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium ${
                    graphType === 'directed'
                      ? 'bg-[#4CAF50] text-white shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200 text-[#4a4a4a] border border-gray-200'
                  }`}
                >
                  ➡️ Directed
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-[#4a4a4a] mb-2 font-medium">Graph Mode:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setGraphMode('cyclic')}
                  className={`px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium ${
                    graphMode === 'cyclic'
                      ? 'bg-[#4CAF50] text-white shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200 text-[#4a4a4a] border border-gray-200'
                  }`}
                >
                  🔄 Cyclic
                </button>
                <button
                  onClick={() => setGraphMode('acyclic')}
                  className={`px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium ${
                    graphMode === 'acyclic'
                      ? 'bg-[#4CAF50] text-white shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200 text-[#4a4a4a] border border-gray-200'
                  }`}
                >
                  📐 Acyclic
                </button>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <button 
              onClick={generateRandomGraph}
              className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-medium"
            >
              🎲 Random Graph
            </button>
            <button 
              onClick={addRandomNodes}
              className="bg-[#0099ff] hover:bg-[#007acc] text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-medium"
            >
              ➕ Add Nodes
            </button>
            <button 
              onClick={clearGraph}
              className="bg-[#E53935] hover:bg-[#d32f2f] text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-medium"
            >
              🗑️ Clear
            </button>
            <button 
              onClick={playGraphAnimation}
              disabled={graphSteps.length === 0 || isGraphPlaying}
              className="bg-[#FFA500] hover:bg-[#ff8c00] disabled:bg-gray-400 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none font-medium"
            >
              ▶️ Play Animation
            </button>
          </div>
        </div>

        {/* Main Graph Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Controls and Explanation */}
          <div className="lg:col-span-1 space-y-6">
            {/* Algorithm Buttons */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <h3 className="text-xl font-semibold text-[#ff4e88] mb-4">🚀 Algorithms</h3>
              <div className="space-y-3">
                <button 
                  onClick={runBFS}
                  disabled={nodes.length === 0}
                  className="w-full bg-[#4CAF50] hover:bg-[#45a049] disabled:bg-gray-400 text-white px-4 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none font-medium"
                >
                  🚀 BFS Traversal
                </button>
                <button 
                  onClick={runDFS}
                  disabled={nodes.length === 0}
                  className="w-full bg-[#4CAF50] hover:bg-[#45a049] disabled:bg-gray-400 text-white px-4 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none font-medium"
                >
                  🔍 DFS Traversal
                </button>
                <button 
                  onClick={runDijkstra}
                  disabled={nodes.length === 0}
                  className="w-full bg-[#4CAF50] hover:bg-[#45a049] disabled:bg-gray-400 text-white px-4 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none font-medium"
                >
                  🎯 Dijkstra's
                </button>
              </div>
            </div>

            {/* Step Progress */}
            {graphSteps.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                <h3 className="text-xl font-semibold text-[#ff4e88] mb-4">📊 Progress</h3>
                <div className="mb-4">
                  <label className="block text-[#4a4a4a] mb-2 font-medium text-sm">Step Progress:</label>
                  <input
                    type="range"
                    min="0"
                    max={Math.max(0, graphSteps.length - 1)}
                    value={currentGraphStep}
                    onChange={(e) => setCurrentGraphStep(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: 'linear-gradient(to right, #ff6ec4, #7873f5)'
                    }}
                  />
                  <div className="text-center text-[#ff4e88] font-bold mt-2 text-sm">
                    Step {currentGraphStep + 1} of {graphSteps.length}
                  </div>
                </div>
              </div>
            )}

            {/* Explanation */}
            {currentExplanation && (
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                <h3 className="text-xl font-semibold text-[#ff4e88] mb-4">📚 Current Step</h3>
                <div className="bg-gray-50 rounded-xl p-4 text-[#4a4a4a] leading-relaxed border border-gray-100 text-sm">
                  {currentExplanation}
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <h3 className="text-xl font-semibold text-[#ff4e88] mb-4">📚 How to use</h3>
              <ul className="text-[#4a4a4a] text-sm space-y-2">
                <li>• Click anywhere on the canvas to add nodes</li>
                <li>• Drag from one node to another to create edges</li>
                <li>• Use "Random Graph" to generate a sample graph</li>
                <li>• Use "Add Nodes" to add more nodes randomly</li>
                <li>• Select an algorithm to visualize the traversal</li>
                <li>• Watch the step-by-step execution with explanations</li>
              </ul>
            </div>
          </div>

          {/* Right Column - Graph Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <h3 className="text-2xl font-semibold text-[#ff4e88] mb-4">🎨 Graph Visualization</h3>
              <p className="text-[#4a4a4a] mb-4 text-sm">Click on the canvas to add nodes, then drag from one node to another to create edges!</p>
              
              {/* Graph Canvas */}
              <div 
                ref={canvasRef}
                className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 relative cursor-crosshair"
                onClick={handleCanvasClick}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                style={{ height: '400px' }}
              >
                {/* Render Edges */}
                {currentNodes && edges.map(edge => {
                  const fromNode = currentNodes.find(n => n.id === edge.from);
                  const toNode = currentNodes.find(n => n.id === edge.to);
                  
                  if (!fromNode || !toNode) return null;
                  
                  return (
                    <svg
                      key={edge.id}
                      className="absolute top-0 left-0 w-full h-full pointer-events-none"
                      style={{ zIndex: 1 }}
                    >
                      <line
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke="#7873f5"
                        strokeWidth="2"
                        markerEnd={graphType === 'directed' ? "url(#arrowhead)" : undefined}
                      />
                      <text
                        x={(fromNode.x + toNode.x) / 2}
                        y={(fromNode.y + toNode.y) / 2}
                        textAnchor="middle"
                        dy="-5"
                        className="text-xs font-bold fill-[#4a4a4a]"
                        style={{ fontSize: '12px' }}
                      >
                        {edge.weight}
                      </text>
                    </svg>
                  );
                })}
                
                {/* Render Nodes */}
                {currentNodes && currentNodes.map(node => (
                  <div
                    key={node.id}
                    className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-white font-bold cursor-move transition-all duration-300 ${
                      node.id === graphSteps[currentGraphStep]?.current
                        ? 'bg-gradient-to-r from-yellow-400 to-teal-400 scale-125 shadow-lg ring-2 ring-yellow-300'
                        : node.visited
                        ? 'bg-gradient-to-r from-blue-400 to-violet-500'
                        : 'bg-gradient-to-r from-orange-400 to-red-500'
                    }`}
                    style={{
                      left: node.x - 24,
                      top: node.y - 24,
                      zIndex: 2
                    }}
                    onMouseDown={() => handleNodeMouseDown(node.id)}
                  >
                    {node.label.split(' ')[1]}
                  </div>
                ))}
                
                {/* Arrow marker for directed edges */}
                {graphType === 'directed' && (
                  <svg width="0" height="0">
                    <defs>
                      <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon
                          points="0 0, 10 3.5, 0 7"
                          fill="#7873f5"
                        />
                      </marker>
                    </defs>
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveSection('welcome')}
          className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-8 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-medium"
        >
          ← Back to Home
        </button>
      </div>
    );
  };

  // Helper function to get input placeholder based on data structure
  const getInputPlaceholder = (dataStructure) => {
    switch (dataStructure) {
      case 'Binary Tree':
        return 'Enter node value (e.g., 42)';
      case 'Hash Table':
        return 'For insert: key:value (e.g., name:John), For search/delete: key';
      case 'Heap':
        return 'Enter element value (e.g., 42)';
      case 'Linked List':
        return 'Enter node value (e.g., A, B, C)';
      case 'Queue':
        return 'Enter element to enqueue (e.g., A, B, C)';
      case 'Stack':
        return 'Enter element to push (e.g., A, B, C)';
      case 'Trie':
        return 'Enter word (e.g., hello, world)';
      default:
        return 'Enter value...';
    }
  };

  // Helper function to render operation buttons based on data structure
  const renderOperationButtons = (dataStructure) => {
    switch (dataStructure) {
      case 'Binary Tree':
        return (
          <>
            <button 
              onClick={insertBinaryTreeNode}
              className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              ➕ Insert Node
            </button>
            <button 
              onClick={searchBinaryTreeNode}
              className="bg-[#0099ff] hover:bg-[#007acc] text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              🔍 Search
            </button>
            <button 
              onClick={deleteBinaryTreeNode}
              className="bg-[#FFA500] hover:bg-[#ff8c00] text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              🗑️ Delete
            </button>
          </>
        );
      case 'Hash Table':
        return (
          <>
            <button 
              onClick={insertHashTableEntry}
              className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              ➕ Insert Key-Value
            </button>
            <button 
              onClick={getHashTableValue}
              className="bg-[#0099ff] hover:bg-[#007acc] text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              🔍 Get Value
            </button>
            <button 
              onClick={removeHashTableKey}
              className="bg-[#FFA500] hover:bg-[#ff8c00] text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              🗑️ Remove Key
            </button>
          </>
        );
      case 'Heap':
        return (
          <>
            <button 
              onClick={insertHeapElement}
              className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              ➕ Insert Element
            </button>
            <button 
              onClick={extractHeapMax}
              className="bg-[#0099ff] hover:bg-[#007acc] text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              🎯 Extract Max
            </button>
            <button 
              onClick={heapifyHeap}
              className="bg-[#FFA500] hover:bg-[#ff8c00] text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              🔄 Heapify
            </button>
          </>
        );
      case 'Linked List':
        return (
          <>
            <button 
              onClick={addLinkedListNode}
              className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              ➕ Add Node
            </button>
            <button 
              onClick={findLinkedListNode}
              className="bg-[#0099ff] hover:bg-[#007acc] text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              🔍 Find Node
            </button>
            <button 
              onClick={removeLinkedListNode}
              className="bg-[#FFA500] hover:bg-[#ff8c00] text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              🗑️ Remove Node
            </button>
          </>
        );
      case 'Queue':
        return (
          <>
            <button 
              onClick={enqueueElement}
              className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              ➕ Enqueue
            </button>
            <button 
              onClick={dequeueElement}
              className="bg-[#0099ff] hover:bg-[#007acc] text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              ➖ Dequeue
            </button>
            <button 
              onClick={peekQueue}
              className="bg-[#FFA500] hover:bg-[#ff8c00] text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              👁️ Peek
            </button>
          </>
        );
      case 'Stack':
        return (
          <>
            <button 
              onClick={pushStackElement}
              className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              ➕ Push
            </button>
            <button 
              onClick={popStackElement}
              className="bg-[#0099ff] hover:bg-[#007acc] text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              ➖ Pop
            </button>
            <button 
              onClick={peekStack}
              className="bg-[#FFA500] hover:bg-[#ff8c00] text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              👁️ Peek
            </button>
          </>
        );
      case 'Trie':
        return (
          <>
            <button 
              onClick={insertTrieWord}
              className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              ➕ Insert Word
            </button>
            <button 
              onClick={searchTrieWord}
              className="bg-[#0099ff] hover:bg-[#007acc] text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              🔍 Search Word
            </button>
            <button 
              onClick={deleteTrieWord}
              className="bg-[#FFA500] hover:bg-[#ff8c00] text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              🗑️ Delete Word
            </button>
          </>
        );
      default:
        return null;
    }
  };

  // Helper function to render data structure visualization
  const renderDataStructureVisualization = (dataStructure) => {
    switch (dataStructure) {
      case 'Binary Tree':
        return (
          <div className="text-center">
            <div className="text-6xl mb-4">🌳</div>
            <p className="text-[#4a4a4a] mb-4">Binary Tree Data Structure</p>
            
            {/* Current Tree State */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
              <h5 className="font-semibold text-[#ff4e88] mb-2">Current Tree:</h5>
              {(currentDataState.data && currentDataState.data.length > 0) || binaryTreeData.length > 0 ? (
                <div className="text-sm text-[#4a4a4a]">
                  {(currentDataState.data || binaryTreeData).map((node, index) => (
                    <span 
                      key={index} 
                      className={`inline-block px-2 py-1 rounded mr-2 mb-1 transition-all duration-300 ${
                        currentDataState.highlight && currentDataState.highlight.includes(index)
                          ? 'bg-yellow-200 text-yellow-800 scale-110 shadow-md'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {node.value}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No nodes in tree</p>
              )}
            </div>
          </div>
        );
      case 'Hash Table':
        return (
          <div className="text-center">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-[#4a4a4a] mb-4">Hash Table Data Structure</p>
            
            {/* Current Hash Table State */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
              <h5 className="font-semibold text-[#ff4e88] mb-2">Current Hash Table:</h5>
              {(currentDataState.data && Object.keys(currentDataState.data).length > 0) || Object.keys(hashTableData).length > 0 ? (
                <div className="text-sm text-[#4a4a4a]">
                  {Object.entries(currentDataState.data || hashTableData).map(([key, value], index) => (
                    <div 
                      key={index} 
                      className={`inline-block px-2 py-1 rounded mr-2 mb-1 transition-all duration-300 ${
                        currentDataState.highlight && currentDataState.highlight.includes(key)
                          ? 'bg-yellow-200 text-yellow-800 scale-110 shadow-md'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {key}: {value}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No entries in hash table</p>
              )}
            </div>
          </div>
        );
      case 'Heap':
        return (
          <div className="text-center">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-[#4a4a4a] mb-4">Heap Data Structure</p>
            
            {/* Current Heap State */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
              <h5 className="font-semibold text-[#ff4e88] mb-2">Current Heap (Max Heap):</h5>
              {(currentDataState.data && currentDataState.data.length > 0) || heapData.length > 0 ? (
                <div className="text-sm text-[#4a4a4a]">
                  {(currentDataState.data || heapData).map((value, index) => (
                    <span 
                      key={index} 
                      className={`inline-block px-2 py-1 rounded mr-2 mb-1 transition-all duration-300 ${
                        currentDataState.highlight && currentDataState.highlight.includes(index)
                          ? 'bg-yellow-200 text-yellow-800 scale-110 shadow-md'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {value}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No elements in heap</p>
              )}
            </div>
          </div>
        );
      case 'Linked List':
        return (
          <div className="text-center">
            <div className="text-6xl mb-4">🔗</div>
            <p className="text-[#4a4a4a] mb-4">Linked List Data Structure</p>
            
            {/* Current Linked List State */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
              <h5 className="font-semibold text-[#ff4e88] mb-2">Current Linked List:</h5>
              {(currentDataState.data && currentDataState.data.length > 0) || linkedListData.length > 0 ? (
                <div className="text-sm text-[#4a4a4a]">
                  {(currentDataState.data || linkedListData).map((value, index) => (
                    <span 
                      key={index} 
                      className={`inline-block px-2 py-1 rounded mr-2 mb-1 transition-all duration-300 ${
                        currentDataState.highlight && currentDataState.highlight.includes(index)
                          ? 'bg-yellow-200 text-yellow-800 scale-110 shadow-md'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {value} {index < (currentDataState.data || linkedListData).length - 1 && '→'}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No nodes in linked list</p>
              )}
            </div>
          </div>
        );
      case 'Queue':
        return (
          <div className="text-center">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-[#4a4a4a] mb-4">Queue Data Structure</p>
            
            {/* Current Queue State */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
              <h5 className="font-semibold text-[#ff4e88] mb-2">Current Queue (FIFO):</h5>
              {(currentDataState.data && currentDataState.data.length > 0) || queueData.length > 0 ? (
                <div className="text-sm text-[#4a4a4a]">
                  {(currentDataState.data || queueData).map((value, index) => (
                    <span 
                      key={index} 
                      className={`inline-block px-2 py-1 rounded mr-2 mb-1 transition-all duration-300 ${
                        currentDataState.highlight && currentDataState.highlight.includes(index)
                          ? 'bg-yellow-200 text-yellow-800 scale-110 shadow-md'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {value} {index < (currentDataState.data || queueData).length - 1 && '→'}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Queue is empty</p>
              )}
            </div>
          </div>
        );
      case 'Stack':
        return (
          <div className="text-center">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-[#4a4a4a] mb-4">Stack Data Structure</p>
            
            {/* Current Stack State */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
              <h5 className="font-semibold text-[#ff4e88] mb-2">Current Stack (LIFO):</h5>
              {(currentDataState.data && currentDataState.data.length > 0) || stackData.length > 0 ? (
                <div className="text-sm text-[#4a4a4a]">
                  {(currentDataState.data || stackData).map((value, index) => (
                    <div 
                      key={index} 
                      className={`inline-block px-2 py-1 rounded mb-1 transition-all duration-300 ${
                        currentDataState.highlight && currentDataState.highlight.includes(index)
                          ? 'bg-yellow-200 text-yellow-800 scale-110 shadow-md'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {value}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Stack is empty</p>
              )}
            </div>
          </div>
        );
      case 'Trie':
        return (
          <div className="text-center">
            <div className="text-6xl mb-4">🌐</div>
            <p className="text-[#4a4a4a] mb-4">Trie Data Structure</p>
            
            {/* Current Trie State */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
              <h5 className="font-semibold text-[#ff4e88] mb-2">Current Trie Words:</h5>
              {(currentDataState.data && Object.keys(currentDataState.data).length > 0) || Object.keys(trieData).length > 0 ? (
                <div className="text-sm text-[#4a4a4a]">
                  {Object.keys(currentDataState.data || trieData).map((word, index) => (
                    <span 
                      key={index} 
                      className={`inline-block px-2 py-1 rounded mr-2 mb-1 transition-all duration-300 ${
                        currentDataState.highlight && currentDataState.highlight.includes(word)
                          ? 'bg-yellow-200 text-yellow-800 scale-110 shadow-md'
                          : 'bg-teal-100 text-teal-800'
                      }`}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No words in trie</p>
              )}
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center text-[#4a4a4a]">
            <div className="text-4xl mb-2">🏗️</div>
            <p>Select a data structure to see its visualization</p>
          </div>
        );
    }
  };

  const renderDataStructuresSection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-[#ff4e88] mb-4">🏗️ Data Structures</h2>
        <p className="text-[#4a4a4a] text-lg">Explore and interact with various data structures! 🌈</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
        <h3 className="text-2xl font-semibold text-[#ff4e88] mb-4">🎮 Data Structure Explorer</h3>
        <p className="text-[#4a4a4a] mb-6 text-lg">Select a data structure to visualize its operations and algorithms! ✨</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Binary Tree', 'Hash Table', 'Heap', 'Linked List', 'Queue', 'Stack', 'Trie'].map((ds) => (
            <button
              key={ds}
              onClick={() => handleDataStructureSelect(ds)}
              className={`px-4 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm ${
                selectedDataStructure === ds
                  ? 'bg-[#4CAF50] text-white shadow-lg'
                  : 'bg-[#4CAF50] hover:bg-[#45a049] text-white'
              }`}
            >
              {ds}
            </button>
          ))}
        </div>
        
        {selectedDataStructure && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setSelectedDataStructure('')}
              className="bg-[#E53935] hover:bg-[#d32f2f] text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-medium"
            >
              🗑️ Clear Selection
            </button>
          </div>
        )}

        {/* Data Structure Canvas */}
        <div className="bg-gray-50 rounded-xl p-4 mt-6 min-h-64 border-2 border-gray-200">
          {selectedDataStructure ? (
            <div className="space-y-4">
              <div className="text-center">
                <h4 className="text-2xl font-bold text-[#ff4e88] mb-4">{selectedDataStructure} Visualization</h4>
              </div>
              
              {/* Step-by-Step Visualization Controls */}
              {stepDataStates.length > 0 && (
                <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
                  <h5 className="text-lg font-semibold text-[#ff4e88] mb-3">🎮 Step-by-Step Controls</h5>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button
                      onClick={dsPlay}
                      disabled={dsIsPlaying || dsCurrentStep >= dsTotalSteps - 1}
                      className="bg-[#4CAF50] hover:bg-[#45a049] disabled:bg-gray-400 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none font-medium text-sm"
                    >
                      ▶️ Play
                    </button>
                    <button
                      onClick={dsPause}
                      disabled={!dsIsPlaying}
                      className="bg-[#FFA500] hover:bg-[#ff8c00] disabled:bg-gray-400 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none font-medium text-sm"
                    >
                      ⏸️ Pause
                    </button>
                    <button
                      onClick={dsStop}
                      className="bg-[#E53935] hover:bg-[#d32f2f] text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
                    >
                      ⏹️ Stop
                    </button>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={dsPrevStep}
                      disabled={dsCurrentStep === 0}
                      className="bg-[#0099ff] hover:bg-[#007acc] disabled:bg-gray-400 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none font-medium text-sm"
                    >
                      ⏮️ Prev
                    </button>
                    <button
                      onClick={dsNextStep}
                      disabled={dsCurrentStep >= dsTotalSteps - 1}
                      className="bg-[#0099ff] hover:bg-[#007acc] disabled:bg-gray-400 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none font-medium text-sm"
                    >
                      ⏭️ Next
                    </button>
                  </div>

                  <div className="mb-4">
                    <label className="block text-[#4a4a4a] mb-2 font-medium text-sm">Step Progress:</label>
                    <input
                      type="range"
                      min="0"
                      max={Math.max(0, dsTotalSteps - 1)}
                      value={dsCurrentStep}
                      onChange={(e) => dsGoToStep(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: 'linear-gradient(to right, #ff6ec4, #7873f5)'
                      }}
                    />
                    <div className="text-center text-[#ff4e88] font-bold mt-2 text-sm">
                      Step {dsCurrentStep + 1} of {dsTotalSteps}
                    </div>
                  </div>
                  
                  {/* Speed Control */}
                  <div className="mb-4">
                    <label className="block text-[#4a4a4a] mb-2 font-medium text-sm">Playback Speed:</label>
                    <input
                      type="range"
                      min="100"
                      max="3000"
                      value={dsPlaybackSpeed}
                      onChange={(e) => setDsPlaybackSpeed(constrainSpeed(parseInt(e.target.value)))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: 'linear-gradient(to right, #ff6ec4, #7873f5)'
                      }}
                    />
                    <div className="text-center text-[#ff4e88] font-bold mt-2 text-sm">
                      {dsPlaybackSpeed}ms per step
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step Explanation */}
              {currentDataState.explanation && (
                <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
                  <h5 className="text-lg font-semibold text-[#ff4e88] mb-3">📚 Current Step Explanation</h5>
                  <div className="bg-gray-50 rounded-xl p-4 text-[#4a4a4a] leading-relaxed border border-gray-100 text-sm whitespace-pre-line">
                    {currentDataState.explanation}
                  </div>
                </div>
              )}
              
                             {/* Binary Tree */}
               {selectedDataStructure === 'Binary Tree' && (
                 <div className="text-center">
                   <div className="text-6xl mb-4">🌳</div>
                   <p className="text-[#4a4a4a] mb-4">Binary Tree Data Structure</p>
                   
                   {/* Input Field */}
                   <div className="mb-4">
                     <input
                       type="text"
                       value={operationInput}
                       onChange={(e) => setOperationInput(e.target.value)}
                       placeholder="Enter node value (e.g., 42)"
                       className="w-full max-w-xs bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-2 text-[#4a4a4a] placeholder-gray-400 focus:outline-none focus:border-[#ff4e88] transition-colors"
                     />
                   </div>
                   
                   <div className="flex justify-center gap-4 mb-4">
                     <button 
                       onClick={insertBinaryTreeNode}
                       className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-4 py-2 rounded-lg transition-all duration-200"
                     >
                       ➕ Insert Node
                     </button>
                     <button 
                       onClick={searchBinaryTreeNode}
                       className="bg-[#0099ff] hover:bg-[#007acc] text-white px-4 py-2 rounded-lg transition-all duration-200"
                     >
                       🔍 Search
                     </button>
                     <button 
                       onClick={deleteBinaryTreeNode}
                       className="bg-[#FFA500] hover:bg-[#ff8c00] text-white px-4 py-2 rounded-lg transition-all duration-200"
                     >
                       🗑️ Delete
                     </button>
                   </div>
                   
                   {/* Current Tree State */}
                   <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                     <h5 className="font-semibold text-[#ff4e88] mb-2">Current Tree:</h5>
                     {(currentDataState.data && currentDataState.data.length > 0) || binaryTreeData.length > 0 ? (
                       <div className="text-sm text-[#4a4a4a]">
                         {(currentDataState.data || binaryTreeData).map((node, index) => (
                           <span 
                             key={index} 
                             className={`inline-block px-2 py-1 rounded mr-2 mb-1 transition-all duration-300 ${
                               currentDataState.highlight && currentDataState.highlight.includes(index)
                                 ? 'bg-yellow-200 text-yellow-800 scale-110 shadow-md'
                                 : 'bg-blue-100 text-blue-800'
                             }`}
                           >
                             {node.value}
                           </span>
                         ))}
                       </div>
                     ) : (
                       <p className="text-sm text-gray-500">No nodes in tree</p>
                     )}
                   </div>
                   
                   {/* Operation Result */}
                   {operationResult && (
                     <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                       <p className="text-sm text-green-800">{operationResult}</p>
                     </div>
                   )}
                   
                   {/* Operation History */}
                   {operationHistory.length > 0 && (
                     <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                       <h5 className="font-semibold text-[#ff4e88] mb-2">Operation History:</h5>
                       <div className="text-xs text-[#4a4a4a] space-y-1 max-h-32 overflow-y-auto">
                         {operationHistory.slice(-5).map((op, index) => (
                           <div key={index} className="bg-white px-2 py-1 rounded">
                             {op}
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
                 </div>
               )}
              
                             {/* Hash Table */}
               {selectedDataStructure === 'Hash Table' && (
                 <div className="text-center">
                   <div className="text-6xl mb-4">📊</div>
                   <p className="text-[#4a4a4a] mb-4">Hash Table Data Structure</p>
                   
                   {/* Input Field */}
                   <div className="mb-4">
                     <input
                       type="text"
                       value={operationInput}
                       onChange={(e) => setOperationInput(e.target.value)}
                       placeholder="For insert: key:value (e.g., name:John), For search/delete: key"
                       className="w-full max-w-xs bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-2 text-[#4a4a4a] placeholder-gray-400 focus:outline-none focus:border-[#ff4e88] transition-colors"
                     />
                   </div>
                   
                   <div className="flex justify-center gap-4 mb-4">
                     <button 
                       onClick={insertHashTableEntry}
                       className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-4 py-2 rounded-lg transition-all duration-200"
                     >
                       ➕ Insert Key-Value
                     </button>
                     <button 
                       onClick={getHashTableValue}
                       className="bg-[#0099ff] hover:bg-[#007acc] text-white px-4 py-2 rounded-lg transition-all duration-200"
                     >
                       🔍 Get Value
                     </button>
                     <button 
                       onClick={removeHashTableKey}
                       className="bg-[#FFA500] hover:bg-[#ff8c00] text-white px-4 py-2 rounded-lg transition-all duration-200"
                     >
                       🗑️ Remove Key
                     </button>
                   </div>
                   
                   {/* Current Hash Table State */}
                   <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                     <h5 className="font-semibold text-[#ff4e88] mb-2">Current Hash Table:</h5>
                     {(currentDataState.data && Object.keys(currentDataState.data).length > 0) || Object.keys(hashTableData).length > 0 ? (
                       <div className="text-sm text-[#4a4a4a]">
                         {Object.entries(currentDataState.data || hashTableData).map(([key, value], index) => (
                           <div 
                             key={index} 
                             className={`inline-block px-2 py-1 rounded mr-2 mb-1 transition-all duration-300 ${
                               currentDataState.highlight && currentDataState.highlight.includes(key)
                                 ? 'bg-yellow-200 text-yellow-800 scale-110 shadow-md'
                                 : 'bg-purple-100 text-purple-800'
                             }`}
                           >
                             {key}: {value}
                           </div>
                         ))}
                       </div>
                     ) : (
                       <p className="text-sm text-gray-500">No entries in hash table</p>
                     )}
                   </div>
                   
                   {/* Operation Result */}
                   {operationResult && (
                     <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                       <p className="text-sm text-green-800">{operationResult}</p>
                     </div>
                   )}
                   
                   {/* Operation History */}
                   {operationHistory.length > 0 && (
                     <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                       <h5 className="font-semibold text-[#ff4e88] mb-2">Operation History:</h5>
                       <div className="text-xs text-[#4a4a4a] space-y-1 max-h-32 overflow-y-auto">
                         {operationHistory.slice(-5).map((op, index) => (
                           <div key={index} className="bg-white px-2 py-1 rounded">
                             {op}
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
                 </div>
               )}
              
                             {/* Heap */}
               {selectedDataStructure === 'Heap' && (
                 <div className="text-center">
                   <div className="text-6xl mb-4">📚</div>
                   <p className="text-[#4a4a4a] mb-4">Heap Data Structure</p>
                   
                   {/* Input Field */}
                   <div className="mb-4">
                     <input
                       type="text"
                       value={operationInput}
                       onChange={(e) => setOperationInput(e.target.value)}
                       placeholder="Enter element value (e.g., 42)"
                       className="w-full max-w-xs bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-2 text-[#4a4a4a] placeholder-gray-400 focus:outline-none focus:border-[#ff4e88] transition-colors"
                     />
                   </div>
                   
                   <div className="flex justify-center gap-4 mb-4">
                     <button 
                       onClick={insertHeapElement}
                       className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-4 py-2 rounded-lg transition-all duration-200"
                     >
                       ➕ Insert Element
                     </button>
                     <button 
                       onClick={extractHeapMax}
                       className="bg-[#0099ff] hover:bg-[#007acc] text-white px-4 py-2 rounded-lg transition-all duration-200"
                     >
                       🎯 Extract Max
                     </button>
                     <button 
                       onClick={heapifyHeap}
                       className="bg-[#FFA500] hover:bg-[#ff8c00] text-white px-4 py-2 rounded-lg transition-all duration-200"
                     >
                       🔄 Heapify
                     </button>
                   </div>
                   
                   {/* Current Heap State */}
                   <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                     <h5 className="font-semibold text-[#ff4e88] mb-2">Current Heap (Max Heap):</h5>
                     {(currentDataState.data && currentDataState.data.length > 0) || heapData.length > 0 ? (
                       <div className="text-sm text-[#4a4a4a]">
                         {(currentDataState.data || heapData).map((value, index) => (
                           <span 
                             key={index} 
                             className={`inline-block px-2 py-1 rounded mr-2 mb-1 transition-all duration-300 ${
                               currentDataState.highlight && currentDataState.highlight.includes(index)
                                 ? 'bg-yellow-200 text-yellow-800 scale-110 shadow-md'
                                 : 'bg-orange-100 text-orange-800'
                             }`}
                           >
                             {value}
                           </span>
                         ))}
                       </div>
                     ) : (
                       <p className="text-sm text-gray-500">No elements in heap</p>
                     )}
                   </div>
                   
                   {/* Operation Result */}
                   {operationResult && (
                     <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                       <p className="text-sm text-green-800">{operationResult}</p>
                     </div>
                   )}
                   
                   {/* Operation History */}
                   {operationHistory.length > 0 && (
                     <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                       <h5 className="font-semibold text-[#ff4e88] mb-2">Operation History:</h5>
                       <div className="text-xs text-[#4a4a4a] space-y-1 max-h-32 overflow-y-auto">
                         {operationHistory.slice(-5).map((op, index) => (
                           <div key={index} className="bg-white px-2 py-1 rounded">
                             {op}
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
                 </div>
               )}
              
                             {/* Linked List */}
               {selectedDataStructure === 'Linked List' && (
                 <div className="text-center">
                   <div className="text-6xl mb-4">🔗</div>
                   <p className="text-[#4a4a4a] mb-4">Linked List Data Structure</p>
                   
                   {/* Input Field */}
                   <div className="mb-4">
                     <input
                       type="text"
                       value={operationInput}
                       onChange={(e) => setOperationInput(e.target.value)}
                       placeholder="Enter node value (e.g., A, B, C)"
                       className="w-full max-w-xs bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-2 text-[#4a4a4a] placeholder-gray-400 focus:outline-none focus:border-[#ff4e88] transition-colors"
                     />
                   </div>
                   
                   <div className="flex justify-center gap-4 mb-4">
                     <button 
                       onClick={addLinkedListNode}
                       className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-4 py-2 rounded-lg transition-all duration-200"
                     >
                       ➕ Add Node
                     </button>
                     <button 
                       onClick={findLinkedListNode}
                       className="bg-[#0099ff] hover:bg-[#007acc] text-white px-4 py-2 rounded-lg transition-all duration-200"
                     >
                       🔍 Find Node
                     </button>
                     <button 
                       onClick={removeLinkedListNode}
                       className="bg-[#FFA500] hover:bg-[#ff8c00] text-white px-4 py-2 rounded-lg transition-all duration-200"
                     >
                       🗑️ Remove Node
                     </button>
                   </div>
                   
                   {/* Current Linked List State */}
                   <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                     <h5 className="font-semibold text-[#ff4e88] mb-2">Current Linked List:</h5>
                     {(currentDataState.data && currentDataState.data.length > 0) || linkedListData.length > 0 ? (
                       <div className="text-sm text-[#4a4a4a]">
                         {(currentDataState.data || linkedListData).map((value, index) => (
                           <span 
                             key={index} 
                             className={`inline-block px-2 py-1 rounded mr-2 mb-1 transition-all duration-300 ${
                               currentDataState.highlight && currentDataState.highlight.includes(index)
                                 ? 'bg-yellow-200 text-yellow-800 scale-110 shadow-md'
                                 : 'bg-green-100 text-green-800'
                             }`}
                           >
                             {value} {index < (currentDataState.data || linkedListData).length - 1 && '→'}
                           </span>
                         ))}
                       </div>
                     ) : (
                       <p className="text-sm text-gray-500">No nodes in linked list</p>
                     )}
                   </div>
                   
                   {/* Operation Result */}
                   {operationResult && (
                     <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                       <p className="text-sm text-green-800">{operationResult}</p>
                     </div>
                   )}
                   
                   {/* Operation History */}
                   {operationHistory.length > 0 && (
                     <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                       <h5 className="font-semibold text-[#ff4e88] mb-2">Operation History:</h5>
                       <div className="text-xs text-[#4a4a4a] space-y-1 max-h-32 overflow-y-auto">
                         {operationHistory.slice(-5).map((op, index) => (
                           <div key={index} className="bg-white px-2 py-1 rounded">
                             {op}
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
                 </div>
               )}
              
                             {/* Queue */}
               {selectedDataStructure === 'Queue' && (
                 <div className="text-center">
                   <div className="text-6xl mb-4">📋</div>
                   <p className="text-[#4a4a4a] mb-4">Queue Data Structure</p>
                   
                   {/* Input Field */}
                   <div className="mb-4">
                     <input
                       type="text"
                       value={operationInput}
                       onChange={(e) => setOperationInput(e.target.value)}
                       placeholder="Enter element to enqueue (e.g., A, B, C)"
                       className="w-full max-w-xs bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-2 text-[#4a4a4a] placeholder-gray-400 focus:outline-none focus:border-[#ff4e88] transition-colors"
                     />
                   </div>
                   
                   <div className="flex justify-center gap-4 mb-4">
                     <button 
                       onClick={enqueueElement}
                       className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-4 py-2 rounded-lg transition-all duration-200"
                     >
                       ➕ Enqueue
                     </button>
                     <button 
                       onClick={dequeueElement}
                       className="bg-[#0099ff] hover:bg-[#007acc] text-white px-4 py-2 rounded-lg transition-all duration-200"
                     >
                       ➖ Dequeue
                     </button>
                     <button 
                       onClick={peekQueue}
                       className="bg-[#FFA500] hover:bg-[#ff8c00] text-white px-4 py-2 rounded-lg transition-all duration-200"
                     >
                       👁️ Peek
                     </button>
                   </div>
                   
                   {/* Current Queue State */}
                   <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                     <h5 className="font-semibold text-[#ff4e88] mb-2">Current Queue (FIFO):</h5>
                     {(currentDataState.data && currentDataState.data.length > 0) || queueData.length > 0 ? (
                       <div className="text-sm text-[#4a4a4a]">
                         {(currentDataState.data || queueData).map((value, index) => (
                           <span 
                             key={index} 
                             className={`inline-block px-2 py-1 rounded mr-2 mb-1 transition-all duration-300 ${
                               currentDataState.highlight && currentDataState.highlight.includes(index)
                                 ? 'bg-yellow-200 text-yellow-800 scale-110 shadow-md'
                                 : 'bg-indigo-100 text-indigo-800'
                             }`}
                           >
                             {value} {index < (currentDataState.data || queueData).length - 1 && '→'}
                           </span>
                         ))}
                       </div>
                     ) : (
                       <p className="text-sm text-gray-500">Queue is empty</p>
                     )}
                   </div>
                   
                   {/* Operation Result */}
                   {operationResult && (
                     <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                       <p className="text-sm text-green-800">{operationResult}</p>
                     </div>
                   )}
                   
                   {/* Operation History */}
                   {operationHistory.length > 0 && (
                     <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                       <h5 className="font-semibold text-[#ff4e88] mb-2">Operation History:</h5>
                       <div className="text-xs text-[#4a4a4a] space-y-1 max-h-32 overflow-y-auto">
                         {operationHistory.slice(-5).map((op, index) => (
                           <div key={index} className="bg-white px-2 py-1 rounded">
                             {op}
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
                 </div>
               )}
              
                             {/* Stack */}
               {selectedDataStructure === 'Stack' && (
                 <div className="text-center">
                   <div className="text-6xl mb-4">📚</div>
                   <p className="text-[#4a4a4a] mb-4">Stack Data Structure</p>
                   
                   {/* Input Field */}
                   <div className="mb-4">
                     <input
                       type="text"
                       value={operationInput}
                       onChange={(e) => setOperationInput(e.target.value)}
                       placeholder="Enter element to push (e.g., A, B, C)"
                       className="w-full max-w-xs bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-2 text-[#4a4a4a] placeholder-gray-400 focus:outline-none focus:border-[#ff4e88] transition-colors"
                     />
                   </div>
                   
                   <div className="flex justify-center gap-4 mb-4">
                     <button 
                       onClick={pushStackElement}
                       className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-4 py-2 rounded-lg transition-all duration-200"
                     >
                       ➕ Push
                     </button>
                     <button 
                       onClick={popStackElement}
                       className="bg-[#0099ff] hover:bg-[#007acc] text-white px-4 py-2 rounded-lg transition-all duration-200"
                     >
                       ➖ Pop
                     </button>
                     <button 
                       onClick={peekStack}
                       className="bg-[#FFA500] hover:bg-[#ff8c00] text-white px-4 py-2 rounded-lg transition-all duration-200"
                     >
                       👁️ Peek
                     </button>
                   </div>
                   
                   {/* Current Stack State */}
                   <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                     <h5 className="font-semibold text-[#ff4e88] mb-2">Current Stack (LIFO):</h5>
                     {(currentDataState.data && currentDataState.data.length > 0) || stackData.length > 0 ? (
                       <div className="text-sm text-[#4a4a4a]">
                         {(currentDataState.data || stackData).map((value, index) => (
                           <div 
                             key={index} 
                             className={`inline-block px-2 py-1 rounded mb-1 transition-all duration-300 ${
                               currentDataState.highlight && currentDataState.highlight.includes(index)
                                 ? 'bg-yellow-200 text-yellow-800 scale-110 shadow-md'
                                 : 'bg-red-100 text-red-800'
                             }`}
                           >
                             {value}
                           </div>
                         ))}
                       </div>
                     ) : (
                       <p className="text-sm text-gray-500">Stack is empty</p>
                     )}
                   </div>
                   
                   {/* Operation Result */}
                   {operationResult && (
                     <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                       <p className="text-sm text-green-800">{operationResult}</p>
                     </div>
                   )}
                   
                   {/* Operation History */}
                   {operationHistory.length > 0 && (
                     <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                       <h5 className="font-semibold text-[#ff4e88] mb-2">Operation History:</h5>
                       <div className="text-xs text-[#4a4a4a] space-y-1 max-h-32 overflow-y-auto">
                         {operationHistory.slice(-5).map((op, index) => (
                           <div key={index} className="bg-white px-2 py-1 rounded">
                             {op}
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
                 </div>
               )}
              
                             {/* Trie */}
               {selectedDataStructure === 'Trie' && (
                 <div className="text-center">
                   <div className="text-6xl mb-4">🌐</div>
                   <p className="text-[#4a4a4a] mb-4">Trie Data Structure</p>
                   
                   {/* Input Field */}
                   <div className="mb-4">
                     <input
                       type="text"
                       value={operationInput}
                       onChange={(e) => setOperationInput(e.target.value)}
                       placeholder="Enter word (e.g., hello, world)"
                       className="w-full max-w-xs bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-2 text-[#4a4a4a] placeholder-gray-400 focus:outline-none focus:border-[#ff4e88] transition-colors"
                     />
                   </div>
                   
                   <div className="flex justify-center gap-4 mb-4">
                     <button 
                       onClick={insertTrieWord}
                       className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-4 py-2 rounded-lg transition-all duration-200"
                     >
                       ➕ Insert Word
                     </button>
                     <button 
                       onClick={searchTrieWord}
                       className="bg-[#0099ff] hover:bg-[#007acc] text-white px-4 py-2 rounded-lg transition-all duration-200"
                     >
                       🔍 Search Word
                     </button>
                     <button 
                       onClick={deleteTrieWord}
                       className="bg-[#FFA500] hover:bg-[#ff8c00] text-white px-4 py-2 rounded-lg transition-all duration-200"
                     >
                       🗑️ Delete Word
                     </button>
                   </div>
                   
                   {/* Current Trie State */}
                   <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                     <h5 className="font-semibold text-[#ff4e88] mb-2">Current Trie Words:</h5>
                     {(currentDataState.data && Object.keys(currentDataState.data).length > 0) || Object.keys(trieData).length > 0 ? (
                       <div className="text-sm text-[#4a4a4a]">
                         {Object.keys(currentDataState.data || trieData).map((word, index) => (
                           <span 
                             key={index} 
                             className={`inline-block px-2 py-1 rounded mr-2 mb-1 transition-all duration-300 ${
                               currentDataState.highlight && currentDataState.highlight.includes(word)
                                 ? 'bg-yellow-200 text-yellow-800 scale-110 shadow-md'
                                 : 'bg-teal-100 text-teal-800'
                             }`}
                           >
                             {word}
                           </span>
                         ))}
                       </div>
                     ) : (
                       <p className="text-sm text-gray-500">No words in trie</p>
                     )}
                   </div>
                   
                   {/* Operation Result */}
                   {operationResult && (
                     <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                       <p className="text-sm text-green-800">{operationResult}</p>
                     </div>
                   )}
                   
                   {/* Operation History */}
                   {operationHistory.length > 0 && (
                     <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                       <h5 className="font-semibold text-[#ff4e88] mb-2">Operation History:</h5>
                       <div className="text-xs text-[#4a4a4a] space-y-1 max-h-32 overflow-y-auto">
                         {operationHistory.slice(-5).map((op, index) => (
                           <div key={index} className="bg-white px-2 py-1 rounded">
                             {op}
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
                 </div>
               )}
            </div>
          ) : (
            <div className="text-center text-[#4a4a4a]">
              <div className="text-4xl mb-2">🏗️</div>
              <p>Data structure visualization will be implemented here!</p>
              <p className="text-sm mt-2">Select a data structure above to see its operations</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 rounded-xl p-4 mt-6 border-2 border-gray-200">
          <h4 className="font-semibold text-[#ff4e88] mb-2">📚 Available Operations:</h4>
          <ul className="text-[#4a4a4a] text-sm space-y-1">
            <li>• Insert, Delete, Search operations</li>
            <li>• Traversal algorithms (for trees)</li>
            <li>• Push, Pop operations (for stacks)</li>
            <li>• Enqueue, Dequeue operations (for queues)</li>
            <li>• Step-by-step visualization with explanations</li>
          </ul>
        </div>
      </div>

      <button
        onClick={() => setActiveSection('welcome')}
        className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-8 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-medium"
      >
        ← Back to Home
      </button>
    </div>
  );

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #ff6ec4 0%, #7873f5 100%)'
    }}>
      {/* Hero Header */}
      <header className="bg-white/90 backdrop-blur-sm text-[#4a4a4a] p-8 shadow-xl border-b border-gray-200">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-[#ff4e88]">
            🚀 AlgoViz Pro
          </h1>
          <p className="text-2xl md:text-3xl text-[#4a4a4a] mb-2">
            Master Algorithms Through Interactive Visualizations
          </p>
          <p className="text-[#0099ff] text-xl">
            Learn, Explore, and Master 22+ Algorithms & Data Structures
          </p>
        </div>
      </header>
      
      <main className="container mx-auto p-6">
        {/* Main Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200">
          {activeSection === 'welcome' && renderWelcomeSection()}
          {activeSection === 'sorting' && renderSortingSection()}
          {activeSection === 'searching' && renderSearchingSection()}
          {activeSection === 'graph' && renderGraphSection()}
          {activeSection === 'datastructures' && renderDataStructuresSection()}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-sm text-[#4a4a4a] text-center py-6 mt-12 border-t border-gray-200">
        <div className="container mx-auto">
          <p className="text-[#0099ff]">
            © 2024 AlgoViz Pro - Interactive Algorithm Visualizer | Built with React & Modern Web Technologies ✨
          </p>
        </div>
      </footer>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff6ec4, #7873f5);
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff6ec4, #7873f5);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        
        @keyframes bubble {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes swap {
          0% { transform: translateX(0); }
          50% { transform: translateX(10px); }
          100% { transform: translateX(0); }
        }
        
        @keyframes pivot {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        
        @keyframes mergeStart {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
        
        @keyframes divide {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(5deg); }
        }
        
        @keyframes searchStart {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
        
        @keyframes searchCheck {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes searchFound {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        
        @keyframes searchSuccess {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }
        
        @keyframes searchNotFound {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export default App;
