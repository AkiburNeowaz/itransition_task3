const crypto = require('crypto');

class FairRandom {
    constructor(range) {
        if (!Number.isInteger(range) || range <= 0) {
            throw new Error("Range must be a positive integer");
        }

        this.range = range;
        this.key = crypto.randomBytes(32); // 256-bit key
        this.value = FairRandom.secureRandomInt(this.range);
        this.hmac = FairRandom.computeHMAC(this.key, this.value);
    }

    static computeHMAC(key, value) {
        return crypto.createHmac('sha3-256', key)
                     .update(value.toString())
                     .digest('hex')
                     .toUpperCase();
    }

    static secureRandomInt(range) {
        if (range <= 0) throw new Error("Range must be > 0");

        const max = 256;
        const threshold = max - (max % range);
        let byte;
        do {
            byte = crypto.randomBytes(1)[0];
        } while (byte >= threshold);

        return byte % range;
    }

    getHMAC() {
        return this.hmac;
    }

    reveal(userInput) {
        if (!Number.isInteger(userInput) || userInput < 0 || userInput >= this.range) {
            throw new Error(`User input must be an integer in range 0..${this.range - 1}`);
        }

        const result = (this.value + userInput) % this.range;

        return {
            computerValue: this.value,
            key: this.key.toString('hex').toUpperCase(),
            result
        };
    }
}

module.exports = { FairRandom };
