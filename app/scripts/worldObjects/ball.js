$(function () {
	window.App = window.App || {};
	App.World = App.World || {};
	App.World.Ball = Ball;

	//var DIAMETR = 57; // mm
	//var RADIUS = Math.floor(57/2); // mm
	var WEIGHT = 160; //gram

	/**
	 * @param params: Object {number: Integer, type: enum(full, striped, white, black)}
	 * @constructor
	 * Ball Constructor (Abstract World Object child)
	 */
	function Ball (params) {
		App.World.WorldObject.apply(this, arguments);
		this.radius = Ball.RADIUS;
		this.speed = new App.Vector(0, 0);
		this.vec = new App.Vector(params.x, params.y);
	};

	Ball.prototype = Object.create(App.World.WorldObject);
	Ball.constructor = Ball;

	Ball.prototype.collision = function (worldObj) {
		var dist = this.vec.distanceTo(worldObj.vec);
		return dist <= this.radius + worldObj.radius;
	};

	Ball.prototype.strike = function (speed, angle) {
		angle = {
			x: 1,
			y: 1
		};
		//this.vec.rotate(angle);
		this.speed = {x: speed * angle.x, y: speed * angle.y};
	};

	Ball.prototype.move = function (friction) {
	//	this.speed = {x: Math.floor(this.speed.x * friction), y: Math.floor(this.speed.y * friction)};
	//	this.params.x = this.x += this.speed.x;
	//	this.params.y = this.y += this.speed.y;
	};

	Ball.prototype.step = function () {
		var objects = this.game.objects;
		for(var obj in objects) {
			if(objects[obj].type == 'Table') {
				this.speed = objects[obj].instance.withFriction(this.speed);
			}
			if(!objects[obj].instance.collision(this)) continue;
		}
		this.move();
	};

	//CONSTS
	Ball.RADIUS = 12;

	App.World.Ball.Renderer = {
		render: function (ball, ctx) {
			this._renderBall(ball, ctx);
		},

		_renderBall: function (ball, ctx) {
			ctx.arc(ball.params.x, ball.params.y, ball.radius, 0, 2*Math.PI);
			ctx.fillStyle = ball.params.color;
			ctx.fill();
		}
	};
});