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
        boardFieldsInputValue = parseInt(boardFieldsInput.value);
        //Larger then 10x10 will slow down computer
        if (isNaN(boardFieldsInputValue) || boardFieldsInputValue > 10) {
            boardFieldsInputValue = 3;
        }

        playerOne = pOneField.value;
        playerTwo = pTwoField.value;
        pOneNamePlace.textContent = playerOne;
        pTwoNamePlace.textContent = playerTwo;

        initBoard(boardFieldsInputValue)
    });
}

if (resetButton) {
    resetButton.addEventListener('click', resetGame);
}

//Add an item (X or O) to the field. Might be changed later
function addItem(field) {
    if (field.textContent.trim() == '' && playing) {
        field.textContent = curElement;
        if (curElement == 'X') {
            ySound.play();
        } else {
            xSound.play();
        }

        curElement = (curElement == 'X') ? 'O' : 'X';
        turnEl.textContent = curElement;
        field.classList.add(`player_symbol_${curElement}`);
        turnEl.classList.add('player_symbol_X', 'player_symbol_O');
        turnEl.classList.remove(`player_symbol_${curElement}`);

        checkWinner();
    }
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

    //Loop through fields and check horizontal winner
    fields.forEach(function(field, idx) {
        const fieldSymbol = field.textContent;
        const theModulo = (idx%boardVH);

        if (fieldSymbol === 'X' || fieldSymbol === 'O')
            filledFields++;

        if (theModulo === 0)
            series = '';

        if (!vertSeries[theModulo])
            vertSeries[theModulo] = '';

        vertSeries[theModulo] += fieldSymbol;
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
    });

    //Check for vertical winners
    if (!haveWinner) {
        vertSeries.forEach(function(serie) {
            if (serie === winX || serie === winO) {
                winner = 2;
                if (serie === winX) {
                    winner = 1;
                }
                
                haveWinner = true;
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
    popupElement.add('hidden');
    gameField.classList.add('hidden');
    
    weSound.pause();
    weSound.currentTime = 0;
    winner = 0;
    playing = true;
}

//Initialize board, create fields
function initBoard(rowCol) {
    board.innerHTML = '';
    board.style = `grid-template-columns: repeat(${rowCol}, 1fr)`;
    winX = '';
    winO = '';
    for (let i = 0; i < (rowCol*rowCol); i++) {
        board.innerHTML += '<div class="field">&nbsp;</div>';//createElement and appendChild would be better

        if ((i%rowCol) === 0) {
            winX += 'X';
            winO += 'O';
        }
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