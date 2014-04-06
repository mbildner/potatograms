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

	var currentlyHeldLetter;

	var letterMouseDownListener = canvas.addEventListener('mousedown', function (clickEvent) {
		var x = clickEvent.offsetX;
		var y = clickEvent.offsetY;

		var col = Math.floor(x / tileWidth);
		var row = Math.floor(y / tileHeight);

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

		box.letter = currentlyHeldLetter;
		currentlyHeldLetter = undefined;

		renderModel(boardContext, lettersGridModel);
	});


	function renderModel (context, model) {
		context.fillStyle = "white";
		context.fillRect(0, 0, 500, 600);

		model.forEach(function (row, _row) {
			row.forEach(function (box, _col) {
				// debugger;
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