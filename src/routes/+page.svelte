<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import {
    CheckCircle,
    Flame,
    Smartphone,
    Zap,
    ArrowRight,
    ShieldCheck,
    BookOpen,
    Trophy,
  } from "@lucide/svelte";

  // Simple animation state for the entrance
  let visible = $state(false);

  import { onMount } from "svelte";
  onMount(() => {
    visible = true;
  });
</script>

<div
  class="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden selection:bg-emerald-100 selection:text-emerald-900"
>
  <!-- Nav -->
  <nav
    class="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md bg-white/70 border-b border-slate-200/50"
  >
    <div class="flex items-center gap-2 group">
      <div
        class="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-emerald-200 shadow-lg"
      >
        C
      </div>
      <span
        class="font-serif font-bold text-slate-800 tracking-tight hidden sm:block"
        >CivicsPrep</span
      >
    </div>
    <a
      href="/dashboard"
      class="px-5 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-md"
    >
      Start Learning
    </a>
  </nav>

  <!-- Hero Section -->
  <section
    class="relative pt-32 pb-20 px-6 flex flex-col items-center text-center overflow-hidden"
  >
    <!-- Ambient Background Elements -->
    <div
      class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full -z-10 pointer-events-none"
    >
      <div
        class="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-emerald-100/40 rounded-full blur-3xl animate-pulse"
      ></div>
      <div
        class="absolute bottom-[10%] right-[-10%] w-1/3 h-1/3 bg-blue-100/40 rounded-full blur-3xl"
      ></div>
    </div>

    {#if visible}
      <div in:fly={{ y: 20, duration: 800 }} class="max-w-4xl mx-auto">
        <div
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest border border-emerald-100 mb-6 animate-in fade-in slide-in-from-bottom-4"
        >
          <ShieldCheck size={14} />
          2025 Official Curriculum
        </div>

        <h1
          class="text-5xl sm:text-7xl font-serif font-bold text-slate-900 leading-[1.1] tracking-tight mb-6"
        >
          From Anxiety to <span class="text-emerald-600 relative"
            >Confidence<span
              class="absolute -bottom-2 left-0 w-full h-2 bg-emerald-200/50 rounded-full -z-10"
            ></span></span
          >
        </h1>

        <p
          class="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Stop guessing and start knowing. Master the US Naturalization Civics
          Test through a scientifically backed learning loop designed to
          eliminate doubt.
        </p>

        <div
          class="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="/dashboard"
            class="group relative px-8 py-4 rounded-2xl bg-emerald-600 text-white font-bold text-lg transition-all hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-200 active:scale-95 flex items-center gap-2"
          >
            Start Your Journey
            <ArrowRight
              size={20}
              class="group-hover:translate-x-1 transition-transform"
            />
          </a>
          <a
            href="#how-it-works"
            class="px-8 py-4 rounded-2xl bg-white text-slate-600 font-semibold text-lg border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
          >
            See How it Works
          </a>
        </div>
      </div>
    {/if}
  </section>

  <!-- How It Works -->
  <section
    id="how-it-works"
    class="py-24 px-6 bg-white border-y border-slate-200"
  >
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-20">
        <h2
          class="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mb-4"
        >
          The Path to Mastery
        </h2>
        <p class="text-slate-500 max-w-xl mx-auto">
          We don't just quiz you, we ensure the information is locked in your
          long-term memory.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
        <!-- Connecting Line (Desktop) -->
        <div
          class="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10"
        ></div>

        <!-- Step 1 -->
        <div class="flex flex-col items-center text-center group">
          <div
            class="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 transition-all group-hover:scale-110 group-hover:bg-blue-100 shadow-sm"
          >
            <BookOpen size={32} />
          </div>
          <h3 class="text-xl font-bold text-slate-800 mb-3">1. Study Mode</h3>
          <p class="text-slate-500 leading-relaxed">
            Focus on thematic modules. Use "Deep Dives" to understand the <i
              class="italic">why</i
            > behind the facts.
          </p>
        </div>

        <!-- Step 2 -->
        <div class="flex flex-col items-center text-center group">
          <div
            class="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 transition-all group-hover:scale-110 group-hover:bg-emerald-100 shadow-sm"
          >
            <CheckCircle size={32} />
          </div>
          <h3 class="text-xl font-bold text-slate-800 mb-3">2. Module Test</h3>
          <p class="text-slate-500 leading-relaxed">
            Prove your knowledge. Pass with 60% to unlock the next stage. Missed
            a few? We'll target them specifically.
          </p>
        </div>

        <!-- Step 3 -->
        <div class="flex flex-col items-center text-center group">
          <div
            class="w-20 h-20 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 transition-all group-hover:scale-110 group-hover:bg-amber-100 shadow-sm"
          >
            <Trophy size={32} />
          </div>
          <h3 class="text-xl font-bold text-slate-800 mb-3">3. Final Boss</h3>
          <p class="text-slate-500 leading-relaxed">
            The ultimate mock exam. Randomized and challenging. When you pass
            this, you're ready for the real thing.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Features -->
  <section class="py-24 px-6 max-w-6xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div class="space-y-8">
        <h2 class="text-4xl font-serif font-bold text-slate-900 leading-tight">
          Designed for the <br />
          <span class="text-emerald-600">Modern Applicant</span>
        </h2>

        <div class="space-y-6">
          <div class="flex gap-4 group">
            <div
              class="flex-shrink-0 w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shadow-sm group-hover:border-emerald-300 transition-colors"
            >
              <Flame size={24} />
            </div>
            <div class="flex flex-col">
              <h4 class="font-bold text-slate-800">3-Streak Mastery</h4>
              <p class="text-slate-500 text-sm">
                No lucky guesses. You only master a question after 3 consecutive
                correct answers.
              </p>
            </div>
          </div>

          <div class="flex gap-4 group">
            <div
              class="flex-shrink-0 w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm group-hover:border-blue-300 transition-colors"
            >
              <Smartphone size={24} />
            </div>
            <div class="flex flex-col">
              <h4 class="font-bold text-slate-800">Install as an App (PWA)</h4>
              <p class="text-slate-500 text-sm">
                Study on the go. Add the app to your home screen for a seamless,
                native-feeling experience.
              </p>
            </div>
          </div>

          <div class="flex gap-4 group">
            <div
              class="flex-shrink-0 w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm group-hover:border-slate-300 transition-colors"
            >
              <Zap size={24} />
            </div>
            <div class="flex flex-col">
              <h4 class="font-bold text-slate-800">Zero Friction</h4>
              <p class="text-slate-500 text-sm">
                No accounts. No passwords. No sign-ups. Your progress is saved
                locally and privately on your device.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Decorative visual: "Confidence Meter" mockup -->
      <div
        class="relative p-8 bg-white rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-200/50 transform rotate-2"
      >
        <div class="flex flex-col gap-6">
          <div class="flex justify-between items-center">
            <span
              class="text-sm font-bold text-slate-400 uppercase tracking-widest"
              >Confidence Level</span
            >
            <span class="text-emerald-600 font-bold">High</span>
          </div>
          <div class="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-emerald-500 w-[85%] rounded-full animate-pulse"
            ></div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span class="block text-xs text-slate-400 mb-1">Modules Pass</span
              >
              <span class="text-xl font-bold text-slate-800">5 / 6</span>
            </div>
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span class="block text-xs text-slate-400 mb-1"
                >Items Mastered</span
              >
              <span class="text-xl font-bold text-slate-800">102 / 128</span>
            </div>
          </div>
          <div
            class="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium flex items-center gap-2"
          >
            <CheckCircle size={16} />
            Ready for the Final Boss Exam!
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer CTA -->
  <section
    class="py-24 px-6 text-center bg-slate-900 text-white rounded-t-[4rem]"
  >
    <div class="max-w-2xl mx-auto">
      <h2 class="text-4xl font-serif font-bold mb-6">Ready to start?</h2>
      <p class="text-slate-400 mb-10 text-lg">
        Join thousands of applicants who have replaced their anxiety with
        confidence.
      </p>
      <a
        href="/dashboard"
        class="px-10 py-4 rounded-2xl bg-emerald-500 text-slate-900 font-bold text-xl hover:bg-emerald-400 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20 inline-flex items-center gap-2"
      >
        Enter Learning Hub
        <ArrowRight size={24} />
      </a>
    </div>
  </section>
</div>

<style>
  :global(body) {
    background-color: #f8fafc;
  }
</style>
