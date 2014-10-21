(function () {
	window.App = window.App || {};
	var Vector = window.App.Vector = function (x, y) {
		this.x = x;
		this.y = y;
	};

	Vector.prototype.set = function (x, y) {
		if(!y) {
			this.x = x.x;
			this.y = x.y;
		} else {
			this.x = x;
			this.y = y;
		}
	};

	Vector.prototype.clear = function () {
		this.x = 0.0;
		this.y = 0.0;
	};

	Vector.prototype.negative = function () {
		return new Vector(-this.x, -this.y);
	};

	Vector.prototype.add = function (vec) {
		this.x += vec.x;
		this.y += vec.y;
		return this;
	};

	Vector.prototype.sub = function (vec) {
		this.x -= vec.x;
		this.y -= vec.y;
		return this;
	};

	Vector.prototype.multiply = function (vec) {
		this.x *= vec.x;
		this.y *= vec.y;
		return this;
	};

	Vector.prototype.div = function (vec) {
		this.x /= vec.x;
		this.y /= vec.y;
		return this;
	};

	Vector.prototype.length = function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	};

	Vector.prototype.normalize = function() {
		var length = this.length();
		if (length < Number.MIN_VALUE)
		{
			return 0.0;
		}
		var invLength = 1.0 / length;
		this.x *= invLength;
		this.y *= invLength;

		return length;
	};

	Vector.prototype.angle = function () {
		var x = this.x;
		var y = this.y;
		if (x == 0) {
			return (y > 0) ? (3 * Math.PI) / 2 : Math.PI / 2;
		}
		var result = Math.atan(y/x);

		result += Math.PI/2;
		if (x < 0) result = result - Math.PI;
		return result;
	};

	Vector.prototype.distanceTo = function (v) {
		var difX = v.x - this.x;
		var difY = v.y - this.y;
		return Math.sqrt(difX * difX + difY * difY);
	};

	Vector.prototype.angleTo = function (v) {
		var v = this.vectorTo(v);
		return v.angle();
	};

	Vector.prototype.vectorTo = function (v) {
		return new Vector(v.x - this.x, v.y - this.y);
	};

	Vector.prototype.rotate = function (angle) {
		var length = this.length();
		this.x = Math.sin(angle) * length;
		this.y = Math.cos(angle) * (-length);
		return this;
	};

	Vector.prototype.clone = function () {
		return new Vector(this.x, this.y);
	}
}());
