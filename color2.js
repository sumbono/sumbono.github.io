var numKotaks = 6;

var colors = generateRandomColors(numKotaks);

var kotaks = document.querySelectorAll(".kotak");

var pickedColor = pickColor();

var colorDisplay = document.getElementById('colorDisplay');

var messageDisplay = document.querySelector("#message");

var h1 = document.querySelector("h1");

var resetButton = document.querySelector("#reset");

var easyBtn = document.querySelector("#easyBtn");

var hardBtn = document.querySelector("#hardBtn");

easyBtn.addEventListener("click", function(){
	hardBtn.classList.remove("selected");
	easyBtn.classList.add("selected");
	numKotaks = 3;
	colors = generateRandomColors(numKotaks);
	pickedColor = pickColor();
	colorDisplay.textContent = pickedColor;
	
	for (var i = 0; i < kotaks.length; i++) {
		if (colors[i]){
			kotaks[i].style.background = colors[i];
		} else{
			kotaks[i].style.display = "none";
		}
	}
});

hardBtn.addEventListener("click", function () {
	hardBtn.classList.add("selected");
	easyBtn.classList.remove("selected");
	numKotaks = 6;
	colors = generateRandomColors(6);
	pickedColor = pickColor();
	colorDisplay.textContent = pickedColor;
	
	for (var i = 0; i < kotaks.length; i++) {
			kotaks[i].style.background = colors[i];
			kotaks[i].style.display = "block";
	}
});

resetButton.addEventListener("click", function () {
	// generate all new colors
	colors = generateRandomColors(numKotaks);
	//pick a new random color from array
	pickedColor = pickColor();
	//change colorDisplay to match picked Color
	colorDisplay.textContent = pickedColor;
	//hide the message display
	messageDisplay.textContent = "";
	//change colors of kotaks
	for (var i = 0; i < kotaks.length; i++) {
		kotaks[i].style.background = colors[i];
	}
	h1.style.background = "#02A015";
});

colorDisplay.textContent = pickedColor;

for (var i = 0; i < kotaks.length; i++) {

	//add initial colors to kotaks
	kotaks[i].style.background = colors[i];

	//add click listeners to kotaks
	kotaks[i].addEventListener("click", function() {
	
		//grab color of clicked kotaks
		var clickedColor = this.style.background;
			// alert(clickedColor);

		//compare color to pickedColor
		if (clickedColor === pickedColor){
			messageDisplay.textContent = "Correct!";
			changeColors(clickedColor);
			resetButton.textContent = "Play Again?";
			h1.style.background = clickedColor;
		} else{
			this.style.background = "#232121";
			messageDisplay.textContent = "Try Again..";
		}
	});
}


//Change color if true clicked
function changeColors (color) {
	// loop through all kotaks
	for (var i = 0; i < kotaks.length; i++) {
		//change each color to match given color
		kotaks[i].style.background = color;
	}
}

//pick a new loop color
function pickColor () {
	var random = Math.floor(Math.random() * colors.length);
	return colors[random];
}


//generete Random colors from http://www.codingforums.com/javascript-programming/204015-how-do-random-pick-array-no-repeat.html

function generateRandomColors (num) {

	var warna = [
		"rgb(255, 0, 0)",
		"rgb(255, 255, 0)",
		"rgb(0, 255, 0)",
		"rgb(0, 255, 255)",
		"rgb(0, 0, 255)",
		"rgb(8, 33, 64)",
		"rgb(255, 0, 255)",
		"rgb(250, 60, 95)",
		"rgb(255, 150, 50)",
		"rgb(80, 10, 75)",
		"rgb(150, 0, 255)",
		"rgb(107, 110, 225)",
		"rgb(150, 70, 100)",
		"rgb(27, 233, 133)",
		"rgb(13, 100, 4)",
		"rgb(127, 66, 18)",
		"rgb(53, 16, 2)",
		"rgb(116, 112, 113)",
		"rgb(208, 220, 228)",
		"rgb(95, 135, 76)",
	]

	var len = warna.length;
	var chosen = [];

	for (var i = 0; i<num; i++) {
		var randy = Math.floor(Math.random() * len);  
		chosen[i] = warna[randy];

		for (k=0; k<=i-1; k++) {
			if (chosen[k] == chosen[i]) {
			i--;  // duplicate found so decrement i
			}
		}
	}

	return chosen;
}
