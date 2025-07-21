class Dice {
    constructor(values) {
        this.values = values;
    }

    faceCount() {
        return this.values.length;
    }

    toString() {
        return this.values.join(',');
    }
}

module.exports = { Dice };
