$(function () {
	window.App = window.App || {};
	App.Client = Client;
	App.Message = Message;

	var defaultParams = {
		host: window.location.hostname,
		port: 8089
	};
	var connection = null;

	function Client (host, port) {
		this.params = $.extend(defaultParams, {host: host, port: port});
	}

	Client.prototype.createConnection = function () {
		connection = new WebSocket('ws://' + this.params.host + ':' + this.params.port);
		connection.onopen = this.onOpen.bind(this);
		connection.onclose = this.onClose.bind(this);
		connection.onerror = this.onError.bind(this);
		connection.onmessage = this.onMessage.bind(this);
		return this;
	};

	Client.prototype.on = function (name, callback) {
		this.eventListeners = this.eventListeners || {};
		if(!this.eventListeners[name]) this.eventListeners[name] = [];
		this.eventListeners[name].push(callback);
	};

	Client.prototype.off = function (name, callback) {
		var listeners = this.eventListeners[name];
		if(!listeners) return;
		for(var i=0; i < listeners.length; i++)
			listeners[i] && listeners[i] === callback && listeners.splice(i, 1);
	};

	Client.prototype.emit = function (name, params) {
		var listeners = this.eventListeners[name];
		if(!listeners) return;
		for(var i=0; i < listeners.length; i++)
			listeners[i] && listeners[i](params);
	};

	Client.prototype.onOpen = function () {
		this.emit('open');
	};

	Client.prototype.onClose = function () {
		this.emit('close');
	};

	Client.prototype.onError = function () {
		this.emit('error');
	};

	Client.prototype.onMessage = function (e) {
		this.emit('message', JSON.parse(e));
	};

	Client.prototype.send = function (message) {
		connection.send(message.getBody());
	};


	var defaultMessage = {
		action: {
			action: 'text',
			arguments: {}
		}
	};

	/**
	 *
	 * @param action Object | {action: String, arguments: Object}
	 * @constructor
	 */
	function Message (action) {
		this.params = $.extend(defaultMessage, action);
	};

	Message.prototype.getBody = function () {
		return JSON.stringify(this.params);
	};
});