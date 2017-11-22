/**
 * BCLearningNetwork.com
 * Spiders Quiz Game
 * @author Colin Bernard (colinjbernard@hotmail.com)
 * March 2017
 */

////////// VARIABLES ///////////

var mute = false;
var FPS = 24;
var score = 0;
var scoreText;

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

// animations
var heSpiderAnimation;
var sheSpiderAnimation;


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
function startGame() {

	// ticker calls update function, set the FPS
	createjs.Ticker.setFPS(FPS);
	createjs.Ticker.addEventListener("tick", update); // call update function


	initGraphics();
}

/*
 * Displays the end game screen
 */
function endGame() {

	var soundToPlay = "success"; // assuming score is 5/5
	var spiderSpacingPixels = 5;

	if (score < 5) { // if score is not 5/5
		spiderWebImage = spiderWebBrokenImage;
		heartImage = heartBrokenImage;
		soundToPlay = "beep";
		spiderSpacingPixels = 30; // spiders further apart
	}


	spiderWebImage.alpha = 0;
	spiderWebImage.x = STAGE_WIDTH/2 - spiderWebImage.image.width/2;
	spiderWebImage.y = STAGE_HEIGHT/2 - spiderWebImage.image.height/2;
	stage.addChild(spiderWebImage);
	createjs.Tween.get(spiderWebImage).to({alpha: 1}, 2000);

	// spiders run in to middle and a heart with score appears animation
	heSpiderAnimation.x = -heSpiderImage.image.width;
	heSpiderAnimation.y = STAGE_HEIGHT/2 - heSpiderImage.image.height/2;
	sheSpiderAnimation.x = 500; // for some reason STAGE_WIDTH is not working here even though it is 500?
	sheSpiderAnimation.y = STAGE_HEIGHT/2 - sheSpiderImage.image.height/2;

	stage.addChild(heSpiderAnimation);
	stage.addChild(sheSpiderAnimation);

	// animate
	heSpiderAnimation.gotoAndPlay("crawl");
	sheSpiderAnimation.gotoAndPlay("crawl");

	// move the spiders
	createjs.Tween.get(heSpiderAnimation).to({x: STAGE_WIDTH/2 - heSpiderImage.image.width - spiderSpacingPixels}, 2000).call(function() { heSpiderAnimation.gotoAndPlay("stop"); })
		.call(function() {
			if (score < 5) {
				heSpiderSadImage.x = heSpiderAnimation.x;
				heSpiderSadImage.y = heSpiderAnimation.y;
				stage.addChild(heSpiderSadImage);
				stage.removeChild(heSpiderAnimation);
			}
		});
	createjs.Tween.get(sheSpiderAnimation).to({x: STAGE_WIDTH/2 + spiderSpacingPixels}, 2000).call(function() { sheSpiderAnimation.gotoAndPlay("stop"); })
		.call(function() {
			if (score < 5) {
				sheSpiderSadImage.x = sheSpiderAnimation.x;
				sheSpiderSadImage.y = sheSpiderAnimation.y;
				stage.addChild(sheSpiderSadImage);
				stage.removeChild(sheSpiderAnimation);
			}
		});


	// show the heart with score
	heartImage.scaleX = 0.1;
	heartImage.scaleY = 0.1;
	heartImage.regX = heartImage.getBounds().width/2;
	heartImage.regY = heartImage.getBounds().height/2;
	heartImage.alpha = 0;
	heartImage.x = STAGE_WIDTH/2;
	heartImage.y = STAGE_HEIGHT/2 - heartImage.getBounds().height/2 - 20;

	stage.addChild(heartImage);


	// display the score
	scoreText = new createjs.Text("Score: " + score + "/5", "28px Lato", "white");
	scoreText.scaleX = 0.1;
	scoreText.scaleY = 0.1;
	scoreText.regX = scoreText.getMeasuredWidth()/2;
	scoreText.regY = scoreText.getMeasuredHeight()/2;
	scoreText.alpha = 0;
	scoreText.x = STAGE_WIDTH/2;
	scoreText.y = heartImage.y - 5;

	stage.addChild(scoreText);

	createjs.Tween.get(heartImage).wait(2000).call(function() { playSound(soundToPlay); } ).to({alpha: 1, scaleX: 1, scaleY: 1}, 700);
	createjs.Tween.get(scoreText).wait(2000).to({alpha: 1, scaleX: 1, scaleY: 1}, 700);



	// reset button
	resetButton.x = STAGE_WIDTH/2 - resetButton.image.width/2;
	resetButton.y = STAGE_HEIGHT/2 + 50;
	stage.addChild(resetButton);
	resetButton.on("click", resetButtonHandler);
}

