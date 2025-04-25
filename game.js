const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.7;

const playerImg = new Image();
const enemyImg = new Image();
const bulletImg = new Image();
playerImg.src = "assets/player.png";
enemyImg.src = "assets/enemy.png";
bulletImg.src = "assets/bullet.png";

const player = {
  x: canvas.width / 2,
  y: canvas.height - 100,
  width: 50,
  height: 50,
  speed: 3,
  health: 100
};

let move = { up: false, down: false, left: false, right: false };
let enemies = [];
let bullets = [];
let lastSpawn = 0;
let spawnInterval = 2000;
let score = 0;

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") move.up = true;
  if (e.key === "ArrowDown") move.down = true;
  if (e.key === "ArrowLeft") move.left = true;
  if (e.key === "ArrowRight") move.right = true;
  if (e.key === " ") bullets.push({ x: player.x + 15, y: player.y });
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp") move.up = false;
  if (e.key === "ArrowDown") move.down = false;
  if (e.key === "ArrowLeft") move.left = false;
  if (e.key === "ArrowRight") move.right = false;
});

function movePlayer() {
  if (move.up) player.y -= player.speed;
  if (move.down) player.y += player.speed;
  if (move.left) player.x -= player.speed;
  if (move.right) player.x += player.speed;

  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
}

function spawnEnemy() {
  const x = Math.random() * (canvas.width - 40);
  enemies.push({ x, y: -40, width: 40, height: 40, speed: 1.5 });
}

function updateBullets() {
  bullets.forEach(b => b.y -= 5);
  bullets = bullets.filter(b => b.y > 0);
}

function checkCollisions() {
  enemies.forEach((e, ei) => {
    bullets.forEach((b, bi) => {
      if (b.x < e.x + e.width && b.x + 10 > e.x && b.y < e.y + e.height && b.y + 10 > e.y) {
        enemies.splice(ei, 1);
        bullets.splice(bi, 1);
        score += 10;
      }
    });
    if (e.x < player.x + player.width && e.x + e.width > player.x &&
        e.y < player.y + player.height && e.y + e.height > player.y) {
      player.health -= 10;
      enemies.splice(ei, 1);
    }
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
  enemies.forEach(e => ctx.drawImage(enemyImg, e.x, e.y, e.width, e.height));
  bullets.forEach(b => ctx.drawImage(bulletImg, b.x, b.y, 10, 20));

  ctx.fillStyle = "lime";
  ctx.font = "20px monospace";
  ctx.fillText("Score: " + score, 10, 30);
  ctx.fillText("Health: " + player.health, 10, 60);
}

function gameLoop(timestamp) {
  if (timestamp - lastSpawn > spawnInterval) {
    spawnEnemy();
    lastSpawn = timestamp;
  }

  movePlayer();
  updateBullets();

  enemies.forEach(e => e.y += e.speed);
  enemies = enemies.filter(e => e.y < canvas.height);

  checkCollisions();
  draw();

  if (player.health > 0) {
    requestAnimationFrame(gameLoop);
  } else {
    ctx.fillStyle = "red";
    ctx.font = "50px monospace";
    ctx.fillText("GAME OVER", canvas.width / 2 - 150, canvas.height / 2);
  }
}

requestAnimationFrame(gameLoop);
