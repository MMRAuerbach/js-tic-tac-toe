//First get all the elements that we need
const board = document.querySelector('.tic-tac-toe');
const popupElement = document.querySelector('.popup-wrapper');
const popupElementSection = document.querySelector('.popup');
const startButton = document.querySelector('.start-button');
const settings = document.querySelector('.settings');
const boardFieldsInput = document.querySelector('.board-size');
//Initialize the sounds
const xSound = new Audio('lib/tic.mp3');
const ySound = new Audio('lib/tac.mp3');
const weSound = new Audio('lib/we.mp3');

//Define all the changable arrays
let boardVH;
let fields;
let winX;
let winO;
let curElement = 'X';

//Create eventlistner on the selection popup to hide it when clicked
if (popupElementSection) {
    popupElementSection.addEventListener('click', function() {
        popupElement.classList.toggle('hidden');
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

        initBoard(boardFieldsInputValue)
    });
}

//Add an item (X or O) to the field. Might be changed later
function addItem(field) {
    if (field.textContent.trim() == '') {
        field.textContent = curElement;
        if (curElement == 'X') {
            ySound.play();
        } else {
            xSound.play();
        }

        curElement = (curElement == 'X') ? 'O' : 'X';
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
            showPopup('Winner winner', 'Chicken Dinner', 'warning');
            haveWinner = true;
        }
    });

    //Check for vertical winners
    if (!haveWinner) {
        vertSeries.forEach(function(serie) {
            if (serie === winX || serie === winO) {
                showPopup('Winner winner', 'Chicken Dinner', 'warning');
                haveWinner = true;
            }
        });
    }

    //Check for diagonal winners
    if (!haveWinner) {
        if (lrDiag == winX || lrDiag == winO) {
            showPopup('Winner winner', 'Chicken Dinner', 'warning');
            haveWinner = true;
        }
    }

    if (!haveWinner) {
        if (rlDiag == winX || rlDiag == winO) {
            showPopup('Winner winner', 'Chicken Dinner', 'warning');
                haveWinner = true;
        }
    }

    if ((filledFields === boardVH*boardVH) && !haveWinner) {
        showPopup('Loser loser', 'Chicken Foser', 'danger');
    }
}

//Reset the game and show the start/ settings page again
function resetGame() {
    fields.forEach(function(field) {
        field.innerHTML = '&nbsp;';
    });

    settings.classList.toggle('hidden');
    board.classList.toggle('hidden');

    weSound.pause();
    weSound.currentTime = 0;
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
    settings.classList.toggle('hidden');
    board.classList.toggle('hidden');
}

//Show the popup message with overlay
function showPopup(title, message, alert = warning) {
    popupElement.querySelector('.title').textContent = title;
    popupElement.querySelector('.text').textContent = message;
    popupElement.querySelector('.popup').classList.remove('alert-danger','alert-warning');
    popupElement.querySelector('.popup').classList.add(`alert-${alert}`);

    if (alert === 'warning') {
        weSound.play();
    }

    popupElement.classList.remove('hidden');
}