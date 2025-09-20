// Game state variables
let currentPlayer = 1;
let playerPositions = { 1: 1, 2: 1 };
let gameBoard = [];
let isGameActive = true;

// Snakes and Ladders configuration
// Format: { start: end } - positive for ladders, negative for snakes
const snakesAndLadders = {
    16: -6,   // Snake from 16 to 10
    47: -26,  // Snake from 47 to 21
    49: -11,  // Snake from 49 to 38
    56: -19,  // Snake from 56 to 37
    62: -18,  // Snake from 62 to 44
    64: -60,  // Snake from 64 to 4
    87: -24,  // Snake from 87 to 63
    93: -73,  // Snake from 93 to 20
    95: -75,  // Snake from 95 to 20
    98: -78,  // Snake from 98 to 20
    
    1: 38,    // Ladder from 1 to 38
    4: 14,    // Ladder from 4 to 14
    9: 31,    // Ladder from 9 to 31
    21: 42,   // Ladder from 21 to 42
    28: 84,   // Ladder from 28 to 84
    36: 44,   // Ladder from 36 to 44
    51: 67,   // Ladder from 51 to 67
    71: 91,   // Ladder from 71 to 91
    80: 100   // Ladder from 80 to 100
};

// DOM elements
const gameBoardElement = document.getElementById('game-board');
const diceElement = document.getElementById('dice');
const rollBtn = document.getElementById('roll-btn');
const currentPlayerElement = document.getElementById('current-player');
const player1PosElement = document.getElementById('player1-pos');
const player2PosElement = document.getElementById('player2-pos');
const restartBtn = document.getElementById('restart-btn');
const winnerModal = document.getElementById('winner-modal');
const winnerText = document.getElementById('winner-text');
const playAgainBtn = document.getElementById('play-again-btn');
const themeBtn = document.getElementById('theme-btn');
const themeIcon = document.getElementById('theme-icon');

// Initialize the game
function initGame() {
    loadTheme();
    generateBoard();
    updateDisplay();
    setupEventListeners();
}

// Generate the 10x10 game board
function generateBoard() {
    gameBoardElement.innerHTML = '';
    
    // Create 100 cells (10x10 grid)
    for (let i = 100; i >= 1; i--) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = i;
        cell.dataset.position = i;
        
        // Add special styling for snakes and ladders
        if (snakesAndLadders[i]) {
            if (snakesAndLadders[i] > 0) {
                cell.classList.add('ladder');
                cell.title = `Ladder: ${i} → ${snakesAndLadders[i]}`;
            } else {
                cell.classList.add('snake');
                cell.title = `Snake: ${i} → ${i + snakesAndLadders[i]}`;
            }
        }
        
        gameBoardElement.appendChild(cell);
    }
}

// Update the display with current game state
function updateDisplay() {
    // Update player positions
    player1PosElement.textContent = `Position: ${playerPositions[1]}`;
    player2PosElement.textContent = `Position: ${playerPositions[2]}`;
    
    // Update current player indicator
    currentPlayerElement.textContent = `Player ${currentPlayer}'s Turn`;
    
    // Update player tokens on board
    updatePlayerTokens();
    
    // Update dice display
    diceElement.textContent = '?';
}

// Update turn indicator with countdown status
function updateTurnIndicator(message) {
    currentPlayerElement.textContent = message;
}

// Update player tokens on the board
function updatePlayerTokens() {
    // Remove existing tokens
    const existingTokens = gameBoardElement.querySelectorAll('.player-token');
    existingTokens.forEach(token => token.remove());
    
    // Add player 1 token
    const player1Cell = gameBoardElement.querySelector(`[data-position="${playerPositions[1]}"]`);
    if (player1Cell) {
        const player1Token = document.createElement('div');
        player1Token.className = 'player-token player1';
        player1Token.title = 'Player 1';
        player1Cell.appendChild(player1Token);
    }
    
    // Add player 2 token
    const player2Cell = gameBoardElement.querySelector(`[data-position="${playerPositions[2]}"]`);
    if (player2Cell) {
        const player2Token = document.createElement('div');
        player2Token.className = 'player-token player2';
        player2Token.title = 'Player 2';
        player2Cell.appendChild(player2Token);
    }
}

