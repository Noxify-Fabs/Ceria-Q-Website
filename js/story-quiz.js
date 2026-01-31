/**
 * Story Quiz Game Controller
 * Educational quiz game for elementary school students
 * Integrates with progress and card collection systems
 */

console.log("story-quiz.js loaded");

class StoryQuizGame {
    constructor() {
        // Game state
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.isAnswering = false;
        this.questions = [];
        
        // Game configuration
        this.episode = 'episode-1';
        this.gameId = 'story-quiz-ep1';
        
        // DOM elements
        this.elements = {};
        
        this.init();
    }

    /**
     * Initialize the quiz game
     */
    async init() {
        console.log("Initializing Story Quiz Game...");
        
        try {
            // Test rendering to quiz-app div
            const quizApp = document.getElementById('quiz-app');
            if (quizApp) {
                quizApp.innerHTML = '<h3>DEBUG: JavaScript is working!</h3><p>Game initialization started...</p>';
            }
            
            // Load questions
            console.log("Loading questions...");
            this.loadQuestions();
            console.log("Questions loaded:", this.questions.length);
            
            // Get DOM elements
            console.log("Caching DOM elements...");
            this.cacheElements();
            
            // Hide loading screen
            console.log("Hiding loading screen...");
            this.hideLoadingScreen();
            
            // Start the game
            console.log("Starting game...");
            this.startGame();
            console.log("Game started successfully!");
            
            // Clear debug div after successful start
            if (quizApp) {
                quizApp.style.display = 'none';
            }
            
        } catch (error) {
            console.error('Error initializing quiz game:', error);
            
            // Always hide loading screen even on error
            this.hideLoadingScreen();
            
            // Show error in debug div but don't block rendering
            const quizApp = document.getElementById('quiz-app');
            if (quizApp) {
                quizApp.innerHTML = `<h3>ERROR: ${error.message}</h3><p>Game will load with limited functionality.</p>`;
                quizApp.style.background = '#ffcccc';
            }
            
            // Try to start game with minimal functionality
            try {
                this.loadQuestions();
                this.cacheElements();
                this.startGame();
            } catch (fallbackError) {
                console.error('Fallback initialization also failed:', fallbackError);
                // At least show the HTML structure
                const questionText = document.getElementById('questionText');
                if (questionText) {
                    questionText.textContent = 'Game loading failed. Please refresh the page.';
                }
            }
        }
    }

    /**
     * Load quiz questions
     */
    loadQuestions() {
        // Quiz questions for Episode 1
        this.questions = [
            {
                id: 1,
                episode: "episode-1",
                image: "assets/images/stories/ep1-ubay-helps.png",
                question: "Apa yang dilakukan Ubay saat melihat temannya kesulitan?",
                options: [
                    "Membantu temannya",
                    "Membiarkannya",
                    "Pergi bermain"
                ],
                correctIndex: 0
            },
            {
                id: 2,
                episode: "episode-1",
                image: "assets/images/stories/ep1-lala-shares.png",
                question: "Bagaimana sikap Lala saat melihat teman yang tidak punya makanan?",
                options: [
                    "Mengabaikannya",
                    "Berbagi makanannya",
                    "Menertawakannya"
                ],
                correctIndex: 1
            },
            {
                id: 3,
                episode: "episode-1",
                image: "assets/images/stories/ep1-together.png",
                question: "Apa pelajaran yang bisa kita pelajari dari Ubay dan Lala?",
                options: [
                    "Hanya bermain sendiri",
                    "Saling membantu dan berbagi",
                    "Tidak peduli pada teman"
                ],
                correctIndex: 1
            },
            {
                id: 4,
                episode: "episode-1",
                image: "assets/images/stories/ep1-kindness.png",
                question: "Mengapa kebaikan itu penting dalam persahabatan?",
                options: [
                    "Karena membuat semua orang senang",
                    "Karena tidak ada gunanya",
                    "Karena hanya untuk orang dewasa"
                ],
                correctIndex: 0
            },
            {
                id: 5,
                episode: "episode-1",
                image: "assets/images/stories/ep1-friends.png",
                question: "Siapa saja yang bisa menjadi sahabat surga?",
                options: [
                    "Hanya orang baik",
                    "Semua orang yang berbuat baik",
                    "Hanya Ubay dan Lala"
                ],
                correctIndex: 1
            }
        ];
    }

