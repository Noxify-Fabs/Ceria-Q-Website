// Reward System JavaScript
class RewardSystem {
    constructor() {
        this.selectedCards = [];
        this.maxSelection = 2;
        this.currentDifficulty = 'easy';
        this.rewardCards = [];
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.hideRewardOverlay(); // Hide overlay on load
    }

    hideRewardOverlay() {
        const overlay = document.getElementById('rewardOverlay');
        if (overlay) {
            overlay.classList.remove('show');
            overlay.style.display = 'none';
            overlay.style.visibility = 'hidden';
            overlay.style.opacity = '0';
            overlay.style.zIndex = '-9999';
        }
    }

    bindEvents() {
        // Global functions for onclick handlers
        window.showReward = (difficulty) => this.showReward(difficulty);
        window.selectRewardCard = (index) => this.selectRewardCard(index);
        window.confirmRewardSelection = () => this.confirmRewardSelection();
        window.closeReward = () => this.closeReward();
    }

    showReward(difficulty) {
        this.currentDifficulty = difficulty;
        this.selectedCards = [];
        this.rewardCards = this.generateRewardCards(difficulty);
        
        // Show overlay
        const overlay = document.getElementById('rewardOverlay');
        overlay.classList.add('show');
        
        // Render reward cards
        this.renderRewardCards();
        
        // Update glow effect based on difficulty
        this.updateGlowEffect(difficulty);
    }

    generateRewardCards(difficulty) {
        const rarityPools = this.getRarityPools(difficulty);
        const cards = [];
        
        for (let i = 0; i < 3; i++) {
            const rarity = this.getRandomRarity(rarityPools);
            const card = this.getRandomCard(rarity);
            cards.push({
                id: i,
                rarity: rarity,
                card: card,
                selected: false
            });
        }
        
        return cards;
    }

    getRarityPools(difficulty) {
        switch (difficulty) {
            case 'easy':
                return [
                    { rarity: 'R', weight: 70 },
                    { rarity: 'SR', weight: 25 },
                    { rarity: 'SSR', weight: 5 }
                ];
            case 'medium':
                return [
                    { rarity: 'SR', weight: 40 },
                    { rarity: 'SSR', weight: 35 },
                    { rarity: 'SSR+', weight: 20 },
                    { rarity: 'UR', weight: 5 }
                ];
            case 'hard':
                return [
                    { rarity: 'SSR', weight: 50 },
                    { rarity: 'SSR+', weight: 30 },
                    { rarity: 'UR', weight: 20 }
                ];
            default:
                return [
                    { rarity: 'R', weight: 70 },
                    { rarity: 'SR', weight: 25 },
                    { rarity: 'SSR', weight: 5 }
                ];
        }
    }

    getRandomRarity(pools) {
        const totalWeight = pools.reduce((sum, pool) => sum + pool.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const pool of pools) {
            random -= pool.weight;
            if (random <= 0) {
                return pool.rarity;
            }
        }
        
        return pools[0].rarity;
    }

    getRandomCard(rarity) {
        const cardPool = cardDatabase[rarity] || [];
        const availableCards = cardPool.filter(card => !this.isCardUnlocked(card.id));
        
        if (availableCards.length === 0) {
            // If all cards of this rarity are unlocked, return a random card from the pool
            return cardPool[Math.floor(Math.random() * cardPool.length)];
        }
        
        return availableCards[Math.floor(Math.random() * availableCards.length)];
    }

    isCardUnlocked(cardId) {
        const unlockedCards = JSON.parse(localStorage.getItem('unlockedCards') || '[]');
        return unlockedCards.includes(cardId);
    }

    renderRewardCards() {
        const container = document.getElementById('rewardCards');
        container.innerHTML = '';
        
        this.rewardCards.forEach((rewardCard, index) => {
            const cardElement = this.createRewardCardElement(rewardCard, index);
            container.appendChild(cardElement);
        });
    }

    createRewardCardElement(rewardCard, index) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'reward-card';
        cardDiv.dataset.index = index;
        
        if (rewardCard.selected) {
            cardDiv.classList.add('selected');
        }
        
        cardDiv.innerHTML = `
            <div class="card-face card-back"></div>
            <div class="card-face card-front rarity-${rewardCard.rarity.toLowerCase()}">
                <div class="card-image">${rewardCard.card.icon}</div>
                <div class="card-name">${rewardCard.card.name}</div>
                <div class="card-rarity ${rewardCard.rarity.toLowerCase()}">${rewardCard.rarity}</div>
            </div>
        `;
        
        cardDiv.addEventListener('click', () => this.selectRewardCard(index));
        
