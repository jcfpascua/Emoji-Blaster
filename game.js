let player, score = 0, time = 0;
let timeInterval;
let keys = {};
let lastShotTime = 0;
const playerSpeed = 8;
const projectileSpeed = 15;
const obstacleSpeed = 3;
const obstacleEmojis = ['💣', '☄️', '🪨', '🧨', '🛢️', '🦴', '🍄', '🥚', '🥔', '🍩', '🍔', '🧊', '🪓', '🧱'];
let gameSound;
let gameLoopId;
let gameEnded = false; 

const phaserConfig = {
  type: Phaser.AUTO,
  width: 1,
  height: 1,
  audio: {
    disableWebAudio: false
  },
  scene: {
    preload,
    create
  }
};

const phaserGame = new Phaser.Game(phaserConfig);

function preload() {
  this.load.audio('bgm', 'assets/Laserpack.mp3');
  this.load.audio('shoot', 'assets/blaster-shot-229313.mp3');
}

function create() {
  gameSound = {
    bgm: this.sound.add('bgm', { loop: true, volume: 0.5 }),
    shoot: this.sound.add('shoot', { volume: 0.5 })
  };
  
  gameSound.bgm.play();
}

function startGame() {
  if (gameSound?.bgm) {
    if (!gameSound.bgm.isPlaying) {
      gameSound.bgm.play();
    }
  }

  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('game-scene').classList.remove('hidden');
  score = 0;
  time = 0;
  gameEnded = false; 

  document.getElementById('score').innerText = 'Score: 0';
  document.getElementById('timer').innerText = 'Time: 0s';

  player = document.getElementById('player');
  player.style.left = `${window.innerWidth / 2 - player.offsetWidth / 2}px`;

  keys = {};
  document.addEventListener('keydown', e => keys[e.key] = true);
  document.addEventListener('keyup', e => keys[e.key] = false);

  timeInterval = setInterval(() => {
    time++;
    document.getElementById('timer').innerText = `Time: ${time}s`;
    if (time >= 120) endGame(true);
  }, 1000);

  gameLoopId = requestAnimationFrame(gameLoop); 
}

function restartGame() {
  document.getElementById('game-over').classList.add('hidden');
  document.querySelectorAll('.obstacle, .projectile').forEach(el => el.remove());
  clearInterval(timeInterval); 
  cancelAnimationFrame(gameLoopId); 
  startGame(); 
}

function gameLoop() {
  if (document.getElementById('game-scene').classList.contains('hidden')) {
    return; 
  }

  movePlayer();
  moveProjectiles();
  moveObstacles();
  if (Math.random() < 0.02 && document.querySelectorAll('.obstacle').length < 5) {
    spawnObstacle();
  }

  gameLoopId = requestAnimationFrame(gameLoop); 
}

function movePlayer() {
  const left = parseInt(window.getComputedStyle(player).left);
  if (keys['ArrowLeft'] || keys['a']) {
    player.style.left = `${Math.max(0, left - playerSpeed)}px`;
  }
  if (keys['ArrowRight'] || keys['d']) {
    player.style.left = `${Math.min(window.innerWidth - player.offsetWidth, left + playerSpeed)}px`;
  }
  if ((keys[' '] || keys['Spacebar']) && Date.now() - lastShotTime > 300) {
    shootProjectile();
    lastShotTime = Date.now();
  }
}

function shootProjectile() {
  const proj = document.createElement('div');
  proj.className = 'projectile';
  proj.innerText = '🔫';
  proj.style.left = player.style.left;
  proj.style.bottom = '60px';
  proj.style.position = 'absolute';
  document.getElementById('game-scene').appendChild(proj);

  if (gameSound?.shoot) gameSound.shoot.play();
}

function moveProjectiles() {
  document.querySelectorAll('.projectile').forEach(proj => {
    const bottom = parseInt(proj.style.bottom);
    if (bottom > window.innerHeight) {
      proj.remove();
    } else {
      proj.style.bottom = `${bottom + projectileSpeed}px`;
      checkCollision(proj);
    }
  });
}

function spawnObstacle() {
  const obs = document.createElement('div');
  obs.className = 'obstacle';
  obs.innerText = obstacleEmojis[Math.floor(Math.random() * obstacleEmojis.length)];
  obs.style.left = `${Math.random() * (window.innerWidth - 40)}px`;
  obs.style.top = '0px';
  obs.style.position = 'absolute';
  document.getElementById('game-scene').appendChild(obs);
}

function moveObstacles() {
  document.querySelectorAll('.obstacle').forEach(obs => {
    let top = parseInt(obs.style.top);
    if (top > window.innerHeight) {
      obs.remove();
    } else {
      const speedIncrease = Math.floor(score / 100) * 0.5;
      obs.style.top = `${top + obstacleSpeed + speedIncrease}px`;
      if (checkPlayerHit(obs)) {
        obs.remove();
        endGame(false);
      }
    }
  });
}

function checkCollision(proj) {
  const projRect = proj.getBoundingClientRect();
  document.querySelectorAll('.obstacle').forEach(obs => {
    const obsRect = obs.getBoundingClientRect();
    const collision = !(projRect.right < obsRect.left ||
                        projRect.left > obsRect.right ||
                        projRect.bottom < obsRect.top ||
                        projRect.top > obsRect.bottom);
    if (collision) {
      proj.remove(); obs.remove();
      score += 10;
      document.getElementById('score').innerText = `Score: ${score}`;
      if (score >= 500) {
        endGame(true);
      }
    }
  });
}

function checkPlayerHit(obs) {
  const playerRect = player.getBoundingClientRect();
  const obsRect = obs.getBoundingClientRect();
  return !(playerRect.right < obsRect.left ||
           playerRect.left > obsRect.right ||
           playerRect.bottom < obsRect.top ||
           playerRect.top > obsRect.bottom);
}

function endGame(won) {
  if (gameEnded) return; 
  gameEnded = true;
  clearInterval(timeInterval); 
  cancelAnimationFrame(gameLoopId); 
  keys = {};
  document.getElementById('game-scene').classList.add('hidden');
  document.getElementById('game-over').classList.remove('hidden');
  if (won) {
    document.getElementById('game-over-title').innerText = 'Congratulations! 🎉';
    document.getElementById('final-score').innerText = `You won with a score of ${score}!`;
  } else {
    document.getElementById('game-over-title').innerText = 'Game Over 😵';
    document.getElementById('final-score').innerText = `Game Over! Score: ${score}`;
  }
}

function setVolume(vol) {
  if (gameSound?.bgm) gameSound.bgm.setVolume(vol);
  if (gameSound?.shoot) gameSound.shoot.setVolume(vol);
}
