const heartsContainer = document.getElementById("hearts");
const gameScreen = document.getElementById("game-screen");
const message = document.getElementById("message");
const confettiCanvas = document.getElementById("confetti-canvas");
const secretIcon = document.getElementById("secret-icon");
const secretModal = document.getElementById("secret-modal");
const secretClose = document.getElementById("secret-close");

let gameOver = false;
const minHearts = 1;
let heartSpawnerInterval;

// Load sound effects
const popSound = new Audio('https://freesound.org/data/previews/522/522859_4609599-lq.mp3');
popSound.volume = 0.15;

const chimeSound = new Audio('https://freesound.org/data/previews/341/341695_3248244-lq.mp3');
chimeSound.volume = 0.18;

function spawnHeart() {
  if (gameOver) return;

  const heart = document.createElement("img");
  heart.src = "https://img.icons8.com/emoji/48/heart-suit.png";
  heart.className = "heart fade-in";

  // Random position
  heart.style.left = `${Math.random() * 85 + 5}%`;
  heart.style.top = `${Math.random() * 70 + 10}%`;

  // Independent float
  const duration = (3 + Math.random() * 2).toFixed(2); // 3–5s
  const delay = (Math.random() * 1.5).toFixed(2); // 0–1.5s
  heart.style.animationDuration = `${duration}s`;
  heart.style.animationDelay = `${delay}s`;

  // Slight rotation for variety
  const rotation = (Math.random() * 30 - 15).toFixed(1);
  heart.style.transform = `rotate(${rotation}deg)`;

  // On click: pop and remove
  heart.onclick = () => {
    if (heart.classList.contains("pop")) return;
    heart.classList.add("pop");

    setTimeout(() => {
      heart.remove();
      checkIfCleared();
    }, 200); // Give time for pop animation
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

// --- Secret message modal logic ---

// Open modal
secretIcon.addEventListener("click", () => {
  secretModal.classList.add("show");
  secretModal.setAttribute("aria-hidden", "false");
  secretModal.focus();

  popSound.currentTime = 0;
  popSound.play();
});

// Close modal
secretClose.addEventListener("click", closeSecretModal);

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && secretModal.classList.contains("show")) {
    closeSecretModal();
  }
});

function closeSecretModal() {
  // Add closing class to trigger fade out
  secretModal.classList.add("closing");

  // Play pop sound for closing modal
  popSound.currentTime = 0;
  popSound.play();

  // After animation duration, remove show and closing classes
  setTimeout(() => {
    secretModal.classList.remove("show", "closing");
    secretModal.setAttribute("aria-hidden", "true");
    secretIcon.focus();

    // Play chime sound on wish page after modal fully closes
    chimeSound.currentTime = 0;
    chimeSound.play();
  }, 350);
}

// Start the heart tapping game
startHeartGame();
