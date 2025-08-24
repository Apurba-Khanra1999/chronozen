
"use client";

import React, { useMemo } from 'react';
import type { Goal, Task } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Plus, Trash2, Edit, MoreHorizontal, Flag, Calendar, CheckCircle2, Loader2, PlayCircle, Target, Trophy, Star, TrendingUp, Clock, Zap } from 'lucide-react';
import { AddGoalDialog } from './AddGoalDialog';
import { Progress } from './ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { format, formatDistanceToNow, formatDuration, intervalToDuration } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';


interface GoalTrackerProps {
  goals: Goal[];
  tasks: Task[];
  onAddGoal: (goal: Omit<Goal, 'id' | 'status' | 'progress'>) => void;
  onDeleteGoal: (id: string) => void;
  onEditGoal: (goal: Goal) => void;
  onUpdateGoalStatus: (id: string, status: Goal['status']) => void;
}

const statusConfig = {
    'not-started': {
        color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
        icon: <PlayCircle className="h-4 w-4" />,
        gradient: 'from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800',
        accent: 'border-gray-200 dark:border-gray-700'
    },
    'in-progress': {
        color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
        gradient: 'from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950',
        accent: 'border-green-200 dark:border-green-800'
    },
    'completed': {
        color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
        icon: <CheckCircle2 className="h-4 w-4" />,
        gradient: 'from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950',
        accent: 'border-green-200 dark:border-green-800'
    },
}


export function GoalTracker({ goals, tasks, onAddGoal, onDeleteGoal, onEditGoal, onUpdateGoalStatus }: GoalTrackerProps) {
  
  const goalsWithTaskCounts = useMemo(() => {
    return goals.map(goal => {
      const relatedTasks = tasks.filter(task => task.goalId === goal.id);
      const completedTasks = relatedTasks.filter(task => task.completed);
      return { ...goal, totalTasks: relatedTasks.length, completedTasks: completedTasks.length };
    });
  }, [goals, tasks]);

  const completedGoals = goalsWithTaskCounts.filter(goal => goal.status === 'completed').length;
  const inProgressGoals = goalsWithTaskCounts.filter(goal => goal.status === 'in-progress').length;
  const totalGoals = goalsWithTaskCounts.length;

  return (
    <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        Your Goals
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Track your progress and achieve your dreams
                    </p>
                </div>
            </div>
            <AddGoalDialog onAddGoal={onAddGoal}>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                    <Plus className="mr-2 h-4 w-4"/>
                    Add Goal
                </Button>
            </AddGoalDialog>
        </div>

        {/* Stats Cards */}
        {totalGoals > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                                <Trophy className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-green-700 dark:text-green-300">{completedGoals}</div>
                                <div className="text-xs text-green-600 dark:text-green-400">Completed</div>
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
                                <div className="text-2xl font-bold text-green-700 dark:text-green-300">{inProgressGoals}</div>
                                <div className="text-xs text-green-600 dark:text-green-400">In Progress</div>
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
                                <div className="text-2xl font-bold text-green-700 dark:text-green-300">{totalGoals}</div>
                                <div className="text-xs text-green-600 dark:text-green-400">Total Goals</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )}

        {goalsWithTaskCounts.length === 0 ? (
            <Card className="border-2 border-dashed border-muted-foreground/25">
                <CardContent className="text-center py-16">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Target className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">No goals set yet</h2>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Start your journey by setting your first goal. Break down your dreams into achievable milestones.
                    </p>
                    <AddGoalDialog onAddGoal={onAddGoal}>
                        <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                            <Plus className="mr-2 h-4 w-4"/>
                            Create Your First Goal
                        </Button>
                    </AddGoalDialog>
                </CardContent>
            </Card>
        ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {goalsWithTaskCounts.map(goal => {
                    const config = statusConfig[goal.status];
                    const isOverdue = new Date(goal.targetDate) < new Date() && goal.status !== 'completed';
                    const progressColor = goal.progress >= 75 ? 'bg-green-500' : goal.progress >= 50 ? 'bg-emerald-500' : goal.progress >= 25 ? 'bg-lime-500' : 'bg-gray-400';
                    
                    return (
                        <Card key={goal.id} className={cn(
                            "flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden",
                            `bg-gradient-to-br ${config.gradient}`,
                            config.accent
                        )}>
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-10 translate-x-10" />
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-8 -translate-x-8" />
                            
                            <CardHeader className="relative">
                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex-1 min-w-0">
                                        <CardTitle className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                            {goal.name}
                                        </CardTitle>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Badge className={cn("text-xs font-medium", config.color)}>
                                                <span className="mr-1.5">{config.icon}</span>
                                                {goal.status.replace('-', ' ')}
                                            </Badge>
                                            {isOverdue && (
                                                <Badge variant="destructive" className="text-xs">
                                                    <Clock className="mr-1 h-3 w-3" />
                                                    Overdue
                                                </Badge>
                                            )}
                                            {goal.progress === 100 && (
                                                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-xs">
                                                    <Star className="mr-1 h-3 w-3" />
                                                    Achievement
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="rounded-full text-muted-foreground hover:bg-background/80 h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => onEditGoal(goal)}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                <span>Edit</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => onUpdateGoalStatus(goal.id, 'not-started')}>
                                                <PlayCircle className="mr-2 h-4 w-4" />
                                                <span>Not Started</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onUpdateGoalStatus(goal.id, 'in-progress')}>
                                                <Loader2 className="mr-2 h-4 w-4" />
                                                <span>In Progress</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onUpdateGoalStatus(goal.id, 'completed')}>
                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                                <span>Completed</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => onDeleteGoal(goal.id)} className="text-destructive">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                <span>Delete</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>
                            
                            <CardContent className="flex-grow space-y-4 relative">
                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                                    {goal.description}
                                </p>
                                
                                {/* Progress Section */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">Progress</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold">{Math.round(goal.progress)}%</span>
                                            {goal.progress === 100 && (
                                                <Trophy className="h-4 w-4 text-amber-500" />
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Progress 
                                            value={goal.progress} 
                                            className="h-2" 
                                            aria-label={`${Math.round(goal.progress)}% of goal completed`}
                                        />
                                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                                            <span>{goal.completedTasks} of {goal.totalTasks} tasks</span>
                                            <span className="flex items-center gap-1">
                                                <Zap className="h-3 w-3" />
                                                {goal.totalTasks > 0 ? Math.round((goal.completedTasks / goal.totalTasks) * 100) : 0}% complete
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            
                            <CardFooter className="flex justify-between items-center text-xs text-muted-foreground bg-background/50 backdrop-blur-sm">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span className="font-medium">{format(goal.targetDate, "MMM d, yyyy")}</span>
                                </div>
                                <span className={cn(
                                    "font-medium",
                                    isOverdue ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
                                )}>
                                    {formatDistanceToNow(goal.targetDate, { addSuffix: true })}
                                </span>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        )}
    </div>
  );
}
