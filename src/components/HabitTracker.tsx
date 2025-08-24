"use client";

import React from 'react';
import type { Habit } from "@/lib/types";
import { HabitItem } from "./HabitItem";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { AddHabitDialog } from './AddHabitDialog';
import { Plus, Zap, Target, TrendingUp, Calendar, CheckCircle2 } from 'lucide-react';

interface HabitTrackerProps {
  habits: Habit[];
  selectedDate: Date;
  onAddHabit: (habit: Omit<Habit, 'id' | 'completedDates'>) => void;
  onToggleHabit: (id: string, date: Date) => void;
  onDeleteHabit: (id: string) => void;
}

export function HabitTracker({ habits, selectedDate, onAddHabit, onToggleHabit, onDeleteHabit }: HabitTrackerProps) {
  const completedToday = habits.filter(habit => 
    habit.completedDates.includes(selectedDate.toISOString().split('T')[0])
  ).length;
  
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  return (
    <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        Habit Tracker
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Build consistency, one day at a time
                    </p>
                </div>
            </div>
            <AddHabitDialog onAddHabit={onAddHabit}>
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                    <Plus className="mr-2 h-4 w-4"/>
                    Add Habit
                </Button>
            </AddHabitDialog>
        </div>

        {/* Statistics Cards */}
        {totalHabits > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{completedToday}</div>
                                <div className="text-xs text-emerald-600 dark:text-emerald-400">Completed Today</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-green-700 dark:text-green-300">{completionRate}%</div>
                                <div className="text-xs text-green-600 dark:text-green-400">Completion Rate</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                                <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-green-700 dark:text-green-300">{totalHabits}</div>
                                <div className="text-xs text-green-600 dark:text-green-400">Total Habits</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )}

        {habits.length === 0 ? (
            <Card className="border-2 border-dashed border-muted-foreground/25">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                        <Zap className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-semibold text-muted-foreground mb-2">No habits yet</h2>
                    <p className="text-muted-foreground mb-6 max-w-md">
                        Start building positive habits today. Track your progress and build consistency over time.
                    </p>
                    <AddHabitDialog onAddHabit={onAddHabit}>
                        <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
                            <Plus className="mr-2 h-4 w-4"/>
                            Create Your First Habit
                        </Button>
                    </AddHabitDialog>
                </CardContent>
            </Card>
        ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {habits.map(habit => (
                    <HabitItem 
                        key={habit.id} 
                        habit={habit} 
                        selectedDate={selectedDate}
                        onToggle={onToggleHabit} 
                        onDelete={onDeleteHabit}
                    />
                ))}
            </div>
        )}
    </div>
  );
}
