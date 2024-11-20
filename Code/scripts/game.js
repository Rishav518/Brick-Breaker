//Create variables to reference and store canvas 
let canvas = document.getElementById('gameCanvas');
let context = canvas.getContext('2d');
let ballRadius = 4;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 1;
let dy = -1;

//create the paddle
let paddleHeight = 5;
let paddleWidth = 40;

//specify starting point of paddle
let paddleX = (canvas.width - paddleWidth) / 2;

//holding variables for right and left arrows on keyboard
let rightPressed = false;
let leftPressed = false;

//holding variables for bricks
let brickRowCount = 4;
let brickColumnCount = 7;
let brickWidth = 37;
let brickHeight = 10;
let brickPadding = 2;
let brickOffsetTop = 10;
let brickOffsetLeft = 10;

//Create variables to take score
let score = 0;

let gameInterval;

//Creating arrays for the bricks
let bricks = [];
for (c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (r = 0; r < brickRowCount; r++) {
        //set the x and y position of the bricks
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

//Anchor paddle movement to mouse movement
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function keyDownHandler(e) {
    if (e.keyCode === 39) {
        rightPressed = true;
    }
    else if (e.keyCode === 37) {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if (e.keyCode === 39) {
        rightPressed = false;
    }
    else if (e.keyCode === 37) {
        leftPressed = false;
    }
}

function drawBall() {
    context.beginPath();
    //centered at (x,y) position with radius r = ballRadius starting at 0 = startAngle, ending at Math.PI*2 = endAngle (in Radians)
    context.arc(x, y, ballRadius, 0, Math.PI * 2); 
    context.fillStyle = 'red';
    context.fill();
    context.closePath();
}
//Create a function to create the paddle
function drawPaddle() {
    context.beginPath();
    //centered at (x,y) position with radius r = ballRadius starting at 0 = startAngle, ending at Math.PI*2 = endAngle (in Radians)
    context.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight); 
    context.fillStyle = 'red';
    context.fill();
    context.closePath();
}
//Create a function to draw the bricks
function drawBricks() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                context.beginPath();
                context.rect(brickX, brickY, brickWidth, brickHeight);
                context.fillStyle = '#b91c1c';
                context.fill();
                context.closePath();
            }
        }
    }
}
//Create function to keep track of score
function drawScore() {
    document.getElementById('score').innerHTML = 'Score: ' + score;
}

//Collision dections for the bricks
function collisionDetection() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score+=100;
                    if (score === brickRowCount * brickColumnCount) {
                        alert('Congratulations!! You\'ve won!');
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function draw() {
    //clear each instance of the canvas so a new circle can be drawn
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawScore();
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();
    //Calculate collision detections
    //left and right walls
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    //top walls
    if (y + dy < ballRadius) {
        dy = -dy;
    }
    else if (y + dy > canvas.height - ballRadius) {
        //detect paddle hits
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        //if no paddle hit, body of canvas is hit ==> game over
        else {
            gameOver();
        }
    }

    //bottom wall
    if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
        dy = -dy;
    }
    //Make paddle move
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    }
    else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    //Making the ball move
    //update x movement every frame
    x += dx; 
    //update y movement every frame
    y += dy; 
}

function gameStart(){
    document.getElementById('playButton').style.display = 'none';
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'block';
    document.getElementById("gameCanvas").click();
    document.getElementById("gameCanvas").click();
    gameInterval = setInterval(draw, 10);
}
function restart(){
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'block';
    gameInterval = setInterval(draw, 10);
    //reset score
    score=0;
    //reset bricks
    bricks = [];
    for (c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (r = 0; r < brickRowCount; r++) {
            //set the x and y position of the bricks
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}

function gameOver(){
    username = document.getElementById("userWelcome").innerHTML;
    //stop game
    clearInterval(gameInterval);
    //display gameOver message
    document.getElementById('gameOver').style.display = 'flex';
    document.getElementById('gameCanvas').style.display = 'none';
    document.getElementById('displayUsername').innerHTML = 'Username: ' + username;
    document.getElementById('displayScore').innerHTML = 'Score: ' + score;
    //save score to database
    saveScore();
    if(score>700){
        document.getElementById('displayPosition').innerHTML = 'Congratulations! You won';
    }

}
function saveScore() {
    const username = document.getElementById("userWelcome").innerHTML; 
    // Fetch usersDB from local cache
    let scoreDB = [
      { "username": "arkay", "score": 100 },
      { "username": "shika", "score": 200 },
      { "username": "dristiBhugun", "score": 300 },
      { "username": "rishav", "score": 300 },
      { "username": "sakshi", "score": 400 },
      { "username": "anabelle", "score": 500 },
      { "username": "kyler211", "score": 600 },
      { "username": "krish518", "score": 300 },
      { "username": "sushree735", "score": 200 },
      { "username": "mohit8775", "score": 400 }
    ];     
  
    // Save usersDB in local cache
    scoreDB.forEach(user => {
      if (user.username === username && user.score < score) {
        // Compare with the current user's score instead of the entire score array
        user.score = score;
        console.log("Greater score!");
      }
    });
  
    // Save to database
    localStorage.setItem('scoreDB', JSON.stringify(scoreDB));
  
    console.log(scoreDB);
  }
  
