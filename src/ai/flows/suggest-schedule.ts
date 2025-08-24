
// src/ai/flows/suggest-schedule.ts
'use server';
/**
 * @fileOverview AI-powered tool suggests optimal times to schedule tasks based on user habits and deadlines.
 *
 * - suggestOptimalScheduleTimes - A function that handles the schedule suggestion process.
 * - SuggestOptimalScheduleTimesInput - The input type for the suggestOptimalScheduleTimes function.
 * - SuggestOptimalScheduleTimesOutput - The return type for the suggestOptimalScheduleTimes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimalScheduleTimesInputSchema = z.object({
  taskName: z.string().describe('The name of the task to schedule. This can be a natural language description like "Meet with John tomorrow at 3pm for 1 hour about the new project"'),
  deadline: z.string().describe('The deadline for the task (e.g., YYYY-MM-DDTHH:MM:SSZ). This can be optional if specified in the task name.'),
  historicalData: z.string().describe('User historical data including typical daily schedule, preferred working times, and task completion rates.'),
  taskDurationMinutes: z.number().describe('The estimated duration of the task in minutes. This can be optional if specified in the task name.'),
});
export type SuggestOptimalScheduleTimesInput = z.infer<typeof SuggestOptimalScheduleTimesInputSchema>;

const SuggestOptimalScheduleTimesOutputSchema = z.object({
  suggestedStartTime: z.string().describe('The suggested start time for the task (e.g., YYYY-MM-DDTHH:MM:SSZ).'),
  confidenceLevel: z.number().describe('A value between 0 and 1 indicating the confidence level of the suggestion.'),
  reasoning: z.string().describe('The AI reasoning behind the suggested start time.'),
  taskName: z.string().describe("The parsed name of the task."),
  taskDurationMinutes: z.number().describe("The parsed duration of the task in minutes."),
});
export type SuggestOptimalScheduleTimesOutput = z.infer<typeof SuggestOptimalScheduleTimesOutputSchema>;

export async function suggestOptimalScheduleTimes(input: SuggestOptimalScheduleTimesInput): Promise<SuggestOptimalScheduleTimesOutput> {
  return suggestOptimalScheduleTimesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOptimalScheduleTimesPrompt',
  input: {schema: SuggestOptimalScheduleTimesInputSchema},
  output: {schema: SuggestOptimalScheduleTimesOutputSchema},
  prompt: `You are an AI assistant designed to suggest the best time to schedule tasks for users and parse task details from natural language.

  Given the following information about the task, the user's historical data, and the task deadline, suggest an optimal start time for the task.
  
  First, parse the 'Task Name' to extract the actual task title and its duration if provided. For example, from "Meet with John tomorrow at 3pm for 1 hour about the new project", you should extract "Meet with John about the new project" as the name and 60 as the duration.

  Task Name: {{{taskName}}}
  Deadline: {{{deadline}}}
  Task Duration (minutes): {{{taskDurationMinutes}}}
  User Historical Data: {{{historicalData}}}

  Consider the user's preferred working times, typical daily schedule, and task completion rates when making your suggestion.

  Return the suggested start time, a confidence level (between 0 and 1), a brief explanation of your reasoning, the parsed task name, and the parsed task duration.

  Make sure the suggested start time allows the task to be completed before the deadline.
  Consider the current date when formulating the start time, returning in ISO format.
  If the task duration is present in both the task name and the 'Task Duration' field, prioritize the one from the task name.
  `,
});

const suggestOptimalScheduleTimesFlow = ai.defineFlow(
  {
    name: 'suggestOptimalScheduleTimesFlow',
    inputSchema: SuggestOptimalScheduleTimesInputSchema,
    outputSchema: SuggestOptimalScheduleTimesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
