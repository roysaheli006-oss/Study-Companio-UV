
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Brain, Clock, Zap, Target } from 'lucide-react';

const WEEKLY_DATA = [
  { day: 'Mon', hours: 4, stress: 'low' },
  { day: 'Tue', hours: 2.5, stress: 'moderate' },
  { day: 'Wed', hours: 6, stress: 'low' },
  { day: 'Thu', hours: 1.5, stress: 'high' },
  { day: 'Fri', hours: 3.5, stress: 'moderate' },
  { day: 'Sat', hours: 0.5, stress: 'high' },
  { day: 'Sun', hours: 2, stress: 'low' },
];

const STRESS_DISTRIBUTION = [
  { name: 'Low Stress', value: 45, color: '#4CAF50' },
  { name: 'Moderate', value: 35, color: '#FFC107' },
  { name: 'High Stress', value: 20, color: '#F44336' },
];

export function StatsDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Clock} label="Study Time" value="20.5 hrs" detail="+12% from last week" />
        <StatCard icon={Target} label="Tasks Done" value="24" detail="89% completion rate" />
        <StatCard icon={Zap} label="Focus Score" value="92" detail="Top 5% this month" />
        <StatCard icon={Brain} label="Stress Peak" value="Low" detail="Mostly calm mornings" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-headline">Weekly Productivity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WEEKLY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                    {WEEKLY_DATA.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.stress === 'low' ? '#4CAF50' : 
                          entry.stress === 'moderate' ? '#FFC107' : '#F44336'
                        } 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-headline">Stress Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
             <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={STRESS_DISTRIBUTION}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {STRESS_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="mt-4 space-y-2 w-full">
                {STRESS_DISTRIBUTION.map((item) => (
                  <div key={item.name} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-bold">{item.value}%</span>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-none bg-green-50/50">
        <CardContent className="p-6 flex items-start gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm">
            <Brain className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-headline font-bold text-lg text-green-900">Stress-Aware Insight</h3>
            <p className="text-green-800 text-sm leading-relaxed mt-1">
              "You tend to enter 'High Focus' states primarily on Mondays and Wednesdays when your stress level is Low. 
              Try moving your most difficult subjects to these morning slots for maximum efficiency."
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, detail }: { icon: any; label: string; value: string; detail: string }) {
  return (
    <Card className="border-none shadow-sm bg-white">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-headline font-bold tracking-tight">{value}</span>
          <span className="text-xs font-bold text-green-600 mt-1">{detail}</span>
        </div>
      </CardContent>
    </Card>
  );
}
