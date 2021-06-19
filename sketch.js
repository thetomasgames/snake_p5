const directions = Object.freeze({ "left": 1, "right": 2, "up": 3, "down": 4 })
const gridSize = 10
const maxWidth = 80
const maxHeight = 50

let snakeBody;
let playing;
let snakeDirection;
let lastMovementDirection;
let startTimestamp;
let speed;

function setup() {
  startTimestamp = new Date()
  snakeBody = []
  playing = true
  lastMovementDirection = snakeDirection = directions.right;
  speed = 15;
  for (let i = 0; i < 10; i++) {
    snakeBody.unshift([i, 1]);
  }
  createCanvas((1 + maxWidth) * gridSize, (4 + maxHeight) * gridSize);
}

function draw() {
  frameRate(speed);
  if (playing) {
    drawScenario()
    drawStats()
    moveSnake()
    drawSnake()
    if (hasCollidedWithWall() || hasCollidedWithBody()) {
      gameOver()
    }
  }
}

function moveSnake() {
  deltaX = 0
  deltaY = 0
  switch (snakeDirection) {
    case directions.left:
      deltaX -= 1;
      break;
    case directions.right:
      deltaX += 1;
      break;
    case directions.up:
      deltaY -= 1;
      break;
    case directions.down:
      deltaY += 1;
      break;
  }

  snakeTail = snakeBody.pop()
  snakeHead = snakeBody[0]
  snakeTail = [snakeHead[0] + deltaX, snakeHead[1] + deltaY]
  newHead = snakeBody.unshift(snakeTail)

  lastMovementDirection = snakeDirection
}


function keyPressed() {
  switch (keyCode) {
    case LEFT_ARROW:
      if (lastMovementDirection != directions.right) {
        snakeDirection = directions.left
      }
      break
    case RIGHT_ARROW:
      if (lastMovementDirection != directions.left) {
        snakeDirection = directions.right
      }
      break
    case UP_ARROW:
      if (lastMovementDirection != directions.down) {
        snakeDirection = directions.up
      }
      break
    case DOWN_ARROW:
      if (lastMovementDirection != directions.up) {
        snakeDirection = directions.down
      }
      break
  }
}

function drawSnake() {
  fill(0, 255, 0)
  for (bodyPart of snakeBody) {
    rect(bodyPart[0] * gridSize, bodyPart[1] * gridSize, gridSize, gridSize)
  }
}

function hasCollidedWithWall() {
  snakeHead = snakeBody[0]
  headX = snakeHead[0]
  headY = snakeHead[1]
  if (headX >= maxWidth || headX <= 0) {
    return true
  } else if (headY >= maxHeight || headY <= 0) {
    return true
  }

  return false
}

function hasCollidedWithBody() {
  snakeHead = snakeBody[0]

  partsOnHead = snakeBody.filter(bodyPart => bodyPart[0] == snakeHead[0] && bodyPart[1] == snakeHead[1]).length

  return partsOnHead > 1
}

function drawScenario() {
  background(0);
  fill(156, 156, 156)
  stroke(0)

  for (let i = 0; i <= maxWidth; i++) {
    rect(gridSize * i, 0, gridSize, gridSize);
    rect(gridSize * i, gridSize * maxHeight, gridSize, gridSize);
  }
  for (let i = 0; i <= maxHeight; i++) {
    rect(0, gridSize * i, gridSize, gridSize);
    rect(gridSize * maxWidth, gridSize * i, gridSize, gridSize);
  }
}

function getTimeElapsed() {
  now = new Date()
  deltaTimeSeconds = (now.getTime() - startTimestamp.getTime()) / 1000

  let seconds = Math.floor(deltaTimeSeconds % 60);
  let secondsAsString = seconds < 10 ? "0" + seconds : seconds;

  timeDiff = Math.floor(deltaTimeSeconds / 60);
  let minutes = timeDiff % 60;
  let minutesAsString = minutes < 10 ? "0" + minutes : minutes;
  return minutesAsString + ":" + secondsAsString;

}

function drawStats() {
  textSize(20);
  fill(156, 256, 156)
  textAlign(LEFT);
  text('timer: ' + getTimeElapsed(), 0, (3 + maxHeight) * gridSize);
  textAlign(RIGHT);
  text('speed: ' + speed, gridSize * maxWidth, (3 + maxHeight) * gridSize);
  textAlign(CENTER);
  text('length: ' + snakeBody.length, gridSize * maxWidth * 0.5, (3 + maxHeight) * gridSize);

}

function gameOver() {
  playing = false
  textSize(50);
  fill(255, 0, 0)
  textAlign(CENTER);
  text('GAME OVER!', gridSize * maxWidth * 0.5, maxHeight * gridSize * 0.5);
  if (window.confirm("game over! restart?")) {
    setup()
  }
}