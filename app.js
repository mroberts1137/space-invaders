class Player {
  constructor(position) {
    this.position = position;
  }
}

class Alien {
  constructor(position) {
    this.position = position;
  }
}

const WIDTH = 15;
const TICK_SPEED = 500; //(ms)

const player = new Player(202);

let direction = 1;
let invadersId;
let score = 0;

const grid = document.querySelector('.grid');
const resultsDisplay = document.querySelector('#results-display');

// Construct Game Grid
for (let i = 0; i < WIDTH * WIDTH; i++) {
  const square = document.createElement('div');
  grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll('.grid div'));

const alienInvaders = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30, 31,
  32, 33, 34, 35, 36, 37, 38, 39
];

function draw() {
  for (let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.add('invader');
  }
}

function removeAliens() {
  for (let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.remove('invader');
  }
}

function playerMove(e) {
  squares[player.position].classList.remove('player');
  switch (e.key) {
    case 'ArrowLeft':
      if (player.position % WIDTH > 0) {
        player.position -= 1;
      }
      break;
    case 'ArrowRight':
      if (player.position % WIDTH < WIDTH - 1) {
        player.position += 1;
      }
      break;
  }
  squares[player.position].classList.add('player');
}

function moveAlien() {
  const leftEdge = alienInvaders[0] % WIDTH === 0;
  const rightEdge =
    alienInvaders[alienInvaders.length - 1] % WIDTH === WIDTH - 1;
  removeAliens();

  if (rightEdge && direction === 1) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += WIDTH;
    }
    direction = -1;
  }
  if (leftEdge && direction === -1) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += WIDTH;
    }
    direction = 1;
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction;
  }

  if (
    Math.floor(alienInvaders[alienInvaders.length - 1] / WIDTH) ===
    WIDTH - 1
  ) {
    alert('Game Over!');
    clearInterval(invadersId);
  }

  draw();

  if (squares[player.position].classList.contains('invader', 'player')) {
    resultsDisplay.innerHTML = 'Game Over';
    clearInterval(invadersId);
  }
}

function shoot(e) {
  let laserId;
  let laserPosition = player.position;
  function moveLaser() {
    squares[laserPosition].classList.remove('laser');
    laserPosition -= WIDTH;
    if (Math.floor(laserPosition / WIDTH) <= 0) {
      clearInterval(laserId);
      return;
    }

    if (squares[laserPosition].classList.contains('invader')) {
      score += 1;
      resultsDisplay.innerHTML = score;
      alienInvaders.splice(alienInvaders.indexOf(laserPosition), 1);
      squares[laserPosition].classList.remove('invader');
      squares[laserPosition].classList.add('boom');
      setTimeout(() => squares[laserPosition].classList.remove('boom'), 100);
      clearInterval(laserId);

      if (alienInvaders.length === 0) {
        resultsDisplay.innerHTML = 'You Win!';
      }
      return;
    }

    squares[laserPosition].classList.add('laser');
  }

  switch (e.key) {
    case 'ArrowUp':
      laserId = setInterval(moveLaser, 50);
  }
}

invadersId = setInterval(moveAlien, TICK_SPEED);

document.addEventListener('keydown', playerMove);
document.addEventListener('keydown', shoot);

squares[player.position].classList.add('player');

draw();
