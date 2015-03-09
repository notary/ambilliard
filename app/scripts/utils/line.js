(function () {
	window.App = window.App || {};
	var Line = App.Line = function (start, end) {
		if (!start instanceof App.Vector || !end instanceof App.Vector)
			return null;
		this.start = start;
		this.end = end;
	};

	Line.prototype.ort = function () {
		var ort = this.start.vectorTo(this.end);
		ort.normalize();
		return ort;
	};

	Line.prototype.length = function () {
		return this.start.distanceTo(this.end);
	};
}());