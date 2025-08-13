# Interactive Algorithm Visualizer

A comprehensive web-based tool for visualizing various algorithms, data structures, and graph algorithms. Built with React, Redux Toolkit, and modern web technologies to provide an interactive and educational experience for understanding algorithmic concepts.

## 🚀 Project Overview

This project serves as an educational platform for visualizing and understanding algorithms and data structures through interactive animations and real-time demonstrations.

## ✨ Features Implemented

### 🎯 Core Features
- **Interactive Visualizations**: Real-time algorithm animations with step-by-step execution
- **Speed Control**: Adjustable animation speed for better understanding
- **Step-by-Step Execution**: Pause, play, and step through algorithms
- **Responsive Design**: Modern UI built with Tailwind CSS
- **State Management**: Centralized state management with Redux Toolkit
- **Routing**: Multi-page application with React Router

### 📊 Algorithm Categories

#### 🔢 Sorting Algorithms (8 Implemented)
- **Bubble Sort** - Simple comparison-based sorting
- **Selection Sort** - In-place comparison sorting
- **Insertion Sort** - Simple adaptive sorting algorithm
- **Merge Sort** - Divide-and-conquer sorting
- **Quick Sort** - Efficient comparison-based sorting
- **Heap Sort** - Comparison-based sorting using heap data structure
- **Counting Sort** - Non-comparison integer sorting
- **Radix Sort** - Non-comparison digit-based sorting

#### 🔍 Searching Algorithms (2 Implemented)
- **Linear Search** - Sequential search through elements
- **Binary Search** - Efficient search in sorted arrays

#### 🕸️ Graph Algorithms (4 Implemented)
- **Breadth-First Search (BFS)** - Level-by-level graph traversal
- **Depth-First Search (DFS)** - Recursive graph exploration
- **Dijkstra's Algorithm** - Shortest path finding
- **A* Search** - Informed search algorithm with heuristics

### 🏗️ Data Structures (8 Implemented)
- **Binary Tree** - Hierarchical data structure
- **Hash Table** - Key-value storage with O(1) average access
- **Heap** - Complete binary tree with heap property
- **Linked List** - Linear data structure with nodes
- **Priority Queue** - Queue with priority-based ordering
- **Queue** - First-in-first-out (FIFO) data structure
- **Stack** - Last-in-first-out (LIFO) data structure
- **Trie** - Tree data structure for string operations

## 🛠️ Technical Stack

### Frontend Framework
- **React 18.2.0** - Modern UI library with hooks
- **React Router DOM 6.16.0** - Client-side routing
- **Redux Toolkit 1.9.7** - State management
- **React Redux 8.1.3** - React bindings for Redux

### Styling & Build Tools
- **Tailwind CSS 3.3.5** - Utility-first CSS framework
- **Vite 4.4.5** - Fast build tool and dev server
- **PostCSS 8.4.31** - CSS processing
- **Autoprefixer 10.4.16** - CSS vendor prefixing

### Development Tools
- **TypeScript Support** - Type definitions for React
- **Hot Module Replacement** - Fast development experience

## 📁 Project Structure

```
src/
├── algorithms/           # Algorithm implementations
│   ├── sorting/         # 8 sorting algorithms
│   ├── searching/       # 2 searching algorithms
│   └── graph/          # 4 graph algorithms
├── dataStructures/      # 8 data structure implementations
├── visualizers/         # React components for visualization
├── components/          # Reusable UI components
├── redux/              # State management
├── utils/              # Utility functions
└── tests/              # Test files
```

## 🎮 Interactive Features

### Sorting Visualizer
- Array generation with customizable size
- Real-time array visualization with color-coded states
- Step-by-step execution controls
- Performance metrics display

### Searching Visualizer
- Interactive array input
- Visual search process with highlighting
- Result display with search statistics

### Graph Visualizer
- Interactive node and edge creation
- Start and goal node selection
- Path visualization with different colors
- Graph algorithm execution with step-by-step animation

### Data Structures Visualizer
- Interactive data structure creation
- Visual representation of operations
- Step-by-step operation demonstration

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/interactive-algorithm-visualizer.git
   cd interactive-algorithm-visualizer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` (Vite default port)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📈 Progress Summary

### ✅ Completed Features
- **22 Algorithm Implementations** (8 sorting + 2 searching + 4 graph + 8 data structures)
- **Complete UI Framework** with responsive design
- **State Management** with Redux Toolkit
- **Routing System** with React Router
- **Interactive Controls** for all visualizers
- **Real-time Animations** with speed control
- **Modern Build System** with Vite
- **Styling System** with Tailwind CSS

### 🔄 In Progress
- Additional algorithm implementations
- Enhanced visualizations
- Performance optimizations
- Mobile responsiveness improvements

### 📋 Planned Features
- More graph algorithms (Bellman-Ford, Floyd-Warshall)
- Advanced data structures (AVL Tree, Red-Black Tree)
- Algorithm complexity analysis
- Export/import functionality
- User accounts and progress tracking
- Algorithm comparison tools

## 🤝 Contributing

This project is open for contributions! Areas where you can help:
- Adding new algorithms
- Improving visualizations
- Enhancing UI/UX
- Writing tests
- Documentation improvements

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Future Roadmap

### Phase 1 (Current)
- ✅ Core algorithm implementations
- ✅ Basic visualizations
- ✅ UI framework

### Phase 2 (Next)
- Advanced graph algorithms
- Algorithm complexity visualization
- Performance benchmarking
- Mobile app version

### Phase 3 (Future)
- Machine learning algorithm visualizations
- Collaborative features
- Educational content integration
- API for external integrations

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Status**: Active Development 