// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const gameOverlay = document.getElementById('gameOverlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayMessage = document.getElementById('overlayMessage');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const themeToggle = document.getElementById('themeToggle');
const gameContainer = document.querySelector('.game-container');

// Game state
let gameRunning = false;
let gameLoop;
let score = 0;
let highScore = localStorage.getItem('carRacingHighScore') || 0;
let isDarkTheme = localStorage.getItem('carRacingDarkTheme') === 'true';

// Game dimensions
const CANVAS_WIDTH = 350;
const CANVAS_HEIGHT = 500;
const ROAD_WIDTH = 260;
const ROAD_LEFT = (CANVAS_WIDTH - ROAD_WIDTH) / 2;

// Player car properties
const playerCar = {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT - 100,
    width: 40,
    height: 60,
    speed: 5,
    color: '#e74c3c'
};

// Obstacle properties
let obstacles = [];
const obstacleWidth = 40;
const obstacleHeight = 60;
const obstacleSpeed = 3;
let obstacleSpawnRate = 120; // frames between obstacles
let frameCount = 0;

// Road properties
let roadOffset = 0;
const roadLineHeight = 50;
const roadLineWidth = 10;

// Input handling
const keys = {
    ArrowLeft: false,
    ArrowRight: false
};

// Initialize high score display
highScoreElement.textContent = highScore;

// Initialize theme
initTheme();

// Event listeners
startButton.addEventListener('click', startGame);
themeToggle.addEventListener('click', toggleTheme);
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Handle key presses
function handleKeyDown(e) {
    if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = true;
        e.preventDefault();
    }
}

function handleKeyUp(e) {
    if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = false;
        e.preventDefault();
    }
}

// Start the game
function startGame() {
    gameRunning = true;
    score = 0;
    obstacles = [];
    frameCount = 0;
    roadOffset = 0;
    
    // Reset player position
    playerCar.x = CANVAS_WIDTH / 2;
    
    // Update UI
    scoreElement.textContent = score;
    gameOverlay.style.display = 'none';
    
    // Start game loop
    gameLoop = requestAnimationFrame(updateGame);
}

// End the game
function endGame() {
    gameRunning = false;
    cancelAnimationFrame(gameLoop);
    
    // Update high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('carRacingHighScore', highScore);
        highScoreElement.textContent = highScore;
    }
    
    // Show game over screen
    overlayTitle.textContent = 'Game Over!';
    overlayMessage.textContent = `Your score: ${score}`;
    startButton.textContent = 'Play Again';
    gameOverlay.style.display = 'flex';
    
    // Add game over animation
    canvas.classList.add('game-over');
    setTimeout(() => {
        canvas.classList.remove('game-over');
    }, 500);
}

// Update game state
function updateGame() {
    if (!gameRunning) return;
    
    // Update player movement
    updatePlayer();
    
    // Update obstacles
    updateObstacles();
    
    // Update road animation
    updateRoad();
    
    // Check collisions
    checkCollisions();
    
    // Update score
    updateScore();
    
    // Spawn new obstacles
    frameCount++;
    if (frameCount % obstacleSpawnRate === 0) {
        spawnObstacle();
        // Increase difficulty
        obstacleSpawnRate = Math.max(60, obstacleSpawnRate - 2);
    }
    
    // Draw everything
    drawGame();
    
    // Continue game loop
    gameLoop = requestAnimationFrame(updateGame);
}

// Update player car position
function updatePlayer() {
    if (keys.ArrowLeft && playerCar.x > ROAD_LEFT + 10) {
        playerCar.x -= playerCar.speed;
    }
    if (keys.ArrowRight && playerCar.x < ROAD_LEFT + ROAD_WIDTH - playerCar.width - 10) {
        playerCar.x += playerCar.speed;
    }
}

// Update obstacles
function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].y += obstacleSpeed;
        
        // Remove obstacles that are off screen
        if (obstacles[i].y > CANVAS_HEIGHT) {
            obstacles.splice(i, 1);
        }
    }
}

