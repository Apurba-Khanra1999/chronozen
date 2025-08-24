
"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Lightbulb, RefreshCw, Zap, Wind, StretchHorizontal, Brain, Move } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { suggestWellnessActivity, type SuggestWellnessActivityOutput } from "@/ai/flows/suggest-wellness-activity";
import type { Mood } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface WellnessSuggestionDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentMood: Mood;
}

const activityIcons = {
  break: <Zap className="h-6 w-6" />,
  exercise: <Move className="h-6 w-6" />,
  breathing: <Wind className="h-6 w-6" />,
  stretch: <StretchHorizontal className="h-6 w-6" />,
  mindfulness: <Brain className="h-6 w-6" />,
  other: <Lightbulb className="h-6 w-6" />,
};

export function WellnessSuggestionDialog({ isOpen, onOpenChange, currentMood }: WellnessSuggestionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestWellnessActivityOutput | null>(null);
  const { toast } = useToast();

  const getSuggestion = async () => {
    setIsLoading(true);
    setSuggestion(null);
    try {
      const response = await suggestWellnessActivity({ mood: currentMood });
      setSuggestion(response);
    } catch (error) {
      console.error("Error getting wellness suggestion:", error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Could not get a wellness suggestion. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getSuggestion();
    }
  }, [isOpen, currentMood]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Your Daily Wellness Tip
          </DialogTitle>
          <DialogDescription>
            Here's a quick activity suggestion based on your current mood.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading && (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {suggestion && (
            <Alert>
              <div className="flex items-center gap-3">
                 <div className="text-primary">
                    {activityIcons[suggestion.activityType]}
                 </div>
                 <div>
                    <AlertTitle className="font-bold text-lg">{suggestion.title}</AlertTitle>
                    <AlertDescription>{suggestion.description}</AlertDescription>
                 </div>
              </div>
            </Alert>
          )}
        </div>
        <DialogFooter className="sm:justify-start gap-2">
           <Button type="button" onClick={getSuggestion} disabled={isLoading}>
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Get Another Suggestion
            </Button>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
