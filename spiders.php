<!DOCTYPE html>
<html>
<head>
	<title>BCLN - Quiz</title>
	<meta charset="utf-8"/>
	<link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Lato"><!-- google web font -->
	<link rel="stylesheet" type="text/css" href="style/style.css"/>
	<link rel="shortcut icon" href="images/favicon.ico"/>
	<script src="https://bclearningnetwork.com/lib/jquery/jquery-3.2.1.min.js"></script>
	<script src="https://bclearningnetwork.com/lib/createjs/createjs-2015.11.26.min.js"></script><!-- CreateJS library hosted on BCLN server -->
	<script>

	// CHANGE THIS VARIABLE TO THE DESIRED SUB FOLDER NAME
	var SUB_FOLDER = "<?=$_GET['title']?>";

	</script>
	<script type="text/javascript" src="helper.js"></script><!-- contains helper functions which do not call functions in balloon.js -->
	<script type="text/javascript" src="spiders.js"></script><!-- the main game JS file -->
</head>
<body onload="init();"><!-- body onload calls function to initialize game -->

	<canvas id="gameCanvas" width="500" height="692">
		<!-- game will be rendered here -->
	</canvas>
	<!--<div>Alert icon made by <a href="https://www.flaticon.com/authors/eleonor-wang" title="Eleonor Wang">Eleonor Wang</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>-->
</body>
</html>
