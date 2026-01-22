<script lang="ts">
    import { fly, fade, slide } from 'svelte/transition';

    // --- 1. DATA TIER ---
    interface Profile {
        id?: string;
        title: string;
        kanji: string;
        image: string;
        traits: string[];
    }

    // SEO Optimized Profiles
    const PROFILES: Record<string, Profile> = {
        C46: { 
            kanji: '心', 
            title: '純粋な心の持ち主', 
            image: '/the_heart_card.png', 
            traits: ['感受性が豊かで、相性占いにおいて最も重視される「愛」の深さを持っています', '相手の色に染まりやすく、献身的な愛情で関係を築きます'] 
        },
        C28: { 
            kanji: '陽', 
            title: '天真爛漫な太陽', 
            image: '/the_heart_card.png', 
            traits: ['周囲を明るくする才能があり、恋愛相性において最高のムードメーカー', '天下無双のバイタリティで、困難な相性すらも好転させます'] 
        },
        C03: { 
            kanji: '結', 
            title: '不屈の結び目', 
            image: '/the_heart_card.png', 
            traits: ['一度決めたら離さない粘り強さは、結婚相性において抜群の安定感を誇ります', '「安定」こそが最大の幸福と信じ、着実に関係を育みます'] 
        },
        C30: { 
            kanji: '月', 
            title: '神秘の月', 
            image: '/the_heart_card.png', 
            traits: ['直感力に優れ、相性占いの結果以上に相手の本質を見抜く力があります', 'ミステリアスな魅力で相手を惹きつけ、離れられない関係を作ります'] 
        }
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
        
        // Simple deterministic score calculation for demo
        const scoreBase = (parseInt(uBirth.replace(/-/g, '')) + parseInt(pBirth.replace(/-/g, ''))) % 100;
        const finalScore = scoreBase < 50 ? scoreBase + 50 : scoreBase;

        result = {
            user: getCard(uBirth),
            partner: getCard(pBirth),
            compatibility: '二人の生年月日に刻まれた運命は、非常に高い親和性を示しています。お互いの違いを補い合うことで、最強の相性となるでしょう。',
            score: finalScore / 10
        };
        isCalculating = false;
    }

    function reset() { result = null; isCalculating = false; }
    
    function toggleFaq(index: number) {
        activeFaq = activeFaq === index ? null : index;
    }
</script>

<svelte:head>
    <title>完全無料・相性占い | 縁結び診断</title>
    <meta name="description" content="生年月日で占う本格相性診断。恋愛、結婚の相性を完全無料で鑑定します。二人の縁の深さを今すぐチェック。">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600;700;800&family=Zen+Old+Mincho:wght@400;700;900&display=swap" rel="stylesheet">
</svelte:head>

