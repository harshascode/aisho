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
		C46: {
			kanji: '心',
			title: '純粋な心 (The Heart)',
			traits: [
				'感受性豊かで、愛することに一切の妥協なし',
				'相手の色に染まりやすく、献身的な愛を注ぐ',
				'実は独占欲が強く、寂しがりやな一面も',
				'心の拠り所を見つけると、無敵の強さを発揮'
			]
		},
		C28: {
			kanji: '陽',
			title: '天真爛漫な太陽 (The Sun)',
			traits: [
				'盛り上げ上手で周囲を明るくする天才',
				'天下無双のバイタリティで突き進む',
				'注目度はピカイチ！華があって目立っちゃう',
				'その一方で実はデリケート。人生ドラマチック'
			]
		},
		C03: {
			kanji: '結',
			id: 'C03',
			title: '不屈の結び目 (The Knot)',
			traits: [
				'一度決めたら離さない、驚異の粘り強さ',
				'「安定」こそが最大の幸福と信じている',
				'身内枠に認定したら、徹底的に守り抜く',
				'変化には弱いが、継続させる力は世界一'
			]
		},
		C30: {
			kanji: '月',
			title: '神秘の月 (The Moon)',
			traits: [
				'直感力に優れ、相手の本音を見抜く名人',
				'ミステリアスな雰囲気で人を惹きつける',
				'気分屋に見えて、実は深い愛の持ち主',
				'夜の静寂の中で、本当の自分を解放する'
			]
		}
	};

	// --- 2. STATE ---
	let uBirth = $state('2000-01-01');
	let pBirth = $state('2000-01-02');
	let isCalculating = $state(false);
	let result = $state<any>(null);

	function getCard(date: string) {
		// Simple logic mock
		const sum = date
			.replace(/\D/g, '')
			.split('')
			.reduce((acc, n) => acc + parseInt(n), 0);
		const keys = Object.keys(PROFILES);
		return PROFILES[keys[sum % keys.length]];
	}

	async function runAppraisal() {
		isCalculating = true;
		// Simulate "Ritual" time
		await new Promise((r) => setTimeout(r, 2000));

		result = {
			user: getCard(uBirth),
			partner: getCard(pBirth),
			compatibility:
				'相手の自信に満ちた雰囲気に夢中になりやすい関係。好きだからといって何でも従うのではなく、自分の意見も大切に。',
			score: 7
		};
		isCalculating = false;
	}

	function reset() {
		result = null;
		isCalculating = false;
	}
</script>

<div
	class="relative flex min-h-screen flex-col overflow-x-hidden bg-bg font-['Zen_Kaku_Gothic_New',sans-serif] text-dark"
