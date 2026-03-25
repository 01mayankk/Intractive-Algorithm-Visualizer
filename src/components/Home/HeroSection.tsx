import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Compass, Code2, BrainCircuit, Network } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28 min-h-[90vh] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium text-sm mb-8 border border-primary-100 dark:border-primary-800"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
            v2.0 Now Streaming Next-Gen Visualizations
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8 leading-tight"
          >
            Master Algorithms & AI <br />
            <span className="text-gradient">Visually</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            From DSA to Machine Learning — Understand everything step-by-step through pure interactive animations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/dsa"
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-primary-500/25 w-full sm:w-auto justify-center"
            >
              <PlayCircle className="w-6 h-6" />
              Start Learning
            </Link>
            <Link
              to="/ml"
              className="flex items-center gap-2 glass-panel text-slate-900 dark:text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all hover:bg-white/90 dark:hover:bg-slate-800/90 hover:scale-105 w-full sm:w-auto justify-center"
            >
              <Compass className="w-6 h-6" />
              Explore ML Lab
            </Link>
          </motion.div>
        </div>

        {/* Feature Highlights Grid beneath Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24"
        >
          <div className="glass-panel p-6 rounded-3xl flex items-start gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">DSA Foundations</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Sort, Search, Trees & Graphs with C++ logic.</p>
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-3xl flex items-start gap-4">
            <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-2xl text-violet-600 dark:text-violet-400">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Machine Learning</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Interactive Regression, Clustering & Reinforcement.</p>
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-3xl flex items-start gap-4">
            <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-2xl text-pink-600 dark:text-pink-400">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Neural Networks</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Build nodes & watch Backprop in real-time.</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-[600px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-400 to-violet-500 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-pulse animation-delay-2000" />
      </div>
    </section>
  );
}
