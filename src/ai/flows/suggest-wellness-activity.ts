'use server';
/**
 * @fileOverview An AI-powered tool to suggest wellness activities.
 *
 * - suggestWellnessActivity - A function that suggests a wellness activity based on mood.
 * - SuggestWellnessActivityInput - The input type for the suggestWellnessActivity function.
 * - SuggestWellnessActivityOutput - The return type for the suggestWellnessActivity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Mood } from '@/lib/types';

const SuggestWellnessActivityInputSchema = z.object({
  mood: z.enum(['rad', 'good', 'meh', 'bad', 'awful']).describe('The user\'s current mood.'),
});
export type SuggestWellnessActivityInput = z.infer<typeof SuggestWellnessActivityInputSchema>;

const SuggestWellnessActivityOutputSchema = z.object({
  title: z.string().describe('A short, catchy title for the suggested activity.'),
  description: z.string().describe('A one or two sentence description of the wellness activity.'),
  activityType: z.enum(['break', 'exercise', 'breathing', 'stretch', 'mindfulness', 'other']).describe('The category of the suggested activity.'),
});
export type SuggestWellnessActivityOutput = z.infer<typeof SuggestWellnessActivityOutputSchema>;


export async function suggestWellnessActivity(input: SuggestWellnessActivityInput): Promise<SuggestWellnessActivityOutput> {
  return suggestWellnessActivityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestWellnessActivityPrompt',
  input: {schema: SuggestWellnessActivityInputSchema},
  output: {schema: SuggestWellnessActivityOutputSchema},
  prompt: `You are a wellness coach AI. Your goal is to provide a simple, actionable wellness suggestion based on the user's mood.

  User's mood: {{{mood}}}

  Based on this mood, suggest a short activity (a break, a breathing exercise, or a light stretch).
  - If the mood is 'rad' or 'good', suggest a short break or a fun, light activity to maintain the positive energy.
  - If the mood is 'meh', suggest an energizing activity like a quick walk or a simple stretch.
  - If the mood is 'bad' or 'awful', suggest a calming activity like a breathing exercise or a gentle stretch to help alleviate stress.

  Keep the suggestion concise and easy to do in a few minutes.
  Return a title for the activity, a brief description, and the type of activity.
  Example for 'bad' mood:
  - Title: "Box Breathing"
  - Description: "Calm your mind with a simple box breathing exercise. Inhale for 4 seconds, hold for 4, exhale for 4, and hold for 4. Repeat a few times."
  - ActivityType: "breathing"
  `,
});

const suggestWellnessActivityFlow = ai.defineFlow(
  {
    name: 'suggestWellnessActivityFlow',
    inputSchema: SuggestWellnessActivityInputSchema,
    outputSchema: SuggestWellnessActivityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
