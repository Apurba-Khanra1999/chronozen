
"use client";

import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Volume2, Loader2, Play, Pause } from 'lucide-react';
import { textToSpeech } from '@/ai/flows/text-to-speech-flow';
import type { Task, Event } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface DailySummaryProps {
  tasks: Task[];
  events: Event[];
}

export function DailySummary({ tasks, events }: DailySummaryProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const summaryText = useMemo(() => {
    let summary = "Here is your schedule for today. ";
    if (tasks.length === 0 && events.length === 0) {
      return "You have no tasks or events scheduled for today. Enjoy your day!";
    }

    if (tasks.length > 0) {
      summary += `You have ${tasks.length} task${tasks.length > 1 ? 's' : ''}. `;
      tasks.forEach(task => {
        summary += `From ${task.startTime} to ${task.endTime}, you have ${task.name}. `;
      });
    }

    if (events.length > 0) {
      summary += `You also have ${events.length} event${events.length > 1 ? 's' : ''}. `;
      events.forEach(event => {
        summary += `From ${event.startTime} to ${event.endTime}, you have ${event.name}. `;
      });
    }

    return summary;
  }, [tasks, events]);

  const handleGenerateAudio = async () => {
    setIsLoading(true);
    setAudioUrl(null);
    try {
      const audioDataUri = await textToSpeech(summaryText);
      setAudioUrl(audioDataUri);
      toast({ title: "Audio ready", description: "Your daily summary audio is ready to play." });
    } catch (error) {
      console.error("Error generating audio:", error);
      toast({ variant: 'destructive', title: "Error", description: "Failed to generate audio for your summary." });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleEnded = () => {
      setIsPlaying(false);
  }

  return (
    <div>
      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} onEnded={handleEnded} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
      )}

      {audioUrl ? (
        <Button onClick={togglePlay} variant="outline" size="icon">
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          <span className="sr-only">{isPlaying ? 'Pause' : 'Play'} Summary</span>
        </Button>
      ) : (
        <Button onClick={handleGenerateAudio} disabled={isLoading} variant="outline" size="icon">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
          <span className="sr-only">Read Schedule Aloud</span>
        </Button>
      )}
    </div>
  );
}
