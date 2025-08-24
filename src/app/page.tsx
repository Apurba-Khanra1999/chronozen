
"use client";

import { useState, useEffect, useMemo } from "react";
import { format, isSameDay } from 'date-fns';
import type { Task, Event, Habit, Goal, MoodEntry } from "@/lib/types";
import { TaskList } from "@/components/TaskList";
import { EventList } from "@/components/EventList";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { AddEventDialog } from "@/components/AddEventDialog";
import { Button } from "@/components/ui/button";
import { Plus, CalendarPlus, LayoutDashboard, ClipboardList, Calendar as CalendarIcon, GanttChartSquare, Book, Target, Timer, Flag, Smile, Home as HomeIcon, User } from "lucide-react";
import { ScheduleSuggesterSheet } from "@/components/ScheduleSuggesterSheet";
import { EditTaskDialog } from "@/components/EditTaskDialog";
import { EditEventDialog } from "@/components/EditEventDialog";
import { EditGoalDialog } from "@/components/EditGoalDialog";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarTrigger, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset } from "@/components/ui/sidebar";
import TimelineView from "@/components/TimelineView";
import { CalendarView } from "@/components/CalendarView";
import { FilterControls, type Filters, type SortBy } from "@/components/FilterControls";
import { HabitTracker } from "@/components/HabitTracker";
import { FocusTimer } from "@/components/FocusTimer";
import { GoalTracker } from "@/components/GoalTracker";
import { MoodTracker } from "@/components/MoodTracker";
import { WellnessSuggestionDialog } from "@/components/WellnessSuggestionDialog";
import { DailySummary } from "@/components/DailySummary";
import { Dashboard } from "@/components/Dashboard";
import ProfilePage from "@/components/ProfilePage";
import LandingPage from "@/components/LandingPage";


