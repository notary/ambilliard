$(function () {
	window.App = window.App || {};
	window.App.Utils = {
		invokeQueue: function (fn) {
			if(typeof fn != 'array') fn = [fn];
			for(var i=0; i < fn.length; i++)
				setTimeout(fn[i], 0);
		}
	};
});