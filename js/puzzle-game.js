/**
 * Puzzle Game - Image-based sliding puzzle
 * Educational puzzle game for elementary school students
 * Integrates with existing progress and card collection systems
 */

class PuzzleGame {
    constructor() {
        // Game state
        this.currentDifficulty = null;
        this.gridSize = 0;
        this.pieces = [];
        this.emptyPosition = null;
        this.moveCount = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.isCompleted = false;
        
        // Difficulty configurations
        this.difficulties = {
            mudah: { size: 3, name: 'MUDAH', gameId: 'puzzle-mudah' },
            sedang: { size: 4, name: 'SEDANG', gameId: 'puzzle-sedang' },
            sulit: { size: 6, name: 'SULIT', gameId: 'puzzle-sulit' }
        };
        
        // Puzzle images (placeholder images for Ubay and Lala)
        this.puzzleImages = [
            '../assets/images/puzzle/puzzle-ubay-lala-1.svg',
            '../assets/images/puzzle/puzzle-ubay-lala-2.svg',
            '../assets/images/puzzle/puzzle-ubay-lala-3.svg'
        ];
        
        // DOM elements
        this.elements = {};
        
        console.log('PuzzleGame constructor called');
        console.log('this.difficulties:', this.difficulties);
        console.log('this.puzzleImages:', this.puzzleImages);
        
        this.init();
    }

    /**
     * Initialize the puzzle game
     */
    init() {
        console.log("Puzzle Game initialized - DOM elements:", document.querySelectorAll('.difficulty-card').length);
        console.log("Puzzle Game initialized - Difficulty configurations:", this.difficulties);
        console.log("Puzzle Game initialized - Puzzle images:", this.puzzleImages);
        console.log('Calling cacheElements()...');
        this.cacheElements();
    }

    /**
     * Cache DOM elements
     */
    cacheElements() {
        console.log("Caching DOM elements...");
        this.elements = {
            difficultyScreen: document.getElementById('difficultyScreen'),
            puzzleScreen: document.getElementById('puzzleScreen'),
            completionScreen: document.getElementById('completionScreen'),
            progressIndicator: document.getElementById('progressIndicator'),
            currentLevel: document.getElementById('currentLevel'),
            moveCount: document.getElementById('moveCount'),
            timer: document.getElementById('timer'),
            puzzleGrid: document.getElementById('puzzleGrid'),
            previewImage: document.getElementById('previewImage'),
            completedLevel: document.getElementById('completedLevel'),
            finalMoves: document.getElementById('finalMoves'),
            finalTime: document.getElementById('finalTime'),
            unlockedCards: document.getElementById('unlockedCards')
        };
        
        console.log("DOM elements cached:", {
            difficultyScreen: !!this.elements.difficultyScreen,
            puzzleScreen: !!this.elements.puzzleScreen,
            puzzleGrid: !!this.elements.puzzleGrid
        });
    }

    /**
     * Start puzzle with selected difficulty
     */
    startPuzzle(difficulty) {
        console.log("=== START PUZZLE CALLED ===");
        console.log("Difficulty parameter:", difficulty);
        console.log("Available difficulties:", Object.keys(this.difficulties));
        console.log("this.elements:", this.elements);
        
        if (!this.difficulties[difficulty]) {
            console.error('Invalid difficulty:', difficulty);
            return;
        }

        console.log("Starting puzzle with difficulty:", difficulty);
        this.currentDifficulty = difficulty;
        const config = this.difficulties[difficulty];
        this.gridSize = config.size;
        
        console.log("Config:", config);
        console.log("Grid size:", this.gridSize);
        
        // Reset game state
        this.moveCount = 0;
        this.isCompleted = false;
        this.startTime = Date.now();
        
        // Update UI
        this.elements.currentLevel.textContent = config.name;
        this.elements.moveCount.textContent = '0';
        this.elements.progressIndicator.textContent = `🧩 ${config.name}`;
        
        console.log("UI updated, showing puzzle screen");
        
        // Show puzzle screen
        this.elements.difficultyScreen.style.display = 'none';
        this.elements.puzzleScreen.style.display = 'block';
        this.elements.completionScreen.style.display = 'none';
        
        // Initialize puzzle
        console.log("Initializing puzzle...");
        this.initializePuzzle();
        this.startTimer();
        
        console.log(`Started ${difficulty} puzzle (${this.gridSize}x${this.gridSize})`);
        console.log("=== START PUZZLE COMPLETE ===");
    }

