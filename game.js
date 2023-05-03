const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

class Ship {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.image = new Image();
    this.image.src = '/ship.png';
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  move(direction) {
    if (direction === 'left') {
      this.x -= 10;
    } else if (direction === 'right') {
      this.x += 10;
    }
  }
}

class Meteor {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 60;
    this.image = new Image();
    this.image.src = '/asteroid.png'
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update() {
    this.y += 5;
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

let ship = new Ship(canvas.width / 2, canvas.height - 70);
let meteors = [];
let score = 0;
let gameRunning = false;
let keys = {
  ArrowLeft: false,
  ArrowRight: false
};

function checkCollision(ship, meteor) {
  return (
    ship.x < meteor.x + meteor.width &&
    ship.x + ship.width > meteor.x &&
    ship.y < meteor.y + meteor.height &&
    ship.y + ship.height > meteor.y
  );
}

function handleShipMovement() {
    if (keys.ArrowLeft && ship.x > 0) {
      ship.move('left');
    }
    if (keys.ArrowRight && ship.x < canvas.width - ship.width) {
      ship.move('right');
    }
}

function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  handleShipMovement();

  ship.draw();

  meteors.forEach((meteor, index) => {
    meteor.draw();
    meteor.update();

    if (checkCollision(ship, meteor)) {
      gameRunning = false;
      document.title = `Game Over | Score: ${Math.floor(score / 60)}`;
    }

    if (meteor.y > canvas.height) {
      meteors.splice(index, 1);
    }
  });

  if (getRandomInt(0, 100) < 5) {
    meteors.push(new Meteor(getRandomInt(0, canvas.width - 40), -40));
  }

  score++;
  if (gameRunning) {
    document.title = `Score: ${Math.floor(score / 60)}`;
  }

  requestAnimationFrame(gameLoop);
}

function startGame() {
    if (!gameRunning) {
      gameRunning = true;
      score = 0;
      meteors = [];
      ship.x = canvas.width / 2;
      ship.y = canvas.height - 50;
      gameLoop();
    }
}

  document.addEventListener('keydown', (event) => {
    if (event.key in keys) {
      keys[event.key] = true;
    }
  
    if (event.key === ' ') {
      startGame();
    }
  });
  
  document.addEventListener('keyup', (event) => {
    if (event.key in keys) {
      keys[event.key] = false;
    }
  });
