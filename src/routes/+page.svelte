<script lang="ts">
    import { fly, fade, scale } from 'svelte/transition';

    // --- 1. DATA TIER (Stayed the same) ---
    interface Profile {
        id?: string;
        title: string;
        kanji: string;
        image: string;
        traits: string[];
    }

    const PROFILES: Record<string, Profile> = {
        C46: { kanji: '心', title: '純粋な心', image: 'https://images.unsplash.com/photo-1528164344705-4754268799af?auto=format&fit=crop&q=80&w=200', traits: ['感受性豊かで、愛することに一切の妥協なし', '相手の色に染まりやすく、献身的な愛を注ぐ'] },
        C28: { kanji: '陽', title: '天真爛漫な太陽', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=200', traits: ['盛り上げ上手で周囲を明るくする天才', '天下無双のバイタリティで突き進む'] },
        C03: { kanji: '結', title: '不屈の結び目', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=200', traits: ['一度決めたら離さない、驚異の粘り強さ', '「安定」こそが最大の幸福と信じている'] },
        C30: { kanji: '月', title: '神秘の月', image: 'https://images.unsplash.com/photo-1509130298739-651801c76e96?auto=format&fit=crop&q=80&w=200', traits: ['直感力に優れ、相手の本音を見抜く名人', 'ミステリアスな雰囲気で人を惹きつける'] }
    };

    // --- 2. STATE ---
    let uBirth = $state('2000-01-01');
    let pBirth = $state('2000-01-02');
    let isCalculating = $state(false);
    let result = $state<any>(null);

    function getCard(date: string) {
        const sum = date.replace(/\D/g, '').split('').reduce((acc, n) => acc + parseInt(n), 0);
        const keys = Object.keys(PROFILES);
        return PROFILES[keys[sum % keys.length]];
    }

    async function runAppraisal() {
        isCalculating = true;
        await new Promise((r) => setTimeout(r, 2000));
        result = {
            user: getCard(uBirth),
            partner: getCard(pBirth),
            compatibility: '二人の魂は深く結びついています。互いの違いを慈しむことで、より強固な縁となるでしょう。',
            score: 8.5
        };
        isCalculating = false;
    }

    function reset() { result = null; isCalculating = false; }
</script>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;700&family=Zen+Old+Mincho&display=swap');
    
    .washi-bg {
        background-color: #fdfcf0;
        background-image: url("https://www.transparenttextures.com/patterns/p6.png"); /* Subtle paper grain */
    }

    .mizuhiki-line {
        background: linear-gradient(to bottom, transparent 45%, #b12b28 45%, #b12b28 55%, transparent 55%);
        height: 2px;
        width: 100%;
        position: relative;
    }

    .mizuhiki-line::after {
        content: '';
        position: absolute;
        top: 4px;
        left: 0;
        width: 100%;
        height: 1px;
        background: #c5a059; /* Gold line */
    }

    .shuin-stamp {
        border: 3px solid #b12b28;
        color: #b12b28;
        transform: rotate(-5deg);
        display: inline-block;
        padding: 4px 12px;
        font-family: 'Shippori Mincho', serif;
        font-weight: bold;
        border-radius: 4px;
        background: rgba(177, 43, 40, 0.05);
    }
</style>

<div class="washi-bg min-h-screen font-['Zen_Old_Mincho',serif] text-[#333]">
    <header class="py-10 text-center relative">
        <!-- <div class="mizuhiki-line absolute bottom-0 left-0"></div> -->
        <div class="inline-block border-2 border-[#b12b28] p-1 mb-4">
            <div class="bg-[#b12b28] text-white px-4 py-1 text-sm tracking-widest">
                開運招福
            </div>
        </div>
        <h1 class="text-3xl font-bold font-['Shippori_Mincho'] text-[#b12b28] tracking-tighter">
            縁結び相性診断
        </h1>
        <p class="text-[10px] mt-1 text-[#c5a059] font-bold tracking-[0.3em]">THE RED THREAD OF FATE</p>
    </header>

    <main class="max-w-4xl mx-auto p-6">
        {#if isCalculating}
            <div class="py-20 text-center" in:fade>
                <div class="relative w-24 h-24 mx-auto mb-6">
                    <div class="absolute inset-0 border-4 border-[#b12b28]/20 rounded-full"></div>
                    <div class="absolute inset-0 border-4 border-t-[#b12b28] rounded-full animate-spin"></div>
                    <div class="absolute inset-0 flex items-center justify-center font-bold text-[#b12b28]">縁</div>
                </div>
                <p class="font-['Shippori_Mincho'] text-[#b12b28] animate-pulse">運命の糸をたぐり寄せています...</p>
            </div>
        {:else if !result}
            <div class="grid md:grid-cols-2 gap-12 mt-8 items-center relative" in:fly={{y: 20}}>
                <div class="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
                    <svg width="120" height="40" viewBox="0 0 120 40">
                        <path d="M0,20 Q30,0 60,20 T120,20" fill="none" stroke="#b12b28" stroke-width="2" stroke-dasharray="4" />
                    </svg>
                </div>

                <div class="bg-white/60 border-t-4 border-b-4 border-[#333] p-8 shadow-sm relative z-10">
                    <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#333] text-white px-4 py-0.5 text-xs">あなた</div>
                    <label class="block text-center mb-4 text-sm text-gray-500 font-bold uppercase tracking-widest">Your Birth</label>
                    <input type="date" bind:value={uBirth} class="w-full bg-transparent text-center text-2xl border-none outline-none focus:ring-0 font-['Shippori_Mincho']" />
                </div>

                <div class="bg-white/60 border-t-4 border-b-4 border-[#b12b28] p-8 shadow-sm relative z-10">
                    <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#b12b28] text-white px-4 py-0.5 text-xs">お相手</div>
                    <label class="block text-center mb-4 text-sm text-gray-500 font-bold uppercase tracking-widest">Partner's Birth</label>
                    <input type="date" bind:value={pBirth} class="w-full bg-transparent text-center text-2xl border-none outline-none focus:ring-0 font-['Shippori_Mincho']" />
                </div>
            </div>

            <button onclick={runAppraisal} class="mt-16 w-full max-w-sm mx-auto block bg-[#b12b28] hover:bg-[#8e221f] text-white py-5 px-10 rounded-full shadow-xl transition-all hover:scale-105 active:scale-95 group">
                <span class="flex items-center justify-center gap-3 font-bold tracking-widest text-lg">
                    二人の縁を占う
                    <span class="group-hover:translate-x-1 transition-transform">→</span>
                </span>
            </button>
        {:else}
            <div class="space-y-10" in:fade>
                <div class="text-center bg-white/80 p-10 border border-[#c5a059]/30 rounded-3xl shadow-inner">
                    <div class="shuin-stamp mb-4">大吉相性</div>
                    <div class="flex items-center justify-center gap-4">
                        <div class="h-[1px] bg-[#c5a059] flex-1"></div>
                        <h2 class="text-6xl font-['Shippori_Mincho'] font-bold text-[#b12b28]">
                            {result.score * 10}<span class="text-2xl ml-1">%</span>
                        </h2>
                        <div class="h-[1px] bg-[#c5a059] flex-1"></div>
                    </div>
                    <p class="mt-6 text-lg leading-relaxed max-w-xl mx-auto italic text-gray-600">
                        「{result.compatibility}」
                    </p>
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                    {#each [result.user, result.partner] as profile, i}
                        <div class="bg-white p-6 shadow-md border-l-8 {i === 0 ? 'border-[#333]' : 'border-[#b12b28]'}">
                            <div class="flex items-start gap-4">
                                <div class="text-5xl font-['Shippori_Mincho'] text-[#b12b28] opacity-20 select-none">{profile.kanji}</div>
                                <div>
                                    <h3 class="text-xl font-bold font-['Shippori_Mincho'] mb-3">{profile.title}</h3>
                                    <ul class="space-y-2 text-sm text-gray-600">
                                        {#each profile.traits as trait}
                                            <li class="flex gap-2">
                                                <span class="text-[#c5a059]">◆</span> {trait}
                                            </li>
                                        {/each}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>

                <div class="text-center pt-10">
                    <button onclick={reset} class="text-[#b12b28] font-bold border-b border-[#b12b28] pb-1 hover:opacity-70 transition-opacity">
                        もう一度占う
                    </button>
                </div>
            </div>
        {/if}
    </main>

    <footer class="mt-20 py-10 text-center text-[10px] tracking-widest text-gray-400">
        <!-- <div class="mizuhiki-line absolute top-0 left-0"></div> -->
        © 2026 ENMUSUBI APPRAISAL OFFICE
    </footer>
</div>