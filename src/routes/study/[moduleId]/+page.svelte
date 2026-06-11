<script lang="ts">
  import { page } from '$app/state';
  import { getModuleById } from '$lib/data';
  import { processAnswer } from '$lib/state';
  import QuestionCard from '$lib/components/QuestionCard.svelte';
  import { fade, slide } from 'svelte/transition';
  import { ExternalLink } from '@lucide/svelte';

  // State for the current session
  let currentIdx = $state(0);
  let streak = $state(0);
  let showModal = $state(false);
  let modalUrl = $state('');

  // Get the module from the URL param
  const moduleId = page.params.moduleId;
  const module = moduleId ? getModuleById(moduleId) : undefined;

  function handleNext() {
    if (module && currentIdx < module.questions.length - 1) {
      currentIdx++;
    } else {
      alert('You have completed this module!');
    }
  }

  async function handleAnswer(questionId: string, isCorrect: boolean) {
    const result = await processAnswer(questionId, isCorrect);
    streak = result.streak ?? streak;
  }

  function handleGoDeeper(url: string) {
    modalUrl = url;
    showModal = true;
  }
</script>

<div class="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center justify-center">
  {#if !module}
    <div class="text-center p-8 bg-white rounded-3xl shadow-sm border border-slate-200">
      <h1 class="text-2xl font-bold text-slate-800">Module Not Found</h1>
      <p class="text-slate-500 mt-2">The requested study module could not be located.</p>
      <a href="/dashboard" class="mt-4 inline-block px-6 py-2 bg-slate-800 text-white rounded-xl font-semibold">Go Back</a>
    </div>
  {:else}
    <div class="w-full max-w-2xl">
      <!-- Progress Bar -->
      <div class="mb-6 px-4 flex justify-between items-end">
        <div>
          <h1 class="text-2xl font-serif font-bold text-slate-800">{module.title}</h1>
          <p class="text-slate-500 text-sm">Question {currentIdx + 1} of {module.questions.length}</p>
        </div>
        <div class="text-right">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Module Progress</span>
          <div class="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-emerald-500 transition-all duration-500"
              style="width: {((currentIdx + 1) / module.questions.length) * 100}%"
            ></div>
          </div>
        </div>
      </div>

      <!-- Active Question Card -->
      <div class="relative">
        {#key currentIdx}
          <div in:fade={{duration: 200}} class="transition-all">
            <QuestionCard
              question={module.questions[currentIdx]}
              streak={streak}
              onNext={handleNext}
              onGoDeeper={handleGoDeeper}
            />
          </div>
        {/key}
      </div>
    </div>
  {/if}
</div>

{#if showModal}
  <div
    class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    onclick={() => showModal = false}
    onkeydown={(e) => e.key === 'Escape' && (showModal = false)}
  >
    <div
      class="bg-white w-full max-w-2xl h-[80vh] sm:h-auto sm:max-h-[80vh] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300"
      onclick={(e) => e.stopPropagation()}
    >
      <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 class="font-bold text-slate-800 flex items-center gap-2">
          <ExternalLink size={16} />
          Deep Dive
        </h3>
        <button onclick={() => showModal = false} class="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <span class="text-2xl leading-none">&times;</span>
        </button>
      </div>
      <div class="flex-1 overflow-auto p-6">
        {#if modalUrl}
          <iframe src={modalUrl} class="w-full h-full border-none rounded-xl" title="Deep Dive"></iframe>
        {:else}
          <div class="flex flex-col items-center justify-center h-full text-center p-8">
            <p class="text-slate-500">No additional resources available for this question.</p>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
