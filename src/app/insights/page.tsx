"use client";

import { StatsDashboard } from '@/components/stats-dashboard';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function InsightsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Back Home
      </Link>
      
      <div className="mb-10">
        <h1 className="text-4xl font-headline font-bold mb-2">Performance Insights</h1>
        <p className="text-muted-foreground text-lg">Track your habits and emotional patterns.</p>
      </div>

      <StatsDashboard />
    </div>
  );
}
