/**
 * BCLearningNetwork.com
 * Spiders Quiz Game
 * @author Colin Bernard (colinjbernard@hotmail.com)
 * March 2017
 */

////////// VARIABLES ///////////

var mute = false;
var FPS = 24;

// pixel constants
var IMAGE_WIDTH = 160; // width that images will be scaled to
var IMAGE_HEIGHT = 75; // height that images will be scaled to
var DISTANCE_BETWEEN = 90; // distance between images
var X_FOR_LEFT = 28; // x distance to left column (from left side of screen)
var Y_FOR_LEFT = 142; // y distance to top of left column (from top of screen)
var X_FOR_RIGHT = 303; // x distance to right column
var Y_FOR_RIGHT = 142; // y distnace to top of right column (same as left)

// constants (set in init function)
var STAGE_WIDTH;
var STAGE_HEIGHT;

var NUMBER_OF_PAIRS = 5;

var selectedImage = null;
var selectedX, selectedY;
var pairs = [];

var box; // drawn around selected image


/*
 * Handles initialization of game components
 * Called from HTML body onload.
 */
function init() {
	// set constants
	STAGE_WIDTH = document.getElementById("gameCanvas").getAttribute("width");
	STAGE_HEIGHT = document.getElementById("gameCanvas").getAttribute("height");

	// init state object
	stage = new createjs.Stage("gameCanvas"); // canvas id is gameCanvas
	stage.mouseEventsEnabled = true;
	stage.enableMouseOver(); // Default, checks the mouse 20 times/second for hovering cursor changes

	setupManifest(); // preloadJS
	startPreload();

	score = 0; // reset game score
	questionCounter = 0;


    stage.on("stagemousedown", startGame, null, false);
}

/*
 * Main update function
 */
function update(event) {


	stage.update(event);
}

/*
 * Starts the game
 */
function startGame(event) {
	playSound("click");

	event.remove();

	// ticker calls update function, set the FPS
	createjs.Ticker.setFPS(FPS);
	createjs.Ticker.addEventListener("tick", update); // call update function

	// remove start screen from visible canvas
	//createjs.Tween.get(startText).to({x:-800}, 10).call(initGraphics);
	initGraphics();
}

/*
 * Displays the end game screen
 */
function endGame() {

}

/*
 * Adds images to stage and sets initial position
 */
function initGraphics() {

	// draw check button
	checkButton.x = STAGE_WIDTH/2 - checkButton.image.width/2 + 5;
	checkButton.y = STAGE_HEIGHT - checkButton.image.height - 10;
	stage.addChild(checkButton);

	// check button listener
	checkButton.on("click", function(event) {
		checkButtonHandler();
	})

	// draw reset button
	resetButton.x = 26;
	resetButton.y = STAGE_HEIGHT - resetButton.image.height - 10;
	stage.addChild(resetButton);

	// reset button listener
	resetButton.on("click", function(event) {
		resetButtonHandler();
	})

	// shuffle the images
	shuffle(leftImages);
	shuffle(rightImages);


	// draw left images
	for (var i = 0; i < leftImages.length; i++) {
		var image = leftImages[i].bitmap;
		image.name = leftImages[i].id;

		image.scaleX = IMAGE_WIDTH / image.image.width;
		image.scaleY = IMAGE_HEIGHT / image.image.height;
		image.x = X_FOR_LEFT;
		image.y = Y_FOR_LEFT + (DISTANCE_BETWEEN*i);

		image.on("click", function(event) {
			imageClickHandler(event);
		});
		

		stage.addChild(image);
	}

	// draw right images
	for (var i = 0; i < rightImages.length; i++) {
		var image = rightImages[i].bitmap;
		image.name = rightImages[i].id;

		image.scaleX = IMAGE_WIDTH / image.image.width;
		image.scaleY = IMAGE_HEIGHT / image.image.height;
		image.x = X_FOR_RIGHT;
		image.y = Y_FOR_RIGHT + (DISTANCE_BETWEEN*i);

		image.on("click", function(event) {
			imageClickHandler(event);
		});

		stage.addChild(image);
	}
}

/*
 * Handles user click on question images
 */
function imageClickHandler(event) {
	
	var id = event.target.name;

	// check if paired already
	if (!isPairedAlready(id)) {

		playSound("click");

		if (selectedImage == null) {

			selectedImage = id;
			selectedX = event.target.x;
			selectedY = event.target.y;
			box = new createjs.Shape();
			box.graphics.setStrokeStyle(3);
			box.graphics.beginStroke("yellow").drawRect(selectedX, selectedY, IMAGE_WIDTH, IMAGE_HEIGHT);
			stage.addChild(box);

		} else {

			var firstColumn = selectedImage.replace(/[0-9]/g, '');
			var secondColumn = id.replace(/[0-9]/g, '');

			// if the next selction is in the same column (invalid)
			if (firstColumn === secondColumn) {
				alert("Can't choose image in the same column!");
			} else {

				// draw a line between two images
				var line = new createjs.Shape();
				line.graphics.setStrokeStyle(3);
				var startX, startY, endX, endY;
				startY = selectedY + IMAGE_HEIGHT/2;
				endY = event.target.y + IMAGE_HEIGHT/2;

				if (firstColumn === "left") {
					startX = selectedX + IMAGE_WIDTH;
					endX = event.target.x;
				} else {
					startX = selectedX;
					endX = event.target.x + IMAGE_WIDTH;
				}

				line.graphics.beginStroke("black").moveTo(startX, startY).lineTo(endX, endY).endStroke();
				stage.addChild(line);

				pairs.push({id1: selectedImage, id2:id, startX:startX, startY:startY, endX:endX, endY:endY}); // store the pair
				selectedImage = null; // reset selected
				stage.removeChild(box);
			}

		}
	} else {
		alert("Already paired! Choose a different image.");
	}
}

/*
 * Checks if an image is already paired. Returns true or false
 */
function isPairedAlready(id) {
	for (var i = 0; i < pairs.length; i++) {
		if (pairs[i].id1 == id || pairs[i].id2 == id) {
			return true;
		}
	}
	return false;
}

/*
 * Check button is clicked
 */
function checkButtonHandler() {
	if (pairs.length == NUMBER_OF_PAIRS) { // check if all images are matched

		playSound("click");

		// check all pairs
		for (var i = 0; i < pairs.length; i++) {

			var line = new createjs.Shape();
			line.graphics.setStrokeStyle(3);

			if (pairs[i].id1.replace(/\D/g, '') == pairs[i].id2.replace(/\D/g, '')) { // correct match

				// draw a green line
				line.graphics.beginStroke("green");

			} else { // incorrect match

				// draw a red line
				line.graphics.beginStroke("red");

			}

			// draw the line
			line.graphics.moveTo(pairs[i].startX, pairs[i].startY).lineTo(pairs[i].endX, pairs[i].endY).endStroke();
			stage.addChild(line);
		}

	} else {
		alert("Please match all of the images!");
	}
}

/*
 * Reset button was clicked
 */
function resetButtonHandler() {
	playSound("click");
	location.reload(); // re load the page
}