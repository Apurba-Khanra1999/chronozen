import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-schedule.ts';
import '@/ai/flows/diagnose-weather-flow.ts';
import '@/ai/flows/text-to-speech-flow.ts';
