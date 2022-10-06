const empty = ' ';
const pieces = ['♚', '♛', '♜', '♝', '♞', '♟︎'];
//['♔', '♕', '♖', '♗', '♘', '♙'],
const setup = [
    [2, 4, 3, 1, 0, 3, 4, 2],
    [5, 5, 5, 5, 5, 5, 5, 5]
];
const players = ['wp', 'bp'];
const p2word = ['White', 'Black'];

var next = 0;
var won = -1;

document.addEventListener("contextmenu", function(e) {
    if (e.originalTarget.localName == 'td') {
        e.preventDefault();
    }
}, false);

function playerMove(id) {
    if (won == -1) {
        if (document.getElementById(id).classList.contains('selectable')) {
            if (document.getElementById(id).classList.contains('selected')) {
                deselect();
            } else {
                if (document.getElementsByClassName('selected').length > 0) {
                    document.getElementsByClassName('selected')[0].classList.remove('selected')
                }
                document.getElementById(id).classList.add('selected')
                document.getElementById(id).classList.add('selectable');
                calcMoves(id);
            }
        }
        if (document.getElementById(id).classList.contains('move')) {
            next = next ^ 1;
            document.getElementById('gamestate').innerHTML = p2word[next] + ' is next.';
            move(document.getElementsByClassName('selected')[0].id, id)
        }
    }
}

function deselect() {
    while (document.getElementsByClassName('selected').length > 0) {
        document.getElementsByClassName('selected')[0].classList.remove('selected');
    }
    while (document.getElementsByClassName('move').length > 0) {
        document.getElementsByClassName('move')[0].classList.remove('move');
    }
    while (document.getElementsByClassName('selectable').length > 0) {
        document.getElementsByClassName('selectable')[0].classList.remove('selectable');
    }
    while (document.getElementsByClassName('hit').length > 0) {
        document.getElementsByClassName('hit')[0].classList.remove('hit');
    }
    if (won == -1) {
        for (let i = 0; i < document.getElementsByClassName(players[next]).length; i++) {
            document.getElementsByClassName(players[next])[i].classList.add('selectable');
        }
    }
}

function move(from, to) {
    o = document.getElementById(from);
    n = document.getElementById(to);
    is_king = o.innerHTML;
    n.classList.add(players[next ^ 1]);
    n.classList.remove(players[next]);
    o.classList.remove(players[next ^ 1]);
    n.innerHTML = o.innerHTML;
    o.classList.remove('selected');
    o.classList.remove('selectable');
    o.classList.remove('hit');
    n.classList.remove('move');
    o.innerHTML = empty;
    if (is_king) {
        winCheck();
    }
    if ((parseInt(to.split('.')[0]) == '8' || parseInt(to.split('.')[0]) == '1') && n.innerHTML == pieces[5]) {
        change(to);
    }
    deselect();
}

function change(id) {
    document.getElementById(id).innerHTML = pieces[1];
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
            calcMove(y, x, +2, +1, -1, +0);
            calcMove(y, x, +2, -1, -1, +0);
            calcMove(y, x, -2, +1, -1, +0);
            calcMove(y, x, -2, -1, -1, +0);
            calcMove(y, x, +1, +2, -1, +0);
            calcMove(y, x, +1, -2, -1, +0);
            calcMove(y, x, -1, +2, -1, +0);
            calcMove(y, x, -1, -2, -1, +0);
            break;
        case pieces[5]:
            if ((y == '2' && document.getElementById(id).classList.contains(players[0])) || (y == '7' && document.getElementById(id).classList.contains(players[1]))) {
                yoff += ((next * -2) + 1) * 2;
                if (document.getElementById(yoff + '.' + xoff).innerHTML == empty && document.getElementById(String(y + ((next * -2) + 1)) + '.' + xoff).innerHTML == empty) {
                    document.getElementById(yoff + '.' + xoff).classList.add('move');
                }
            }
            calcMove(y, x, ((next * -2) + 1), +0, -1, +0, 0);
            calcMove(y, x, ((next * -2) + 1), +1, -1, +0, 1);
            calcMove(y, x, ((next * -2) + 1), -1, -1, +0, 1);
            break;
    }
}

function calcMove(y, x, yz, xz, start = -8, end = 8, hit = -1) {
    var xoff = x;
    var yoff = y;
    for (let i = start; i < end; i++) {
        xoff += xz;
        yoff += yz;
        if (document.getElementById(yoff + '.' + xoff)) {
            if (hit == 1) {
                if (document.getElementById(yoff + '.' + xoff).classList.contains(players[next ^ 1])) {
                    document.getElementById(yoff + '.' + xoff).classList.add('move');
                    document.getElementById(yoff + '.' + xoff).classList.add('hit');
                }
                break;
            }
            if (document.getElementById(yoff + '.' + xoff).innerHTML == empty) {
                document.getElementById(yoff + '.' + xoff).classList.add('move');
            } else if (document.getElementById(yoff + '.' + xoff).classList.contains(players[next ^ 1]) && hit == -1) {
                document.getElementById(yoff + '.' + xoff).classList.add('move');
                document.getElementById(yoff + '.' + xoff).classList.add('hit');
                break;
            } else {
                break;
            }
        }
    }
}

function setBoard() {
    document.getElementById('board').innerHTML = '';
    clearIds = [];
    next = 0;
    document.getElementById('gamestate').innerHTML = p2word[next] + ' is next.';
    for (let i = 8; i > 0; i--) {
        const tr = document.createElement("tr");
        tr.id = "r" + String(i);
        document.getElementById('board').appendChild(tr);
        next = next ^ 1;
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
    var winner = 2;
    for (let i = 0; i < document.getElementsByClassName(players[0]).length; i++) {
        if (document.getElementsByClassName(players[0])[i].innerHTML == pieces[0]) {
            winner -= 2;
            break;
        }
    }
    for (let i = 0; i < document.getElementsByClassName(players[1]).length; i++) {
        if (document.getElementsByClassName(players[1])[i].innerHTML == pieces[0]) {
            winner -= 1;
            break;
        }
    }
    if (winner == -1) {
        //no win
        return;
    }
    if (winner == 2) {
        //tie
    } else {
        won = winner;
        document.getElementById('gamestate').innerHTML = p2word[won] + ' won.';
    }
    deselect();
}