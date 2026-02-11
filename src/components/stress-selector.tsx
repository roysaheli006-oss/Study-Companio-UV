
"use client";

import { useStress, StressLevel } from './stress-context';
import { cn } from '@/lib/utils';
import { Smile, Meh, AlertCircle } from 'lucide-react';

export function StressSelector() {
  const { stressLevel, setStressLevel } = useStress();

  const options: { level: StressLevel; icon: any; label: string; description: string; color: string }[] = [
    { 
      level: 'low', 
      icon: Smile, 
      label: 'Energetic', 
      description: 'Ready for deep focus',
      color: 'bg-stress-low' 
    },
    { 
      level: 'moderate', 
      icon: Meh, 
      label: 'Balanced', 
      description: 'Steady and productive',
      color: 'bg-stress-moderate' 
    },
    { 
      level: 'high', 
      icon: AlertCircle, 
      label: 'Stressed', 
      description: 'Needs gentle pacing',
      color: 'bg-stress-high' 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = stressLevel === opt.level;
        
        return (
          <button
            key={opt.level}
            onClick={() => setStressLevel(opt.level)}
            className={cn(
              "flex flex-col items-center p-6 rounded-2xl border-2 transition-all duration-300 text-left",
              isActive 
                ? cn("border-transparent shadow-lg scale-105", opt.color, "text-white") 
                : "border-border bg-white hover:border-slate-300 text-foreground"
            )}
          >
            <Icon className={cn("w-10 h-10 mb-3", isActive ? "text-white" : "text-slate-400")} />
            <h3 className="font-headline font-bold text-lg">{opt.label}</h3>
            <p className={cn("text-xs mt-1", isActive ? "text-white/80" : "text-muted-foreground")}>
              {opt.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
