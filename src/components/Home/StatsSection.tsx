import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { id: 1, name: 'Algorithms', value: '50+' },
  { id: 2, name: 'Interactive', value: '100%' },
  { id: 3, name: 'ML Models', value: '10+' },
  { id: 4, name: 'Data Structures', value: '15+' },
];

export default function StatsSection() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-extrabold text-primary-600 dark:text-primary-400 mb-2 font-mono">
                {stat.value}
              </div>
              <div className="text-sm md:text-base font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {stat.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
