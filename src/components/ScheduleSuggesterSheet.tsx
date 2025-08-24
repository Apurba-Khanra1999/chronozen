
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  suggestOptimalScheduleTimes,
  type SuggestOptimalScheduleTimesOutput,
} from "@/ai/flows/suggest-schedule";
import { Sparkles, Loader2, CalendarCheck, BarChart, BrainCircuit, Mic } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";
import { Progress } from "./ui/progress";

const formSchema = z.object({
  taskName: z.string().min(1, "Task name is required."),
  deadline: z.string().optional(),
  taskDurationMinutes: z.coerce.number().optional(),
  historicalData: z.string().min(10, "Please describe your daily habits in more detail."),
});

export function ScheduleSuggesterSheet() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SuggestOptimalScheduleTimesOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskName: "",
      deadline: "",
      taskDurationMinutes: 60,
      historicalData: "I usually work from 9 AM to 5 PM with a lunch break at 12:30 PM. My most productive hours are in the morning. I prefer to handle complex tasks before noon.",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const deadlineDate = values.deadline ? new Date(values.deadline).toISOString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 1 week default
      const duration = values.taskDurationMinutes || 60;
      const response = await suggestOptimalScheduleTimes({ ...values, deadline: deadlineDate, taskDurationMinutes: duration });
      setResult(response);
    } catch (error) {
      console.error("Error getting schedule suggestion:", error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Could not get a schedule suggestion. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const formattedDate = result?.suggestedStartTime 
    ? new Date(result.suggestedStartTime).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Sparkles className="mr-2 h-4 w-4" />
          Smart Suggest
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Smart Schedule Suggestions</SheetTitle>
          <SheetDescription>
            Let AI find the perfect time for your task based on your habits and deadlines.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="taskName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="e.g., Finalize report tomorrow at 3pm" {...field} />
                        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                          <Mic className="h-4 w-4"/>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taskDurationMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="60" {...field} />
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline (Optional)</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="historicalData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Habits & Schedule</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your typical day, productive hours, etc."
                        className="resize-y min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SheetFooter className="pt-4">
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Suggesting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Get Suggestion
                    </>
                  )}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </div>

        {isLoading && (
          <div className="space-y-4 mt-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-4">
             <Alert>
              <BrainCircuit className="h-4 w-4" />
              <AlertTitle>Parsed Task: {result.taskName}</AlertTitle>
              <AlertDescription>Duration: {result.taskDurationMinutes} minutes</AlertDescription>
            </Alert>
            <Alert className="border-primary">
              <CalendarCheck className="h-4 w-4" />
              <AlertTitle className="font-bold">Suggested Start Time</AlertTitle>
              <AlertDescription>{formattedDate}</AlertDescription>
            </Alert>
            <Alert>
              <BarChart className="h-4 w-4" />
              <AlertTitle>Confidence Level</AlertTitle>
              <AlertDescription className="flex items-center gap-2">
                <Progress value={result.confidenceLevel * 100} className="w-2/3"/>
                <span>{Math.round(result.confidenceLevel * 100)}%</span>
              </AlertDescription>
            </Alert>
             <Alert>
              <BrainCircuit className="h-4 w-4" />
              <AlertTitle>Reasoning</AlertTitle>
              <AlertDescription>{result.reasoning}</AlertDescription>
            </Alert>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
