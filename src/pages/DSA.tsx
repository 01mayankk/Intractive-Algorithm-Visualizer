import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SortingVisualizer from './DSA/Sorting';

import { motion } from 'framer-motion';
import { ArrowRight, BarChart2, Search as SearchIcon, Network, Share2, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  {
    title: 'Sorting Algorithms',
    icon: BarChart2,
    color: 'text-indigo-500',
    bg: 'bg-indigo-100 dark:bg-indigo-900/30',
    path: '/dsa/sorting',
    algorithms: ['Bubble Sort', 'Merge Sort', 'Quick Sort', 'Heap Sort']
  },
  {
    title: 'Searching Algorithms',
    icon: SearchIcon,
    color: 'text-pink-500',
    bg: 'bg-pink-100 dark:bg-pink-900/30',
    path: '/dsa/searching',
    algorithms: ['Linear Search', 'Binary Search']
  },
  {
    title: 'Graph Algorithms',
    icon: Network,
    color: 'text-green-500',
    bg: 'bg-green-100 dark:bg-green-900/30',
    path: '/dsa/graphs',
    algorithms: ['BFS', 'DFS', 'Dijkstra', 'A* Pathfinding']
  },
  {
    title: 'Trees & Data Structures',
    icon: Share2,
    color: 'text-orange-500',
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    path: '/dsa/trees',
    algorithms: ['BST', 'AVL Tree', 'Segment Tree']
  },
  {
    title: 'Dynamic Programming',
    icon: Layers,
    color: 'text-cyan-500',
    bg: 'bg-cyan-100 dark:bg-cyan-900/30',
    path: '/dsa/dp',
    algorithms: ['Knapsack', 'LIS', 'LCS']
  }
];

function DSADashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full relative z-10">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Data Structures & <span className="text-gradient">Algorithms</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          Master the fundamentals of computer science. Visualize standard C++ implementations, watch memory state changes, and understand logic step-by-step.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <Link 
              to={cat.path}
              className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-2xl ${cat.bg} flex items-center justify-center`}>
                  <cat.icon className={`w-6 h-6 ${cat.color}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{cat.title}</h3>
              </div>
              
              <ul className="space-y-3 flex-grow mb-6">
                {cat.algorithms.map(algo => (
                  <li key={algo} className="flex items-center text-slate-600 dark:text-slate-400 text-sm font-medium">
                    <span className={`w-1.5 h-1.5 rounded-full ${cat.bg.split(' ')[0]} mr-2`} />
                    {algo}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex items-center text-primary-600 dark:text-primary-400 font-semibold group-hover:text-primary-500 transition-colors text-sm">
                Explore Category <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

import SearchingVisualizer from './DSA/Searching';
import DijkstraVis from './DSA/Dijkstra';
import DPVis from './DSA/DP';
import BSTVis from './DSA/BST';

export default function DSA() {
  return (
    <Routes>
      <Route path="/" element={<DSADashboard />} />
      <Route path="/sorting" element={<SortingVisualizer />} />
      <Route path="/searching" element={<SearchingVisualizer />} />
      <Route path="/graphs" element={<DijkstraVis />} />
      <Route path="/dp" element={<DPVis />} />
      <Route path="/trees" element={<BSTVis />} />
    </Routes>
  );
}
