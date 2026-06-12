<script lang="ts">
    import { page } from "$app/state";
    import { getModuleById } from "$lib/data";
    import { processAnswer } from "$lib/state";
    import QuestionCard from "$lib/components/QuestionCard.svelte";
    import { fade } from "svelte/transition";

    import { onMount } from "svelte";
    import { ArrowLeft, CircleCheck, ClipboardCheck } from "@lucide/svelte";

    // State for the current session
    let queue = $state<string[]>([]);
    let initialCount = $state(0);
    let streak = $state(0);

    // Get the module from the URL param
    const moduleId = page.params.moduleId;
    const module = moduleId ? getModuleById(moduleId) : undefined;

    let currentQuestion = $derived(
        queue[0] && module
            ? module.questions.find((q) => q.id === queue[0])
            : undefined,
    );

    let isComplete = $derived(queue.length === 0);
    let progressPercent = $derived(
        isComplete ? 100 : ((initialCount - queue.length) / initialCount) * 100,
    );

    function shuffle<T>(array: T[]): T[] {
        return [...array].sort(() => Math.random() - 0.5);
    }

    function initQueue() {
        if (module) {
            initialCount = module.questions.length;
            const shuffledIds = shuffle(module.questions.map((q) => q.id));
            queue = shuffledIds;
        }
    }

    onMount(() => {
        initQueue();
    });

    function handleNext() {
        if (queue.length > 1) {
            queue.shift();
            streak = 0; // Reset streak for next question
        } else if (queue.length === 1) {
            queue.shift(); // Clear the last question
        }
    }

    async function handleAnswer(isCorrect: boolean) {
        const currentQuestionId = queue[0];
        if (!currentQuestionId) return;

        const result = await processAnswer(currentQuestionId, isCorrect);
        streak = result.streak ?? streak;

        if (!isCorrect && !result.isMastered) {
            // Add back to end of queue if wrong and not mastered
            const id = queue.shift();
            if (id) queue.push(id);
        }
    }

    function handleGoDeeper(url: string) {
        window.open(url, "_blank", "noopener,noreferrer");
    }
</script>

<div
    class="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center justify-center"
>
    <div class="w-full max-w-2xl mb-6">
        <a
            href="/dashboard"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors font-medium"
        >
            <ArrowLeft size={18} />
            Dashboard
        </a>
    </div>
    {#if !module}
        <div
            class="text-center p-8 bg-white rounded-3xl shadow-sm border border-slate-200"
        >
            <h1 class="text-2xl font-bold text-slate-800">Module Not Found</h1>
            <p class="text-slate-500 mt-2">
                The requested study module could not be located.
            </p>
            <a
                href="/dashboard"
                class="mt-4 inline-block px-6 py-2 bg-slate-800 text-white rounded-xl font-semibold"
                >Go Back</a
            >
        </div>
    {:else}
        <div class="w-full max-w-2xl">
            <!-- Progress Bar -->
            <div class="mb-6 px-4 flex justify-between items-end">
                <div>
                    <h1 class="text-2xl font-serif font-bold text-slate-800">
                        {module.title}
                    </h1>
                    {#if !isComplete}
                        <p class="text-slate-500 text-sm">
                            Question {module.questions.length -
                                queue.length +
                                1} of {initialCount}
                        </p>
                    {:else}
                        <p class="text-emerald-600 text-sm font-medium">
                            Module Complete!
                        </p>
                    {/if}
                </div>
                <div class="text-right">
                    <span
                        class="text-xs font-bold uppercase tracking-wider text-slate-400"
                        >Module Progress</span
                    >
                    <div
                        class="w-32 h-2 bg-slate-200 rounded-full overflow-hidden"
                    >
                        <div
                            class="h-full bg-emerald-500 transition-all duration-500"
                            style="width: {progressPercent}%"
                        ></div>
                    </div>
                </div>
            </div>

            {#if !isComplete}
                <!-- Active Question Card -->
                <div class="relative">
                    {#key queue[0]}
                        <div in:fade={{ duration: 200 }} class="transition-all">
                            {#if currentQuestion}
                                <QuestionCard
                                    question={currentQuestion}
                                    {streak}
                                    onNext={handleNext}
                                    onGoDeeper={handleGoDeeper}
                                    onAnswer={handleAnswer}
                                />
                            {/if}
                        </div>
                    {/key}
                </div>
            {:else}
                <!-- Completion Screen -->
                <div
                    class="bg-white border border-emerald-200 p-12 rounded-3xl shadow-xl text-center animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                    <div
                        class="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6"
                    >
                        <CircleCheck size={32} class="text-emerald-600" />
                    </div>
                    <h2
                        class="text-2xl font-serif font-bold text-slate-800 mb-3"
                    >
                        Module Complete!
                    </h2>
                    <p class="text-slate-500 mb-8">
                        You've finished all questions in this module.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/test/{moduleId}"
                            class="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-colors"
                        >
                            <ClipboardCheck size={20} />
                            Take Module Test
                        </a>
                        <a
                            href="/dashboard"
                            class="inline-flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-colors"
                        >
                            Return to Dashboard
                            <ArrowLeft size={20} />
                        </a>
                    </div>
                </div>
            {/if}
        </div>
    {/if}
</div>
