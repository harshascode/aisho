/**
 * Simple script to run 10,000 outer loops.
 * Each outer loop counts 1-1,000.
 * Includes a 100ms delay between outer loops.
 */

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runCounter() {
    const totalOuterLoops = 1000;
    const innerCountLimit = 1000;

    for (let outer = 1; outer <= totalOuterLoops; outer++) {
        // Inner loop: counting 1 to 1000
        for (let inner = 1; inner <= innerCountLimit; inner++) {
            // Optional: Uncomment the line below if you want to see every single number
            // console.log(`Outer: ${outer}, Inner: ${inner}`);
        }

        // Logging progress every outer loop
        console.log(`Completed Loop: ${outer} of ${totalOuterLoops}`);

        // 100ms delay after every outer loop completion
        await delay(1000);
    }

    console.log("All 1000 loops finished!");
}

runCounter();