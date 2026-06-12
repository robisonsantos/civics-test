<script lang="ts">
  import { Flame, ArrowRight, ExternalLink, Eye, EyeOff } from '@lucide/svelte';
  import type { Question } from '../types';
  import { processAnswer } from '../state';

  interface Props {
    question: Question;
    streak: number;
    onNext: () => void;
    onGoDeeper: (url: string) => void;
    onAnswer: (isCorrect: boolean) => void;
  }

  let { question, streak, onNext, onGoDeeper, onAnswer }: Props = $props();

  let showAnswer = $state(false);
  let userEntry = $state('');
  let isVerified = $state(false);

  function toggleAnswer() {
    showAnswer = !showAnswer;
  }

</script>

<div class="relative max-w-lg mx-auto w-full p-4 sm:p-6">
  <!-- Streak Indicator -->
  {#if streak > 0}
    <div class="absolute -top-2 -right-2 sm:right-0 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm border border-emerald-200 animate-bounce-subtle">
      <Flame size={14} class="text-orange-500" />
      <span>{streak} correct in a row</span>
    </div>
  {/if}

  <!-- Main Card -->
  <div class="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden transition-all duration-300 ease-out hover:shadow-2xl hover:shadow-slate-300/50">

    <!-- Header/Accent Bar -->
    <div class="h-2 w-full bg-gradient-to-r from-emerald-400 via-teal-500 to-blue-500"></div>

    <div class="p-6 sm:p-8">
      <!-- Question Section -->
      <div class="mb-8 min-h-[120px] flex items-center justify-center text-center">
        <h2 class="text-xl sm:text-2xl font-serif text-slate-800 leading-relaxed tracking-tight">
          {question.text}
        </h2>
      </div>

      <!-- Answer Reveal Area -->
      <div class="mb-8">
        <button
          onclick={toggleAnswer}
          class="w-full py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200
          {showAnswer ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium'}"
        >
          {#if showAnswer}
            <EyeOff size={18} />
            <span>Hide Answer</span>
          {:else}
            <Eye size={18} />
            <span>Check Answer</span>
          {/if}
        </button>

        {#if showAnswer}
          <div class="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-900 animate-in fade-in slide-in-from-top-2 duration-300">
            <p class="text-lg font-medium text-center leading-relaxed">
              {question.answers && question.answers.length > 0 ? question.answers.join(', ') : 'No answer provided (Personal Info)'}
            </p>
          </div>
        {/if}
      </div>

      <!-- Action Buttons -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <!-- Go Deeper (only for standard) -->
        {#if showAnswer && question.type === 'standard'}
          <button
            onclick={() => onGoDeeper(question.wikiLink || '')}
            class="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium"
          >
            <ExternalLink size={16} />
            Go Deeper
          </button>
        {:else}
          <div class="hidden sm:block"></div>
        {/if}

        {#if showAnswer}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          <button
            onclick={() => onAnswer(true)}
            class="flex items-center justify-center py-3 px-4 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20 font-semibold"
          >
            I got it right
          </button>
          <button
            onclick={() => onAnswer(false)}
            class="flex items-center justify-center py-3 px-4 rounded-2xl bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg shadow-red-900/20 font-semibold"
          >
            I got it wrong
          </button>
        </div>
        {/if}

        <!-- Next Button -->
        <button
          onclick={onNext}
          class="group flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-slate-800 text-white hover:bg-slate-900 transition-all duration-200 shadow-lg shadow-slate-300 font-semibold"
        >
          Next Question
          <ArrowRight size={18} class="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  :global(.animate-bounce-subtle) {
    animation: bounce-subtle 3s infinite ease-in-out;
  }

  @keyframes bounce-subtle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
</style>
