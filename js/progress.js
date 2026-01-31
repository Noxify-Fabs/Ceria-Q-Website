/**
 * Progress Management System
 * Handles all localStorage operations for user progress tracking
 * localStorage key: 'ubayLalaProgress'
 */

class ProgressManager {
    constructor() {
        this.storageKey = 'ubayLalaProgress';
        this.defaultProgress = {
            storiesRead: {},
            gamesCompleted: {},
            cardsCollected: {},
            lastVisit: '',
            totalPlayTime: 0
        };
    }

    /**
     * Load progress from localStorage
     * @returns {Object} Progress data object
     */
    loadProgress() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Error loading progress:', error);
        }
        
        // Return default structure if nothing saved or error
        return this.defaultProgress;
    }

    /**
     * Save progress to localStorage
     * @param {string} category - Category (storiesRead, gamesCompleted, cardsCollected)
     * @param {string} itemId - ID of the item to update
     * @param {any} value - Value to set (usually boolean true)
     */
    saveProgress(category, itemId, value) {
        try {
            const progress = this.loadProgress();
            
            // Update specific category and item
            if (!progress[category]) {
                progress[category] = {};
            }
            progress[category][itemId] = value;
            
            // Update last visit
            progress.lastVisit = new Date().toISOString().split('T')[0];
            
            // Save back to localStorage
            localStorage.setItem(this.storageKey, JSON.stringify(progress));
            
            return true;
        } catch (error) {
            console.error('Error saving progress:', error);
            return false;
        }
    }

    /**
     * Check if an item is completed
     * @param {string} category - Category to check
     * @param {string} itemId - ID of the item to check
     * @returns {boolean} True if completed, false otherwise
     */
    isCompleted(category, itemId) {
        const progress = this.loadProgress();
        return progress[category] && progress[category][itemId] === true;
    }

    /**
     * Initialize progress system
     * Creates default structure if none exists
     */
    initializeProgress() {
        try {
            const existing = localStorage.getItem(this.storageKey);
            if (!existing) {
                localStorage.setItem(this.storageKey, JSON.stringify(this.defaultProgress));
                console.log('Progress system initialized with default data');
            }
        } catch (error) {
            console.error('Error initializing progress:', error);
        }
    }

    /**
     * Get completion statistics
     * @returns {Object} Statistics object with counts
     */
    getStats() {
        const progress = this.loadProgress();
        
        return {
            storiesRead: Object.keys(progress.storiesRead).filter(key => progress.storiesRead[key]).length,
            gamesCompleted: Object.keys(progress.gamesCompleted).filter(key => progress.gamesCompleted[key]).length,
            cardsCollected: Object.keys(progress.cardsCollected).filter(key => progress.cardsCollected[key]).length,
            lastVisit: progress.lastVisit,
            totalPlayTime: progress.totalPlayTime
        };
    }

    /**
     * Reset all progress (child-friendly)
     * Shows confirmation before resetting
     */
    resetProgress() {
        // In a real implementation, this would show a child-friendly confirmation dialog
        // For now, we'll just reset the data
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.defaultProgress));
            console.log('Progress has been reset');
            return true;
        } catch (error) {
            console.error('Error resetting progress:', error);
            return false;
        }
    }
}

// Create global instance
const progressManager = new ProgressManager();

// Initialize progress system when script loads
progressManager.initializeProgress();
