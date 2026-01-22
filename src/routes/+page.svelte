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

    // SEO Optimized Profiles (Refined Japanese Copy)
    // Keys are arbitrary IDs. 
    const PROFILES: Record<string, Profile> = {
        // --- The Originals (Refined) ---
        C01: { 
            kanji: '心', 
            title: '純粋な心の持ち主', 
            image: '/the_heart_card.png', 
            traits: ['感受性が豊かで、相性占いにおいて最も重視される「愛」の深さを持っています', '相手の色に染まりやすく、献身的な愛情で関係を築きます'] 
        },
        C02: { 
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
        C04: { 
            kanji: '月', 
            title: '神秘の月', 
            image: '/the_heart_card.png', 
            traits: ['直感力に優れ、相性占いの結果以上に相手の本質を見抜く力があります', 'ミステリアスな魅力で相手を惹きつけ、離れられない関係を作ります'] 
        },

        // --- New Profiles (Native Japanese "Uranai" Style) ---
        C05: { 
            kanji: '海', 
            title: '深遠なる海', 
            image: '/the_heart_card.png', 
            traits: ['全てを受け入れる広大な包容力を持ち、相手の欠点さえも愛する優しさがあります', '感情の波はありますが、一度愛した相手を裏切らない深い愛情の持ち主です'] 
        },
        C06: { 
            kanji: '風', 
            title: '自由を愛する風', 
            image: '/the_heart_card.png', 
            traits: ['束縛を嫌い、常に新しい風を吹き込むことで、飽きのこない関係を作ります', 'つかみどころのない魅力があり、相手を追いかけさせる恋愛の達人です'] 
        },
        C07: { 
            kanji: '炎', 
            title: '情熱の炎', 
            image: '/the_heart_card.png', 
            traits: ['一度火がつくと止まらない情熱家で、ドラマチックな恋愛を好みます', '嘘や駆け引きを嫌い、ストレートな愛情表現で相手の心を溶かします'] 
        },
        C08: { 
            kanji: '智', 
            title: '叡智の探求者', 
            image: '/the_heart_card.png', 
            traits: ['冷静沈着で知的な会話を好み、精神的な繋がりを何よりも大切にします', 'トラブルが起きても論理的に解決し、パートナーに安心感を与えます'] 
        },
        C09: { 
            kanji: '華', 
            title: '咲き誇る華', 
            image: '/the_heart_card.png', 
            traits: ['そこにいるだけで場が華やぐカリスマ性があり、多くの人から愛される運命です', 'プライドは高めですが、パートナーにだけ見せる甘えん坊な一面が最大の武器です'] 
        },
        C10: { 
            kanji: '地', 
            title: '揺るぎない大地', 
            image: '/the_heart_card.png', 
            traits: ['現実的で堅実な考えを持ち、結婚相手としてこれ以上ない信頼感があります', '派手さはありませんが、時間をかけてゆっくりと、しかし確実に愛を育みます'] 
        },
        C11: { 
            kanji: '癒', 
            title: '聖なる癒し手', 
            image: '/the_heart_card.png', 
            traits: ['相手の疲れや痛みを敏感に察知し、隣にいるだけで相手を癒やす不思議な力があります', '自己犠牲的な一面があり、尽くすことに喜びを感じるタイプです'] 
        },
        C12: { 
            kanji: '剣', 
            title: '高潔な剣', 
            image: '/the_heart_card.png', 
            traits: ['曲がったことが大嫌いな正義感の持ち主で、誠実な関係を築きます', '決断力に優れ、迷うパートナーを力強くリードして未来を切り開きます'] 
        },
        C13: { 
            kanji: '夢', 
            title: '浪漫を追う旅人', 
            image: '/the_heart_card.png', 
            traits: ['常に理想を追い求めるロマンチストで、映画のような恋を演出します', '少年のようにピュアな心を持ち続け、日常の中にワクワクする非日常を作り出します'] 
        },
        C14: { 
            kanji: '鏡', 
            title: '真実の鏡', 
            image: '/the_heart_card.png', 
            traits: ['相手の心を映し出す鏡のように、パートナーの感情に寄り添う共感力があります', '嘘を見抜く力が鋭いため、隠し事のないクリアな信頼関係を求めます'] 
        },
        C15: { 
            kanji: '導', 
            title: '導きの灯火', 
            image: '/the_heart_card.png', 
            traits: ['生まれながらのリーダー気質で、迷えるパートナーを正しい方向へ導きます', '責任感が人一倍強く、「この人を一生守り抜く」という覚悟を持って愛します'] 
        },
        C16: { 
            kanji: '忍', 
            title: '静かなる忍耐', 
            image: '/the_heart_card.png', 
            traits: ['決して感情的にならず、長い時間をかけて相手を理解しようとする忍耐力があります', '口数は少ないですが、その沈黙の中には深い愛情と信頼が詰まっています'] 
        },
        C17: { 
            kanji: '雷', 
            title: '天啓の雷', 
            image: '/the_heart_card.png', 
            traits: ['直感的なインスピレーションで恋に落ちる、「一目惚れ」から始まる運命タイプです', '刺激的な関係を好み、マンネリとは無縁のサプライズに満ちた日々を送ります'] 
        },
        C18: { 
            kanji: '水', 
            title: '清らかな湧き水', 
            image: '/the_heart_card.png', 
            traits: ['どんな器にも形を変える柔軟性があり、パートナーに合わせて自分を変えることができます', '純粋無垢な性格で、汚れない心で相手を一途に愛し続けます'] 
        },
        C19: { 
            kanji: '鋼', 
            title: '不屈の鋼', 
            image: '/the_heart_card.png', 
            traits: ['逆境に立たされるほど燃え上がる強さがあり、困難な恋愛ほど成就させる力があります', '一度決めた約束は絶対に破らない、義理堅い性格の持ち主です'] 
        },
        C20: { 
            kanji: '音', 
            title: '愛を奏でる音', 
            image: '/the_heart_card.png', 
            traits: ['言葉にしなくても気持ちを伝える表現力があり、阿吽の呼吸で通じ合える関係を築きます', '繊細な感性を持ち、パートナーの些細な変化にもすぐに気づくことができます'] 
        },
        C21: { 
            kanji: '翼', 
            title: '飛翔する翼', 
            image: '/the_heart_card.png', 
            traits: ['一つの場所に留まることを良しとせず、パートナーと共に成長し続けることを望みます', 'お互いの自立を尊重し、高め合える「大人の関係」を築くのが得意です'] 
        },
        C22: { 
            kanji: '宝', 
            title: '秘められた宝石', 
            image: '/the_heart_card.png', 
            traits: ['一見控えめですが、知れば知るほど魅力が溢れ出す、スルメのような味わい深さがあります', '自分を安売りせず、本当に信頼できる相手にだけ心の内を見せる慎重派です'] 
        },
        C23: { 
            kanji: '影', 
            title: '支える影', 
            image: '/the_heart_card.png', 
            traits: ['表舞台には立たずとも、裏方としてパートナーを支えることに無上の喜びを感じます', '「縁の下の力持ち」として、家庭や関係の基盤をしっかりと守ります'] 
        },
        C24: { 
            kanji: '虹', 
            title: '奇跡の虹', 
            image: '/the_heart_card.png', 
            traits: ['雨上がりの虹のように、辛いことの後には必ず幸せをもたらす幸運の持ち主です', '多才な魅力を持っており、パートナーを飽きさせない七色の表情を持っています'] 
        }
    };

    // --- 2. STATE (Svelte 5 Runes) ---
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
        // Scroll to top to see animation logic
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        await new Promise((r) => setTimeout(r, 2200)); // Slightly longer for "mystical" feel
        
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
    <title>完全無料・相性占い | 運命の縁結び診断 (2025年版)</title>
    <meta name="description" content="生年月日で占う本格相性診断。恋愛、結婚の相性を完全無料で鑑定します。二人の縁の深さ、性格の相性を今すぐチェック。登録不要・秘密厳守。">
    <meta name="keywords" content="相性占い, 無料, 生年月日, 恋愛, 結婚, 当たる">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600;700;800&family=Zen+Old+Mincho:wght@400;700;900&display=swap" rel="stylesheet">
</svelte:head>

<div class="washi-bg min-h-screen font-zen text-[#333] overflow-x-hidden selection:bg-[#b12b28] selection:text-white">
    <header class="py-14 text-center relative px-4 border-b border-[#333]/5">
        <div class="inline-block border border-[#b12b28] p-[2px] mb-5">
            <h2 class="bg-[#b12b28] text-white px-5 py-1 text-xs tracking-[0.2em] font-zen">
                完全無料・生年月日占い
            </h2>
        </div>
        <h1 class="text-3xl md:text-5xl font-bold font-mincho text-[#b12b28] tracking-tighter mb-6 leading-tight drop-shadow-sm">
            運命の<br class="md:hidden" />相性占い
        </h1>
        <p class="text-[10px] md:text-xs mt-2 text-[#c5a059] font-bold tracking-[0.4em] uppercase">
            Destiny Compatibility Check
        </p>
        <p class="mt-8 text-sm text-gray-600 max-w-lg mx-auto leading-8 font-mincho">
            あなたの恋の行方は？<br class="md:hidden"/>二人の生年月日を入力するだけで、<br/>
            <span class="border-b border-[#c5a059] pb-1">恋愛・結婚の相性</span>を精密に鑑定します。<br/>
            驚くほど当たると評判の診断を、<br class="md:hidden"/>今すぐ無料でお試しください。
        </p>
    </header>

    <main class="max-w-4xl mx-auto p-4 md:p-8">
        
        <section class="mb-24 min-h-[400px]">
            {#if isCalculating}
                <div class="py-32 text-center" in:fade>
                    <div class="relative w-28 h-28 mx-auto mb-8">
                        <div class="absolute inset-0 border-[6px] border-[#b12b28]/10 rounded-full"></div>
                        <div class="absolute inset-0 border-[6px] border-t-[#b12b28] rounded-full animate-spin"></div>
                        <div class="absolute inset-0 flex items-center justify-center font-bold text-[#b12b28] font-mincho text-2xl animate-pulse">縁</div>
                    </div>
                    <p class="font-mincho text-[#b12b28] animate-pulse text-lg tracking-widest">星が重なる音を聴いています...</p>
                    <p class="text-xs text-gray-400 mt-2 tracking-widest">Calculating Destiny...</p>
                </div>
            {:else if !result}
                <div in:fly={{y: 20}}>
                    <div class="grid md:grid-cols-2 gap-12 mt-8 items-center relative">
                        <div class="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-30 pointer-events-none">
                            <svg width="240" height="60" viewBox="0 0 120 40">
                                <path d="M0,20 Q30,0 60,20 T120,20" fill="none" stroke="#b12b28" stroke-width="1.5" stroke-dasharray="4" />
                            </svg>
                        </div>

                        <div class="bg-white/80 backdrop-blur-sm border-t-4 border-b-4 border-[#555] p-8 shadow-xl relative z-10 transition-transform hover:-translate-y-1 duration-500 rounded-sm">
                            <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#555] text-white px-6 py-1 text-xs tracking-widest shadow-md">あなた</div>
                            <label class="block text-center mb-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                Your Birth Date
                                <input type="date" bind:value={uBirth} class="w-full bg-transparent text-center text-3xl border-b border-gray-200 pb-2 outline-none focus:border-[#b12b28] font-mincho transition-colors cursor-pointer mt-4 text-[#333]" />
                            </label>
                        </div>

                        <div class="bg-white/80 backdrop-blur-sm border-t-4 border-b-4 border-[#b12b28] p-8 shadow-xl relative z-10 transition-transform hover:-translate-y-1 duration-500 rounded-sm">
                            <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#b12b28] text-white px-6 py-1 text-xs tracking-widest shadow-md">お相手</div>
                            <label class="block text-center mb-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                Partner's Birth Date
                                <input type="date" bind:value={pBirth} class="w-full bg-transparent text-center text-3xl border-b border-gray-200 pb-2 outline-none focus:border-[#b12b28] font-mincho transition-colors cursor-pointer mt-4 text-[#b12b28]" />
                            </label>
                        </div>
                    </div>

                    <div class="mt-16 text-center">
                        <button onclick={runAppraisal} class="cursor-pointer w-full max-w-md mx-auto group relative inline-flex items-center justify-center px-8 py-5 font-mincho font-bold text-white transition-all duration-200 bg-[#b12b28] font-lg rounded-sm shadow-xl hover:bg-[#8e221f] hover:shadow-2xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b12b28]">
                            <span class="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-linear-to-b from-transparent via-transparent to-black"></span>
                            <span class="relative flex items-center gap-4 text-xl tracking-[0.2em]">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                無料で相性を占う
                            </span>
                        </button>
                        <p class="text-center text-[10px] text-gray-400 mt-6 tracking-wide">
                            <span>※</span> 個人情報は保存されません。安心してお試しください。
                        </p>
                    </div>
                </div>
            {:else}
                <div class="space-y-12" in:fade>
                    <div class="text-center bg-white/95 p-8 md:p-12 border border-[#c5a059]/30 shadow-2xl relative overflow-hidden rounded-sm">
                        <div class="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[#c5a059] via-[#b12b28] to-[#c5a059]"></div>
                        
                        <div class="shuin-stamp mb-8 text-xl">相性診断結果</div>
                        
                        <div class="flex items-center justify-center gap-6 mb-10">
                            <div class="h-1px bg-[#c5a059] flex-1 opacity-40"></div>
                            <div class="text-center">
                                <span class="block text-xs text-gray-400 tracking-widest mb-2">COMPATIBILITY SCORE</span>
                                <h2 class="text-6xl md:text-8xl font-mincho font-bold text-[#b12b28] flex items-baseline leading-none shadow-red-glow">
                                    {result.score * 10}<span class="text-2xl md:text-3xl ml-2 text-[#333] font-zen">%</span>
                                </h2>
                            </div>
                            <div class="h-1px bg-[#c5a059] flex-1 opacity-40"></div>
                        </div>
                        
                        <div class="max-w-xl mx-auto">
                            <h3 class="text-lg md:text-xl font-bold mb-6 font-mincho text-[#333] border-b border-gray-100 pb-4 inline-block">魂の絆とこれからの未来</h3>
                            <p class="text-sm md:text-base leading-8 md:leading-9 text-gray-700 font-zen text-justify">
                                {result.compatibility}
                            </p>
                        </div>
                    </div>

                    <div class="grid md:grid-cols-2 gap-8">
                        {#each [result.user, result.partner] as profile, i}
                            <div class="bg-white p-8 shadow-md border-t-[6px] {i === 0 ? 'border-[#555]' : 'border-[#b12b28]'} relative overflow-hidden group hover:shadow-lg transition-shadow">
                                <div class="absolute -right-4 -bottom-4 text-9xl font-mincho {i === 0 ? 'text-[#333]' : 'text-[#b12b28]'} opacity-[0.03] select-none pointer-events-none group-hover:scale-110 transition-transform duration-700">
                                    {profile.kanji}
                                </div>
                                
                                <div class="relative z-10">
                                    <div class="flex items-center gap-3 mb-5">
                                        <span class="text-[10px] px-3 py-1 text-white tracking-widest font-bold {i === 0 ? 'bg-[#555]' : 'bg-[#b12b28]'}">
                                            {i === 0 ? 'あなた' : 'お相手'}
                                        </span>
                                        <span class="h-1px flex-1 bg-gray-100"></span>
                                    </div>
                                    <h3 class="text-2xl font-bold font-mincho mb-6 text-[#333]">{profile.title}</h3>
                                    <ul class="space-y-4">
                                        {#each profile.traits as trait}
                                            <li class="flex gap-4 items-start text-sm text-gray-600 leading-6 border-b border-dashed border-gray-100 pb-3 last:border-0">
                                                <span class="text-[#c5a059] text-xs mt-1">◆</span> {trait}
                                            </li>
                                        {/each}
                                    </ul>
                                </div>
                            </div>
                        {/each}
                    </div>

                    <div class="text-center pt-12">
                        <button onclick={reset} class="text-[#b12b28] font-bold border-b border-[#b12b28] pb-1 hover:text-[#333] hover:border-[#333] transition-colors text-sm tracking-widest">
                            ← もう一度、別の相手と占う
                        </button>
                    </div>
                </div>
            {/if}
        </section>

        <div class="flex justify-center items-center gap-6 py-12 opacity-30">
            <div class="h-1px w-16 bg-[#333]"></div>
            <div class="text-[#b12b28] font-mincho text-xl">❖</div>
            <div class="h-1px w-16 bg-[#333]"></div>
        </div>

        <section class="py-12 relative">
            <h2 class="text-2xl md:text-3xl font-mincho text-center mb-3 font-bold text-[#333]">
                なぜ当たる？本サイトの相性占い
            </h2>
            <p class="text-center text-[10px] text-[#b12b28] tracking-[0.2em] mb-12 uppercase">About Our Appraisal</p>
            
            <div class="bg-white/60 p-8 md:p-12 border border-[#c5a059]/20 relative shadow-sm">
                <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#b12b28]"></div>
                <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#b12b28]"></div>
                <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#b12b28]"></div>
                <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#b12b28]"></div>

                <div class="flex flex-col md:flex-row gap-10 items-center">
                    <div class="md:w-1/3 text-center">
                        <div class="text-[#b12b28] mb-4 flex justify-center opacity-80">
                            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                        </div>
                        <h3 class="text-lg font-bold mb-2 font-mincho text-[#333]">生年月日の秘密</h3>
                        <p class="text-[10px] text-gray-400 tracking-widest uppercase">The Logic of Fate</p>
                    </div>
                    <div class="md:w-2/3 space-y-5 text-sm leading-8 text-gray-700 font-zen text-justify">
                        <p>
                            <strong class="text-[#b12b28] border-b border-[#b12b28]/30">「相性占い」</strong>で最も重要な要素、それは生年月日です。古来より、人がこの世に生を受けた「日」には、その人の運命や性格、そして魂の性質が刻まれていると言われています。
                        </p>
                        <p>
                            本サイトの縁結び相性診断は、東洋の数秘術と陰陽五行の思想を現代的に再解釈。単なる性格の一致だけでなく、<strong class="bg-[#c5a059]/10 px-1">恋愛相性から結婚生活の傾向まで</strong>、二人の魂がどのように響き合うかを紐解きます。
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-16 max-w-3xl mx-auto">
            <h2 class="text-2xl md:text-3xl font-mincho text-center mb-3 font-bold text-[#333]">よくある質問</h2>
            <p class="text-center text-[10px] text-[#b12b28] tracking-[0.2em] mb-10 uppercase">Q & A</p>

            <div class="space-y-4 bg-white p-6 md:p-8 rounded-sm shadow-sm border-t-4 border-[#333]">
                {#each [
                    { q: 'この相性占いは本当に無料ですか？', a: 'はい、完全無料です。何度占っても料金は一切かかりません。気になるお相手との相性を心ゆくまでご確認ください。' },
                    { q: '入力した生年月日は保存されますか？', a: 'いいえ、保存されません。入力された情報は、お使いのブラウザ内（端末内）でのみ計算に使用され、外部サーバーには一切送信されません。プライバシーは守られていますので、安心してお使いください。' },
                    { q: '相手の生まれた時間がわからなくても占えますか？', a: 'はい、大丈夫です。本サイトの相性占いは生年月日（西暦・月・日）のみを使用するため、生まれた時間は必要ありません。' },
                    { q: '相性の結果が悪かった場合、どうすればいいですか？', a: '相性は「固定」されたものではなく、理解し育てていくものです。診断結果はあくまで現在の二人の性質の組み合わせを示した指針です。違いを理解し、補い合うことで、どのような結果であっても良い関係を築くことは可能です。' }
                ] as faq, i}
                    <div class="border-b border-[#333]/10 last:border-0">
                        <button onclick={() => toggleFaq(i)} class="w-full text-left flex justify-between items-center py-5 hover:text-[#b12b28] transition-colors group cursor-pointer">
                            <span class="font-bold text-sm font-mincho flex items-center text-[#333] group-hover:text-[#b12b28]">
                                <span class="bg-[#333] text-white text-[10px] px-2 py-1 rounded-sm mr-4 group-hover:bg-[#b12b28] transition-colors">Q</span>
                                {faq.q}
                            </span>
                            <span class="text-xl text-[#c5a059] transform transition-transform duration-300 {activeFaq === i ? 'rotate-45' : ''}">+</span>
                        </button>
                        {#if activeFaq === i}
                            <div class="overflow-hidden" transition:slide={{ duration: 300 }}>
                                <div class="pb-6 pl-12 pr-4 text-sm text-gray-600 leading-7 font-zen border-l-2 border-[#f0f0f0] ml-3 mb-2">
                                    {faq.a}
                                </div>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        </section>

        <section class="mt-12 bg-[#333] text-[#fdfcf0] p-8 md:p-12 text-center rounded-sm">
            <h3 class="font-mincho text-sm mb-4 text-[#c5a059] tracking-widest">ご利用上の注意</h3>
            <p class="text-[10px] leading-6 opacity-60 max-w-2xl mx-auto font-zen">
                本サイトが提供する「相性占い」の診断結果は、統計学や数秘術に基づいたエンターテインメント・コンテンツです。
                将来の出来事や実際の相性を100%保証するものではありません。
                人生の重要な選択や決断は、ご自身の責任において行っていただきますようお願いいたします。
            </p>
        </section>

    </main>

    <footer class="mt-8 py-12 text-center text-[10px] tracking-widest text-gray-500 border-t border-[#333]/10 bg-white/50 font-zen">
        <div class="mb-5 space-x-4">
            <a href="/" class="hover:text-[#b12b28] transition-colors">プライバシーポリシー</a>
            <span class="text-gray-300">|</span>
            <a href="/" class="hover:text-[#b12b28] transition-colors">利用規約</a>
            <span class="text-gray-300">|</span>
            <a href="/" class="hover:text-[#b12b28] transition-colors">お問い合わせ</a>
        </div>
        <p>© 2026 AISHO-URANAI.COM | 運命の相性占い</p>
    </footer>
</div>

<style>    
    /* Japanese Traditional Paper Texture */
    .washi-bg {
        background-color: #fdfcf0;
        background-image: url("https://www.transparenttextures.com/patterns/p6.png");
        /* Fallback subtle noise if image fails */
        background-repeat: repeat;
    }

    /* Red Stamp Effect */
    .shuin-stamp {
        border: 3px solid #b12b28;
        color: #b12b28;
        transform: rotate(-3deg);
        display: inline-block;
        padding: 6px 16px;
        font-family: 'Shippori Mincho', serif;
        font-weight: 700;
        letter-spacing: 0.1em;
        border-radius: 4px;
        background: rgba(177, 43, 40, 0.03);
        box-shadow: 0 0 0 1px #fdfcf0 inset;
    }

    /* Font Classes */
    .font-mincho { font-family: 'Shippori Mincho', serif; }
    .font-zen { font-family: 'Zen Old Mincho', serif; }
</style>