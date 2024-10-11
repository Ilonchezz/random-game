const height = 9;
const width = 9;
const mines = 10;
const field = [];

for (let i = 0; i < height; i++) {
    field.push([]);
    for (let j = 0; j < width; j++) {
        field[i].push({
            isMine: false,
            minesAround: 0,
            isOpened: false,
            isFlagged: false 
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

container.style.gridTemplateColumns = `repeat(${width}, 30px)`;
container.style.gridTemplateRows = `repeat(${height}, 30px)`;

const getMineCount = (i, j) => {
    if (i < 0 || i >= height) {
        return 0;
    }
    if (j < 0 || j >= width) {
        return 0;
    }
    return field[i][j].isMine ? 1 : 0;
}

const handleClick = (i, j) => {
    if (i < 0 || i >= height) {
        return;
    }
    if (j < 0 || j >= width) {
        return;
    }
    if (field[i][j].isOpened) {
        return;
    }
    if (field[i][j].isFlagged) {
        return;
    }

    field[i][j].isOpened = true;
    if (field[i][j].isMine) {
        return;
    }

    if (field[i][j].minesAround === 0) {
        handleClick(i - 1, j - 1);
        handleClick(i - 1, j);
        handleClick(i - 1, j + 1);
        handleClick(i, j - 1);
        handleClick(i, j + 1);
        handleClick(i + 1, j - 1);
        handleClick(i + 1, j);
        handleClick(i + 1, j + 1);
    } 

}

for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
        field[i][j].minesAround = getMineCount(i - 1, j - 1) + getMineCount(i - 1, j) + getMineCount(i - 1, j + 1) +
          getMineCount(i, j - 1) + getMineCount (i, j + 1) + getMineCount(i + 1, j - 1) + getMineCount(i + 1, j) +
          getMineCount(i + 1, j + 1);
    }
}

const draw = () => {
    container.innerHTML = '';
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (field[i][j].isOpened) {
                if (field[i][j].isMine) {
                    cell.innerHTML = '💣';
                } else if(field[i][j].minesAround > 0) {
                    cell.innerHTML = field[i][j].minesAround.toString();
                }
            } else if (field[i][j].isFlagged) {
                cell.innerHTML = '🚩';
            } else {
                cell.classList.add('closed_cell');
            }
            cell.onclick = () => {
                handleClick(i, j);
                draw();
            } 
            cell.oncontextmenu = (e) => {
                e.preventDefault();
                field[i][j].isFlagged = !field[i][j].isFlagged;
                draw();
            }
            container.appendChild(cell);
        }
    }    
};

draw();