/*
 * Adds images to stage and sets initial position
 */
function initGraphics() {

	initMuteUnMuteButtons();

	// load spider animation sprite data
	var heSpiderSpriteData = {
		images: ["images/animations/he_spider_sprite.png"],
		frames: {width:100, height:50, count:2, regX:0, regY:0, spacing:0, margin:0},
		animations: {
			crawl: [0, 1, true],
			stop: [0, false]
		}
	};
	heSpiderAnimation = new createjs.Sprite(new createjs.SpriteSheet(heSpiderSpriteData));

	var sheSpiderSpriteData = {
		images: ["images/animations/she_spider_sprite.png"],
		frames: {width:100, height:56, count:2, regX:0, regY:0, spacing:0, margin:0},
		animations: {
			crawl: [0, 1, true],
			stop: [0, false]
		}
	};
	sheSpiderAnimation = new createjs.Sprite(new createjs.SpriteSheet(sheSpiderSpriteData));

	// draw check button
	checkButton.x = STAGE_WIDTH/2 - checkButton.image.width/2 + 5;
	checkButton.y = STAGE_HEIGHT - checkButton.image.height - 10;
	checkButtonPressed.x = checkButton.x;
	checkButtonPressed.y = checkButton.y;
	stage.addChild(checkButton);
	checkButton.cursor = "pointer";
	checkButtonPressed.cursor = "pointer";
	// check button listener
	checkButton.on("click", function(event) {
		checkButtonHandler();
	})
	checkButton.on("mouseover", function() {
		if (score == 0) {
			stage.addChild(checkButtonPressed);
			stage.removeChild(checkButton);
	}
	});
	checkButtonPressed.on("mouseout", function() {
		if (score == 0) {
			stage.addChild(checkButton);
			stage.removeChild(checkButtonPressed);
		}
	});
	checkButtonPressed.on("click", function() {
		checkButtonHandler();
	});

	// draw reset button
	resetButton.x = 26;
	resetButton.y = STAGE_HEIGHT - resetButton.image.height - 10;
	//stage.addChild(resetButton);
	resetButton.cursor = "pointer";
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
		image.cursor = "pointer";

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
		image.cursor = "pointer";

		image.on("click", function(event) {
			imageClickHandler(event);
		});

		stage.addChild(image);
	}
}

/*
 * Adds the mute and unmute buttons to the stage and defines listeners
 */
function initMuteUnMuteButtons() {
	var hitArea = new createjs.Shape();
	hitArea.graphics.beginFill("#000").drawRect(0, 0, muteButton.image.width, muteButton.image.height);
	muteButton.hitArea = unmuteButton.hitArea = hitArea;

	muteButton.x = unmuteButton.x = STAGE_WIDTH - muteButton.image.width - 5;
	muteButton.y = unmuteButton.y = 5;

	muteButton.cursor = "pointer";
	unmuteButton.cursor = "pointer";

	muteButton.on("click", toggleMute);
	unmuteButton.on("click", toggleMute);

	stage.addChild(muteButton);
}

/*
 * Handles user click on question images
 */
