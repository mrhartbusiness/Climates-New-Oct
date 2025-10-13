// Screen Management System for Full-Screen Immersive Experience

class ScreenManager {
    constructor() {
        this.currentScreen = 0;
        this.screens = [];
        this.progressDot = null;
        this.isRestoringState = false;
    }

    init() {
        // Create progress dot
        this.createProgressDot();

        // Setup click-anywhere listeners
        this.setupClickAnywhere();

        // Setup browser history integration
        this.setupHistoryIntegration();

        // Restore progress from localStorage
        this.restoreProgress();
    }

    createProgressDot() {
        if (document.body) {
            this.progressDot = document.createElement('div');
            this.progressDot.className = 'progress-dot';
            this.progressDot.textContent = '0/150 •';
            document.body.appendChild(this.progressDot);
        }
    }

    updateProgress(current, total) {
        if (this.progressDot) {
            this.progressDot.textContent = `${current}/${total} •`;
        }
    }

    setupClickAnywhere() {
        document.addEventListener('click', (e) => {
            const screen = document.querySelector('.screen.active');
            if (!screen) return;

            // Check if screen allows click-anywhere advancement
            if (!screen.dataset.clickAnywhere) return;

            // Ignore clicks on interactive elements
            if (e.target.closest('button, input, .quiz-option, .draggable-item, .drop-zone, canvas')) {
                return;
            }

            // Advance to next screen
            this.nextScreen();
        });
    }

    showScreen(index) {
        // Hide all screens
        const allScreens = document.querySelectorAll('.screen');
        allScreens.forEach(s => {
            s.classList.remove('active');
            s.style.display = 'none';  // Force hide to prevent stacking
        });

        // Show target screen
        const targetScreen = document.querySelectorAll('.screen')[index];
        if (targetScreen) {
            targetScreen.style.display = 'flex';  // Ensure it's visible
            targetScreen.classList.add('active');
            this.currentScreen = index;

            // Update browser history and save progress (unless we're restoring state)
            if (!this.isRestoringState) {
                this.pushState(index);
                this.saveProgress();
            }
        }
    }

    nextScreen() {
        this.showScreen(this.currentScreen + 1);
    }

    prevScreen() {
        if (this.currentScreen > 0) {
            this.showScreen(this.currentScreen - 1);
        }
    }

    setupHistoryIntegration() {
        // Listen for browser back/forward button
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.screen !== undefined) {
                // Navigate to the requested screen
                this.isRestoringState = true;
                this.showScreen(event.state.screen);
                this.isRestoringState = false;
            } else {
                // If no state, go to screen 0 and push state
                this.isRestoringState = true;
                this.showScreen(0);
                this.isRestoringState = false;
                window.history.pushState({ screen: 0 }, '', window.location.href);
            }
        });

        // Initialize with current state
        if (window.history.state === null) {
            window.history.replaceState({ screen: this.currentScreen }, '', window.location.href);
        }
    }

    pushState(screenIndex) {
        // Push new history state for browser back button support
        window.history.pushState({ screen: screenIndex }, '', window.location.href);
    }

    saveProgress() {
        // Save current screen to localStorage
        try {
            localStorage.setItem('climateHub_currentScreen', this.currentScreen.toString());
        } catch (e) {
            console.warn('Failed to save progress to localStorage:', e);
        }
    }

    restoreProgress() {
        // Restore screen position from localStorage
        try {
            const savedScreen = localStorage.getItem('climateHub_currentScreen');
            if (savedScreen !== null) {
                const screenIndex = parseInt(savedScreen, 10);
                if (!isNaN(screenIndex) && screenIndex >= 0) {
                    this.isRestoringState = true;
                    this.showScreen(screenIndex);
                    this.isRestoringState = false;
                    
                    // Update history state
                    window.history.replaceState({ screen: screenIndex }, '', window.location.href);
                }
            }
        } catch (e) {
            console.warn('Failed to restore progress from localStorage:', e);
        }
    }
}

// Overlay Management for Success/Error Full-Screen Displays
class OverlayManager {
    constructor() {
        this.overlay = null;
        this.init();
    }

