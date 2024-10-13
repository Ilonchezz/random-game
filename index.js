let settings = {
  height: 8,
  width: 8,
  mines: 10
};

let openedCells = 0;
 
let field = [];
let isFieldLocked = false;
const container = document.getElementById('container');
const settingsBtn = document.getElementById('settings-btn');
const closePopupBtn = document.getElementById('close-popup');
const settingsPopup = document.getElementById('settings-popup');
const newGame = document.getElementById('new-game-btn');
const result = document.getElementById('result-popup');
const resultText = document.getElementById('result-popup-text');
const resultBtn = document.getElementById('result-popup-btn');



newGame.addEventListener('click', () => {
    initialize();
    draw();
});

settingsBtn.addEventListener('click', () => {
    settingsPopup.classList.remove('hidden');
});

closePopupBtn.addEventListener('click', () => {
    settingsPopup.classList.add('hidden');
});

resultBtn.addEventListener('click', () => {
    result.classList.add('hidden');
    initialize();
    draw();
});

document.getElementById('save-settings').addEventListener('click', () => {
    const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked').value;
    
    if (selectedDifficulty === 'beginner') {
        settings = {
            height: 8,
            width: 8,
            mines: 10
        };
    } else if (selectedDifficulty === 'intermediate') {
        settings = {
            height: 16,
            width: 16,
            mines: 40
        };
    } else if (selectedDifficulty === 'expert') {
        settings = {
            height: 16,
            width: 30,
            mines: 99
        };
    }
    
    settingsPopup.classList.add('hidden');
    initialize();
    draw();
});

const initialize = () => {
    openedCells = 0;
    field = [];
    isFieldLocked = false;
    for (let i = 0; i < settings.height; i++) {
        field.push([]);
        for (let j = 0; j < settings.width; j++) {
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
    while (mineIndexes.size < settings.mines) {
       mineIndexes.add(Math.floor(Math.random() * (settings.height * settings.width))); 
    }
    console.log(mineIndexes);
    
    mineIndexes = Array.from(mineIndexes);
    for (let i = 0; i < mineIndexes.length; i++) {
        field[Math.floor(mineIndexes[i] / settings.width)][mineIndexes[i] % settings.width].isMine = true;
    }
    console.log(field);

    container.style.gridTemplateColumns = `repeat(${settings.width}, 30px)`;
    container.style.gridTemplateRows = `repeat(${settings.height}, 30px)`;

    const getMineCount = (i, j) => {
        if (i < 0 || i >= settings.height) {
            return 0;
        }
        if (j < 0 || j >= settings.width) {
            return 0;
        }
        return field[i][j].isMine ? 1 : 0;
    }

    for (let i = 0; i < settings.height; i++) {
        for (let j = 0; j < settings.width; j++) {
            field[i][j].minesAround = getMineCount(i - 1, j - 1) + getMineCount(i - 1, j) + getMineCount(i - 1, j + 1) +
              getMineCount(i, j - 1) + getMineCount (i, j + 1) + getMineCount(i + 1, j - 1) + getMineCount(i + 1, j) +
              getMineCount(i + 1, j + 1);
        }
    }
}

const handleClick = (i, j) => {
    if (i < 0 || i >= settings.height) {
        return;
    }
    if (j < 0 || j >= settings.width) {
        return;
    }
    if (field[i][j].isOpened) {
        return;
    }
    if (field[i][j].isFlagged) {
        return;
    }

    field[i][j].isOpened = true;
    openedCells++;
    if (field[i][j].isMine) {
        isFieldLocked = true;
        for (let a = 0; a < settings.height; a++) {
            for (let b = 0; b < settings.width; b++) {
                if (field[a][b].isMine) {
                    field[a][b].isOpened = true;
                }
            }
        }
        resultText.innerHTML = '😵Looser!😵';
        result.classList.remove('hidden');
        return;
    }

    if (openedCells === settings.height * settings.width - settings.mines) {
        resultText.innerHTML = '🎉Winner!🎉';
        result.classList.remove('hidden');
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



const draw = () => {
    container.innerHTML = '';
    for (let i = 0; i < settings.height; i++) {
        for (let j = 0; j < settings.width; j++) {
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
                cell.classList.add('closed_cell')
            } else {
                cell.classList.add('closed_cell');
            }
            cell.onclick = () => {
                if (isFieldLocked) {
                    return;
                }
                handleClick(i, j);
                draw();
            } 
            cell.oncontextmenu = (e) => {
                e.preventDefault();
                if (isFieldLocked) {
                    return;
                }
                field[i][j].isFlagged = !field[i][j].isFlagged;
                draw();
            }
            container.appendChild(cell);
        }
    }    
};
initialize();
draw();

   