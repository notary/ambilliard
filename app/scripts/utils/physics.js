(function () {
	window.App = window.App || {};
	var Physics = window.App.Physics = function () {};

	Physics.prototype.collision = function (p1, p2, radius1, radius2) {
		radius1 = radius1 || 0;
		radius2 = radius2 || 0;
		var p = p2.clone();
		p = p.sub(p1);
		return p.length() < (radius1 + radius2);
	};

	Physics.prototype.lineCollision = function (line, p, radius) {
		radius = radius || 0;
		var ort = line.ort();
		var distance = (ort.x * p.y + ort.y * p.x) - Math.abs(line.start.vMultiply(line.end) / line.length());
		return Math.abs(distance) <= radius;
	};

	Physics.prototype.lineBound = function (line, p) {
		if(!p) return;
		if(line.start.x == line.end.x) p.x *= -1;
		if(line.start.y == line.end.y) p.y *= -1;
		return p;
	};

	window.App.Physics.instance = new Physics();
}());