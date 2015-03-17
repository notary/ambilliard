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

		return p.length() < (radius1 + radius2);
	};

	Physics.prototype._moving = function (p1, p2) {
		var d = p1.radius + p2.radius;
		var v = p2.vec.vectorTo(p1.vec);
		var rd = Math.abs(v.length() - d) + 1;
		if(rd === d) return;
		v = v.negative();
		v.normalize();
		v.multiply({x: rd, y: rd});
		p2.vec.add(v);
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
		var movePoint = {
			speed: null,
			radius: 0,
			vec: new App.Vector(0, 0)
		};
		if (line.start.x == line.end.x) {
			movePoint.vec.add({x: line.start.x, y: p.vec.y});
			this._moving(movePoint, p);
			mult = this._isPositive(p.speed.x) ? -1 : 1;
			p.vec.x = line.start.x + mult*p.radius;
			p.speed.x *= -1;
		} else if (line.start.y == line.end.y) {
			movePoint.vec.add({x: p.vec.x, y: line.start.y});
			this._moving(movePoint, p);
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
		if (!p1.speed) {
			p1.speed = {
				length: function () {return 0;}
			};
		}
		var speed = p1.speed.length() + p2.speed.length();

		this._moving(p1, p2);

		var vtoNext = p2.vec.clone().add(p2.speed);
		var fi = vtoNext.angleTo(p1.vec);
		var angle1 = (Math.PI - fi)/2;
		var angle2 = Math.atan(Math.sin(fi)/(2*Math.cos(fi)));
		if(angle1 < 0) {
			//angle1 = angle1 + Math.PI;
			//angle2 = angle2;
		}		
		var baseSpeed = speed;
		var speed1 = Math.abs(baseSpeed * Math.sin(fi/2));
		var speed2 = baseSpeed - speed1;

		var v1 = vtoNext.clone();
		v1.rotate(angle1);
		v1.normalize();
		p1.speed = v1.multiply({x: speed1, y: speed1});
		p1.speed = p1.speed.negative();

		vtoNext.rotate(angle2);
		vtoNext.normalize();
		p2.speed = vtoNext.multiply({x: speed2, y: speed2});
		p2.speed = p2.speed.negative();
	};

	Physics.prototype._isPositive = function (value) {
		return value > 0;
	};

	window.App.Physics.instance = new Physics();
}());