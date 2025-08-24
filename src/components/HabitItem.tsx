"use client";

import type { Habit } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, MoreHorizontal, HeartPulse, User, Briefcase, BookOpen, Repeat, CheckCircle2, Circle, Flame, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns";

interface HabitItemProps {
  habit: Habit;
  onToggle: (id: string, date: Date) => void;
  onDelete: (id: string) => void;
  selectedDate: Date;
}

const categoryConfig = {
  health: {
    icon: <HeartPulse className="h-5 w-5" />,
    color: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
    gradient: "from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20",
    border: "border-gray-200 dark:border-gray-800",
    emoji: "❤️"
  },
  personal: {
    icon: <User className="h-5 w-5" />,
    color: "bg-green-500/10 text-green-600 dark:text-green-400",
    gradient: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
    border: "border-green-200 dark:border-green-800",
    emoji: "👤"
  },
  work: {
    icon: <Briefcase className="h-5 w-5" />,
    color: "bg-green-500/10 text-green-600 dark:text-green-400",
    gradient: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
    border: "border-green-200 dark:border-green-800",
    emoji: "💼"
  },
  learn: {
    icon: <BookOpen className="h-5 w-5" />,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    gradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20",
    border: "border-emerald-200 dark:border-emerald-800",
    emoji: "📚"
  },
  other: {
    icon: <MoreHorizontal className="h-5 w-5" />,
    color: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
    gradient: "from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20",
    border: "border-gray-200 dark:border-gray-800",
    emoji: "⚡"
  },
};

export function HabitItem({ habit, onToggle, onDelete, selectedDate }: HabitItemProps) {
  const isCompleted = habit.completedDates.includes(format(selectedDate, 'yyyy-MM-dd'));
  const config = categoryConfig[habit.category];
  
  // Calculate streak (consecutive days completed)
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateStr = format(checkDate, 'yyyy-MM-dd');
    if (habit.completedDates.includes(dateStr)) {
      streak++;
    } else {
      break;
    }
  }

  return (
    <Card className={cn(
      "w-full transition-all duration-300 ease-in-out group hover:shadow-lg hover:-translate-y-1 relative overflow-hidden",
      `bg-gradient-to-br ${config.gradient}`,
      config.border,
      isCompleted && "ring-2 ring-emerald-200 dark:ring-emerald-800"
    )}>
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-8 translate-x-8" />
      
      {/* Completion Indicator */}
      {isCompleted && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-4 w-4 text-white" />
        </div>
      )}
      
      <CardContent className="p-4 relative">
        <div className="flex items-start gap-4">
          {/* Category Icon */}
          <div className={cn(
            "flex items-center justify-center h-12 w-12 rounded-xl shrink-0 transition-all duration-200",
            config.color,
            isCompleted && "scale-110"
          )}>
            <span className="text-lg mr-1">{config.emoji}</span>
            {config.icon}
          </div>
          
          {/* Content */}
          <div className="flex-grow min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <label 
                htmlFor={`habit-${habit.id}`}
                className={cn(
                  "font-semibold leading-tight cursor-pointer transition-all duration-200 text-base group-hover:text-primary",
                  isCompleted ? "line-through text-muted-foreground" : "text-foreground"
                )}
              >
                {habit.name}
              </label>
              
              {/* Actions */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full text-muted-foreground hover:bg-background/80 h-7 w-7"
                    >
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onDelete(habit.id)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Habit Details */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Repeat className="h-3.5 w-3.5" />
                  <span className="capitalize font-medium">{habit.frequency}</span>
                </div>
                {streak > 0 && (
                  <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                    <Flame className="h-3.5 w-3.5" />
                    <span className="font-medium">{streak} day{streak !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Completion Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>{format(selectedDate, 'MMM d, yyyy')}</span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggle(habit.id, selectedDate)}
                className={cn(
                  "h-8 px-3 rounded-full transition-all duration-200",
                  isCompleted 
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                )}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                    Done
                  </>
                ) : (
                  <>
                    <Circle className="h-3.5 w-3.5 mr-1.5" />
                    Mark Done
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
