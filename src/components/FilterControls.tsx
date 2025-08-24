
"use client";

import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ListFilter, ArrowUpDown } from 'lucide-react';

export type Filters = {
  category: 'all' | 'work' | 'personal' | 'study' | 'appointment' | 'birthday' | 'other';
  priority: 'all' | 'low' | 'medium' | 'high';
  status: 'all' | 'completed' | 'incomplete';
};

export type SortBy = 'time' | 'priority' | 'category';

interface FilterControlsProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  sortBy: SortBy;
  onSortByChange: (sortBy: SortBy) => void;
  activeView: string;
}

export function FilterControls({
  searchTerm,
  onSearchTermChange,
  filters,
  onFiltersChange,
  sortBy,
  onSortByChange,
  activeView,
}: FilterControlsProps) {

  const handleFilterChange = <T extends keyof Filters>(key: T, value: Filters[T]) => {
    onFiltersChange({ ...filters, [key]: value });
  };
  
  const isTaskView = activeView === 'tasks' || activeView === 'dashboard';

  return (
    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full">
      <div className="relative w-full md:flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search tasks & events..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="pl-10 w-full"
        />
      </div>
      <div className="flex items-center gap-2 w-full md:w-auto">
        <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value as Filters['category'])}>
            <SelectTrigger className="w-full md:w-[150px]">
                <ListFilter className="h-4 w-4 mr-2"/>
                <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="study">Study</SelectItem>
                <SelectItem value="appointment">Appointment</SelectItem>
                <SelectItem value="birthday">Birthday</SelectItem>
                <SelectItem value="other">Other</SelectItem>
            </SelectContent>
        </Select>

        {isTaskView && (
             <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value as Filters['priority'])}>
                <SelectTrigger className="w-full md:w-[150px]">
                    <ListFilter className="h-4 w-4 mr-2"/>
                    <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                </SelectContent>
            </Select>
        )}

        {isTaskView && (
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value as Filters['status'])}>
                <SelectTrigger className="w-full md:w-[150px]">
                     <ListFilter className="h-4 w-4 mr-2"/>
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="incomplete">Incomplete</SelectItem>
                </SelectContent>
            </Select>
        )}
        
        {isTaskView && (
             <Select value={sortBy} onValueChange={(value) => onSortByChange(value as SortBy)}>
                <SelectTrigger className="w-full md:w-[150px]">
                    <ArrowUpDown className="h-4 w-4 mr-2"/>
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="time">Sort by Time</SelectItem>
                    <SelectItem value="priority">Sort by Priority</SelectItem>
                    <SelectItem value="category">Sort by Category</SelectItem>
                </SelectContent>
            </Select>
        )}
      </div>
    </div>
  );
}

