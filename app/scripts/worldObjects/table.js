$(function () {
	window.App = window.App || {};
	App.World = App.World || {};
	App.World.Table = Table;

	var WIDTH = 2540; // mm
	var HEIGHT = 1270; // mm
	var MIDDLE_LOOSE_RADIUS = 130; // mm
	var ANGLE_LOOSE_RADIUS = 115; // mm
	var FRICTION = 0.2;
	/**
	 * @param params
	 * @constructor
	 * Table Constructor
	 */
	function Table (params) {
		App.World.WorldObject.call(this, params);
		this.friction = FRICTION;
		this.boards = {
			top: {from: new App.Vector(20, 20), to: new App.Vector(120, 20)},
			left: {from: new App.Vector(20, 20), to: new App.Vector(20, 70)},
			right: {from: new App.Vector(120, 20), to: new App.Vector(120, 70)},
			bottom: {from: new App.Vector(20, 70), to: new App.Vector(120, 70)}
		};
	};

	Table.prototype.collision = function (worldObj) {
		for(var board in this.boards) {
			if(this._distanceToBoard(board, worldObj.vec) <= worldObj.radius + this.radius) return true;
		}
		return false;
	};

	Table.prototype._distanceToBoard = function (board, vec) {
		var vector = null;
		if(board.from.x == board.to.x) vector = new App.Vector(board.to.x, vec.y);
		if(board.from.y == board.to.y) vector = new App.Vector(vec.x, board.to.y);
		return vector ? vec.distanceTo(vector) : 0;
	};

	Table.prototype = Object.create(App.World.WorldObject);
	Table.constructor = Table;

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