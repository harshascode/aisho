<script lang="ts">
    import { fly, fade, slide } from 'svelte/transition';

    // --- 1. DATA TIER ---
    interface Profile {
        id?: string;
        title: string;
        kanji: string;
        traits: string[];
    }

    const PROFILES: Record<string, Profile> = {
        'C46': { kanji: '心', title: '純粋な心 (The Heart)', traits: ['感受性豊かで、愛することに一切の妥協なし','相手の色に染まりやすく、献身的な愛を注ぐ','実は独占欲が強く、寂しがりやな一面も','心の拠り所を見つけると、無敵の強さを発揮'] },
        'C28': { kanji: '陽', title: '天真爛漫な太陽 (The Sun)', traits: ['盛り上げ上手で周囲を明るくする天才','天下無双のバイタリティで突き進む','注目度はピカイチ！華があって目立っちゃう','その一方で実はデリケート。人生ドラマチック'] },
        'C03': { kanji: '結', id: 'C03', title: '不屈の結び目 (The Knot)', traits: ['一度決めたら離さない、驚異の粘り強さ','「安定」こそが最大の幸福と信じている','身内枠に認定したら、徹底的に守り抜く','変化には弱いが、継続させる力は世界一'] },
        'C30': { kanji: '月', title: '神秘の月 (The Moon)', traits: ['直感力に優れ、相手の本音を見抜く名人','ミステリアスな雰囲気で人を惹きつける','気分屋に見えて、実は深い愛の持ち主','夜の静寂の中で、本当の自分を解放する'] },
    };

    // --- 2. STATE ---
    let uBirth = $state('2000-01-01');
    let pBirth = $state('2000-01-02');
    let isCalculating = $state(false);
    let result = $state<any>(null);

    function getCard(date: string) {
        // Simple logic mock
        const sum = date.replace(/\D/g, '').split('').reduce((acc, n) => acc + parseInt(n), 0);
        const keys = Object.keys(PROFILES);
        return PROFILES[keys[sum % keys.length]];
    }

    async function runAppraisal() {
        isCalculating = true;
        // Simulate "Ritual" time
        await new Promise(r => setTimeout(r, 2000));
        
        result = {
            user: getCard(uBirth),
            partner: getCard(pBirth),
            compatibility: "相手の自信に満ちた雰囲気に夢中になりやすい関係。好きだからといって何でも従うのではなく、自分の意見も大切に。",
            score: 7 
        };
        isCalculating = false;
    }

    function reset() {
        result = null;
        isCalculating = false;
    }
</script>

