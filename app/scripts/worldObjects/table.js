$(function () {
	window.App = window.App || {};
	App.World = App.World || {};
	App.World.Table = Table;

	var WIDTH = 2540; // mm
	var HEIGHT = 1270; // mm
	var MIDDLE_LOOSE_RADIUS = 130; // mm
	var ANGLE_LOOSE_RADIUS = 115; // mm
	var FRICTION = 2;
	/**
	 * @param params
	 * @constructor
	 * Table Constructor
	 */
	function Table (params) {
		App.World.WorldObject.apply(this, arguments);
		this.friction = FRICTION;
		this.boards = {
			top: new App.Line(new App.Vector(134, 84), new App.Vector(678, 84)),
			left: new App.Line(new App.Vector(114, 102), new App.Vector(114, 350)),
			right: new App.Line(new App.Vector(701, 102), new App.Vector(701, 350)),
			bottom: new App.Line(new App.Vector(134, 372), new App.Vector(678, 372))
		};
	};

	Table.prototype = Object.create(App.World.WorldObject);
	Table.constructor = Table;

	Table.prototype.collision = function (worldObj) {
		var boards = this.boards;
		for (var board in boards) {
			var isCollision = App.Physics.instance.lineCollision(this.boards[board], worldObj.vec, worldObj.radius + this.radius);
			if(isCollision)
				return {board: this.boards[board]};
		}
		return false;
	};


	Table.prototype.withFriction = function (speed) {
		if(!speed) return null;
		var minSpeed = 0.001;
		var friction = this.friction / this.game.FPS;
		speed.set(speed.x - speed.x * friction, speed.y - speed.y * friction);
		if(speed.length() < minSpeed) speed = null;
		return speed;
	};


	var image = null;
	App.World.Table.Renderer = {
		init: function () {
			image = new Image();
			image.src = 'images/table.jpg';
		},

		render: function (table, ctx) {
			ctx.drawImage(image, 0, 0);
		}
	};

	App.World.Table.Renderer.init();
});