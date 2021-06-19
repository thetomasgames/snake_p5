const directions = Object.freeze({ "left": 1, "right": 2, "up": 3, "down": 4 })
const gridSize = 10
const maxWidth = 80
const maxHeight = 50

let snakeBody;
let playing;
let snakeDirection;
let lastMovementDirection;

function setup() {
  snakeBody = []
  playing = true
  lastMovementDirection = snakeDirection = directions.right;
  for (let i = 0; i < 10; i++) {
    snakeBody.unshift([i, 1]);
  }
  createCanvas((1 + maxWidth) * gridSize, (4 + maxHeight) * gridSize);
  frameRate(15); // Attempt to refresh at starting FPS
}

function draw() {
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

function drawStats() {
  textSize(20);
  fill(156, 256, 156)
  textAlign(LEFT);
  text('time: 123:456', 0, (3 + maxHeight) * gridSize);
  textAlign(RIGHT);
  text('speed: 12345', gridSize * maxWidth, (3 + maxHeight) * gridSize);
  textAlign(CENTER);
  text('length: 123:456', gridSize * maxWidth * 0.5, (3 + maxHeight) * gridSize);

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