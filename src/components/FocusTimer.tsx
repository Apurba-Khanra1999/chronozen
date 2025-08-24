
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, RefreshCw, Settings, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export function FocusTimer() {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);

  const [mode, setMode] = useState<TimerMode>('work');
  const [minutes, setMinutes] = useState(workMinutes);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);
  const { toast } = useToast();

  const getDuration = useCallback((currentMode: TimerMode) => {
    switch (currentMode) {
      case 'work': return workMinutes;
      case 'shortBreak': return shortBreakMinutes;
      case 'longBreak': return longBreakMinutes;
      default: return workMinutes;
    }
  }, [workMinutes, shortBreakMinutes, longBreakMinutes]);
  
  const totalSeconds = minutes * 60 + seconds;
  const initialTotalSeconds = getDuration(mode) * 60;
  const progress = initialTotalSeconds > 0 ? (initialTotalSeconds - totalSeconds) / initialTotalSeconds * 100 : 0;

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setMinutes(getDuration(mode));
    setSeconds(0);
  }, [mode, getDuration]);

  useEffect(() => {
    resetTimer();
  }, [mode, resetTimer]);
  
  const notify = useCallback((newMode: TimerMode) => {
    const message = newMode === 'work' ? "Time for a break!" : "Time to focus!";
     toast({
        title: "Pomodoro Timer",
        description: message,
    });

    if(Notification.permission === 'granted') {
      new Notification("Pomodoro Timer", { body: message });
    }
  }, [toast]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const switchMode = useCallback(() => {
    if (mode === 'work') {
      const newCycles = cycles + 1;
      setCycles(newCycles);
      notify(mode);
      setMode(newCycles % 4 === 0 ? 'longBreak' : 'shortBreak');
    } else {
      notify(mode);
      setMode('work');
    }
  }, [mode, cycles, notify]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(s => s - 1);
        } else if (minutes > 0) {
          setMinutes(m => m - 1);
          setSeconds(59);
        } else {
          switchMode();
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval as NodeJS.Timeout);
    }
    return () => clearInterval(interval as NodeJS.Timeout);
  }, [isActive, seconds, minutes, switchMode]);

  const handleSettingsSave = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      resetTimer();
      toast({ title: "Settings saved!", description: "Your timer durations have been updated."});
  }

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center relative">
          <CardTitle className="text-3xl">Focus Timer</CardTitle>
          <CardDescription>Stay productive with the Pomodoro technique.</CardDescription>
           <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="absolute top-4 right-4">
                    <Settings />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                 <form onSubmit={handleSettingsSave} className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Timer Settings</h4>
                        <p className="text-sm text-muted-foreground">
                        Set the duration for your timer sessions.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="work">Focus</Label>
                            <Input id="work" type="number" value={workMinutes} onChange={(e) => setWorkMinutes(Math.max(1, parseInt(e.target.value, 10)))} className="col-span-2 h-8" />
                        </div>
                         <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="shortBreak">Short Break</Label>
                            <Input id="shortBreak" type="number" value={shortBreakMinutes} onChange={(e) => setShortBreakMinutes(Math.max(1, parseInt(e.target.value, 10)))} className="col-span-2 h-8" />
                        </div>
                         <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="longBreak">Long Break</Label>
                            <Input id="longBreak" type="number" value={longBreakMinutes} onChange={(e) => setLongBreakMinutes(Math.max(1, parseInt(e.target.value, 10)))} className="col-span-2 h-8" />
                        </div>
                    </div>
                    <Button type="submit" size="sm">
                        <Save className="mr-2 h-4 w-4"/>
                        Save
                    </Button>
                </form>
            </PopoverContent>
           </Popover>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-8">
          <Tabs value={mode} onValueChange={(value) => setMode(value as TimerMode)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="work">Focus</TabsTrigger>
              <TabsTrigger value="shortBreak">Short Break</TabsTrigger>
              <TabsTrigger value="longBreak">Long Break</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle
                    className="text-muted"
                    strokeWidth="12"
                    stroke="currentColor"
                    fill="transparent"
                    r="114"
                    cx="128"
                    cy="128"
                />
                <circle
                    className="text-primary transition-all duration-500 ease-in-out"
                    strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 114}
                    strokeDashoffset={2 * Math.PI * 114 * (1 - progress / 100)}
                    stroke="currentColor"
                    fill="transparent"
                    r="114"
                    cx="128"
                    cy="128"
                />
            </svg>
            <span className="text-6xl font-bold tabular-nums">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Button
              size="lg"
              className={cn("rounded-full h-20 w-20 shadow-lg text-2xl", isActive && "bg-destructive hover:bg-destructive/90")}
              onClick={() => setIsActive(prev => !prev)}
            >
              {isActive ? <Pause size={32}/> : <Play size={32} className="ml-1"/>}
            </Button>
            <Button
                size="icon"
                variant="ghost"
                className="rounded-full h-12 w-12 text-muted-foreground"
                onClick={resetTimer}
            >
                <RefreshCw size={20}/>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