export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");
  const [isWellnessDialogOpen, setIsWellnessDialogOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>({
    category: 'all',
    priority: 'all',
    status: 'all'
  });
  const [sortBy, setSortBy] = useState<SortBy>('time');


  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedTasks = localStorage.getItem("chrono-zen-tasks");
        if (storedTasks) {
          const parsedTasks = JSON.parse(storedTasks).map((task: Task) => ({...task, date: task.date ? new Date(task.date) : new Date()}));
          setTasks(parsedTasks);
        } else {
          setTasks([
            { id: '1', name: 'Morning Meditation', startTime: '07:00', endTime: '07:15', completed: true, priority: 'low', category: 'personal', date: new Date(), archived: false },
            { id: '2', name: 'Team Stand-up', startTime: '09:00', endTime: '09:30', completed: true, priority: 'high', category: 'work', date: new Date(), archived: false },
            { id: '3', name: 'Work on Project Phoenix', startTime: '09:30', endTime: '12:00', completed: false, priority: 'high', category: 'work', description: 'Focus on the UI mockups', date: new Date(), archived: false, goalId: 'g1' },
            { id: '4', name: 'Lunch Break', startTime: '12:00', endTime: '13:00', completed: false, priority: 'medium', category: 'personal', date: new Date(), archived: false },
          ]);
        }

        const storedEvents = localStorage.getItem("chrono-zen-events");
        if (storedEvents) {
          const parsedEvents = JSON.parse(storedEvents).map((event: Event) => ({...event, date: event.date ? new Date(event.date) : new Date()}));
          setEvents(parsedEvents);
        } else {
          setEvents([
            { id: 'ev1', name: 'Weekly Sync', startTime: '14:00', endTime: '15:00', category: 'work', recurring: 'weekly', reminder: '15', date: new Date() },
            { id: 'ev2', name: "John's Birthday", startTime: '00:00', endTime: '23:59', category: 'birthday', recurring: 'none', reminder: '60', date: new Date() },
          ]);
        }

         const storedHabits = localStorage.getItem("chrono-zen-habits");
        if (storedHabits) {
          setHabits(JSON.parse(storedHabits));
        } else {
          setHabits([
            { id: 'h1', name: 'Read for 15 minutes', category: 'learn', frequency: 'daily', completedDates: [] },
            { id: 'h2', name: 'Go for a run', category: 'health', frequency: 'daily', completedDates: [format(new Date(), 'yyyy-MM-dd')]},
            { id: 'h3', name: 'Weekly project review', category: 'work', frequency: 'weekly', completedDates: [] },
          ]);
        }

         const storedGoals = localStorage.getItem("chrono-zen-goals");
        if (storedGoals) {
          const parsedGoals = JSON.parse(storedGoals).map((goal: any) => ({...goal, startDate: new Date(goal.startDate), targetDate: new Date(goal.targetDate)}));
          setGoals(parsedGoals);
        } else {
          const nextWeek = new Date();
          nextWeek.setDate(nextWeek.getDate() + 7);
          setGoals([
            { id: 'g1', name: 'Launch Project Phoenix', status: 'in-progress', startDate: new Date(), targetDate: nextWeek, description: 'Complete all features and deploy to production.', progress: 25 },
            { id: 'g2', name: 'Run a 5k', status: 'not-started', startDate: new Date(), targetDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), description: 'Train consistently and complete a 5k race.', progress: 0},
          ]);
        }

         const storedMoods = localStorage.getItem("chrono-zen-moods");
         if (storedMoods) {
           setMoods(JSON.parse(storedMoods));
         } else {
           setMoods([]);
         }

      } catch (error) {
        console.error("Failed to parse from localStorage", error);
        setTasks([]);
        setEvents([]);
        setHabits([]);
        setGoals([]);
        setMoods([]);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem("chrono-zen-tasks", JSON.stringify(tasks));
      } catch (error) {
        console.error("Failed to save tasks to localStorage", error);
      }
    }
  }, [tasks]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem("chrono-zen-events", JSON.stringify(events));
      } catch (error) {
        console.error("Failed to save events to localStorage", error);
      }
    }
  }, [events]);

   useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem("chrono-zen-habits", JSON.stringify(habits));
      } catch (error) {
        console.error("Failed to save habits to localStorage", error);
      }
    }
  }, [habits]);

   useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem("chrono-zen-goals", JSON.stringify(goals));
      } catch (error) {
        console.error("Failed to save goals to localStorage", error);
      }
    }
  }, [goals]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem("chrono-zen-moods", JSON.stringify(moods));
      } catch (error) {
        console.error("Failed to save moods to localStorage", error);
      }
    }
  }, [moods]);


  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => !task.archived)
      .filter(task => isSameDay(task.date, selectedDate))
      .filter(task => task.name.toLowerCase().includes(searchTerm.toLowerCase()) || task.description?.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(task => filters.category === 'all' || task.category === filters.category)
      .filter(task => filters.priority === 'all' || task.priority === filters.priority)
      .filter(task => {
        if (filters.status === 'all') return true;
        if (filters.status === 'completed') return task.completed;
        if (filters.status === 'incomplete') return !task.completed;
        return true;
      });
  }, [tasks, selectedDate, searchTerm, filters]);

  const filteredEvents = useMemo(() => {
    return events
      .filter(event => isSameDay(event.date, selectedDate))
      .filter(event => event.name.toLowerCase().includes(searchTerm.toLowerCase()) || event.description?.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(event => filters.category === 'all' || event.category === filters.category);
  }, [events, selectedDate, searchTerm, filters]);

  const sortedTasks = useMemo(() => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    return [...filteredTasks].sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'category':
          return a.category.localeCompare(b.category);
        case 'time':
        default:
          return a.startTime.localeCompare(b.startTime);
      }
    });
  }, [filteredTasks, sortBy]);

  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [filteredEvents]);

  const handleAddTask = (newTask: Omit<Task, 'id' | 'completed' | 'archived'>) => {
    setTasks(prev => [...prev, { ...newTask, id: crypto.randomUUID(), completed: false, archived: false }]);
  };

  const handleEditTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
    setEditingTask(null);
  };
  
  const handleToggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };
  
  const handleArchiveCompleted = () => {
    setTasks(prev => prev.map(task => task.completed ? { ...task, archived: true } : task));
  };

  const handleAddEvent = (newEvent: Omit<Event, 'id'>) => {
    setEvents(prev => [...prev, { ...newEvent, id: crypto.randomUUID() }]);
  };

  const handleEditEvent = (updatedEvent: Event) => {
    setEvents(prev => prev.map(event => event.id === updatedEvent.id ? updatedEvent : event));
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const handleAddHabit = (newHabit: Omit<Habit, 'id' | 'completedDates'>) => {
    setHabits(prev => [...prev, { ...newHabit, id: crypto.randomUUID(), completedDates: [] }]);
  };

  const handleToggleHabit = (habitId: string, date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const completed = habit.completedDates.includes(dateString);
        const newCompletedDates = completed
          ? habit.completedDates.filter(d => d !== dateString)
          : [...habit.completedDates, dateString];
        return { ...habit, completedDates: newCompletedDates };
      }
      return habit;
    }));
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
  };

  const handleAddGoal = (newGoal: Omit<Goal, 'id' | 'status' | 'progress'>) => {
    setGoals(prev => [...prev, { ...newGoal, id: crypto.randomUUID(), status: 'not-started', progress: 1 }]);
  };
  
  const handleEditGoal = (updatedGoal: Goal) => {
    setGoals(prev => prev.map(goal => {
        if (goal.id === updatedGoal.id) {
            return {
                ...updatedGoal,
                startDate: new Date(updatedGoal.startDate),
                targetDate: new Date(updatedGoal.targetDate),
            };
        }
        return goal;
    }));
    setEditingGoal(null);
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
    // Also unlink tasks associated with this goal
    setTasks(prev => prev.map(task => task.goalId === goalId ? { ...task, goalId: undefined } : task));
  };

  const handleUpdateGoalStatus = (goalId: string, status: Goal['status']) => {
    setGoals(prev => prev.map(goal => goal.id === goalId ? { ...goal, status } : goal));
  }

  const handleSaveMood = (newMood: Omit<MoodEntry, 'id'>) => {
    setMoods(prev => {
      const existingEntryIndex = prev.findIndex(m => m.date === newMood.date);
      if (existingEntryIndex > -1) {
        const updatedMoods = [...prev];
        updatedMoods[existingEntryIndex] = { ...updatedMoods[existingEntryIndex], ...newMood };
        return updatedMoods;
      }
      return [...prev, { ...newMood, id: crypto.randomUUID() }];
    });
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };
  
  const todaysItems = useMemo(() => {
    return [
      ...tasks.filter(t => isSameDay(t.date, selectedDate) && !t.archived),
      ...events.filter(e => isSameDay(e.date, selectedDate))
    ]
  }, [tasks, events, selectedDate]);

  const renderActiveView = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard tasks={tasks} events={events} goals={goals} />;
      case "timeline":
        return <TimelineView tasks={sortedTasks} events={sortedEvents} onToggleTask={handleToggleTask} onEditEvent={setEditingEvent} onEditTask={setEditingTask}/>;
      case "tasks":
        return (
          <TaskList 
            tasks={sortedTasks} 
            onToggleTask={handleToggleTask} 
            onDeleteTask={handleDeleteTask}
            onEditTask={(task) => setEditingTask(task)}
            onArchiveCompleted={handleArchiveCompleted}
          />
        );
      case "events":
        return (
          <EventList
            events={sortedEvents}
            onEditEvent={(event) => setEditingEvent(event)}
            onDeleteEvent={handleDeleteEvent}
          />
        );
      case "habits":
        return (
          <HabitTracker 
            habits={habits}
            selectedDate={selectedDate}
            onAddHabit={handleAddHabit}
            onToggleHabit={handleToggleHabit}
            onDeleteHabit={handleDeleteHabit}
          />
        );
      case "goals":
        return (
          <GoalTracker 
            goals={goals}
            tasks={tasks}
            onAddGoal={handleAddGoal}
            onDeleteGoal={handleDeleteGoal}
            onEditGoal={(goal) => setEditingGoal(goal)}
            onUpdateGoalStatus={handleUpdateGoalStatus}
          />
        );
      case "calendar":
        return (
          <CalendarView 
            tasks={tasks}
            events={events}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onNavigateToTimeline={() => setActiveView('timeline')}
          />
        );
      case "focus":
        return <FocusTimer />;
      case "wellness":
        return (
          <MoodTracker 
            moods={moods}
            selectedDate={selectedDate}
            onSaveMood={handleSaveMood}
            tasks={tasks.filter(t => isSameDay(t.date, selectedDate))}
            onSuggestActivity={() => setIsWellnessDialogOpen(true)}
          />
        );
      case "profile":
        return <ProfilePage />;
      default:
        return <Dashboard tasks={tasks} events={events} goals={goals} />;
    }
  };

  // Show landing page if showLandingPage is true
  if (showLandingPage) {
    return <LandingPage onGetStarted={() => setShowLandingPage(false)} />;
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-3 px-4 py-3">
            <Book className="h-6 w-6" />
            <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">ChronoZen</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="slide-in-left px-2 py-2">
          <SidebarMenu className="space-y-1">
            <SidebarMenuItem className="stagger-fade-in">
              <SidebarMenuButton 
                isActive={activeView === 'dashboard'} 
                onClick={() => setActiveView('dashboard')}
                className="transition-smooth hover-lift group px-3 py-2 mx-1"
                tooltip="Dashboard"
              >
                <LayoutDashboard className="sidebar-icon-animate group-hover:sidebar-icon-pulse h-5 w-5" />
                <span className="sidebar-text-fade ml-3">Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="stagger-fade-in">
              <SidebarMenuButton 
                isActive={activeView === 'tasks'} 
                onClick={() => setActiveView('tasks')}
                className="transition-smooth hover-lift group px-3 py-2 mx-1"
                tooltip="Tasks"
              >
                <ClipboardList className="sidebar-icon-animate group-hover:sidebar-icon-bounce h-5 w-5" />
                <span className="sidebar-text-fade ml-3">Tasks</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="stagger-fade-in">
              <SidebarMenuButton 
                isActive={activeView === 'events'} 
                onClick={() => setActiveView('events')}
                className="transition-smooth hover-lift group px-3 py-2 mx-1"
                tooltip="Events"
              >
                <CalendarIcon className="sidebar-icon-animate group-hover:sidebar-icon-pulse h-5 w-5" />
                <span className="sidebar-text-fade ml-3">Events</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="stagger-fade-in">
              <SidebarMenuButton 
                isActive={activeView === 'calendar'} 
                onClick={() => setActiveView('calendar')}
                className="transition-smooth hover-lift group px-3 py-2 mx-1"
                tooltip="Calendar"
              >
                <CalendarIcon className="sidebar-icon-animate group-hover:sidebar-icon-bounce h-5 w-5" />
                <span className="sidebar-text-fade ml-3">Calendar</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="stagger-fade-in">
              <SidebarMenuButton 
                isActive={activeView === 'timeline'} 
                onClick={() => setActiveView('timeline')}
                className="transition-smooth hover-lift group px-3 py-2 mx-1"
                tooltip="Timeline"
              >
                <GanttChartSquare className="sidebar-icon-animate group-hover:sidebar-icon-pulse h-5 w-5" />
                <span className="sidebar-text-fade ml-3">Timeline</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="stagger-fade-in">
              <SidebarMenuButton 
                isActive={activeView === 'habits'} 
                onClick={() => setActiveView('habits')}
                className="transition-smooth hover-lift group px-3 py-2 mx-1"
                tooltip="Habits"
              >
                <Book className="sidebar-icon-animate group-hover:sidebar-icon-bounce h-5 w-5" />
                <span className="sidebar-text-fade ml-3">Habits</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="stagger-fade-in">
              <SidebarMenuButton 
                isActive={activeView === 'goals'} 
                onClick={() => setActiveView('goals')}
                className="transition-smooth hover-lift group px-3 py-2 mx-1"
                tooltip="Goals"
              >
                <Target className="sidebar-icon-animate group-hover:sidebar-icon-pulse h-5 w-5" />
                <span className="sidebar-text-fade ml-3">Goals</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem className="stagger-fade-in">
              <SidebarMenuButton 
                isActive={activeView === 'focus'} 
                onClick={() => setActiveView('focus')}
                className="transition-smooth hover-lift group px-3 py-2 mx-1"
                tooltip="Focus"
              >
                <Timer className="sidebar-icon-animate group-hover:sidebar-icon-bounce h-5 w-5" />
                <span className="sidebar-text-fade ml-3">Focus</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="stagger-fade-in">
              <SidebarMenuButton 
                isActive={activeView === 'wellness'} 
                onClick={() => setActiveView('wellness')}
                className="transition-smooth hover-lift group px-3 py-2 mx-1"
                tooltip="Wellness"
              >
                <Smile className="sidebar-icon-animate group-hover:sidebar-icon-pulse h-5 w-5" />
                <span className="sidebar-text-fade ml-3">Wellness</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="stagger-fade-in">
              <SidebarMenuButton 
                isActive={activeView === 'profile'} 
                onClick={() => setActiveView('profile')}
                className="transition-smooth hover-lift group px-3 py-2 mx-1"
                tooltip="Profile"
              >
                <User className="sidebar-icon-animate group-hover:sidebar-icon-bounce h-5 w-5" />
                <span className="sidebar-text-fade ml-3">Profile</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen bg-background fade-in">
          <header className="sticky top-0 z-20 w-full bg-background/80 backdrop-blur-sm border-b slide-in-left">
            <div className="container mx-auto flex items-center justify-between p-4 flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="transition-smooth hover:scale-110 hover:bg-accent hover:text-accent-foreground" />
                <div className="flex flex-col">
                  <h1 className="text-xl md:text-2xl font-bold font-headline text-gray-800 hover:text-primary transition-smooth">
                    ChronoZen
                  </h1>
                  <p className="text-xs md:text-sm text-muted-foreground">{format(selectedDate, "EEEE, MMMM do, yyyy")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <div className="slide-in-right">
                   <DailySummary tasks={sortedTasks} events={sortedEvents} />
                 </div>
                 <div className="slide-in-right" style={{animationDelay: '0.1s'}}>
                   <ScheduleSuggesterSheet />
                 </div>
              </div>
            </div>
             {activeView !== 'calendar' && activeView !== 'habits' && activeView !== 'focus' && activeView !== 'goals' && activeView !== 'wellness' && activeView !== 'dashboard' && activeView !== 'profile' && (
                <div className="container mx-auto pb-4 px-4">
                    <FilterControls
                        searchTerm={searchTerm}
                        onSearchTermChange={setSearchTerm}
                        filters={filters}
                        onFiltersChange={setFilters}
                        sortBy={sortBy}
                        onSortByChange={setSortBy}
                        activeView={activeView}
                    />
                </div>
            )}
          </header>

          <main className="flex-grow container mx-auto p-4 md:p-6 overflow-y-auto slide-up">
            <div className="scale-in">
              {renderActiveView()}
            </div>
          </main>

          <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-30 flex flex-col gap-4">
             <AddTaskDialog onAddTask={handleAddTask} selectedDate={selectedDate} goals={goals} dailyItems={todaysItems}>
              <Button size="lg" className="rounded-full h-14 w-14 shadow-lg hover-lift hover-glow transition-smooth scale-in" style={{animationDelay: '0.8s'}}>
                <Plus className="h-7 w-7 transition-smooth group-hover:rotate-90" />
                <span className="sr-only">Add Task</span>
              </Button>
            </AddTaskDialog>
             <AddEventDialog onAddEvent={handleAddEvent} selectedDate={selectedDate} dailyItems={todaysItems}>
              <Button size="lg" className="rounded-full h-14 w-14 shadow-lg hover-lift hover-glow transition-smooth scale-in" style={{animationDelay: '0.9s'}}>
                <CalendarPlus className="h-6 w-6 transition-smooth group-hover:scale-110" />
                <span className="sr-only">Add Event</span>
              </Button>
            </AddEventDialog>
          </div>

          {editingTask && (
            <EditTaskDialog
              task={editingTask}
              onEditTask={handleEditTask}
              onOpenChange={(isOpen) => !isOpen && setEditingTask(null)}
              isOpen={!!editingTask}
              goals={goals}
            />
          )}
          {editingEvent && (
            <EditEventDialog
              event={editingEvent}
              onEditEvent={handleEditEvent}
              onOpenChange={(isOpen) => !isOpen && setEditingEvent(null)}
              isOpen={!!editingEvent}
            />
          )}
          {editingGoal && (
            <EditGoalDialog
              goal={editingGoal}
              onEditGoal={handleEditGoal}
              onOpenChange={(isOpen) => !isOpen && setEditingGoal(null)}
              isOpen={!!editingGoal}
            />
          )}
           <WellnessSuggestionDialog 
              isOpen={isWellnessDialogOpen} 
              onOpenChange={setIsWellnessDialogOpen}
              currentMood={moods.find(m => m.date === format(selectedDate, 'yyyy-MM-dd'))?.mood ?? 'meh'}
            />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
