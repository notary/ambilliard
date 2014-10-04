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
		App.World.WorldObject.call(this, params);
		this.vec = new App.Vector(params.x, params.y);
		this.radius = RADIUS;
		this.speed = new App.Vector(0, 0);
	};

	Cue.prototype = Object.create(App.World.WorldObject);
	Cue.constructor = Cue;

	App.World.Cue.Renderer = {
		render: function (cue) {

		}
	};
});