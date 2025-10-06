// Screen Management System for Full-Screen Immersive Experience

class ScreenManager {
    constructor() {
        this.currentScreen = 0;
        this.screens = [];
        this.progressDot = null;
        this.isNavigating = false;
    }

    init() {
        // Create progress dot
        this.createProgressDot();

        // Setup click-anywhere listeners
        this.setupClickAnywhere();

        // Setup keyboard navigation
        this.setupKeyboardNavigation();

        // Setup browser history navigation
        this.setupHistoryNavigation();

        // Initialize first screen in history
        this.updateHistory(this.currentScreen, true);
    }

    createProgressDot() {
        this.progressDot = document.createElement('div');
        this.progressDot.className = 'progress-dot';
        this.progressDot.textContent = '0/150 •';
        document.body.appendChild(this.progressDot);
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

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            const screen = document.querySelector('.screen.active');
            if (!screen) return;

            // Don't handle keyboard if on interactive elements
            const activeElement = document.activeElement;
            if (activeElement && (
                activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA' ||
                activeElement.tagName === 'SELECT' ||
                activeElement.closest('.quiz-option, .draggable-item, .drop-zone, canvas, button')
            )) {
                return;
            }

            // Check if screen allows click-anywhere advancement (keyboard follows same rule)
            const canAdvance = screen.dataset.clickAnywhere === 'true';

            // Handle different keys
            switch(e.key) {
                case ' ':          // Space
                case 'Enter':      // Enter
                case 'ArrowRight': // Right arrow
                    if (canAdvance) {
                        e.preventDefault();
                        this.nextScreen();
                    }
                    break;
                case 'ArrowLeft':  // Left arrow
                    e.preventDefault();
                    this.prevScreen();
                    break;
            }
        });
    }

    setupHistoryNavigation() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            if (e.state && typeof e.state.screenIndex === 'number') {
                this.isNavigating = true;
                this.showScreen(e.state.screenIndex, false);
                this.isNavigating = false;
            }
        });
    }

    updateHistory(index, replace = false) {
        // Update browser history
        const state = { screenIndex: index };
        const url = `${window.location.pathname}#screen-${index}`;
        
        if (replace) {
            window.history.replaceState(state, '', url);
        } else {
            window.history.pushState(state, '', url);
        }
    }

    showScreen(index, updateHistory = true) {
        // Hide all screens
        const allScreens = document.querySelectorAll('.screen, .module');
        allScreens.forEach(s => {
            s.classList.remove('active');
        });

        // Show target screen
        const targetScreen = document.querySelectorAll('.screen, .module')[index];
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = index;
            
            // Update browser history (unless we're navigating via popstate)
            if (updateHistory && !this.isNavigating) {
                this.updateHistory(index);
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
}

// Overlay Management for Success/Error Full-Screen Displays
class OverlayManager {
    constructor() {
        this.overlay = null;
        this.init();
    }

    init() {
        // Create overlay container
        this.overlay = document.createElement('div');
        this.overlay.className = 'overlay';
        document.body.appendChild(this.overlay);

        // Click to dismiss
        this.overlay.addEventListener('click', () => {
            this.hide();
        });
    }

    showSuccess(answer, points, callback) {
        this.overlay.className = 'overlay overlay-success show';
        this.overlay.innerHTML = `
            <div class="overlay-icon">✓</div>
            <div class="overlay-title">CORRECT!</div>
            <div class="overlay-message">${answer}</div>
            <div class="overlay-points">+${points} points</div>
            <div class="overlay-hint">Click anywhere to continue →</div>
        `;

        // Auto-advance after callback
        setTimeout(() => {
            if (callback) callback();
        }, 1000);
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

// Global instances
const screenManager = new ScreenManager();
const overlayManager = new OverlayManager();

// Initialize when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        screenManager.init();
    });
} else {
    screenManager.init();
}
