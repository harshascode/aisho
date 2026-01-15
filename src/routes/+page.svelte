<script lang="ts">
    // --- 0. INTERFACES ---
    interface CardDetails { keyword: string; tone: string; action: string; }
    interface Card { id: string; name: string; emoji: string; element: string; focus: string; energy: string; pos: CardDetails; neg: CardDetails; }
    interface ReadingResult { c1: Card; c2: Card; score: number; int1: string; int2: string; sum: string; adv: string; uName: string; pName: string; }

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

    const INTERACTION_RULES: Record<string, any> = {
        element: { 'Fire': { 'Fire': 0.7, 'Air': 0.5, 'Earth': 0, 'Water': -0.8 }, 'Water': { 'Water': 0.7, 'Earth': 0.5, 'Air': 0, 'Fire': -0.8 }, 'Earth': { 'Earth': 0.7, 'Water': 0.5, 'Fire': 0, 'Air': -0.8 }, 'Air': { 'Air': 0.7, 'Fire': 0.5, 'Water': 0, 'Earth': -0.8 } },
        focus: { 'Emotion': { 'Emotion': 0.4, 'Action': 0.2, 'Stability': 0, 'Intellect': -0.4 }, 'Action': { 'Action': 0.4, 'Emotion': 0.2, 'Intellect': 0, 'Stability': -0.4 }, 'Stability': { 'Stability': 0.4, 'Intellect': 0.2, 'Action': 0, 'Emotion': -0.4 }, 'Intellect': { 'Intellect': 0.4, 'Stability': 0.2, 'Emotion': 0, 'Action': -0.4 } },
        energy: { 'Active': { 'Active': 0.2, 'Passive': 0.3 }, 'Passive': { 'Passive': 0.2, 'Active': 0.3 } }
    };

    const TEMPLATES = {
        card1_you: (c1: Card, c2: Card, score: number, name: string) => (score >= 0 ? `**${name}**, your core nature is **${c1.name}**. You focus on ${c1.pos.action.toLowerCase()}` : `**${name}**, your energy is currently shadowed by **${c1.neg.keyword}**. You may tend to ${c1.neg.action.toLowerCase()}`),
        card2_partner: (c1: Card, c2: Card, score: number, name: string) => (score >= 0 ? `**${name}** approaches this with **${c2.name}**. Their energy mirrors yours through ${c2.pos.keyword.toLowerCase()}.` : `**${name}** suggests a pressure of **${c2.neg.keyword}**, perhaps ${c2.neg.action.toLowerCase()}`),
        summary: {
            2: ["A fateful union. [U_NAME]'s [C1_ELEMENT] and [P_NAME]'s [C2_ELEMENT] energies are in sublime cooperation.", "Rare alignment. [C1_NAME] meshes perfectly with [C2_NAME]. The bond flows with natural [C1_POS]."],
            1: ["A solid foundation. [U_NAME]'s [C1_FOCUS] meets [P_NAME]'s [C2_FOCUS] constructively.", "Growing strength. The link between [C1_ELEMENT] and [C2_ELEMENT] is encouraging."],
            0: ["A crossroads. Potential for [C1_POS] exists if you both avoid the shadows of [C1_NEG].", "A blank canvas. Shared path depends on how well [C1_FOCUS] needs accommodate [C2_FOCUS] needs."],
            "-1": ["Frictional dynamics. Tension between [C1_ELEMENT] and [C2_ELEMENT] requires patience.", "A challenge to express needs. One leans into [C1_NEG] while the other retreats."],
            "-2": ["Oppositional force. A clash between [C1_FOCUS] and [C2_FOCUS]. High intensity.", "Unstable ground. Elemental opposition requires a total overhaul of communication."]
        },
        advice: {
            2: ["Nurture what is already strong.", "Risk greater emotional transparency."],
            1: ["Bridge the energy gap with [C1_ENERGY] intent.", "Create a concrete action plan together."],
            0: ["Make an intentional commitment.", "Establish clearer roles in the relationship."],
            "-1": ["Practice the art of listening. Truly hear them.", "Address the root cause of [C1_NEG]."],
            "-2": ["Seek external perspective.", "Step back temporarily to mitigate [C1_NEG]."]
        }
    };

    // --- 2. STATE ---
    let uName = $state('');
    let uBirth = $state('');
    let pName = $state('');
    let pBirth = $state('');
    let isCalculating = $state(false);
    let readingResult = $state<ReadingResult | null>(null);

    // --- 3. LOGIC ---
    function getCardIdFromBirth(date: string): string {
        const sum = date.replace(/\D/g, '').split('').reduce((acc, n) => acc + parseInt(n), 0);
        const keys = Object.keys(CARD_DATA);
        return keys[sum % keys.length];
    }

    function calculateScore(c1: Card, c2: Card): number {
        let s = INTERACTION_RULES.element[c1.element][c2.element] + 
                INTERACTION_RULES.focus[c1.focus][c2.focus] + 
                INTERACTION_RULES.energy[c1.energy][c2.energy];
        return Math.round(Math.max(-2, Math.min(2, s * 1.5)));
    }

    async function runReading() {
        if (!uBirth || !pBirth) return;
        isCalculating = true;
        
        // Artificial delay for ritual feel
        await new Promise(r => setTimeout(r, 2000));

        const id1 = getCardIdFromBirth(uBirth);
        const id2 = getCardIdFromBirth(pBirth);
        const c1 = CARD_DATA[id1];
        const c2 = CARD_DATA[id2];
        const score = calculateScore(c1, c2);
        const scoreKey = score.toString() as keyof typeof TEMPLATES.summary;
        
        const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
        let sum = getRandom(TEMPLATES.summary[scoreKey]);
        let adv = getRandom(TEMPLATES.advice[scoreKey]);

        const reps: Record<string, string> = { 
            '[C1_ELEMENT]': c1.element, '[C1_FOCUS]': c1.focus, '[C1_ENERGY]': c1.energy, '[C1_NAME]': c1.name, '[C1_POS]': c1.pos.keyword, '[C1_NEG]': c1.neg.keyword, 
            '[C2_ELEMENT]': c2.element, '[C2_FOCUS]': c2.focus, '[C2_ENERGY]': c2.energy, '[C2_NAME]': c2.name, '[C2_POS]': c2.pos.keyword, '[C2_NEG]': c2.neg.keyword,
            '[U_NAME]': uName || 'You', '[P_NAME]': pName || 'Partner'
        };
        
        Object.keys(reps).forEach(key => { 
            sum = sum.replaceAll(key, reps[key]); 
            adv = adv.replaceAll(key, reps[key]); 
        });

        readingResult = { 
            c1, c2, score, sum, adv, uName: uName || 'You', pName: pName || 'Partner',
            int1: TEMPLATES.card1_you(c1, c2, score, uName || 'You').replace(/\*\*(.*?)\*\*/g, '<strong class="text-pink-300">$1</strong>'),
            int2: TEMPLATES.card2_partner(c1, c2, score, pName || 'Partner').replace(/\*\*(.*?)\*\*/g, '<strong class="text-pink-300">$1</strong>')
        };
        isCalculating = false;
    }

    function reset() {
        readingResult = null;
        uBirth = ''; pBirth = ''; uName = ''; pName = '';
    }

    function getImg(name: string) { return `https://placehold.co/300x450/2e1065/fdf2f8?text=${name.replace(' ', '+')}&font=playfair-display`; }
