(function () {
	window.App = window.App || {};
	var Physics = window.App.Physics = function () {};

	Physics.prototype.collision = function (p1, p2, radius1, radius2) {
		radius1 = radius1 || 0;
		radius2 = radius2 || 0;
		if (p1 instanceof App.Line)
			return this.lineCollision(p1, p2, radius1);

		var p = p2.vec.clone();
		p = p.sub(p1.vec);
		return p.length() <= (radius1 + radius2);
	};

	Physics.prototype.lineCollision = function (line, p, radius) {
		radius = radius || 0;
		var ort = line.ort();
		var distance = (ort.x * p.y + ort.y * p.x) - Math.abs(line.start.vMultiply(line.end) / line.length());
		return Math.abs(distance) <= radius;
	};

	Physics.prototype.lineBound = function (line, p) {
		var mult = 1;
		if (!p || !p.speed) return;
		if (line.start.x == line.end.x) {
			mult = this._isPositive(p.speed.x) ? -1 : 1;
			p.vec.x = line.start.x + mult*p.radius;
			p.speed.x *= -1;
		} else if (line.start.y == line.end.y) {
			mult = this._isPositive(p.speed.y) ? -1 : 1;
			p.vec.y = line.start.y + mult*p.radius;
			p.speed.y *= -1;
		}
		return p;
	};

	Physics.prototype.bound = function (p1, p2) {
		if (p1 instanceof App.Line)
			return this.lineBound(p1, p2);

		if (!p2.speed) return;
		var angleV = p2.vec.vectorTo(p1.vec);
		var angle = angleV.angle();
		var distance = angleV.normalize();
		distance = p1.radius + p2.radius - distance + 1;
		var speed = p2.speed.length();
		p1.vec.add({ x: angleV.x * distance, y: angleV.y * distance });
		p1.speed = angleV.multiply({ x: speed, y: speed });

		angle = Math.abs(Math.cos(angle));
		p2.speed.multiply({x: angle, y: angle });
	};

	Physics.prototype._isPositive = function (value) {
		return value > 0;
	};

	window.App.Physics.instance = new Physics();
}());