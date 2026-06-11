<script lang="ts">
  import { page } from '$app/state';
  import { getModuleById } from '$lib/data';
  import { fade } from 'svelte/transition';
  import { CheckCircle, XCircle, AlertCircle, ArrowLeft, Trophy } from '@lucide/svelte';

  const moduleId = page.params.moduleId;
  const module = getModuleById(moduleId);

  let currentIdx = $state(0);
  let score = $state(0);
  let isFinished = $state(false);
  let missedQuestions = $state<string[]>([]);

  function handleAnswer(isCorrect: boolean) {
    if (isCorrect) {
      score++;
    } else {
      missedQuestions.push(module!.questions[currentIdx].id);
    }

    if (currentIdx < module!.questions.length - 1) {
      currentIdx++;
    } else {
      isFinished = true;
    }
  }

  const passRate = 0.6; // 60% requirement
  const passed = score / module!.questions.length >= passRate;
</script>

<div class="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center justify-center">
  {#if !module}
    <div class="text-center p-8 bg-white rounded-3xl shadow-sm border border-slate-200">
      <h1 class="text-2xl font-bold text-slate-800">Module Not Found</h1>
      <a href="/dashboard" class="mt-4 inline-block px-6 py-2 bg-slate-800 text-white rounded-xl font-semibold">Go Back</a>
    </div>
  {:else}
    <div class="w-full max-w-2xl">
      {#if !isFinished}
        <!-- Test Interface -->
        <div class="bg-white border border-slate-200 p-8 rounded-3xl shadow-xl shadow-slate-200/50">
          <div class="flex justify-between items-center mb-6">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Module Exam: {module.title}</span>
            <span class="text-sm font-medium text-slate-600">Question {currentIdx + 1} / {module.questions.length}</span>
          </div>

          <h2 class="text-2xl font-serif font-bold text-slate-800 text-center mb-12 min-h-[80px]">
            {module.questions[currentIdx].text}
          </h2>

          <div class="grid grid-cols-1 gap-3">
            <!-- In a real app, we would generate options here. 
                 For now, we use a "Self-Grade" interface since the source JSON 
                 doesn't provide distractors (multiple choice options). -->
            <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <p class="text-slate-500 mb-4">Think of your answer, then grade yourself:</p>
              <div class="flex justify-center gap-4">
                <button 
                  onclick={() => handleAnswer(false)} 
                  class="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-all font-semibold"
                >
                  <XCircle size={18} />
                  Incorrect
                </button>
                <button 
                  onclick={() => handleAnswer(true)} 
                  class="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-all font-semibold"
                >
                  <CheckCircle size={18} />
                  Correct
                </button>
              </div>
            </div>
          </div>
        </div>
      {:else}
        <!-- Results Screen -->
        <div class="bg-white border border-slate-200 p-12 rounded-3xl shadow-xl text-center">
          {#if passed}
            <div class="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-600">
              <Trophy size={40} />
            </div>
            <h1 class="text-3xl font-serif font-bold text-slate-800 mb-2">Module Passed!</h1>
            <p class="text-slate-500 mb-8">You scored {score} out of {module.questions.length} correctly.</p>
            <a href="/dashboard" class="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-colors block w-full sm:w-auto mx-auto">
              Return to Dashboard
            </a>
          {:else}
            <div class="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 text-red-600">
              <AlertCircle size={40} />
            </div>
            <h1 class="text-3xl font-serif font-bold text-slate-800 mb-2">Need More Practice</h1>
            <p class="text-slate-500 mb-8">You scored {score} out of {module.questions.length}. You need 60% to pass this module.</p>
            
            {#if missedQuestions.length > 0}
              <div class="mb-8 text-left p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <h3 class="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Review these items:</h3>
                <ul class="space-y-2">
                  {#each missedQuestions as qId}
                    <li class="text-sm text-slate-600 flex items-center gap-2">
                      <div class="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                      {getModuleById(qId.split('_')[0])?.questions.find(q => q.id === qId)?.text}
                    </li>
                  {/each}
                </ul>
              </div>
            {/if}

            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <button onclick={() => { currentIdx = 0; score = 0; isFinished = false; missedQuestions = []; }} 
                class="px-8 py-3 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-colors">
                Retry Test
              </button>
              <a href="/study/{moduleId}" class="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-colors">
                Study Again
              </a>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</div>
