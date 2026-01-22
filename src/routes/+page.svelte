<script lang="ts">
    import { fly, fade } from 'svelte/transition';

    // --- 1. DATA TIER ---
    interface Profile {
        id?: string;
        title: string;
        kanji: string;
        image: string;
        traits: string[];
    }

    const PROFILES: Record<string, Profile> = {
        C46: { kanji: '心', title: '純粋な心', image: '/the_heart_card.png', traits: ['感受性豊かで、愛することに一切の妥協なし', '相手の色に染まりやすく、献身的な愛を注ぐ'] },
        C28: { kanji: '陽', title: '天真爛漫な太陽', image: '/the_heart_card.png', traits: ['盛り上げ上手で周囲を明るくする天才', '天下無双のバイタリティで突き進む'] },
        C03: { kanji: '結', title: '不屈の結び目', image: '/the_heart_card.png', traits: ['一度決めたら離さない、驚異の粘り強さ', '「安定」こそが最大の幸福と信じている'] },
        C30: { kanji: '月', title: '神秘の月', image: '/the_heart_card.png', traits: ['直感力に優れ、相手の本音を見抜く名人', 'ミステリアスな雰囲気で人を惹きつける'] }
    };

    // --- 2. STATE ---
    let uBirth = $state('2000-01-01');
    let pBirth = $state('2000-01-02');
    let isCalculating = $state(false);
    let result = $state<any>(null);

    // Accordion state for FAQs
    let activeFaq = $state<number | null>(null);

    function getCard(date: string) {
        const sum = date.replace(/\D/g, '').split('').reduce((acc, n) => acc + parseInt(n), 0);
        const keys = Object.keys(PROFILES);
        return PROFILES[keys[sum % keys.length]];
    }

    async function runAppraisal() {
        isCalculating = true;
        // Scroll to top to see animation
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
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
    
    function toggleFaq(index: number) {
        activeFaq = activeFaq === index ? null : index;
    }
</script>

<div class="washi-bg min-h-screen font-['Zen_Old_Mincho',serif] text-[#333] overflow-hidden">
    <header class="py-12 text-center relative">
        <div class="inline-block border-2 border-[#b12b28] p-1 mb-4">
            <div class="bg-[#b12b28] text-white px-4 py-1 text-sm tracking-widest">
                相性占い
            </div>
        </div>
        <h1 class="text-3xl md:text-4xl font-bold font-['Shippori_Mincho'] text-[#b12b28] tracking-tighter">
            縁結び相性診断
        </h1>
        <p class="text-[10px] mt-2 text-[#c5a059] font-bold tracking-[0.3em]">THE RED THREAD OF FATE</p>
    </header>

    <main class="max-w-4xl mx-auto p-6">
        
        <section class="mb-24 min-h-[400px]">
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
                        <label class="block text-center mb-4 text-sm text-gray-500 font-bold uppercase tracking-widest">Your Birth
                        <input type="date" bind:value={uBirth} class="w-full bg-transparent text-center text-2xl border-none outline-none focus:ring-0 font-['Shippori_Mincho']" />
                    </label>
                    </div>

                    <div class="bg-white/60 border-t-4 border-b-4 border-[#b12b28] p-8 shadow-sm relative z-10">
                        <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#b12b28] text-white px-4 py-0.5 text-xs">お相手</div>
                        <label class="block text-center mb-4 text-sm text-gray-500 font-bold uppercase tracking-widest">Partner's Birth
                        <input type="date" bind:value={pBirth} class="w-full bg-transparent text-center text-2xl border-none outline-none focus:ring-0 font-['Shippori_Mincho']" />
                    </label>
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
                            <div class="h-1px bg-[#c5a059] flex-1"></div>
                            <h2 class="text-6xl font-['Shippori_Mincho'] font-bold text-[#b12b28]">
                                {result.score * 10}<span class="text-2xl ml-1">%</span>
                            </h2>
                            <div class="h-1px bg-[#c5a059] flex-1"></div>
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
        </section>

        <div class="flex justify-center items-center gap-4 py-8 opacity-50">
            <div class="h-1px w-20 bg-[#333]"></div>
            <div class="text-[#b12b28]">❖</div>
            <div class="h-1px w-20 bg-[#333]"></div>
        </div>

        <section class="py-16 relative">
            <h2 class="text-2xl font-['Shippori_Mincho'] text-center mb-2">診断について</h2>
            <p class="text-center text-xs text-[#b12b28] tracking-widest mb-10 uppercase">About Enmusubi</p>
            
            <div class="bg-white/50 p-8 md:p-12 border border-[#c5a059]/20 relative">
                <div class="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#b12b28]"></div>
                <div class="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#b12b28]"></div>
                <div class="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#b12b28]"></div>
                <div class="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#b12b28]"></div>

                <div class="flex flex-col md:flex-row gap-8 items-center">
                    <div class="md:w-1/3 text-center">
                        <div class="text-6xl font-['Shippori_Mincho'] text-[#b12b28]/10 select-none absolute -ml-6 -mt-6">数秘</div>
                        <h3 class="text-xl font-bold mb-4 relative z-10">生年月日に宿る<br>魂の暗号</h3>
                    </div>
                    <div class="md:w-2/3 space-y-4 text-sm leading-8 text-gray-700">
                        <p>
                            古来より、人がこの世に生を受けた「日」には、その人の運命や性格、そして魂の性質が刻まれていると言われています。
                        </p>
                        <p>
                            本サイトの「縁結び相性診断」は、東洋の数秘術と陰陽五行の思想を現代的に再解釈した独自のアルゴリズムを使用しています。単なる性格の一致だけでなく、二人の魂がどのように響き合うか、その「縁（えにし）」の深さを紐解きます。
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-16">
            <h2 class="text-2xl font-['Shippori_Mincho'] text-center mb-2">ご利用方法</h2>
            <p class="text-center text-xs text-[#b12b28] tracking-widest mb-12 uppercase">How to Use</p>

            <div class="grid md:grid-cols-3 gap-8">
                {#each [
                    { step: '壱', title: '生年月日を入力', desc: 'あなたとお相手の生年月日を正確に入力してください。' },
                    { step: '弐', title: '縁を占う', desc: '心を落ち着かせてボタンを押します。運命の計算が始まります。' },
                    { step: '参', title: '結果を受け取る', desc: '二人の相性と、魂の性質が表示されます。' }
                ] as item}
                    <div class="text-center group">
                        <div class="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-white border border-[#333] rounded-full group-hover:bg-[#b12b28] group-hover:border-[#b12b28] transition-colors duration-500">
                            <span class="font-['Shippori_Mincho'] text-2xl font-bold group-hover:text-white transition-colors">{item.step}</span>
                        </div>
                        <h3 class="text-lg font-bold mb-3 font-['Shippori_Mincho']">{item.title}</h3>
                        <p class="text-xs text-gray-500 leading-6 px-4">{item.desc}</p>
                    </div>
                {/each}
            </div>
        </section>

        <section class="py-16 max-w-2xl mx-auto">
            <h2 class="text-2xl font-['Shippori_Mincho'] text-center mb-2">よくある質問</h2>
            <p class="text-center text-xs text-[#b12b28] tracking-widest mb-10 uppercase">Q & A</p>

            <div class="space-y-4">
                {#each [
                    { q: '入力した情報は保存されますか？', a: 'いいえ、保存されません。入力された生年月日はお使いのブラウザ内でのみ計算に使用され、サーバーには一切送信されません。安心してお使いください。' },
                    { q: '相手の生まれた時間がわからなくても大丈夫ですか？', a: 'はい、大丈夫です。本診断は生年月日のみを使用するため、生まれた時間は必要ありません。' },
                    { q: '結果が良くない場合、どうすればいいですか？', a: '相性は「固定」されたものではなく、育てていくものです。診断結果はあくまで現在の二人の性質の組み合わせを示した指針です。違いを理解することで、より良い関係を築くヒントにしてください。' }
                ] as faq, i}
                    <div class="border-b border-[#333]/10 pb-4">
                        <button onclick={() => toggleFaq(i)} class="w-full text-left flex justify-between items-center py-2 hover:text-[#b12b28] transition-colors">
                            <span class="font-bold text-sm"><span class="text-[#b12b28] mr-2">Q.</span>{faq.q}</span>
                            <span class="text-xl text-[#c5a059]">{activeFaq === i ? '−' : '+'}</span>
                        </button>
                        {#if activeFaq === i}
                            <div class="pt-2 pb-2 pl-6 text-sm text-gray-600 leading-6" in:fly={{y: -10, duration: 200}}>
                                {faq.a}
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        </section>

        <section class="mt-12 bg-[#333] text-[#fdfcf0] p-8 md:p-12 text-center rounded-sm">
            <div class="w-10 h-10 border border-[#c5a059] mx-auto mb-6 flex items-center justify-center rotate-45">
                <div class="w-8 h-8 border border-[#c5a059] -rotate-45 flex items-center justify-center text-xs">注</div>
            </div>
            <h3 class="font-['Shippori_Mincho'] text-lg mb-4 text-[#c5a059]">ご利用上の注意</h3>
            <p class="text-xs leading-6 opacity-70 max-w-2xl mx-auto">
                本サイトが提供する診断結果は、統計学や数秘術に基づいたエンターテインメント・コンテンツです。
                将来の出来事や実際の相性を100%保証するものではありません。
                人生の選択や決断は、ご自身の責任において行っていただきますようお願いいたします。
            </p>
        </section>

    </main>

    <footer class="mt-8 py-12 text-center text-[10px] tracking-widest text-gray-400 border-t border-[#f0f0f0]">
        <div class="mb-4">
            <span class="inline-block px-2">Privacy Policy</span>
            <span class="inline-block px-2 border-l border-gray-200">Terms of Use</span>
            <span class="inline-block px-2 border-l border-gray-200">Contact</span>
        </div>
        © 2026 ENMUSUBI APPRAISAL OFFICE
    </footer>
</div>

<style>    
    .washi-bg {
        background-color: #fdfcf0;
        background-image: url("https://www.transparenttextures.com/patterns/p6.png");
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

    /* Vertical text utility for aesthetic numbers */
    /* .vertical-text {
        writing-mode: vertical-rl;
        text-orientation: upright;
    } */
</style>