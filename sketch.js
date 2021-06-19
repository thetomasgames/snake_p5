const directions = Object.freeze({ "left": 1, "right": 2, "up": 3, "down": 4 })
const gridSize = 10
const maxWidth = 80
const maxHeight = 50
const startSnakeSize = 3

let snakeBody;
let playing;
let snakeDirection;
let lastMovementDirection;
let startTimestamp;
let speed;
let applePosition;

let keyPressedQueue;

function setup() {
  startTimestamp = new Date()
  snakeBody = []
  playing = true
  lastMovementDirection = snakeDirection = directions.right;
  keyPressedQueue = []
  adjustSpeed()
  randomizeApplePosition()
  for (let i = 0; i < startSnakeSize; i++) {
    snakeBody.unshift([i, 1]);
  }
  createCanvas((1 + maxWidth) * gridSize, (4 + maxHeight) * gridSize);
}

function draw() {
  frameRate(speed);
  if (playing) {
    drawWatermark()
    drawScenario()
    drawStats()
    moveSnake()
    drawApple()
    drawSnake()
    if (hasCollidedWithWall() || hasCollidedWithBody()) {
      gameOver()
    } else if (hasCaughtApple()) {
      growSnake()
      randomizeApplePosition()
    }
    adjustSpeed()
  }
}

function moveSnake() {
  while (keyPressedQueue.length > 0) {
    let newDirection = keyPressedQueue.shift()
    if (newDirection != snakeDirection && newDirection != oppositeDirection(snakeDirection)) {
      snakeDirection = newDirection;
      break;
    }
  }

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
    case 65:
      keyPressedQueue.push(directions.left)
      break
    case RIGHT_ARROW:
    case 68:
      keyPressedQueue.push(directions.right)
      break
    case UP_ARROW:
    case 87:
      keyPressedQueue.push(directions.up)
      break
    case DOWN_ARROW:
    case 83:
      keyPressedQueue.push(directions.down)
      break
  }
}

function drawSnake() {
  fill(0, 255, 0)
  stroke(200, 255, 0)
  for (bodyPart of snakeBody) {
    rect(bodyPart[0] * gridSize, bodyPart[1] * gridSize, gridSize, gridSize)
    stroke(0, 0, 0)
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
  partsOnHead = snakeBody.filter(bodyPart => isSnakeHeadTouching(bodyPart)).length

  return partsOnHead > 1
}

function drawScenario() {
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

function isSnakeHeadTouching(position) {
  snakeHead = snakeBody[0]
  return snakeHead[0] == position[0] && snakeHead[1] == position[1]
}

function hasCaughtApple() {
  return isSnakeHeadTouching(applePosition)
}

function growSnake() {
  snakeTail = snakeBody[snakeBody.length - 1]
  snakeBody.push(snakeTail)
}

function randomPosition(maxX, maxY) {
  randX = Math.floor(Math.random() * maxX) + 1
  randY = Math.floor(Math.random() * maxY) + 1

  return [randX, randY]
}

function randomizeApplePosition() {
  tries = 0
  maxTries = 10000;
  while (tries < maxTries) {
    applePosition = randomPosition(maxWidth - 2, maxHeight - 2)
    if (snakeBody.filter(bodyPart => bodyPart[0] == applePosition[1] && bodyPart[1] == applePosition[1]).length == 0) {
      break;
    }
  }
}

function drawApple() {
  fill(163, 32, 58)
  stroke(163, 32, 58)
  circle((applePosition[0] + 0.5) * gridSize, (applePosition[1] + 0.5) * gridSize, gridSize)
}

function adjustSpeed() {
  snakeLength = snakeBody.length

  if (snakeLength <= 5) {
    speed = 15
  } else if (snakeLength <= 10) {
    speed = 20
  } else if (snakeLength <= 15) {
    speed = 25
  } else if (snakeLength <= 20) {
    speed = 30
  }
}

function oppositeDirection(direction) {
  switch (direction) {
    case directions.left:
      return directions.right;
    case directions.right:
      return directions.left;
    case directions.up:
      return directions.down;
    case directions.down:
      return directions.up;
  }
}

function drawWatermark() {
  background(0);
  textSize(100)
  noStroke()
  fill(156 / 20, 256 / 20, 156 / 20)
  textAlign(CENTER);
  text('the tomas games', gridSize, (maxHeight - 5) * gridSize * 0.5, maxWidth * gridSize, maxHeight * gridSize);
}