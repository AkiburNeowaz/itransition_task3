const { Dice } = require('./Dice');

class DiceParser {
    /**
     * Parses command-line arguments into Dice objects.
     * @param {string[]} args - List of comma-separated dice strings.
     * @returns {Dice[]} Parsed list of Dice instances.
     * @throws {Error} If validation fails.
     */
    static parse(args) {
        if (!args || args.length < 3) {
            throw new Error("You must specify at least 3 dice.\nExample: node index.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3");
        }

        const diceList = args.map((arg, index) => {
            const values = arg.split(',').map(s => {
                const n = parseInt(s.trim(), 10);
                if (isNaN(n)) {
                    throw new Error(`Invalid integer value in dice #${index}: "${s}"`);
                }
                return n;
            });

            if (values.length === 0) {
                throw new Error(`Dice #${index} is empty.`);
            }

            return new Dice(values);
        });

        const faceCount = diceList[0].faceCount();
        for (let i = 1; i < diceList.length; i++) {
            if (diceList[i].faceCount() !== faceCount) {
                throw new Error("All dice must have the same number of faces.");
            }
        }

        return diceList;
    }
}

module.exports = { DiceParser };
