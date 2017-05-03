/**
 * BCLearningNetwork.com
 * Spiders Quiz Game
 * @author Colin Bernard (colinjbernard@hotmail.com)
 * March 2017
 */

// THIS FILE FOR LOADING ALL ASSETS FOR SPIDERS QUIZ GAME //

// bitmap variables
var backgroundImage;


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
}

///////////////////////////////////// END PRELOADJS FUNCTIONS