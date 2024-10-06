const height = 9;
const width = 9;
const mines = 10;
const field = [];

for (let i = 0; i < height; i++) {
    field.push([]);
    for (let j = 0; j < width; j++) {
        field[i].push({
            isMine: false
        });
    }
}
console.log(field);

let mineIndexes = new Set();
while (mineIndexes.size < mines) {
   mineIndexes.add(Math.floor(Math.random() * (height * width))); 
}
console.log(mineIndexes);

mineIndexes = Array.from(mineIndexes);
for (let i = 0; i < mineIndexes.length; i++) {
    field[Math.floor(mineIndexes[i] / width)][mineIndexes[i] % width].isMine = true;
}
console.log(field);

const container = document.getElementById('container');

container.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
container.style.gridTemplateRows = `repeat(${height}, 1fr)`;

for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        if (field[i][j].isMine) {
            cell.innerHTML = '💣';
        }
        container.appendChild(cell);
    }
}