    /**
     * Initialize puzzle grid
     */
    initializePuzzle() {
        const totalPieces = this.gridSize * this.gridSize;
        this.pieces = [];
        
        // Create pieces array (0 to totalPieces-1, where totalPieces-1 is empty)
        for (let i = 0; i < totalPieces - 1; i++) {
            this.pieces.push(i);
        }
        this.pieces.push(totalPieces - 1); // Empty piece
        this.emptyPosition = totalPieces - 1;
        
        // Set puzzle image
        const randomImage = this.puzzleImages[Math.floor(Math.random() * this.puzzleImages.length)];
        this.elements.previewImage.src = randomImage;
        
        // Create grid
        this.createGrid();
        
        // Shuffle pieces
        this.shufflePuzzle();
    }

    /**
     * Create puzzle grid UI
     */
    createGrid() {
        const grid = this.elements.puzzleGrid;
        grid.innerHTML = '';
        
        // Set grid template
        grid.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
        grid.style.gridTemplateRows = `repeat(${this.gridSize}, 1fr)`;
        
        // Calculate piece size based on grid size
        const pieceSize = Math.max(60, Math.min(100, 300 / this.gridSize));
        
        // Create pieces
        for (let i = 0; i < this.pieces.length; i++) {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.dataset.index = i;
            piece.style.width = `${pieceSize}px`;
            piece.style.height = `${pieceSize}px`;
            
            // Add click handler
            piece.addEventListener('click', () => this.handlePieceClick(i));
            
            // Add hover effect for valid moves
            piece.addEventListener('mouseenter', () => {
                if (!this.isCompleted) {
                    const validMoves = this.getValidMoves();
                    if (validMoves.includes(i)) {
                        piece.style.cursor = 'pointer';
                        piece.style.transform = 'scale(1.05)';
                        piece.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
                    }
                }
            });
            
            piece.addEventListener('mouseleave', () => {
                piece.style.cursor = '';
                piece.style.transform = '';
                piece.style.boxShadow = '';
            });
            
            grid.appendChild(piece);
        }
        
        this.updatePuzzleDisplay();
    }

    /**
     * Update puzzle display
     */
    updatePuzzleDisplay() {
        const pieces = this.elements.puzzleGrid.children;
        const imageUrl = this.elements.previewImage.src;
        
        for (let i = 0; i < this.pieces.length; i++) {
            const piece = pieces[i];
            const pieceValue = this.pieces[i];
            
            if (pieceValue === this.gridSize * this.gridSize - 1) {
                // Empty piece
                piece.className = 'puzzle-piece empty';
                piece.style.backgroundImage = '';
            } else {
                // Regular piece
                piece.className = 'puzzle-piece';
                
                // Calculate background position
                const row = Math.floor(pieceValue / this.gridSize);
                const col = pieceValue % this.gridSize;
                const bgPosX = (col * 100) / (this.gridSize - 1);
                const bgPosY = (row * 100) / (this.gridSize - 1);
                
                piece.style.backgroundImage = `url(${imageUrl})`;
                piece.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
                piece.style.backgroundSize = `${this.gridSize * 100}% ${this.gridSize * 100}%`;
            }
        }
    }

    /**
     * Shuffle puzzle pieces
     */
    shufflePuzzle() {
        // Perform random valid moves to ensure solvability
        const shuffleMoves = this.gridSize * this.gridSize * 10;
        
        for (let i = 0; i < shuffleMoves; i++) {
            const validMoves = this.getValidMoves();
            if (validMoves.length > 0) {
                const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
                this.swapPieces(randomMove, this.emptyPosition, false);
            }
        }
        
        this.moveCount = 0;
        this.elements.moveCount.textContent = '0';
        this.updatePuzzleDisplay();
        
        console.log('Puzzle shuffled');
    }

    /**
     * Get valid moves for empty piece
     */
    getValidMoves() {
        const validMoves = [];
        const emptyRow = Math.floor(this.emptyPosition / this.gridSize);
        const emptyCol = this.emptyPosition % this.gridSize;
        
        // Check all four directions
        const directions = [
            { row: -1, col: 0 }, // Up
            { row: 1, col: 0 },  // Down
            { row: 0, col: -1 }, // Left
            { row: 0, col: 1 }   // Right
        ];
        
        for (const dir of directions) {
            const newRow = emptyRow + dir.row;
            const newCol = emptyCol + dir.col;
            
            if (newRow >= 0 && newRow < this.gridSize && newCol >= 0 && newCol < this.gridSize) {
                validMoves.push(newRow * this.gridSize + newCol);
            }
        }
        
        return validMoves;
    }

