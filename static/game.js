document.addEventListener('DOMContentLoaded', function () {

	var letters = 'moshebirblaurock'.split('');

	var canvas = document.getElementById('gameBoard');

	var boardContext = canvas.getContext('2d');

	var rows = 10;
	var cols = 10;

	var boardHeight = canvas.height;
	var boardWidth = canvas.width;

	var tileHeight = 50;
	var tileWidth = 50;

	var lettersGridModel = [];
	for (var _row=0; _row < rows + 2; _row++) {
		var row = [];
		for (var _col=0; _col < cols; _col++) {
			var letterHeldIn = _row > 9 ? 'tray': 'board';
			var box = {
				letter: undefined,
				letterHeldIn: letterHeldIn
			};
			row.push(box);
		}
		lettersGridModel.push(row);
	}

	var rowNumber;
	letters.forEach(function (letter, indx) {
		rowNumber = indx < 10 ? 10: 11;
		var box = lettersGridModel[rowNumber][indx % 10];
		box.letter = letter;
	});


	window.lettersGridModel = lettersGridModel;


	function findPositionFromCoords (rowColArray) {
		var row = rowColArray[0];
		var col = rowColArray[1];

		var x = tileWidth * col;
		var y = tileHeight * row;

		return [x, y];
	}

	function renderFloatingTile (context, letter, color, x, y) {
		var letterX = x + tileWidth/2;
		var letterY = y + tileHeight/2 + 5;

		context.fillStyle = color || 'black';
		context.font="20px Georgia";
		context.textAlign = "center";
		context.fillRect(x, y, tileWidth, tileHeight);
		context.fillStyle = "black";
		context.fillText(letter, letterX, letterY);
	}

	function renderTile (context, letter, color, row, col) {
		var position = findPositionFromCoords([row, col]);
		var x = position[0];
		var y = position[1];
		var letterX = x + tileWidth/2;	
		var letterY = y + tileHeight/2 + 5;

		context.fillStyle = color || 'black';
		context.font="20px Georgia";
		context.textAlign = "center";
		context.fillRect(x, y, tileWidth, tileHeight);
		context.fillStyle = "black";
		context.fillText(letter, letterX, letterY);
	}


	window.renderTile = renderTile;

	renderAllHeldTiles(boardContext, letters);


	var currentlyHeldLetterCol;
	var currentlyHeldLetterRow;
	var currentlyHeldLetter;
	var tileOffsetX;
	var tileOffsetY;

	var letterMouseMoveListener = canvas.addEventListener('mousemove', function (moveEvent) {
		if (!currentlyHeldLetter) {
			return;
		}

		var x = moveEvent.offsetX - tileOffsetX;
		var y = moveEvent.offsetY - tileOffsetY;

		var floatingGreen = "rgba(0, 255, 0, .5)";

		clearBoard(boardContext);
		renderModel(boardContext, lettersGridModel);
		renderFloatingTile(boardContext, currentlyHeldLetter, floatingGreen, x, y);

	});


	var letterMouseDownListener = canvas.addEventListener('mousedown', function (clickEvent) {
		var x = clickEvent.offsetX;
		var y = clickEvent.offsetY;

		tileOffsetX = x % tileWidth;
		tileOffsetY = y % tileHeight;

		var col = Math.floor(x / tileWidth);
		var row = Math.floor(y / tileHeight);

		currentlyHeldLetterCol = col;
		currentlyHeldLetterRow = row;

		var box = lettersGridModel[row][col];

		if (!box.letter) {
			return;
		}

		currentlyHeldLetter = box.letter;

		delete box.letter;

	});

	var letterMouseUpListener = canvas.addEventListener('mouseup', function (clickEvent) {
		if (!currentlyHeldLetter) {
			return;
		}

		var x = clickEvent.offsetX;
		var y = clickEvent.offsetY;

		var col = Math.floor(x / tileWidth);
		var row = Math.floor(y / tileHeight);

		var box = lettersGridModel[row][col];

		if (box.letter) {
			// user tries to drop letter where there already is one
			// return it to its original box, delete currentlyHeldLetter
			var originalBox = lettersGridModel[currentlyHeldLetterRow][currentlyHeldLetterCol];
			originalBox.letter = currentlyHeldLetter;
			currentlyHeldLetter = undefined;
			renderModel(boardContext, lettersGridModel);
			return;
		}

		box.letter = currentlyHeldLetter;

		currentlyHeldLetter = undefined;
		renderModel(boardContext, lettersGridModel);

		var lettersInTray = getLettersFromTray(lettersGridModel);
		condenseLettersTray(lettersGridModel);

	});

	function condenseLettersTray (lettersGridModel) {
		var lettersInTray = getLettersFromTray(lettersGridModel);

		var lettersTrayRows = lettersGridModel.filter(function (row) {
			return row.some(function (box) {
				return box.letterHeldIn === 'tray';
			});
		});

		var emptyBoxes = lettersTrayRows.reduce(function (row1, row2) {
			return row1.concat(row2).filter(function (box) {
				return typeof(box.letter) === 'undefined';
			});
		});

	}


	function getLettersFromTray (lettersGridModel) {
		var flattenedBoxesArray = lettersGridModel.reduce(function (row1, row2) {
			return row1.concat(row2);
		});

		var fullTrayBoxes = flattenedBoxesArray.filter(function (box) {
			return box.letter && box.letterHeldIn === 'tray';
		});

		var lettersArray = fullTrayBoxes.map(function (box) {
			return box.letter;
		});

		return lettersArray;
	}

	function clearBoard (context) {
		context.fillStyle = "white";
		context.fillRect(0, 0, 500, 600);
	}

	function renderModel (context, model) {

		clearBoard(boardContext);

		model.forEach(function (row, _row) {
			row.forEach(function (box, _col) {
				var color = box.letterHeldIn === 'tray' ? 'purple' : 'red';
				var letter = box.letter;

				if (!letter) {
					return;
				}

				renderTile(context, letter, color, _row, _col);

			});
		});	

	}


	function renderAllHeldTiles (context, lettersArray) {
		var sanityCheck = document.getElementById('sanityCheck');
		sanityCheck.textContent = lettersArray.join('');


		var rowNumber;
		lettersArray.forEach(function (letter, indx) {
			rowNumber = indx < 10 ? 10: 11;
			renderTile(context, letter, 'purple', rowNumber, indx % 10);
		});
	}

});