function imageClickHandler(event) {

	if (score == 0) {
		var id = event.target.name;

		// check if paired already
		if (!isPairedAlready(id)) {

			playSound("click");

			if (selectedImage == null) {

				selectedImage = id;
				selectedX = event.target.x;
				selectedY = event.target.y;
				box = new createjs.Shape();
				box.graphics.setStrokeStyle(4);
				box.graphics.beginStroke("red").drawRoundRectComplex(selectedX - 1, selectedY - 2, IMAGE_WIDTH + 1, IMAGE_HEIGHT + 4, 5, 5, 5, 5); // draws rectangle with rounded edges
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

					line.graphics.beginStroke("white").moveTo(startX, startY).lineTo(endX, endY).endStroke();
					stage.addChild(line);

					pairs.push({id1: selectedImage, id2:id, startX:startX, startY:startY, endX:endX, endY:endY}); // store the pair
					selectedImage = null; // reset selected

					// flash second image with red box
					var box2 = new createjs.Shape();
					box2.graphics.setStrokeStyle(4);
					box2.graphics.beginStroke("red").drawRoundRectComplex(event.target.x, event.target.y, IMAGE_WIDTH + 1, IMAGE_HEIGHT + 4, 5, 5, 5, 5);
					stage.addChild(box2);

					setTimeout(function removeBoxes() {
						stage.removeChild(box);
						stage.removeChild(box2);
					}, 200);

				}

			}
		} else {
			alert("Already paired! Choose a different image.");
		}
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
	if (score == 0) {
		if (pairs.length == NUMBER_OF_PAIRS) { // check if all images are matched

			playSound("click");

			// check all pairs
			for (var i = 0; i < pairs.length; i++) {

				var line = new createjs.Shape();
				line.graphics.setStrokeStyle(3);

				if (pairs[i].id1.replace(/\D/g, '') == pairs[i].id2.replace(/\D/g, '')) { // correct match

					// draw a green line
					line.graphics.beginStroke("green");
					score++;

				} else { // incorrect match

					// draw a red line
					line.graphics.beginStroke("red");

				}

				// draw the line
				line.graphics.moveTo(pairs[i].startX, pairs[i].startY).lineTo(pairs[i].endX, pairs[i].endY).endStroke();
				stage.addChild(line);
			}

			setTimeout(function() {
				endGame(); // show the end game screen
			}, 1500); // time for students to view what is correct or incorrect

		} else {
			alert("Please match all of the images!");
		}
	}

}

/*
 * Reset button was clicked
 */
function resetButtonHandler() {
	playSound("click");
	location.reload(); // re load the page
}

/////////////////////////////////////////////////////////////////////////////// ASSET LOADING BELOW

var PATH_TO_QUESTION_IMAGES = "versions/" + SUB_FOLDER + "/";

// bitmap variables
var backgroundImage;
var checkButton, resetButton; // buttons
var spiderWebImage, spiderWebBrokenImage; // the spider web png
var heSpiderImage, sheSpiderImage, heSpiderSadImage, sheSpiderSadImage; // spider images
var heartImage, heartBrokenImage;
var leftImages = []; // images to be displayed in left column
var rightImages = []; // images to be displayed in right column
var muteButton, unmuteButton;


///////////////////////////////// PRELOAD JS FUNCTIONS

function setupManifest() {
	manifest = [
    	{
    		src: "sounds/click.mp3",
    		id: "click"
    	},
    	{
    		src: "sounds/success.wav",
    		id: "success"
    	},
    	{
    		src: "sounds/beep.wav",
    		id: "beep"
    	},
    	{
    		src: "images/background.png",
    		id: "background"
    	},
        {
            src: "images/check_button.png",
            id: "check_button"
        },
        {
        	src: "images/check_button_pressed.png",
        	id: "check_button_pressed"
        },
        {
            src: "images/reset_button.png",
            id: "reset_button"
        },
        {
        	src: "images/spider_web.png",
        	id: "spider_web"
        },
        {
        	src: "images/spider_web_broken.png",
        	id: "spider_web_broken"
        },
        {
        	src: "images/he_spider.png",
        	id: "he_spider"
        },
        {
        	src: "images/she_spider.png",
        	id: "she_spider"
        },
        {
        	src: "images/heart.png",
        	id: "heart"
        },
        {
        	src: "images/heart_broken.png",
        	id: "heart_broken"
        },
        {
            src: PATH_TO_QUESTION_IMAGES + "left1.jpg",
            id: "left1"
        },
        {
            src: PATH_TO_QUESTION_IMAGES + "left2.jpg",
            id: "left2"
        },
        {
            src: PATH_TO_QUESTION_IMAGES + "left3.jpg",
            id: "left3"
        },
        {
            src: PATH_TO_QUESTION_IMAGES + "left4.jpg",
            id: "left4"
        },
        {
            src: PATH_TO_QUESTION_IMAGES + "left5.jpg",
            id: "left5"
        },
        {
            src: PATH_TO_QUESTION_IMAGES + "right1.jpg",
            id: "right1"
        },
        {
            src: PATH_TO_QUESTION_IMAGES + "right2.jpg",
            id: "right2"
        },
        {
            src: PATH_TO_QUESTION_IMAGES + "right3.jpg",
            id: "right3"
        },
        {
            src: PATH_TO_QUESTION_IMAGES + "right4.jpg",
            id: "right4"
        },
        {
            src: PATH_TO_QUESTION_IMAGES + "right5.jpg",
            id: "right5"
        },
        {
        	src: "images/he_spider_sad.png",
        	id: "he_spider_sad"
        },
        {
        	src: "images/she_spider_sad.png",
        	id: "she_spider_sad"
        },
				{
					src: "images/mute.png",
					id: "mute"
				},
				{
					src: "images/unmute.png",
					id: "unmute"
				}
	];
}

