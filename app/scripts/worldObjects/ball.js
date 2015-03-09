$(function () {
	window.App = window.App || {};
	App.World = App.World || {};
	App.World.Ball = Ball;

	//var DIAMETR = 57; // mm
	//var RADIUS = Math.floor(57/2); // mm
	var WEIGHT = 0.12; //gram

	/**
	 * @param params: Object {number: Integer, type: enum(full, striped, white, black)}
	 * @constructor
	 * Ball Constructor (Abstract World Object child)
	 */
	function Ball (params) {
		App.World.WorldObject.apply(this, arguments);
		this.radius = Ball.RADIUS;
		this.speed = null;
		this.state = 'sleep';
		this.vec = new App.Vector(params.x, params.y);
	};

	Ball.prototype = Object.create(App.World.WorldObject);
	Ball.constructor = Ball;

	Ball.prototype.collision = function (worldObj) {
		var dist = this.vec.distanceTo(worldObj.vec);
		return dist <= this.radius + worldObj.radius;
	};

	Ball.prototype.strike = function (speed, angle) {
		this.speed = new App.Vector((speed.x * angle.x), (speed.y * angle.y));
		this.speed = this.speed.negative();
	};

	Ball.prototype.move = function () {
		if(!this.speed || !this.speed.x) {
			this.state = 'sleep';
			return;
		}
		this.state = 'moves';
		this.params.x += this.speed.x;
		this.params.y += this.speed.y;
		this.vec.set(this.params);
	};

	Ball.prototype.isMoves = function () {
		return this.state === 'moves';
	};

	Ball.prototype.step = function () {
		var objects = this.game.objects;
		for(var obj in objects) {
			if(objects[obj].instance.objectId === this.objectId) continue;
			if(objects[obj].type == 'Table') {
				this.speed = objects[obj].instance.withFriction(this.speed);
			}
			var collision = objects[obj].instance.collision(this);
			if(!collision) continue;
			if(objects[obj].type == 'Table') {
				this.speed = App.Physics.instance.lineBound(collision.board, this.speed);
			} else {
				if(!this.speed) continue;
				var vec = this.vec.clone();
				vec.add(this.speed.x, this.speed.y);
				vec.normalize();
				var vecToBall = this.vec.vectorTo(objects[obj].instance.vec);
				vec = vec.vectorTo(vecToBall).negative();
				vecToBall.normalize();
				objects[obj].instance.speed = new App.Vector(
					this.speed.length() * vecToBall.x - WEIGHT,  //use friction
					this.speed.length() * vecToBall.y - WEIGHT
				);
			}
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
			ctx.arc(ball.vec.x, ball.vec.y, ball.radius, 0, 2*Math.PI);
			ctx.fillStyle = ball.params.color;
			ctx.fill();
		}
	};
});