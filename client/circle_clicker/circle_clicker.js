window.onload = function () {
	var WIDTH = 800;
	var HEIGHT = 600;

	var canvas = document.getElementById('gameCanvas');
	var context = canvas.getContext('2d');

	var rects = [];
	var points = 0;

	var lost = false;

	function render() {
		context.clearRect(0, 0, WIDTH, HEIGHT);

		context.fillStyle = 'black';
		context.font = '36px sans-serif';
		context.fillText('Points: ' + points, 10, 50);

		for (var i = 0; i < rects.length; i++) {
			context.fillStyle = 'hsl(' + rects[i][2] + ', 100%, 50%)';
			context.fillRect(rects[i][0], rects[i][1], 50, 50);
			rects[i][2] = rects[i][2] + 1;
			rects[i][2] = rects[i][2] % 360;
		}

		if (rects.length > 10) {
			lost = true;
		}

		if (!lost) {
			if (Math.random() < (1 / (60 / (points / 5 + 1)))) {
				var x = Math.random() * (WIDTH - 50);
				var y = Math.random() * (HEIGHT - 50);

				rects.push([x, y, 0]);
			}

			window.requestAnimationFrame(render);
		} else {
			alert('You lost');
		}
	}

	render();

	document.body.onclick = function (event) {
		var xClicked = event.clientX;
		var yClicked = event.clientY;

		var removedIndex = -1;

		for (var i = 0; i < rects.length; i++) {
			if (xClicked >= rects[i][0]
				&& xClicked < rects[i][0] + 50
				&& yClicked >= rects[i][1]
				&& yClicked < rects[i][1] + 50) {
				removedIndex = i;
				break;
			}
		}

		if (removedIndex !== -1) {
			rects.splice(i, 1);
			points++;
		}
	};
};