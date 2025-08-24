
"use client";

import React from 'react';
import { format, isSameDay } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import type { Task, Event } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { GanttChartSquare, ClipboardList, LayoutDashboard, Calendar as CalendarIcon, Clock, MapPin, Target, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
    tasks: Task[];
    events: Event[];
    selectedDate: Date;
    onDateSelect: (date: Date | undefined) => void;
    onNavigateToTimeline: () => void;
}

export function CalendarView({ tasks, events, selectedDate, onDateSelect, onNavigateToTimeline }: CalendarViewProps) {
    
    const daysWithItems = React.useMemo(() => {
        const days = new Set<string>();
        tasks.forEach(task => days.add(task.date.toDateString()));
        events.forEach(event => days.add(event.date.toDateString()));
        return Array.from(days).map(dayStr => new Date(dayStr));
    }, [tasks, events]);

    const selectedDateTasks = tasks.filter(task => isSameDay(task.date, selectedDate));
    const selectedDateEvents = events.filter(event => isSameDay(event.date, selectedDate));

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <CalendarIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Calendar</CardTitle>
                            <CardDescription>Select a date to view your schedule</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={onDateSelect}
                        className="rounded-lg border-0"
                        classNames={{
                            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                            month: "space-y-4",
                            caption: "flex justify-center pt-1 relative items-center",
                            caption_label: "text-sm font-medium",
                            nav: "space-x-1 flex items-center",
                            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                            nav_button_previous: "absolute left-1",
                            nav_button_next: "absolute right-1",
                            table: "w-full border-collapse space-y-1",
                            head_row: "flex",
                            head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                            row: "flex w-full mt-2",
                            cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                            day: cn("h-9 w-9 p-0 font-normal aria-selected:opacity-100 relative hover:bg-accent hover:text-accent-foreground transition-colors"),
                            day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary focus:text-primary-foreground",
                            day_today: "bg-accent text-accent-foreground font-semibold",
                            day_outside: "text-muted-foreground opacity-50",
                            day_disabled: "text-muted-foreground opacity-50",
                            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                            day_hidden: "invisible",
                        }}
                        modifiers={{
                            hasItems: daysWithItems,
                        }}
                        components={{
                            DayContent: ({ date, ...props }) => {
                                const hasItems = daysWithItems.some(d => isSameDay(d, date));
                                const dayTasks = tasks.filter(task => isSameDay(task.date, date));
                                const dayEvents = events.filter(event => isSameDay(event.date, date));
                                const totalItems = dayTasks.length + dayEvents.length;
                                
                                return (
                                    <div className="relative h-full w-full flex flex-col items-center justify-center">
                                        <span className="text-sm">{date.getDate()}</span>
                                        {hasItems && (
                                            <div className="absolute -bottom-0.5 flex gap-0.5">
                                                {totalItems <= 3 ? (
                                                    Array.from({ length: totalItems }).map((_, i) => (
                                                        <div key={i} className="h-1 w-1 rounded-full bg-primary group-aria-selected:bg-primary-foreground" />
                                                    ))
                                                ) : (
                                                    <div className="h-1 w-4 rounded-full bg-primary group-aria-selected:bg-primary-foreground" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )
                            }
                        }}
                    />
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                            <Clock className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">
                                {format(selectedDate, 'EEEE')}
                            </CardTitle>
                            <CardDescription>
                                {format(selectedDate, 'MMMM d, yyyy')}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                             <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                                <ClipboardList className="h-4 w-4 text-green-500" />
                            </div>
                            <div>
                                <div className="text-lg font-semibold text-green-700 dark:text-green-300">
                            {selectedDateTasks.length} Tasks
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400">
                                    Tasks
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                             <div className="w-8 h-8 bg-emerald-500/10 rounded-full flex items-center justify-center">
                                 <LayoutDashboard className="h-4 w-4 text-emerald-500" />
                             </div>
                             <div>
                                 <div className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                                     {selectedDateEvents.length} Events
                                 </div>
                                 <div className="text-xs text-emerald-600 dark:text-emerald-400">
                                    Events
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tasks Preview */}
                    {selectedDateTasks.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span className="text-sm font-medium">Today's Tasks</span>
                            </div>
                            <div className="space-y-2">
                                {selectedDateTasks.slice(0, 3).map((task, index) => (
                                    <div key={index} className="flex items-center gap-3 p-2 bg-muted/50 rounded-md">
                                        <div className={`w-2 h-2 rounded-full ${
                                            task.priority === 'high' ? 'bg-red-500' :
                                            task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                        }`} />
                                        <span className="text-sm flex-1 truncate">{task.name}</span>
                                        <Badge variant="outline" className="text-xs">
                                            {task.priority}
                                        </Badge>
                                    </div>
                                ))}
                                {selectedDateTasks.length > 3 && (
                                    <div className="text-xs text-muted-foreground text-center py-1">
                                        +{selectedDateTasks.length - 3} more tasks
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Events Preview */}
                    {selectedDateEvents.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm font-medium">Today's Events</span>
                            </div>
                            <div className="space-y-2">
                                {selectedDateEvents.slice(0, 3).map((event, index) => (
                                    <div key={index} className="flex items-center gap-3 p-2 bg-muted/50 rounded-md">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="text-sm flex-1 truncate">{event.name}</span>
                                        <Badge variant="outline" className="text-xs">
                                            {event.category}
                                        </Badge>
                                    </div>
                                ))}
                                {selectedDateEvents.length > 3 && (
                                    <div className="text-xs text-muted-foreground text-center py-1">
                                        +{selectedDateEvents.length - 3} more events
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {selectedDateTasks.length === 0 && selectedDateEvents.length === 0 && (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Plus className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">No tasks or events</p>
                            <p className="text-xs text-muted-foreground">This day is free for new activities</p>
                        </div>
                    )}

                     <Separator />
                     <Button 
                        onClick={onNavigateToTimeline} 
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                     >
                        <GanttChartSquare className="mr-2 h-4 w-4" />
                        View Timeline
                     </Button>
                </CardContent>
            </Card>
        </div>
    );
}
