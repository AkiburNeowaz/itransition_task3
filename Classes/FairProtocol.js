const prompt = require('prompt-sync')({ sigint: true });
const { FairRandom } = require('./FairRandom');

class FairProtocol {
    constructor(range, promptText) {
        this.range = range;
        this.promptText = promptText;
    }

    /**
     * Executes the fair protocol and returns the result.
     * @returns {number} Result of modular sum (x + y) % range
     */
    run() {
        const fair = new FairRandom(this.range);

        console.log(`${this.promptText} (HMAC=${fair.getHMAC()})`);
        const userVal = this.promptUser();

        if (userVal === null) return null;

        const { computerValue, key, result } = fair.reveal(userVal);

        console.log(`My number is ${computerValue} (KEY=${key}).`);
        console.log(`The fair number generation result is ${computerValue} + ${userVal} = ${result} (mod ${this.range}).`);

        return result;
    }

    promptUser() {
        while (true) {
            console.log(`Add your number modulo ${this.range}.`);
            for (let i = 0; i < this.range; i++) {
                console.log(`${i} - ${i}`);
            }
            console.log('X - exit');
            console.log('? - help');

            const input = prompt('Your selection: ').trim().toUpperCase();

            if (input === 'X') {
                console.log('Exiting...');
                return null;
            }

            if (input === '?') {
                console.log(`Help: Choose a number from 0 to ${this.range - 1} to combine with mine modulo ${this.range}.`);
                continue;
            }

            const number = parseInt(input, 10);
            if (!isNaN(number) && number >= 0 && number < this.range) {
                return number;
            }

            console.log(`Invalid input. Please enter a number from 0 to ${this.range - 1}, "X" to exit, or "?" for help.`);
        }
    }
}

module.exports = { FairProtocol };
