const axios = require('axios');
const fs = require('fs');
const path = require('path');
const UserAgent = require('user-agents');

// Configuration
const START_CHAPTER = 737;
const END_CHAPTER = 900;
const BASE_URL = "https://freewebnovel.com/novel/lord-of-the-mysteries/chapter-";
const OUTPUT_DIR = './chapters';

/**
 * Generates a random delay between a min and max value (in milliseconds)
 */
const sleep = (min, max) => {
    const ms = Math.floor(Math.random() * (max - min + 1) + min);
    console.log(`Sleeping for ${ms}ms...`);
    return new Promise(resolve => setTimeout(resolve, ms));
};

async function downloadNovel() {
    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

    for (let i = START_CHAPTER; i <= END_CHAPTER; i++) {
        const url = `${BASE_URL}${i}.html`;
        const filePath = path.join(OUTPUT_DIR, `chapter-${i}.html`);

        // 1. Generate a completely random, realistic User-Agent for this specific request
        const userAgent = new UserAgent({ deviceCategory: 'desktop' });
        
        try {
            console.log(`[${i}/${END_CHAPTER}] Fetching: ${url}`);
            
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': userAgent.toString(),
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Referer': 'https://freewebnovel.com/'
                },
                timeout: 10000 // 10 second timeout
            });

            fs.writeFileSync(filePath, response.data);
            console.log(`✅ Saved Chapter ${i}`);

            // 2. Anti-Blocking Measure: Random delay between 2 to 5 seconds
            // This prevents the server from seeing a perfectly rhythmic "hit" every X seconds.
            await sleep(2000, 5000);

        } catch (error) {
            console.error(`❌ Error on Chapter ${i}: ${error.message}`);
            // Wait longer if we hit an error (likely a rate limit)
            await sleep(5000, 10000);
        }
    }
    console.log("Download complete!");
}

downloadNovel();