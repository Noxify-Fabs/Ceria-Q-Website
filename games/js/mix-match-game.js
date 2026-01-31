// Mix & Match Game Logic
class MixMatchGame {
    constructor() {
        this.currentPairs = [];
        this.images = [];
        this.texts = [];
        this.selectedImage = null;
        this.selectedText = null;
        this.connections = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.gameActive = false;
        
        this.init();
    }

    init() {
        this.setupGame();
        this.bindEvents();
    }

    setupGame() {
        // Ambil 5 pasangan acak
        this.currentPairs = getRandomPairs(5);
        
        // Pisahkan gambar dan teks
        this.images = this.currentPairs.map(pair => ({
            id: pair.id,
            image: pair.image,
            text: pair.text
        }));
        
        this.texts = this.currentPairs.map(pair => ({
            id: pair.id,
            text: pair.text
        }));
        
        // Acak posisi
        this.images = shuffleArray(this.images);
        this.texts = shuffleArray(this.texts);
        
        // Render game elements
        this.renderImages();
        this.renderTexts();
        
        // Reset game state
        this.matchedPairs = 0;
        this.moves = 0;
        this.selectedImage = null;
        this.selectedText = null;
        this.connections = [];
        this.gameActive = true;
        
        // Update stats
        this.updateStats();
        
        // Clear SVG
        this.clearConnections();
    }

    renderImages() {
        const imageColumn = document.getElementById('imageColumn');
        imageColumn.innerHTML = '';
        
        this.images.forEach((item, index) => {
            const imageItem = document.createElement('div');
            imageItem.className = 'game-item image-item';
            imageItem.dataset.id = item.id;
            imageItem.dataset.index = index;
            imageItem.innerHTML = `
                <img src="${item.image}" alt="Gambar ${item.id}" onerror="this.src='data:image/svg+xml;base64,${this.createPlaceholderImage(item.id)}'">
            `;
            
            imageItem.addEventListener('click', () => this.selectImage(item.id, index));
            imageColumn.appendChild(imageItem);
        });
    }

    renderTexts() {
        const textColumn = document.getElementById('textColumn');
        textColumn.innerHTML = '';
        
        this.texts.forEach((item, index) => {
            const textItem = document.createElement('div');
            textItem.className = 'game-item text-item';
            textItem.dataset.id = item.id;
            textItem.dataset.index = index;
            textItem.textContent = item.text;
            
            textItem.addEventListener('click', () => this.selectText(item.id, index));
            textColumn.appendChild(textItem);
        });
    }

    selectImage(id, index) {
        if (!this.gameActive) return;
        if (this.isMatched(id)) return;
        
        // Remove previous selection
        document.querySelectorAll('.image-item.selected').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Select new image
        const imageElement = document.querySelector(`.image-item[data-id="${id}"]`);
        imageElement.classList.add('selected');
        this.selectedImage = { id, index };
        
        // Check if we have both selections
        this.checkSelection();
    }

    selectText(id, index) {
        if (!this.gameActive) return;
        if (this.isMatched(id)) return;
        
        // Remove previous selection
        document.querySelectorAll('.text-item.selected').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Select new text
        const textElement = document.querySelector(`.text-item[data-id="${id}"]`);
        textElement.classList.add('selected');
        this.selectedText = { id, index };
        
        // Check if we have both selections
        this.checkSelection();
    }

    checkSelection() {
        if (this.selectedImage && this.selectedText) {
            this.moves++;
            this.updateStats();
            
            const isCorrect = this.selectedImage.id === this.selectedText.id;
            
            if (isCorrect) {
                this.handleCorrectMatch();
            } else {
                this.handleWrongMatch();
            }
        }
    }

    handleCorrectMatch() {
        const imageElement = document.querySelector(`.image-item[data-id="${this.selectedImage.id}"]`);
        const textElement = document.querySelector(`.text-item[data-id="${this.selectedText.id}"]`);
        
        // Add matched class
        imageElement.classList.add('matched');
        textElement.classList.add('matched');
        
        // Draw connection line
        this.drawConnection(this.selectedImage.index, this.selectedText.index, true);
        
        // Add to connections
        this.connections.push({
            imageId: this.selectedImage.id,
            textId: this.selectedText.id,
            imageIndex: this.selectedImage.index,
            textIndex: this.selectedText.index
        });
        
        // Update matched pairs
        this.matchedPairs++;
        this.updateStats();
        
        // Clear selections
        this.clearSelection();
        
        // Check win condition
        if (this.matchedPairs === 5) {
            this.handleWin();
        }
    }

