$(function () {
	window.App = window.App || {};
	App.World = App.World || {};
	App.World.User = User;

	function User (params) {
		App.World.WorldObject.apply(this, arguments);
	};

	User.prototype.init = function () {
		this.isActive = false;
	};

	User.prototype = Object.create(App.World.WorldObject);
	User.constructor = User;
});