# Civics Test Prep App

## Project Vision
An interactive and engaging application designed to help individuals prepare for the US Naturalization Civics Test (2025 version). The core objective is to move users from a state of anxiety to **confidence** through a structured, gamified learning experience.

## Core Mechanics
- **Gamified Progression**: Questions are grouped into thematic modules. Users "master" content within these modules before advancing.
- **Mastery Logic**: To ensure true confidence, a question is considered "mastered" only after it is answered correctly in a streak of 3 consecutive successes. This filters out lucky guesses and ensuring the user truly knows the fact.
- **The "Final Boss"**: The final mock exam (a timed, randomized selection of all mastered questions) remains locked until every module has been fully completed.

## Data & Content Handling
- **Data Model**: A static JSON file stores question data with two distinct types:
    - `type: 'standard'`: Standard fact with a correct answer and an optional Wikipedia link for deep-diving.
    - `type: 'personal_info'`: Dynamic questions (e.g., "Who is your representative?") that require user input. These do not have a single "correct" answer but are marked as "reviewed" once interacted with, and they count as automatic success toward the 12/20 module threshold.
- **Go Deeper**: After answering any question, an in-context expansion ("Deep Dive") button appears to provide additional context or link directly to Wikipedia without breaking the study flow.

## Technical Implementation
- **Frontend & Core**: SvelteKit 5 (using Runes) and Tailwind CSS for a high-quality, responsive UI/UX.
- **Persistence**: Client-side only using IndexedDB (via Dexie.js) to provide a "no-friction" experience without requiring user sign-ups or accounts.
- **Deployment**: Progressive Web App (PWA) setup to allow the application to be installed on mobile devices as a standalone app.

## Learning Workflow
1.  **Study Mode**: Users focus on mastering questions in specific modules. 
2.  **Module Test**: To finish a module, the user must "pass" a test (12 out of 20 correct). If they fail, the system directs them back to study only those items they missed before allowing another attempt at the test.
3.  **Final Mastery**: Once all modules are mastered, the "Final Boss" mock exams are unlocked for repeated practice until they are ready for the actual exam.

## Development Context (Discovery Log)
The following decisions were made during the initial requirements gathering to ensure a high-quality user experience:

**1. User Persona & Goal:**
*   Focus on moving users from **anxiety to confidence**.
*   Target both "Just Pass" seekers and those needing a structured learning path, prioritizing psychological comfort.

**2. Mastery Progression:**
*   Implemented as a **3-streak success requirement** for any question to be considered mastered.
*   This filters out lucky guesses and ensures users are comfortable with the content before they attempt the "Final Boss."

**3. Module System & Selection:**
*   Divided 128 questions into ~5-6 broader thematic modules (e.g., Government, History).
*   A **Module Test** (12/20 target) acts as a gate; failure redirects users to study only those items they missed before retrying the test.

**4. Data Segmentation:**
*   Distinction between `standard` facts and `personal_info`.
*   Personal info questions are "one-time" interactions where user input is saved, ensuring they don't break the automated mastery logic but still contribute to progress.

**5. Depth of Knowledge:**
*   A "Go Deeper" button provides an out-of-band way for users to explore Wikipedia or additional details without breaking the core learning loop.

**6. Choice of Tech Stack:**
*   SvelteKit 5 (Runes) selected for state management performance and clarity.
*   Tailwind CSS chosen for rapid development of polished, responsive UI components.
*   PWA implementation ensures accessibility on mobile devices as "installed" apps.

7. Resources:
* Official list of questions and answers: https://www.uscis.gov/sites/default/files/document/questions-and-answers/2025-Civics-Test-128-Questions-and-Answers.pdf
