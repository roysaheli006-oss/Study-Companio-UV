"use client";

import { useStress } from './stress-context';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Wind, Target, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const FEED_DATA = {
  low: [
    { id: 1, type: 'focus', title: 'Deep Focus Challenge', content: 'You are in a prime state for deep work. Can you hit 60 minutes today?', icon: Target },
    { id: 2, type: 'news', title: 'The Power of Flow', content: 'Recent studies show that starting with your hardest task while energetic leads to 40% higher completion rates.', icon: Sparkles },
    { id: 3, type: 'motivation', title: 'Excellence is a habit', content: 'Keep this momentum. Your brain is firing on all cylinders!', icon: Heart }
  ],
  moderate: [
    { id: 4, type: 'tip', title: 'The Pomodoro Edge', content: 'Try 25/5 cycles. It keeps your moderate energy levels consistent for longer.', icon: Target },
    { id: 5, type: 'news', title: 'Healthy Balance', content: 'Taking a 10-minute walk after 40 minutes of study resets focus better than scrolling.', icon: Sparkles },
    { id: 6, type: 'motivation', title: 'You are doing enough', content: 'Consistency is better than intensity. Keep showing up.', icon: Heart }
  ],
  high: [
    { id: 7, type: 'calm', title: 'Box Breathing Tip', content: 'Inhale 4, Hold 4, Exhale 4, Hold 4. Repeat 3 times to lower cortisol.', icon: Wind },
    { id: 8, type: 'tip', title: 'The 5-Minute Rule', content: 'Just commit to 5 minutes. If you want to stop then, you can.', icon: Target },
    { id: 9, type: 'motivation', title: 'Be kind to yourself', content: 'Study for a little while, then rest. Your well-being is the priority.', icon: Heart }
  ]
};

export function MotivationFeed() {
  const { stressLevel } = useStress();
  const currentFeed = FEED_DATA[stressLevel];

  return (
    <div className="space-y-4">
      <h2 className="font-headline text-xl font-bold flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-amber-500" />
        For You Right Now
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {currentFeed.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex gap-4 items-start">
                <div className={cn(
                  "p-3 rounded-xl",
                  stressLevel === 'low' ? "bg-stress-low/10 text-stress-low" :
                  stressLevel === 'moderate' ? "bg-stress-moderate/10 text-stress-moderate" :
                  "bg-stress-high/10 text-stress-high"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                      {item.type}
                    </Badge>
                    <span className="font-semibold text-sm">{item.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.content}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
