
"use client";

import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Task, Goal, Event } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Clock, Flag, Tag, Target, FileText, Sparkles } from 'lucide-react';

interface AddTaskDialogProps {
  onAddTask: (task: Omit<Task, 'id' | 'completed' | 'archived'>) => void;
  children: React.ReactNode;
  selectedDate: Date;
  goals: Goal[];
  dailyItems: (Task | Event)[];
}

const formSchema = z.object({
  name: z.string().min(1, "Task name is required."),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format."),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format."),
  priority: z.enum(['low', 'medium', 'high']),
  category: z.enum(['work', 'personal', 'study', 'other']),
  description: z.string().optional(),
  goalId: z.string().optional(),
}).refine(data => data.endTime > data.startTime, {
  message: "End time must be after start time.",
  path: ["endTime"],
});

export function AddTaskDialog({ onAddTask, children, selectedDate, goals, dailyItems }: AddTaskDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      startTime: "09:00",
      endTime: "10:00",
      priority: "medium",
      category: "work",
      description: "",
      goalId: undefined,
    },
  });
  
  const hasConflict = (startTime: string, endTime: string) => {
    for (const item of dailyItems) {
        if (startTime < item.endTime && endTime > item.startTime) {
            return true;
        }
    }
    return false;
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (hasConflict(values.startTime, values.endTime)) {
        toast({
            variant: "destructive",
            title: "Scheduling Conflict",
            description: "This task overlaps with an existing task or event.",
        })
        return;
    }
    onAddTask({ ...values, date: selectedDate });
    form.reset();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto fade-in scale-in">
        <DialogHeader className="space-y-3 slide-up">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 hover-glow transition-smooth">
              <Plus className="h-5 w-5 text-primary transition-smooth hover:rotate-90" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold slide-in-left">Add a New Task</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1 slide-in-left" style={{animationDelay: '0.1s'}}>
                Block out time on your schedule for a new task. Click save when you're done.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 stagger-fade-in">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm font-medium">
                    <FileText className="h-4 w-4 text-primary" />
                    Task Name
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Design review" 
                      className="h-10 focus:ring-2 focus:ring-primary/20" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                      <Clock className="h-4 w-4 text-primary" />
                      Start Time
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="time" 
                        className="h-10 focus:ring-2 focus:ring-primary/20" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                      <Clock className="h-4 w-4 text-primary" />
                      End Time
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="time" 
                        className="h-10 focus:ring-2 focus:ring-primary/20" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-medium">
                        <Flag className="h-4 w-4 text-primary" />
                        Priority
                      </FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-10 focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">Low</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="medium">
                            <div className="flex items-center gap-2">
                              <Badge variant="default" className="text-xs">Medium</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="high">
                            <div className="flex items-center gap-2">
                              <Badge variant="destructive" className="text-xs">High</Badge>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-medium">
                        <Tag className="h-4 w-4 text-primary" />
                        Category
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-10 focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="work">💼 Work</SelectItem>
                          <SelectItem value="personal">🏠 Personal</SelectItem>
                          <SelectItem value="study">📚 Study</SelectItem>
                           <SelectItem value="other">📋 Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
             <FormField
                control={form.control}
                name="goalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                      <Target className="h-4 w-4 text-primary" />
                      Link to Goal (Optional)
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 focus:ring-2 focus:ring-primary/20">
                          <SelectValue placeholder="Select a goal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">🚫 None</SelectItem>
                        {goals.map(goal => (
                          <SelectItem key={goal.id} value={goal.id}>
                            <div className="flex items-center gap-2">
                              <Target className="h-3 w-3" />
                              {goal.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm font-medium">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Description (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add a short description..." 
                      className="min-h-[80px] focus:ring-2 focus:ring-primary/20 resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex gap-3 pt-6 slide-up">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="flex-1 transition-smooth hover-lift">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 transition-smooth hover-lift hover-glow">
                <Plus className="h-4 w-4 mr-2 transition-smooth group-hover:rotate-90" />
                Add Task
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