    init() {
        // Create overlay container only if document.body exists
        if (document.body) {
            this.overlay = document.createElement('div');
            this.overlay.className = 'overlay';
            document.body.appendChild(this.overlay);

            // Click to dismiss
            this.overlay.addEventListener('click', () => {
                this.hide();
            });
        }
    }

    showSuccess(question, answer, points, callback) {
        this.overlay.className = 'overlay overlay-success show';
        this.overlay.innerHTML = `
            <div class="overlay-icon">✓</div>
            <div class="overlay-title">CORRECT!</div>
            <div class="overlay-question">${question}</div>
            <div class="overlay-answer-label">Answer:</div>
            <div class="overlay-message">${answer}</div>
            <div class="overlay-points">+${points} points</div>
            <div class="overlay-hint">Click anywhere to continue →</div>
        `;

        // Store callback to execute on click
        this.successCallback = callback;

        // Remove old click listener and add new one with callback
        const overlayElement = this.overlay;
        const newOverlay = overlayElement.cloneNode(true);
        overlayElement.parentNode.replaceChild(newOverlay, overlayElement);
        this.overlay = newOverlay;

        this.overlay.addEventListener('click', () => {
            this.hide();
            if (this.successCallback) {
                this.successCallback();
                this.successCallback = null;
            }
        });
    }

    showError(message) {
        this.overlay.className = 'overlay overlay-error show';
        this.overlay.innerHTML = `
            <div class="overlay-icon">✗</div>
            <div class="overlay-title">Not quite...</div>
            <div class="overlay-message">${message || 'Try again!'}</div>
            <div class="overlay-hint">Returning to question...</div>
        `;

        // Apply shake animation
        this.overlay.style.animation = 'shake 0.5s ease';

        // Auto-hide after 2 seconds
        setTimeout(() => {
            this.hide();
        }, 2000);
    }

    showCelebration(title, message, points) {
        this.overlay.className = 'overlay overlay-celebration show';
        this.overlay.innerHTML = `
            <div class="overlay-icon">🎉</div>
            <div class="overlay-title">${title}</div>
            <div class="overlay-message">${message}</div>
            ${points ? `<div class="overlay-points">+${points} points</div>` : ''}
            <div class="overlay-hint">Click anywhere to continue →</div>
        `;
    }

    hide() {
        this.overlay.classList.remove('show');
        this.overlay.style.animation = '';
    }
}

// Keyboard Manager for Shortcuts
class KeyboardManager {
    constructor() {
        this.enabled = true;
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            if (!this.enabled) return;

            const screen = document.querySelector('.screen.active');
            if (!screen) return;

            // Check if user is typing in an input field
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            // Check if screen has interactive content (quiz, graph builder, etc.)
            const hasQuiz = screen.querySelector('.quiz-option');
            const hasCanvas = screen.querySelector('canvas');
            const hasInput = screen.querySelector('input[type="text"]');

            // Escape key - close overlay
            if (e.key === 'Escape') {
                overlayManager.hide();
                return;
            }

            // Space or Enter - advance on click-anywhere screens
            if ((e.key === ' ' || e.key === 'Enter') && screen.dataset.clickAnywhere) {
                e.preventDefault();
                screenManager.nextScreen();
                return;
            }

            // Arrow keys - navigate (only on non-interactive screens)
            if (!hasQuiz && !hasCanvas && !hasInput) {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (screen.dataset.clickAnywhere) {
                        screenManager.nextScreen();
                    }
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    screenManager.prevScreen();
                }
            }

            // Number keys 1-5 for quiz options (accessibility feature)
            if (hasQuiz && !screen.querySelector('.quiz-option:disabled')) {
                const num = parseInt(e.key);
                if (num >= 1 && num <= 5) {
                    const options = screen.querySelectorAll('.quiz-option');
                    if (options[num - 1]) {
                        options[num - 1].click();
                    }
                }
            }
        });
    }

    disable() {
        this.enabled = false;
    }

    enable() {
        this.enabled = true;
    }
}

// Global instances
const screenManager = new ScreenManager();
let overlayManager = null;
const keyboardManager = new KeyboardManager();

// Initialize when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        screenManager.init();
        overlayManager = new OverlayManager();
    });
} else {
    screenManager.init();
    overlayManager = new OverlayManager();
}