    handleWrongMatch() {
        const imageElement = document.querySelector(`.image-item[data-id="${this.selectedImage.id}"]`);
        const textElement = document.querySelector(`.text-item[data-id="${this.selectedText.id}"]`);
        
        // Add wrong class
        imageElement.classList.add('wrong');
        textElement.classList.add('wrong');
        
        // Draw wrong connection line
        this.drawConnection(this.selectedImage.index, this.selectedText.index, false);
        
        // Remove wrong class after animation
        setTimeout(() => {
            imageElement.classList.remove('wrong');
            textElement.classList.remove('wrong');
        }, 500);
        
        // Clear selections
        setTimeout(() => {
            this.clearSelection();
        }, 500);
    }

    drawConnection(imageIndex, textIndex, isCorrect) {
        const svg = document.getElementById('connectionSvg');
        const imageElement = document.querySelector(`.image-item[data-index="${imageIndex}"]`);
        const textElement = document.querySelector(`.text-item[data-index="${textIndex}"]`);
        
        if (!imageElement || !textElement) return;
        
        const imageRect = imageElement.getBoundingClientRect();
        const textRect = textElement.getBoundingClientRect();
        const svgRect = svg.getBoundingClientRect();
        
        // Calculate connection points
        const x1 = imageRect.right - svgRect.left;
        const y1 = imageRect.top + imageRect.height / 2 - svgRect.top;
        const x2 = textRect.left - svgRect.left;
        const y2 = textRect.top + textRect.height / 2 - svgRect.top;
        
        // Create line
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('class', `connection-line ${isCorrect ? 'correct' : 'wrong'}`);
        
        if (!isCorrect) {
            // Remove wrong line after animation
            setTimeout(() => {
                if (line.parentNode) {
                    line.parentNode.removeChild(line);
                }
            }, 500);
        }
        
        svg.appendChild(line);
    }

    clearSelection() {
        this.selectedImage = null;
        this.selectedText = null;
        
        document.querySelectorAll('.selected').forEach(el => {
            el.classList.remove('selected');
        });
    }

    clearConnections() {
        const svg = document.getElementById('connectionSvg');
        svg.innerHTML = '';
    }

    isMatched(id) {
        return this.connections.some(conn => 
            conn.imageId === id || conn.textId === id
        );
    }

    updateStats() {
        document.getElementById('matchCount').textContent = this.matchedPairs;
        document.getElementById('moveCount').textContent = this.moves;
    }

    handleWin() {
        this.gameActive = false;
        
        // Show success modal
        setTimeout(() => {
            document.getElementById('finalMoves').textContent = this.moves;
            document.getElementById('successModal').classList.add('show');
        }, 1000);
    }

    bindEvents() {
        // Reset button
        window.resetGame = () => {
            this.setupGame();
        };
        
        // Check answers button (optional)
        window.checkAnswers = () => {
            if (this.gameActive) {
                // Auto-match remaining (for debugging)
                console.log('Current matches:', this.matchedPairs, '/ 5');
            }
        };
        
        // Back to menu
        window.backToMenu = () => {
            window.location.href = 'index.html';
        };
        
        // Close modal
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('show');
            }
        });
    }

    createPlaceholderImage(id) {
        // Create SVG placeholder
        const svg = `
            <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                <rect width="60" height="60" fill="#87CEEB" rx="10"/>
                <text x="30" y="35" text-anchor="middle" fill="white" font-size="24" font-weight="bold">${id}</text>
            </svg>
        `;
        return btoa(svg);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MixMatchGame();
});

// Helper functions for global access
function resetGame() {
    location.reload();
}

function backToMenu() {
    window.location.href = 'index.html';
}

function checkAnswers() {
    console.log('Check answers clicked');
}
