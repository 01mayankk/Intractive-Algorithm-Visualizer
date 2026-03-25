import React from 'react';
import { Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StepExplanationProps {
  explanationText: string;
  codeSnippet: string;
  activeLine?: number;
}

export default function StepExplanation({
  explanationText,
  codeSnippet,
  activeLine
}: StepExplanationProps) {
  
  const lines = codeSnippet.split('\n');

  return (
    <div className="flex flex-col h-full gap-4">
      
      {/* Explanation Box */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md flex-shrink-0">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary-500" /> Current Step
        </h3>
        <AnimatePresence mode="popLayout">
          <motion.p
            key={explanationText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium"
          >
            {explanationText || "Waiting to start..."}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Code View */}
      <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md flex-1 overflow-hidden flex flex-col">
        <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-2 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">C++ Logic</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-white/50 dark:bg-slate-900/50 font-mono text-sm">
          {lines.map((line, idx) => (
            <div 
              key={idx} 
              className={`px-2 py-1 flex rounded ${activeLine === idx ? 'bg-primary-100 dark:bg-primary-900/40 border-l-2 border-primary-500' : 'border-l-2 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}
            >
              <span className="text-slate-400 dark:text-slate-500 w-6 text-right mr-4 select-none">{idx + 1}</span>
              <span className={`whitespace-pre ${activeLine === idx ? 'text-primary-800 dark:text-primary-300 font-semibold' : 'text-slate-700 dark:text-slate-300'}`}>
                {line}
              </span>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
