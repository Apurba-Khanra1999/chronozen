
"use client";
import React, { useState, useEffect } from 'react';
import type { Task, Event } from '@/lib/types';
import { Card, CardContent } from './ui/card';
import { cn } from '@/lib/utils';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  Edit, Clock, Calendar, Target, 
  Briefcase, User, MapPin, Cake, MoreHorizontal
} from 'lucide-react';

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

const TimelineCard = ({ item, onToggle, onEdit }: { 
  item: (Task | Event) & { type: 'task' | 'event' }, 
  onToggle?: (id: string) => void, 
  onEdit: (item: Task | Event) => void 
}) => {
  const isTask = item.type === 'task';
  const task = isTask ? (item as Task) : undefined;
  const event = !isTask ? (item as Event) : undefined;

  const priorityColors = {
    high: 'border-l-red-500 bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20',
    medium: 'border-l-amber-500 bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20',
    low: 'border-l-green-500 bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20',
  };

  const categoryIcons = {
    work: Briefcase,
    personal: User,
    appointment: MapPin,
    birthday: Cake,
    other: MoreHorizontal,
  };

  const CategoryIcon = event ? categoryIcons[event.category as keyof typeof categoryIcons] || MoreHorizontal : Target;

  return (
    <Card className={cn(
      "group hover:shadow-lg transition-all duration-300 border-l-4 hover:scale-[1.02] animate-fade-in",
      isTask ? priorityColors[task!.priority] : "border-l-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30",
      task?.completed && 'opacity-70'
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
              isTask 
                ? task!.priority === 'high' 
                  ? 'bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400'
        : task!.priority === 'medium'
        ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
        : 'bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-400'
      : 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
            )}>
              <CategoryIcon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-semibold text-base leading-tight mb-1",
                task?.completed && 'line-through text-muted-foreground'
              )}>
                {item.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{formatTime(item.startTime)} - {formatTime(item.endTime)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isTask && (
              <Badge variant={task!.priority === 'high' ? 'destructive' : task!.priority === 'medium' ? 'default' : 'secondary'} className="text-xs">
                {task!.priority}
              </Badge>
            )}
            {event && (
              <Badge variant="outline" className="text-xs">
                {event.category}
              </Badge>
            )}
            {isTask && onToggle && (
              <Checkbox 
                checked={task!.completed} 
                onCheckedChange={() => onToggle(task!.id)} 
                className="h-5 w-5 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
              />
            )}
          </div>
        </div>
        
        {item.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {item.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isTask 
                ? task!.priority === 'high' ? 'bg-red-500' : task!.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'
        : 'bg-emerald-500'
            )} />
            <span className="text-xs text-muted-foreground">
              {isTask ? 'Task' : 'Event'}
            </span>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0" 
            onClick={() => onEdit(item)}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit {item.type}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface TimelineViewProps {
  tasks: Task[];
  events: Event[];
  onToggleTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onEditEvent: (event: Event) => void;
}

export default function TimelineView({ tasks, events, onToggleTask, onEditTask, onEditEvent }: TimelineViewProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'tasks' | 'events'>('all');
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
     const timer = setInterval(() => {
       setCurrentTime(new Date());
     }, 60000);
     return () => clearInterval(timer);
   }, []);

  // Combine and sort items by start time
  const allItems = [
    ...tasks.map(task => ({ ...task, type: 'task' as const })),
    ...events.map(event => ({ ...event, type: 'event' as const }))
  ].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  // Filter items based on selected filters
  const filteredItems = allItems.filter(item => {
    if (selectedFilter !== 'all' && item.type !== selectedFilter.slice(0, -1)) return false;
    if (selectedPriority !== 'all' && item.type === 'task' && (item as Task).priority !== selectedPriority) return false;
    return true;
  });

  const taskCount = tasks.length;
  const eventCount = events.length;
  const completedTasks = tasks.filter(task => task.completed).length;

  return (
    <div className="h-full bg-gradient-to-br from-background via-background to-muted/10">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-80 bg-card border-r flex flex-col">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg animate-pulse">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Timeline
                </h1>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl">
              <div className="text-2xl font-bold text-foreground">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Current Time
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="p-6 border-b">
            <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">Overview</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Tasks</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{taskCount}</div>
                  <div className="text-xs text-muted-foreground">{completedTasks} done</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Events</span>
                </div>
                <div className="text-sm font-bold">{eventCount}</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b">
            <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">Filters</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Type</label>
                <div className="flex gap-2">
                  {(['all', 'tasks', 'events'] as const).map((filter) => (
                    <Button
                      key={filter}
                      variant={selectedFilter === filter ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs capitalize flex-1"
                      onClick={() => setSelectedFilter(filter)}
                    >
                      {filter}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Priority</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['all', 'high', 'medium', 'low'] as const).map((priority) => (
                    <Button
                      key={priority}
                      variant={selectedPriority === priority ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs capitalize"
                      onClick={() => setSelectedPriority(priority)}
                    >
                      {priority}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="p-6 flex-1">
            <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">Legend</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-xs text-muted-foreground">High Priority</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-xs text-muted-foreground">Medium Priority</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs text-muted-foreground">Low Priority</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs text-muted-foreground">Events</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b bg-card">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Daily Schedule</h2>
                <p className="text-sm text-muted-foreground">
                  {filteredItems.length} items {selectedFilter !== 'all' && `(${selectedFilter})`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-background/50">
                  <Clock className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              </div>
            </div>
          </div>

          {/* Timeline Content */}
          <ScrollArea className="flex-1">
            <div className="p-6">
              {filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No items found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or add some tasks and events.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredItems.map((item) => (
                    <TimelineCard
                      key={`${item.type}-${item.id}`}
                      item={item}
                      onToggle={item.type === 'task' ? onToggleTask : undefined}
                      onEdit={item.type === 'task' ? onEditTask : onEditEvent}
                    />
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
