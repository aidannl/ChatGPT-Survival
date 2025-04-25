const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.7;

const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 20,
  speed: 3,
  color: "lime",
  health: 100
};

let move = { up: false, down: false, left: false, right: false };
let enemies = [];
let lastSpawn = 0;
let spawnInterval = 2000;

['up','down','left','right'].forEach(dir => {
  const btn = document.getElementById(dir);
  btn.addEventListener("touchstart", () => move[dir] = true);
  btn.addEventListener("touchend", () => move[dir] = false);
});

function movePlayer() {
  if (move.up) player.y -= player.speed;
  if (move.down) player.y += player.speed;
  if (move.left) player.x -= player.speed;
  if (move.right) player.x += player.speed;
  player.x = Math.max(0, Math.min(canvas.width, player.x));
  player.y = Math.max(0, Math.min(canvas.height, player.y));
}

function spawnEnemy() {
  const size = 15;
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  enemies.push({ x, y, size, speed: 1.5, color: "red" });
}

function moveEnemies() {
  for (let e of enemies) {
    const dx = player.x - e.x, dy = player.y - e.y, dist = Math.hypot(dx, dy);
    e.x += (dx / dist) * e.speed;
    e.y += (dy / dist) * e.speed;
  }
}

function checkCollisions() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    const dx = player.x - e.x, dy = player.y - e.y;
    if (Math.hypot(dx, dy) < player.size + e.size) {
      player.health -= 1;
      enemies.splice(i, 1);
    }
  }
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
  ctx.fill();
}

function drawEnemies() {
  for (let e of enemies) {
    ctx.fillStyle = e.color;
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawHUD() {
  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  ctx.fillText("Health: " + player.health, 10, 30);
}

function gameOver() {
  ctx.fillStyle = "white";
  ctx.font = "50px sans-serif";
  ctx.fillText("Game Over", canvas.width / 2 - 130, canvas.height / 2);
}

function gameLoop(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (player.health <= 0) {
    gameOver();
    return;
  }
  movePlayer();
  moveEnemies();
  checkCollisions();
  drawPlayer();
  drawEnemies();
  drawHUD();
  if (timestamp - lastSpawn > spawnInterval) {
    spawnEnemy();
    lastSpawn = timestamp;
  }
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
