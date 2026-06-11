# Civics Test Prep App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a gamified, high-confidence learning application for the 2025 US Naturalization Civics Test.

**Architecture:** A SvelteKit 5 (Runes) and Tailwind CSS application featuring specialized progression logic (3-streak mastery), content categorization into thematic modules, and a "Final Boss" mock exam gate. State persistence is handled locally via Dexie.js/IndexedDB.

**Tech Stack:** SvelteKit 5 (Runes), Tailwind CSS, Lucide Icons (optional for icons), Dexie.js (persistence).

---

### Task 1: Project Foundation & PWA Setup
**Files:**
- Create: `src/app.html`
- Modify: `svelte.config.js`, `vite.config.ts`
- Test: N/A

- [ ] **Step 1: Initialize SvelteKit with Tailwind CSS and Typescript.**
  Run standard installation commands or verify existing config includes `@tailwindcss/postcss`.

- [ ] **Step 2: Configure PWA functionality.**
  Install `vite-plugin-pwa` or similar and configure the `manifest.json` to ensure it can be installed as a standalone app on mobile devices.

- [ ] **Step 3: Commit changes.**
  ```bash
  git add .
  git commit -m "chore: initial project setup with SvelteKit, Tailwind, and PWA config"
  ```

### Task 2: Data Engineering & Preparation
**Files:**
- Create: `data/source_questions.json` (or equivalent raw source)
- Create: `src/lib/content.json` (The processed production JSON)
- Test: N/A

- [ ] **Step 1: Extract and Clean Raw Data.**
  Process the raw USCIS list into a clean, manageable format. Ensure all 128 questions are present.

- [ ] **Step 2: Categorize into Modules & Map Types.**
  Assign each question to one of the ~6 thematic modules (e.g., Government, History). Label them as `standard` or `personal_info`.

- [ ] **Step 3: Populate "Go Deeper" Links.**
  Generate/map Wikipedia links for all `standard` questions where applicable.

- [ ] **Step 4: Export Production JSON.**
  Generate the final `src/lib/content.json` formatted specifically for the application's internal use.

### Task 3: Data Modeling & Initial Content Loader
**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/data.ts`
- Test: `src/lib/data.test.ts` (or check during dev)

- [ ] **Step 1: Define Question types.**
  Create `src/lib/types.ts`:
  ```typescript
  export type QuestionType = 'standard' | 'personal_info';

  export interface Question {
    id: string;
    text: string;
    type: QuestionType;
    answer?: string; // For standard questions
    wikiLink?: string; // Link for "Go Deeper"
  }

  export interface Module {
    id: string;
    title: string;
    questions: Question[];
    masteredCount: number;
  }
  ```

- [ ] **Step 2: Load questions from JSON.**
  Create `src/lib/data.ts` to fetch and parse the internal content JSON, mapping them into the defined types.

- [ ] **Step 3: Verify data integrity.**
  Log the loaded items to ensure `personal_info` are correctly flagged and links work.

### Task 4: Progress Persistence Layer (Dexie.js)
**Files:**
- Create: `src/lib/db.ts`
- Test: Manual verification of state persistence on refresh.

- [ ] **Step 1: Initialize Dexie database.**
  Create `src/lib/db.ts`:
  ```typescript
  import Dexie from 'dexie';

  export class AppDB extends Dexie {
        constructor() {
          super('CivicsTestDB');
          this.version(1).then(() => {
            this.stores.add('progress'); // Schema: id (string), masteredCount (number), etc.
          });
        }
      }
      export const db = new AppDB();
  ```

- [ ] **Step 2: Implement persistence hooks.**
  Write a helper to save/load user progress (mastered question IDs, planned info inputs).

### Task 5: Mastery Logic & Streak System
**Files:**
- Create: `src/lib/state.ts`
- Test: Verify that 3 consecutive correct answers sets `isMastered = true`.

- [ ] **Step 1: Implement the streak counter.**
  In `src/lib/state.ts`, implement a getter for current streaks and logic to determine "mastery":
  ```typescript
  // Logic snippet
  if (currentAnswer === correct) {
        streak += 1;
      } else {
        streak = 0;
      }

  if (streak >= 3) {
    markAsMastered(questionId);
  }
  ```

- [ ] **Step 2: Logic for "Personal Info" items.**
  Implement logic where `type === 'personal_info'` updates a "viewed" status and skips the streak requirement.

### Task 6: Study Mode UI (The Learning Loop)
**Files:**
- Create: `src/routes/study/[ moduleId]/+page.svelte`
- Modify: `src/lib/components/QuestionCard.svelte`

- [ ] **Step 1: Build the Question Card.**
  Create a component that displays the question and buttons for "Next" and "Go Deeper".
  The "Go Deeper" button should open an in-context expansion (modal or drawer) with content from `wikiLink`.

- [ ] **Step 2: Implement Study Flow.**
  Navigation logic to progress through questions within a module. Ensure the streak updates on each successful answer.

### Task 7: Module Selection & Progress Dashboard
**Files:**
- Create: `src/routes/dashboard/+page.svelte`

- [ ] **Step 1: Build the Overview Grid.**
  Create cards for all modules showing progress (e.g., "12/20 Mastered"). Highlight mastered ones in a different color.

- [ ] **Step 2: Implement Module Selection.**
  Users click a card to enter Study Mode for that specific module.

### Task 8: Module Test & The "Final Boss" Gateway
**Files:**
- Create: `src/routes/test/[ moduleId]/+page.svelte`
- Create: `src/routes/final-boss/+page.svelte`

- [ ] **Step 1: Implement the Module Test.**
  A timer or simple selection test for questions in the selected module.
  Requirement: Must get at least 12/20 correct to "pass" and unlock the next stage.

- [ ] **Step 2: Implement failure redirect.**
  If <12 correctly answered, show a screen saying "Need more practice" and provide links to study specific missed items.

- [ ] **Step 3: Implementation of "Final Boss".**
  A randomized exam featuring all mastered questions from across the entire set.
  Only accessible if all module requirements (pass marks) are met.

### Task 9: Refinement & Polish
**Files:**
- Update: Global styles (`app.css`)
- Review: All components for Tailwind consistency.

- [ ] **Step 1: Theme integration.**
  Ensure consistent color palette (calming blues/greens to reduce user anxiety).

- [ ] **Step 2: Final PWA Check.**
  Verify manifest and icons appear correctly on mobile devices.**