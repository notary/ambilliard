$(function () {
	window.App = window.App || {};
	App.World = App.World || {};
	App.World.User = User;

	function User (params) {
		App.World.WorldObject.call(this, params);
	};

	User.prototype.init = function () {
		this.isActive = false;
	};

	User.prototype = Object.create(App.World.WorldObject);
	User.constructor = User;
});