
"use client";

import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Event } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Edit3, Calendar, Clock, Tag, Repeat, Bell, FileText, Briefcase, User, MapPin, Cake, MoreHorizontal, Sparkles, Save } from 'lucide-react';

interface EditEventDialogProps {
  event: Event;
  onEditEvent: (event: Event) => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
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

export function EditEventDialog({ event, onEditEvent, isOpen, onOpenChange }: EditEventDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: event,
  });

  useEffect(() => {
    form.reset(event);
  }, [event, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onEditEvent({ ...event, ...values });
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] fade-in scale-in">
        <DialogHeader className="text-center pb-4 slide-up">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 hover-glow transition-smooth">
            <Edit3 className="h-6 w-6 text-primary transition-smooth hover:rotate-12" />
          </div>
          <DialogTitle className="text-xl font-semibold slide-in-left">Edit Event</DialogTitle>
          <DialogDescription className="text-muted-foreground slide-in-left" style={{animationDelay: '0.1s'}}>
            Make changes to your event here. Click save when you're done.
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
                            <Briefcase className="h-4 w-4" />
                            <span>💼 Work</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="personal">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>👤 Personal</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="appointment">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>📍 Appointment</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="birthday">
                          <div className="flex items-center gap-2">
                            <Cake className="h-4 w-4" />
                            <span>🎂 Birthday</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="other">
                          <div className="flex items-center gap-2">
                            <MoreHorizontal className="h-4 w-4" />
                            <span>📋 Other</span>
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
                          <SelectItem value="none">
                            <div className="flex items-center gap-2">
                              <span>🚫 None</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="daily">
                            <div className="flex items-center gap-2">
                              <span>📅 Daily</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="weekly">
                            <div className="flex items-center gap-2">
                              <span>📆 Weekly</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="monthly">
                            <div className="flex items-center gap-2">
                              <span>🗓️ Monthly</span>
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
                          <SelectItem value="none">
                            <div className="flex items-center gap-2">
                              <span>🔕 None</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="5">
                            <div className="flex items-center gap-2">
                              <span>⏰ 5 minutes before</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="15">
                            <div className="flex items-center gap-2">
                              <span>⏰ 15 minutes before</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="30">
                            <div className="flex items-center gap-2">
                              <span>⏰ 30 minutes before</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="60">
                            <div className="flex items-center gap-2">
                              <span>⏰ 1 hour before</span>
                            </div>
                          </SelectItem>
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
                      className="min-h-[80px] resize-none focus:ring-2 focus:ring-primary/20" 
                      {...field} 
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex gap-3 pt-6 slide-up">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="flex-1 transition-smooth hover-lift" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 transition-smooth hover-lift hover-glow">
                <Save className="h-4 w-4 mr-2 transition-smooth group-hover:scale-110" />
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