    /**
     * Handle piece click
     */
    handlePieceClick(clickedIndex) {
        if (this.isCompleted) return;
        
        // Check if clicked piece is adjacent to empty piece
        const validMoves = this.getValidMoves();
        
        if (validMoves.includes(clickedIndex)) {
            // Add visual feedback
            const pieces = this.elements.puzzleGrid.children;
            pieces[clickedIndex].style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                this.swapPieces(clickedIndex, this.emptyPosition, true);
                pieces[clickedIndex].style.transform = '';
            }, 100);
        }
    }

    /**
     * Swap two pieces
     */
    swapPieces(index1, index2, countMove = true) {
        // Swap in array
        [this.pieces[index1], this.pieces[index2]] = [this.pieces[index2], this.pieces[index1]];
        
        // Update empty position
        if (index1 === this.emptyPosition) {
            this.emptyPosition = index2;
        } else if (index2 === this.emptyPosition) {
            this.emptyPosition = index1;
        }
        
        // Count move
        if (countMove) {
            this.moveCount++;
            this.elements.moveCount.textContent = this.moveCount;
        }
        
        // Update display
        this.updatePuzzleDisplay();
        
        // Check for completion
        if (countMove) {
            this.checkCompletion();
        }
    }

    /**
     * Check if puzzle is completed
     */
    checkCompletion() {
        // Check if all pieces are in correct positions
        for (let i = 0; i < this.pieces.length - 1; i++) {
            if (this.pieces[i] !== i) {
                return false;
            }
        }
        
        // Puzzle completed!
        this.isCompleted = true;
        this.stopTimer();
        
        // Add completion animation to all pieces
        const pieces = this.elements.puzzleGrid.children;
        for (let i = 0; i < pieces.length - 1; i++) {
            pieces[i].style.animation = 'correctPiece 0.5s ease';
            pieces[i].style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.6)';
        }
        
        // Show completion after animation
        setTimeout(() => {
            this.showCompletion();
        }, 800);
        
        return true;
    }

    /**
     * Show completion screen
     */
    async showCompletion() {
        // Stop timer
        this.stopTimer();
        
        // Update completion stats
        const config = this.difficulties[this.currentDifficulty];
        this.elements.completedLevel.textContent = config.name;
        this.elements.finalMoves.textContent = this.moveCount;
        this.elements.finalTime.textContent = this.elements.timer.textContent;
        
        // Show completion screen
        this.elements.puzzleScreen.style.display = 'none';
        this.elements.completionScreen.style.display = 'block';
        
        // Save progress and unlock rewards
        await this.saveProgressAndUnlockRewards();
        
        // Add celebration effect
        this.addCelebrationEffect();
        
        console.log(`Puzzle completed! Level: ${config.name}, Moves: ${this.moveCount}`);
    }

    /**
     * Save progress and unlock card rewards
     */
    async saveProgressAndUnlockRewards() {
        try {
            const config = this.difficulties[this.currentDifficulty];
            console.log("Saving progress and unlocking rewards for:", config.gameId);
            
            // Check if progressManager exists
            if (typeof progressManager !== 'undefined') {
                const saved = progressManager.saveProgress('gamesCompleted', config.gameId, true);
                console.log('Progress saved:', saved);
            } else {
                console.warn('progressManager not available, skipping progress save');
            }
            
            // Check if cardManager exists
            if (typeof cardManager !== 'undefined') {
                const unlockedCards = await cardManager.processRewards('game', config.gameId);
                
                // Update UI with unlocked cards
                if (unlockedCards.length > 0) {
                    this.elements.unlockedCards.textContent = unlockedCards.join(', ');
                    console.log('Cards unlocked:', unlockedCards);
                } else {
                    this.elements.unlockedCards.textContent = 'Tidak ada kartu baru';
                }
            } else {
                console.warn('cardManager not available, skipping card rewards');
                this.elements.unlockedCards.textContent = 'Sistem kartu tidak tersedia';
            }
            
        } catch (error) {
            console.error('Error saving progress or unlocking rewards:', error);
            this.elements.unlockedCards.textContent = 'Terjadi kesalahan';
        }
    }

    /**
     * Add celebration effects
     */
    addCelebrationEffect() {
        // Create floating stars
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createFloatingStar();
            }, i * 150);
        }
        
        // Create card unlock animation
        setTimeout(() => {
            this.showCardUnlockAnimation();
        }, 1000);
    }

    /**
     * Show card unlock animation
     */
    showCardUnlockAnimation() {
        const unlockedCards = this.elements.unlockedCards.textContent;
        if (unlockedCards && unlockedCards !== 'Tidak ada kartu baru' && unlockedCards !== 'Terjadi kesalahan') {
            const cardAnimation = document.createElement('div');
            cardAnimation.innerHTML = `
                <div style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: linear-gradient(135deg, #FFD700, #FFA500);
                    color: white;
                    padding: 30px;
                    border-radius: 20px;
                    font-size: 1.5em;
                    font-weight: bold;
                    text-align: center;
                    z-index: 10001;
                    animation: cardUnlockPulse 2s ease;
                    box-shadow: 0 10px 40px rgba(255, 215, 0, 0.6);
                ">
                    🎉 Kartu Terbuka! 🎉
                    <div style="font-size: 0.8em; margin-top: 10px;">
                        ${unlockedCards}
                    </div>
                </div>
            `;
            
            document.body.appendChild(cardAnimation);
            
            // Remove after animation
            setTimeout(() => {
                cardAnimation.remove();
            }, 3000);
        }
    }

    /**
     * Create floating star animation
     */
    createFloatingStar() {
        const star = document.createElement('div');
        star.innerHTML = '⭐';
        star.style.cssText = `
            position: fixed;
            font-size: ${Math.random() * 20 + 15}px;
            color: #FFD700;
            pointer-events: none;
            z-index: 10000;
            left: ${Math.random() * 100}%;
            top: 100%;
            animation: floatUp 3s ease-out forwards;
            text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
        `;
        
        document.body.appendChild(star);
        
        // Remove after animation
        setTimeout(() => {
            star.remove();
        }, 3000);
    }

    /**
     * Start timer
     */
    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            this.elements.timer.textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    /**
     * Stop timer
     */
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    /**
     * Show hint
     */
    showHint() {
        // Briefly show correct positions
        const pieces = this.elements.puzzleGrid.children;
        
        // Highlight correct pieces
        for (let i = 0; i < this.pieces.length - 1; i++) {
            if (this.pieces[i] === i) {
                pieces[i].classList.add('correct');
                setTimeout(() => {
                    pieces[i].classList.remove('correct');
                }, 1000);
            }
        }
    }

    /**
     * Play again
     */
    playAgain() {
        this.startPuzzle(this.currentDifficulty);
    }

    /**
     * Back to difficulty selection
     */
    backToDifficulty() {
        this.stopTimer();
        this.elements.puzzleScreen.style.display = 'none';
        this.elements.completionScreen.style.display = 'none';
        this.elements.difficultyScreen.style.display = 'block';
        this.elements.progressIndicator.textContent = '🧩 Menu';
    }

    /**
     * Back to main menu
     */
    backToMenu() {
        window.location.href = '../index.html';
    }
}

