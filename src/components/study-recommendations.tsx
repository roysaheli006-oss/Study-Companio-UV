
"use client";

import { useStress } from './stress-context';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Coffee, Brain, Zap, Clock } from 'lucide-react';
import Link from 'next/link';

export function StudyRecommendations() {
  const { stressLevel } = useStress();

  const recommendations = {
    low: {
      title: "High Performance Mode",
      subtitle: "You're ready for the big stuff.",
      tasks: [
        { title: "Deep Focus Session", duration: "60 min", icon: Brain, detail: "Best for complex problem solving" },
        { title: "Active Recall Blitz", duration: "45 min", icon: Zap, detail: "Test your knowledge on hard topics" }
      ],
      cta: "Start 60m Timer"
    },
    moderate: {
      title: "Structured Productivity",
      subtitle: "Maintain your steady rhythm.",
      tasks: [
        { title: "Classic Pomodoro", duration: "25 min", icon: Clock, detail: "Standard focus with clear breaks" },
        { title: "Task Breakdown", duration: "30 min", icon: BookOpen, detail: "Organize large topics into small pieces" }
      ],
      cta: "Start 25m Timer"
    },
    high: {
      title: "Gentle Progress",
      subtitle: "Small steps are still steps.",
      tasks: [
        { title: "Micro-study Session", duration: "10 min", icon: Coffee, detail: "Review just one small sub-topic" },
        { title: "Mindful Review", duration: "15 min", icon: Brain, detail: "Light reading without pressure" }
      ],
      cta: "Start 10m Timer"
    }
  };

  const current = recommendations[stressLevel];

  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <h2 className="font-headline text-2xl font-bold">{current.title}</h2>
        <p className="text-muted-foreground">{current.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {current.tasks.map((task, i) => {
          const Icon = task.icon;
          return (
            <Card key={i} className="group hover:border-primary transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 rounded-lg bg-secondary text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded text-slate-500">
                    {task.duration}
                  </span>
                </div>
                <h3 className="font-headline font-bold mb-1">{task.title}</h3>
                <p className="text-sm text-muted-foreground">{task.detail}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Link href="/focus" className="block w-full">
        <Button size="lg" className="w-full font-headline font-bold text-lg h-14 rounded-2xl shadow-md hover:shadow-lg transition-all">
          {current.cta}
        </Button>
      </Link>
    </div>
  );
}
