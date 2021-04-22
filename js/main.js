//First get all the elements that we need
const gameField = document.querySelector('.tic-tac-toe');
const board = document.querySelector('.board');
const popupElement = document.querySelector('.popup-wrapper');
const popupElementSection = document.querySelector('.popup-continue');
const startButton = document.querySelector('.start-button');
const settings = document.querySelector('.settings');
const boardFieldsInput = document.querySelector('.board-size');
const pOneField = document.querySelector('.player-one');
const pTwoField = document.querySelector('.player-two');
const pOneNamePlace = document.querySelector('.p-one-name');
const pTwoNamePlace = document.querySelector('.p-two-name');
const resetButton = document.querySelector('.reset-game');
const highScoreEl = document.querySelector('.highschore');
const turnEl = document.querySelector('.turn');
const gameTypes = ["bke", "vor"];

//Initialize the sounds
const xSound = new Audio('lib/tic.mp3');
const ySound = new Audio('lib/tac.mp3');
const weSound = new Audio('lib/we2.mp3');

//Define all the changable arrays
let boardVH;
let fields;
let winX;
let winO;
let playerOne;
let playerTwo;
let players;
let gameType;
let curElement = 'X';
let playing = false;
let filledFields = 0;

//Create eventlistner on the selection popup to hide it when clicked
if (popupElementSection) {
    popupElementSection.addEventListener('click', function() {
        settings.classList.remove('hidden');
        gameField.classList.add('hidden');
        popupElement.classList.add('hidden');
        resetGame();
    });
}

//When people click on the start button, start the game
if (startButton) {
    startButton.addEventListener('click', function() {
        chosenGameType = boardFieldsInput.value;
        gameType = "bke";

        if (gameTypes.includes(chosenGameType)) {
            gameType = chosenGameType;
        }

        playerOne = pOneField.value;
        playerTwo = pTwoField.value;
        pOneNamePlace.textContent = playerOne;
        pTwoNamePlace.textContent = playerTwo;

        initBoard()
    });
}

if (resetButton) {
    resetButton.addEventListener('click', resetGame);
}

//Add an item (X or O) to the field. Might be changed later
function addItem(field) {
    let changePlayer = false;
    if (playing) {
        filledFields++;
        if (gameType === 'vor') {
            const colNumber = field.dataset.col_number;
            const sameCols = Array.prototype.slice.call(document.querySelectorAll(`[data-col_number="${colNumber}"]`));
            let lastCol = -2;
            sameCols.forEach(function(el, idx) {
                const filler = el.textContent;
                if (lastCol < 0 && (filler === 'X' || filler === 'O')) {
                    lastCol = idx-1;
                }
            });
            
            if (lastCol === -2) {
                lastCol = sameCols.length-1;
            }

            const searchField = sameCols[lastCol];
            if (searchField.textContent.trim() === '') {
                searchField.textContent = curElement;
                searchField.classList.add(`player_symbol_${curElement}`);
                field = searchField;
                changePlayer = true;
            }
        } else if (field.textContent.trim() == '') {
            field.textContent = curElement;
            field.classList.add(`player_symbol_${curElement}`);
            changePlayer = true;
        }

        if (changePlayer) {
            if (curElement == 'X') {
                ySound.play();
            } else {
                xSound.play();
            }

            curElement = (curElement == 'X') ? 'O' : 'X';
            turnEl.textContent = curElement;
            turnEl.classList.remove('player_symbol_X', 'player_symbol_O');
            turnEl.classList.add(`player_symbol_${curElement}`);
            
            checkStreak(field);
        }
    }
}

