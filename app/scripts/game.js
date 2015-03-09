$(function () {
	window.App = window.App || {};
	App.Game = Game;

	var FPS = 60;

	/**
	 * Game events from server
	 * @type {{on:game:create: string}}
	 */
	var gameListenEvents = {
		'on:game:create': '_onGameCreate'
	};

	var gameStates = {
		starting: 0,
		breaking: 1,
		game: 2,
		end: 3
	};

	var objectRegistry = {};

	function Game (wsClient) {
		this.objId = 0;
		this.wsClient = wsClient;
		this.objects = [];
		this.stateObjects = [];
		this.users = {};
		this.state = gameStates.starting;
		this.mousePosition = new App.Vector(0, 0);
		this.mousePressed = null;
		this.el = document.getElementById('game-area');
		this.renderer = new GameRenderer(this, FPS);
		this.whiteBallObjId = null;
		this._events();
		this.FPS = FPS;

		window.debug = this;

		this.run('you', 'enemy');
	}

	Game.prototype._events = function () {
		//this.wsClient.on('message', this._onMessage.bind(this));
		this.el.addEventListener('mousemove', this._onMouseMove.bind(this));
		this.el.addEventListener('mousedown', this._onMouseDown.bind(this));
		this.el.addEventListener('mouseup', this._onMouseUp.bind(this));
	};

	Game.prototype.run = function (user, enemyUser) {
		this.objects = [];
		this.users = {
			user: new App.World.User({name: user}),
			enemy: new App.World.User({name: enemyUser})
		};

		//this.client.send(new App.Message({action: {name: 'user:register'}, user: this.users.user}));
		//this.wsClient.send(new App.Message({action: {name: 'game:create'}, user: this.users.user}));
		this.createWorld();
		this.state = gameStates.breaking;
		this.renderer.startRenderCycle(function () {
			this.loop();
		}.bind(this));
	};

	Game.prototype.loop = function () {
		if([gameStates.starting, gameStates.end].indexOf(this.state) >= 0) return;

		for(var i=0; i< this.objects.length; i++) {
			var obj = this.objects[i];
			obj.instance.step && obj.instance.step();
		}

		this.renderer.render(this.objects);
	};

	Game.prototype.collision = function () {

	};

	Game.prototype.createWorld = function () {
		this.createWorldObject('Table', {});
		this.createWorldObject('Cue', {});
		this.whiteBallObjId = this.createWorldObject('Ball', {number: 0, type: 'white', color: '#ffffff', x: 580, y: 225});
//		for(var i=1; i<=15; i++) {
//			if(i == 8) this.createWorldObject('Ball', {number: 8, type: 'black', color: '#000000', x: 50, y:0});
//			this.createWorldObject('Ball', {
//				number: i,
//				type: i < 8 ? 'full': 'striped',
//				color: '#ff0000',
//				x: 180,
//				y: 57*i
//			});
//		}
	};

	Game.prototype._onMessage = function (params) {
		var action = params.action;
		action = gameListenEvents[action];
		action && action.call(this, params.arguments);
	};

	Game.prototype._onMouseMove = function (e) {
		this.mousePosition = new App.Vector(e.x, e.y);
	};

	Game.prototype._onMouseDown = function (e) {
		this.mousePressed = new App.Vector(e.x, e.y);
	};

	Game.prototype._onMouseUp = function () {
		this.mousePressed = null;
	};

	Game.prototype._onGameCreate = function (arguments) {
		this.createWorldObject('Ball', {number: 8, color: 'black', type: 'full'});
	};

	Game.prototype.getWhiteBall = function () {
		if (!this.whiteBallObjId) return null;
		return this.objects[this.whiteBallObjId - 1].instance;
	};

	Game.prototype.createWorldObject = function (type, params) {
		var obj = new objectRegistry[type](params, this);
		obj.objectId = ++this.objId;
		this.objects.push({type: type, instance: obj});
		return obj.objectId;
	};

	Game.prototype.deleteWorldObject = function (worldObject) {
		for(var i=0; i < this.objects.length; i++) {
			if(this.objects[i].instance == worldObject)
				return this.objects.splice(i, 1);
		}
	};

	Game.prototype.dispose = function () {
		this.wsClient.off('message', this._onMessage.bind(this));
	};

	Game.registry = function (type, constructor) {
		objectRegistry[type] = constructor;
	};


	/**
	 * Game Renderer; using it for render game world
	 * @constructor
	 */
	function GameRenderer (game, fps) {
		this.drawingControl = game.el;
		this.drawingControl.width = 1200;
		this.drawingControl.height = 1200;
		this.canvas = this.drawingControl.getContext('2d');
		this.SECOND = 1000;
		this.fps = fps;
		this.renderPeriod = this.SECOND/this.fps;
		this.renderTimeout = null;
	};

	GameRenderer.prototype.startRenderCycle = function (callback) {
		var period = 0;
		this._iterate(period, callback)();
	};

	GameRenderer.prototype._iterate = function (period, callback) {
		var self = this;
		return function () {
			callback();
			period = self.renderPeriod;
			return (self.renderTimeout = setTimeout(function () {
					self._iterate(period, callback)();
				},
				period));
		};
	};

	GameRenderer.prototype.render = function (objects) {
		this.canvas.clearRect(0, 0, this.drawingControl.width, this.drawingControl.height);
		for(var i=0; i<objects.length; i++) {
			var obj = objects[i];
			var renderer = null;
			if((renderer = App.World[obj.type]['Renderer'])) {
				this.canvas.beginPath();
				renderer.render(obj.instance, this.canvas);
				this.canvas.closePath();
			}
		}
	};

	GameRenderer.prototype.stopRenderCycle = function () {
		clearTimeout(this.renderTimeout);
	};


	for(var worldObj in App.World) {
		if(worldObj == 'WorldObject') continue;
		Game.registry(worldObj, App.World[worldObj]);
	}
});