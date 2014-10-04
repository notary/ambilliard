var extend = require('../../core/utils/utils').extend;
var contextLoader = require('./context-loader/context-loader');
var actionInvoker = require('./action-invoker');
var webSocket = require('nodejs-websocket');

contextLoader = new contextLoader();

var defaultConfig = {
	port: 8089
};

var _server = null;

function Server () {};

Server.prototype.start = function (serverConfig) {
	this.config = extend(defaultConfig, serverConfig);
	_server = webSocket.createServer(function (connection) {
		connection.on('text', this.onMessage.bind(this, connection));
		connection.on('error', this.onError.bind(this, connection));
	}.bind(this));
	_server.listen(this.config.port);
};

/**
 *
 * @param connection
 * @param message Object {user: {name: String}, action: {name: String, arguments: {}}}
 */

Server.prototype.onMessage = function (connection, message) {
	message = JSON.parse(message);
	if(!validateMessage(message)) return;
	var context = contextLoader.getContext(message, connection);
	var action = message.action;
	actionInvoker.invoke(action.name, action.arguments, context, connection);
};

Server.prototype.onError = function (connection, error) {
	console.log(error);
};

Server.prototype.connections = function () {
	return _server.connections;
};

function validateMessage (message) {
	if(!message) return false;
	var errorCount = 0;
	!message.user && errorCount++;
	!message.action && errorCount++;

	return errorCount == 0;
}

var instance = new Server();

module.exports = {
	instance: instance
};