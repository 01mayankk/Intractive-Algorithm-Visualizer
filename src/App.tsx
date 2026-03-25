import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppWrapper from './components/Layout/AppWrapper';
import Home from './pages/Home';
import DSA from './pages/DSA';
import ML from './pages/ML';
import NN from './pages/NN';

export default function App() {
  return (
    <AppWrapper>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dsa/*" element={<DSA />} />
        <Route path="/ml/*" element={<ML />} />
        <Route path="/nn/*" element={<NN />} />
      </Routes>
    </AppWrapper>
  );
}
