
"use client";

import type { Event } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, MoreHorizontal, Clock, Briefcase, User, Gift, Bell, Repeat, FileText, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EventItemProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

const categoryIcons = {
  work: <Briefcase className="h-5 w-5 md:h-6 md:w-6" />,
  personal: <User className="h-5 w-5 md:h-6 md:w-6" />,
  appointment: <CalendarCheck className="h-5 w-5 md:h-6 md:w-6" />,
  birthday: <Gift className="h-5 w-5 md:h-6 md:w-6" />,
  other: <MoreHorizontal className="h-5 w-5 md:h-6 md:w-6" />,
};

export function EventItem({ event, onEdit, onDelete }: EventItemProps) {
  return (
    <Card className={cn("w-full transition-all duration-300 ease-in-out group bg-card")}>
      <CardContent className="p-3 md:p-4 flex items-start gap-3 md:gap-4">
        <div className="flex items-center justify-center h-10 w-10 bg-accent rounded-md shrink-0 text-accent-foreground">
          {categoryIcons[event.category]}
        </div>
        <div className="flex-grow grid gap-1">
          <p className="font-medium leading-tight text-sm md:text-base text-foreground">{event.name}</p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              <span>{event.startTime} - {event.endTime}</span>
            </div>
            <div className="flex items-center gap-2 capitalize">
              {categoryIcons[event.category as keyof typeof categoryIcons]}
              <span className="hidden sm:inline">{event.category}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
            {event.reminder !== 'none' && (
              <div className="flex items-center gap-2">
                <Bell className="h-3.5 w-3.5" />
                <span>{event.reminder} min before</span>
              </div>
            )}
            {event.recurring !== 'none' && (
              <div className="flex items-center gap-2">
                <Repeat className="h-3.5 w-3.5" />
                <span className="capitalize">{event.recurring}</span>
              </div>
            )}
          </div>
          {event.description && (
             <div className="flex items-start gap-2 text-muted-foreground pt-1">
              <FileText className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <p className="whitespace-pre-wrap text-xs md:text-sm">{event.description}</p>
            </div>
          )}
        </div>
        <div className="shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-muted-foreground hover:bg-accent h-8 w-8"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(event)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(event.id)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
