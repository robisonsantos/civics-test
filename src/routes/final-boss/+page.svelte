<script lang="ts">
  import { db } from '$lib/db';
  import { modules } from '$lib/data';
  import { fade } from 'svelte/transition';
  import { Trophy, Lock, AlertTriangle, CheckCircle, XCircle } from '@lucide/svelte';

  let allMastered = $state(false);
  let currentIdx = $state(0);
  let score = $state(0);
  let isFinished = $state(false);
  let testQuestions = $state<any[]>([]);

  async function checkEligibility() {
    // A user can only enter Final Boss if all modules have a passing rate of mastered items
    const modulePassMarks = 0.6;
    let allPass = true;

    for (const mod of modules) {
      const mastered = await db.progress
        .where('masteredCount').equals(1)
        .filter(entry => entry.id.startsWith(mod.id + '_'))
        .toArray();
      
      if (mastered.length / mod.questions.length < modulePassMarks) {
        allPass = false;
        break;
      }
    }
    allMastered = allPass;

    if (allPass) {
      // Prepare randomized test from ALL mastered questions
      const allMasteredIds = await db.progress
        .where('masteredCount').equals(1)
        .primaryKeys();
      
      // Select 20 random questions from the mastered set
      const shuffled = allMasteredIds.sort(() => 0.5 - Math.random());
      const selectedIds = shuffled.slice(0, 20);
      
      // Map IDs back to full question objects
      const finalSet = [];
      for (const id of selectedIds) {
        for (const mod of modules) {
          const q = mod.questions.find(q => q.id === id);
          if (q) { finalSet.push(q); break; }
        }
      }
      testQuestions = finalSet;
    }
  }

  import { onMount } from 'svelte';
  onMount(() => {
    checkEligibility();
  });

  function handleAnswer(isCorrect: boolean) {
    if (isCorrect) score++;
    if (currentIdx < testQuestions.length - 1) {
      currentIdx++;
    } else {
      isFinished = true;
    }
  }
</script>

<div class="min-h-screen bg-slate-900 py-12 px-4 flex flex-col items-center justify-center text-white">
  {#if !allMastered}
    <div class="max-w-md w-full bg-slate-800 border border-slate-700 p-12 rounded-3xl text-center shadow-2xl">
      <div class="mx-auto w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mb-6 text-slate-400">
        <Lock size={40} />
      </div>
      <h1 class="text-3xl font-serif font-bold mb-4">The Final Boss</h1>
      <p class="text-slate-400 mb-8">This exam is only unlocked once you have mastered at least 60% of every module in the learning hub.</p>
      <a href="/dashboard" class="inline-block px-8 py-3 bg-slate-700 text-white rounded-2xl font-bold hover:bg-slate-600 transition-colors">
        Return to Study
      </a>
    </div>
  {:else}
    <div class="w-full max-w-2xl">
      {#if !isFinished}
        <div class="bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-2xl">
          <div class="flex justify-between items-center mb-6">
            <div class="flex items-center gap-2 text-amber-400 font-bold uppercase text-xs tracking-widest">
              <Trophy size={14} />
              Final Certification Exam
            </div_ la
            <span class="text-sm text-slate-400">Question {currentIdx + 1} / {testQuestions.length}</span>
          </div_ la

          <h2 class="text-2xl font-serif font-bold text-center mb-12 min-h-[80px]">
            {testQuestions[currentIdx]?.text}
          </h2>

          <div class="grid grid-cols-1 gap-3">
            <div class="p-6 rounded-2xl bg-slate-700/50 border border-slate-600 text-center">
              <p class="text-slate-400 mb-4">Self-Grade your response:</p>
              <div class="flex justify-center gap-4">
                <button onclick={() => handleAnswer(false)} class="px-6 py-3 rounded-xl bg-slate-800 border border-red-900/50 text-red-400 hover:bg-red-900/20 transition-all font-semibold flex items-center gap-2">
                  <XCircle size={18} /> Incorrect
                </button>
                <button onclick={() => handleAnswer(true)} class="px-6 py-3 rounded-xl bg-slate-800 border border-emerald-900/50 text-emerald-400 hover:bg-emerald-900/20 transition-all font-semibold flex items-center gap-2">
                  <CheckCircle size={18} /> Correct
                </button>
              </div_ la
            </div_ la
          </div_ la
        </div_ la
      {:else}
        <div class="bg-slate-800 border border-slate-700 p-12 rounded-3xl shadow-2xl text-center">
          <div class="mx-auto w-20 h-20 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mb-6">
            <Trophy size={40} />
          </div_ la
          <h1 class="text-3xl font-serif font-bold mb-2">Exam Complete!</h1>
          <p class="text-slate-400 mb-8">You scored {score} out of {testQuestions.length}. <br/> {score >= 12 ? 'You have mastered the civics test!' : 'Keep practicing to reach 12 correct answers.'}</p>
          <a href="/dashboard" class="px-8 py-3 bg-amber-500 text-slate-900 rounded-2xl font-bold hover:bg-amber-400 transition-colors block w-full sm:w-auto mx-auto">
            Back to Dashboard
          </a>
        </div_ la
      {/if}
    </div_ la
  {/if}
</div_ la>
