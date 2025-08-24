
"use client";

import React, { useMemo } from 'react';
import type { Task, Event, Goal } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { ClipboardList, Calendar, Flag, CheckCircle, PieChart, TrendingUp, ArrowRight, Clock, Target, Sparkles, Activity, Zap, Award, BarChart3, LineChart, Users, Timer } from 'lucide-react';
import { isToday, isFuture, format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval } from 'date-fns';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Pie, Cell, Legend, LineChart as RechartsLineChart, Line, Area, AreaChart, RadialBarChart, RadialBar, ComposedChart } from 'recharts';

interface DashboardProps {
    tasks: Task[];
    events: Event[];
    goals: Goal[];
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border bg-background/95 backdrop-blur-sm p-3 shadow-lg">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground font-medium">
              {label}
            </span>
            <span className="font-bold text-foreground">
              {payload[0].value} tasks
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};


export function Dashboard({ tasks, events, goals }: DashboardProps) {

    const todayTasks = useMemo(() => tasks.filter(t => isToday(t.date)), [tasks]);
    const todayEvents = useMemo(() => events.filter(e => isToday(e.date)), [events]);
    const upcomingTasks = useMemo(() => tasks.filter(t => isFuture(t.date) && !isToday(t.date)).sort((a,b) => a.date.getTime() - b.date.getTime()).slice(0, 5), [tasks]);
    const activeGoals = useMemo(() => goals.filter(g => g.status === 'in-progress'), [goals]);
    
    // Weekly productivity data
    const weeklyData = useMemo(() => {
        const weekStart = startOfWeek(new Date());
        const weekEnd = endOfWeek(new Date());
        const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
        
        return daysInWeek.map(day => {
            const dayTasks = tasks.filter(t => 
                t.date.toDateString() === day.toDateString()
            );
            const completed = dayTasks.filter(t => t.completed).length;
            const total = dayTasks.length;
            
            return {
                day: format(day, 'EEE'),
                completed,
                total,
                productivity: total > 0 ? Math.round((completed / total) * 100) : 0
            };
        });
    }, [tasks]);
    
    // Priority distribution
    const priorityData = useMemo(() => {
        const priorities = todayTasks.reduce((acc, task) => {
            const priority = task.priority || 'medium';
            acc[priority] = (acc[priority] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        return Object.entries(priorities).map(([name, value]) => ({ 
            name: name.charAt(0).toUpperCase() + name.slice(1), 
            value,
            color: name === 'high' ? 'hsl(var(--destructive))' : 
                   name === 'medium' ? 'hsl(var(--chart-3))' : 
                   'hsl(var(--chart-2))'
        }));
    }, [todayTasks]);
    
    // Time-based insights
    const timeInsights = useMemo(() => {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.completed).length;
        const overdueTasks = tasks.filter(t => !t.completed && t.date < new Date()).length;
        const avgGoalProgress = goals.length > 0 ? 
            Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length) : 0;
            
        return {
            totalTasks,
            completedTasks,
            overdueTasks,
            avgGoalProgress,
            productivityScore: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
        };
    }, [tasks, goals]);
    
    // Monthly progress data for line chart
    const monthlyProgress = useMemo(() => {
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthTasks = tasks.filter(t => 
                t.date.getMonth() === date.getMonth() && 
                t.date.getFullYear() === date.getFullYear()
            );
            const monthEvents = events.filter(e => 
                e.date.getMonth() === date.getMonth() && 
                e.date.getFullYear() === date.getFullYear()
            );
            
            months.push({
                month: format(date, 'MMM'),
                tasks: monthTasks.length,
                completed: monthTasks.filter(t => t.completed).length,
                events: monthEvents.length,
                productivity: monthTasks.length > 0 ? Math.round((monthTasks.filter(t => t.completed).length / monthTasks.length) * 100) : 0
            });
        }
        return months;
    }, [tasks, events]);
    
    // Goal completion radial data
    const goalRadialData = useMemo(() => {
        return goals.map((goal, index) => ({
            name: goal.title.length > 15 ? goal.title.substring(0, 15) + '...' : goal.title,
            progress: goal.progress,
            fill: `hsl(var(--chart-${(index % 5) + 1}))`
        }));
    }, [goals]);
    
    // Task completion heatmap data (last 30 days)
    const heatmapData = useMemo(() => {
        const days = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayTasks = tasks.filter(t => 
                t.date.toDateString() === date.toDateString()
            );
            const completed = dayTasks.filter(t => t.completed).length;
            
            days.push({
                date: format(date, 'MMM dd'),
                day: format(date, 'EEE'),
                tasks: dayTasks.length,
                completed,
                intensity: dayTasks.length > 0 ? Math.min(completed / dayTasks.length, 1) : 0
            });
        }
        return days;
    }, [tasks]);
    
    // Category performance data
    const taskCategoryData = useMemo(() => {
        const categoryCount = todayTasks.reduce((acc, task) => {
            acc[task.category] = (acc[task.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(categoryCount).map(([name, value]) => ({ name, value }));
    }, [todayTasks]);

    const categoryPerformance = useMemo(() => {
        const categories = taskCategoryData.map(cat => {
            const completed = todayTasks.filter(t => t.category === cat.name && t.completed).length;
            return {
                name: cat.name,
                total: cat.value,
                completed,
                pending: cat.value - completed,
                efficiency: cat.value > 0 ? Math.round((completed / cat.value) * 100) : 0
            };
        });
        return categories;
    }, [taskCategoryData, todayTasks]);

    const completedTasksCount = useMemo(() => todayTasks.filter(t => t.completed).length, [todayTasks]);
    const completionPercentage = todayTasks.length > 0 ? (completedTasksCount / todayTasks.length) * 100 : 0;

    return (
        <div className="space-y-8 p-1">
            {/* Welcome Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Sparkles className="h-8 w-8 text-primary" />
                    Dashboard
                </h1>
                <p className="text-muted-foreground text-lg">
                    Welcome back! Here's what's happening today.
                </p>
            </div>

            {/* Enhanced Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Today's Tasks</CardTitle>
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <ClipboardList className="h-5 w-5 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="text-3xl font-bold text-foreground">{todayTasks.length}</div>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                                {completedTasksCount} completed
                            </Badge>
                            {completionPercentage > 0 && (
                                <div className="text-xs text-muted-foreground">
                                    {completionPercentage.toFixed(0)}% done
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-chart-2/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Today's Events</CardTitle>
                        <div className="p-2 bg-chart-2/10 rounded-lg">
                            <Calendar className="h-5 w-5 text-chart-2" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="text-3xl font-bold text-foreground">{todayEvents.length}</div>
                        <Badge variant="outline" className="text-xs">
                            in your calendar
                        </Badge>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-chart-3/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Goals</CardTitle>
                        <div className="p-2 bg-chart-3/10 rounded-lg">
                            <Target className="h-5 w-5 text-chart-3" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="text-3xl font-bold text-foreground">{activeGoals.length}</div>
                        <Badge variant="outline" className="text-xs">
                            in progress
                        </Badge>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-chart-4/20 group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Productivity Score</CardTitle>
                        <div className="p-2 bg-chart-4/10 rounded-lg group-hover:bg-chart-4/20 transition-colors">
                            <Activity className="h-5 w-5 text-chart-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="text-3xl font-bold text-foreground">{timeInsights.productivityScore}%</div>
                        <div className="space-y-1">
                            <Badge variant={timeInsights.productivityScore >= 80 ? "default" : timeInsights.productivityScore >= 60 ? "secondary" : "outline"} className="text-xs">
                                {timeInsights.completedTasks}/{timeInsights.totalTasks} total
                            </Badge>
                            <Progress value={timeInsights.productivityScore} className="h-2" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Additional Stats Row */}
            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
                <Card className="hover:shadow-lg transition-all duration-300 group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Overdue Tasks</CardTitle>
                        <div className="p-2 bg-destructive/10 rounded-lg group-hover:bg-destructive/20 transition-colors">
                            <Timer className="h-5 w-5 text-destructive" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{timeInsights.overdueTasks}</div>
                        <Badge variant={timeInsights.overdueTasks === 0 ? "default" : "destructive"} className="text-xs mt-1">
                            {timeInsights.overdueTasks === 0 ? "All caught up!" : "Need attention"}
                        </Badge>
                    </CardContent>
                </Card>
                
                <Card className="hover:shadow-lg transition-all duration-300 group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Goal Progress</CardTitle>
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <Award className="h-5 w-5 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{timeInsights.avgGoalProgress}%</div>
                        <Badge variant="secondary" className="text-xs mt-1">
                            Average progress
                        </Badge>
                    </CardContent>
                </Card>
                
                <Card className="hover:shadow-lg transition-all duration-300 group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Weekly Streak</CardTitle>
                        <div className="p-2 bg-chart-1/10 rounded-lg group-hover:bg-chart-1/20 transition-colors">
                            <Zap className="h-5 w-5 text-chart-1" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{weeklyData.filter(d => d.completed > 0).length}</div>
                        <Badge variant="outline" className="text-xs mt-1">
                            Active days
                        </Badge>
                    </CardContent>
                </Card>
                
                <Card className="hover:shadow-lg transition-all duration-300 group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Focus Time</CardTitle>
                        <div className="p-2 bg-chart-5/10 rounded-lg group-hover:bg-chart-5/20 transition-colors">
                            <Clock className="h-5 w-5 text-chart-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{Math.round(todayTasks.length * 0.5)}h</div>
                        <Badge variant="secondary" className="text-xs mt-1">
                            Estimated today
                        </Badge>
                    </CardContent>
                </Card>
            </div>
            
            {/* Weekly Productivity Chart */}
            <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        <CardTitle className="text-xl">Weekly Productivity</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                        Your task completion trends over the past week.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={weeklyData}>
                            <defs>
                                <linearGradient id="productivityGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis 
                                dataKey="day" 
                                axisLine={false}
                                tickLine={false}
                                className="text-xs fill-muted-foreground"
                            />
                            <YAxis 
                                axisLine={false}
                                tickLine={false}
                                className="text-xs fill-muted-foreground"
                            />
                            <Tooltip 
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="rounded-xl border bg-background/95 backdrop-blur-sm p-3 shadow-lg">
                                                <p className="font-medium">{label}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Completed: {payload[0]?.payload?.completed} / {payload[0]?.payload?.total}
                                                </p>
                                                <p className="text-sm font-medium text-primary">
                                                    Productivity: {payload[0]?.value}%
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="productivity" 
                                stroke="hsl(var(--primary))" 
                                strokeWidth={2}
                                fill="url(#productivityGradient)"
                                className="drop-shadow-sm"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Monthly Trends Chart */}
            <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                        <LineChart className="h-5 w-5 text-chart-1" />
                        <CardTitle className="text-xl">Monthly Trends</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                        Task completion and productivity trends over the last 6 months.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart data={monthlyProgress}>
                            <XAxis 
                                dataKey="month" 
                                axisLine={false}
                                tickLine={false}
                                className="text-xs fill-muted-foreground"
                            />
                            <YAxis 
                                yAxisId="left"
                                axisLine={false}
                                tickLine={false}
                                className="text-xs fill-muted-foreground"
                            />
                            <YAxis 
                                yAxisId="right"
                                orientation="right"
                                axisLine={false}
                                tickLine={false}
                                className="text-xs fill-muted-foreground"
                            />
                            <Tooltip 
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="rounded-xl border bg-background/95 backdrop-blur-sm p-3 shadow-lg">
                                                <p className="font-medium mb-2">{label}</p>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-chart-1">Tasks: {payload.find(p => p.dataKey === 'tasks')?.value}</p>
                                                    <p className="text-sm text-chart-2">Completed: {payload.find(p => p.dataKey === 'completed')?.value}</p>
                                                    <p className="text-sm text-chart-3">Events: {payload.find(p => p.dataKey === 'events')?.value}</p>
                                                    <p className="text-sm text-primary font-medium">Productivity: {payload.find(p => p.dataKey === 'productivity')?.value}%</p>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar yAxisId="left" dataKey="tasks" fill="hsl(var(--chart-1))" name="Total Tasks" radius={[2, 2, 0, 0]} />
                            <Bar yAxisId="left" dataKey="completed" fill="hsl(var(--chart-2))" name="Completed" radius={[2, 2, 0, 0]} />
                            <Bar yAxisId="left" dataKey="events" fill="hsl(var(--chart-3))" name="Events" radius={[2, 2, 0, 0]} />
                            <Line yAxisId="right" type="monotone" dataKey="productivity" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }} name="Productivity %" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            
            {/* Goals Progress Radial Chart */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-chart-4" />
                            <CardTitle className="text-xl">Goals Progress</CardTitle>
                        </div>
                        <CardDescription className="text-base">
                            Individual goal completion status.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {goalRadialData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={goalRadialData}>
                                    <RadialBar 
                                        dataKey="progress" 
                                        cornerRadius={10} 
                                        fill="hsl(var(--primary))"
                                        label={{ position: 'insideStart', fill: '#fff', fontSize: 12 }}
                                    />
                                    <Tooltip 
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="rounded-xl border bg-background/95 backdrop-blur-sm p-3 shadow-lg">
                                                        <p className="font-medium">{payload[0].payload.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Progress: {payload[0].value}%
                                                        </p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                </RadialBarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center py-12 space-y-2">
                                <Target className="h-12 w-12 text-muted-foreground/50 mx-auto" />
                                <p className="text-muted-foreground">No active goals</p>
                                <p className="text-sm text-muted-foreground/70">Create goals to track progress</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
                
                <Card className="hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-chart-5" />
                            <CardTitle className="text-xl">Category Performance</CardTitle>
                        </div>
                        <CardDescription className="text-base">
                            Task completion by category today.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {categoryPerformance.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={categoryPerformance} layout="horizontal">
                                    <XAxis type="number" axisLine={false} tickLine={false} className="text-xs fill-muted-foreground" />
                                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} className="text-xs fill-muted-foreground" width={80} />
                                    <Tooltip 
                                        content={({ active, payload, label }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="rounded-xl border bg-background/95 backdrop-blur-sm p-3 shadow-lg">
                                                        <p className="font-medium mb-2">{label}</p>
                                                        <div className="space-y-1">
                                                            <p className="text-sm text-chart-2">Completed: {payload.find(p => p.dataKey === 'completed')?.value}</p>
                                                            <p className="text-sm text-chart-1">Pending: {payload.find(p => p.dataKey === 'pending')?.value}</p>
                                                            <p className="text-sm text-primary font-medium">Efficiency: {payload[0]?.payload?.efficiency}%</p>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar dataKey="completed" stackId="a" fill="hsl(var(--chart-2))" radius={[0, 2, 2, 0]} />
                                    <Bar dataKey="pending" stackId="a" fill="hsl(var(--chart-1))" radius={[0, 2, 2, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center py-12 space-y-2">
                                <BarChart3 className="h-12 w-12 text-muted-foreground/50 mx-auto" />
                                <p className="text-muted-foreground">No categories to display</p>
                                <p className="text-sm text-muted-foreground/70">Add tasks with categories</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            
            {/* Activity Heatmap */}
            <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-chart-3" />
                        <CardTitle className="text-xl">30-Day Activity Heatmap</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                        Daily task completion intensity over the last month.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-10 gap-1">
                            {heatmapData.slice(-30).map((day, index) => (
                                <div
                                    key={index}
                                    className="aspect-square rounded-sm border border-border/50 flex items-center justify-center text-xs font-medium transition-all hover:scale-110 cursor-pointer"
                                    style={{
                                        backgroundColor: day.intensity > 0.8 ? 'hsl(var(--primary))' :
                                                       day.intensity > 0.6 ? 'hsl(var(--primary) / 0.7)' :
                                                       day.intensity > 0.4 ? 'hsl(var(--primary) / 0.5)' :
                                                       day.intensity > 0.2 ? 'hsl(var(--primary) / 0.3)' :
                                                       day.intensity > 0 ? 'hsl(var(--primary) / 0.1)' :
                                                       'hsl(var(--muted))',
                                        color: day.intensity > 0.4 ? 'white' : 'hsl(var(--muted-foreground))'
                                    }}
                                    title={`${day.date}: ${day.completed}/${day.tasks} tasks completed`}
                                >
                                    {day.completed}
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Less</span>
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-sm bg-muted"></div>
                                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'hsl(var(--primary) / 0.2)' }}></div>
                                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'hsl(var(--primary) / 0.5)' }}></div>
                                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'hsl(var(--primary) / 0.8)' }}></div>
                                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'hsl(var(--primary))' }}></div>
                            </div>
                            <span>More</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Main Content Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4 hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            <CardTitle className="text-xl">Upcoming Tasks</CardTitle>
                        </div>
                        <CardDescription className="text-base">
                            A look at what's next on your schedule.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       {upcomingTasks.length > 0 ? upcomingTasks.map((task, index) => (
                           <div key={task.id} className="group flex items-center p-4 rounded-lg border border-border/50 hover:border-primary/20 hover:bg-accent/5 transition-all duration-200">
                               <div className="flex-1 space-y-2">
                                   <div className="flex items-center gap-2">
                                       <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                       <p className="font-medium text-foreground group-hover:text-primary transition-colors">{task.name}</p>
                                   </div>
                                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                       <Clock className="h-3 w-3" />
                                       <span>{task.startTime} on {format(task.date, "MMM dd")}</span>
                                   </div>
                               </div>
                               <Badge variant="outline" className="capitalize font-medium">
                                   {task.category}
                               </Badge>
                               <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all ml-2" />
                           </div>
                       )) : (
                        <div className="text-center py-8 space-y-2">
                            <Clock className="h-12 w-12 text-muted-foreground/50 mx-auto" />
                            <p className="text-muted-foreground">No upcoming tasks.</p>
                            <p className="text-sm text-muted-foreground/70">You're all caught up!</p>
                        </div>
                       )}
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3 hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2">
                             <PieChart className="h-5 w-5 text-chart-2" />
                             <CardTitle className="text-xl">Priority Distribution</CardTitle>
                         </div>
                        <CardDescription className="text-base">
                            Today's tasks by priority level.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {priorityData.length > 0 ? (
                            <div className="space-y-4">
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie 
                                            data={priorityData} 
                                            dataKey="value" 
                                            nameKey="name" 
                                            cx="50%" 
                                            cy="50%" 
                                            innerRadius={50} 
                                            outerRadius={80} 
                                            paddingAngle={2} 
                                            labelLine={false}
                                        >
                                            {priorityData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity" />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div className="rounded-xl border bg-background/95 backdrop-blur-sm p-3 shadow-lg">
                                                            <p className="font-medium">{payload[0].name} Priority</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {payload[0].value} tasks
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="grid grid-cols-1 gap-2">
                                    {priorityData.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-accent/20">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                                <span className="text-sm font-medium">{item.name}</span>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                {item.value} tasks
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 space-y-2">
                                 <PieChart className="h-12 w-12 text-muted-foreground/50 mx-auto" />
                                 <p className="text-muted-foreground">No tasks to display</p>
                                 <p className="text-sm text-muted-foreground/70">Add some tasks to see the priority distribution</p>
                             </div>
                        )}
                    </CardContent>
                </Card>
            </div>

             {/* Goals Section */}
             <div className="grid gap-6">
                <Card className="hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-6">
                        <div className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-chart-3" />
                            <CardTitle className="text-xl">Goals In Progress</CardTitle>
                        </div>
                        <CardDescription className="text-base">
                            Track your progress towards achieving your goals.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {activeGoals.length > 0 ? activeGoals.map((goal, index) => (
                             <div key={goal.id} className="group p-4 rounded-lg border border-border/50 hover:border-chart-3/20 hover:bg-accent/5 transition-all duration-200 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="font-semibold text-foreground group-hover:text-chart-3 transition-colors">{goal.name}</p>
                                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <Badge variant={goal.progress >= 75 ? "default" : goal.progress >= 50 ? "secondary" : "outline"} className="font-bold">
                                            {goal.progress}%
                                        </Badge>
                                        <div className="text-xs text-muted-foreground">
                                            {goal.progress >= 75 ? "Almost there!" : goal.progress >= 50 ? "Great progress" : "Keep going"}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Progress value={goal.progress} className="h-3" />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Started</span>
                                        <span>{goal.progress < 100 ? `${100 - goal.progress}% remaining` : "Completed!"}</span>
                                    </div>
                                </div>
                             </div>
                        )) : (
                            <div className="text-center py-12 space-y-4">
                                <Target className="h-16 w-16 text-muted-foreground/50 mx-auto" />
                                <div className="space-y-2">
                                    <p className="text-lg font-medium text-muted-foreground">No active goals</p>
                                    <p className="text-sm text-muted-foreground/70">Set some goals to track your progress and stay motivated!</p>
                                </div>
                                <Button variant="outline" className="mt-4">
                                    <Target className="h-4 w-4 mr-2" />
                                    Create Your First Goal
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
