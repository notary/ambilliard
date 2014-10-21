$(function () {
	window.App = window.App || {};
	App.World = App.World || {};
	App.World.Cue = Cue;

	var LENGTH = 1020; // mm
	var WEIGTH = 400; // gram
	var DIAMETR  = 10; // mm
	var RADIUS = 5; //mm
	/**
	 * @param params
	 * @constructor
	 * Cue Constructor
	 */
	function Cue (params) {
		App.World.WorldObject.apply(this, arguments);
		this.vec = new App.Vector(params.x, params.y);
		this.radius = RADIUS;
		this.speed = new App.Vector(0, 0);
		this.maxPower = 50;
		this.isShoot = false;
	};

	Cue.prototype = Object.create(App.World.WorldObject);
	Cue.constructor = Cue;

	Cue.prototype.collision = function () {
		return false;
	};

	Cue.prototype.step = function () {
		var whiteBall = this.game.getWhiteBall();
		this.vec = whiteBall.vec.clone() || new App.Vector(380, 180);
		this.tail =  this.game.mousePosition;
		this.pressed = this.game.mousePressed;
		if(this.pressed) {
			this.isLeft = this.vec.x > this.pressed.x;
			this.isShoot = true;
		}
		if(!this.pressed && this.isShoot) {
			this.isShoot = false;
			whiteBall.strike(this.speed, this.vec.angleTo(this.tail) - Math.PI/2);
		}
	};

	App.World.Cue.Renderer = {
		init: function () {
			this.image = new Image();
			this.image.src = 'images/cue2.png';
		},

		render: function (cue, ctx) {
			ctx.save();
			var pressedShift = new App.Vector(0, 0);
			if(cue.pressed) {
				if((cue.isLeft && cue.tail.x > cue.pressed.x) || (!cue.isLeft && cue.tail.x < cue.pressed.x))
					cue.tail.x = cue.pressed.x;
				pressedShift.x = Math.abs(cue.tail.x - cue.pressed.x);
				pressedShift.x = pressedShift.x > cue.maxPower ? cue.maxPower : pressedShift.x;
				pressedShift.x = -pressedShift.x;
				cue.speed.x = pressedShift.x;
			}

			ctx.translate(cue.vec.x, cue.vec.y);
			//console.log(cue.vec.angleTo(cue.tail), cue.tail, cue);
			ctx.rotate(cue.vec.angleTo(cue.tail));
			ctx.translate(-cue.vec.x, -cue.vec.y);
			ctx.drawImage(this.image, cue.vec.x - this.image.width/2 - pressedShift.x, cue.vec.y - this.image.height/2 - pressedShift.y); //center of image - white ball
			ctx.restore();
		}
	};

	App.World.Cue.Renderer.init();
});