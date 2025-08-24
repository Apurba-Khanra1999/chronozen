
"use client";

import type { Event } from "@/lib/types";
import { EventItem } from "./EventItem";

interface EventListProps {
  events: Event[];
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (id: string) => void;
}

export function EventList({ events, onEditEvent, onDeleteEvent }: EventListProps) {

  if (events.length === 0) {
    return (
      <div className="text-center py-10 md:py-20 border-2 border-dashed rounded-lg mt-4">
        <h2 className="text-lg md:text-xl font-semibold text-muted-foreground">You have no events scheduled.</h2>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">Add an event to see it here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg md:text-xl font-semibold">Today's Events</h2>
      </div>
      <div className="space-y-3">
        {events.map(event => (
          <EventItem 
            key={event.id} 
            event={event} 
            onEdit={onEditEvent}
            onDelete={onDeleteEvent}
          />
        ))}
      </div>
    </div>
  );
}
