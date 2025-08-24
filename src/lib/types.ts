
export type Task = {
  id: string;
  name: string;
  date: Date;
  startTime: string;
  endTime: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'work' | 'personal' | 'study' | 'other';
  description?: string;
  archived?: boolean;
  goalId?: string;
};

export type Event = {
  id: string;
  name: string;
  date: Date;
  startTime: string;
  endTime: string;
  category: 'work' | 'personal' | 'appointment' | 'birthday' | 'other';
  description?: string;
  recurring: 'none' | 'daily' | 'weekly' | 'monthly';
  reminder: 'none' | '5' | '15' | '30' | '60';
};

export type Habit = {
  id: string;
  name: string;
  category: 'health' | 'personal' | 'work' | 'learn' | 'other';
  frequency: 'daily' | 'weekly';
  completedDates: string[]; // Store date strings in 'YYYY-MM-DD' format
};

export type Goal = {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  targetDate: Date;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number; // Manual progress from 0 to 100
};

export type Mood = 'rad' | 'good' | 'meh' | 'bad' | 'awful';

export type MoodEntry = {
  id: string;
  date: string; // YYYY-MM-DD format
  mood: Mood;
  note?: string;
};