    /**
     * Cache DOM elements for better performance
     */
    cacheElements() {
        console.log("Caching DOM elements...");
        
        this.elements = {
            questionImage: document.getElementById('questionImage'),
            questionText: document.getElementById('questionText'),
            answerOptions: document.getElementById('answerOptions'),
            feedbackArea: document.getElementById('feedbackArea'),
            currentQuestion: document.getElementById('currentQuestion'),
            totalQuestions: document.getElementById('totalQuestions'),
            score: document.getElementById('score'),
            finalScore: document.getElementById('finalScore'),
            maxScore: document.getElementById('maxScore'),
            completionModal: document.getElementById('completionModal'),
            rewardMessage: document.getElementById('rewardMessage'),
            loadingScreen: document.getElementById('loadingScreen')
        };
        
        // Verify critical elements exist
        const criticalElements = ['questionImage', 'questionText', 'answerOptions'];
        for (const elementName of criticalElements) {
            if (!this.elements[elementName]) {
                throw new Error(`Critical element not found: ${elementName}`);
            }
        }
        
        console.log("DOM elements cached successfully");
        
        // Cache star elements
        this.stars = [];
        for (let i = 1; i <= 5; i++) {
            this.stars.push(document.getElementById(`star${i}`));
        }
    }

    /**
     * Hide loading screen with safe fallback
     */
    hideLoadingScreen() {
        try {
            const loadingScreen = this.elements.loadingScreen || document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.add('hide');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
            
            // Ensure game container is visible
            const gameContainer = document.querySelector('.game-container');
            if (gameContainer) {
                gameContainer.style.display = 'block';
                gameContainer.style.visibility = 'visible';
                gameContainer.style.opacity = '1';
            }
        } catch (error) {
            console.error('Error hiding loading screen:', error);
            // Force hide loading screen as fallback
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
        }
    }

    /**
     * Start the quiz game
     */
    startGame() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.isAnswering = false;
        
        // Update UI
        this.elements.totalQuestions.textContent = this.questions.length;
        this.elements.score.textContent = '0';
        
        // Reset stars
        this.updateStars(0);
        