function startPreload() {
	preload = new createjs.LoadQueue(true);
    preload.installPlugin(createjs.Sound);
    preload.on("fileload", handleFileLoad);
    preload.on("progress", handleFileProgress);
    preload.on("complete", loadComplete);
    preload.on("error", loadError);
    preload.loadManifest(manifest);
}

function handleFileLoad(event) {
	console.log("A file has loaded of type: " + event.item.type);
    // create bitmaps of images
   	if (event.item.id == "background") {
   		backgroundImage = new createjs.Bitmap(event.result);
   	} else if (event.item.id.includes("left")) {
        leftImages.push({id: event.item.id, bitmap: new createjs.Bitmap(event.result)});
    } else if (event.item.id.includes("right")) {
        rightImages.push({id: event.item.id, bitmap: new createjs.Bitmap(event.result)});
    } else if (event.item.id == "check_button") {
        checkButton = new createjs.Bitmap(event.result);
    } else if (event.item.id == "reset_button") {
        resetButton = new createjs.Bitmap(event.result);
    } else if (event.item.id == "spider_web") {
    	spiderWebImage = new createjs.Bitmap(event.result);
    } else if (event.item.id == "he_spider") {
    	heSpiderImage = new createjs.Bitmap(event.result);
    } else if (event.item.id == "she_spider") {
    	sheSpiderImage = new createjs.Bitmap(event.result);
    } else if (event.item.id == "heart") {
    	heartImage = new createjs.Bitmap(event.result);
    } else if (event.item.id == "heart_broken") {
    	heartBrokenImage = new createjs.Bitmap(event.result);
    } else if (event.item.id == "spider_web_broken") {
    	spiderWebBrokenImage = new createjs.Bitmap(event.result);
    } else if (event.item.id == "check_button_pressed") {
    	checkButtonPressed = new createjs.Bitmap(event.result);
    } else if (event.item.id == "he_spider_sad") {
    	heSpiderSadImage = new createjs.Bitmap(event.result);
    } else if (event.item.id == "she_spider_sad") {
    	sheSpiderSadImage = new createjs.Bitmap(event.result);
    } else if (event.item.id == "mute") {
			muteButton = new createjs.Bitmap(event.result);
		} else if (event.item.id == "unmute") {
			unmuteButton = new createjs.Bitmap(event.result);
		}
}

function loadError(evt) {
    console.log("Error!",evt.text);
}

// not currently used as load time is short
function handleFileProgress(event) {
    /*progressText.text = (preload.progress*100|0) + " % Loaded";
    progressText.x = STAGE_WIDTH/2 - progressText.getMeasuredWidth() / 2;
    stage.update();*/
}

/*
 * Displays the start screen.
 */
function loadComplete(event) {
    console.log("Finished Loading Assets");
    // display start screen
    startText = new createjs.Text("Click To Start", "42px Lato", "black");
    startText.x = STAGE_WIDTH/2 - startText.getMeasuredWidth()/2;
    startText.y = STAGE_HEIGHT/2 - startText.getMeasuredHeight()/2;
   	stage.addChild(startText);
    stage.addChild(backgroundImage);
    stage.update();

    startGame();
}

///////////////////////////////////// END PRELOADJS FUNCTIONS
