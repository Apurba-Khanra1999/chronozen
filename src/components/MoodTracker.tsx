
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { Mood, MoodEntry, Task } from "@/lib/types";
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Textarea } from './ui/textarea';
import { cn } from '@/lib/utils';
import { Save, Meh, Smile, Frown, Laugh, Angry, Sparkles, Heart, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface MoodTrackerProps {
  moods: MoodEntry[];
  selectedDate: Date;
  onSaveMood: (moodEntry: Omit<MoodEntry, 'id'>) => void;
  tasks: Task[];
  onSuggestActivity: () => void;
}

const moodOptions: { 
  mood: Mood, 
  label: string, 
  icon: React.ReactNode, 
  color: string,
  bgColor: string,
  borderColor: string,
  gradient: string
}[] = [
  { 
    mood: 'rad', 
    label: 'Rad', 
    icon: <Laugh className="h-8 w-8" />, 
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
    borderColor: 'border-green-200 dark:border-green-800',
    gradient: 'from-green-400 to-emerald-500'
  },
  { 
    mood: 'good', 
    label: 'Good', 
    icon: <Smile className="h-8 w-8" />, 
    color: 'text-lime-500',
    bgColor: 'bg-lime-50 dark:bg-lime-950/20',
    borderColor: 'border-lime-200 dark:border-lime-800',
    gradient: 'from-lime-400 to-green-500'
  },
  { 
    mood: 'meh', 
    label: 'Meh', 
    icon: <Meh className="h-8 w-8" />, 
    color: 'text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950/20',
    borderColor: 'border-amber-200 dark:border-amber-800',
    gradient: 'from-amber-400 to-orange-500'
  },
  { 
    mood: 'bad', 
    label: 'Bad', 
    icon: <Frown className="h-8 w-8" />, 
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    borderColor: 'border-orange-200 dark:border-orange-800',
    gradient: 'from-orange-400 to-red-500'
  },
  { 
    mood: 'awful', 
    label: 'Awful', 
    icon: <Angry className="h-8 w-8" />, 
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-950/20',
    borderColor: 'border-red-200 dark:border-red-800',
    gradient: 'from-red-400 to-pink-500'
  },
];

export function MoodTracker({ moods, selectedDate, onSaveMood, tasks, onSuggestActivity }: MoodTrackerProps) {
  const dateString = format(selectedDate, 'yyyy-MM-dd');
  const todayMoodEntry = useMemo(() => moods.find(m => m.date === dateString), [moods, dateString]);

  const [selectedMood, setSelectedMood] = useState<Mood | null>(todayMoodEntry?.mood ?? null);
  const [note, setNote] = useState(todayMoodEntry?.note ?? '');

  useEffect(() => {
    const newMoodEntry = moods.find(m => m.date === dateString);
    setSelectedMood(newMoodEntry?.mood ?? null);
    setNote(newMoodEntry?.note ?? '');
  }, [selectedDate, moods, dateString]);

  const handleSave = () => {
    if (selectedMood) {
      onSaveMood({
        date: dateString,
        mood: selectedMood,
        note: note,
      });
    }
  };

  const productivityData = useMemo(() => {
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    return {
      completed: completedTasks,
      incomplete: totalTasks - completedTasks
    }
  }, [tasks]);
  
  const moodProductivityData = useMemo(() => {
    const data = moodOptions.map(opt => ({ name: opt.label, mood: opt.mood, completed: 0, count: 0 }));
    
    moods.forEach(moodEntry => {
      const moodData = data.find(d => d.mood === moodEntry.mood);
      if (moodData) {
        // This is a simplification. A real implementation would need to fetch tasks for each day.
        // For now, we just increment a mock value.
        moodData.completed += Math.floor(Math.random() * 5); 
        moodData.count += 1;
      }
    });

    return data.map(d => ({...d, avgCompleted: d.count > 0 ? d.completed / d.count : 0}));
  }, [moods]);


  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <Heart className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Mood Tracker</h2>
            <p className="text-muted-foreground">Track your daily emotions and well-being</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500" />
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>How are you feeling today?</CardTitle>
            </div>
            <CardDescription>Select a mood and add a note about your day to track your emotional well-being.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-5 gap-3 p-4 rounded-xl bg-gradient-to-r from-muted/30 to-muted/50 border">
              {moodOptions.map(({ mood, label, icon, color, bgColor, borderColor, gradient }) => {
                const isSelected = selectedMood === mood;
                return (
                  <button
                    key={mood}
                    onClick={() => setSelectedMood(mood)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 border-2 hover:scale-105 hover:shadow-lg",
                      isSelected 
                        ? `${color} ${bgColor} ${borderColor} scale-110 shadow-lg` 
                        : "text-muted-foreground hover:text-foreground border-transparent hover:border-border",
                      isSelected && "animate-pulse"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-full transition-all duration-300",
                      isSelected && `bg-gradient-to-r ${gradient} text-white shadow-md`
                    )}>
                      {icon}
                    </div>
                    <span className="text-xs font-medium">{label}</span>
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground">Daily Reflection (Optional)</label>
              <Textarea
                placeholder="How was your day? What made you feel this way? Any thoughts or experiences you'd like to remember..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                className="resize-none border-2 focus:border-primary/50 transition-colors"
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
                <Button 
                  onClick={handleSave} 
                  disabled={!selectedMood}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {todayMoodEntry ? 'Update Mood' : 'Save Mood'}
                </Button>
                <Button 
                  onClick={onSuggestActivity} 
                  variant="outline"
                  className="border-2 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-950/20 dark:hover:to-emerald-950/20 transition-all duration-300"
                >
                  <Sparkles className="mr-2 h-4 w-4"/>
                  Need a break?
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full -translate-y-10 translate-x-10" />
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <CardTitle>Today's Productivity</CardTitle>
            </div>
            <CardDescription>Track your daily task completion progress.</CardDescription>
          </CardHeader>
          <CardContent>
             {tasks.length > 0 ? (
                <div className="text-center space-y-4">
                    <div className="relative">
                      <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {productivityData.completed}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        out of {tasks.length} tasks completed
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${(productivityData.completed / tasks.length) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((productivityData.completed / tasks.length) * 100)}% completion rate
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">No tasks for today</p>
                  <p className="text-xs text-muted-foreground">Add some tasks to track your productivity!</p>
                </div>
            )}
          </CardContent>
        </Card>
         <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full -translate-y-8 -translate-x-8" />
            <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-500" />
                  <CardTitle>Mood & Productivity</CardTitle>
                </div>
                <CardDescription>Discover patterns between your mood and task completion.</CardDescription>
            </CardHeader>
            <CardContent>
                 <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={moodProductivityData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                        <XAxis 
                          dataKey="name" 
                          stroke="#888888" 
                          fontSize={11} 
                          tickLine={false} 
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="#888888" 
                          fontSize={11} 
                          tickLine={false} 
                          axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                background: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "var(--radius)",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                            }}
                        />
                        <Bar 
                          dataKey="avgCompleted" 
                          fill="url(#colorGradient)" 
                          radius={[6, 6, 0, 0]} 
                        />
                        <defs>
                          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          </linearGradient>
                        </defs>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}