        return cardDiv;
    }

    updateGlowEffect(difficulty) {
        const cards = document.querySelectorAll('.reward-card');
        cards.forEach(card => {
            card.classList.remove('glow-easy', 'glow-medium', 'glow-hard');
            card.classList.add(`glow-${difficulty}`);
        });
    }

    selectRewardCard(index) {
        if (this.selectedCards.length >= this.maxSelection) {
            return;
        }
        
        const rewardCard = this.rewardCards[index];
        if (rewardCard.selected) {
            return;
        }
        
        rewardCard.selected = true;
        this.selectedCards.push(index);
        
        // Update UI
        const cardElement = document.querySelector(`[data-index="${index}"]`);
        cardElement.classList.add('selected');
        
        // Disable other cards if max selection reached
        if (this.selectedCards.length >= this.maxSelection) {
            this.disableUnselectedCards();
        }
        
        // Auto confirm after selection
        if (this.selectedCards.length >= this.maxSelection) {
            setTimeout(() => this.confirmRewardSelection(), 1000);
        }
    }

    disableUnselectedCards() {
        this.rewardCards.forEach((card, index) => {
            if (!card.selected) {
                const cardElement = document.querySelector(`[data-index="${index}"]`);
                cardElement.classList.add('disabled');
            }
        });
    }

    confirmRewardSelection() {
        if (this.selectedCards.length === 0) {
            return;
        }
        
        // Add selected cards to collection
        const unlockedCards = JSON.parse(localStorage.getItem('unlockedCards') || '[]');
        
        this.selectedCards.forEach(index => {
            const rewardCard = this.rewardCards[index];
            if (!unlockedCards.includes(rewardCard.card.id)) {
                unlockedCards.push(rewardCard.card.id);
            }
        });
        
        localStorage.setItem('unlockedCards', JSON.stringify(unlockedCards));
        
        // Show success message
        this.showRewardSuccess();
        
        // Update collection progress
        this.updateCollectionProgress();
    }

    showRewardSuccess() {
        const successMessage = document.createElement('div');
        successMessage.className = 'reward-success-message';
        successMessage.innerHTML = `
            <h3>🎉 Kartu berhasil ditambahkan ke koleksimu!</h3>
            <p>Kamu mendapatkan ${this.selectedCards.length} kartu baru!</p>
        `;
        
        const container = document.querySelector('.reward-container');
        container.appendChild(successMessage);
        
        // Remove cards and show back button
        setTimeout(() => {
            document.getElementById('rewardCards').style.display = 'none';
            document.querySelector('.selection-instruction').style.display = 'none';
            
            const backButton = document.createElement('button');
            backButton.className = 'reward-button';
            backButton.textContent = 'Kembali ke Menu Game';
            backButton.onclick = () => this.closeReward();
            
            container.appendChild(backButton);
        }, 2000);
    }

    updateCollectionProgress() {
        // Update progress bar if it exists
        const progressBar = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressBar && progressText) {
            const totalCards = this.getTotalCardCount();
            const unlockedCards = JSON.parse(localStorage.getItem('unlockedCards') || '[]');
            const progress = (unlockedCards.length / totalCards) * 100;
            
            progressBar.style.width = `${progress}%`;
            progressBar.textContent = `${Math.round(progress)}%`;
            progressText.textContent = `${unlockedCards.length} dari ${totalCards} kartu`;
        }
    }

    getTotalCardCount() {
        let total = 0;
        Object.values(cardDatabase).forEach(rarityCards => {
            total += rarityCards.length;
        });
        return total;
    }

    closeReward() {
        const overlay = document.getElementById('rewardOverlay');
        overlay.classList.remove('show');
        
        // Reset for next use
        setTimeout(() => {
            this.selectedCards = [];
            this.rewardCards = [];
            
            // Reset UI
            document.getElementById('rewardCards').style.display = 'flex';
            document.querySelector('.selection-instruction').style.display = 'block';
            
            // Remove temporary elements
            const successMessage = document.querySelector('.reward-success-message');
            const backButton = document.querySelector('.reward-container .reward-button:last-child');
            
            if (successMessage) successMessage.remove();
            if (backButton) backButton.remove();
        }, 600);
    }
}

