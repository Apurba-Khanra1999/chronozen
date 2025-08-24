
"use client";

import type { Task } from "@/lib/types";
import { TaskItem } from "./TaskItem";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { PieChart, Clock, Archive, CheckCircle2, Target, TrendingUp, Sparkles } from "lucide-react";
import React from 'react';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onArchiveCompleted: () => void;
}

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export function TaskList({ tasks, onToggleTask, onDeleteTask, onEditTask, onArchiveCompleted }: TaskListProps) {
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const focusTimeUsed = tasks
    .filter(t => t.completed)
    .reduce((acc, task) => {
      const duration = timeToMinutes(task.endTime) - timeToMinutes(task.startTime);
      return acc + duration;
    }, 0);

  const focusTimeHours = Math.floor(focusTimeUsed / 60);
  const focusTimeMinutes = focusTimeUsed % 60;

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 md:py-24 border-2 border-dashed border-border/50 rounded-xl bg-accent/5 hover:bg-accent/10 transition-colors">
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">All caught up!</h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto">
              Your schedule is clear. Time to add some tasks and make progress on your goals.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-6">
            <Sparkles className="h-4 w-4" />
            <span>Ready to be productive?</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Today's Tasks</h2>
            <p className="text-muted-foreground">
              {totalCount === 0 ? "No tasks scheduled" : 
               completedCount === totalCount ? "All tasks completed! 🎉" :
               `${totalCount - completedCount} remaining • ${completedCount} completed`}
            </p>
          </div>
          {completedCount > 0 && (
             <Button variant="outline" size="sm" onClick={onArchiveCompleted} className="hover:bg-accent/80 transition-colors">
                <Archive className="mr-2 h-4 w-4" />
               Archive {completedCount} {completedCount > 1 ? 'tasks' : 'task'}
             </Button>
          )}
        </div>
        
        {/* Progress Overview */}
        {totalCount > 0 && (
          <div className="bg-accent/20 rounded-lg p-4 border border-border/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">Daily Progress</span>
              </div>
              <Badge variant={completionPercentage === 100 ? "default" : completionPercentage >= 50 ? "secondary" : "outline"} className="font-bold">
                {Math.round(completionPercentage)}%
              </Badge>
            </div>
            <Progress value={completionPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{completedCount} completed</span>
              <span>{totalCount - completedCount} remaining</span>
            </div>
          </div>
        )}
        
        {/* Tasks List */}
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <div key={task.id} className="animate-in slide-in-from-left duration-300" style={{ animationDelay: `${index * 50}ms` }}>
              <TaskItem 
                task={task} 
                onToggle={onToggleTask} 
                onDelete={onDeleteTask}
                onEdit={onEditTask}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Sidebar Stats */}
      <div className="space-y-6">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-chart-1" />
                <CardTitle className="text-xl">Daily Summary</CardTitle>
              </div>
              <CardDescription className="text-base">
                Track your productivity and focus time.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Completion Stats */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">Task Completion</span>
                  <Badge variant={completionPercentage === 100 ? "default" : "outline"} className="font-bold">
                    {Math.round(completionPercentage)}%
                  </Badge>
                </div>
                <Progress value={completionPercentage} className="h-3" aria-label={`${Math.round(completionPercentage)}% of tasks completed`} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-accent/10 rounded-lg border border-border/50">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-xs text-muted-foreground">Done</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{completedCount}</div>
                </div>
                <div className="text-center p-3 bg-accent/10 rounded-lg border border-border/50">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <PieChart className="h-4 w-4 text-green-600" />
                    <span className="text-xs text-muted-foreground">Total</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{totalCount}</div>
                </div>
              </div>

              {/* Focus Time */}
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">Focus Time</span>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {focusTimeHours > 0 && `${focusTimeHours}h `} 
                  {focusTimeMinutes > 0 && `${focusTimeMinutes}m`}
                  {focusTimeUsed === 0 && '0m'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {focusTimeUsed > 0 ? 'Time spent on completed tasks' : 'Complete tasks to track focus time'}
                </div>
              </div>

              {/* Motivational Message */}
              {completionPercentage === 100 && totalCount > 0 && (
                <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="text-2xl mb-2">🎉</div>
                  <div className="font-semibold text-green-800 dark:text-green-200">Perfect Day!</div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">All tasks completed</div>
                </div>
              )}
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
