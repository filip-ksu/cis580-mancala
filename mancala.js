const gameInfo = document.getElementById('game-info');
const board = document.getElementById('board');
const holes = document.getElementsByClassName('hole');
const holes1 = document.getElementById('field-1').children;
const holes2 = document.getElementById('field-2').children;
const goal1 = document.getElementById('goal-1');
const goal2 = document.getElementById('goal-2');
const labels = [
        document.getElementById('field-1-labels'),
        document.getElementById('field-2-labels')];
const labelGoal1 = document.getElementById('goal-1-label');
const labelGoal2 = document.getElementById('goal-2-label');

let player = 0;
let gameEnd = false;

function checkBonus(lastHole, index) {
    if (lastHole.id === 'goal-' + player) {
        changePlayer();
        return;
    }
    if (lastHole.classList.contains('hole')) {
        if (lastHole.parentNode.id === 'field-' + player && lastHole.childElementCount === 1) {
            let goal = player === 1 ? goal1 : goal2;
            let oppositeHole = player === 1 ? holes2[index] : holes1[index];
            goal.appendChild(lastHole.firstChild);
            while (oppositeHole.childElementCount > 0) {
                goal.appendChild(oppositeHole.firstChild);
            }
        }
    }
}

function checkGameEnd() {
    let holes, stones = 0;
    if (player === 1) {
        holes = holes1;
    } else if (player === 2) {
        holes = holes2;
    } else {
        throw 'Invalid player';
    }
    for (let i = 0; i < holes.length; i++) {
        stones += holes[i].childElementCount;
    }
    if (stones === 0) {
        holes = player === 1 ? holes2 : holes1;
        let goal = player === 1 ? goal2 : goal1;
        for (let i = 0; i < holes.length; i++) {
            while (holes[i].childElementCount > 0) {
                goal.appendChild(holes[i].firstChild);
            }
        }
        gameEnd = true;
    }
}

function moveStones(hole, index) {
    let d = player === 1 ? 1 : -1;
    let holes = player === 1 ? holes1 :holes2;
    let stones = hole.children.length;
    let lastHole;
    while (stones > 0) {
        if (index + d < 0 || index + d >= holes.length) {
            if (d === 1) {
                goal1.appendChild(hole.firstChild);
                index = 6;
                holes = holes2;
                d = -1;
                lastHole = goal1;
            } else if (d === -1) {
                goal2.appendChild(hole.firstChild);
                index = -1;
                holes = holes1;
                d = 1;
                lastHole = goal2;
            }
        } else {
            index += d;
            holes[index].appendChild(hole.firstChild);
            lastHole = undefined;
        }
        stones--;
    }
    checkBonus(lastHole ? lastHole : holes[index], index);
}

function updateLabels() {
    for (let i = 0; i < labels[0].childElementCount; i++) {
        labels[0].children[i].innerHTML = holes1[i].childElementCount;
        labels[1].children[i].innerHTML = holes2[i].childElementCount;
    }
    labelGoal1.innerHTML = goal1.childElementCount;
    labelGoal2.innerHTML = goal2.childElementCount;
    let gameInfoText;
    if (gameEnd) {
        gameInfoText = goal1.childElementCount > goal2.childElementCount ? 'Player #1 wins' : goal1.childElementCount < goal2.childElementCount ? 'Player #2 wins' : 'It is a draw';
    } else {
        gameInfoText = 'Player\'s #' + player + ' turn';
    }
    gameInfo.firstChild.innerHTML = gameInfoText;
}

function changePlayer() {
    if (player === 1) {
        board.classList.remove('player-' + player);
        player = 2;
    } else if (player === 2) {
        board.classList.remove('player-' + player);
        player = 1;
    } else {
        player = 1;
        board.classList.add('game');
        let turnInfo = document.createElement('p');
        gameInfo.innerHTML = '';
        gameInfo.appendChild(turnInfo);
        gameInfo.classList.add('game');
    }
    if (!gameEnd) {
        board.classList.add('player-' + player);
    } else {
        player = 0;
    }
}

function holeClickHandler(event) {
    let hole = event.currentTarget;
    let holesParent = hole.parentNode;
    let holesParentsChildren = holesParent.children;
    let index = -1;
    if (holesParent.id !== 'field-' + player || hole.childElementCount === 0 || gameEnd) {
        return;
    }
    for (let i = 0; i < holesParentsChildren.length; i++) {
        if (holesParentsChildren[i] === hole) {
            index = i;
            break;
        }
    }
    if (index === -1) {
        console.log('Index: ' + index);
        throw 'Invalid click event';
    }

    moveStones(hole, index);
    checkGameEnd();
    changePlayer();
    updateLabels();
}

function initGame() {
    labels[0].innerHTML = '';
    labels[1].innerHTML = '';
    goal1.innerHTML = '';

    for (let i = 0; i < holes.length; i++) {
        holes[i].innerHTML = '';
        for (let j = 0; j < 4; j++) {
            let stone = document.createElement('div');
            let translateX, translateY, sqrt;
            do {
                translateX = Math.round(Math.random() * 540) - 270;
                translateY = Math.round(Math.random() * 540) - 270;
                sqrt = Math.round(Math.sqrt(translateX * translateX + translateY * translateY));
            } while (sqrt > 270);
            stone.classList.add('stone');
            stone.style = "transform: translate(" + translateX + "%, " + translateY + "%);";
            holes[i].appendChild(stone);
        }
        let label = document.createElement('span');
        labels[i % labels.length].appendChild(label);
        holes[i].addEventListener('click', holeClickHandler);
    }

    gameEnd = false;
    changePlayer();
    updateLabels();
}

document.getElementById('btn-new-game').addEventListener('click', function (event) {
    let newGame = true;
    if (player !== 0) {
        newGame = confirm('Do you really want to start a new game?');
    }
    if (newGame) {
        player = 0;
        initGame();
    }
});
