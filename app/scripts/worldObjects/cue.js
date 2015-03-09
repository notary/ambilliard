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
		if(whiteBall.isMoves()) return;
		this.vec = whiteBall.vec.clone() || new App.Vector(380, 180);
		this.tail =  this.game.mousePosition;
		this.pressed = this.game.mousePressed;
		if(this.pressed) {
			this.isShoot = true;
		}
		if(!this.pressed && this.isShoot) {
			this.isShoot = false;
			whiteBall.strike(this.speed, this.angle);
		}
	};

	App.World.Cue.Renderer = {
		init: function () {
			this.image = new Image();
			this.image.src = 'images/cue2.png';
		},

		render: function (cue, ctx) {
			if(cue.game.getWhiteBall().isMoves()) return;
			ctx.save();
			var pressedShift = new App.Vector(0, 0);
			if(cue.pressed) {
				var angle = cue.vec.vectorTo(cue.tail);
				cue.angle = angle.clone();
				cue.angle.normalize();
				var speed = angle;
				cue.speed = speed.length() > cue.maxPower ? (speed.normalize() && speed.add({x: 50, y: 50})) : speed;

				pressedShift.y = Math.abs(cue.tail.y - cue.pressed.y);
				pressedShift.y = pressedShift.y > cue.maxPower ? cue.maxPower : pressedShift.y;
			}

			ctx.translate(cue.vec.x, cue.vec.y);
			ctx.rotate(cue.vec.angleTo(cue.tail));
			ctx.translate(-cue.vec.x, -cue.vec.y);
			ctx.drawImage(this.image, cue.vec.x - this.image.width/2 - pressedShift.x, cue.vec.y - this.image.height/2 - pressedShift.y); //center of image - white ball
			ctx.restore();
		}
	};

	App.World.Cue.Renderer.init();
});