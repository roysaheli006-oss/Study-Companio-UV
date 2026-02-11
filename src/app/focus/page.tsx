
"use client";

import { FocusTimer } from '@/components/focus-timer';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function FocusPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex flex-col items-center">
      <div className="w-full max-w-5xl px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <FocusTimer />
      </div>
    </div>
  );
}
