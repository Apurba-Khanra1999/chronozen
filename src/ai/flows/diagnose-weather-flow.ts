'use server';
/**
 * @fileOverview An AI-powered tool to diagnose the weather for a given day.
 *
 * - diagnoseWeather - A function that handles the weather diagnosis process.
 * - DiagnoseWeatherInput - The input type for the diagnoseWeather function.
 * - DiagnoseWeatherOutput - The return type for the diagnoseWeather function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnoseWeatherInputSchema = z.object({
  date: z.string().describe('The date for which to diagnose the weather (e.g., YYYY-MM-DD).'),
  location: z.string().describe('The location for which to diagnose the weather (e.g., "San Francisco, CA").'),
});
export type DiagnoseWeatherInput = z.infer<typeof DiagnoseWeatherInputSchema>;

const DiagnoseWeatherOutputSchema = z.object({
  forecast: z.string().describe('A summary of the weather forecast.'),
  temperature: z.object({
    high: z.number().describe('The high temperature in Celsius.'),
    low: z.number().describe('The low temperature in Celsius.'),
  }),
  condition: z.enum(['sunny', 'cloudy', 'rainy', 'snowy', 'windy', 'other']).describe('The primary weather condition.'),
  suggestions: z.array(z.string()).describe('A list of suggestions for activities based on the weather.'),
});
export type DiagnoseWeatherOutput = z.infer<typeof DiagnoseWeatherOutputSchema>;

export async function diagnoseWeather(input: DiagnoseWeatherInput): Promise<DiagnoseWeatherOutput> {
  return diagnoseWeatherFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseWeatherPrompt',
  input: {schema: DiagnoseWeatherInputSchema},
  output: {schema: DiagnoseWeatherOutputSchema},
  prompt: `You are a weather forecasting AI. Given a date and location, provide a weather diagnosis.

  Date: {{{date}}}
  Location: {{{location}}}

  Provide a forecast summary, high and low temperatures (in Celsius), the primary condition, and a few suggestions for activities.
  For example, if it's sunny, you might suggest "Go for a walk" or "Have a picnic". If it's rainy, you might suggest "Read a book" or "Visit a museum".
  `,
});

const diagnoseWeatherFlow = ai.defineFlow(
  {
    name: 'diagnoseWeatherFlow',
    inputSchema: DiagnoseWeatherInputSchema,
    outputSchema: DiagnoseWeatherOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
