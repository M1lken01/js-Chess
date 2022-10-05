const empty = ' ';
const pieces = ['♚', '♛', '♜', '♝', '♞', '♟︎'];
//['♔', '♕', '♖', '♗', '♘', '♙'],
const setup = [
    [2, 4, 3, 1, 0, 3, 4, 2],
    [5, 5, 5, 5, 5, 5, 5, 5]
];
const players = ['wp', 'bp'];

var next = 0;
var game = 0;
var clearIds = [];
var bombIds = [];
var placedBombs = 0;
var placedFlags = 0;

document.addEventListener("contextmenu", function(e) {
    if (e.originalTarget.localName == 'td') {
        e.preventDefault();
        if (e.target.attributes.class.value.includes('hidden')) {
            flag(e.target.attributes.id.value);
        }
    }
}, false);

function playerMove(id) {
    if (document.getElementById(id).classList.contains('selectable')) {
        if (document.getElementById(id).classList.contains('selectable') && document.getElementById(id).classList.contains('selected')) {
            deselect(id);
        } else {
            document.getElementById(id).classList.add('selected')
            while (document.getElementsByClassName('selectable').length > 0) {
                document.getElementsByClassName('selectable')[0].classList.remove('selectable');
            }
            document.getElementById(id).classList.add('selectable');
            calcMoves(id);
        }
    }
    if (document.getElementById(id).classList.contains('move')) {
        if (next == 0) {
            next = 1;
        } else {
            next = 0;
        }
        move(document.getElementsByClassName('selected')[0].id, id)
    }
}

function deselect(id) {
    document.getElementById(id).classList.remove('selected');
    while (document.getElementsByClassName('move').length > 0) {
        document.getElementsByClassName('move')[0].classList.remove('move');
    }
    while (document.getElementsByClassName('selectable').length > 0) {
        document.getElementsByClassName('selectable')[0].classList.remove('selectable');
    }
    while (document.getElementsByClassName('hit').length > 0) {
        document.getElementsByClassName('hit')[0].classList.remove('hit');
    }
    for (let i = 0; i < document.getElementsByClassName(players[next]).length; i++) {
        document.getElementsByClassName(players[next])[i].classList.add('selectable');
    }
}

function move(from, to) {
    o = document.getElementById(from);
    n = document.getElementById(to);
    if (o.classList.contains('bp')) {
        n.classList.add('bp');
        n.classList.remove('wp');
        o.classList.remove('bp');
    }
    if (o.classList.contains('wp')) {
        n.classList.add('wp');
        n.classList.remove('bp');
        o.classList.remove('wp');
    }
    n.innerHTML = o.innerHTML;
    o.classList.remove('selected');
    o.classList.remove('selectable');
    o.classList.remove('hit');
    n.classList.remove('move');
    o.innerHTML = empty;
    deselect(to);
}

function calcMoves(id) {
    while (document.getElementsByClassName('move').length > 0) {
        document.getElementsByClassName('move')[0].classList.remove('move');
    }
    var x = parseInt(id.split('.')[1]);
    var y = parseInt(id.split('.')[0]);
    let xoff = x;
    let yoff = y;
    switch (document.getElementById(id).innerHTML) {
        case pieces[0]:
            calcMove(y, x, +0, +1, -1, +0);
            calcMove(y, x, +0, -1, -1, +0);
            calcMove(y, x, +1, +0, -1, +0);
            calcMove(y, x, -1, +0, -1, +0);
            calcMove(y, x, +1, +1, -1, +0);
            calcMove(y, x, -1, -1, -1, +0);
            calcMove(y, x, +1, -1, -1, +0);
            calcMove(y, x, -1, +1, -1, +0);
            break;
        case pieces[1]:
            calcMove(y, x, +0, +1);
            calcMove(y, x, +0, -1);
            calcMove(y, x, +1, +0);
            calcMove(y, x, -1, +0);
            calcMove(y, x, +1, +1);
            calcMove(y, x, -1, -1);
            calcMove(y, x, +1, -1);
            calcMove(y, x, -1, +1);
            break;
        case pieces[2]:
            calcMove(y, x, +0, +1);
            calcMove(y, x, +0, -1);
            calcMove(y, x, +1, +0);
            calcMove(y, x, -1, +0);
            break;
        case pieces[3]:
            calcMove(y, x, +1, +1);
            calcMove(y, x, -1, -1);
            calcMove(y, x, +1, -1);
            calcMove(y, x, -1, +1);
            break;
        case pieces[4]:
            break;
        case pieces[5]:
            if (y == '2' || y == '7') {
                yoff += ((next * -2) + 1) * 2;
                if (document.getElementById(yoff + '.' + xoff).innerHTML == empty && document.getElementById(String(y + ((next * -2) + 1)) + '.' + xoff).innerHTML == empty) {
                    document.getElementById(yoff + '.' + xoff).classList.add('move');
                }
            }
            yoff = y;
            yoff += (next * -2) + 1;
            if (document.getElementById(yoff + '.' + xoff).innerHTML == empty) {
                document.getElementById(yoff + '.' + xoff).classList.add('move');
            }
            xoff += 1;
            if (document.getElementById(yoff + '.' + xoff).classList.contains(players[next - 1]) || document.getElementById(yoff + '.' + xoff).classList.contains(players[next + 1])) {
                document.getElementById(yoff + '.' + xoff).classList.add('move');
                document.getElementById(yoff + '.' + xoff).classList.add('hit');
            }
            xoff = x;
            xoff -= 1;
            if (document.getElementById(yoff + '.' + xoff).classList.contains(players[next - 1]) || document.getElementById(yoff + '.' + xoff).classList.contains(players[next + 1])) {
                document.getElementById(yoff + '.' + xoff).classList.add('move');
                document.getElementById(yoff + '.' + xoff).classList.add('hit');
            }
            break;
    }
}