// Update road animation
function updateRoad() {
    roadOffset += obstacleSpeed;
    if (roadOffset >= roadLineHeight) {
        roadOffset = 0;
    }
}

// Spawn new obstacle
function spawnObstacle() {
    const laneWidth = ROAD_WIDTH / 3;
    const lane = Math.floor(Math.random() * 3);
    const x = ROAD_LEFT + (lane * laneWidth) + (laneWidth - obstacleWidth) / 2;
    
    obstacles.push({
        x: x,
        y: -obstacleHeight,
        width: obstacleWidth,
        height: obstacleHeight,
        color: '#3498db'
    });
}

// Check for collisions
function checkCollisions() {
    for (let obstacle of obstacles) {
        if (isColliding(playerCar, obstacle)) {
            endGame();
            return;
        }
    }
}

// Collision detection
function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Update score
function updateScore() {
    score++;
    scoreElement.textContent = score;
    
    // Add score pulse animation every 100 points
    if (score % 100 === 0) {
        scoreElement.classList.add('score-update');
        setTimeout(() => {
            scoreElement.classList.remove('score-update');
        }, 300);
    }
}

// Draw the game
function drawGame() {
    // Clear canvas
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw road
    drawRoad();
    
    // Draw player car
    drawCar(playerCar);
    
    // Draw obstacles
    for (let obstacle of obstacles) {
        drawCar(obstacle);
    }
}

// Draw the road
function drawRoad() {
    // Road background
    ctx.fillStyle = '#34495e';
    ctx.fillRect(ROAD_LEFT, 0, ROAD_WIDTH, CANVAS_HEIGHT);
    
    // Road lines
    ctx.fillStyle = '#f39c12';
    ctx.strokeStyle = '#f39c12';
    ctx.lineWidth = roadLineWidth;
    
    // Center line
    const centerX = CANVAS_WIDTH / 2;
    for (let y = roadOffset; y < CANVAS_HEIGHT; y += roadLineHeight * 2) {
        ctx.fillRect(centerX - roadLineWidth/2, y, roadLineWidth, roadLineHeight);
    }
    
    // Side lines
    ctx.fillRect(ROAD_LEFT, 0, roadLineWidth, CANVAS_HEIGHT);
    ctx.fillRect(ROAD_LEFT + ROAD_WIDTH - roadLineWidth, 0, roadLineWidth, CANVAS_HEIGHT);
}

// Draw a car
function drawCar(car) {
    // Car body
    ctx.fillStyle = car.color;
    ctx.fillRect(car.x, car.y, car.width, car.height);
    
    // Car details
    ctx.fillStyle = '#2c3e50';
    
    // Windows
    ctx.fillRect(car.x + 5, car.y + 5, car.width - 10, 15);
    ctx.fillRect(car.x + 5, car.y + car.height - 20, car.width - 10, 15);
    
    // Headlights
    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(car.x + 5, car.y + 2, 8, 6);
    ctx.fillRect(car.x + car.width - 13, car.y + 2, 8, 6);
    
    // Taillights
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(car.x + 5, car.y + car.height - 8, 8, 6);
    ctx.fillRect(car.x + car.width - 13, car.y + car.height - 8, 8, 6);
    
    // Wheels
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(car.x - 3, car.y + 10, 6, 15);
    ctx.fillRect(car.x + car.width - 3, car.y + 10, 6, 15);
    ctx.fillRect(car.x - 3, car.y + car.height - 25, 6, 15);
    ctx.fillRect(car.x + car.width - 3, car.y + car.height - 25, 6, 15);
}

// Theme functions
function initTheme() {
    if (isDarkTheme) {
        gameContainer.classList.add('dark-theme');
        themeToggle.querySelector('.theme-icon').textContent = '☀️';
    } else {
        gameContainer.classList.remove('dark-theme');
        themeToggle.querySelector('.theme-icon').textContent = '🌙';
    }
}

function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    localStorage.setItem('carRacingDarkTheme', isDarkTheme);
    initTheme();
}

// Initialize the game
function init() {
    drawGame();
}

// Start the game when page loads
window.addEventListener('load', init);