>
	<div
		class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--color-gold)_1px,transparent_1px)] bg-size-[30px_30px] opacity-40"
	></div>
	<nav class="bg-vermilion p-4 shadow-md">
		<div class="mx-auto flex max-w-6xl items-center justify-between">
			<div class="text-white font-['Shippori_Mincho',serif] text-lg font-bold">Enmusubi</div>
			<ul class="hidden md:flex space-x-6">
				<li><a href="#" class="text-white hover:text-gold transition-colors">Home</a></li>
				<li><a href="#" class="text-white hover:text-gold transition-colors">About</a></li>
				<li><a href="#" class="text-white hover:text-gold transition-colors">Contact</a></li>
			</ul>
			<div class="md:hidden">
				<button class="text-white focus:outline-none">
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
					</svg>
				</button>
			</div>
		</div>
	</nav>
	<header class="px-4 pt-12 pb-4 text-center">
		<div
			class="mx-auto mb-4 flex h-12 w-12 rotate-45 items-center justify-center rounded-lg bg-vermilion font-['Shippori_Mincho',serif] text-xl text-white shadow-lg shadow-vermilion/30"
		>
			縁
		</div>
		<h1 class="m-0 font-['Shippori_Mincho',serif] text-xl tracking-wider text-vermilion">
			縁結び相性診断
		</h1>
		<p class="mt-2 text-xs tracking-widest text-gray-500 uppercase">DESTINY APPRAISAL</p>
	</header>

	<main class="relative mx-auto w-full max-w-3xl flex-1 p-4 pb-16">
		{#if isCalculating}
			<div
				class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/90"
				in:fade
			>
				<div
					class="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-vermilion"
				></div>
				<p class="mt-4 animate-pulse font-['Shippori_Mincho',serif] text-vermilion">
					運命を紐解いています...
				</p>
			</div>
		{:else if !result}
			<div class="input-section" in:fly={{ y: 20, duration: 600 }}>
				<div class="card-couple flex flex-col gap-0 md:flex-row md:items-center md:gap-4">
					<div
						class="input-card relative flex-1 rounded-none border border-gray-50 bg-paper p-8 text-center shadow-card transition-transform focus-within:border-vermilion focus-within:shadow-soft"
					>
						<div
							class="icon-stamp user-stamp mx-auto mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 font-['Shippori_Mincho',serif] text-sm text-white"
						>
							私
						</div>
						<h2 class="label mb-2 text-sm font-bold text-gray-500">あなたの生年月日</h2>
						<div
							class="date-wrapper border-b-2 border-gray-300 transition-all focus-within:border-vermilion"
						>
							<input
								type="date"
								bind:value={uBirth}
								class="date-input w-full border-none bg-transparent p-2 text-center font-['Shippori_Mincho',serif] text-lg text-dark outline-none"
							/>
						</div>
					</div>

					<div
						class="connection-knot z-10 -my-2.5 flex flex-col items-center justify-center text-vermilion md:-mx-5 md:flex-row"
					>
						<span class="line h-5 w-0.5 bg-gray-300 md:h-0.5 md:w-5"></span>
						<span class="heart bg-white px-1.5 text-lg">♥</span>
						<span class="line h-5 w-0.5 bg-gray-300 md:h-0.5 md:w-5"></span>
					</div>

					<div
						class="input-card relative flex-1 rounded-none border border-gray-50 bg-paper p-8 text-center shadow-card transition-transform focus-within:border-vermilion focus-within:shadow-soft"
					>
						<div
							class="icon-stamp partner-stamp mx-auto mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-vermilion font-['Shippori_Mincho',serif] text-sm text-white"
						>
							彼
						</div>
						<h2 class="label mb-2 text-sm font-bold text-gray-500">相手の生年月日</h2>
						<div
							class="date-wrapper border-b-2 border-gray-300 transition-all focus-within:border-vermilion"
						>
							<input
								type="date"
								bind:value={pBirth}
								class="date-input w-full border-none bg-transparent p-2 text-center font-['Shippori_Mincho',serif] text-lg text-dark outline-none"
							/>
						</div>
					</div>
				</div>

				<button
					onclick={runAppraisal}
					class="relative mt-8 block w-full cursor-pointer overflow-hidden rounded-md border-none bg-vermilion p-6 text-base font-bold tracking-wider text-white shadow-lg shadow-vermilion/40 transition-transform active:scale-95"
				>
					<span class="btn-text">相性を診断する</span>
					<span class="btn-shine"></span>
				</button>
			</div>
		{:else}
			<div class="results-section" in:fly={{ y: 50, duration: 800 }}>
				<div class="score-card mb-12 rounded-xl bg-white p-8 text-center shadow-card">
					<div class="score-label mb-2 text-sm text-gray-500">二人の相性</div>
					<div class="score-display font-['Shippori_Mincho',serif] leading-none text-vermilion">
						<span class="score-num text-6xl font-bold">{result.score * 10}</span>
						<span class="score-unit text-xl">%</span>
					</div>
					<div class="meter-bar mt-4 h-1.5 overflow-hidden rounded bg-gray-300">
						<div
							class="fill h-full rounded bg-linear-to-r from-pink-300 to-vermilion transition-all duration-1000 ease-out"
							style="width: {result.score * 10}%"
						></div>
					</div>
				</div>

				<div class="cards-grid grid grid-cols-1 gap-6 md:grid-cols-2">
					<div
						class="result-card user-bg relative overflow-hidden border border-gray-50 bg-white p-8 shadow-card before:absolute before:top-0 before:right-0 before:left-0 before:h-1 before:bg-gray-800"
					>
						<div
							class="watermark pointer-events-none absolute -top-2.5 -right-2.5 font-['Shippori_Mincho',serif] text-8xl font-bold opacity-5"
						>
							{result.user.kanji}
						</div>
						<div class="card-header mb-4 flex items-center justify-between">
							<span
								class="role-badge rounded bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-600"
								>あなた</span
							>
							<div class="birth-display font-['Inter',sans-serif] text-sm text-gray-400">
								{uBirth.replace(/-/g, '.')}
							</div>
						</div>
						<h3
							class="card-title m-0 border-b border-dashed border-gray-300 pb-2 font-['Shippori_Mincho',serif] text-xl"
						>
							{result.user.title}
						</h3>
						<ul class="trait-list m-0 list-none p-0">
							{#each result.user.traits as trait}
								<li
									class="relative mb-2 pl-4 text-sm leading-relaxed before:absolute before:left-0 before:text-vermilion before:content-['•']"
								>
									{trait}
								</li>
							{/each}
						</ul>
					</div>

					<div
						class="result-card partner-bg relative overflow-hidden border border-gray-50 bg-white p-8 shadow-card before:absolute before:top-0 before:right-0 before:left-0 before:h-1 before:bg-vermilion"
					>
						<div
							class="watermark pointer-events-none absolute -top-2.5 -right-2.5 font-['Shippori_Mincho',serif] text-8xl font-bold opacity-5"
						>
							{result.partner.kanji}
						</div>
						<div class="card-header mb-4 flex items-center justify-between">
							<span
								class="role-badge rounded bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-600"
								>相手</span
							>
							<div class="birth-display font-['Inter',sans-serif] text-sm text-gray-400">
								{pBirth.replace(/-/g, '.')}
							</div>
						</div>
						<h3
							class="card-title m-0 border-b border-dashed border-gray-300 pb-2 font-['Shippori_Mincho',serif] text-xl"
						>
							{result.partner.title}
						</h3>
						<ul class="trait-list m-0 list-none p-0">
							{#each result.partner.traits as trait}
								<li
									class="relative mb-2 pl-4 text-sm leading-relaxed before:absolute before:left-0 before:text-vermilion before:content-['•']"
								>
									{trait}
								</li>
							{/each}
						</ul>
					</div>
				</div>

				<div
					class="advice-scroll mt-12 border-l-4 border-vermilion bg-white bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] p-8 shadow-card"
				>
					<h3 class="advice-title m-0 mb-2 font-['Shippori_Mincho',serif] text-vermilion">
						天の声
					</h3>
					<p class="advice-text text-base leading-relaxed text-gray-600">{result.compatibility}</p>
				</div>

				<div class="actions mt-12 text-center">
					<div class="share-buttons mb-8 flex justify-center gap-2.5">
						<button
							class="share x cursor-pointer rounded-full border-none bg-black px-6 py-2.5 text-sm font-bold text-white"
							>Post</button
						>
						<button
							class="share line cursor-pointer rounded-full border-none bg-green-500 px-6 py-2.5 text-sm font-bold text-white"
							>LINE</button
						>
					</div>
					<button
						onclick={reset}
						class="retry-btn cursor-pointer border-none bg-none text-sm text-gray-500 underline"
						>もう一度占う</button
					>
				</div>
			</div>
		{/if}
	</main>

	<footer class="py-8 text-center text-xs text-gray-400">
		© 2026 Enmusubi. All rights reserved.
	</footer>
</div>