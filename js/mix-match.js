/**
 * Mix & Match Game - Educational matching game
 * Educational matching game for elementary school students
 * Integrates with existing progress and card collection systems
 */

class MixMatchGame {
    constructor() {
        // Game state
        this.currentDifficulty = null;
        this.gridSize = { rows: 0, cols: 0 };
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moveCount = 0;
        this.isProcessing = false;
        this.isCompleted = false;
        
        // Difficulty configurations
        this.difficulties = {
            mudah: { rows: 3, cols: 2, name: 'MUDAH', gameId: 'mix-match-mudah' },
            sedang: { rows: 4, cols: 3, name: 'SEDANG', gameId: 'mix-match-sedang' },
            sulit: { rows: 4, cols: 4, name: 'SULIT', gameId: 'mix-match-sulit' }
        };
        
        // Game data - pairs of related items
        this.gameData = [
            // Character pairs
            { id: 1, type: 'image', value: '../assets/images/mix-match/ubay-lala-belajar.svg', pair: 'Ubay' },
            { id: 2, type: 'text', value: 'Ubay', pair: '../assets/images/mix-match/ubay-lala-belajar.svg' },
            
            // Islamic values pairs
            { id: 3, type: 'image', value: '../assets/images/mix-match/nilai-islam.svg', pair: 'Jujur' },
            { id: 4, type: 'text', value: 'Jujur', pair: '../assets/images/mix-match/nilai-islam.svg' },
            
            // Additional pairs for harder levels
            { id: 5, type: 'text', value: 'Sabar', pair: 'Menunggu dengan tenang' },
            { id: 6, type: 'text', value: 'Menunggu dengan tenang', pair: 'Sabar' },
            
            { id: 7, type: 'text', value: 'Tolong-menolong', pair: 'Membantu teman' },
            { id: 8, type: 'text', value: 'Membantu teman', pair: 'Tolong-menolong' },
            
            { id: 9, type: 'text', value: 'Baik', pair: 'Sikap ramah' },
            { id: 10, type: 'text', value: 'Sikap ramah', pair: 'Baik' },
            
            { id: 11, type: 'text', value: 'Belajar', pair: 'Membaca buku' },
            { id: 12, type: 'text', value: 'Membaca buku', pair: 'Belajar' },
            
            { id: 13, type: 'text', value: 'Berkata baik', pair: 'Perkataan sopan' },
            { id: 14, type: 'text', value: 'Perkataan sopan', pair: 'Berkata baik' },
            
            { id: 15, type: 'text', value: 'Bersyukur', pair: 'Mengucapkan terima kasih' },
            { id: 16, type: 'text', value: 'Mengucapkan terima kasih', pair: 'Bersyukur' }
        ];
        
        // DOM elements
        this.elements = {};
        
        this.init();
    }

