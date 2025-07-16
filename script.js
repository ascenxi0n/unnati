const heartsContainer = document.getElementById("hearts");
const gameScreen = document.getElementById("game-screen");
const message = document.getElementById("message");
const confettiCanvas = document.getElementById("confetti-canvas");

let gameOver = false;
const minHearts = 6;
let heartSpawnerInterval;

function spawnHeart() {
  if (gameOver) return;

  const heart = document.createElement("img");
  heart.src = "https://img.icons8.com/emoji/48/heart-suit.png";
  heart.className = "heart";
  heart.style.left = `${Math.random() * 85 + 5}%`;
  heart.style.top = `${Math.random() * 70 + 10}%`;

  heart.onclick = () => {
    if (heart.classList.contains("pop")) return;
    heart.classList.add("pop");
    setTimeout(() => {
      heart.remove();
      checkIfCleared();
    }, 100);
  };

  heartsContainer.appendChild(heart);
}

function maintainHearts() {
  if (gameOver) return;

  const activeHearts = document.querySelectorAll(".heart:not(.pop)").length;
  if (activeHearts < minHearts) {
    spawnHeart();
  }
}

function checkIfCleared() {
  setTimeout(() => {
    const activeHearts = document.querySelectorAll(".heart:not(.pop)").length;
    if (activeHearts === 0 && !gameOver) {
      gameOver = true;
      clearInterval(heartSpawnerInterval);
      fadeOutGameShowMessage();
    }
  }, 1);
}

function startHeartGame() {
  for (let i = 0; i < minHearts; i++) spawnHeart();

  heartSpawnerInterval = setInterval(() => {
    maintainHearts();
  }, 700);
}

// Fade out game screen then fade in message with confetti
function fadeOutGameShowMessage() {
  gameScreen.classList.add("fade-out");

  setTimeout(() => {
    gameScreen.style.display = "none";
    showMessage();
  }, 1200);
}

function showMessage() {
  message.classList.remove("hidden");
  message.classList.add("fade-in");
  message.setAttribute("aria-hidden", "false");
  message.focus();
  startConfetti();
}

// CONFETTI (blast impact effect)
function startConfetti() {
  confettiCanvas.classList.add("active");
  const confetti = window.confetti.create(confettiCanvas, {
    resize: true,
    useWorker: true
  });

  const bursts = [
    { x: 0.1, particleCount: 100, spread: 120, scalar: 1.5 },
    { x: 0.1, particleCount: 60, spread: 60, scalar: 1.8 },
    { x: 0.9, particleCount: 100, spread: 120, scalar: 1.5 },
    { x: 0.9, particleCount: 60, spread: 60, scalar: 1.8 },
  ];

  bursts.forEach(({ x, particleCount, spread, scalar }, i) => {
    setTimeout(() => {
      confetti({
        particleCount,
        spread,
        origin: { x, y: 0 },
        gravity: 0.9,
        ticks: 500,
        scalar,
      });
    }, i * 250);
  });

  setTimeout(() => {
    confettiCanvas.classList.remove("active");
  }, 50000);
}

// Start the heart tapping game
startHeartGame();
