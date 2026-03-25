import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface AppWrapperProps {
  children: React.ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {
  return (
    <div className="min-h-screen flex flex-col relative transition-colors duration-300">
      {/* Animated background particles/grid layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern dark:bg-grid-pattern-dark opacity-[0.2]" />
        
        {/* Subtle gradient blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-400/20 dark:bg-primary-600/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-[20%] right-[-5%] w-96 h-96 bg-violet-400/20 dark:bg-violet-600/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-cyan-400/20 dark:bg-cyan-600/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <Navbar />

      <main className="flex-grow pt-20 z-10 relative flex flex-col">
        {children}
      </main>

      <div className="z-10 relative">
        <Footer />
      </div>
    </div>
  );
}