// Global functions for HTML onclick handlers
let puzzleGame;

function startPuzzle(difficulty) {
    console.log("=== GLOBAL START PUZZLE CALLED ===");
    console.log("Difficulty:", difficulty);
    console.log("puzzleGame exists:", !!puzzleGame);
    
    if (!puzzleGame) {
        console.log("Creating new PuzzleGame instance");
        puzzleGame = new PuzzleGame();
    }
    
    console.log("Calling puzzleGame.startPuzzle");
    puzzleGame.startPuzzle(difficulty);
    console.log("=== GLOBAL START PUZZLE COMPLETE ===");
}

function shufflePuzzle() {
    if (puzzleGame) {
        puzzleGame.shufflePuzzle();
    }
}

function showHint() {
    if (puzzleGame) {
        puzzleGame.showHint();
    }
}

function playAgain() {
    if (puzzleGame) {
        puzzleGame.playAgain();
    }
}

function backToDifficulty() {
    if (puzzleGame) {
        puzzleGame.backToDifficulty();
    }
}

function backToMenu() {
    window.location.href = '../index.html';
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("=== PUZZLE GAME DOM LOADED ===");
    console.log("DOM ready, checking elements...");
    console.log("Difficulty cards found:", document.querySelectorAll('.difficulty-card').length);
    console.log("Puzzle grid found:", !!document.getElementById('puzzleGrid'));
    console.log("Difficulty screen found:", !!document.getElementById('difficultyScreen'));
    
    console.log("Creating initial PuzzleGame instance");
    puzzleGame = new PuzzleGame();
    console.log("PuzzleGame instance created:", !!puzzleGame);
    console.log("=== PUZZLE GAME INITIALIZATION COMPLETE ===");
});

// Also try immediate initialization in case DOMContentLoaded already fired
console.log("Script loaded, checking if DOM is ready");
if (document.readyState === 'loading') {
    console.log("DOM still loading, waiting for DOMContentLoaded");
} else {
    console.log("DOM already loaded, initializing immediately");
    puzzleGame = new PuzzleGame();
}

/**
 * Handle page visibility change (pause/resume)
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Puzzle game paused');
    } else {
        console.log('Puzzle game resumed');
    }
});

/**
 * Handle beforeunload (save any unsaved progress)
 */
window.addEventListener('beforeunload', () => {
    console.log('Puzzle game unloading');
});
