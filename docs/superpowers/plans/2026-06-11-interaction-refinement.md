# Interaction & Mastery Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transition the app from a passive flashcard system to an active learning tool with a functioning mastery loop, verified content, and a secure "Final Boss" gateway.

**Architecture:**
1.  **Data**: Update `content.json` to support multiple acceptable answers (`answer: string[]`) and curated Wikipedia links.
2.  **Learning Loop**: Implement a session-based queue in the Study Mode that handles randomization, repeats failed questions, and tracks streaks toward mastery.
3.  **UX**: Shift to a "Self-Grading" model (Input $\rightarrow$ Reveal $\rightarrow$ User Grade) to eliminate technical grading errors in open-ended responses.
4.  **Security**: Implement a server-side-like validation check on the `/final-boss` route based on IndexedDB mastery state.

**Tech Stack:** Svelte 5 (Runes), Tailwind CSS, Dexie.js, Lucide Icons.

---

### Task 1: Data Model Expansion & Content Enrichment

**Files:**
- Modify: `src/lib/types.ts`
- Modify: `src/lib/content.json`
- Create: `scripts/enrich_data.py` (temporary script for automation)

- [ ] **Step 1: Update Question interface to support multiple answers.**
Modify `src/lib/types.ts`:
```typescript
export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  answers: string[]; // Changed from answer?: string
  wikiLink?: string;
}
```

- [ ] **Step 2: Implement a sub-agent process to find and validate Wikipedia links for all 128 questions.**
Use a sub-agent to:
1. Read `src/lib/content.json`.
2. For each `standard` question, search for the most accurate Wikipedia article.
3. Validate the URL exists and is relevant to the question.
4. Update the `wikiLink` field in `src/lib/content.json`.

- [ ] **Step 3: Update `content.json` to convert `answer` strings to `answers` arrays.**
Run a script to map existing single answers into arrays and add common alternatives where known.
Expected: `answer: "Republic"` $\rightarrow$ `answers: ["Republic", "Constitution-based federal republic", "Representative democracy"]`.

- [ ] **Step 4: Commit changes.**
```bash
git add src/lib/types.ts src/lib/content.json
git commit -m "feat: expand data model to support multiple answers and enriched wiki links"
```

### Task 2: Interactive "Self-Grading" Question Card

**Files:**
- Modify: `src/lib/components/QuestionCard.svelte`

- [ ] **Step 1: Add an input field for the user's response.**
Introduce a `textarea` or `input` that is visible by default.
- [ ] **Step 2: Implement the "Check Answer" flow.**
  - User types answer $\rightarrow$ clicks "Check".
  - a) The correct `answers` array is revealed.
  - b) The "Go Deeper" link is revealed (only AFTER checking).
  - c) Two buttons appear: "I got it right" and "I got it wrong".
- [ ] **Step 3: Connect to `processAnswer` logic.**
  - "I got it right" $\rightarrow$ call `processAnswer(id, true)`.
  - "I got it wrong" $\rightarrow$ call `processAnswer(id, false)`.
- [ ] **Step 4 Look for unused code around answer validation and clean it up**
Given we are allowing self grading, we don't need any code that validates the answer automatically
- [ ] **Step 5: Commit changes.**
```bash
git add src/lib/components/QuestionCard.svelte
git commit -m "feat: implement self-grading interaction loop in QuestionCard"
```

### Task 3: Session-Based Study Queue & Randomization

**Files:**
- Modify: `src/routes/study/[moduleId]/+page.svelte`
- Modify: `src/lib/state.ts`

- [ ] **Step 1: Implement a session queue.**
Instead of using `currentIdx`, maintain a `queue` array of question IDs.
- [ ] **Step 2: Implement randomization.**
On mount, shuffle the module's questions and populate the `queue`.
- [ ] **Step 3: Implement the repetition logic.**
If `processAnswer` returns `isMastered: false` and `isCorrect: false`, push the current question ID to the end of the `queue` so it appears again.
- [ ] **Step 4: Update the UI to reflect the queue progress.**
Update the progress bar to show `(original_count - remaining_in_queue) / original_count`.
- [ ] **Step 5: Commit changes.**
```bash
git add src/routes/study/[moduleId]/+page.svelte src/lib/state.ts
git commit -m "feat: implement randomized study queue and repetition logic"
```

### Task 4: Dashboard Goal & Final Boss Security

**Files:**
- Modify: `src/routes/dashboard/+page.svelte`
- Modify: `src/routes/final-boss/+page.svelte`

- [ ] **Step 1: Add the "Final Boss" Locked Card to the Dashboard.**
Add a specific card at the end of the grid.
- If `allModulesPassed` is false $\rightarrow$ show "Lock" icon, grayscale styling, and a tooltip: "Master all modules to unlock".
- If true $\rightarrow$ show "Unlock" animation and a bright "ENTER EXAM" button.
- [ ] **Step 2: Implement strict route guarding for `/final-boss`.**
In `+page.svelte` for `/final-boss`, check mastery state in `onMount`.
If any module's mastery is $< 60\%$, immediately redirect the user to `/dashboard` with an alert: "You must master all modules before attempting the Final Boss."
- [ ] **Step 3: Commit changes.**
```bash
git add src/routes/dashboard/+page.svelte src/routes/final-boss/+page.svelte
git commit -m "feat: implement Final Boss dashboard gateway and route protection"
```

### Task 5: Final End-to-End Verification

- [ ] **Step 1: Verify Study $\rightarrow$ Mastery flow.**
Answer 3 questions correctly in a row $\rightarrow$ verify `db.progress` shows `masteredCount: 1`.
- [ ] **Step 2: Verify the "Wrong Answer" loop.**
Answer incorrectly $\rightarrow$ verify question reappears in the session queue.
- [ ] **Step 3: Verify Route Guard.**
Attempt to access `/final-boss` without mastery $\rightarrow$ verify redirect to `/dashboard`.
- [ ] **Step 4: Final Commit.**
```bash
git commit -m "chore: verify end-to-end learning loop and security"
```
