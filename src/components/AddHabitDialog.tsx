"use client";

import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Habit } from "@/lib/types";
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
import { Badge } from "@/components/ui/badge";
import { Plus, Zap, Tag, Calendar, Heart, User, Briefcase, BookOpen, MoreHorizontal } from "lucide-react";

interface AddHabitDialogProps {
  onAddHabit: (habit: Omit<Habit, 'id' | 'completedDates'>) => void;
  children: React.ReactNode;
}

const formSchema = z.object({
  name: z.string().min(1, "Habit name is required."),
  category: z.enum(['health', 'personal', 'work', 'learn', 'other']),
  frequency: z.enum(['daily', 'weekly']),
});

export function AddHabitDialog({ onAddHabit, children }: AddHabitDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "personal",
      frequency: "daily",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAddHabit(values);
    form.reset();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] fade-in scale-in">
        <DialogHeader className="text-center pb-6 slide-up">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 hover-glow transition-smooth">
            <Zap className="h-6 w-6 text-primary transition-smooth hover:scale-110" />
          </div>
          <DialogTitle className="text-xl font-semibold slide-in-left">Add a New Habit</DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2 slide-in-left" style={{animationDelay: '0.1s'}}>
            Create a new habit to track your daily or weekly progress.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 stagger-fade-in">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm font-medium">
                    <Zap className="h-4 w-4 text-primary" />
                    Habit Name
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Drink 8 glasses of water" 
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
                          <SelectItem value="health">
                            <div className="flex items-center gap-2">
                              <Heart className="h-3 w-3" />
                              💚 Health
                            </div>
                          </SelectItem>
                          <SelectItem value="personal">
                            <div className="flex items-center gap-2">
                              <User className="h-3 w-3" />
                              🌟 Personal
                            </div>
                          </SelectItem>
                          <SelectItem value="work">
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-3 w-3" />
                              💼 Work
                            </div>
                          </SelectItem>
                          <SelectItem value="learn">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-3 w-3" />
                              📚 Learn
                            </div>
                          </SelectItem>
                          <SelectItem value="other">
                            <div className="flex items-center gap-2">
                              <MoreHorizontal className="h-3 w-3" />
                              🔧 Other
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
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-medium">
                        <Calendar className="h-4 w-4 text-primary" />
                        Frequency
                      </FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-10 focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="daily">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              📅 Daily
                            </div>
                          </SelectItem>
                          <SelectItem value="weekly">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              📆 Weekly
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <DialogFooter className="flex gap-3 pt-6 slide-up">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="flex-1 transition-smooth hover-lift">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 transition-smooth hover-lift hover-glow">
                <Plus className="h-4 w-4 mr-2 transition-smooth group-hover:rotate-90" />
                Add Habit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
