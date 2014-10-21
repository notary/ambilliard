$(function () {
	window.App = window.App || {};
	App.World = App.World || {};
	App.World.WorldObject = WorldObject;

	/**
	 * @param params
	 * @param type
	 * @constructor
	 * Abstract World Object
	 */
	function WorldObject (params, game) {
		this.params = params;
		this.game = game;
		this.init && this.init.call(this, params);
		this._parent = function F () {};
		this.radius = 0;
	};

	WorldObject.prototype.collision = function (worldObj) {
		// override me
	};
});