function checkStreak(field) {
    //Each field has max 7 other fields to check (never above it)
    const row = parseInt(field.dataset.row_number);
    const col = parseInt(field.dataset.col_number);
    const symbol = field.textContent;
    const neighbours = {
        topleft: [row-1, col-1],
        topright: [row-1, col+1],
        left: [row, col-1],
        right: [row, col+1],
        bottomleft: [row+1, col-1],
        bottom: [row+1, col],
        bottomright: [row+1, col+1],
    }
    
    for (let key in neighbours) {
        const chkRow = neighbours[key][0];
        const chkCol = neighbours[key][1];
        const chkField = document.querySelector(`[data-col_number="${chkCol}"][data-row_number="${chkRow}"]`);
        if (chkField) {
            const chkSymbol = chkField.textContent;
            if (chkSymbol === symbol) {
                let chkFieldsStreak = [];
                console.log(key);
                switch (key) {
                    case 'bottom':
                        chkFieldsStreak = [
                            {row: chkRow+1, col: chkCol},
                            {row: chkRow+2, col: chkCol},
                            {row: chkRow+3, col: chkCol},
                        ];
                    break;
                    case 'bottomleft':
                        chkFieldsStreak = [
                            {row: chkRow+1, col: chkCol-1},
                            {row: chkRow+2, col: chkCol-2},
                            {row: chkRow+3, col: chkCol-3},
                        ];
                    break;
                    case 'bottomright':
                        chkFieldsStreak = [
                            {row: chkRow+1, col: chkCol+1},
                            {row: chkRow+2, col: chkCol+2},
                            {row: chkRow+3, col: chkCol+3},
                        ];
                    break;
                    case 'top':
                        chkFieldsStreak = [
                            {row: chkRow-1, col: chkCol},
                            {row: chkRow-2, col: chkCol},
                            {row: chkRow-3, col: chkCol},
                        ];
                    break;
                    case 'topleft':
                        chkFieldsStreak = [
                            {row: chkRow-1, col: chkCol-1},
                            {row: chkRow-2, col: chkCol-2},
                            {row: chkRow-3, col: chkCol-3},
                        ];
                    break;
                    case 'topright':
                        chkFieldsStreak = [
                            {row: chkRow-1, col: chkCol+1},
                            {row: chkRow-2, col: chkCol+2},
                            {row: chkRow-3, col: chkCol+3},
                        ];
                    break;
                    case 'left':
                        chkFieldsStreak = [
                            {row: chkRow, col: chkCol-1},
                            {row: chkRow, col: chkCol-2},
                            {row: chkRow, col: chkCol-3},
                        ];
                    break;
                    case 'right':
                        chkFieldsStreak = [
                            {row: chkRow, col: chkCol+1},
                            {row: chkRow, col: chkCol+2},
                            {row: chkRow, col: chkCol+3},
                        ];
                    break;
                }

                let currentStreak = 2; //We always have a 2 symbol match...
                chkFieldsStreak.forEach(function(item) {
                    const theRow = item.row;
                    const theCol = item.col;
                    const chkThisField = document.querySelector(`[data-col_number="${theCol}"][data-row_number="${theRow}"]`);

                    console.log(chkThisField);
                    if (chkThisField) {
                        const chkContent = chkThisField.textContent;
                        if (chkContent === symbol) {
                            currentStreak++;
                        }
                    }
                });

                const streakAmount = (gameType === 'vor') ? 4 : 3;
                if (currentStreak === streakAmount) {
                    if (symbol === 'X') {
                        winnerName = playerOne;
                        if (players[playerOne]) {
                            players[playerOne]++;
                        } else {
                            players[playerOne] = 1;
                        }
                    } else {
                        winnerName = playerTwo;
                        if (players[playerTwo]) {
                            players[playerTwo]++;
                        } else {
                            players[playerTwo] = 1;
                        }
                    }
                    playing = false;
                    localStorage.setItem('bke_players', JSON.stringify(players));
                    showPopup('Winner winner', `Chicken Dinner - ${winnerName} has won the game`);
            
                    showHighScore();
                
                //We need something for this...
                } else if ((filledFields === boardVH*boardVH)) {
                    showPopup('Loser loser', 'Chicken Foser');
                    playing = false;
                }
            }
        }
    }
}

//Reset the game and show the start/ settings page again
function resetGame() {
    settings.classList.remove('hidden');
    popupElement.classList.add('hidden');
    gameField.classList.add('hidden');
    
    weSound.pause();
    weSound.currentTime = 0;
    winner = 0;
    playing = true;
}

//Initialize board, create fields
function initBoard() {
    const rowCol = (gameType === "vor") ? 8 : 3;

    board.innerHTML = '';
    board.style = `grid-template-columns: repeat(${rowCol}, 1fr)`;
    winX = '';
    winO = '';
    let rowNr = 0;
    for (let i = 0; i < (rowCol*rowCol); i++) {
        const colNr = (i%rowCol);
        const newField = document.createElement('div');
        if (colNr === 0) {
            rowNr++;
        }

        newField.classList.add('field');
        newField.dataset.col_number = colNr;
        newField.dataset.row_number = rowNr;
        newField.innerHTML = '&nbsp';

        //Create the winning streak
        winX = 'XXX';
        winO = 'OOO';

        if (gameType === "vor") {
            winX = 'XXXX';
            winO = 'OOOO';
        }

        board.appendChild(newField);

        newField.addEventListener('click', function() {
            addItem(this);
        });
    }
    
    boardVH = rowCol;
    playing = true; 
    settings.classList.add('hidden');
    // popupElement.classList.add('hidden');
    gameField.classList.remove('hidden');
}

//Show the popup message with overlay
function showPopup(title, message) {
    popupElement.querySelector('.title').textContent = title;
    popupElement.querySelector('.text').textContent = message;

    if (title.toLowerCase() === 'winner winner') {
        weSound.play();
    }

    popupElement.classList.remove('hidden');
}

function showHighScore() {
    highScoreEl.innerHTML = '';

    for (let key in players) {
        const score = players[key];
        const newEl = document.createElement('div');
        newEl.textContent = `${key} - ${players[key]}`;
        highScoreEl.appendChild(newEl);
    };
}

getPlayers();
function getPlayers() {
    try {
        players = JSON.parse(localStorage.getItem('bke_players'));
    } catch {
        console.log(1235);
        players = { };
    }
    
    if (!players) {
        players = { };
        localStorage.setItem('bke_players', JSON.stringify(players));
    }
}

gameType = 'vor';

initBoard();