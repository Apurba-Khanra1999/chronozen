
"use client";

import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Event, Task } from "@/lib/types";
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
import { useToast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Clock, Tag, Repeat, Bell, FileText, Briefcase, User, MapPin, Cake, MoreHorizontal, Sparkles } from "lucide-react";

interface AddEventDialogProps {
  onAddEvent: (event: Omit<Event, 'id'>) => void;
  children: React.ReactNode;
  selectedDate: Date;
  dailyItems: (Task | Event)[];
}

const formSchema = z.object({
  name: z.string().min(1, "Event name is required."),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format."),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format."),
  category: z.enum(['work', 'personal', 'appointment', 'birthday', 'other']),
  description: z.string().optional(),
  recurring: z.enum(['none', 'daily', 'weekly', 'monthly']),
  reminder: z.enum(['none', '5', '15', '30', '60']),
}).refine(data => data.endTime > data.startTime, {
  message: "End time must be after start time.",
  path: ["endTime"],
});

export function AddEventDialog({ onAddEvent, children, selectedDate, dailyItems }: AddEventDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      startTime: "10:00",
      endTime: "11:00",
      category: "personal",
      description: "",
      recurring: "none",
      reminder: "15",
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
            description: "This event overlaps with an existing task or event.",
        })
        return;
    }

    onAddEvent({ ...values, date: selectedDate });
    form.reset();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] fade-in scale-in">
        <DialogHeader className="text-center pb-6 slide-up">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 hover-glow transition-smooth">
            <Calendar className="h-6 w-6 text-primary transition-smooth hover:scale-110" />
          </div>
          <DialogTitle className="text-xl font-semibold slide-in-left">Add a New Event</DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2 slide-in-left" style={{animationDelay: '0.1s'}}>
            Schedule a new event on your calendar with all the important details.
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
                    <Calendar className="h-4 w-4 text-primary" />
                    Event Name
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Team Meeting" 
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
                        <SelectItem value="work">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-3 w-3" />
                            💼 Work
                          </div>
                        </SelectItem>
                        <SelectItem value="personal">
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3" />
                            🌟 Personal
                          </div>
                        </SelectItem>
                        <SelectItem value="appointment">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            📍 Appointment
                          </div>
                        </SelectItem>
                        <SelectItem value="birthday">
                          <div className="flex items-center gap-2">
                            <Cake className="h-3 w-3" />
                            🎂 Birthday
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
            <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="recurring"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-medium">
                        <Repeat className="h-4 w-4 text-primary" />
                        Recurring
                      </FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-10 focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder="Select recurrence" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">🚫 None</SelectItem>
                          <SelectItem value="daily">📅 Daily</SelectItem>
                          <SelectItem value="weekly">📆 Weekly</SelectItem>
                          <SelectItem value="monthly">🗓️ Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reminder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-medium">
                        <Bell className="h-4 w-4 text-primary" />
                        Reminder
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-10 focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder="Select a reminder" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">🔕 None</SelectItem>
                          <SelectItem value="5">⏰ 5 minutes before</SelectItem>
                          <SelectItem value="15">⏰ 15 minutes before</SelectItem>
                          <SelectItem value="30">⏰ 30 minutes before</SelectItem>
                          <SelectItem value="60">⏰ 1 hour before</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
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
                Add Event
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