</script>

<svelte:head>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen p-4 flex items-center justify-center bg-stellar">
    <div class="glass-panel w-full max-w-4xl rounded-3xl p-6 md:p-10 relative overflow-hidden">
        
        <header class="text-center mb-8">
            <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200 mb-2 font-serif">相性占い</h1>
            <p class="text-indigo-300 text-xs tracking-widest uppercase">Destiny Alignment Engine</p>
        </header>

        {#if isCalculating}
            <div class="flex flex-col items-center justify-center py-20 fade-in">
                <div class="ritual-loader mb-6"></div>
                <p class="text-xl text-pink-200 animate-pulse font-serif">Consulting the Constellations...</p>
            </div>
        {:else if !readingResult}
            <section class="max-w-md mx-auto fade-in">
                <div class="space-y-6">
                    <div class="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <label class="block text-purple-200 text-sm mb-2 font-serif">Your Details</label>
                        <input type="text" bind:value={uName} placeholder="Your Name" class="w-full bg-indigo-950/50 border border-indigo-500/30 rounded-lg p-3 mb-3 focus:outline-none focus:border-pink-500 transition-colors">
                        <input type="date" bind:value={uBirth} class="w-full bg-indigo-950/50 border border-indigo-500/30 rounded-lg p-3 text-white">
                    </div>

                    <div class="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <label class="block text-pink-200 text-sm mb-2 font-serif">Partner's Details</label>
                        <input type="text" bind:value={pName} placeholder="Partner's Name" class="w-full bg-indigo-950/50 border border-indigo-500/30 rounded-lg p-3 mb-3 focus:outline-none focus:border-pink-500 transition-colors">
                        <input type="date" bind:value={pBirth} class="w-full bg-indigo-950/50 border border-indigo-500/30 rounded-lg p-3 text-white">
                    </div>

                    <button onclick={runReading} disabled={!uBirth || !pBirth} class="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-white shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:grayscale">
                        Reveal Our Destiny
                    </button>
                </div>
            </section>
        {:else}
            <section class="fade-in">
                <div class="text-center mb-10">
                    <div class="flex justify-center space-x-1 mb-2">
                        {#each Array(5) as _, i}
                            <span class="text-2xl {i < (readingResult.score + 3) ? 'text-pink-500' : 'text-white/10'}">❤️</span>
                        {/each}
                    </div>
                    <h2 class="text-2xl font-serif text-white">Compatibility Result</h2>
                </div>

                <div class="grid md:grid-cols-2 gap-8 mb-8">
                    <div class="bg-indigo-900/30 p-6 rounded-2xl border border-indigo-500/20 text-center">
                        <p class="text-xs uppercase tracking-widest text-indigo-300 mb-4">{readingResult.uName}'s Card</p>
                        <img src={getImg(readingResult.c1.name)} alt="" class="w-32 h-48 mx-auto rounded-lg shadow-2xl mb-4 border-2 border-pink-500/30">
                        <h3 class="text-xl font-serif text-pink-200">{readingResult.c1.emoji} {readingResult.c1.name}</h3>
                        <p class="text-sm text-gray-400 mt-2">{@html readingResult.int1}</p>
                    </div>
                    <div class="bg-indigo-900/30 p-6 rounded-2xl border border-indigo-500/20 text-center">
                        <p class="text-xs uppercase tracking-widest text-indigo-300 mb-4">{readingResult.pName}'s Card</p>
                        <img src={getImg(readingResult.c2.name)} alt="" class="w-32 h-48 mx-auto rounded-lg shadow-2xl mb-4 border-2 border-pink-500/30">
                        <h3 class="text-xl font-serif text-pink-200">{readingResult.c2.emoji} {readingResult.c2.name}</h3>
                        <p class="text-sm text-gray-400 mt-2">{@html readingResult.int2}</p>
                    </div>
                </div>

                <div class="bg-white/5 p-6 rounded-2xl border border-white/10 mb-8">
                    <h4 class="text-purple-300 font-serif mb-2">The Analysis</h4>
                    <p class="text-gray-300 leading-relaxed italic">"{readingResult.sum}"</p>
                    <div class="mt-4 pt-4 border-t border-white/10">
                        <p class="text-amber-200 text-sm">✨ <strong>Guidance:</strong> {readingResult.adv}</p>
                    </div>
                </div>

                <button onclick={reset} class="w-full py-3 border border-indigo-500/50 text-indigo-300 rounded-lg hover:bg-indigo-500/10 transition-colors">
                    Try Different Dates
                </button>
            </section>
        {/if}
    </div>
</div>

<style>
    :global(body) { background: #020617; font-family: 'Inter', sans-serif; color: white; }
    .bg-stellar { background: radial-gradient(circle at top right, #1e1b4b, #020617); }
    .font-serif { font-family: 'Cinzel', serif; }
    .glass-panel { background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); }
    
    .ritual-loader {
        width: 60px; height: 60px;
        border: 3px solid transparent;
        border-top-color: #ec4899;
        border-bottom-color: #8b5cf6;
        border-radius: 50%;
        animation: spin 1.5s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
    .fade-in { animation: fadeIn 0.6s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    
    input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); }
</style>