"use client";

import { useStress } from './stress-context';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, Trophy, Award, Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export function StreakSystem() {
  const { streak } = useStress();
  const nextMilestone = 7;
  const progress = (streak / nextMilestone) * 100;

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
              <Flame className="w-8 h-8 text-orange-500 fill-current" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-2xl">{streak} Days</h3>
              <p className="text-sm text-orange-600 font-medium">Burning Bright!</p>
            </div>
          </div>
          <Trophy className="w-10 h-10 text-amber-400 opacity-50" />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm font-bold">
            <span className="text-orange-700">Next Milestone: 7 Days</span>
            <span className="text-orange-700">{streak}/{nextMilestone}</span>
          </div>
          <Progress value={progress} className="h-3 bg-orange-100" />
        </div>

        <div className="mt-8 grid grid-cols-4 gap-2">
          <BadgeSlot active={streak >= 1} icon={Star} label="1st Day" />
          <BadgeSlot active={streak >= 3} icon={Award} label="3 Day" />
          <BadgeSlot active={streak >= 5} icon={Flame} label="5 Day" />
          <BadgeSlot active={streak >= 7} icon={Trophy} label="Week" />
        </div>
      </CardContent>
    </Card>
  );
}

function BadgeSlot({ active, icon: Icon, label }: { active: boolean; icon: any; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all",
        active ? "bg-white border-orange-400 text-orange-500 shadow-sm" : "bg-slate-100 border-dashed border-slate-300 text-slate-300"
      )}>
        <Icon className={cn("w-6 h-6", active && "fill-current")} />
      </div>
      <span className={cn("text-[10px] font-bold uppercase tracking-tighter", active ? "text-orange-600" : "text-slate-400")}>
        {label}
      </span>
    </div>
  );
}
