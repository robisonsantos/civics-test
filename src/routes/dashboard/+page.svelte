<script lang="ts">
  import { modules } from '$lib/data';
  import { db } from '$lib/db';
  import { LayoutGrid, BookOpen, CheckCircle2, ChevronRight } from '@lucide/svelte';
  import { fade, fly } from 'svelte/transition';

  // Local state to track mastery counts for each module
  let masteryData = $state<Record<string, number>>({});

  async function syncProgress() {
    // Fetch total mastered items from DB for each module
    for (const mod of modules) {
      const mastered = await db.progress
        .where('masteredCount').equals(1)
        .filter(entry => entry.id.startsWith(mod.id + '_'))
        .toArray();
      masteryData[mod.id] = mastered.length;
    }
  }

  // Sync on mount
  import { onMount } from 'svelte';
  onMount(() => {
    syncProgress();
  });
</script>

<div class="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center">
  <div class="w-full max-w-4xl">
    <!-- Header -->
    <header class="mb-12 text-center sm:text-left">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4">
        <LayoutGrid size={14} />
        Learning Hub
      </div>
      <h1 class="text-4xl sm:text-5xl font-serif font-bold text-slate-800 tracking-tight">
        Civics Test Prep
      </h1>
      <p class="text-slate-500 mt-3 text-lg max-w-xl mx-auto sm:mx-0">
        Master the 2025 US Naturalization Civics Test through themed modules and streak-based learning.
      </p>
    </header>

    <!-- Module Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {#each modules as mod}
        <a 
          href="/study/{mod.id}" 
          class="group relative bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between h-48 overflow-hidden"
        >
          <!-- Background Accent -->
          <div class="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full blur-2xl group-hover:bg-emerald-100 transition-colors"></div>
          
          <div class="relative z-10">
            <div class="flex justify-between items-start mb-4">
              <div class="p-3 rounded-2xl bg-slate-50 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                <BookOpen size={24} />
              </div>
              <div class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold">
                <CheckCircle2 size={12} />
                <span>{masteryData[mod.id] || 0} / {mod.questions.length} Mastered</span>
              </div>
            </div>
            
            <h3 class="text-xl font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
              {mod.title}
            </h3>
          </div>

          <div class="relative z-10 flex justify-between items-center mt-4">
            <span class="text-sm font-medium text-slate-400 group-hover:text-slate-600 transition-colors">
              Start Learning
            </span>
            <div class="p-2 rounded-full bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
              <ChevronRight size={20} />
            </div>
          </div>
        </a>
      {/each}
    </div>
  </div>
</div>