// Card Database
const cardDatabase = {
    'R': [
        { id: 'r001', name: 'Bunga Matahari', icon: '🌻', rarity: 'R' },
        { id: 'r002', name: 'Pohon Hijau', icon: '🌳', rarity: 'R' },
        { id: 'r003', name: 'Awan Putih', icon: '☁️', rarity: 'R' },
        { id: 'r004', name: 'Rumah Kecil', icon: '🏠', rarity: 'R' },
        { id: 'r005', name: 'Buku Cerita', icon: '📚', rarity: 'R' },
        { id: 'r006', name: 'Pensil Warna', icon: '✏️', rarity: 'R' },
        { id: 'r007', name: 'Apel Merah', icon: '🍎', rarity: 'R' },
        { id: 'r008', name: 'Sepeda Anak', icon: '🚲', rarity: 'R' },
        { id: 'r009', name: 'Kucing Lucu', icon: '🐱', rarity: 'R' },
        { id: 'r010', name: 'Burung Kecil', icon: '🐦', rarity: 'R' },
        { id: 'r011', name: 'Bunga Mawar', icon: '🌹', rarity: 'R' },
        { id: 'r012', name: 'Pohon Pinus', icon: '🌲', rarity: 'R' },
        { id: 'r013', name: 'Matahari', icon: '☀️', rarity: 'R' },
        { id: 'r014', name: 'Bulan Sabit', icon: '🌙', rarity: 'R' },
        { id: 'r015', name: 'Bintang Kecil', icon: '⭐', rarity: 'R' }
    ],
    'SR': [
        { id: 'sr001', name: 'Masjid Indah', icon: '🕌', rarity: 'SR' },
        { id: 'sr002', name: 'Anak Belajar', icon: '👦📚', rarity: 'SR' },
        { id: 'sr003', name: 'Taman Bermain', icon: '🎠', rarity: 'SR' },
        { id: 'sr004', name: 'Perpustakaan', icon: '📖', rarity: 'SR' },
        { id: 'sr005', name: 'Kelinci Putih', icon: '🐰', rarity: 'SR' },
        { id: 'sr006', name: 'Kupu-Kupu', icon: '🦋', rarity: 'SR' },
        { id: 'sr007', name: 'Pelangi', icon: '🌈', rarity: 'SR' },
        { id: 'sr008', name: 'Air Terjun', icon: '💧', rarity: 'SR' },
        { id: 'sr009', name: 'Gunung Hijau', icon: '⛰️', rarity: 'SR' },
        { id: 'sr010', name: 'Danau Biru', icon: '🏞️', rarity: 'SR' }
    ],
    'SSR': [
        { id: 'ssr001', name: 'Istana Negeri', icon: '🏰', rarity: 'SSR' },
        { id: 'ssr002', name: 'Kapal Layar', icon: '⛵', rarity: 'SSR' },
        { id: 'ssr003', name: 'Pesawat Terbang', icon: '✈️', rarity: 'SSR' },
        { id: 'ssr004', name: 'Rohana', icon: '👧🏫', rarity: 'SSR' },
        { id: 'ssr005', name: 'Ubay', icon: '👦🏫', rarity: 'SSR' },
        { id: 'ssr006', name: 'Keluarga Bahagia', icon: '👨‍👩‍👧‍👦', rarity: 'SSR' },
        { id: 'ssr007', name: 'Taman Surga', icon: '🌺', rarity: 'SSR' },
        { id: 'ssr008', name: 'Lautan Biru', icon: '🌊', rarity: 'SSR' }
    ],
    'SSR+': [
        { id: 'ssrp001', name: 'Ka\'bah', icon: '🕋', rarity: 'SSR+' },
        { id: 'ssrp002', name: 'Masjid Nabawi', icon: '🕌', rarity: 'SSR+' },
        { id: 'ssrp003', name: 'Al-Qur\'an', icon: '📖', rarity: 'SSR+' },
        { id: 'ssrp004', name: 'Tasbih', icon: '📿', rarity: 'SSR+' },
        { id: 'ssrp005', name: 'Sajadah', icon: '🕌', rarity: 'SSR+' }
    ],
    'UR': [
        { id: 'ur001', name: 'Surga', icon: '🌟', rarity: 'UR' },
        { id: 'ur002', name: 'Malaikat', icon: '👼', rarity: 'UR' },
        { id: 'ur003', name: 'Cahaya Ilahi', icon: '✨', rarity: 'UR' }
    ]
};

// Initialize reward system
let rewardSystem;

document.addEventListener('DOMContentLoaded', () => {
    rewardSystem = new RewardSystem();
});

// Global functions
function showReward(difficulty) {
    if (rewardSystem) {
        rewardSystem.showReward(difficulty);
    }
}

function selectRewardCard(index) {
    if (rewardSystem) {
        rewardSystem.selectRewardCard(index);
    }
}

function confirmRewardSelection() {
    if (rewardSystem) {
        rewardSystem.confirmRewardSelection();
    }
}

function closeReward() {
    if (rewardSystem) {
        rewardSystem.closeReward();
    }
}

// Hide reward overlay on page load
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('rewardOverlay');
    if (overlay) {
        overlay.classList.remove('show');
        overlay.style.display = 'none';
        overlay.style.visibility = 'hidden';
        overlay.style.opacity = '0';
        overlay.style.zIndex = '-9999';
    }
});
