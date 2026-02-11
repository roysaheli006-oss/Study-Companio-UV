
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Trash2, 
  BookOpen, 
  ListTodo, 
  Calendar,
  Loader2
} from 'lucide-react';
import { 
  useUser, 
  useFirestore, 
  useMemoFirebase, 
  useCollection, 
  useDoc,
  setDocumentNonBlocking,
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
  deleteDocumentNonBlocking
} from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function StudyPlanManager() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [newSubject, setNewSubject] = useState('');
  const [newSyllabusTopic, setNewSyllabusTopic] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
  const [newAssignmentDate, setNewAssignmentDate] = useState('');

  // User Profile for subjects
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);
  const { data: profile } = useDoc(userDocRef);

  // Syllabus items
  const syllabusQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(collection(firestore, 'users', user.uid, 'syllabus'));
  }, [firestore, user?.uid]);
  const { data: syllabusItems } = useCollection(syllabusQuery);

  // Assignments
  const assignmentsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(collection(firestore, 'users', user.uid, 'assignments'));
  }, [firestore, user?.uid]);
  const { data: assignments } = useCollection(assignmentsQuery);

  const handleAddSubject = () => {
    if (!newSubject.trim() || !userDocRef || !user?.uid) return;
    
    const currentSubjects = profile?.subjects || [];
    // Prevent duplicates
    if (currentSubjects.includes(newSubject.trim())) {
      toast({ title: "Already exists", description: "This subject is already in your list.", variant: "destructive" });
      return;
    }

    const updatedSubjects = [...currentSubjects, newSubject.trim()];
    
    setDocumentNonBlocking(userDocRef, { 
      ...profile,
      id: user.uid,
      subjects: updatedSubjects 
    }, { merge: true });
    
    setNewSubject('');
    toast({ title: "Subject Added", description: `${newSubject} has been added to your list.` });
  };

  const handleRemoveSubject = (subjectToRemove: string) => {
    if (!userDocRef || !profile) return;
    const updatedSubjects = (profile.subjects || []).filter(s => s !== subjectToRemove);
    setDocumentNonBlocking(userDocRef, { ...profile, subjects: updatedSubjects }, { merge: true });
    toast({ title: "Subject Removed", description: `${subjectToRemove} has been removed.` });
  };

  const handleAddSyllabus = () => {
    if (!newSyllabusTopic.trim() || !selectedSubject || !firestore || !user?.uid) return;
    const colRef = collection(firestore, 'users', user.uid, 'syllabus');
    addDocumentNonBlocking(colRef, {
      userId: user.uid,
      subject: selectedSubject,
      topic: newSyllabusTopic.trim(),
      isCompleted: false
    });
    setNewSyllabusTopic('');
    toast({ title: "Topic Added", description: `Added "${newSyllabusTopic}" to ${selectedSubject}.` });
  };

  const toggleSyllabusCompletion = (id: string, current: boolean) => {
    if (!firestore || !user?.uid) return;
    const docRef = doc(firestore, 'users', user.uid, 'syllabus', id);
    updateDocumentNonBlocking(docRef, { isCompleted: !current });
  };

  const handleDeleteSyllabus = (id: string) => {
    if (!firestore || !user?.uid) return;
    const docRef = doc(firestore, 'users', user.uid, 'syllabus', id);
    deleteDocumentNonBlocking(docRef);
  };

  const handleAddAssignment = () => {
    if (!newAssignmentTitle.trim() || !selectedSubject || !firestore || !user?.uid) return;
    const colRef = collection(firestore, 'users', user.uid, 'assignments');
    addDocumentNonBlocking(colRef, {
      userId: user.uid,
      subject: selectedSubject,
      title: newAssignmentTitle.trim(),
      dueDate: newAssignmentDate || new Date().toISOString(),
      isCompleted: false
    });
    setNewAssignmentTitle('');
    setNewAssignmentDate('');
    toast({ title: "Assignment Added", description: `Added task for ${selectedSubject}.` });
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Subjects Management */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" /> Subjects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Input 
              placeholder="e.g. Biology, Math" 
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSubject()}
            />
            <Button onClick={handleAddSubject} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(profile?.subjects || []).map((subject: string) => (
              <Badge key={subject} variant="secondary" className="pl-3 py-1 text-sm gap-2">
                {subject}
                <button 
                  onClick={() => handleRemoveSubject(subject)}
                  className="hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {(!profile?.subjects || profile.subjects.length === 0) && (
              <p className="text-sm text-muted-foreground">No subjects added yet. Type a subject above and click +</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="syllabus" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="syllabus" className="gap-2"><ListTodo className="w-4 h-4" /> Syllabus</TabsTrigger>
          <TabsTrigger value="assignments" className="gap-2"><Calendar className="w-4 h-4" /> Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="syllabus">
          <Card className="border-none shadow-sm mt-4">
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <select 
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                  >
                    <option value="">Select a subject</option>
                    {(profile?.subjects || []).map((s: string) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>New Topic</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="e.g. Cell Structure" 
                      value={newSyllabusTopic}
                      onChange={(e) => setNewSyllabusTopic(e.target.value)}
                    />
                    <Button onClick={handleAddSyllabus} disabled={!selectedSubject}>
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mt-6">
                <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Your Syllabus Topics</h4>
                <div className="divide-y border rounded-lg">
                  {(syllabusItems || []).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 group">
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={item.isCompleted} 
                          onCheckedChange={() => toggleSyllabusCompletion(item.id, item.isCompleted)}
                        />
                        <div>
                          <p className={cn("font-medium", item.isCompleted && "line-through text-muted-foreground")}>
                            {item.topic}
                          </p>
                          <Badge variant="outline" className="text-[10px]">{item.subject}</Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteSyllabus(item.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  {(!syllabusItems || syllabusItems.length === 0) && (
                    <p className="p-8 text-center text-sm text-muted-foreground">Add topics to track your progress.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <Card className="border-none shadow-sm mt-4">
            <CardContent className="pt-6 space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <select 
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                  >
                    <option value="">Select a subject</option>
                    {(profile?.subjects || []).map((s: string) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Assignment Title</Label>
                  <Input 
                    placeholder="e.g. Term Paper" 
                    value={newAssignmentTitle}
                    onChange={(e) => setNewAssignmentTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="date"
                      value={newAssignmentDate}
                      onChange={(e) => setNewAssignmentDate(e.target.value)}
                    />
                    <Button onClick={handleAddAssignment} disabled={!selectedSubject || !newAssignmentTitle}>
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mt-6">
                 <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Upcoming Tasks</h4>
                 <div className="divide-y border rounded-lg">
                  {(assignments || []).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 group">
                       <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={item.isCompleted} 
                          onCheckedChange={() => {
                            if (!firestore || !user?.uid) return;
                            const docRef = doc(firestore, 'users', user.uid, 'assignments', item.id);
                            updateDocumentNonBlocking(docRef, { isCompleted: !item.isCompleted });
                          }}
                        />
                        <div>
                          <p className={cn("font-medium", item.isCompleted && "line-through text-muted-foreground")}>
                            {item.title}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px]">{item.subject}</Badge>
                            <span className="text-[10px] text-muted-foreground">Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => {
                        if (!firestore || !user?.uid) return;
                        const docRef = doc(firestore, 'users', user.uid, 'assignments', item.id);
                        deleteDocumentNonBlocking(docRef);
                      }} className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                   {(!assignments || assignments.length === 0) && (
                    <p className="p-8 text-center text-sm text-muted-foreground">No assignments pending.</p>
                  )}
                 </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
