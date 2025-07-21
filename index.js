#!/usr/bin/env node

const { DiceParser } = require('./classes/DiceParser');
const { GameEngine } = require('./classes/GameEngine');

function showUsage() {
    console.log("Usage: node index.js dice1 dice2 dice3 ...");
    console.log("Each dice is a comma-separated list of integers, e.g.:");
    console.log("  node index.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3");
    console.log("At least 3 dice required, all must have the same number of faces.");
}

async function main() {
    try {
        const args = process.argv.slice(2);
        if (args.length === 0) {
            showUsage();
            process.exit(1);
        }

        const diceList = DiceParser.parse(args);
        const game = new GameEngine(diceList);
        await game.start();

    } catch (err) {
        console.error("Error:", err.message);
        showUsage();
        process.exit(1);
    }
}

// Graceful termination on Ctrl+C
process.on('SIGINT', () => {
    console.log('\nUser interrupted. Exiting gracefully.');
    process.exit(0);
});

main();
  