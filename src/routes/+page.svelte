<script lang="ts">
    // --- 0. INTERFACES (Fixes most errors) ---
    interface CardDetails {
        keyword: string;
        tone: string;
        action: string;
    }

    interface Card {
        id: string;
        name: string;
        emoji: string;
        element: string;
        focus: string;
        energy: string;
        pos: CardDetails;
        neg: CardDetails;
    }

    interface ReadingResult {
        c1: Card;
        c2: Card;
        score: number;
        int1: string;
        int2: string;
        sum: string;
        adv: string;
    }

    // --- 1. DATA TIER ---
    const CARD_DATA: Record<string, Card> = {
        'C46': { id: 'C46', name: 'The Heart', emoji: '❤️', element: 'Water', focus: 'Emotion', energy: 'Passive', pos: { keyword: 'Openness', tone: 'Affectionate', action: 'Expressing desires clearly.' }, neg: { keyword: 'Vulnerability', tone: 'Clingy', action: 'Over-relying on the partner.' } },
        'C49': { id: 'C49', name: 'The Mask', emoji: '🎭', element: 'Air', focus: 'Intellect', energy: 'Passive', pos: { keyword: 'Protection', tone: 'Cautious', action: 'Taking time before committing.' }, neg: { keyword: 'Concealment', tone: 'Guarded', action: 'Hiding true feelings.' } },
        'C03': { id: 'C03', name: 'The Knot', emoji: '🔗', element: 'Earth', focus: 'Stability', energy: 'Passive', pos: { keyword: 'Commitment', tone: 'Dedicated', action: 'Planning the future together.' }, neg: { keyword: 'Entanglement', tone: 'Stuck', action: 'Refusing to let go of the past.' } },
        'C10': { id: 'C10', name: 'The Key', emoji: '🔑', element: 'Fire', focus: 'Action', energy: 'Active', pos: { keyword: 'Breakthrough', tone: 'Solution-oriented', action: 'Finding a new connection.' }, neg: { keyword: 'Confusion', tone: 'Lost', action: 'Seeking answers externally.' } },
        'C15': { id: 'C15', name: 'The Road', emoji: '🛣️', element: 'Air', focus: 'Action', energy: 'Active', pos: { keyword: 'Progress', tone: 'Moving forward', action: 'Taking the next step.' }, neg: { keyword: 'Drift', tone: 'Aimless', action: 'Allowing stagnation.' } },
        'C21': { id: 'C21', name: 'The Mirror', emoji: '🪞', element: 'Water', focus: 'Emotion', energy: 'Passive', pos: { keyword: 'Reflection', tone: 'Understanding', action: 'Seeing self through them.' }, neg: { keyword: 'Projection', tone: 'Self-centered', action: 'Seeing only faults.' } },
        'C25': { id: 'C25', name: 'The Wall', emoji: '🧱', element: 'Earth', focus: 'Stability', energy: 'Active', pos: { keyword: 'Boundary', tone: 'Reserved', action: 'Establishing space.' }, neg: { keyword: 'Closure', tone: 'Resistant', action: 'Shutting them out.' } },
        'C28': { id: 'C28', name: 'The Sun', emoji: '☀️', element: 'Fire', focus: 'Emotion', energy: 'Active', pos: { keyword: 'Joy', tone: 'Radiant', action: 'Sharing happiness.' }, neg: { keyword: 'Burnout', tone: 'Tired', action: 'Trying too hard.' } },
        'C30': { id: 'C30', name: 'The Moon', emoji: '🌙', element: 'Water', focus: 'Intellect', energy: 'Passive', pos: { keyword: 'Intuition', tone: 'Dreamy', action: 'Listening to cues.' }, neg: { keyword: 'Illusion', tone: 'Vague', action: 'Misinterpreting signals.' } },
        'C33': { id: 'C33', name: 'Two Rings', emoji: '💍', element: 'Earth', focus: 'Stability', energy: 'Passive', pos: { keyword: 'Union', tone: 'Complete', action: 'Total mutual respect.' }, neg: { keyword: 'Possession', tone: 'Controlling', action: 'Treating partner as property.' } }
    };

    const COMPATIBILITY_MATRIX: Record<string, number> = {
        'C46_C46': 2, 'C28_C33': 2, 'C46_C03': 1, 'C10_C15': 1, 'C15_C28': 0, 'C49_C49': 0, 'C03_C25': -1, 'C49_C10': -1, 'C46_C49': -2, 'C30_C25': -2
    };

    const INTERACTION_RULES: Record<string, any> = {
        element: { 'Fire': { 'Fire': 0.7, 'Air': 0.5, 'Earth': 0, 'Water': -0.8 }, 'Water': { 'Water': 0.7, 'Earth': 0.5, 'Air': 0, 'Fire': -0.8 }, 'Earth': { 'Earth': 0.7, 'Water': 0.5, 'Fire': 0, 'Air': -0.8 }, 'Air': { 'Air': 0.7, 'Fire': 0.5, 'Water': 0, 'Earth': -0.8 } },
        focus: { 'Emotion': { 'Emotion': 0.4, 'Action': 0.2, 'Stability': 0, 'Intellect': -0.4 }, 'Action': { 'Action': 0.4, 'Emotion': 0.2, 'Intellect': 0, 'Stability': -0.4 }, 'Stability': { 'Stability': 0.4, 'Intellect': 0.2, 'Action': 0, 'Emotion': -0.4 }, 'Intellect': { 'Intellect': 0.4, 'Stability': 0.2, 'Emotion': 0, 'Action': -0.4 } },
        energy: { 'Active': { 'Active': 0.2, 'Passive': 0.3 }, 'Passive': { 'Passive': 0.2, 'Active': 0.3 } }
    };

    const TEMPLATES = {
        card1_you: (c1: Card, c2: Card, score: number) => (score >= 0 ? `**${c1.name}** reveals your core nature is one of **${c1.pos.keyword}**. You are proactively focused on ${c1.pos.action.toLowerCase()}` : `**${c1.name}** indicates your state is tempered by **${c1.neg.keyword}**. You may tend to ${c1.neg.action.toLowerCase()}`),
        card2_partner: (c1: Card, c2: Card, score: number) => (score >= 0 ? `They approach this with **${c2.name}**, highlighting **${c2.pos.keyword}**. Their energy mirrors yours.` : `**${c2.name}** suggests they feel a pressure of **${c2.neg.keyword}**, perhaps ${c2.neg.action.toLowerCase()}`),
        summary: {
            2: ["A fateful union. Your [C1_ELEMENT] and their [C2_ELEMENT] energies are in sublime cooperation. Your focus on [C1_POS] supports their need for [C2_POS].", "Rare alignment. [C1_NAME] meshes perfectly with [C2_NAME]. The relationship flows with natural [C1_POS] and [C2_POS]."],
            1: ["A solid foundation. Your [C1_FOCUS] meets their [C2_FOCUS] constructively. Shared intent on [C1_POS] overcomes minor friction.", "Growing strength. The link between [C1_ELEMENT] and [C2_ELEMENT] is encouraging, provided you maintain [C1_POS]."],
            0: ["A crossroads. Neither helping nor hurting, the potential for [C1_POS] exists if you avoid the shadows of [C1_NEG].", "A blank canvas. Your shared path is determined by how well your [C1_FOCUS] needs accommodate their [C2_FOCUS] needs."],
            "-1": ["Frictional dynamics. There is tension between [C1_ELEMENT] and [C2_ELEMENT]. Your desire for [C1_POS] meets a wall of [C2_NEG].", "A challenge to express needs. One leans into [C1_NEG] while the other retreats into [C2_NEG]. Addressed, this leads to growth."],
            "-2": ["Oppositional force. A clash between [C1_FOCUS] and [C2_FOCUS]. [C1_NEG] and [C2_NEG] are prevalent.", "Unstable ground. The elemental opposition of [C1_ELEMENT] and [C2_ELEMENT] requires a total overhaul."]
        },
        advice: {
            2: ["Focus on shared expansion. Nurture what is already strong.", "Deepen vulnerability. Risk greater emotional transparency."],
            1: ["Bridge the energy gap. Use your [C1_ENERGY] nature to initiate connection.", "Define the next step. Create a concrete action plan."],
            0: ["Make an intentional commitment. Eliminate tendencies toward [C1_NEG].", "Establish clear roles. Define your respective contributions."],
            "-1": ["Practice the art of listening. Pause your drive and truly hear them.", "Address the shadow. Resolve the root cause of [C1_NEG]."],
            "-2": ["Seek external perspective. The dynamic is too intense for self-resolution.", "Time for withdrawal. Step back to mitigate [C1_NEG]."]
        }
    };

    // --- 2. STATE ---
    let selectedCards = $state<string[]>([]);
    let readingResult = $state<ReadingResult | null>(null);
    let isTransitioning = $state(false);

    // --- 3. LOGIC ---
    function calculateProgrammaticScore(c1: Card, c2: Card): number {
        let s = INTERACTION_RULES.element[c1.element][c2.element] + 
                INTERACTION_RULES.focus[c1.focus][c2.focus] + 
                INTERACTION_RULES.energy[c1.energy][c2.energy];
        return Math.round(Math.max(-2, Math.min(2, s * 1.5)));
    }

    function generateReading(id1: string, id2: string): ReadingResult {
        const c1 = CARD_DATA[id1], c2 = CARD_DATA[id2];
        const k = id1 < id2 ? `${id1}_${id2}` : `${id2}_${id1}`;
        const score = COMPATIBILITY_MATRIX[k] !== undefined ? COMPATIBILITY_MATRIX[k] : calculateProgrammaticScore(c1, c2);
        
        const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
        // Cast score to index the summary object safely
        const scoreKey = score.toString() as keyof typeof TEMPLATES.summary;
        let sum = getRandom(TEMPLATES.summary[scoreKey]); 
        let adv = getRandom(TEMPLATES.advice[scoreKey]);

        const reps: Record<string, string> = { 
            '[C1_ELEMENT]': c1.element, '[C1_FOCUS]': c1.focus, '[C1_ENERGY]': c1.energy, 
            '[C1_NAME]': c1.name, '[C1_POS]': c1.pos.keyword, '[C1_NEG]': c1.neg.keyword, 
            '[C2_ELEMENT]': c2.element, '[C2_FOCUS]': c2.focus, '[C2_ENERGY]': c2.energy, 
            '[C2_NAME]': c2.name, '[C2_POS]': c2.pos.keyword, '[C2_NEG]': c2.neg.keyword 
        };
        
        Object.keys(reps).forEach(key => { 
            sum = sum.replaceAll(key, reps[key]); 
            adv = adv.replaceAll(key, reps[key]); 
        });

        return { 
            c1, c2, score, 
            int1: TEMPLATES.card1_you(c1, c2, score).replace(/\*\*(.*?)\*\*/g, '<strong class="text-pink-300">$1</strong>'), 
            int2: TEMPLATES.card2_partner(c1, c2, score).replace(/\*\*(.*?)\*\*/g, '<strong class="text-pink-300">$1</strong>'), 
            sum, adv 
        };
    }

    function selectCard(id: string) {
        if (selectedCards.includes(id) || selectedCards.length >= 2 || isTransitioning) return;
        
        selectedCards.push(id);

        if (selectedCards.length === 2) {
            isTransitioning = true;
            setTimeout(() => {
                readingResult = generateReading(selectedCards[0], selectedCards[1]);
                isTransitioning = false;
            }, 1500);
        }
    }

    function resetApp() {
        selectedCards = [];
        readingResult = null;
    }

    function getImageUrl(name: string) {
        return `https://placehold.co/300x450/fff0f5/4c1d95?text=${name.replace(' ', '+')}&font=playfair-display`;
    }
