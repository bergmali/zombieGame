/*
 * Module main
 * author: Julia Bergmayr
 * version: 1.0
 */

/*
 * main program, starts the game
 */
var game = new Game();
var numZombies = 0;
var score = 0;
var actZombie = new Object();
var interval = new Object();
var iframe;
var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

/**
 * Load all images exactly once (Singleton)
 */
var images = new function () {
	// Define images
	this.background = new Image();
	this.zombie = new Image();
	this.weapon = new Image();
	this.water = new Image();

	var numImages = 4;
	var imgLoaded = 0;
	// Make sure all images are loaded before starting the game
	function imageLoaded() {
		imgLoaded++;
		if (imgLoaded === numImages) {
			game.init();
		}
	}
	this.background.onload = function () {
		imageLoaded();
	}
	this.zombie.onload = function () {
		imageLoaded();
	}
	this.weapon.onload = function () {
		imageLoaded();
	}
	this.water.onload = function () {
		imageLoaded();
	}

	// Set imagesource
	this.background.src = "images/background.png";
	this.zombie.src = "images/zombie.png";
	this.weapon.src = "images/weapon.png";
	this.water.src = "images/water.png"

};

function start() {
	this.game.background.draw();
	console.log('numZombies' + numZombies);

	animate();

}

function animate() {
	clearInterval(interval);
	interval = setInterval(function () {
			timer()
		}, 2000);
	function timer() {
		if (numZombies < 100) {
			actZombie = new Zombie()
			actZombie.draw();
			
		} else {
			gameOver();
		}
	}
	function gameOver() {
		game.clear();
		console.log('gameOver');
		clearInterval(interval);
		window.document.location.href='gameOver.html';

	}
}

function canvasClicked(e) {
	console.log("canvas clicked");
	var zombieX = actZombie.x + images.zombie.width/2;
	var zombieY = actZombie.y + images.zombie.height/2;
	var r = 10;
	var posX;
	var posY;
	if (e.pageX || e.pageY) {
      posX = e.pageX;
      posY = e.pageY;
	}
	
	// distance position to middle of zombie
	var dx = posX - zombieX;
	var dy = posY - zombieY;
	// checking if click was within the specified radius
	if((dx*dx + dy*dy) <= (r*r)){
		score++;
		var div = document.getElementById("score");
		div.innerHTML = "Score: " + score +"/100";
		return;
	}	
}

function Drawable() {
	this.init = function (x, y, width, height) {
		// Default variables
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	this.canvasWidth = 0;
	this.canvasHeight = 0;

	// Define abstract functions to be implemented in child objects
	this.draw = function () {};
	this.delay = function () {};
	this.fadeOut = function () {};
	this.hit = function () {};

}

function Zombie() {
	var w = images.zombie.width;
	var h = images.zombie.height;
	this.x = Math.floor(Math.random() * (this.canvasWidth - w)); // -10))+5
	this.y = Math.floor(Math.random() * (this.canvasHeight - h)); // * (this.canvasHeight-this.height)).toFixed();
	
	this.draw = function () {
		numZombies++;
		this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		this.context.drawImage(images.zombie, this.x, this.y, w, h);
		console.log('Draw Zombie Nr.' + numZombies);
	}
	
	// implement hit-function to check if the zombie was hit
	this.hit = function () {
		
	}
}
Zombie.prototype = new Drawable();

function Background() {

	this.draw = function () {
		this.context.drawImage(images.background, this.x, this.y, w, h);
		console.log('Draw background');
	};
}
Background.prototype = new Drawable();

/**
 * initialize objects, start game
 */
function Game() {
	console.log('new Game');
	this.init = function () {
		// get the canvas elements to be used for drawing
		this.bgCanvas = document.getElementById('background');
		this.mainCanvas = document.getElementById('main');

		this.mainCanvas.width = w;
		this.mainCanvas.height = h;
		this.bgCanvas.width = w;
		this.bgCanvas.height = h; 

		if (!this.bgCanvas || !this.mainCanvas) {
			throw new util.RuntimeError("drawing_area not found", this);
		}
		
		this.mainCanvas.addEventListener("click", canvasClicked, false);

		// get 2D rendering context for canvas element
		this.bgContext = this.bgCanvas.getContext("2d");
		this.mainContext = this.mainCanvas.getContext("2d");
		if (!this.bgContext || !this.mainContext) {
			throw new util.RuntimeError("could not create 2D rendering context", this);
		}
		Background.prototype.context = this.bgContext;
		Background.prototype.canvasWidth = this.bgCanvas.width;
		Background.prototype.canvasHeight = this.bgCanvas.height;

		Zombie.prototype.context = this.mainContext;
		Zombie.prototype.canvasWidth = this.mainCanvas.width;
		Zombie.prototype.canvasHeight = this.mainCanvas.height;

		this.background = new Background();
		this.background.init(0, 0);
		this.zombie = new Zombie();
		
		start();
	}
	this.clear = function () {
		this.mainContext.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
	}
};
