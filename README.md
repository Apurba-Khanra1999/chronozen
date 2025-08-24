# ChronoZen - Your AI-Powered Daily Planner

ChronoZen is a modern, calm, and organized daily planner designed to help you manage your schedule, tasks, habits, and goals with ease. It leverages the power of AI to provide intelligent suggestions and automate repetitive tasks, allowing you to focus on what truly matters.

## ✨ Features

- **Unified Dashboard**: Get a comprehensive overview of your day, including tasks, events, and goal progress, all in one place.
- **Multiple Views**:
    - **Timeline**: A vertical, chronological view of your day's schedule.
    - **Calendar**: A traditional calendar view to navigate through your days.
    - **Tasks & Events**: Dedicated lists for managing your tasks and events.
- **Task & Event Management**: Easily add, edit, and delete tasks and events. Mark tasks as complete and archive them to keep your list clean.
- **Goal Tracking**: Set long-term goals, link tasks to them, and track your progress over time.
- **Habit Formation**: Define and track daily or weekly habits to build positive routines.
- **Mood & Wellness**:
    - **Daily Mood Check-in**: Log your mood to understand how it correlates with your productivity.
    - **Wellness Suggestions**: Receive AI-powered suggestions for breaks and wellness activities based on your mood.
- **AI-Powered Assistant**:
    - **Smart Schedule Suggester**: Let AI find the optimal time for your tasks based on your habits and deadlines.
    - **Text-to-Speech Summary**: Listen to a calm, audio summary of your daily schedule.
- **Focus Timer**: A built-in Pomodoro timer to help you stay focused and productive.
- **Conflict Detection**: Automatically detects and alerts you about overlapping tasks and events.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Component Library**: [ShadCN UI](https://ui.shadcn.com/)
- **AI Integration**: [Genkit (Firebase AI)](https://firebase.google.com/docs/genkit)
- **State Management**: React Hooks & Context API
- **Data Persistence**: Browser `localStorage` for simplicity.

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation & Running the App

1.  **Clone the repository** (or download the source code).
2.  **Install NPM packages**:
    ```sh
    npm install
    ```
3.  **Run the development server**:
    This command starts the Next.js application.
    ```sh
    npm run dev
    ```
4.  **Run the Genkit development server** (in a separate terminal):
    This command starts the Genkit server required for the AI features to work.
    ```sh
    npm run genkit:dev
    ```
5.  Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## 📂 Project Structure

The project is organized to keep a clear separation of concerns, making it easier to navigate and maintain.

```
src
├── ai
│   ├── flows/        # Contains all Genkit AI flows (e.g., schedule suggestions, TTS)
│   └── genkit.ts     # Genkit configuration
├── app
│   ├── globals.css   # Global styles and Tailwind CSS configuration
│   ├── layout.tsx    # Root layout for the application
│   └── page.tsx      # The main entry point component for the application
├── components
│   ├── ui/           # Reusable UI components from ShadCN
│   └── *.tsx         # Application-specific components (e.g., TaskList, Dashboard)
├── hooks
│   ├── use-mobile.ts # A hook to detect mobile devices
│   └── use-toast.ts  # A hook for managing toast notifications
└── lib
    ├── types.ts      # TypeScript type definitions for the application
    └── utils.ts      # Utility functions (e.g., cn for class names)
```

## 🤖 AI Integration with Genkit

The AI-powered features in ChronoZen are built using **Genkit**, a framework for building production-ready AI applications.

- **Flows**: The core logic for AI features is encapsulated in "flows," which can be found in `src/ai/flows/`. Each flow defines a specific AI task, such as `suggest-schedule.ts` for suggesting task times or `text-to-speech-flow.ts` for generating audio summaries.
- **Schema-Driven Development**: Genkit flows use Zod schemas to define the inputs and outputs, ensuring type safety and structured data exchange with the AI models.
- **Prompts**: Prompts are defined within the flows and use Handlebars templating to dynamically insert data into the prompts sent to the language model.