        // Load first question
        this.loadQuestion();
    }

    /**
     * Load current question
     */
    loadQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.completeQuiz();
            return;
        }

        const question = this.questions[this.currentQuestionIndex];
        
        // Update question number
        this.elements.currentQuestion.textContent = this.currentQuestionIndex + 1;
        
        // Update question image
        this.elements.questionImage.src = question.image;
        this.elements.questionImage.alt = `Pertanyaan ${this.currentQuestionIndex + 1}`;
        
        // Update question text
        this.elements.questionText.textContent = question.question;
        
        // Create answer buttons
        this.createAnswerButtons(question);
        
        // Clear feedback
        this.clearFeedback();
        
        // Reset answering state
        this.isAnswering = false;
        
        // Add character guidance for first question
        if (this.currentQuestionIndex === 0) {
            setTimeout(() => {
                this.showCharacterGuidance('Halo! Ayo bantu Ubay dan Lala menjawab pertanyaan ini! 🌟');
            }, 500);
        }
    }

    /**
     * Create answer option buttons
     */
    createAnswerButtons(question) {
        this.elements.answerOptions.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'answer-button';
            button.textContent = option;
            button.onclick = () => this.selectAnswer(index);
            
            this.elements.answerOptions.appendChild(button);
        });
    }

    /**
     * Handle answer selection
     */
    selectAnswer(selectedIndex) {
        if (this.isAnswering) return;
        
        this.isAnswering = true;
        const question = this.questions[this.currentQuestionIndex];
        const isCorrect = selectedIndex === question.correctIndex;
        
        // Disable all buttons
        const buttons = this.elements.answerOptions.querySelectorAll('.answer-button');
        buttons.forEach(button => button.disabled = true);
        
        // Show correct/incorrect styling
        buttons[selectedIndex].classList.add(isCorrect ? 'correct' : 'wrong');
        if (!isCorrect) {
            buttons[question.correctIndex].classList.add('correct');
        }
        
        // Update score
        if (isCorrect) {
            this.score++;
            this.elements.score.textContent = this.score;
            this.updateStars(this.score);
        }
        
        // Show feedback
        this.showFeedback(isCorrect);
        
        // Move to next question after delay
        setTimeout(() => {
            this.currentQuestionIndex++;
            this.loadQuestion();
        }, 2000);
    }

    /**
     * Show feedback for answer
     */
    showFeedback(isCorrect) {
        const feedbackHTML = `
            <div class="feedback-icon">${isCorrect ? '😊' : '🤗'}</div>
            <div class="feedback-text ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}">
                ${isCorrect ? 'Masya Allah! Benar sekali! 🌟' : 'Tidak apa-apa, tetap semangat! 💪'}
            </div>
        `;
        
        this.elements.feedbackArea.innerHTML = feedbackHTML;
    }

    /**
     * Show character guidance message
     */
    showCharacterGuidance(message) {
        const guidanceHTML = `
            <div class="feedback-icon">👋</div>
            <div class="feedback-text" style="color: #4A90A4;">
                ${message}
            </div>
        `;
        
        this.elements.feedbackArea.innerHTML = guidanceHTML;
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            this.clearFeedback();
        }, 3000);
    }

    /**
     * Clear feedback area
     */
    clearFeedback() {
        this.elements.feedbackArea.innerHTML = '';
    }

    /**
     * Update star display
     */
    updateStars(score) {
        this.stars.forEach((star, index) => {
            if (index < score) {
                star.classList.add('earned');
            } else {
                star.classList.remove('earned');
            }
        });
    }

    /**
     * Complete the quiz and show results
     */
    async completeQuiz() {
        try {
            // Save progress
            const saved = progressManager.saveProgress('gamesCompleted', this.gameId, true);
            
            // Unlock rewards
            await this.unlockRewards();
            
            // Show completion modal
            this.showCompletionModal();
            
        } catch (error) {
            console.error('Error completing quiz:', error);
            this.showError('Terjadi kesalahan saat menyelesaikan kuis.');
        }
    }

    /**
     * Unlock reward cards
     */
    async unlockRewards() {
        try {
            const unlockedCards = [];
            
            // Always unlock quote card for episode 1
            const quoteCardUnlocked = await cardManager.unlockCard('card-004');
            if (quoteCardUnlocked) {
                unlockedCards.push('Kartu Kutipan');
            }
            
            // Unlock character card for perfect score
            if (this.score === this.questions.length) {
                const ubayCardUnlocked = await cardManager.unlockCard('card-001');
                if (ubayCardUnlocked) {
                    unlockedCards.push('Kartu Ubay Spesial');
                }
            }
            
            // Update reward message
            if (unlockedCards.length > 0) {
                this.elements.rewardMessage.textContent = 
                    `Selamat! Kamu mendapatkan: ${unlockedCards.join(', ')}`;
            } else {
                this.elements.rewardMessage.textContent = 'Kuis selesai! Lanjutkan petualanganmu!';
            }
            
        } catch (error) {
            console.error('Error unlocking rewards:', error);
            this.elements.rewardMessage.textContent = 'Kuis selesai!';
        }
    }

    /**
     * Show completion modal
     */
    showCompletionModal() {
        // Update final score
        this.elements.finalScore.textContent = this.score;
        this.elements.maxScore.textContent = this.questions.length;
        
        // Show modal
        this.elements.completionModal.classList.add('show');
        
        // Add celebration effect
        this.addCelebrationEffect();
    }

    /**
     * Add celebration effects
     */
    addCelebrationEffect() {
        // Create floating stars
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createFloatingStar();
            }, i * 100);
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
            font-size: ${Math.random() * 20 + 10}px;
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
     * Show error message
     */
    showError(message) {
        const questionCard = document.querySelector('.question-card');
        if (questionCard) {
            questionCard.innerHTML = `
                <div style="text-align: center; padding: 50px;">
                    <div style="font-size: 3em; margin-bottom: 20px;">😔</div>
                    <h2 style="color: #e53e3e; margin-bottom: 15px;">Terjadi Kesalahan</h2>
                    <p style="color: #4a5568; margin-bottom: 25px;">${message}</p>
                    <button class="back-button" onclick="window.location.href='index.html'">
                        Kembali ke Menu
                    </button>
                </div>
            `;
        }
    }

    /**
     * Reset game state (for replay)
     */
    reset() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.isAnswering = false;
        this.startGame();
    }
}

/**
 * Navigation functions
 */
function backToMenu() {
    window.location.href = 'index.html';
}

/**
 * Initialize game when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded fired - creating game instance");
    // Create global game instance
    window.storyQuizGame = new StoryQuizGame();
    console.log("Game instance created");
});

// Fallback: Try to initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    console.log("DOM still loading, waiting for DOMContentLoaded");
} else {
    console.log("DOM already loaded, initializing immediately");
    window.storyQuizGame = new StoryQuizGame();
}

// Global timeout fallback - always hide loading screen after 1 second
setTimeout(() => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen && loadingScreen.style.display !== 'none') {
        console.warn("Loading screen still visible after 1 second - force hiding");
        loadingScreen.style.display = 'none';
        
        // Ensure game container is visible
        const gameContainer = document.querySelector('.game-container');
        if (gameContainer) {
            gameContainer.style.display = 'block';
            gameContainer.style.visibility = 'visible';
            gameContainer.style.opacity = '1';
        }
    }
}, 1000);

/**
 * Handle page visibility change (pause/resume)
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Game is paused - could add pause logic here if needed
        console.log('Quiz game paused');
    } else {
        // Game is resumed
        console.log('Quiz game resumed');
    }
});

/**
 * Handle beforeunload (save any unsaved progress)
 */
window.addEventListener('beforeunload', () => {
    // Could add any last-minute save logic here
    console.log('Quiz game unloading');
});
