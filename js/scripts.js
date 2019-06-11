console.log('Started scripts.js');

var c;
// define the board
// UPPERCASE = white
var board2 = [
			['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
			['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
			[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
			[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],

			[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
			[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
			['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
			['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
	];

var board = [
			['r', 'n', ' ', ' ', 'k', 'b', ' ', ' '],
			[' ', 'p', ' ', ' ', 'B', 'p', ' ', 'p'],
			[' ', ' ', 'p', ' ', ' ', ' ', ' ', ' '],
			['p', 'b', 'N', ' ', ' ', ' ', 'r', ' '],

			['B', ' ', ' ', ' ', 'P', 'n', ' ', 'P'],
			['P', ' ', 'q', ' ', ' ', ' ', ' ', 'R'],
			[' ', 'R', ' ', ' ', ' ', ' ', ' ', ' '],
			[' ', ' ', ' ', 'Q', 'K', 'B', 'N', ' ']
	];

var hl_squares = [];


var generateBoardHTML = function() {
	// populate the board

	var squareColor = new Boolean(true); // true = white square
	var pieceColor;
	var boardDiv = document.getElementById("board");
	var rankCount = 8;
	var fileCount = 1;

	for (const rank of board) { // 8-1
		for (const file of rank) { // a-h
			var square = document.createElement("div");
			if (squareColor) {
				square.className = 'square-white';
			} else {
				square.className = 'square-black';
			}

			if (file == file.toUpperCase()) {
				pieceColor = 'w';
			} else {
				pieceColor = 'b';
			}

			square.setAttribute('color', pieceColor);
			square.setAttribute('piece', file);
			square.setAttribute('square', String.fromCharCode(96+fileCount) + rankCount.toString());

			if (file !== ' ') {
				var pieceImage = document.createElement("img");
				pieceImage.src = 'images/' + pieceColor + file.toLowerCase() + '.png';				
				square.appendChild(pieceImage);
			}

			boardDiv.appendChild(square);
			squareColor = !squareColor;
			fileCount = fileCount + 1;
			if (fileCount > 8) {
				fileCount = 1;
			}
		}
		squareColor = !squareColor;
		boardDiv.appendChild(document.createElement("div"));
		rankCount = rankCount - 1;
	}
}

// convert a file (letter) to number
var fileToCoord = function (i) {
	return i.charCodeAt(0) - 96 - 1;
};

// convert a number to a file (letter)
var intToFile = function (i) {
	return String.fromCharCode(i + 96);
};

// convert array coords to File-Rank, 0,0 = A8, 7,7 = H1
var coordsToFR = function (x, y) {
	return intToFile(x+1) + parseInt(8-y);
};
// is the piece black/lowercase
var isBlack = function (i) {
	if (i == i.toLower()) {
		return true;
	}
	return false;
};

// is the piece white/uppercase
var isWhite = function (i) {
	if (i == i.toUpper()) {
		return true;
	}
	return false;
};

// check if a square is on the board
var isSquareOnBoard = function(x, y) {
	if (x < 8 && x > -1) {
		if (y < 8 && y > -1) {
			return true;
		}
	}
	return false;
};

// get info on piece in a square
var inSquare = function (x, y) {
	if (board[y][x] == ' ') { // square is empty
		return false;
	}

	if (board[y][x] == board[y][x].toUpperCase()) {
		return 'w';
	} else {
		return 'b';
	}
};

// return true of color is opposite
var opposingColor = function (c) {
	return (c == 'w' ? 'b' : 'w');
};

// return true if piece of color can move to square x,y
// need to sepearate out marking of highlighted squares
var checkMoveTo = function (x, y, color) {
	console.log('checking left', x, y);
	if (isSquareOnBoard(x, y) == false) { // off board
		return false;
	} else if (inSquare(x, y) == false) { // blank square
		return true;
	} else if (inSquare(x, y) == opposingColor(color)) { // opposing piece
		return true;
	} else if (inSquare(x, y) == color) { // same color
		return false;
	}
};


var clearHighlightedSquares = function () {
	// if hl_pieces contains any squares...clear them so the board looks normal
	for (const s of hl_squares) {
		var hs = document.querySelector('[square="' + s + '"]');
		if (hs.className == 'square-black-darkened') {
			hs.classList.replace('square-black-darkened', 'square-black');
		} else if (hs.className == 'square-white-darkened') {
			hs.classList.replace('square-white-darkened', 'square-white');			
		}
	}
	hl_squares = [];
};

document.addEventListener('mouseover', function(e) {
	if (e.target.tagName === "HTML") {
		console.log('Not on the board');
		clearHighlightedSquares();
	} else 
	if (e.target.parentNode.getAttribute('color') == null) {
		console.log('Blank square');
		clearHighlightedSquares();
	} else { // we're on a piece
		clearHighlightedSquares();
		// should we make the piece an object?
		var hover_square = e.target.parentNode.getAttribute('square');
		var piece = e.target.parentNode.getAttribute('piece');
		var color = e.target.parentNode.getAttribute('color');

		console.log(hover_square + " Piece: " + piece + " Color: " + color);

		var file = hover_square[0];
		var rank = hover_square[1];
		// turn the h1, a4, etc into numbers, x,y of the hovered piece
		// also conver to array coordinates (start at 0)
		x = fileToCoord(file);
		y = 8-parseInt(rank);

		var i = x;
		var j = y;
		var done = false;

		console.log(" File: ", file, " Rank: ", rank);
		console.log("X: ", x, " Y: ", y)

		switch (piece.toUpperCase()) {
			// TODO: check pawns for first move, double squares allowed
			case 'P':
				if (color == 'w') { // white, so move 'up' the board
					if (isSquareOnBoard(x-1, y-1)) {
						if (inSquare(x-1, y-1) == 'b') {
							hl_squares.push(coordsToFR(x-1,y-1));
						}
					}
					if (isSquareOnBoard(x,y-1)) {
						if (inSquare(x, y-1) == false) {
							hl_squares.push(coordsToFR(x,y-1));
						}
					}
					if (isSquareOnBoard(x+1,y-1)) {
						if (inSquare(x+1, y-1) == 'b') {
							hl_squares.push(coordsToFR(x+1,y-1));
						}
					}
				} else { // black, move 'down' the board
					if (isSquareOnBoard(x-1, y+1)) {
						if (inSquare(x-1, y+1) == 'w') {
							hl_squares.push(coordsToFR(x-1,y+1));
						}
					}
					if (isSquareOnBoard(x,y+1)) {
						if (inSquare(x, y+1) == false) {
							hl_squares.push(coordsToFR(x,y+1));
						}
					}
					if (isSquareOnBoard(x+1,y+1)) {
						if (inSquare(x+1, y+1) == 'w') {
							hl_squares.push(coordsToFR(x+1,y+1));
						}
					}

				}
			break;

			case 'R':
				// this should be something like
				// pieceCanMoveHorizontally()
				var h_coords = [ [0, -1], [1, 0], [0, 1], [-1, 0] ];
				
				for (index = 0; index < 4; index++) {
					i = x;
					j = y;

					done = false;
					do {
						i = i + h_coords[index][0];
						j = j + h_coords[index][1];
						result = checkMoveTo(i, j, color);
						if (result) { // can we move here?
							hl_squares.push(coordsToFR(i,j));
							if (inSquare(i,j) == opposingColor(color)) { // will this be a capture?
								done = true;
							}
						} else {
							done = true;
						}
					} while (!done)
				}
			break;

			case 'B':
				// up - left -, up - right +, down + right +, down + left -
				var b_coords = [ [-1, -1], [-1, 1], [1, 1], [1, -1] ];

				for (index = 0; index < 4; index++) {
					i = x;
					j = y;
					done = false;
					do {
						i = i + b_coords[index][0];
						j = j + b_coords[index][1];
						result = checkMoveTo(i, j, color);
						if (result) { // can we move here?
							hl_squares.push(coordsToFR(i,j));
							if (inSquare(i,j) == opposingColor(color)) {
								done = true;
							}
						} else {
							done = true;
						}
					} while (!done)
				}
			break;

			case 'N':
				// possible squares knight can move to (clockwise from 2 o'clock)
				l_coords = [	[1, -2], [2, -1], [2, 1], [1, 2], 
								[-1, 2], [-2, 1], [-2, -1], [-1, -2]   ];

				for (var l = 0; l < 8; l++) {
					i = x + l_coords[l][0];
					j = y + l_coords[l][1];
					result = checkMoveTo(i, j, color);
					if (result) { // can we move here?
						hl_squares.push(coordsToFR(i,j));
					}
				}
			break;

			case 'K':
				// possible squares king can move to
				l_coords = [	[-1, 0], [1, 0], [0, -1], [0, 1],
								[-1, 1], [1, -1], [-1, -1], [1, 1]  ];

				for (var l = 0; l < 8; l++) {
					i = x + l_coords[l][0];
					j = y + l_coords[l][1];
					result = checkMoveTo(i, j, color);
					if (result) { // can we move here?
						hl_squares.push(coordsToFR(i,j));
					}
				}
			break;

			case 'Q':
				var h_coords = [ [0, -1], [1, 0], [0, 1], [-1, 0] ];
				
				for (index = 0; index < 4; index++) {
					i = x;
					j = y;

					done = false;
					do {
						i = i + h_coords[index][0];
						j = j + h_coords[index][1];
						result = checkMoveTo(i, j, color);
						if (result) { // can we move here?
							hl_squares.push(coordsToFR(i,j));
							if (inSquare(i,j) == opposingColor(color)) { // will this be a capture?
								done = true;
							}
						} else {
							done = true;
						}
					} while (!done)
				}

				// up - left -, up - right +, down + right +, down + left -
				var b_coords = [ [-1, -1], [-1, 1], [1, 1], [1, -1] ];

				for (index = 0; index < 4; index++) {
					i = x;
					j = y;
					done = false;
					do {
						i = i + b_coords[index][0];
						j = j + b_coords[index][1];
						result = checkMoveTo(i, j, color);
						if (result) { // can we move here?
							hl_squares.push(coordsToFR(i,j));
							if (inSquare(i,j) == opposingColor(color)) {
								done = true;
							}
						} else {
							done = true;
						}
					} while (!done)
				}

			break;

			default:
				console.log("Don't know about this piece yet - " + piece);
		}
		console.log(hl_squares);

		// highlight the squares the hovered piece can move to
		for (const s of hl_squares) {
			console.log('const s = ', s);
			var hs = document.querySelector('[square="' + s + '"]');
			if (hs.className == 'square-black') {
				hs.classList.replace('square-black', 'square-black-darkened');
			} else {
				hs.classList.replace('square-white', 'square-white-darkened');			
			}
		}
	}
});

//	if (e.target.parentNode.getAttribute('color') == 'b') {
//		console.log('black ' + e.target.parentNode.getAttribute('piece') + ' Square: '  + e.target.parentNode.getAttribute('square'));
//	} else
//	if (e.target.parentNode.getAttribute('color') == 'w') {
//		console.log('white ' + e.target.parentNode.getAttribute('piece') + ' Square: '  + e.target.parentNode.getAttribute('square'));

window.onload = function() {
	generateBoardHTML();
};

