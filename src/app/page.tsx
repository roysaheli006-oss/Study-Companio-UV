
"use client";

import { StressSelector } from '@/components/stress-selector';
import { MotivationFeed } from '@/components/motivation-feed';
import { StudyRecommendations } from '@/components/study-recommendations';
import { StreakSystem } from '@/components/streak-system';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col mb-8">
        <h1 className="text-4xl font-headline font-bold tracking-tight mb-2">Welcome back, Alex</h1>
        <p className="text-muted-foreground text-lg">How are you feeling about your study goals today?</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Stress Selection & Recommendations */}
        <div className="lg:col-span-8 space-y-10">
          <section>
            <StressSelector />
          </section>

          <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <StudyRecommendations />
          </section>

          <section>
             <MotivationFeed />
          </section>
        </div>

        {/* Right Side: Streak & Stats Summary */}
        <div className="lg:col-span-4 space-y-8">
          <section>
            <StreakSystem />
          </section>

          <section>
            <Card className="border-none shadow-sm bg-indigo-600 text-white overflow-hidden">
               <CardContent className="p-6 relative">
                  <div className="relative z-10">
                    <h3 className="font-headline font-bold text-xl mb-2">Subject Mastery</h3>
                    <p className="text-indigo-100 text-sm mb-4">Biology is your focus today. You've mastered 68% of the curriculum.</p>
                    <div className="w-full bg-indigo-800 rounded-full h-2 mb-2">
                       <div className="bg-white h-2 rounded-full w-[68%]"></div>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">Level 12 Scholar</span>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
               </CardContent>
            </Card>
          </section>

          <section>
             <Card className="border-none shadow-sm bg-white">
               <CardContent className="p-6">
                  <h3 className="font-headline font-bold mb-4">Upcoming Goals</h3>
                  <div className="space-y-4">
                     <GoalItem label="Final Exam Prep" date="Next Friday" progress={40} />
                     <GoalItem label="Biology Thesis" date="Dec 12" progress={15} />
                  </div>
               </CardContent>
             </Card>
          </section>
        </div>
      </div>
    </div>
  );
}

function GoalItem({ label, date, progress }: { label: string; date: string; progress: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-bold">{label}</span>
        <span className="text-muted-foreground">{date}</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-1.5">
         <div className="bg-primary h-1.5 rounded-full" style={{width: `${progress}%`}}></div>
      </div>
    </div>
  );
}
