import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Zap, Cpu, MousePointerClick } from 'lucide-react';

const features = [
  {
    name: 'Real-time Visualization',
    description: 'Watch algorithms unfold step-by-step with smooth, responsive animations that make complex logic obvious.',
    icon: Zap,
    color: 'text-yellow-500',
    bg: 'bg-yellow-100 dark:bg-yellow-900/30'
  },
  {
    name: 'Step-by-Step Explanation',
    description: 'Every single state change is explained in plain English, bridging the gap between code and intuition.',
    icon: Layers,
    color: 'text-blue-500',
    bg: 'bg-blue-100 dark:bg-blue-900/30'
  },
  {
    name: 'Code & Theory Sync',
    description: 'See the actual C++ logic highlight exactly when it executes. No more guessing what the code does.',
    icon: Cpu,
    color: 'text-primary-500',
    bg: 'bg-primary-100 dark:bg-primary-900/30'
  },
  {
    name: '100% Interactive',
    description: 'Pause, play, step forward, change speed, or modify the input array instantly. You are in control.',
    icon: MousePointerClick,
    color: 'text-green-500',
    bg: 'bg-green-100 dark:bg-green-900/30'
  }
];

export default function FeatureShowcase() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Everything you need to <span className="text-gradient">nail the interview.</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Ditch the static textbooks and boring slides. Learn the way your brain is wired to understand: visually and interactively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-panel p-8 rounded-3xl hover:-translate-y-1 transition-transform duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {feature.name}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
