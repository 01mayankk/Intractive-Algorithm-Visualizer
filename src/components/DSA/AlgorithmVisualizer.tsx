import React, { useState } from 'react';
import Controls from './Controls';
import StepExplanation from './StepExplanation';
import Editor from '@monaco-editor/react';
import { Play } from 'lucide-react';

export interface Complexities {
  best: string;
  average: string;
  worst: string;
  space: string;
}

interface AlgorithmVisualizerProps {
  title: string;
  description: string;
  
  // Logic & Explanation
  codeSnippet: string;
  explanationText: string;
  activeLine: number;
  
  // Content Tabs
  complexities: Complexities;
  theoryContent?: React.ReactNode;
  interviewContent?: React.ReactNode;
  
  // Animation state
  isPlaying: boolean;
  canStep: boolean;
  speed: number;
  
  // Callbacks
  onPlayPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  
  // Render function for the actual D3/Canvas visual
  children: React.ReactNode;
}

export default function AlgorithmVisualizer({
  title,
  description,
  codeSnippet,
  explanationText,
  activeLine,
  complexities,
  theoryContent,
  interviewContent,
  isPlaying,
  canStep,
  speed,
  onPlayPause,
  onStep,
  onReset,
  onSpeedChange,
  children
}: AlgorithmVisualizerProps) {
  
  const [activeTab, setActiveTab] = useState<'visual' | 'theory' | 'interview' | 'editor'>('visual');
  const [userCode, setUserCode] = useState(codeSnippet);
  const [editorResult, setEditorResult] = useState<string>('');

  const handleRunCode = () => {
    // Basic simulation for code running
    setEditorResult("Code Simulation: Execution started...\\nRunning your logic...\\n[Simulation] Algorithm completed successfully!\\nNote: In-browser C++ execution is simulated.");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full h-[calc(100vh-8rem)]">
      
      {/* Left Column - Main Stage */}
      <div className="flex flex-col gap-4 flex-[2] h-full w-full">
        {/* Header & Tabs */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between items-start gap-4">
          <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary-500 animate-pulse"></span>
                {title}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-lg text-sm">{description}</p>
            </div>
            
            {/* Mode Select */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 overflow-x-auto max-w-full">
              {['visual', 'theory', 'interview', 'editor'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setActiveTab(mode as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all whitespace-nowrap ${activeTab === mode ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Complexity Badges */}
          <div className="flex flex-wrap gap-3 mt-2">
            <div className="px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold border border-green-100 dark:border-green-800">
              Best (Ω): {complexities.best}
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold border border-yellow-100 dark:border-yellow-800">
              Avg (Θ): {complexities.average}
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold border border-red-100 dark:border-red-800">
              Worst (O): {complexities.worst}
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-bold border border-indigo-100 dark:border-indigo-800">
              Space: {complexities.space}
            </div>
          </div>
        </div>

        {/* Dynamic Content Stage */}
        <div className="glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex-grow relative overflow-hidden flex flex-col items-center justify-center p-8 bg-white/40 dark:bg-slate-900/40 min-h-[400px]">
           
           {activeTab === 'visual' && children}

           {activeTab === 'theory' && (
             <div className="w-full h-full overflow-y-auto text-slate-700 dark:text-slate-300 prose dark:prose-invert">
               {theoryContent || "Theory documentation coming soon."}
             </div>
           )}

           {activeTab === 'interview' && (
             <div className="w-full h-full overflow-y-auto text-slate-700 dark:text-slate-300 prose dark:prose-invert">
               {interviewContent || "Interview questions and patterns coming soon."}
             </div>
           )}

           {activeTab === 'editor' && (
             <div className="w-full h-full flex flex-col gap-4">
               <div className="flex justify-between items-center">
                 <h3 className="font-bold text-slate-800 dark:text-slate-200">Interactive C++ Editor</h3>
                 <button onClick={handleRunCode} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center font-bold gap-2 text-sm transition-transform hover:scale-105">
                   <Play className="w-4 h-4" /> Run Simulation
                 </button>
               </div>
               <div className="flex-grow rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700">
                 <Editor
                   height="100%"
                   language="cpp"
                   theme="vs-dark"
                   value={userCode}
                   onChange={(val) => setUserCode(val || '')}
                   options={{ minimap: { enabled: false }, fontSize: 14 }}
                 />
               </div>
               {editorResult && (
                 <div className="h-32 bg-black text-green-400 font-mono text-sm p-4 rounded-xl overflow-y-auto whitespace-pre-wrap">
                   {editorResult}
                 </div>
               )}
             </div>
           )}
        </div>

        {/* Controls (Only show in visual mode) */}
        {activeTab === 'visual' && (
          <Controls 
            isPlaying={isPlaying}
            onPlayPause={onPlayPause}
            onStep={onStep}
            onReset={onReset}
            speed={speed}
            onSpeedChange={onSpeedChange}
            canStep={canStep}
          />
        )}
      </div>

      {/* Right Column - Step Explanation & Code */}
      <div className="flex-1 h-full min-w-[300px]">
        <StepExplanation 
          explanationText={explanationText}
          codeSnippet={codeSnippet}
          activeLine={activeLine}
        />
      </div>

    </div>
  );
}
