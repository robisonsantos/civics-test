# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Dev Server**: `npm run dev`
- **Build**: `npm run build`
- **Type Check & Sync**: `npm run check` (runs `svelte-kit sync` and `svelte-check`)

## Architecture Overview

### Core Stack
- **Framework**: SvelteKit 5 (utilizing Runes for state management).
- **Styling**: Tailwind CSS with a calming, blue-green focused palette.
- **Persistence**: Dexie.js (IndexedDB) for client-side progress tracking without authentication.
- **Data**: Static content managed in `src/lib/content.json` and loaded via `src/lib/data.ts`.

### Key Logic & Flow
- **3-Streak Mastery**: A question is only "mastered" after 3 consecutive correct answers (`src/lib/state.ts`).
- **Progress Path**: `Dashboard` $\rightarrow$ `Study Mode` (Learning Loop) $\rightarrow$ `Module Test` (60% pass rate) $\rightarrow$ `Final Boss` (Certification Exam).
- **Question Types**: 
  - `standard`: Fact-based questions with a correct answer.
  - `personal_info`: Dynamic questions (e.g., "Who is your representative?") that are marked as "viewed" rather than "mastered".

### Directory Structure
- `src/lib/components/`: UI components (e.g., `QuestionCard.svelte`).
- `src/lib/data.ts`: Data loaders and helper functions for accessing questions.
- `src/lib/db.ts`: Dexie.js database configuration and persistence hooks.
- `src/lib/state.ts`: Business logic for mastery and streaks.
- `src/routes/`: SvelteKit pages (Dashboard, Study, Test, and Final Boss).
- `data/`: Raw source data and parsing scripts.