<div class="main-container">
    <div class="bg-pattern"></div>

    <header class="header">
        <div class="logo-mark">縁</div>
        <h1 class="title">縁結び相性診断</h1>
        <p class="subtitle">DESTINY APPRAISAL</p>
    </header>

    <main class="content-area">
        {#if isCalculating}
            <div class="loading-state" in:fade>
                <div class="spinner-knot"></div>
                <p class="animate-pulse text-vermilion mt-4 font-serif">運命を紐解いています...</p>
            </div>

        {:else if !result}
            <div class="input-section" in:fly={{ y: 20, duration: 600 }}>
                <div class="card-couple">
                    <div class="input-card">
                        <div class="icon-stamp user-stamp">私</div>
                        <h2 class="label">あなたの生年月日</h2>
                        <div class="date-wrapper">
                            <input type="date" bind:value={uBirth} class="date-input">
                        </div>
                    </div>

                    <div class="connection-knot">
                        <span class="line"></span>
                        <span class="heart">♥</span>
                        <span class="line"></span>
                    </div>

                    <div class="input-card">
                        <div class="icon-stamp partner-stamp">彼</div>
                        <h2 class="label">相手の生年月日</h2>
                        <div class="date-wrapper">
                            <input type="date" bind:value={pBirth} class="date-input">
                        </div>
                    </div>
                </div>

                <button onclick={runAppraisal} class="cta-button">
                    <span class="btn-text">相性を診断する</span>
                    <span class="btn-shine"></span>
                </button>
            </div>

        {:else}
            <div class="results-section" in:fly={{ y: 50, duration: 800 }}>
                
                <div class="score-card">
                    <div class="score-label">二人の相性</div>
                    <div class="score-display">
                        <span class="score-num">{result.score * 10}</span>
                        <span class="score-unit">%</span>
                    </div>
                    <div class="meter-bar">
                        <div class="fill" style="width: {result.score * 10}%"></div>
                    </div>
                </div>

                <div class="cards-grid">
                    <div class="result-card user-bg">
                        <div class="watermark">{result.user.kanji}</div>
                        <div class="card-header">
                            <span class="role-badge">あなた</span>
                            <div class="birth-display">{uBirth.replace(/-/g, '.')}</div>
                        </div>
                        <h3 class="card-title">{result.user.title}</h3>
                        <ul class="trait-list">
                            {#each result.user.traits as trait}
                                <li>{trait}</li>
                            {/each}
                        </ul>
                    </div>

                    <div class="result-card partner-bg">
                        <div class="watermark">{result.partner.kanji}</div>
                        <div class="card-header">
                            <span class="role-badge">相手</span>
                            <div class="birth-display">{pBirth.replace(/-/g, '.')}</div>
                        </div>
                        <h3 class="card-title">{result.partner.title}</h3>
                        <ul class="trait-list">
                            {#each result.partner.traits as trait}
                                <li>{trait}</li>
                            {/each}
                        </ul>
                    </div>
                </div>

                <div class="advice-scroll">
                    <h3 class="advice-title">天の声</h3>
                    <p class="advice-text">{result.compatibility}</p>
                </div>

                <div class="actions">
                    <div class="share-buttons">
                        <button class="share x">Post</button>
                        <button class="share line">LINE</button>
                    </div>
                    <button onclick={reset} class="retry-btn">もう一度占う</button>
                </div>
            </div>
        {/if}
    </main>

    <footer class="footer">
        © 2026 Enmusubi. All rights reserved.
    </footer>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;700&family=Zen+Kaku+Gothic+New:wght@400;700&display=swap');

    /* --- VARIABLES & BASE --- */
    :global(:root) {
        --c-vermilion: #BC2B33; /* Traditional Shrine Red */
        --c-dark: #2c2c2c;
        --c-gold: #C5A059;
        --c-bg: #F9F8F4; /* Washi Paper White */
        --c-paper: #ffffff;
        --shadow-soft: 0 10px 30px -10px rgba(188, 43, 51, 0.15);
        --shadow-card: 0 4px 12px rgba(0,0,0,0.05);
    }

    :global(body) {
        margin: 0;
        background-color: var(--c-bg);
        color: var(--c-dark);
        font-family: 'Zen Kaku Gothic New', sans-serif;
    }

    .main-container {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        position: relative;
        overflow-x: hidden;
    }

    /* Pattern Overlay */
    .bg-pattern {
        position: absolute;
        inset: 0;
        opacity: 0.4;
        background-image: radial-gradient(var(--c-gold) 1px, transparent 1px);
        background-size: 30px 30px;
        z-index: -1;
        pointer-events: none;
    }

    /* --- HEADER --- */
    .header {
        text-align: center;
        padding: 3rem 1rem 1rem;
    }

    .logo-mark {
        width: 48px;
        height: 48px;
        background: var(--c-vermilion);
        color: white;
        font-family: 'Shippori Mincho', serif;
        font-size: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1rem;
        border-radius: 8px; /* Slightly rounded square */
        transform: rotate(45deg);
        box-shadow: 0 4px 10px rgba(188, 43, 51, 0.3);
    }
    
    .logo-mark::after {
        content: ''; 
        display:block; 
        transform: rotate(-45deg); /* Text straight */
    }

    .title {
        font-family: 'Shippori Mincho', serif;
        font-size: 1.8rem;
        letter-spacing: 0.1em;
        color: var(--c-vermilion);
        margin: 0;
    }

    .subtitle {
        font-size: 0.6rem;
        letter-spacing: 0.4em;
        color: #999;
        margin-top: 0.5rem;
        text-transform: uppercase;
    }

    /* --- MAIN AREA --- */
    .content-area {
        flex: 1;
        max-width: 600px;
        width: 100%;
        margin: 0 auto;
        padding: 1rem 1.5rem 4rem;
        position: relative;
    }

    /* --- INPUT FORM --- */
    .card-couple {
        display: flex;
        flex-direction: column;
        gap: 0;
    }

    @media (min-width: 640px) {
        .card-couple {
            flex-direction: row;
            align-items: center;
            gap: 1rem;
        }
    }

    .input-card {
        background: var(--c-paper);
        border: 1px solid rgba(0,0,0,0.05);
        padding: 2rem;
        border-radius: 2px;
        position: relative;
        flex: 1;
        text-align: center;
        box-shadow: var(--shadow-card);
        transition: transform 0.3s;
    }

    .input-card:focus-within {
        border-color: var(--c-vermilion);
        box-shadow: var(--shadow-soft);
    }

    .icon-stamp {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Shippori Mincho', serif;
        font-size: 0.9rem;
        margin: 0 auto 1rem;
        color: white;
    }
    .user-stamp { background: #333; }
    .partner-stamp { background: var(--c-vermilion); }

    .label {
        font-size: 0.85rem;
        color: #888;
        margin-bottom: 0.5rem;
        font-weight: bold;
    }

    .date-wrapper {
        border-bottom: 2px solid #eee;
        transition: 0.3s;
    }
    .input-card:focus-within .date-wrapper {
        border-bottom-color: var(--c-vermilion);
    }

    .date-input {
        width: 100%;
        border: none;
        padding: 0.5rem;
        text-align: center;
        font-size: 1.1rem;
        font-family: 'Shippori Mincho', serif;
        outline: none;
        background: transparent;
        color: var(--c-dark);
    }

    /* The Knot connector */
    .connection-knot {
        display: flex;
        flex-direction: column; /* Mobile: Vertical */
        align-items: center;
        justify-content: center;
        color: var(--c-vermilion);
        margin: -10px 0;
        z-index: 10;
    }
    @media (min-width: 640px) {
        .connection-knot {
            flex-direction: row; /* Desktop: Horizontal */
            margin: 0 -20px;
        }
    }

    .line {
        width: 2px;
        height: 20px;
        background: #eee;
    }
    @media (min-width: 640px) {
        .line { width: 20px; height: 2px; }
    }
    .heart {
        background: white;
        padding: 0 5px;
        font-size: 1.2rem;
    }

    /* CTA Button */
    .cta-button {
        display: block;
        width: 100%;
        margin-top: 2rem;
        background: var(--c-vermilion);
        color: white;
        border: none;
        padding: 1.2rem;
        font-size: 1rem;
        font-weight: 700;
        letter-spacing: 0.2em;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        border-radius: 4px;
        box-shadow: 0 4px 15px rgba(188, 43, 51, 0.4);
        transition: transform 0.2s;
    }

    .cta-button:active { transform: scale(0.98); }

    /* --- RESULTS --- */
    .score-card {
        text-align: center;
        margin-bottom: 3rem;
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: var(--shadow-card);
    }

    .score-label {
        font-size: 0.9rem;
        color: #888;
        margin-bottom: 0.5rem;
    }
    .score-display {
        color: var(--c-vermilion);
        font-family: 'Shippori Mincho', serif;
        line-height: 1;
    }
    .score-num { font-size: 4rem; font-weight: bold; }
    .score-unit { font-size: 1.5rem; }

    .meter-bar {
        height: 6px;
        background: #eee;
        border-radius: 3px;
        margin-top: 1rem;
        overflow: hidden;
    }
    .fill {
        height: 100%;
        background: linear-gradient(90deg, #FF8E96, var(--c-vermilion));
        border-radius: 3px;
        transition: width 1s ease-out;
    }

    .cards-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
    @media (min-width: 640px) { .cards-grid { grid-template-columns: 1fr 1fr; } }

    .result-card {
        background: white;
        padding: 2rem;
        position: relative;
        overflow: hidden;
        border: 1px solid rgba(0,0,0,0.05);
        box-shadow: var(--shadow-card);
    }
    .result-card::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; height: 4px;
    }
    .user-bg::before { background: #333; }
    .partner-bg::before { background: var(--c-vermilion); }

    .watermark {
        position: absolute;
        top: -10px;
        right: -10px;
        font-family: 'Shippori Mincho', serif;
        font-size: 8rem;
        opacity: 0.05;
        font-weight: bold;
        pointer-events: none;
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    .role-badge {
        font-size: 0.7rem;
        font-weight: bold;
        padding: 2px 8px;
        border-radius: 4px;
        background: #f0f0f0;
        color: #555;
    }
    .birth-display { font-size: 0.8rem; color: #aaa; font-family: 'Inter', sans-serif; }

    .card-title {
        font-family: 'Shippori Mincho', serif;
        font-size: 1.25rem;
        margin: 0 0 1rem 0;
        padding-bottom: 0.5rem;
        border-bottom: 1px dashed #eee;
    }

    .trait-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .trait-list li {
        font-size: 0.85rem;
        line-height: 1.6;
        margin-bottom: 0.5rem;
        padding-left: 1rem;
        position: relative;
    }
    .trait-list li::before {
        content: '•';
        color: var(--c-vermilion);
        position: absolute;
        left: 0;
    }

    .advice-scroll {
        margin-top: 3rem;
        padding: 2rem;
        background-color: #fff;
        background-image: url("https://www.transparenttextures.com/patterns/handmade-paper.png");
        border-left: 4px solid var(--c-vermilion);
        box-shadow: var(--shadow-card);
    }
    .advice-title {
        font-family: 'Shippori Mincho', serif;
        margin: 0 0 0.5rem;
        color: var(--c-vermilion);
    }
    .advice-text {
        font-size: 0.95rem;
        line-height: 1.8;
        color: #444;
    }

    .actions {
        margin-top: 3rem;
        text-align: center;
    }
    .share-buttons {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-bottom: 2rem;
    }
    .share {
        padding: 10px 24px;
        color: white;
        border: none;
        border-radius: 50px;
        font-size: 0.9rem;
        font-weight: bold;
        cursor: pointer;
    }
    .x { background: #000; }
    .line { background: #06C755; }

    .retry-btn {
        background: none;
        border: none;
        color: #999;
        text-decoration: underline;
        font-size: 0.85rem;
        cursor: pointer;
    }

    /* --- LOADING --- */
    .loading-state {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: rgba(255,255,255,0.9);
        z-index: 50;
    }
    .spinner-knot {
        width: 50px;
        height: 50px;
        border: 4px solid #eee;
        border-top-color: var(--c-vermilion);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .footer {
        text-align: center;
        font-size: 0.7rem;
        color: #ccc;
        padding: 2rem;
    }
</style>