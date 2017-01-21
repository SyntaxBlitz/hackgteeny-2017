window.onload = function () {

    var WIDTH = 800;
    var HEIGHT = 600;
    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");
    var x = canvas.width/2;
    var y = canvas.height-30;
    var dx = 2;
    var dy = -2;
    var ballRadius = 20;
    var paddleHeight = 20;
    var paddleWidth = 20;
    var playHeight = canvas.height;
    var playWidth = canvas.width;
    var paddleX = (canvas.width - paddleWidth) / 2;
    var paddleY = (canvas.height - paddleHeight) / 2;
    var lost = false;
    var rightPressed = false;
    var leftPressed = false;
    var upPressed = false;
    var downPressed = false;
    var distanceX = (paddleX - x);
    var distanceY = (paddleY - y);
    var distance;

    document.addEventListener("mousemove", mouseMoveHandler, false);

    function mouseMoveHandler(e) {
        var relativeX = e.clientX - canvas.offsetLeft;
        var relativeY = e.clientY - canvas.offsetTop;
        if(relativeX > 0 && relativeX < playWidth)
            paddleX = relativeX - paddleWidth/2;
        if(relativeY > 0 && relativeY < playHeight)
            paddleY = relativeY - paddleHeight/2;
    }

    function render() {

        draw();

    }

    render();
    setInterval(render, 10);

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawBall();
        drawPaddle();

        // Ball Movement

        if(x + dx > playWidth-ballRadius || x + dx < ballRadius)
            dx = -dx;
        if(y + dy > playHeight-ballRadius || y + dy < ballRadius)
            dy = -dy;

        x += dx;
        y += dy;
        distanceX = (paddleX - x);
        distanceY = (paddleY - y);


        distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        if(distance < paddleHeight / 2 + ballRadius) {
            alert("GAME OVER");
            document.location.reload();
        }
        playHeight -= 1;
        playWidth -= 1;



    }



    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI*2);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, paddleY , paddleWidth, paddleHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }
}