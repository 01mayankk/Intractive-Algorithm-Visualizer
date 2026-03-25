import React from 'react';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 tracking-tight">
              AlgoViz <span className="text-primary-600 dark:text-primary-400">Pro X</span>
            </span>
            <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-md">
              The ultimate interactive learning platform for Data Structures, Algorithms, and Machine Learning. Master computer science visually.
            </p>
            <div className="flex space-x-6 mt-6">
              <a href="https://github.com/01mayankk" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300">
                <span className="sr-only">GitHub</span>
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Learning Paths</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/dsa" className="text-base text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400">DSA Foundations</Link>
              </li>
              <li>
                <Link to="/ml" className="text-base text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400">Machine Learning</Link>
              </li>
              <li>
                <Link to="/nn" className="text-base text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400">Neural Networks</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Resources</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400">Documentation</a>
              </li>
              <li>
                <a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400">Algorithm Theory</a>
              </li>
              <li>
                <a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400">Interview Prep</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8 flex items-center justify-between flex-col md:flex-row">
          <p className="text-base text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} AlgoViz Pro X. Made by Mayank.
          </p>
          <p className="text-sm flex items-center gap-1 text-slate-400 dark:text-slate-500 mt-4 md:mt-0">
            Built with <Heart className="w-4 h-4 text-red-500" /> and React.
          </p>
        </div>
      </div>
    </footer>
  );
}
