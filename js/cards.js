/**
 * Card Management System
 * Handles all card-related operations including loading, unlocking, and displaying
 */

class CardManager {
    constructor() {
        this.cardsData = null;
        this.progressManager = window.progressManager;
    }

    /**
     * Load cards data from JSON file
     * @returns {Promise<Array>} Array of card objects
     */
    async loadCardsData() {
        try {
            if (this.cardsData) {
                return this.cardsData.cards;
            }

            const response = await fetch('data/cards.json');
            const data = await response.json();
            this.cardsData = data;
            return data.cards;
        } catch (error) {
            console.error('Error loading cards data:', error);
            return [];
        }
    }

    /**
     * Unlock a specific card
     * @param {string} cardId - ID of the card to unlock
     * @returns {boolean} True if successfully unlocked, false if already unlocked or error
     */
    async unlockCard(cardId) {
        try {
            // Check if card is already unlocked
            if (this.isCardUnlocked(cardId)) {
                console.log('Card already unlocked:', cardId);
                return false;
            }

            // Save to progress
            const success = this.progressManager.saveProgress('cardsCollected', cardId, true);
            
            if (success) {
                console.log('Card unlocked successfully:', cardId);
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Error unlocking card:', error);
            return false;
        }
    }

    /**
     * Check if a card is unlocked
     * @param {string} cardId - ID of the card to check
     * @returns {boolean} True if unlocked, false otherwise
     */
    isCardUnlocked(cardId) {
        return this.progressManager.isCompleted('cardsCollected', cardId);
    }

    /**
     * Get all unlocked cards
     * @returns {Promise<Array>} Array of unlocked card objects
     */
    async getUnlockedCards() {
        try {
            const allCards = await this.loadCardsData();
            return allCards.filter(card => this.isCardUnlocked(card.id));
        } catch (error) {
            console.error('Error getting unlocked cards:', error);
            return [];
        }
    }

    /**
     * Get cards by type
     * @param {string} type - Card type (character, scene, quote)
     * @returns {Promise<Array>} Array of cards of specified type
     */
    async getCardsByType(type) {
        try {
            const allCards = await this.loadCardsData();
            if (type === 'all') {
                return allCards;
            }
            return allCards.filter(card => card.type === type);
        } catch (error) {
            console.error('Error getting cards by type:', error);
            return [];
        }
    }

    /**
     * Get card by ID
     * @param {string} cardId - ID of the card
     * @returns {Promise<Object|null>} Card object or null if not found
     */
    async getCardById(cardId) {
        try {
            const allCards = await this.loadCardsData();
            return allCards.find(card => card.id === cardId) || null;
        } catch (error) {
            console.error('Error getting card by ID:', error);
            return null;
        }
    }

    /**
     * Get collection statistics
     * @returns {Promise<Object>} Statistics object
     */
    async getCollectionStats() {
        try {
            const allCards = await this.loadCardsData();
            const unlockedCards = await this.getUnlockedCards();
            
            return {
                total: allCards.length,
                collected: unlockedCards.length,
                remaining: allCards.length - unlockedCards.length,
                percentage: Math.round((unlockedCards.length / allCards.length) * 100)
            };
        } catch (error) {
            console.error('Error getting collection stats:', error);
            return {
                total: 0,
                collected: 0,
                remaining: 0,
                percentage: 0
            };
        }
    }

    /**
     * Check if a card can be unlocked based on its condition
     * @param {Object} card - Card object
     * @returns {boolean} True if unlock condition is met
     */
    canUnlockCard(card) {
        if (!card.unlockCondition) {
            return false;
        }

        const { type, id } = card.unlockCondition;
        
        if (type === 'story') {
            return this.progressManager.isCompleted('storiesRead', id);
        } else if (type === 'game') {
            return this.progressManager.isCompleted('gamesCompleted', id);
        }
        
        return false;
    }

    /**
     * Process rewards and unlock applicable cards
     * @param {string} activityType - Type of activity completed (story, game)
     * @param {string} activityId - ID of the completed activity
     * @returns {Promise<Array>} Array of newly unlocked card IDs
     */
    async processRewards(activityType, activityId) {
        try {
            const allCards = await this.loadCardsData();
            const newlyUnlocked = [];

            for (const card of allCards) {
                if (!this.isCardUnlocked(card.id) && this.canUnlockCard(card)) {
                    const unlocked = await this.unlockCard(card.id);
                    if (unlocked) {
                        newlyUnlocked.push(card.id);
                    }
                }
            }

            return newlyUnlocked;
        } catch (error) {
            console.error('Error processing rewards:', error);
            return [];
        }
    }
}

// Create global instance
const cardManager = new CardManager();
