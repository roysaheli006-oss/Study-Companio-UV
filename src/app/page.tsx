
"use client";

import { StressSelector } from '@/components/stress-selector';
import { MotivationFeed } from '@/components/motivation-feed';
import { StudyRecommendations } from '@/components/study-recommendations';
import { StreakSystem } from '@/components/streak-system';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { useUser, useFirestore, useMemoFirebase, useDoc, useCollection, updateDocumentNonBlocking } from '@/firebase';
import { doc, collection, query } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: profile } = useDoc(userDocRef);

  // Syllabus tracking for progress
  const syllabusQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(collection(firestore, 'users', user.uid, 'syllabus'));
  }, [firestore, user?.uid]);
  const { data: syllabusItems } = useCollection(syllabusQuery);

  // Assignments for upcoming goals
  const assignmentsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(collection(firestore, 'users', user.uid, 'assignments'));
  }, [firestore, user?.uid]);
  const { data: assignments } = useCollection(assignmentsQuery);

  // Determine the display name
  const displayName = profile?.fullName || user?.displayName || (user ? 'Scholar' : 'Alex');

  // Calculate progress stats
  const totalTopics = syllabusItems?.length || 0;
  const completedTopics = syllabusItems?.filter(i => i.isCompleted).length || 0;
  const globalProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // Group progress by subject
  const subjectProgress = (profile?.subjects || []).map((subject: string) => {
    const subjectTopics = syllabusItems?.filter(i => i.subject === subject) || [];
    const total = subjectTopics.length;
    const completed = subjectTopics.filter(i => i.isCompleted).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { subject, percent, total };
  }).sort((a, b) => b.percent - a.percent);

  const mainSubject = subjectProgress[0] || { subject: 'No subjects', percent: 0 };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col mb-8">
        <h1 className="text-4xl font-headline font-bold tracking-tight mb-2">
          {isUserLoading ? 'Welcome back...' : `Welcome back, ${displayName}`}
        </h1>
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
                    <p className="text-indigo-100 text-sm mb-4">
                      {mainSubject.percent > 0 
                        ? `${mainSubject.subject} is your focus. You've mastered ${mainSubject.percent}% of the topics.`
                        : "Start adding syllabus topics in your profile to track mastery!"
                      }
                    </p>
                    <div className="w-full bg-indigo-800 rounded-full h-2 mb-2">
                       <div className="bg-white h-2 rounded-full transition-all duration-1000" style={{ width: `${mainSubject.percent}%` }}></div>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {globalProgress >= 50 ? 'Advanced Scholar' : 'Novice Scholar'} • {globalProgress}% Global
                    </span>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
               </CardContent>
            </Card>
          </section>

          <section>
             <Card className="border-none shadow-sm bg-white">
               <CardContent className="p-6">
                  <h3 className="font-headline font-bold mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-500" /> Upcoming Goals
                  </h3>
                  <div className="space-y-4">
                    {(assignments || [])
                      .filter(a => !a.isCompleted)
                      .slice(0, 3)
                      .map((assignment) => (
                        <div key={assignment.id} className="group">
                           <div className="flex justify-between text-sm mb-1">
                            <div className="flex items-center gap-2">
                              <Checkbox 
                                checked={assignment.isCompleted}
                                onCheckedChange={() => {
                                  if (!firestore || !user?.uid) return;
                                  const docRef = doc(firestore, 'users', user.uid, 'assignments', assignment.id);
                                  updateDocumentNonBlocking(docRef, { isCompleted: true });
                                }}
                              />
                              <span className="font-bold">{assignment.title}</span>
                            </div>
                            <span className="text-muted-foreground text-xs">{new Date(assignment.dueDate).toLocaleDateString()}</span>
                          </div>
                          <Badge variant="secondary" className="text-[9px] uppercase font-bold">{assignment.subject}</Badge>
                        </div>
                    ))}
                    {(!assignments || assignments.filter(a => !a.isCompleted).length === 0) && (
                      <p className="text-sm text-muted-foreground italic">No pending tasks. Take a break!</p>
                    )}
                  </div>
               </CardContent>
             </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
