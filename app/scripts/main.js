$(function () {
	window.App = window.App || {};

	var Main = window.App.Main = {
		init: function () {
			this.client = new App.Client().createConnection();
			this.client.on('open', function () {
				this.game = new App.Game(this.client);
			}.bind(this));
		}
	};

	Main.init();
});