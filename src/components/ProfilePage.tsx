"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Clock,
  Target,
  TrendingUp,
  Award,
  Activity,
  Settings,
  Edit3,
  CheckCircle,
  Timer,
  Brain,
  Heart,
  Zap
} from 'lucide-react';

const ProfilePage = () => {
  // Mock user data - in a real app, this would come from your state management or API
  const userData = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    avatar: "",
    joinDate: "January 2024",
    location: "San Francisco, CA",
    timezone: "PST (UTC-8)",
    bio: "Productivity enthusiast focused on achieving work-life balance through mindful time management."
  };

  const stats = {
    tasksCompleted: 247,
    goalsAchieved: 12,
    habitsTracked: 8,
    focusHours: 156,
    streakDays: 23,
    productivityScore: 87
  };

  const recentActivity = [
    { type: 'task', title: 'Completed "Review quarterly reports"', time: '2 hours ago', icon: CheckCircle },
    { type: 'goal', title: 'Achieved goal "Read 2 books this month"', time: '1 day ago', icon: Target },
    { type: 'habit', title: 'Maintained "Morning meditation" streak', time: '2 days ago', icon: Brain },
    { type: 'focus', title: 'Completed 2-hour focus session', time: '3 days ago', icon: Timer }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Profile
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Manage your account and view your productivity insights
            </p>
          </div>
          <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Personal Information Card */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24 ring-4 ring-blue-500/20">
                    <AvatarImage src={userData.avatar} alt={userData.name} />
                    <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                      {userData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-2xl">{userData.name}</CardTitle>
                <CardDescription className="text-base">{userData.bio}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{userData.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Joined {userData.joinDate}</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{userData.location}</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{userData.timezone}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Card */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span>Quick Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Current Streak</span>
                  <Badge variant="secondary" className="bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300">
                    {stats.streakDays} days
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Productivity Score</span>
                    <span className="text-sm font-semibold">{stats.productivityScore}%</span>
                  </div>
                  <Progress value={stats.productivityScore} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Stats and Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.tasksCompleted}</div>
                  <div className="text-sm text-green-600 dark:text-green-400">Tasks Completed</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <CardContent className="p-6 text-center">
                  <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.goalsAchieved}</div>
                  <div className="text-sm text-green-600 dark:text-green-400">Goals Achieved</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20">
                <CardContent className="p-6 text-center">
                  <Heart className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{stats.habitsTracked}</div>
                  <div className="text-sm text-emerald-600 dark:text-emerald-400">Active Habits</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20">
                <CardContent className="p-6 text-center">
                  <Timer className="h-8 w-8 text-teal-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-teal-700 dark:text-teal-300">{stats.focusHours}</div>
                  <div className="text-sm text-teal-600 dark:text-teal-400">Focus Hours</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-lime-50 to-lime-100 dark:from-lime-900/20 dark:to-lime-800/20">
                <CardContent className="p-6 text-center">
                  <Zap className="h-8 w-8 text-lime-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-lime-700 dark:text-lime-300">{stats.streakDays}</div>
                  <div className="text-sm text-lime-600 dark:text-lime-400">Day Streak</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <CardContent className="p-6 text-center">
                  <Award className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.productivityScore}%</div>
                  <div className="text-sm text-green-600 dark:text-green-400">Productivity</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>
                  Your latest achievements and activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const IconComponent = activity.icon;
                    return (
                      <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <div className="flex-shrink-0">
                          <IconComponent className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {activity.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-slate-500" />
                  <span>Preferences</span>
                </CardTitle>
                <CardDescription>
                  Customize your ChronoZen experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Theme</label>
                    <Badge variant="outline" className="w-fit">System Default</Badge>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Notifications</label>
                    <Badge variant="outline" className="w-fit">Enabled</Badge>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Work Hours</label>
                    <Badge variant="outline" className="w-fit">9:00 AM - 6:00 PM</Badge>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Focus Duration</label>
                    <Badge variant="outline" className="w-fit">25 minutes</Badge>
                  </div>
                </div>
                <Separator className="my-4" />
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage All Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;