const directions = Object.freeze({ "left": 1, "right": 2, "up": 3, "down": 4 })
const snakeBody = [[1, 1], [1, 2], [1, 3]]
const gridSize = 10

const maxWidth = 80
const maxHeight = 50

let playing = true
let snakeDirection = directions.right

let lastMovementDirection = directions.right

function setup() {
  createCanvas(maxWidth * gridSize, maxHeight * gridSize);
  frameRate(20); // Attempt to refresh at starting FPS
}

function draw() {
  background(156);
  if (playing) {
    moveSnake()
    drawSnake()
    if (checkCollision()) {
      playing = false
      alert("game over")
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
  for (bodyPart of snakeBody) {
    rect(bodyPart[0] * gridSize, bodyPart[1] * gridSize, gridSize, gridSize)
  }
}

function checkCollision() {
  snakeHead = snakeBody[0]
  headWidth = snakeHead[0]
  headHeight = snakeHead[1]
  if (headWidth >= maxWidth || headWidth <= 0) {
    return true
  } else if (headHeight >= maxHeight || headHeight <= 0) {
    return true
  }

  return false
}