</script>

<svelte:head>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen p-4 md:p-8 flex items-center justify-center bg-stellar">
    <div class="glass-panel w-full max-w-5xl rounded-3xl p-6 md:p-10 relative">
        
        <header class="text-center mb-10">
            <div class="inline-block p-2 rounded-full border border-purple-500/30 mb-3 bg-purple-900/20">
                <span class="text-2xl">✨</span>
            </div>
            <h1 class="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-200 via-pink-200 to-indigo-200 mb-2 tracking-wider">
                相性占い
            </h1>
            <p class="text-indigo-200 text-sm md:text-base font-light tracking-widest uppercase">
                Aishō Uranai: Compatibility Reading
            </p>
        </header>

        {#if !readingResult}
            <section class="fade-in">
                <div class="flex flex-col items-center mb-8">
                    <div class="text-center">
                        <h2 class="text-2xl font-serif text-white mb-2">Consult the Cards</h2>
                        <p class="text-lg text-pink-300 font-medium {isTransitioning ? '' : 'animate-pulse'}">
                            {#if isTransitioning}
                                <span class="text-indigo-200">Aligning Constellations...</span>
                            {:else if selectedCards.length === 0}
                                Select <span class="font-bold border-b border-pink-400">Your Card</span> (1/2)
                            {:else}
                                Select <span class="font-bold border-b border-pink-400">Partner's Card</span> (2/2)
                            {/if}
                        </p>
                    </div>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 max-w-4xl mx-auto">
                    {#each Object.entries(CARD_DATA) as [id, card]}
                        <button 
                            class="card-container text-left w-full" 
                            class:selected={selectedCards.includes(id)}
                            onclick={() => selectCard(id)}
                            disabled={isTransitioning}
                        >
                            <div class="card-inner">
                                <div class="card-front">
                                    <span class="text-indigo-300 font-serif tracking-widest text-xl opacity-70">FATE</span>
                                </div>
                                <div class="card-back flex-col p-2">
                                    <div class="w-full h-32 md:h-40 overflow-hidden rounded mb-2 relative">
                                        <img src={getImageUrl(card.name)} class="object-cover w-full h-full" alt={card.name}>
                                        <div class="absolute inset-0 bg-indigo-900/10"></div>
                                    </div>
                                    <div class="text-2xl mb-1">{card.emoji}</div>
                                    <div class="font-bold text-sm md:text-base text-indigo-900 font-serif">{card.name}</div>
                                </div>
                            </div>
                        </button>
                    {/each}
                </div>
            </section>
        {:else}
            <section class="fade-in">
                <div class="flex flex-col items-center mb-8">
                    <h2 class="text-3xl font-serif text-white mb-2">The Diagnosis</h2>
                    <div class="flex space-x-1 text-2xl md:text-3xl drop-shadow-lg">
                        {#each Array(10) as _, i}
                            <span class={(i < (readingResult.score + 3) * 2) ? "text-pink-500 text-shadow" : "opacity-20 grayscale"}>❤️</span>
                        {/each}
                    </div>
                    <p class="text-xs text-indigo-300 mt-2 uppercase tracking-widest">Compatibility Resonance</p>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div class="lg:col-span-5 flex flex-col space-y-6">
                        <div class="bg-indigo-900/40 rounded-xl p-4 border border-indigo-500/30">
                            <h3 class="text-xl text-center text-pink-200 mb-3">Your Energy</h3>
                            <div class="flex items-start space-x-4">
                                <div class="w-1/3 card-container result-state">
                                    <div class="card-inner">
                                        <div class="card-back flex-col p-1 border-2 border-pink-200">
                                            <img src={getImageUrl(readingResult.c1.name)} class="w-full h-20 object-cover rounded mb-1" alt="">
                                            <div class="text-lg">{readingResult.c1.emoji}</div>
                                            <div class="text-xs font-bold text-indigo-900 font-serif">{readingResult.c1.name}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="w-2/3">
                                    <p class="text-sm text-gray-300 leading-relaxed">{@html readingResult.int1}</p>
                                </div>
                            </div>
                        </div>

                        <div class="bg-indigo-900/40 rounded-xl p-4 border border-indigo-500/30">
                            <h3 class="text-xl text-center text-pink-200 mb-3">Their Energy</h3>
                            <div class="flex items-start space-x-4">
                                <div class="w-1/3 card-container result-state">
                                    <div class="card-inner">
                                        <div class="card-back flex-col p-1 border-2 border-pink-200">
                                            <img src={getImageUrl(readingResult.c2.name)} class="w-full h-20 object-cover rounded mb-1" alt="">
                                            <div class="text-lg">{readingResult.c2.emoji}</div>
                                            <div class="text-xs font-bold text-indigo-900 font-serif">{readingResult.c2.name}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="w-2/3">
                                    <p class="text-sm text-gray-300 leading-relaxed">{@html readingResult.int2}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="lg:col-span-7">
                        <div class="glass-panel rounded-xl p-6 h-full border-t-4 border-t-purple-500 flex flex-col">
                            <div class="custom-scroll overflow-y-auto pr-2 max-h-[60vh]">
                                <div class="mb-6">
                                    <h3 class="text-2xl font-serif text-purple-200 mb-3 border-b border-white/10 pb-2">Destiny Analysis</h3>
                                    <div class="prose prose-invert prose-sm text-gray-300">
                                        {@html readingResult.sum.replace(/\n/g, '<br>')}
                                    </div>
                                </div>

                                <div class="bg-white/5 rounded-lg p-5 border border-white/10">
                                    <h3 class="text-xl font-serif text-amber-200 mb-2 flex items-center">
                                        <span class="mr-2">⚡</span> Actionable Guidance
                                    </h3>
                                    <p class="text-gray-200 italic">"{readingResult.adv}"</p>
                                </div>
                            </div>
                            
                            <div class="mt-auto pt-6">
                                <button onclick={resetApp} class="w-full py-4 bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-lg shadow-lg transform transition hover:-translate-y-1">
                                    Consult the Stars Again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        {/if}
    </div>
</div>

<style>
    :global(body) {
        font-family: 'Inter', sans-serif;
        background: radial-gradient(circle at top, #1e1b4b, #0f172a, #000000);
        color: #e2e8f0;
        min-height: 100vh;
        margin: 0;
    }

    .bg-stellar {
        background: transparent;
    }

    h1, h2, h3 {
        font-family: 'Cinzel', serif;
    }

    .glass-panel {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
    }

    .card-container {
        perspective: 1000px;
        cursor: pointer;
        aspect-ratio: 2/3;
        background: none;
        border: none;
        padding: 0;
    }

    .card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        transform-style: preserve-3d;
        border-radius: 12px;
    }

    .card-container:hover .card-inner {
        transform: translateY(-5px);
        box-shadow: 0 0 15px rgba(139, 92, 246, 0.5);
    }

    .card-container.selected .card-inner,
    .card-container.result-state .card-inner {
        transform: rotateY(180deg);
        box-shadow: 0 0 25px #f472b6;
    }

    .card-front, .card-back {
        position: absolute;
        width: 100%;
        height: 100%;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }

    .card-front {
        background: linear-gradient(135deg, #312e81 0%, #4c1d95 100%);
        border: 2px solid #818cf8;
        background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236366f1' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
    }

    .card-back {
        background-color: #fff;
        color: #1e293b;
        transform: rotateY(180deg);
        border: 4px solid #fce7f3;
    }

    .fade-in {
        animation: fadeIn 0.8s ease-in forwards;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .custom-scroll::-webkit-scrollbar {
        width: 8px;
    }
    .custom-scroll::-webkit-scrollbar-track {
        background: rgba(255,255,255,0.05);
    }
    .custom-scroll::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.2);
        border-radius: 4px;
    }
</style>