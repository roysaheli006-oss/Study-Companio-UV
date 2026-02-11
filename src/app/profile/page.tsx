
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { User as UserIcon, Shield, Palette, Loader2, LogOut, ArrowRight, Settings2, BookOpen } from 'lucide-react';
import { useUser, useFirestore, useMemoFirebase, useDoc, setDocumentNonBlocking, useAuth } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { signOut } from 'firebase/auth';
import { StudyPlanManager } from '@/components/study-plan-manager';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userDocRef);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setEmail(profile.email || '');
    } else if (user) {
      setFullName(fullName || user.displayName || '');
      setEmail(email || user.email || '');
    }
  }, [profile, user]);

  const handleUpdateProfile = () => {
    if (!userDocRef || !user?.uid) return;

    setIsSaving(true);
    const data = {
      ...profile,
      id: user.uid,
      fullName,
      email,
    };

    setDocumentNonBlocking(userDocRef, data, { merge: true });
    
    toast({
      title: "Profile Updated",
      description: "Your basic info has been saved.",
    });
    
    setTimeout(() => setIsSaving(false), 500);
  };

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    toast({
      title: "Logged Out",
      description: "You have been successfully signed out.",
    });
  };

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-xl">
        <Card className="p-8 border-none shadow-xl bg-white">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserIcon className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-3xl font-headline font-bold mb-4">Join the Community</h2>
          <p className="text-muted-foreground mb-8 text-lg">Sign in to track your streaks, customize your experience, and save your progress.</p>
          <Link href="/login">
            <Button size="lg" className="w-full gap-2 text-lg font-bold">
              Sign In or Create Account <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-headline font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your profile, subjects, and study plan.</p>
        </div>
        <Button variant="outline" className="text-destructive hover:bg-destructive/10" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Plan Manager */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-headline font-bold">Study Plan</h2>
          </div>
          <StudyPlanManager />
        </div>

        {/* Right Column: Settings & Profile */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Settings2 className="w-6 h-6 text-slate-600" />
            <h2 className="text-2xl font-headline font-bold">Account</h2>
          </div>
          
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserIcon className="w-5 h-5" /> Basic Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName"
                  placeholder="Your Name"
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button onClick={handleUpdateProfile} disabled={isSaving} className="w-full">
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5" /> Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Hard Lock Mode</Label>
                  <p className="text-xs text-muted-foreground">Force app focus during timer.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mental Health Reminders</Label>
                  <p className="text-xs text-muted-foreground">Receive breathing tips when stressed.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
