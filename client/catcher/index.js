window.onload = function () {
	var gamepad = null;

	var canvas = document.getElementById('mainCanvas');
	var context = canvas.getContext('2d');

	var CIRCLE_GAP = Math.PI / 3;

	var state = 'disconnected';

	var balls = [];
	var pulses = [];
	var frame = 0;
	var points = 0;

	var framesPerBallPerSide = 120;
	var framesSinceLastLeftBall = framesPerBallPerSide / 2;
	var framesSinceLastRightBall = 0;
	var ballRadius = 10;

	var ballSpeed = 3;

	function render() {
		refreshGamepads(true);

		if (state === 'disconnected') {
			connectGamepadMessage();
		} else if (state === 'start screen') {
			startScreen();
		} else if (state === 'playing') {
			play();
		} else if (state === 'game over') {
			gameOver();
		}

		document.title = points;

		function connectGamepadMessage () {
			context.clearRect(0, 0, canvas.width, canvas.height);

			context.fillStyle = '#444';

			context.font = 'bold 48px sans-serif';
			var text1 = 'This game requires a gamepad.';
			var text1Width = context.measureText(text1).width;
			context.fillText(text1, canvas.width / 2 - text1Width / 2, 250);

			context.font = '36px sans-serif';
			var text2 = 'Press any button to get started.';
			var text2Width = context.measureText(text2).width;
			context.fillText(text2, canvas.width / 2 - text2Width / 2, 350);
		}

		function startScreen () {
			renderStartScreen();
			updateStartScreen();
		}

		function renderStartScreen () {
			context.clearRect(0, 0, canvas.width, canvas.height);

			context.fillStyle = '#444';

			context.font = 'bold 48px sans-serif';
			var text = 'Press A to start the game.';
			var textWidth = context.measureText(text).width;
			context.fillText(text, canvas.width / 2 - textWidth / 2, 300);
		}

		function updateStartScreen () {
			if (gamepad.buttons[0].pressed) {
				restart();
			}
		}

		function play () {
			drawPlay();
			updatePlay();
		}

		function drawPlay() {
			context.clearRect(0, 0, canvas.width, canvas.height);

			drawCircles();
			drawBalls();
			drawPulses();
		}

		function getCircleRadius () {
			var maxRadiusHeight = canvas.height / 4;
			var maxRadiusWidth = (canvas.width / 2) / 4;

			return Math.min(maxRadiusHeight, maxRadiusWidth) / 1.5;
		}

		function getControllerAngle (which) {
			var xAxis;
			var yAxis;

			if (which === 'left') {
				xAxis = 0;
				yAxis = 1;
			} else {
				xAxis = 2;
				yAxis = 3;
			}

			var angle = Math.atan(gamepad.axes[yAxis] / gamepad.axes[xAxis]);
			if (gamepad.axes[xAxis] < 0) {
				angle = angle - Math.PI;
			}

			return angle;
		}

		function drawCircles () {
			var radius = getCircleRadius();

			var leftAngle = getControllerAngle('left');
			var rightAngle = getControllerAngle('right');

			context.fillStyle = '#444';

			context.beginPath();
			context.arc(canvas.width / 4, canvas.height / 2, radius, leftAngle + CIRCLE_GAP / 2, leftAngle + 2 * Math.PI - CIRCLE_GAP / 2, false);
			context.arc(canvas.width / 4, canvas.height / 2, radius * 3 / 4, leftAngle + 2 * Math.PI - CIRCLE_GAP / 2, leftAngle + CIRCLE_GAP / 2, true);
			context.fill();

			context.beginPath();
			context.arc(canvas.width * 3 / 4, canvas.height / 2, radius, rightAngle + CIRCLE_GAP / 2, rightAngle + 2 * Math.PI - CIRCLE_GAP / 2, false);
			context.arc(canvas.width * 3 / 4, canvas.height / 2, radius * 3 / 4, rightAngle + 2 * Math.PI - CIRCLE_GAP / 2, rightAngle + CIRCLE_GAP / 2, true);
			context.fill();
		}

		function drawBalls () {
			for (var i = 0; i < balls.length; i++) {
				var angle = balls[i][1];
				var distance = balls[i][2];

				var x = canvas.width / 4 + distance * Math.cos(angle);
				var y = canvas.height / 2 + distance * Math.sin(angle);

				if (balls[i][0] === 'right') {
					x += canvas.width / 2;
				}

				var alpha = 1;
				if (distance < 50) {
					alpha = (distance + 50) / 100;
				}

				context.fillStyle = 'hsla(' + balls[i][4] + ', 100%, 60%, ' + alpha + ')';

				context.beginPath();
				context.arc(x, y, ballRadius, 0, Math.PI * 2, false);
				context.fill();
			}
		}

		function drawPulses () {
			for (var i = 0; i < pulses.length; i++) {
				context.strokeStyle = 'rgba(68, 68, 68, ' + ((300 - pulses[i][1]) / 300) + ')';
				context.lineWidth = 2;

				context.beginPath();
				if (pulses[i][0] === 'left') {
					context.arc(canvas.width / 4, canvas.height / 2, getCircleRadius() + pulses[i][1], 0, 2 * Math.PI, false);
				} else {
					context.arc(canvas.width * 3 / 4, canvas.height / 2, getCircleRadius() + pulses[i][1], 0, 2 * Math.PI, false);
				}
				context.stroke();
			}
		}

		function updatePlay () {
			if (framesSinceLastLeftBall >= framesPerBallPerSide) {
				generateBall('left');
				framesSinceLastLeftBall = 0;
			} else {
				if (Math.random() < .5)	// add some random
					framesSinceLastLeftBall += 2;
			}

			if (framesSinceLastRightBall >= framesPerBallPerSide) {
				generateBall('right');
				framesSinceLastRightBall = 0;
			} else {
				if (Math.random() < .5)	// add some random
					framesSinceLastRightBall += 2;
			}

			framesPerBallPerSide = 180 / Math.pow(points + 1, 1 / 4);
			ballSpeed = 2 + points / 40;

			for (var i = 0; i < balls.length; i++) {
				balls[i][2] -= ballSpeed;
				balls[i][4] = (balls[i][4] + 1) % 360;

				if (balls[i][2] < getCircleRadius() && !balls[i][3]) {
					balls[i][3] = true;

					var controllerAngle = getControllerAngle(balls[i][0]);
					if (controllerAngle < 0) {
						controllerAngle += 2 * Math.PI;
					}

					if (Math.abs(balls[i][1] - controllerAngle) < CIRCLE_GAP / 2) {
						points++;
						pulses.push([balls[i][0], 0]);
					} else {
						state = 'game over';
					}
				}
			}

			for (var i = 0; i < pulses.length; i++) {
				pulses[i][1] += 3;
			}

			balls = balls.filter((ball) => ball[2] > -50);
			pulses = pulses.filter((pulse) => pulse[1] > 0);
		}

		function generateBall (where) {
			var angle = Math.random() * Math.PI * 2;
			var distance = Math.max(canvas.width / 2, canvas.height) * Math.sqrt(2) / 2 + ballRadius;
			balls.push([where, Math.random() * Math.PI * 2, distance, false, Math.random() * 360]);
		}

		function gameOver () {
			drawGameOver();
			updateGameOver();
		}

		function drawGameOver () {
			context.clearRect(0, 0, canvas.width, canvas.height);

			context.fillStyle = '#444';

			context.font = 'bold 48px sans-serif';
			var text1 = 'YOU SUCK';
			var text1Width = context.measureText(text1).width;
			context.fillText(text1, canvas.width / 2 - text1Width / 2, 250);

			context.font = '36px sans-serif';
			var text2 = 'Score: ' + points;
			var text2Width = context.measureText(text2).width;
			context.fillText(text2, canvas.width / 2 - text2Width / 2, 350);

			context.font = '36px sans-serif';
			var text2 = 'Press A to restart.';
			var text2Width = context.measureText(text2).width;
			context.fillText(text2, canvas.width / 2 - text2Width / 2, 400);
		}

		function updateGameOver () {
			if (gamepad.buttons[0].pressed) {
				restart();
			}
		}

		function restart () {
			points = 0;
			frames = 0;
			state = 'playing';
			balls = [];
			pulses = [];
		}
		
		frame++;
		window.requestAnimationFrame(render);
	}

	function refreshGamepads(alreadyLoaded) {
		var gamepads = navigator.getGamepads();
		if (gamepads[0] === null) {
			state = 'disconnected';
			gamepad = null;
		} else {
			if (gamepad == null && alreadyLoaded) {
				restart();
			} else if (gamepad == null) {
				state = 'start screen';
			}
			gamepad = gamepads[0];
		}
	};

	refreshGamepads(false);
	window.addEventListener('gamepadconnected', refreshGamepads);
	window.addEventListener('gamepaddisconnected', refreshGamepads);

	render();
};