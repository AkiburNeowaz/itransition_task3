const prompt = require('prompt-sync')({ sigint: true });
const { FairProtocol } = require('./FairProtocol');
const { TableRenderer } = require('./TableRenderer');
const { ProbabilityMatrix } = require('./ProbabilityMatrix');

class GameEngine {
    constructor(diceList) {
        this.diceList = diceList;
    }

    start() {
        console.log("Let's determine who makes the first move.");
        const selector = new FairProtocol(2, "I selected a random value in the range 0..1");
        const result = selector.run();
        if (result === null) return;

        const userStarts = result === 1;
        const [firstPlayer, secondPlayer] = userStarts ? ['You', 'Computer'] : ['Computer', 'You'];
        console.log(`${firstPlayer} make the first move.`);

        const firstChoice = this.selectDice(userStarts);
        if (firstChoice === null) return;

        const secondChoice = this.selectDice(!userStarts, firstChoice);
        if (secondChoice === null) return;

        console.log(`${firstPlayer} chose ${this.diceList[firstChoice].toString()}`);
        console.log(`${secondPlayer} chose ${this.diceList[secondChoice].toString()}`);

        const firstRoll = this.performRoll(this.diceList[firstChoice], `${firstPlayer}'s roll`);
        if (firstRoll === null) return;

        const secondRoll = this.performRoll(this.diceList[secondChoice], `${secondPlayer}'s roll`);
        if (secondRoll === null) return;

        console.log(`${firstPlayer} rolled: ${firstRoll}`);
        console.log(`${secondPlayer} rolled: ${secondRoll}`);

        if (firstRoll === secondRoll) {
            console.log("It's a tie!");
        } else {
            const winner = (firstRoll > secondRoll) ? firstPlayer : secondPlayer;
            console.log(`${winner} win${winner === 'You' ? '' : 's'} (${Math.max(firstRoll, secondRoll)} > ${Math.min(firstRoll, secondRoll)})!`);
        }
    }

    selectDice(isUser, forbiddenIndex = null) {
        while (true) {
            console.log("Choose your dice:");
            this.diceList.forEach((dice, i) => {
                if (i !== forbiddenIndex) {
                    console.log(`${i} - ${dice.toString()}`);
                }
            });
            console.log("X - exit");
            console.log("? - help");

            if (!isUser) {
                const available = this.diceList.map((_, i) => i).filter(i => i !== forbiddenIndex);
                const index = available[Math.floor(Math.random() * available.length)];
                console.log(`Computer chooses dice #${index}`);
                return index;
            }

            const input = prompt('Your selection: ').trim().toUpperCase();
            if (input === 'X') {
                console.log("Exiting...");
                return null;
            }

            if (input === '?') {
                const matrix = new ProbabilityMatrix(this.diceList);
                const table = new TableRenderer(matrix);
                table.render();
                continue;
            }

            const index = parseInt(input, 10);
            if (!isNaN(index) && index >= 0 && index < this.diceList.length && index !== forbiddenIndex) {
                return index;
            }

            console.log("Invalid selection. Try again.");
        }
    }

    performRoll(dice, label) {
        const proto = new FairProtocol(dice.faceCount(), `It's time for ${label}.`);
        const index = proto.run();
        if (index === null) return null;
        return dice.values[index];
    }
}

module.exports = { GameEngine };
