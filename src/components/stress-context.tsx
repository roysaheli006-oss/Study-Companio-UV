
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type StressLevel = 'low' | 'moderate' | 'high';

interface StressContextType {
  stressLevel: StressLevel;
  setStressLevel: (level: StressLevel) => void;
  streak: number;
  incrementStreak: () => void;
}

const StressContext = createContext<StressContextType | undefined>(undefined);

export function StressProvider({ children }: { children: React.ReactNode }) {
  const [stressLevel, setStressLevel] = useState<StressLevel>('low');
  const [streak, setStreak] = useState(5); // Default for prototype

  const incrementStreak = () => setStreak(prev => prev + 1);

  return (
    <StressContext.Provider value={{ stressLevel, setStressLevel, streak, incrementStreak }}>
      {children}
    </StressContext.Provider>
  );
}

export function useStress() {
  const context = useContext(StressContext);
  if (context === undefined) {
    throw new Error('useStress must be used within a StressProvider');
  }
  return context;
}
