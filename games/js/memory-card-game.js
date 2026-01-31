// Memory Card Game Logic
class MemoryCardGame {
    constructor() {
        this.currentLevel = '';
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.isProcessing = false;
        this.gameActive = false;
        
        this.init();
    }

    init() {
        // Show difficulty screen by default
        this.showScreen('difficultyScreen');
        this.bindEvents();
    }

    bindEvents() {
        // Global functions for onclick handlers
        window.startGame = (level) => this.startGame(level);
        window.resetLevel = () => this.resetLevel();
        window.backToDifficulty = () => this.backToDifficulty();
        window.backToMenu = () => this.backToMenu();
        
        // Modal close on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('show');
            }
        });
    }

    startGame(level) {
        this.currentLevel = level;
        this.gameActive = true;
        
        // Get level configuration
        const config = getLevelConfig(level);
        if (!config) {
            console.error('Level configuration not found:', level);
            return;
        }
        
        // Update UI
        document.getElementById('currentLevel').textContent = config.name;
        
        // Reset game state
        this.cards = getCardsForLevel(level);
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.isProcessing = false;
        
        // Update stats
        this.updateStats();
        
        // Show game screen
        this.showScreen('gameScreen');
        
        // Generate and render cards
        this.generateCards();
    }

    generateCards() {
        const cardsGrid = document.getElementById('cardsGrid');
        cardsGrid.innerHTML = '';
        
        // Set grid class based on level
        const config = getLevelConfig(this.currentLevel);
        cardsGrid.className = `cards-grid ${config.grid}`;
        
        // Create card elements
        this.cards.forEach((card, index) => {
            const cardElement = this.createCardElement(card, index);
            cardsGrid.appendChild(cardElement);
        });
    }

    createCardElement(card, index) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'memory-card';
        cardDiv.dataset.index = index;
        cardDiv.dataset.pairId = card.pairId;
        
        cardDiv.innerHTML = `
            <div class="card-face card-front">
                <img src="${card.image}" alt="${card.name}" onerror="this.src='data:image/svg+xml;base64,${this.createPlaceholderImage(card.name)}'">
            </div>
            <div class="card-face card-back"></div>
        `;
        
        // Add click handler
        cardDiv.addEventListener('click', () => this.flipCard(index));
        
        return cardDiv;
    }

    flipCard(index) {
        // Prevent flipping if game is not active or processing
        if (!this.gameActive || this.isProcessing) return;
        
        // Prevent flipping the same card twice
        if (this.flippedCards.includes(index)) return;
        
        // Prevent flipping more than 2 cards
        if (this.flippedCards.length >= 2) return;
        
        // Get card element
        const cardElement = document.querySelector(`[data-index="${index}"]`);
        if (!cardElement) return;
        
        // Check if card is already matched
        if (cardElement.classList.contains('matched')) return;
        
        // Flip the card
        cardElement.classList.add('flipped');
        this.flippedCards.push(index);
        
        // Check for match when 2 cards are flipped
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateStats();
            this.checkMatch();
        }
    }

    checkMatch() {
        this.isProcessing = true;
        
        const [index1, index2] = this.flippedCards;
        const card1 = this.cards[index1];
        const card2 = this.cards[index2];
        
        const cardElement1 = document.querySelector(`[data-index="${index1}"]`);
        const cardElement2 = document.querySelector(`[data-index="${index2}"]`);
        
        if (card1.pairId === card2.pairId) {
            // Match found!
            setTimeout(() => {
                cardElement1.classList.add('matched');
                cardElement2.classList.add('matched');
                
                this.matchedPairs++;
                this.flippedCards = [];
                this.isProcessing = false;
                
                this.updateStats();
                this.checkWin();
            }, 500);
        } else {
            // No match
            setTimeout(() => {
                cardElement1.classList.add('wrong');
                cardElement2.classList.add('wrong');
                
                setTimeout(() => {
                    cardElement1.classList.remove('flipped', 'wrong');
                    cardElement2.classList.remove('flipped', 'wrong');
                    
                    this.flippedCards = [];
                    this.isProcessing = false;
                }, 500);
            }, 1000);
        }
    }

    checkWin() {
        const config = getLevelConfig(this.currentLevel);
        if (!config) return;
        
        // Check if all pairs are matched
        if (this.matchedPairs >= config.pairs) {
            setTimeout(() => {
                this.showSuccessModal();
            }, 1000);
        }
    }

    showSuccessModal() {
        const modal = document.getElementById('successModal');
        
        // Update modal content
        document.getElementById('completedLevel').textContent = this.currentLevel.toUpperCase();
        document.getElementById('finalMoves').textContent = this.moves;
        document.getElementById('finalPairs').textContent = this.matchedPairs;
        
        // Show modal
        modal.classList.add('show');
        
        // Stop game
        this.gameActive = false;
    }

    updateStats() {
        document.getElementById('moveCount').textContent = this.moves;
        document.getElementById('pairCount').textContent = this.matchedPairs;
    }

    resetLevel() {
        // Hide modal if shown
        document.getElementById('successModal').classList.remove('show');
        
        // Restart current level
        if (this.currentLevel) {
            this.startGame(this.currentLevel);
        }
    }

    backToDifficulty() {
        // Hide modal if shown
        document.getElementById('successModal').classList.remove('show');
        
        // Show difficulty screen
        this.showScreen('difficultyScreen');
        
        // Reset game state
        this.gameActive = false;
        this.currentLevel = '';
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.isProcessing = false;
        
        // Reset stats
        document.getElementById('currentLevel').textContent = '-';
        document.getElementById('moveCount').textContent = '0';
        document.getElementById('pairCount').textContent = '0';
    }

    backToMenu() {
        window.location.href = 'index.html';
    }

    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.style.display = 'none';
        });
        
        // Show selected screen
        const selectedScreen = document.getElementById(screenId);
        if (selectedScreen) {
            selectedScreen.style.display = 'block';
        }
    }

    createPlaceholderImage(name) {
        // Create SVG placeholder
        const colors = [
            '#FFB6C1', '#87CEEB', '#98FB98', '#DDA0DD', '#F0E68C',
            '#FFA07A', '#20B2AA', '#87CEFA', '#FFB347', '#77DD77'
        ];
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const initial = name.charAt(0).toUpperCase();
        
        const svg = `
            <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                <rect width="80" height="80" fill="${color}" rx="15"/>
                <text x="40" y="45" text-anchor="middle" fill="white" font-size="24" font-weight="bold" font-family="Arial, sans-serif">${initial}</text>
            </svg>
        `;
        
        return btoa(svg);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MemoryCardGame();
});

// Helper functions for global access
function startGame(level) {
    console.log('Starting game:', level);
}

function resetLevel() {
    console.log('Resetting level');
}

function backToDifficulty() {
    console.log('Back to difficulty selection');
}

function backToMenu() {
    window.location.href = 'index.html';
}