function calcMove(y, x, yz, xz, start = -8, end = 8) {
    var xoff = x;
    var yoff = y;
    for (let i = start; i < end; i++) {
        xoff += xz;
        yoff += yz;
        if (document.getElementById(yoff + '.' + xoff)) {
            if (document.getElementById(yoff + '.' + xoff).innerHTML == empty) {
                document.getElementById(yoff + '.' + xoff).classList.add('move');
            } else if (document.getElementById(yoff + '.' + xoff).classList.contains(players[next - 1]) || document.getElementById(yoff + '.' + xoff).classList.contains(players[next + 1])) {
                document.getElementById(yoff + '.' + xoff).classList.add('move');
                document.getElementById(yoff + '.' + xoff).classList.add('hit');
                break;
            } else {
                break;
            }
        }
    }
}

function setCell(id, to, name, add = true) {
    document.getElementById(id).innerHTML = name;
    if (add) {
        document.getElementById(id).classList.add(to);
    } else {
        document.getElementById(id).classList.remove(to);
    }
}

function sweep(id) {
    if (document.getElementById(id).classList.contains('hidden') && !document.getElementById(id).classList.contains('flagged') && game == 0) {
        if (bombIds.includes(id)) {
            lose();
        } else {
            var bombCount = parseInt(document.getElementById(id).classList[1].split('cell')[1]);
            document.getElementById(id).innerHTML = bombCount;
            if (bombCount == 0) {
                checkEmpty(id);
            }
            document.getElementById(id).classList.remove('hidden');
        }
        console.log(id)
    }
}

function flag(id) {
    if (document.getElementById(id).classList.contains('hidden') && game == 0) {
        if (!document.getElementById(id).classList.contains('flagged') && placedFlags < placedBombs) {
            document.getElementById(id).classList.add('flagged');
            document.getElementById(id).innerHTML = flagIcon;
            placedFlags += 1;
            if (placedFlags == placedBombs) {
                winCheck();
            }
        } else if (document.getElementById(id).classList.contains('flagged') && placedFlags <= placedBombs) {
            document.getElementById(id).classList.remove('flagged');
            document.getElementById(id).innerHTML = hiddenIcon;
            placedFlags -= 1;
        }
        document.getElementById('bombsleft').innerHTML = document.getElementById('bombsleft').innerHTML.split(': ')[0] + ': ' + (placedBombs - placedFlags)
    }
}

function checkBombs(id) {
    var bombCount = 0;
    var row = parseInt(id.split('.')[0]);
    var col = parseInt(id.split('.')[1]);
    for (let rowOff = -1; rowOff < 2; rowOff++) {
        for (let colOff = -1; colOff < 2; colOff++) {
            if (bombIds.includes(String(row + rowOff) + '.' + String(col + colOff))) {
                console.log(String(row + rowOff) + '.' + String(col + colOff))
                bombCount += 1;
            }
        }
    }
    return bombCount;
}

