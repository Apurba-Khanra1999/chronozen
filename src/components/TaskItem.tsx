
"use client";

import type { Task } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Clock, Edit, ChevronUp, Briefcase, User, BookOpen, MoreHorizontal, FileText, Flag, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const priorityIcons = {
  low: <ChevronUp className="h-4 w-4 text-green-500 rotate-180" />,
  medium: <MoreHorizontal className="h-4 w-4 text-amber-500" />,
  high: <ChevronUp className="h-4 w-4 text-red-500" />,
};

const priorityColors = {
  low: "border-l-green-500 bg-green-50/50 dark:bg-green-950/20",
  medium: "border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20",
  high: "border-l-red-500 bg-red-50/50 dark:bg-red-950/20",
};

const categoryIcons = {
  work: <Briefcase className="h-3.5 w-3.5" />,
  personal: <User className="h-3.5 w-3.5" />,
  study: <BookOpen className="h-3.5 w-3.5" />,
  other: <MoreHorizontal className="h-3.5 w-3.5" />,
};

export function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  return (
    <Card className={cn(
      "w-full transition-all duration-300 ease-in-out group hover:shadow-md border-l-4",
      task.completed 
        ? "bg-muted/40 border-l-green-400 opacity-75 hover:opacity-90" 
        : cn("bg-card hover:bg-accent/5", priorityColors[task.priority])
    )}>
      <CardContent className="p-4 md:p-5 flex items-start gap-4">
        <div className="flex flex-col items-center gap-3 pt-1 shrink-0">
          <div className="relative">
            <Checkbox
              id={`task-${task.id}`}
              checked={task.completed}
              onCheckedChange={() => onToggle(task.id)}
              className="h-6 w-6 rounded-full transition-all duration-200 hover:scale-110"
              aria-label={`Mark ${task.name} as complete`}
            />
            {task.completed && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <CheckCircle2 className="h-4 w-4 text-primary animate-in zoom-in duration-200" />
              </div>
            )}
          </div>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 group-hover:bg-accent/40 transition-colors">
            {priorityIcons[task.priority]}
          </div>
        </div>
        <div className="flex-grow space-y-3">
          <div className="space-y-2">
            <label 
              htmlFor={`task-${task.id}`}
              className={cn(
                "font-semibold leading-tight cursor-pointer transition-all duration-200 text-base md:text-lg block group-hover:text-primary",
                task.completed ? "line-through text-muted-foreground" : "text-foreground"
              )}
            >
              {task.name}
            </label>
            {task.description && (
              <div className="flex items-start gap-2 text-muted-foreground">
                <FileText className="h-4 w-4 mt-0.5 shrink-0" />
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{task.description}</p>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/20 rounded-full border border-border/50">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{task.startTime} - {task.endTime}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/20 rounded-full border border-border/50 capitalize">
              {categoryIcons[task.category]}
              <span className="text-sm font-medium">{task.category}</span>
            </div>
            {task.goalId && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-950/20 rounded-full border border-green-200 dark:border-green-800">
                <Flag className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">Goal-linked</span>
              </div>
            )}
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(task)}
            className="rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 h-9 w-9 opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-muted-foreground hover:text-foreground hover:bg-accent h-9 w-9 transition-all duration-200"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEdit(task)} className="gap-2">
                <Edit className="h-4 w-4" />
                <span>Edit Task</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-destructive gap-2">
                <Trash2 className="h-4 w-4" />
                <span>Delete Task</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
