import React from 'react';
import HeroSection from '../components/Home/HeroSection';
import StatsSection from '../components/Home/StatsSection';
import FeatureShowcase from '../components/Home/FeatureShowcase';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <StatsSection />
      <FeatureShowcase />
    </div>
  );
}