function checkEmpty(id) {
    if (!clearIds.includes(id)) {
        clearIds.push(id);
        let empties = [];
        var row = parseInt(id.split('.')[0]);
        var col = parseInt(id.split('.')[1]);
        for (let rowOff = -1; rowOff < 2; rowOff++) {
            for (let colOff = -1; colOff < 2; colOff++) {
                console.log('id: ' + id)
                console.log(colOff)
                console.log(rowOff)
                var current = String(row + rowOff) + '.' + String(col + colOff)
                console.log('checking: ' + current)
                if (document.getElementById(current)) {
                    if (document.getElementById(current).classList.contains('hidden') && current != id) {
                        empties.push(current);
                        console.log('empty: ' + current)
                        sweep(current);
                    }
                }
            }
        }
        console.log(empties)
    }

}

function setBoard() {
    document.getElementById('board').innerHTML = '';
    game = 0;
    clearIds = [];
    next = 0;
    for (let i = 8; i > 0; i--) {
        const tr = document.createElement("tr");
        tr.id = "r" + String(i);
        document.getElementById('board').appendChild(tr);
        if (next == 0) {
            next = 1;
        } else {
            next = 0;
        }
        for (let j = 1; j < 9; j++) {
            const td = document.createElement("td");
            td.innerHTML = empty;
            td.id = String(i) + '.' + String(j);
            if (next == 0) {
                next = 1;
                td.classList.add('black');
            } else {
                next = 0;
                td.classList.add('white');
            }
            td.onclick = function() {
                playerMove(String(i) + '.' + String(j));
            };
            document.getElementById(tr.id).appendChild(td);
        }
    }
    for (let i = 0; i < 8; i++) {
        document.getElementById('8.' + (i + 1)).innerHTML = pieces[setup[0][i]];
        document.getElementById('8.' + (i + 1)).classList.add('bp');
        document.getElementById('7.' + (i + 1)).innerHTML = pieces[setup[1][i]];
        document.getElementById('7.' + (i + 1)).classList.add('bp');
        document.getElementById('1.' + (i + 1)).innerHTML = pieces[setup[0][i]];
        document.getElementById('1.' + (i + 1)).classList.add('wp');
        document.getElementById('2.' + (i + 1)).innerHTML = pieces[setup[1][i]];
        document.getElementById('2.' + (i + 1)).classList.add('wp');
        document.getElementById('1.' + (i + 1)).classList.add('selectable');
        document.getElementById('2.' + (i + 1)).classList.add('selectable');
    }
    next = 0;
}

function winCheck() {
    var points = 0;
    for (let i = 0; i < placedBombs; i++) {
        if (document.getElementsByClassName('bomb')[i].classList.contains('flagged')) {
            points += 1;
        }
    }
    if (points == placedBombs) {
        game = 1;
        document.getElementById('bombsleft').innerHTML = 'Won. ' + document.getElementById('bombsleft').innerHTML;
    }
}

function lose() {
    game = -1;
    document.getElementById('bombsleft').innerHTML = 'Lost. ' + document.getElementById('bombsleft').innerHTML;
    for (let i = 0; 0 < document.getElementsByClassName('bomb').length; i++) {
        var current = document.getElementsByClassName('bomb')[i];
        current.classList.remove('hidden');
        if (current.classList.contains('flagged')) {
            current.classList.remove('flagged');
        }
        if (bombIds.includes(current.id)) {
            current.innerHTML = bombIcon;
        } else {
            current.innerHTML = parseInt(current.classList[0].split('cell')[1]);
        }
    }
}



//          ---------dev---------



function showAll() {
    while (0 < document.getElementsByClassName('hidden').length) {
        var current = document.getElementsByClassName('hidden')[0];
        current.classList.remove('hidden');
        if (current.classList.contains('flagged')) {
            current.classList.remove('flagged');
        }
        if (bombIds.includes(current.id)) {
            current.innerHTML = bombIcon;
        } else {
            current.innerHTML = parseInt(current.classList[0].split('cell')[1]);
        }
    }
}

function autoSolve() {
    for (let i = 0; i < placedBombs; i++) {
        if (!document.getElementsByClassName('bomb')[i].classList.contains('flagged')) {
            document.getElementsByClassName('bomb')[i].classList.add('flagged');
            document.getElementsByClassName('bomb')[i].innerHTML = flagIcon;
            placedFlags += 1;
        }
    }
    winCheck();
}

function startHelp() {
    sweep(document.getElementsByClassName('cell0')[Math.floor(Math.random() * document.getElementsByClassName('cell0').length)].id)
}