var actions = {};

function ActionInvoker () {};

/**
 *
 * @param actionName String
 * @param callback Function (arguments: Object, context: Object, connection: Object)
 */
ActionInvoker.prototype.register = function (actionName, callback) {
	actions[actionName] = callback;
};

ActionInvoker.prototype.invoke = function (actionName, arguments, context, connection) {
	var action = actions[actionName];
	if(!action) return;
	return action(arguments, context, connection);
};

var invoker = new ActionInvoker();

module.exports = invoker;