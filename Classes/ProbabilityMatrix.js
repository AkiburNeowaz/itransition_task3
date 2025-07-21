class ProbabilityMatrix {
    constructor(diceList) {
        this.diceList = diceList;
        this.matrix = this.buildMatrix();
    }

    buildMatrix() {
        const size = this.diceList.length;
        const matrix = Array.from({ length: size }, () => Array(size).fill(null));

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                matrix[i][j] = this.calculateProbability(this.diceList[i], this.diceList[j]);
            }
        }

        return matrix;
    }

    calculateProbability(diceA, diceB) {
        let wins = 0;
        const facesA = diceA.values;
        const facesB = diceB.values;
        const total = facesA.length * facesB.length;

        for (let a of facesA) {
            for (let b of facesB) {
                if (a > b) wins++;
            }
        }

        return (wins / total).toFixed(4); // 4 decimal places
    }

    getMatrix() {
        return this.matrix;
    }

    getDiceLabels() {
        return this.diceList.map(d => d.toString());
    }
}

module.exports = { ProbabilityMatrix };
