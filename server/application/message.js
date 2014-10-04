function Message (actionName, arguments) {
	this.attributes = {
		action: actionName,
		arguments: arguments
	};
}

Message.prototype.getBody = function () {
	return JSON.stringify(this.attributes);
}

module.exports = Message;

