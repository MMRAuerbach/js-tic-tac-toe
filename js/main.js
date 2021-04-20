const board = document.querySelector('.tic-tac-toe');
const popupElement = document.querySelector('.popup-wrapper');
const popupElementSection = document.querySelector('.popup');
const boardVH = 5;
const xSound = new Audio('lib/tic.mp3');
const ySound = new Audio('lib/tac.mp3');
const weSound = new Audio('lib/we.mp3');

let fields;
let winX = '';
let winO = '';
let curElement = 'X';

if (popupElementSection) {
    popupElementSection.addEventListener('click', function() {
        popupElement.classList.toggle('hidden');
        resetGame();
    });
}

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

function checkWinner() {
    const vertSeries = [];
    let lrDiag = '';
    let lrNext = 0;
    let lrCountNext = true;

    let rlNext = (boardVH-1);
    let rlCountNext = true;
    let rlDiag = '';

    let series = '';
    let haveWinner = false;
    let filledFields = 0;

    //Loop through fields and check horizontal winner
    fields.forEach(function(field, idx) {
        const fieldSymbol = field.textContent;
        if (fieldSymbol === 'X' || fieldSymbol === 'O')
            filledFields++;

        if ((idx%boardVH) === 0)
            series = '';

        if (!vertSeries[(idx%boardVH)])
            vertSeries[(idx%boardVH)] = '';

        vertSeries[(idx%boardVH)] += fieldSymbol;
        series += fieldSymbol;

        if (rlNext === (idx%boardVH) && (idx < ((boardVH*boardVH) -1))) {
            rlNext--;
            if (rlNext < 0)
                rlNext = boardVH-1;

            rlDiag += fieldSymbol;
        }

        if (lrNext === (idx%boardVH)) {
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

function resetGame() {
    fields.forEach(function(field) {
        field.innerHTML = '&nbsp;';
    });

    weSound.pause();
    weSound.currentTime = 0;
}

function initBoard(rowCol = 2) {
    board.innerHTML = '';
    board.style = `grid-template-columns: repeat(${rowCol}, 1fr)`;
    winX = '';
    winO = '';
    for (let i = 0; i < (rowCol*rowCol); i++) {
        board.innerHTML += '<div class="field">&nbsp;</div>';

        if ((i%rowCol) === 0) {
            winX += 'X';
            winO += 'O';
        }
    }

    fields = document.querySelectorAll('.field');
    fields.forEach(function(field) {
        field.addEventListener('click', function() {
            addItem(field);
        });
    });
}

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

initBoard(boardVH);