<div class="washi-bg min-h-screen font-zen text-[#333] overflow-x-hidden">
    <!-- --- HEADER --- -->
    <header class="py-12 text-center relative px-4">
        <div class="inline-block border-2 border-[#b12b28] p-1 mb-4">
            <h2 class="bg-[#b12b28] text-white px-4 py-1 text-sm tracking-widest font-zen">
                完全無料・生年月日占い
            </h2>
        </div>
        <h1 class="text-3xl md:text-5xl font-bold font-mincho text-[#b12b28] tracking-tighter mb-4 leading-tight">
            運命の<br class="md:hidden" />相性占い
        </h1>
        <p class="text-xs md:text-sm mt-2 text-[#c5a059] font-bold tracking-[0.3em] uppercase">
            Compatibility Divination
        </p>
        <p class="mt-6 text-sm text-gray-600 max-w-lg mx-auto leading-7">
            あなたの恋の行方は？二人の生年月日を入力するだけで、<br class="hidden md:inline"/>
            恋愛・結婚の相性を精密に鑑定します。<br class="hidden md:inline"/>
            驚くほど当たると評判の診断を、今すぐ無料でお試しください。
        </p>
    </header>

    <main class="max-w-4xl mx-auto p-6">
        
        <!-- --- APPRAISAL AREA --- -->
        <section class="mb-24 min-h-[400px]">
            {#if isCalculating}
                <div class="py-20 text-center" in:fade>
                    <div class="relative w-24 h-24 mx-auto mb-6">
                        <div class="absolute inset-0 border-4 border-[#b12b28]/20 rounded-full"></div>
                        <div class="absolute inset-0 border-4 border-t-[#b12b28] rounded-full animate-spin"></div>
                        <div class="absolute inset-0 flex items-center justify-center font-bold text-[#b12b28] font-mincho text-xl">縁</div>
                    </div>
                    <p class="font-mincho text-[#b12b28] animate-pulse text-lg">二人の相性を計算中...</p>
                </div>
            {:else if !result}
                <div in:fly={{y: 20}}>
                    <div class="grid md:grid-cols-2 gap-12 mt-8 items-center relative">
                        <!-- Decorative Red Thread -->
                        <div class="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-40">
                            <svg width="200" height="60" viewBox="0 0 120 40">
                                <path d="M0,20 Q30,0 60,20 T120,20" fill="none" stroke="#b12b28" stroke-width="1" stroke-dasharray="4" />
                            </svg>
                        </div>

                        <!-- USER INPUT -->
                        <div class="bg-white/80 backdrop-blur-sm border-t-4 border-b-4 border-[#333] p-8 shadow-lg relative z-10 transition-transform hover:-translate-y-1 duration-300">
                            <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#333] text-white px-6 py-1 text-xs tracking-wider">あなた</div>
                            <label class="block text-center mb-4 text-xs text-gray-500 font-bold uppercase tracking-widest">
                                Your Birth Date
                                <input type="date" bind:value={uBirth} class="w-full bg-transparent text-center text-2xl border-b border-gray-300 pb-2 outline-none focus:border-[#b12b28] font-mincho transition-colors cursor-pointer mt-2" />
                            </label>
                        </div>

                        <!-- PARTNER INPUT -->
                        <div class="bg-white/80 backdrop-blur-sm border-t-4 border-b-4 border-[#b12b28] p-8 shadow-lg relative z-10 transition-transform hover:-translate-y-1 duration-300">
                            <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#b12b28] text-white px-6 py-1 text-xs tracking-wider">お相手</div>
                            <label class="block text-center mb-4 text-xs text-gray-500 font-bold uppercase tracking-widest">
                                Partner's Birth Date
                                <input type="date" bind:value={pBirth} class="w-full bg-transparent text-center text-2xl border-b border-gray-300 pb-2 outline-none focus:border-[#b12b28] font-mincho transition-colors cursor-pointer mt-2" />
                            </label>
                        </div>
                    </div>

                    <button onclick={runAppraisal} class="mt-16 w-full max-w-md mx-auto block bg-[#b12b28] hover:bg-[#8e221f] text-white py-5 px-10 rounded-full shadow-xl transition-all hover:scale-105 active:scale-95 group relative overflow-hidden">
                        <div class="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <span class="flex items-center justify-center gap-3 font-bold tracking-widest text-lg relative z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                            無料で相性を占う
                            <span class="group-hover:translate-x-1 transition-transform">→</span>
                        </span>
                    </button>
                    
                    <p class="text-center text-xs text-gray-400 mt-6">
                        ※個人情報は保存されません。安心してお試しください。
                    </p>
                </div>
            {:else}
                <div class="space-y-10" in:fade>
                    <div class="text-center bg-white/90 p-10 border border-[#c5a059]/30 rounded-sm shadow-xl relative overflow-hidden">
                        <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#c5a059] via-[#b12b28] to-[#c5a059]"></div>
                        
                        <div class="shuin-stamp mb-6 text-lg">相性診断結果</div>
                        
                        <div class="flex items-center justify-center gap-4 mb-8">
                            <div class="h-[1px] bg-[#c5a059] flex-1 opacity-50"></div>
                            <h2 class="text-7xl font-mincho font-bold text-[#b12b28] flex items-baseline">
                                {result.score * 10}<span class="text-2xl ml-2 text-[#333]">%</span>
                            </h2>
                            <div class="h-[1px] bg-[#c5a059] flex-1 opacity-50"></div>
                        </div>
                        
                        <h3 class="text-xl font-bold mb-4 font-mincho text-[#333]">魂の絆とこれからの未来</h3>
                        <p class="text-base md:text-lg leading-relaxed max-w-2xl mx-auto text-gray-700 font-zen">
                            {result.compatibility}
                        </p>
                    </div>

                    <div class="grid md:grid-cols-2 gap-6">
                        {#each [result.user, result.partner] as profile, i}
                            <div class="bg-white p-8 shadow-md border-t-8 {i === 0 ? 'border-[#333]' : 'border-[#b12b28]'}">
                                <div class="flex items-start gap-5">
                                    <div class="text-6xl font-mincho {i === 0 ? 'text-[#333]' : 'text-[#b12b28]'} opacity-10 select-none absolute">
                                        {profile.kanji}
                                    </div>
                                    <div class="relative z-10 w-full pl-6">
                                        <div class="flex items-center gap-2 mb-3">
                                            <span class="text-xs px-2 py-1 text-white {i === 0 ? 'bg-[#333]' : 'bg-[#b12b28]'}">
                                                {i === 0 ? 'あなた' : 'お相手'}
                                            </span>
                                        </div>
                                        <h3 class="text-2xl font-bold font-mincho mb-4">{profile.title}</h3>
                                        <ul class="space-y-3 text-sm text-gray-600">
                                            {#each profile.traits as trait}
                                                <li class="flex gap-3 items-start border-b border-dashed border-gray-100 pb-2">
                                                    <span class="text-[#c5a059] mt-1">◆</span> {trait}
                                                </li>
                                            {/each}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>

                    <div class="text-center pt-10">
                        <button onclick={reset} class="text-[#b12b28] font-bold border-b-2 border-[#b12b28] pb-1 hover:text-[#333] hover:border-[#333] transition-colors text-lg">
                            もう一度、別の相手と相性を占う
                        </button>
                    </div>
                </div>
            {/if}
        </section>

        <!-- --- DIVIDER --- -->
        <div class="flex justify-center items-center gap-4 py-8 opacity-30">
            <div class="h-[1px] w-20 bg-[#333]"></div>
            <div class="text-[#b12b28] font-mincho">❖</div>
            <div class="h-[1px] w-20 bg-[#333]"></div>
        </div>

        <!-- --- ABOUT SECTION --- -->
        <section class="py-16 relative">
            <h2 class="text-2xl md:text-3xl font-mincho text-center mb-2 font-bold">
                なぜ当たる？本サイトの相性占い
            </h2>
            <p class="text-center text-xs text-[#b12b28] tracking-widest mb-10 uppercase">About Our Appraisal</p>
            
            <div class="bg-white/60 p-8 md:p-12 border border-[#c5a059]/20 relative shadow-sm">
                <!-- Corner decorations -->
                <div class="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#b12b28]"></div>
                <div class="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#b12b28]"></div>
                <div class="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#b12b28]"></div>
                <div class="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#b12b28]"></div>

                <div class="flex flex-col md:flex-row gap-10 items-center">
                    <div class="md:w-1/3 text-center relative">
                        <div class="w-40 h-40 bg-[#b12b28] rounded-full opacity-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
                        <div class="text-[#b12b28] mb-4 relative z-10 flex justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M11 17.6a2 2 0 1 1-2-2.5V8.5A2 2 0 0 1 10.9 6.4L8.5 2.1"/><path d="M13.8 17.6a2 2 0 1 0 2-2.5V5.4a2 2 0 0 0-1.8-2l-2.2 4.5"/><path d="M12 17v4"/><path d="M13 2h6a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-6"/></svg>
                        </div>
                        <h3 class="text-xl font-bold mb-2 relative z-10 font-mincho">生年月日の秘密</h3>
                        <p class="text-xs text-gray-500">Ancient Wisdom</p>
                    </div>
                    <div class="md:w-2/3 space-y-5 text-sm md:text-base leading-8 text-gray-700 font-zen">
                        <p>
                            <strong class="text-[#b12b28]">「相性占い」</strong>で最も重要な要素、それは生年月日です。古来より、人がこの世に生を受けた「日」には、その人の運命や性格、そして魂の性質が刻まれていると言われています。
                        </p>
                        <p>
                            本サイトの縁結び相性診断は、東洋の数秘術と陰陽五行の思想を現代的に再解釈。単なる性格の一致だけでなく、<strong class="underline decoration-[#c5a059]/50 decoration-4">恋愛相性から結婚生活の傾向まで</strong>、二人の魂がどのように響き合うかを紐解きます。
                        </p>
                        <p>
                            片思い中の方も、カップルの方も、あるいはご夫婦であっても。相手を知り、己を知ることが、良縁を結ぶ第一歩となります。
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- --- HOW TO USE --- -->
        <section class="py-16">
            <h2 class="text-2xl md:text-3xl font-mincho text-center mb-2 font-bold">相性占いの手順</h2>
            <p class="text-center text-xs text-[#b12b28] tracking-widest mb-12 uppercase">How to Use</p>

            <div class="grid md:grid-cols-3 gap-8">
                {#each [
                    { step: '壱', title: '生年月日を入力', desc: 'あなたとお相手の生年月日を正確に入力してください。生まれた時間は不要です。' },
                    { step: '弐', title: '縁を占う', desc: '心を落ち着かせてボタンを押します。複雑なアルゴリズムが二人の運命を計算します。' },
                    { step: '参', title: '結果を受け取る', desc: '総合的な相性スコアと、お互いの本質的な性格の相性が表示されます。' }
                ] as item}
                    <div class="text-center group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div class="relative w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-[#fdfcf0] border border-[#333] rounded-full group-hover:bg-[#b12b28] group-hover:border-[#b12b28] transition-colors duration-500">
                            <span class="font-mincho text-xl font-bold group-hover:text-white transition-colors">{item.step}</span>
                        </div>
                        <h3 class="text-lg font-bold mb-3 font-mincho">{item.title}</h3>
                        <p class="text-xs text-gray-500 leading-6">{item.desc}</p>
                    </div>
                {/each}
            </div>
        </section>

        <!-- --- SEO FAQ SECTION --- -->
        <section class="py-16 max-w-3xl mx-auto">
            <h2 class="text-2xl md:text-3xl font-mincho text-center mb-2 font-bold">相性占いによくある質問</h2>
            <p class="text-center text-xs text-[#b12b28] tracking-widest mb-10 uppercase">Q & A</p>

            <div class="space-y-4 bg-white p-6 rounded-xl shadow-sm">
                {#each [
                    { q: 'この相性占いは本当に無料ですか？', a: 'はい、完全無料です。何度占っても料金は一切かかりません。気になるお相手との相性を心ゆくまでご確認ください。' },
                    { q: '入力した生年月日は保存されますか？', a: 'いいえ、保存されません。入力された情報は、お使いのブラウザ内（端末内）でのみ計算に使用され、外部サーバーには一切送信されません。プライバシーは守られていますので、安心してお使いください。' },
                    { q: '相手の生まれた時間がわからなくても占えますか？', a: 'はい、大丈夫です。本サイトの相性占いは生年月日（西暦・月・日）のみを使用するため、生まれた時間は必要ありません。' },
                    { q: '相性の結果が悪かった場合、どうすればいいですか？', a: '相性は「固定」されたものではなく、理解し育てていくものです。診断結果はあくまで現在の二人の性質の組み合わせを示した指針です。違いを理解し、補い合うことで、どのような結果であっても良い関係を築くことは可能です。' },
                    { q: '結婚の相性もわかりますか？', a: 'はい。本診断では基本的な性格の相性をベースにしているため、恋愛だけでなく、結婚後の生活における相性の良し悪しも判断する材料になります。' }
                ] as faq, i}
                    <div class="border-b border-[#333]/10 last:border-0">
                        <button onclick={() => toggleFaq(i)} class="w-full text-left flex justify-between items-center py-4 hover:text-[#b12b28] transition-colors group">
                            <span class="font-bold text-sm md:text-base font-mincho flex items-center">
                                <span class="bg-[#b12b28] text-white text-xs px-2 py-0.5 rounded mr-3 group-hover:bg-[#333] transition-colors">Q</span>
                                {faq.q}
                            </span>
                            <span class="text-xl text-[#c5a059] transform transition-transform {activeFaq === i ? 'rotate-45' : ''}">+</span>
                        </button>
                        {#if activeFaq === i}
                            <div class="overflow-hidden" transition:slide={{ duration: 300 }}>
                                <div class="pb-4 pl-10 text-sm text-gray-600 leading-6 font-zen">
                                    {faq.a}
                                </div>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        </section>

        <!-- --- DISCLAIMER --- -->
        <section class="mt-12 bg-[#333] text-[#fdfcf0] p-8 md:p-12 text-center rounded-sm">
            <div class="w-10 h-10 border border-[#c5a059] mx-auto mb-6 flex items-center justify-center rotate-45">
                <div class="w-8 h-8 border border-[#c5a059] -rotate-45 flex items-center justify-center text-xs">注</div>
            </div>
            <h3 class="font-mincho text-lg mb-4 text-[#c5a059]">ご利用上の注意</h3>
            <p class="text-xs leading-6 opacity-70 max-w-2xl mx-auto">
                本サイトが提供する「相性占い」の診断結果は、統計学や数秘術に基づいたエンターテインメント・コンテンツです。
                将来の出来事や実際の相性を100%保証するものではありません。
                人生の重要な選択や決断は、ご自身の責任において行っていただきますようお願いいたします。
            </p>
        </section>

    </main>

    <footer class="mt-8 py-12 text-center text-[10px] tracking-widest text-gray-400 border-t border-[#333]/10 bg-white/50">
        <div class="mb-4">
            <span class="inline-block px-3 hover:text-[#b12b28] cursor-pointer transition-colors">プライバシーポリシー</span>
            <span class="inline-block px-3 border-l border-gray-300 hover:text-[#b12b28] cursor-pointer transition-colors">利用規約</span>
            <span class="inline-block px-3 border-l border-gray-300 hover:text-[#b12b28] cursor-pointer transition-colors">お問い合わせ</span>
        </div>
        © 2026 ENMUSUBI APPRAISAL OFFICE | Ultimate Compatibility Divination
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
    
    .font-mincho { font-family: 'Shippori Mincho', serif; }
    .font-zen { font-family: 'Zen Old Mincho', serif; }
</style>