import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Network, Target, ScatterChart } from 'lucide-react';
import LinearRegressionVis from './LinearRegressionVis';

const mlModels = [
  {
    title: 'Linear Regression',
    icon: LineChart,
    color: 'text-blue-500',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    path: '/ml/linear-regression',
    desc: 'Fit a line to a dataset to predict continuous values using Gradient Descent.'
  },
  {
    title: 'K-Means Clustering',
    icon: ScatterChart,
    color: 'text-violet-500',
    bg: 'bg-violet-100 dark:bg-violet-900/30',
    path: '#', // Placeholder
    desc: 'Group data into K distinct clusters without predefined labels.'
  },
  {
    title: 'Q-Learning Agent',
    icon: Target,
    color: 'text-emerald-500',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    path: '#', // Placeholder
    desc: 'Reinforcement learning agent navigating a grid world to maximize rewards.'
  }
];

function MLDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full relative z-10">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Machine Learning <span className="text-gradient">Lab</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          Build intuition for AI models. Watch gradient descent minimize loss, see cluster centroids update, and observe agents learning optimal policies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mlModels.map((mode, idx) => (
          <motion.div
            key={mode.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <Link 
              to={mode.path}
              className={`glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full group transition-all duration-300 ${mode.path !== '#' ? 'hover:-translate-y-1 hover:shadow-xl cursor-pointer' : 'opacity-70 cursor-not-allowed'}`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-2xl ${mode.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <mode.icon className={`w-6 h-6 ${mode.color}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{mode.title}</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-grow">{mode.desc}</p>
              
              {mode.path !== '#' ? (
                <div className="mt-auto inline-flex items-center font-semibold text-primary-600 dark:text-primary-400 group-hover:text-primary-500 text-sm">
                  Launch Visualizer &rarr;
                </div>
              ) : (
                <div className="mt-auto inline-flex items-center font-semibold text-slate-400 dark:text-slate-500 text-sm">
                  Coming Soon
                </div>
              )}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function ML() {
  return (
    <Routes>
      <Route path="/" element={<MLDashboard />} />
      <Route path="/linear-regression" element={<LinearRegressionVis />} />
    </Routes>
  );
}
