/* ===============================
   SNAKE GAME JAVASCRIPT
================================= */

// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const rows = canvas.height / box;
const cols = canvas.width / box;

// Game variables
let snake;
let food;
let direction;
let nextDirection;
let score;
let highScore = localStorage.getItem("snakeHighScore") || 0;
let gameInterval = null;
let speed;
let isRunning = false;
let soundTimeout = null;

// DOM Elements
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const gameOverText = document.getElementById("gameOverText");
const eatSound = document.getElementById("eatSound");
const gameOverSound = document.getElementById("gameOverSound");

// Show saved high score
highScoreEl.textContent = highScore;

/* ===============================
   INITIALIZE GAME
================================= */
function initGame() {
    snake = [{ x: 9 * box, y: 9 * box }];
    direction = "RIGHT";
    nextDirection = "RIGHT";
    score = 0;
    speed = 250; // slow start

    isRunning = true;
    scoreEl.textContent = score;
    gameOverText.textContent = "";

    generateFood();

    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
}

/* ===============================
   GENERATE RANDOM FOOD
================================= */
function generateFood() {
    food = {
        x: Math.floor(Math.random() * cols) * box,
        y: Math.floor(Math.random() * rows) * box
    };
}

/* ===============================
   MAIN LOOP
================================= */
function gameLoop() {
    update();
    draw();
}

/* ===============================
   UPDATE GAME
================================= */
function update() {
    direction = nextDirection;

    let head = { ...snake[0] };

    if (direction === "LEFT") head.x -= box;
    if (direction === "RIGHT") head.x += box;
    if (direction === "UP") head.y -= box;
    if (direction === "DOWN") head.y += box;

    // Collision check
    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvas.width ||
        head.y >= canvas.height ||
        collision(head, snake)
    ) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // Food collision
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreEl.textContent = score;

        playEatSound();
        generateFood();

        // Increase speed every 5 points
        if (score % 5 === 0 && speed > 80) {
            speed -= 20;
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, speed);
        }

    } else {
        snake.pop();
    }
}

/* ===============================
   DRAW GAME
================================= */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "#22c55e" : "#16a34a";
        ctx.fillRect(segment.x, segment.y, box, box);
    });

    ctx.fillStyle = "#ef4444";
    ctx.fillRect(food.x, food.y, box, box);
}

/* ===============================
   COLLISION CHECK
================================= */
function collision(head, array) {
    return array.some(segment =>
        segment.x === head.x && segment.y === head.y
    );
}

/* ===============================
   GAME OVER
================================= */
function gameOver() {
    clearInterval(gameInterval);
    isRunning = false;
    gameOverText.textContent = "Game Over!";

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("snakeHighScore", highScore);
        highScoreEl.textContent = highScore;
    }

    playGameOverSound();
}

/* ===============================
   SOUND FUNCTIONS
================================= */

function stopAllSounds() {
    clearTimeout(soundTimeout);

    eatSound.pause();
    eatSound.currentTime = 0;

    gameOverSound.pause();
    gameOverSound.currentTime = 0;
}

function playEatSound() {
    stopAllSounds();

    eatSound.play().catch(() => {});

    soundTimeout = setTimeout(() => {
        eatSound.pause();
        eatSound.currentTime = 0;
    }, 5000);
}

function playGameOverSound() {
    stopAllSounds();

    gameOverSound.play().catch(() => {});

    soundTimeout = setTimeout(() => {
        gameOverSound.pause();
        gameOverSound.currentTime = 0;
    }, 3000);
}

/* ===============================
   CONTROLS
================================= */
document.addEventListener("keydown", e => {
    if (!isRunning) return;

    if (e.key === "ArrowLeft" && direction !== "RIGHT")
        nextDirection = "LEFT";

    if (e.key === "ArrowUp" && direction !== "DOWN")
        nextDirection = "UP";

    if (e.key === "ArrowRight" && direction !== "LEFT")
        nextDirection = "RIGHT";

    if (e.key === "ArrowDown" && direction !== "UP")
        nextDirection = "DOWN";
});

/* ===============================
   BUTTON EVENTS
================================= */

// Unlock audio on first click
startBtn.addEventListener("click", () => {

    eatSound.play().then(() => {
        eatSound.pause();
        eatSound.currentTime = 0;
    }).catch(() => {});

    gameOverSound.play().then(() => {
        gameOverSound.pause();
        gameOverSound.currentTime = 0;
    }).catch(() => {});

    if (!isRunning) initGame();
});

restartBtn.addEventListener("click", () => {
    initGame();
});

/* ===============================
   ON-SCREEN ARROW BUTTON CONTROLS
================================= */

const upBtn = document.getElementById("upBtn");
const downBtn = document.getElementById("downBtn");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

upBtn.addEventListener("click", () => {
    if (isRunning && direction !== "DOWN")
        nextDirection = "UP";
});

downBtn.addEventListener("click", () => {
    if (isRunning && direction !== "UP")
        nextDirection = "DOWN";
});

leftBtn.addEventListener("click", () => {
    if (isRunning && direction !== "RIGHT")
        nextDirection = "LEFT";
});

rightBtn.addEventListener("click", () => {
    if (isRunning && direction !== "LEFT")
        nextDirection = "RIGHT";
});
