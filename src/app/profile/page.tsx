
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { User, Bell, Shield, Palette } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-10">
        <h1 className="text-4xl font-headline font-bold mb-2">Your Profile</h1>
        <p className="text-muted-foreground">Manage your preferences and stress-aware settings.</p>
      </div>

      <div className="space-y-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" /> Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input defaultValue="Alex Johnson" />
               </div>
               <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue="alex@example.com" disabled />
               </div>
            </div>
            <Button>Update Profile</Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" /> Focus Protection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Hard Lock Mode</Label>
                <p className="text-sm text-muted-foreground">Force app focus and disable all but emergency notifications.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Break Penalties</Label>
                <p className="text-sm text-muted-foreground">Deduct streak points if session is abandoned while locked.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" /> Stress UI Adaptation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Automatic Stress Colors</Label>
                <p className="text-sm text-muted-foreground">Adjust interface colors based on your current stress selection.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mental Health Reminders</Label>
                <p className="text-sm text-muted-foreground">Receive breathing and stretch tips when High Stress is detected.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
