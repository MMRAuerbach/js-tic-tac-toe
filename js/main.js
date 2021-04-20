const board = document.querySelector('.tic-tac-toe');
const popupElement = document.querySelector('.popup-wrapper');
const popupElementSection = document.querySelector('.popup');
const boardVH = 2;
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
        curElement = (curElement == 'X') ? 'O' : 'X';
        checkWinner();
    }
}

function checkWinner() {
    let vertSeries = [];
    let series = '';
    let haveWinner = false;
    let filledFields = 0;

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

        if (series === winX || series === winO) {
            popupElement.classList.toggle('hidden');
            haveWinner = true;
        }
    });

    if (!haveWinner) {
        vertSeries.forEach(function(serie) {
            if (serie === winX || serie === winO) {
                popupElement.classList.toggle('hidden');
                haveWinner = true;
            }
        });
    }

    if ((filledFields === boardVH*boardVH) && !haveWinner) {
        popupElement.classList.toggle('hidden');
    }
}

function resetGame() {
    fields.forEach(function(field) {
        field.innerHTML = '&nbsp;';
    });
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

function showPopup(title, message, colour = yellow) {
    popupElement.querySelector('.')
    popupElement.classList.remove('hidden');
}


initBoard(boardVH);