    /**
     * Initialize the Mix & Match game
     */
    init() {
        console.log("Mix & Match Game initialized");
        this.cacheElements();
    }

    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.elements = {
            difficultyScreen: document.getElementById('difficultyScreen'),
            gameScreen: document.getElementById('gameScreen'),
            completionScreen: document.getElementById('completionScreen'),
            progressIndicator: document.getElementById('progressIndicator'),
            currentLevel: document.getElementById('currentLevel'),
            matchCount: document.getElementById('matchCount'),
            moveCount: document.getElementById('moveCount'),
            cardsGrid: document.getElementById('cardsGrid'),
            completedLevel: document.getElementById('completedLevel'),
            finalMatches: document.getElementById('finalMatches'),
            finalMoves: document.getElementById('finalMoves'),
            unlockedCards: document.getElementById('unlockedCards')
        };
    }

    /**
     * Start game with selected difficulty
     */
    startGame(difficulty) {
        if (!this.difficulties[difficulty]) {
            console.error('Invalid difficulty:', difficulty);
            return;
        }

        this.currentDifficulty = difficulty;
        const config = this.difficulties[difficulty];
        this.gridSize = { rows: config.rows, cols: config.cols };
        
        // Reset game state
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moveCount = 0;
        this.isCompleted = false;
        this.isProcessing = false;
        
        // Update UI
        this.elements.currentLevel.textContent = config.name;
        this.elements.matchCount.textContent = '0';
        this.elements.moveCount.textContent = '0';
        this.elements.progressIndicator.textContent = `🎴 ${config.name}`;
        
        // Show game screen
        this.elements.difficultyScreen.style.display = 'none';
        this.elements.gameScreen.style.display = 'block';
        this.elements.completionScreen.style.display = 'none';
        
        // Initialize game
        this.initializeCards();
        this.createCardGrid();
        
        console.log(`Started ${difficulty} Mix & Match game (${config.rows}x${config.cols})`);
    }

    /**
     * Initialize cards based on difficulty
     */
    initializeCards() {
        const totalCards = this.gridSize.rows * this.gridSize.cols;
        const pairsNeeded = totalCards / 2;
        
        // Select pairs based on difficulty
        let selectedPairs = [];
        if (pairsNeeded <= 2) {
            // Easy: Use first 2 pairs
            selectedPairs = this.gameData.slice(0, 4);
        } else if (pairsNeeded <= 6) {
            // Medium: Use first 6 pairs
            selectedPairs = this.gameData.slice(0, 12);
        } else {
            // Hard: Use first 8 pairs
            selectedPairs = this.gameData.slice(0, 16);
        }
        
        // Create card array (each pair appears twice)
        this.cards = [];
        selectedPairs.forEach(pair => {
            this.cards.push({ ...pair, uniqueId: Math.random() });
            // Find and add the matching pair
            const matchingPair = this.gameData.find(item => item.value === pair.pair);
            if (matchingPair) {
                this.cards.push({ ...matchingPair, uniqueId: Math.random() });
            }
        });
        
        // Shuffle cards
        this.shuffleArray(this.cards);
    }

    /**
     * Shuffle array using Fisher-Yates algorithm
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    /**
     * Create card grid UI
     */
    createCardGrid() {
        const grid = this.elements.cardsGrid;
        grid.innerHTML = '';
        
        // Set grid template
        grid.style.gridTemplateColumns = `repeat(${this.gridSize.cols}, 1fr)`;
        grid.style.gridTemplateRows = `repeat(${this.gridSize.rows}, 1fr)`;
        
        // Calculate card size based on grid size
        const cardSize = Math.max(60, Math.min(100, 300 / Math.max(this.gridSize.rows, this.gridSize.cols)));
        
        // Create cards
        this.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'memory-card';
            cardElement.dataset.index = index;
            cardElement.dataset.pairId = card.pair;
            cardElement.style.width = `${cardSize}px`;
            cardElement.style.height = `${cardSize}px`;
            
            // Create card faces
            const cardBack = document.createElement('div');
            cardBack.className = 'card-face card-back';
            
            const cardFront = document.createElement('div');
            cardFront.className = 'card-face card-front';
            
            // Add content to front face
            if (card.type === 'image') {
                const img = document.createElement('img');
                img.src = card.value;
                img.alt = 'Card image';
                img.style.maxWidth = '80%';
                img.style.maxHeight = '80%';
                img.style.objectFit = 'contain';
                cardFront.appendChild(img);
            } else {
                cardFront.textContent = card.value;
            }
            
            cardElement.appendChild(cardBack);
            cardElement.appendChild(cardFront);
            
            // Add click handler
            cardElement.addEventListener('click', () => this.handleCardClick(index));
            
            grid.appendChild(cardElement);
        });
    }

    /**
     * Handle card click
     */
    handleCardClick(index) {
        if (this.isProcessing || this.isCompleted) return;
        
        const cardElement = this.elements.cardsGrid.children[index];
        
        // Check if card is already flipped or matched
        if (cardElement.classList.contains('flipped') || cardElement.classList.contains('matched')) {
            return;
        }
        
        // Check if two cards are already flipped
        if (this.flippedCards.length >= 2) {
            return;
        }
        
        // Flip the card
        cardElement.classList.add('flipped');
        this.flippedCards.push(index);
        
        // Check for match if two cards are flipped
        if (this.flippedCards.length === 2) {
            this.isProcessing = true;
            this.moveCount++;
            this.elements.moveCount.textContent = this.moveCount;
            
            setTimeout(() => {
                this.checkMatch();
            }, 800);
        }
    }

    /**
     * Check if flipped cards match
     */
    checkMatch() {
        const [index1, index2] = this.flippedCards;
        const card1 = this.cards[index1];
        const card2 = this.cards[index2];
        const cardElement1 = this.elements.cardsGrid.children[index1];
        const cardElement2 = this.elements.cardsGrid.children[index2];
        
        // Check if cards match (they have the same pair value)
        if (card1.pair === card2.value || card2.pair === card1.value) {
            // Match found!
            cardElement1.classList.add('matched');
            cardElement2.classList.add('matched');
            this.matchedPairs++;
            this.elements.matchCount.textContent = this.matchedPairs;
            
            // Check for completion
            if (this.matchedPairs === this.cards.length / 2) {
                setTimeout(() => {
                    this.completeGame();
                }, 600);
            }
        } else {
            // No match - flip cards back
            cardElement1.classList.remove('flipped');
            cardElement2.classList.remove('flipped');
        }
        
        // Reset flipped cards array
        this.flippedCards = [];
        this.isProcessing = false;
    }

    /**
     * Complete the game
     */
    async completeGame() {
        this.isCompleted = true;
        
        // Update completion stats
        const config = this.difficulties[this.currentDifficulty];
        this.elements.completedLevel.textContent = config.name;
        this.elements.finalMatches.textContent = this.matchedPairs;
        this.elements.finalMoves.textContent = this.moveCount;
        
        // Show completion screen
        this.elements.gameScreen.style.display = 'none';
        this.elements.completionScreen.style.display = 'block';
        
        // Save progress and unlock rewards
        await this.saveProgressAndUnlockRewards();
        
        // Add celebration effect
        this.addCelebrationEffect();
        
        console.log(`Mix & Match completed! Level: ${config.name}, Matches: ${this.matchedPairs}, Moves: ${this.moveCount}`);
    }

    /**
     * Save progress and unlock card rewards
     */
    async saveProgressAndUnlockRewards() {
        try {
            const config = this.difficulties[this.currentDifficulty];
            
            // Save progress
            if (typeof progressManager !== 'undefined') {
                const saved = progressManager.saveProgress('gamesCompleted', config.gameId, true);
                console.log('Progress saved:', saved);
            } else {
                console.warn('progressManager not available, skipping progress save');
            }
            
            // Process card rewards
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
        for (let i = 0; i < 15; i++) {
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
     * Reset current game
     */
    resetGame() {
        this.startGame(this.currentDifficulty);
    }

    /**
     * Play again
     */
    playAgain() {
        this.startGame(this.currentDifficulty);
    }

    /**
     * Back to difficulty selection
     */
    backToDifficulty() {
        this.elements.gameScreen.style.display = 'none';
        this.elements.completionScreen.style.display = 'none';
        this.elements.difficultyScreen.style.display = 'block';
        this.elements.progressIndicator.textContent = '🎴 Menu';
    }

    /**
     * Back to main menu
     */
    backToMenu() {
        window.location.href = '../index.html';
    }
}

// Global functions for HTML onclick handlers
let mixMatchGame;

function startGame(difficulty) {
    console.log("=== GLOBAL START MIX & MATCH CALLED ===");
    console.log("Difficulty:", difficulty);
    console.log("mixMatchGame exists:", !!mixMatchGame);
    
    if (!mixMatchGame) {
        console.log("Creating new MixMatchGame instance");
        mixMatchGame = new MixMatchGame();
    }
    
    console.log("Calling mixMatchGame.startGame");
    mixMatchGame.startGame(difficulty);
    console.log("=== GLOBAL START MIX & MATCH COMPLETE ===");
}

function resetGame() {
    if (mixMatchGame) {
        mixMatchGame.resetGame();
    }
}

function playAgain() {
    if (mixMatchGame) {
        mixMatchGame.playAgain();
    }
}

function backToDifficulty() {
    if (mixMatchGame) {
        mixMatchGame.backToDifficulty();
    }
}

function backToMenu() {
    window.location.href = '../index.html';
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("=== MIX & MATCH GAME DOM LOADED ===");
    console.log("DOM ready, checking elements...");
    console.log("Difficulty cards found:", document.querySelectorAll('.difficulty-card').length);
    console.log("Cards grid found:", !!document.getElementById('cardsGrid'));
    console.log("Difficulty screen found:", !!document.getElementById('difficultyScreen'));
    
    console.log("Creating initial MixMatchGame instance");
    mixMatchGame = new MixMatchGame();
    console.log("MixMatchGame instance created:", !!mixMatchGame);
    console.log("=== MIX & MATCH GAME INITIALIZATION COMPLETE ===");
});

// Also try immediate initialization in case DOMContentLoaded already fired
console.log("Script loaded, checking if DOM is ready");
if (document.readyState === 'loading') {
    console.log("DOM still loading, waiting for DOMContentLoaded");
} else {
    console.log("DOM already loaded, initializing immediately");
    mixMatchGame = new MixMatchGame();
}

/**
 * Handle page visibility change (pause/resume)
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Mix & Match game paused');
    } else {
        console.log('Mix & Match game resumed');
    }
});

/**
 * Handle beforeunload (save any unsaved progress)
 */
window.addEventListener('beforeunload', () => {
    console.log('Mix & Match game unloading');
});
