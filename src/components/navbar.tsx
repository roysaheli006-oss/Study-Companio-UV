
"use client";

import Link from 'next/link';
import { Home, Timer, PieChart, User, Flame } from 'lucide-react';
import { useStress } from './stress-context';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { streak, stressLevel } = useStress();

  const stressColors = {
    low: 'text-stress-low',
    moderate: 'text-stress-moderate',
    high: 'text-stress-high',
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className={cn("p-1.5 rounded-lg bg-primary", stressColors[stressLevel])}>
            <Flame className="w-6 h-6 fill-current text-white" />
          </div>
          <span className="font-headline font-bold text-xl">Study Companion</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <NavLink href="/" icon={<Home className="w-4 h-4" />} label="Dashboard" />
          <NavLink href="/focus" icon={<Timer className="w-4 h-4" />} label="Focus" />
          <NavLink href="/insights" icon={<PieChart className="w-4 h-4" />} label="Insights" />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-full border border-orange-100">
            <Flame className="w-4 h-4 text-orange-500 fill-current" />
            <span className="font-bold text-sm">{streak} Day Streak</span>
          </div>
          <Link href="/profile">
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden">
               <User className="w-5 h-5 text-slate-500" />
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
    >
      {icon}
      {label}
    </Link>
  );
}
