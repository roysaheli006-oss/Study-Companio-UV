
"use client";

import React, { useState, useEffect } from 'react';
import { useStress } from './stress-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Lock, Unlock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function FocusTimer() {
  const { stressLevel, incrementStreak } = useStress();
  const { toast } = useToast();

  const getInitialTime = () => {
    if (stressLevel === 'low') return 60 * 60;
    if (stressLevel === 'moderate') return 25 * 60;
    return 10 * 60;
  };

  const [timeLeft, setTimeLeft] = useState(getInitialTime());
  const [isActive, setIsActive] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    setTimeLeft(getInitialTime());
  }, [stressLevel]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setIsLocked(false);
      incrementStreak();
      toast({
        title: "Session Complete! 🎉",
        description: "Great job maintaining focus. You earned streak points!",
      });
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setIsLocked(false);
    setTimeLeft(getInitialTime());
  };

  const toggleLock = () => {
    if (!isActive) {
      toast({
        title: "Start timer first",
        description: "Focus lock can only be enabled during an active session.",
        variant: "destructive"
      });
      return;
    }
    setIsLocked(!isLocked);
    if (!isLocked) {
      toast({
        title: "Focus Lock Enabled 🔒",
        description: "Notifications silenced. Exit now and session will void.",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / getInitialTime()) * 100;

  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 min-h-[60vh] transition-all duration-700 rounded-[2rem]",
      isLocked ? "bg-slate-950 text-white" : "bg-white"
    )}>
      {isLocked && (
        <div className="absolute top-20 text-center animate-pulse">
          <div className="flex items-center gap-2 text-amber-500 font-bold mb-2">
            <Lock className="w-4 h-4" /> Focus Mode Active
          </div>
          <p className="text-slate-400 text-sm">Stay on this screen to keep your streak</p>
        </div>
      )}

      <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
        {/* Progress ring simplified as a div border */}
        <div className="absolute inset-0 rounded-full border-[12px] border-slate-100 opacity-20" />
        <div 
          className={cn(
            "absolute inset-0 rounded-full border-[12px] transition-all duration-1000",
            stressLevel === 'low' ? "border-stress-low" :
            stressLevel === 'moderate' ? "border-stress-moderate" :
            "border-stress-high"
          )}
          style={{ 
            clipPath: `inset(0 ${100 - progress}% 0 0)`,
            filter: isLocked ? 'brightness(1.5)' : 'none'
          }}
        />
        
        <div className="text-center z-10">
          <h1 className="text-7xl md:text-9xl font-headline font-bold tabular-nums">
            {formatTime(timeLeft)}
          </h1>
          <p className={cn("text-lg font-medium mt-2", isLocked ? "text-slate-400" : "text-muted-foreground")}>
            {stressLevel.toUpperCase()} INTENSITY
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-12 justify-center">
        <Button 
          size="lg" 
          variant={isLocked ? "outline" : "default"}
          className={cn("w-16 h-16 rounded-full", isLocked && "border-slate-800 hover:bg-slate-800")}
          onClick={toggleTimer}
          disabled={isLocked && isActive}
        >
          {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </Button>

        <Button 
          size="lg" 
          variant="outline" 
          className={cn("w-16 h-16 rounded-full", isLocked && "border-slate-800 text-white hover:bg-slate-800")}
          onClick={resetTimer}
          disabled={isLocked}
        >
          <RotateCcw className="w-6 h-6" />
        </Button>

        <Button 
          size="lg" 
          variant={isLocked ? "destructive" : "secondary"}
          className={cn("w-16 h-16 rounded-full transition-all", isLocked && "bg-stress-high hover:bg-red-700")}
          onClick={toggleLock}
        >
          {isLocked ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
        </Button>
      </div>

      {isLocked && (
        <div className="mt-8 flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest">
          <AlertTriangle className="w-3 h-3 text-amber-600" /> Notifications Blocked
        </div>
      )}
    </div>
  );
}
