/**
 * BCLearningNetwork.com
 * Spiders Quiz Game
 * @author Colin Bernard (colinjbernard@hotmail.com)
 * March 2017
 */

// THIS FILE FOR LOADING ALL ASSETS FOR SPIDERS QUIZ GAME //


var PATH_TO_QUESTION_IMAGES = "images/question_images/";

// bitmap variables
var backgroundImage;
var checkButton, resetButton;
var leftImages = [];
var rightImages = [];

var loadComplete = false;


///////////////////////////////// PRELOAD JS FUNCTIONS

function setupManifest() {
	manifest = [
    	{
    		src: "sounds/click.mp3",
    		id: "click"
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
            src: "images/reset_button.png",
            id: "reset_button"
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

    loadComplete = true;
}

///////////////////////////////////// END PRELOADJS FUNCTIONS