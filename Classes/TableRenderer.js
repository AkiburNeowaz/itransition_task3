const Table = require('cli-table3');

class TableRenderer {
    constructor(probabilityMatrix) {
        this.matrix = probabilityMatrix.getMatrix();
        this.labels = probabilityMatrix.getDiceLabels();
    }

    render() {
        console.log("Probability of the win for the user:");

        const table = new Table({
            head: ['User dice v', ...this.labels],
            colWidths: this.getColumnWidths()
        });

        for (let i = 0; i < this.labels.length; i++) {
            const row = [this.labels[i]];
            for (let j = 0; j < this.labels.length; j++) {
                if (i === j) {
                    row.push('.' + this.matrix[i][j]); // or just '-'
                } else {
                    row.push(this.matrix[i][j]);
                }
            }
            table.push(row);
        }

        console.log(table.toString());
    }

    getColumnWidths() {
        // Dynamically calculate based on max dice string length
        const maxLabelLength = Math.max(...this.labels.map(l => l.length), 12);
        return Array(this.labels.length + 1).fill(maxLabelLength + 2);
    }
}

module.exports = { TableRenderer };
