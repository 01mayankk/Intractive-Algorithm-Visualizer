import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SortingVisualizer from './visualizers/SortingVisualizer';
import SearchingVisualizer from './visualizers/SearchingVisualizer';
import GraphVisualizer from './visualizers/GraphVisualizer';
import DataStructuresVisualizer from './visualizers/DataStructuresVisualizer';

import './App.css';

function App() {
  const sortRef = useRef();

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar sortRef={sortRef} />
          <main className="flex-1 p-4 overflow-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/sorting" />} />
              <Route path="/sorting" element={<SortingVisualizer ref={sortRef} />} />
              <Route path="/searching" element={<SearchingVisualizer />} />
              <Route path="/graph" element={<GraphVisualizer />} />
              <Route path="/data-structures" element={<DataStructuresVisualizer />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
