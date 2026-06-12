<script lang="ts">
    import { db } from "$lib/db";
    import { modules, CONFIG } from "$lib/data";
    import { onMount } from "svelte";

    import { Trophy, Lock, CheckCircle, XCircle, Eye, EyeOff, ArrowLeft } from "@lucide/svelte";
    import { goto } from "$app/navigation";

    let allMastered = $state(false);
    let currentIdx = $state(0);
    let score = $state(0);
    let isFinished = $state(false);
    let showAnswer = $state(false);
    const questions = modules
        .flatMap((m) => m.questions)
        .filter((q) => q.type === "standard");
    let testQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, 15);

    async function checkEligibility() {
        const modulePassMarks = CONFIG.MIN_PASS_RATE;
        let allPass = true;

        for (const mod of modules) {
            const mastered = await db.progress
                .where("masteredCount")
                .aboveOrEqual(1)
                .filter((entry) => entry.id.startsWith(mod.id + "_"))
                .toArray();

            const standardQuestions = mod.questions.filter(
                (q) => q.type === "standard",
            ).length;
            if (
                standardQuestions > 0 &&
                mastered.length / standardQuestions < modulePassMarks
            ) {
                allPass = false;
                break;
            }
        }

        allPass = true; // For debugging purposes
        allMastered = allPass;

        if (!allPass) {
            alert(
                "You must master at least 60% of every module before attempting the Final Boss.",
            );
            goto("/dashboard");
            return;
        }
    }

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

<div
    class="min-h-screen bg-slate-900 py-12 px-4 flex flex-col items-center justify-center text-white"
>
    <div class="w-full max-w-2xl mb-6">
        <a
            href="/dashboard"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors font-medium"
        >
            <ArrowLeft size={18} />
            Dashboard
        </a>
    </div>
    {#if !allMastered}
        <div
            class="max-w-md w-full bg-slate-800 border border-slate-700 p-12 rounded-3xl text-center shadow-2xl"
        >
            <div
                class="mx-auto w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mb-6 text-slate-400"
            >
                <Lock size={40} />
            </div>
            <h1 class="text-3xl font-serif font-bold mb-4">The Final Boss</h1>
            <p class="text-slate-400 mb-8">
                This exam is only unlocked once you have mastered at least 60%
                of every module in the learning hub.
            </p>
            <a
                href="/dashboard"
                class="inline-block px-8 py-3 bg-slate-700 text-white rounded-2xl font-bold hover:bg-slate-600 transition-colors"
            >
                Return to Study
            </a>
        </div>
    {:else}
        <div class="w-full max-w-2xl">
            {#if !isFinished}
                <div
                    class="bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-2xl"
                >
                    <div class="flex justify-between items-center mb-6">
                        <div
                            class="flex items-center gap-2 text-amber-400 font-bold uppercase text-xs tracking-widest"
                        >
                            <Trophy size={14} />
                            Final Certification Exam
                        </div>
                        <span class="text-sm text-slate-400"
                            >Question {currentIdx + 1} / {testQuestions.length}</span
                        >
                    </div>

                    <h2
                        class="text-2xl font-serif font-bold text-center mb-12 min-h-[80px]"
                    >
                        {testQuestions[currentIdx]?.text}
                    </h2>

                    {#if !showAnswer}
                    <div class="mb-6">
                        <button
                            onclick={() => showAnswer = true}
                            class="w-full py-3 px-4 rounded-2xl bg-blue-900/50 text-blue-300 hover:bg-blue-900/70 font-medium flex items-center justify-center gap-2 transition-all duration-200 border border-blue-900/50"
                        >
                            <Eye size={18} />
                            <span>Show Answer</span>
                        </button>
                    </div>
                    {:else}
                    <div class="mb-6 p-6 rounded-2xl bg-emerald-900/30 border border-emerald-900/50 animate-in fade-in slide-in-from-top-2 duration-300">
                        <p class="text-sm font-medium text-emerald-300 mb-2">Correct Answer(s)</p>
                        <div class="text-left space-y-2">
                            {#each testQuestions[currentIdx]?.answers as answer}
                                <div class="flex items-center gap-2 text-base leading-relaxed text-emerald-100">
                                    <span class="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2"></span>
                                    <span>{answer}</span>
                                </div>
                            {/each}
                        </div>
                        <button
                            onclick={() => showAnswer = false}
                            class="w-full mt-4 py-2 px-4 rounded-2xl bg-slate-700 text-slate-300 hover:bg-slate-600 font-medium flex items-center justify-center gap-2 transition-all duration-200"
                        >
                            <EyeOff size={18} />
                            <span>Hide Answer</span>
                        </button>
                    </div>
                    {/if}

                    <div class="grid grid-cols-1 gap-3">
                        <div
                            class="p-6 rounded-2xl bg-slate-700/50 border border-slate-600 text-center"
                        >
                            <p class="text-slate-400 mb-4">
                                Self-Grade your response:
                            </p>
                            <div class="flex justify-center gap-4">
                                <button
                                    onclick={() => { handleAnswer(false); showAnswer = false; }}
                                    class="px-6 py-3 rounded-xl bg-slate-800 border border-red-900/50 text-red-400 hover:bg-red-900/20 transition-all font-semibold flex items-center gap-2"
                                >
                                    <XCircle size={18} /> Incorrect
                                </button>
                                <button
                                    onclick={() => { handleAnswer(true); showAnswer = false; }}
                                    class="px-6 py-3 rounded-xl bg-slate-800 border border-emerald-900/50 text-emerald-400 hover:bg-emerald-900/20 transition-all font-semibold flex items-center gap-2"
                                >
                                    <CheckCircle size={18} /> Correct
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            {:else}
                <div
                    class="bg-slate-800 border border-slate-700 p-12 rounded-3xl shadow-2xl text-center"
                >
                    <div
                        class="mx-auto w-20 h-20 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mb-6"
                    >
                        <Trophy size={40} />
                    </div>
                    <h1 class="text-3xl font-serif font-bold mb-2">
                        Exam Complete!
                    </h1>
                    <p class="text-slate-400 mb-8">
                        You scored {score} out of {testQuestions.length}. <br />
                        {score >= CONFIG.REQUIRED_MASTERY_COUNT
                            ? "You have mastered the civics test!"
                            : `Keep practicing to reach ${CONFIG.REQUIRED_MASTERY_COUNT} correct answers.`}
                    </p>
                    <a
                        href="/dashboard"
                        class="px-8 py-3 bg-amber-500 text-slate-900 rounded-2xl font-bold hover:bg-amber-400 transition-colors block w-full sm:w-auto mx-auto"
                    >
                        Back to Dashboard
                    </a>
                </div>
            {/if}
        </div>
    {/if}
</div>
