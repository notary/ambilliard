function User (name, type, id) {
	this.name = name;
	this.type = type;
	this.id = id;
};

var users = {};

var contextLoaders = {};

function ContextLoader () {
	this.registerContextLoader('user', function (message, connection) {
//		if(!users[connection.key]) {
//			users[connection.key] = new User(message.user.name, genNewUserType(), connection.key);
//		}
		return {
			user: users[connection.key]
		};
	});
}

ContextLoader.prototype.registerContextLoader = function (name, fn) {
	contextLoaders[name] = fn;
};

ContextLoader.prototype.getContext = function (message, connection) {
	var context = {};
	for(var loader in contextLoaders) {
		context[loader] = contextLoaders[loader](message, connection);
	}
	return context;
};

function genNewUserType () {
	return Object.keys(users).length >= 2 ? 'viewer' : 'player';
}

module.exports = ContextLoader;