// Roll the dice
function rollDice() {
    if (!isGameActive) return;
    
    // Disable roll button during animation
    rollBtn.disabled = true;
    
    // Animate dice roll
    let rollCount = 0;
    const maxRolls = 10;
    const rollInterval = setInterval(() => {
        const randomNumber = Math.floor(Math.random() * 6) + 1;
        diceElement.textContent = randomNumber;
        rollCount++;
        
        if (rollCount >= maxRolls) {
            clearInterval(rollInterval);
            const finalRoll = Math.floor(Math.random() * 6) + 1;
            diceElement.textContent = finalRoll;
            
            // Show countdown timer for 5 seconds
            let timeLeft = 5;
            updateTurnIndicator(`Player ${currentPlayer} rolled ${finalRoll} - Moving in ${timeLeft}s...`);
            diceElement.classList.add('countdown');
            
            const countdownInterval = setInterval(() => {
                timeLeft--;
                if (timeLeft > 0) {
                    // Show countdown in dice element
                    diceElement.textContent = `${finalRoll} (${timeLeft}s)`;
                    updateTurnIndicator(`Player ${currentPlayer} rolled ${finalRoll} - Moving in ${timeLeft}s...`);
                } else {
                    clearInterval(countdownInterval);
                    diceElement.textContent = finalRoll;
                    diceElement.classList.remove('countdown');
                    movePlayer(finalRoll);
                    rollBtn.disabled = false;
                }
            }, 1000);
        }
    }, 100);
}

// Move the current player
function movePlayer(diceValue) {
    const currentPosition = playerPositions[currentPlayer];
    let newPosition = currentPosition + diceValue;
    
    // Check if player won
    if (newPosition === 100) {
        playerPositions[currentPlayer] = newPosition;
        updateDisplay();
        announceWinner();
        return;
    }
    
    // If player overshoots 100, they stay in place
    if (newPosition > 100) {
        newPosition = currentPosition;
    }
    
    // Update position
    playerPositions[currentPlayer] = newPosition;
    
    // Check for snakes and ladders
    if (snakesAndLadders[newPosition]) {
        const oldPosition = newPosition;
        newPosition += snakesAndLadders[newPosition];
        
        // Ensure position doesn't go below 1
        if (newPosition < 1) {
            newPosition = 1;
        }
        
        playerPositions[currentPlayer] = newPosition;
        
        // Show snake/ladder effect
        setTimeout(() => {
            updateDisplay();
            const effect = snakesAndLadders[oldPosition] > 0 ? 'Ladder!' : 'Snake!';
            showMessage(`${effect} Player ${currentPlayer} moved from ${oldPosition} to ${newPosition}`);
        }, 300);
    }
    
    updateDisplay();
    
    // Switch turns
    setTimeout(() => {
        if (isGameActive) {
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            updateDisplay();
        }
    }, 1000);
}

// Show a temporary message
function showMessage(message) {
    // Create a temporary message element
    const messageElement = document.createElement('div');
    messageElement.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-size: 1.2rem;
        font-weight: bold;
        z-index: 1001;
        animation: fadeInOut 2s ease-in-out;
    `;
    messageElement.textContent = message;
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(messageElement);
    
    // Remove message after animation
    setTimeout(() => {
        document.body.removeChild(messageElement);
        document.head.removeChild(style);
    }, 2000);
}

// Announce the winner
function announceWinner() {
    isGameActive = false;
    winnerText.textContent = `Player ${currentPlayer} Wins! 🎉`;
    winnerModal.style.display = 'block';
    
    // Add winner effect to the winning position
    const winnerCell = gameBoardElement.querySelector(`[data-position="100"]`);
    if (winnerCell) {
        winnerCell.classList.add('winner');
    }
}

// Restart the game
function restartGame() {
    currentPlayer = 1;
    playerPositions = { 1: 1, 2: 1 };
    isGameActive = true;
    
    // Remove winner effect
    const winnerCell = gameBoardElement.querySelector('.winner');
    if (winnerCell) {
        winnerCell.classList.remove('winner');
    }
    
    // Hide modal
    winnerModal.style.display = 'none';
    
    // Update display
    updateDisplay();
}

// Theme management functions
function loadTheme() {
    const savedTheme = localStorage.getItem('snakes-ladders-theme') || 'light';
    setTheme(savedTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('snakes-ladders-theme', theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Setup event listeners
function setupEventListeners() {
    rollBtn.addEventListener('click', rollDice);
    restartBtn.addEventListener('click', restartGame);
    playAgainBtn.addEventListener('click', restartGame);
    themeBtn.addEventListener('click', toggleTheme);
    
    // Close modal when clicking outside
    winnerModal.addEventListener('click', (e) => {
        if (e.target === winnerModal) {
            winnerModal.style.display = 'none';
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && isGameActive && !rollBtn.disabled) {
            e.preventDefault();
            rollDice();
        }
        if (e.code === 'KeyR') {
            restartGame();
        }
        if (e.code === 'KeyT') {
            toggleTheme();
        }
    });
}

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', initGame);
