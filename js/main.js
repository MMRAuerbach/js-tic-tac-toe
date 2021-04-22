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
    if (field.textContent.trim() == '' && playing) {
        if (gameType === 'vor') {
            const rowNumber = field.dataset.row_number;
            const sameRows = Array.prototype.slice.call(document.querySelectorAll(`[data-row_number="${rowNumber}"]`));
            let lastRow = -2;
            sameRows.forEach(function(el, idx) {
                const filler = el.textContent;
                if (lastRow < 0 && (filler === 'X' || filler === 'O')) {
                    lastRow = idx-1;
                }
            });
            
            if (lastRow === -2) {
                lastRow = sameRows.length-1;
            }

            const searchField = sameRows[lastRow];
            searchField.textContent = curElement;
            searchField.classList.add(`player_symbol_${curElement}`);
        } else {
            field.textContent = curElement;
            field.classList.add(`player_symbol_${curElement}`);
        }

        if (curElement == 'X') {
            ySound.play();
        } else {
            xSound.play();
        }

        curElement = (curElement == 'X') ? 'O' : 'X';
        turnEl.textContent = curElement;
        turnEl.classList.add('player_symbol_X', 'player_symbol_O');
        turnEl.classList.remove(`player_symbol_${curElement}`);
    }

    checkWinner();
}

//Check if someone won or if there is a draw. 
function checkWinner() {
    const vertSeries = [];

    let lrDiag = '';
    let lrNext = 0;
    let lrCountNext = true;
    let rlNext = (boardVH-1);
    let rlDiag = '';
    let series = '';
    let haveWinner = false;
    let filledFields = 0;
    let winner;
    let winnerName;

    //We need to loop through the fields but in reverse order...
    const loopFields = Array.prototype.slice.call(fields).reverse();
    //Loop through fields and check horizontal winner
    loopFields.forEach(function(field, idx) {
        if (field.textContent === 'X' || field.textContent === 'O') {
            const fieldSymbol = field.textContent;
            const theModulo = (idx%boardVH);
            let previousSymbol;

            if (!vertSeries[theModulo])
                vertSeries[theModulo] = '';

            filledFields++;

            if (theModulo === 0 || previousSymbol !== fieldSymbol)
                series = '';

            const lastSymbol = vertSeries[theModulo][vertSeries[theModulo].length-1];

            if (lastSymbol === fieldSymbol) {
                vertSeries[theModulo] += fieldSymbol;
            } else {
                console.log('12345' + fieldSymbol);
                vertSeries[theModulo] = fieldSymbol;
            }
            
            series += fieldSymbol;

            if (rlNext === theModulo && (idx < ((boardVH*boardVH) -1))) {
                rlNext--;
                if (rlNext < 0)
                    rlNext = boardVH-1;

                rlDiag += fieldSymbol;
            }

            if (lrNext === theModulo) {
                if (lrCountNext) {
                    lrDiag += fieldSymbol;
                    lrNext++;
                    lrCountNext = false;
                } else {
                    lrCountNext = true;
                }
            }

            if (series === winX || series === winO) {
                winner = 2;
                if (series === winX) {
                    winner = 1;
                }
                
                haveWinner = true;
            }

            previousSymbol = fieldSymbol;
        }
    });

    //Check for vertical winners
    if (!haveWinner) {
        vertSeries.forEach(function(serie) {
            if (serie.length === winX.length) {
                console.log(serie);
                if (serie.trim() === winX || serie.trim() === winO) {
                    winner = 2;
                    if (serie.trim() === winX) {
                        winner = 1;
                    }
                    
                    haveWinner = true;
                }
            }
        });
    }

    //Check for diagonal winners
    if (!haveWinner) {
        if (lrDiag == winX || lrDiag == winO) {
            winner = 2;
            if (lrDiag === winX) {
                winner = 1;
            }

            haveWinner = true;
        }
    }

    if (!haveWinner) {
        if (rlDiag == winX || rlDiag == winO) {
            winner = 2;
            if (rlDiag === winX) {
                winner = 1;
            }

            haveWinner = true;
        }
    }

    if (haveWinner) {
        if (winner == 1) {
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
    } else if ((filledFields === boardVH*boardVH)) {
        showPopup('Loser loser', 'Chicken Foser');
        playing = false;
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
    for (let i = 0; i < (rowCol*rowCol); i++) {
        const newField = document.createElement('div');
        newField.classList.add('field');
        newField.dataset.row_number = (i%rowCol);
        newField.innerHTML = '&nbsp';

        //Create the winning streak
        winX = 'XXX';
        winO = 'OOO';

        if (gameType === "vor") {
            winX = 'XXXX';
            winO = 'OOOO';
        }

        board.appendChild(newField);
    }
    

    //Add event handler on the fields
    fields = document.querySelectorAll('.field');
    fields.forEach(function(field) {
        field.addEventListener('click', function() {
            addItem(field);
        });
    });

    boardVH = rowCol;
    playing = true; 
    settings.classList.add('hidden');
    popupElement.classList.add('hidden');
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