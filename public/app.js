// Global State
let currentModule = 0;
let studentName = '';
let points = 0;
let badges = [];
let moduleScores = {
    module1: 0,
    module2: 0,
    module3: 0,
    module4: 0,
    module4b: 0,
    module5: 0,
    module6: 0,
    module7: 0
};

// Retry tracking system (total retries per question)
let retries = {
    module1: 0,
    module2: 0,
    module3_q1: 0,
    module3_q2: 0,
    module3_q3: 0,
    module4: 0,
    module4b: 0,
    module5_1: 0,
    module5_2: 0,
    module5_3: 0,
    module6_1: 0,
    module6_2: 0,
    module6_3: 0,
    module6_4: 0,
    module6_5: 0,
    module6_6: 0,
    module6_7: 0,
    module6_8: 0
};

// First attempt tracking (true = correct on first try, false = incorrect on first try)
let firstAttempts = {
    module1: null,
    module2: null, // This tracks all city matches collectively
    module3_q1: null,
    module3_q2: null,
    module3_q3: null,
    module4: null,
    module4b: null,
    module5_1: null,
    module5_2: null,
    module5_3: null,
    module6_1: null,
    module6_2: null,
    module6_3: null,
    module6_4: null,
    module6_5: null,
    module6_6: null,
    module6_7: null,
    module6_8: null
};

// Question attempts counter (how many times user tried this question)
let questionAttempts = {};

// Chart instances
let exampleChart = null;
let buildChart = null;
let buildChart2 = null;
let mysteryChart1 = null;
let mysteryChart2 = null;
let mysteryChart3 = null;
let finalChart = null;

// Graph builder data
let userGraphData = [null, null, null, null, null, null, null, null, null, null, null, null];
let userRainfallData = [5, 4, 4, 1, 1, 0, 0, 0, 0, 1, 3, 5]; // Start with correct data
const correctGraphData = [14, 16, 19, 24, 28, 30, 31, 31, 28, 25, 20, 16];
const correctRainfallData = [5, 4, 4, 1, 1, 0, 0, 0, 0, 1, 3, 5];
let isDraggingRainfall = false;
let dragMonthIndex = -1;

// Graph builder 2 data (Singapore - tropical)
let userGraphData2 = [27, 27, 28, 28, 28, 28, 28, 28, 27, 27, 27, 27]; // Prefilled with correct Singapore temperature
let userRainfallData2 = [120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120]; // Start with midway values for dragging
const correctGraphData2 = [27, 27, 28, 28, 28, 28, 28, 28, 27, 27, 27, 27]; // Singapore temperature
const correctRainfallData2 = [243, 157, 193, 179, 171, 161, 158, 176, 169, 193, 256, 287]; // Singapore rainfall
const rainfallData2 = [243, 157, 193, 179, 171, 161, 158, 176, 169, 193, 256, 287]; // Display rainfall for Singapore

// Tooltip helper functions
function showGraphTooltip(x, y, content) {
    let tooltip = document.getElementById('graph-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'graph-tooltip';
        tooltip.style.cssText = `
            position: fixed;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            pointer-events: none;
            z-index: 10000;
            white-space: nowrap;
        `;
        document.body.appendChild(tooltip);
    }
    tooltip.innerHTML = content;
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
    tooltip.style.display = 'block';
}

function hideGraphTooltip() {
    const tooltip = document.getElementById('graph-tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Restore saved progress first
    restoreAppProgress();

    // Initialize screen manager for full-screen navigation
    if (typeof screenManager !== 'undefined') {
        screenManager.init();
    }

    initializeDragAndDrop();
    createExampleGraph();
    createLondonGraphForQuestions();
    createBuildGraph();
    createBuildGraph2();
    createMysteryGraphs();
    createFinalGraph();
});

// Save app progress to localStorage
function saveAppProgress() {
    try {
        const progressData = {
            currentModule,
            studentName,
            points,
            badges,
            moduleScores,
            retries,
            firstAttempts,
            questionAttempts,
            userGraphData,
            userRainfallData,
            userGraphData2,
            userRainfallData2
        };
        localStorage.setItem('climateHub_appProgress', JSON.stringify(progressData));
    } catch (e) {
        console.warn('Failed to save app progress:', e);
    }
}

// Restore app progress from localStorage
function restoreAppProgress() {
    try {
        const savedData = localStorage.getItem('climateHub_appProgress');
        if (savedData) {
            const progressData = JSON.parse(savedData);
            
            // Restore global state
            if (progressData.currentModule !== undefined) currentModule = progressData.currentModule;
            if (progressData.studentName) studentName = progressData.studentName;
            if (progressData.points !== undefined) points = progressData.points;
            if (progressData.badges) badges = progressData.badges;
            if (progressData.moduleScores) moduleScores = progressData.moduleScores;
            if (progressData.retries) retries = progressData.retries;
            if (progressData.firstAttempts) firstAttempts = progressData.firstAttempts;
            if (progressData.questionAttempts) questionAttempts = progressData.questionAttempts;
            if (progressData.userGraphData) userGraphData = progressData.userGraphData;
            if (progressData.userRainfallData) userRainfallData = progressData.userRainfallData;
            if (progressData.userGraphData2) userGraphData2 = progressData.userGraphData2;
            if (progressData.userRainfallData2) userRainfallData2 = progressData.userRainfallData2;

            // Update UI elements if they exist
            setTimeout(() => {
                updateProgress();
                const pointsDisplay = document.getElementById('pointsDisplay');
                if (pointsDisplay) {
                    pointsDisplay.textContent = `Points: ${points} 🏆`;
                }
            }, 100);
        }
    } catch (e) {
        console.warn('Failed to restore app progress:', e);
    }
}

// Helper function to safely use overlayManager
function safeShowSuccess(questionText, answerText, points, callback) {
    if (typeof overlayManager !== 'undefined' && overlayManager !== null) {
        overlayManager.showSuccess(questionText, answerText, points, callback);
    } else {
        // Fallback if overlayManager not ready
        if (callback) callback();
    }
}

function safeShowError(message) {
    if (typeof overlayManager !== 'undefined' && overlayManager !== null) {
        overlayManager.showError(message);
    }
}

// Start Course
function startCourse() {
    const nameInput = document.getElementById('studentName');
    studentName = nameInput.value.trim();

    if (!studentName) {
        alert('Please enter your name to begin!');
        return;
    }

    // Hide the button, show click-anywhere hint
    const welcomeCard = document.querySelector('#screen-welcome .welcome-card');
    const nameSection = document.querySelector('.name-input-section');
    const clickHint = document.getElementById('welcome-hint');

    nameSection.style.display = 'none';
    clickHint.style.display = 'block';

    // Enable click-anywhere on welcome screen
    const welcomeScreen = document.getElementById('screen-welcome');
    welcomeScreen.dataset.clickAnywhere = 'true';

    // Update welcome message
    welcomeCard.innerHTML = `
        <h2>Welcome,<br>${studentName}! 🌍</h2>
        <p style="font-size: 1.5rem; margin: 2rem 0;">Let's explore Earth's amazing climates!</p>
        <p class="click-hint">Click anywhere to begin your journey →</p>
    `;

    addPoints(10, 'Started the course!');

    // Update progress
    screenManager.updateProgress(1, 150);
    
    // Save progress
    saveAppProgress();
}

// Navigation
function nextModule() {
    // Handle Module 4 -> 4B -> 5 progression
    if (currentModule === 4) {
        currentModule = 4.5; // Go to Module 4B
    } else if (currentModule === 4.5) {
        currentModule = 5; // Go to Module 5 after 4B
    } else {
        currentModule++;
    }

    showModule(currentModule);
    updateProgress();

    // Award badges at certain milestones
    if (currentModule === 3) {
        awardBadge('Climate Novice 🌱');
    }
    if (currentModule === 5) {
        awardBadge('Graph Master 📊');
    }
    if (currentModule === 7) {
        awardBadge('Climate Explorer 🌍');
    }

    // Save progress
    saveAppProgress();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Auto-progress to next module after delay (only when task is completed correctly)
function autoProgressToNextModule() {
    setTimeout(() => {
        nextModule();
    }, 1000);
}

function showModule(moduleNum) {
    // Hide all modules
    const modules = document.querySelectorAll('.module');
    modules.forEach(m => m.classList.remove('active'));

    // Show current module
    let moduleId;
    if (moduleNum === 0) {
        moduleId = 'module-welcome';
    } else if (moduleNum === 8) {
        moduleId = 'module-complete';
    } else if (moduleNum === 4.5) {
        moduleId = 'module-4b';
    } else {
        moduleId = `module-${moduleNum}`;
    }

    const currentModuleElement = document.getElementById(moduleId);
    if (currentModuleElement) {
        currentModuleElement.classList.add('active');
    }

    // Initialize one-question-at-a-time modules
    if (moduleNum === 6) {
        setTimeout(() => initializeQuiz(), 100);
    } else if (moduleNum === 7) {
        setTimeout(() => initializeFinalAssessment(), 100);
    }
}

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    // Calculate progress (Module 4.5 counts as module 4-5, so total is 8 modules)
    let displayModule = currentModule;
    if (currentModule === 4.5) {
        displayModule = 4;
    }

    const progress = (currentModule / 7) * 100;

    progressFill.style.width = `${progress}%`;

    if (currentModule === 4.5) {
        progressText.textContent = `Module 4B of 7`;
    } else if (currentModule === 0) {
        progressText.textContent = `Module 0 of 7`;
    } else {
        progressText.textContent = `Module ${Math.floor(displayModule)} of 7`;
    }
}

// Points and Gamification
function addPoints(amount, reason) {
    points += amount;
    document.getElementById('pointsDisplay').textContent = `Points: ${points} 🏆`;

    // Show floating notification
    showNotification(`+${amount} points! ${reason}`);
    
    // Save progress
    saveAppProgress();
}

function showNotification(message) {
    // Create temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideInRight 0.5s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

function awardBadge(badgeName) {
    if (badges.includes(badgeName)) return;

    badges.push(badgeName);
    const badgesContainer = document.getElementById('achievementBadges');

    const badge = document.createElement('div');
    badge.className = 'badge';
    badge.textContent = badgeName;
    badgesContainer.appendChild(badge);

    addPoints(50, `Earned badge: ${badgeName}`);
}

// Hint Manager Class
class HintManager {
    constructor() {
        this.hints = {};
    }

    showHint(questionKey, attemptCount) {
        const screen = document.querySelector('.screen.active');
        if (!screen) return;

        let hintContainer = screen.querySelector('.hint-container');
        if (!hintContainer) {
            hintContainer = document.createElement('div');
            hintContainer.className = 'hint-container';
            const quizOptions = screen.querySelector('.quiz-options');
            if (quizOptions) {
                quizOptions.parentNode.insertBefore(hintContainer, quizOptions);
            }
        }

        let hintText = '';
        let hintIcon = '💡';

        // Get hints from screen data attributes or use defaults
        if (attemptCount === 3) {
            hintText = screen.dataset.hint1 || 'Think about the key characteristics of each climate type.';
            hintIcon = '💡';
        } else if (attemptCount === 5) {
            hintText = screen.dataset.hint2 || 'Look carefully at the temperature and rainfall patterns.';
            hintIcon = '🔍';
        }

        hintContainer.innerHTML = `
            <div class="hint-icon">${hintIcon}</div>
            <div class="hint-text">${hintText}</div>
        `;
        hintContainer.style.display = 'flex';
        hintContainer.classList.add('hint-fade-in');
    }

    showRevealButton(questionKey) {
        const screen = document.querySelector('.screen.active');
        if (!screen) return;

        let revealContainer = screen.querySelector('.reveal-answer-container');
        if (!revealContainer) {
            revealContainer = document.createElement('div');
            revealContainer.className = 'reveal-answer-container';
            const quizOptions = screen.querySelector('.quiz-options');
            if (quizOptions) {
                quizOptions.parentNode.insertBefore(revealContainer, quizOptions.nextSibling);
            }
        }

        revealContainer.innerHTML = `
            <button class="reveal-answer-btn" onclick="revealAnswer('${questionKey}')">
                ⚠️ Reveal Answer
            </button>
            <p style="font-size: 0.9rem; opacity: 0.7; margin-top: 0.5rem;">You've tried 6 times. Click to see the correct answer.</p>
        `;
        revealContainer.style.display = 'block';
    }

    clearHints() {
        const screen = document.querySelector('.screen.active');
        if (!screen) return;

        const hintContainer = screen.querySelector('.hint-container');
        if (hintContainer) hintContainer.style.display = 'none';

        const revealContainer = screen.querySelector('.reveal-answer-container');
        if (revealContainer) revealContainer.style.display = 'none';
    }
}

const hintManager = new HintManager();

// Reveal Answer Function
function revealAnswer(retryKey) {
    const screen = document.querySelector('.screen.active');
    if (!screen) return;

    // Find the correct answer button
    const options = screen.querySelectorAll('.quiz-option');
    let correctButton = null;

    options.forEach(opt => {
        const onclick = opt.getAttribute('onclick');
        if (onclick && onclick.includes('true')) {
            correctButton = opt;
        }
    });

    if (correctButton) {
        // Highlight the correct answer
        correctButton.classList.add('revealed-correct');

        // Disable all other options
        options.forEach(opt => {
            if (opt !== correctButton) {
                opt.disabled = true;
                opt.style.opacity = '0.4';
            }
        });

        // Auto-click the correct answer after 1 second
        setTimeout(() => {
            correctButton.click();
        }, 1500);
    }
}

// Full-Screen Quiz Functions (Enhanced System)
function checkAnswerFullScreen(button, isCorrect, answerText, retryKey = null) {
    const options = button.parentElement.querySelectorAll('.quiz-option');
    const screen = document.querySelector('.screen.active');
    const questionHeading = screen.querySelector('h2, h3, h4');
    const questionText = questionHeading ? questionHeading.textContent : 'Question';

    // Initialize question attempts if first time
    if (!questionAttempts[retryKey]) {
        questionAttempts[retryKey] = 0;
    }

    // Increment attempt count
    questionAttempts[retryKey]++;

    // Track first attempt
    if (questionAttempts[retryKey] === 1 && retryKey && firstAttempts.hasOwnProperty(retryKey)) {
        firstAttempts[retryKey] = isCorrect;
    }

    if (isCorrect) {
        // Disable all options
        options.forEach(opt => opt.disabled = true);

        // Clear any hints
        hintManager.clearHints();

        // Show full-screen success overlay with question AND answer
        safeShowSuccess(questionText, answerText, 20, () => {
            // After overlay is dismissed, advance to next screen
            screenManager.nextScreen();
        });

        addPoints(20, 'Correct answer!');
        screenManager.updateProgress(screenManager.currentScreen + 2, 87);
    } else {
        // Track retry
        if (retryKey && retries[retryKey] !== undefined) {
            retries[retryKey]++;
        }

        // Add attempting state (neutral)
        button.classList.add('attempting');
        setTimeout(() => {
            button.classList.remove('attempting');
        }, 500);

        // Show error overlay with custom message
        safeShowError("That's not correct. Try again!");

        // Show hints based on attempt count
        if (questionAttempts[retryKey] === 3) {
            setTimeout(() => hintManager.showHint(retryKey, 3), 2100);
        } else if (questionAttempts[retryKey] === 5) {
            setTimeout(() => hintManager.showHint(retryKey, 5), 2100);
        } else if (questionAttempts[retryKey] === 6) {
            setTimeout(() => hintManager.showRevealButton(retryKey), 2100);
        }
        
        // Save progress after wrong answer
        saveAppProgress();
    }
}

// City Matching Function for Module 2
function checkCityMatch(button, isCorrect, cityName, cityNumber) {
    const options = button.parentElement.querySelectorAll('.quiz-option');
    const screen = document.querySelector('.screen.active');
    const retryKey = `city_${cityNumber}`;

    // Initialize question attempts if first time
    if (!questionAttempts[retryKey]) {
        questionAttempts[retryKey] = 0;
    }

    // Increment attempt count
    questionAttempts[retryKey]++;

    // Track first attempt for overall Module 2 score
    if (questionAttempts[retryKey] === 1) {
        if (isCorrect) {
            // Don't penalize Module 2 if this is correct first try
        } else {
            retries.module2++; // Only count failures
        }
        // Track this city's first attempt
        if (firstAttempts.module2 === null) {
            firstAttempts.module2 = isCorrect;
        } else if (firstAttempts.module2 === true && !isCorrect) {
            firstAttempts.module2 = false; // Any city wrong on first try = false
        }
    }

    if (isCorrect) {
        // Disable all options
        options.forEach(opt => opt.disabled = true);

        // Extract climate type emoji and name from button text
        const climateType = button.textContent.trim();

        // Show full-screen success overlay with question AND answer
        safeShowSuccess(
            `${cityName}`,
            `Climate: ${climateType}`,
            5,
            () => {
                // After overlay is dismissed, advance to next screen
                screenManager.nextScreen();
            }
        );

        addPoints(5, 'City matched!');

        // Update progress
        const currentScreenIndex = screenManager.currentScreen + 1;
        screenManager.updateProgress(currentScreenIndex, 87);
    } else {
        // Add attempting state (neutral)
        button.classList.add('attempting');
        setTimeout(() => {
            button.classList.remove('attempting');
        }, 500);

        // Show error overlay
        safeShowError("That's not correct. Think about the temperature and rainfall patterns.");

        // Show hints based on attempt count
        if (questionAttempts[retryKey] === 3) {
            setTimeout(() => hintManager.showHint(retryKey, 3), 2100);
        } else if (questionAttempts[retryKey] === 5) {
            setTimeout(() => hintManager.showHint(retryKey, 5), 2100);
        } else if (questionAttempts[retryKey] === 6) {
            setTimeout(() => hintManager.showRevealButton(retryKey), 2100);
        }
    }
}

// Old Quiz Functions (Compatibility for non-fullscreen modules)
function checkAnswer(button, isCorrect, retryKey = null) {
    // Get feedback element
    const quizSection = button.closest('.interactive-question') || button.closest('.quiz-item');
    const feedbackId = quizSection.querySelector('.feedback').id;
    const feedback = document.getElementById(feedbackId);
    const options = button.parentElement.querySelectorAll('.quiz-option');

    if (isCorrect) {
        // Disable all options permanently on correct answer
        options.forEach(opt => opt.disabled = true);
        button.classList.add('correct');
        feedback.className = 'feedback correct show';
        feedback.textContent = '✓ Correct! Well done! Moving to next module...';
        addPoints(20, 'Correct answer!');

        // Auto-progress after correct answer
        if (retryKey && (retryKey === 'module1' || retryKey === 'module4')) {
            autoProgressToNextModule();
        }
    } else {
        button.classList.add('incorrect');
        feedback.className = 'feedback incorrect show';
        feedback.textContent = '✗ Incorrect. You must get this right to continue. Try again!';

        // Track retry
        if (retryKey && retries[retryKey] !== undefined) {
            retries[retryKey]++;
        }

        // Re-enable options for retry but keep incorrect marked temporarily
        setTimeout(() => {
            button.classList.remove('incorrect');
            feedback.classList.remove('show');
        }, 1500);
    }
}

function checkCheckboxes() {
    const checkboxes = document.querySelectorAll('.checkbox-option input[type="checkbox"]');
    const feedback = document.getElementById('feedback-3');
    let allCorrect = true;

    checkboxes.forEach(checkbox => {
        const shouldBeChecked = checkbox.dataset.correct === 'true';
        const isChecked = checkbox.checked;

        if (shouldBeChecked !== isChecked) {
            allCorrect = false;
        }

        // Visual feedback
        const label = checkbox.parentElement;
        const isAnswerCorrect = (shouldBeChecked && isChecked) || (!shouldBeChecked && !isChecked);
        
        if (isAnswerCorrect) {
            label.style.background = '#d4edda';
            label.style.borderColor = '#28a745';
            // Disable correct answers so they can't be changed
            checkbox.disabled = true;
        } else {
            label.style.background = '#f8d7da';
            label.style.borderColor = '#dc3545';
            // Keep incorrect answers enabled so they can be edited
        }
    });

    if (allCorrect) {
        feedback.className = 'feedback correct show';
        feedback.textContent = '✓ Perfect! You understand how to read climate graphs!';
        addPoints(30, 'All correct!');
        
        // Disable all checkboxes after correct answer
        checkboxes.forEach(checkbox => checkbox.disabled = true);
        
        // Show success overlay with question and answer
        safeShowSuccess(
            'Graph Reading Quiz! Which statements are true?',
            'All statements correctly identified!',
            30,
            () => {
                // After overlay is dismissed, advance to next screen
                screenManager.nextScreen();
            }
        );
    } else {
        feedback.className = 'feedback incorrect show';
        feedback.textContent = '✗ Some answers are incorrect. Correct ones are now locked in green. Fix the red ones and try again!';
        retries.module3++;
    }
}

// Drag and Drop Matching Game
function initializeDragAndDrop() {
    const draggables = document.querySelectorAll('.draggable-item');
    const dropZones = document.querySelectorAll('.drop-zone');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging');
        });

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
        });
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', e => {
            e.preventDefault();
            zone.classList.add('drag-over');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });

        zone.addEventListener('drop', e => {
            e.preventDefault();
            zone.classList.remove('drag-over');

            const dragging = document.querySelector('.dragging');
            if (dragging) {
                // Remove any existing item in zone
                const existing = zone.querySelector('.draggable-item');
                if (existing) {
                    existing.remove();
                }

                // Clone and add to zone
                const clone = dragging.cloneNode(true);
                clone.draggable = false;
                zone.appendChild(clone);
            }
        });
    });
}

function checkMatching() {
    const dropZones = document.querySelectorAll('.drop-zone');
    const feedback = document.getElementById('feedback-2');
    let correct = 0;
    let total = 0;

    dropZones.forEach(zone => {
        const item = zone.querySelector('.draggable-item');
        if (item) {
            total++;
            const climate = zone.dataset.climate;
            const answer = item.dataset.answer;

            if (climate === answer) {
                zone.classList.add('correct');
                zone.classList.remove('incorrect');
                correct++;
            } else {
                zone.classList.add('incorrect');
                zone.classList.remove('correct');
            }
        }
    });

    const expectedTotal = 16; // Now we have 16 cities
    if (correct === expectedTotal && total === expectedTotal) {
        feedback.className = 'feedback correct show';
        feedback.textContent = `✓ Perfect match! You've correctly identified all ${correct} climates! Moving to next module...`;
        addPoints(40, 'Perfect matching!');
        autoProgressToNextModule();
    } else if (total === 0) {
        feedback.className = 'feedback incorrect show';
        feedback.textContent = '✗ Please drag all cities to their matching climate types before checking!';
    } else if (total < expectedTotal) {
        feedback.className = 'feedback incorrect show';
        feedback.textContent = `✗ You've only matched ${total} out of ${expectedTotal} cities. Please match all cities!`;
    } else {
        feedback.className = 'feedback incorrect show';
        feedback.textContent = `✗ You got ${correct} out of ${expectedTotal} correct. You must match all correctly to continue. Try again!`;
        retries.module2++;

        // Reset for retry
        setTimeout(() => {
            dropZones.forEach(zone => {
                zone.classList.remove('correct', 'incorrect');
            });
            feedback.classList.remove('show');
        }, 2500);
    }
}

// Climate Graphs
function createExampleGraph() {
    const ctx = document.getElementById('exampleGraph');
    if (!ctx) return;

    exampleChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                type: 'line',
                label: 'Temperature (°C)',
                data: [5, 5, 7, 9, 13, 16, 18, 18, 15, 11, 8, 6],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                yAxisID: 'y',
                tension: 0.4,
                borderWidth: 3
            }, {
                type: 'bar',
                label: 'Rainfall (mm)',
                data: [55, 40, 42, 44, 49, 45, 44, 50, 49, 62, 59, 55],
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'London Climate Graph',
                    font: { size: 16, weight: 'bold' }
                },
                legend: {
                    display: true,
                    position: 'bottom'
                }
            },
            scales: {
                x: {
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            size: 11,
                            weight: 'bold'
                        }
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Temperature (°C)',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    min: 0,
                    max: 35,
                    ticks: {
                        stepSize: 5,
                        font: {
                            size: 10
                        }
                    },
                    grid: {
                        color: 'rgba(255, 99, 132, 0.1)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Rainfall (mm)',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        drawOnChartArea: false
                    },
                    min: 0,
                    max: 120,
                    ticks: {
                        stepSize: 20,
                        font: {
                            size: 10
                        }
                    }
                }
            }
        }
    });
}

// Create London graph copies for question screens
function createLondonGraphForQuestions() {
    const graphConfig = {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                type: 'line',
                label: 'Temperature (°C)',
                data: [5, 5, 7, 9, 13, 16, 18, 18, 15, 11, 8, 6],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                yAxisID: 'y',
                tension: 0.4,
                borderWidth: 3
            }, {
                type: 'bar',
                label: 'Rainfall (mm)',
                data: [55, 40, 42, 44, 49, 45, 44, 50, 49, 62, 59, 55],
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'London Climate Graph',
                    font: { size: 14, weight: 'bold' }
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        font: { size: 10 }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            size: 10,
                            weight: 'bold'
                        }
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Temperature (°C)',
                        font: {
                            size: 11,
                            weight: 'bold'
                        }
                    },
                    min: 0,
                    max: 35,
                    ticks: {
                        stepSize: 5,
                        font: {
                            size: 9
                        }
                    },
                    grid: {
                        color: 'rgba(255, 99, 132, 0.1)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Rainfall (mm)',
                        font: {
                            size: 11,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        drawOnChartArea: false
                    },
                    min: 0,
                    max: 120,
                    ticks: {
                        stepSize: 20,
                        font: {
                            size: 9
                        }
                    }
                }
            }
        }
    };

    // Create graph for Q1
    const ctxQ1 = document.getElementById('exampleGraphQ1');
    if (ctxQ1) {
        new Chart(ctxQ1, graphConfig);
    }

    // Create graph for Q2
    const ctxQ2 = document.getElementById('exampleGraphQ2');
    if (ctxQ2) {
        new Chart(ctxQ2, graphConfig);
    }

    // Create graph for Q3
    const ctxQ3 = document.getElementById('exampleGraphQ3');
    if (ctxQ3) {
        new Chart(ctxQ3, graphConfig);
    }
}

function createBuildGraph() {
    const ctx = document.getElementById('buildGraph');
    if (!ctx) return;

    buildChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                type: 'line',
                label: 'Temperature (°C) - Click to add',
                data: userGraphData,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                yAxisID: 'y',
                tension: 0.4,
                borderWidth: 3,
                spanGaps: true
            }, {
                type: 'bar',
                label: 'Rainfall (mm) - Prefilled',
                data: userRainfallData,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Build Cairo Climate Graph - Click to plot temperature!',
                    font: { size: 13, weight: 'bold' }
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: { font: { size: 10 } }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)',
                        lineWidth: 1
                    },
                    ticks: {
                        font: {
                            size: 11,
                            weight: 'bold'
                        }
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Temperature (°C)',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    min: 0,
                    max: 35,
                    ticks: {
                        stepSize: 5,
                        font: {
                            size: 10
                        }
                    },
                    grid: {
                        display: true,
                        color: 'rgba(255, 99, 132, 0.2)',
                        lineWidth: 1
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Rainfall (mm)',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        drawOnChartArea: false
                    },
                    min: 0,
                    max: 120,
                    ticks: {
                        stepSize: 20,
                        font: {
                            size: 10
                        }
                    }
                }
            },
            onClick: (event, activeElements, chart) => {
                const canvasPosition = Chart.helpers.getRelativePosition(event, chart);
                const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
                const dataY = chart.scales.y.getValueForPixel(canvasPosition.y);

                if (dataX >= 0 && dataX < 12 && dataY >= 0 && dataY <= 35) {
                    const monthIndex = Math.round(dataX);
                    userGraphData[monthIndex] = Math.round(dataY);
                    buildChart.update();
                }
            },
            onHover: (event, activeElements, chart) => {
                const canvas = chart.canvas;
                const nativeEvent = event.native || event;
                const pageX = nativeEvent.pageX || (nativeEvent.clientX + window.pageXOffset);
                const pageY = nativeEvent.pageY || (nativeEvent.clientY + window.pageYOffset);

                // Show temperature tooltip based on y-axis position
                const canvasPosition = Chart.helpers.getRelativePosition(event, chart);
                const dataY = chart.scales.y.getValueForPixel(canvasPosition.y);

                if (dataY >= 0 && dataY <= 35) {
                    const tempValue = Math.round(dataY);
                    // Always use crosshair cursor since rainfall is not draggable
                    canvas.style.cursor = 'crosshair';
                    showGraphTooltip(pageX + 15, pageY - 10, `Temperature: ${tempValue}°C`);
                } else {
                    canvas.style.cursor = 'default';
                    hideGraphTooltip();
                }
            }
        }
    });

    // Cairo graph - rainfall is prefilled, no dragging needed
    const canvas = ctx;

    canvas.addEventListener('mousemove', (e) => {
        // Show temperature tooltip
        const canvasPosition = Chart.helpers.getRelativePosition(e, buildChart);
        const dataY = buildChart.scales.y.getValueForPixel(canvasPosition.y);

        if (dataY >= 0 && dataY <= 35) {
            const tempValue = Math.round(dataY);
            showGraphTooltip(e.pageX + 15, e.pageY - 10, `Temperature: ${tempValue}°C`);
        } else {
            hideGraphTooltip();
        }
    });

    canvas.addEventListener('mouseleave', () => {
        hideGraphTooltip();
    });
}

function resetGraph() {
    userGraphData = [null, null, null, null, null, null, null, null, null, null, null, null];
    userRainfallData = [5, 4, 4, 1, 1, 0, 0, 0, 0, 1, 3, 5]; // Reset to correct data, not zeros
    buildChart.data.datasets[0].data = userGraphData;
    buildChart.data.datasets[1].data = userRainfallData;
    buildChart.update();

    const feedback = document.getElementById('feedback-4');
    feedback.className = 'feedback';
    feedback.textContent = '';
    
    // Save the reset state
    saveAppProgress();
}

function checkGraphAccuracy() {
    const feedback = document.getElementById('feedback-4');
    let tempErrors = 0;
    let rainfallErrors = 0;
    let completed = 0;
    let tempErrorMonths = [];
    let rainfallErrorMonths = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Check temperature
    userGraphData.forEach((value, index) => {
        if (value !== null) {
            completed++;
            const difference = Math.abs(value - correctGraphData[index]);
            if (difference > 2) {
                tempErrors++;
                tempErrorMonths.push(months[index]);
            }
        }
    });

    // Check rainfall
    userRainfallData.forEach((value, index) => {
        const difference = Math.abs(value - correctRainfallData[index]);
        if (difference > 1) {
            rainfallErrors++;
            rainfallErrorMonths.push(months[index]);
        }
    });

    if (completed < 12) {
        feedback.className = 'feedback incorrect show';
        feedback.textContent = `✗ Please plot all 12 temperature points! You've plotted ${completed} so far.`;
        retries.module4++;
    } else if (tempErrors === 0 && rainfallErrors === 0) {
        feedback.className = 'feedback correct show';
        feedback.textContent = '✓ Excellent! Your climate graph is perfect!';
        addPoints(50, 'Perfect graph!');

        // Show Continue button
        showGraphContinueButton('feedback-4');
    } else if (tempErrors <= 3 && rainfallErrors <= 3) {
        let errorDetails = [];
        if (tempErrors > 0) errorDetails.push(`${tempErrors} temp months: ${tempErrorMonths.join(', ')}`);
        if (rainfallErrors > 0) errorDetails.push(`${rainfallErrors} rainfall months: ${rainfallErrorMonths.join(', ')}`);

        feedback.className = 'feedback correct show';
        feedback.textContent = `✓ Good job! Your graph is mostly accurate (${errorDetails.join('; ')} slightly off).`;
        addPoints(30, 'Good graph!');

        // Show Continue button
        showGraphContinueButton('feedback-4');
    } else {
        let errorDetails = [];
        if (tempErrors > 0) errorDetails.push(`Temperature errors in: ${tempErrorMonths.join(', ')}`);
        if (rainfallErrors > 0) errorDetails.push(`Rainfall errors in: ${rainfallErrorMonths.join(', ')}`);

        feedback.className = 'feedback incorrect show';
        feedback.textContent = `✗ Keep trying! ${errorDetails.join('. ')}. Check the data table and try again.`;
        retries.module4++;
    }
}

// Second graph builder for Module 4B (Singapore - tropical)
function createBuildGraph2() {
    const ctx = document.getElementById('buildGraph2');
    if (!ctx) return;

    buildChart2 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                type: 'line',
                label: 'Temperature (°C) - Prefilled',
                data: userGraphData2,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                yAxisID: 'y',
                tension: 0.4,
                borderWidth: 3,
                spanGaps: true
            }, {
                type: 'bar',
                label: 'Rainfall (mm) - Drag to adjust',
                data: userRainfallData2,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Build Singapore Climate Graph - Drag rainfall to match!',
                    font: { size: 14, weight: 'bold' }
                },
                legend: {
                    display: true,
                    position: 'bottom'
                },
                tooltip: {
                    enabled: false  // Disable default Chart.js tooltip
                }
            },
            scales: {
                x: {
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)',
                        lineWidth: 1
                    },
                    ticks: {
                        font: {
                            size: 11,
                            weight: 'bold'
                        }
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Temperature (°C)',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    min: 0,
                    max: 40,
                    ticks: {
                        stepSize: 5,
                        font: {
                            size: 10
                        }
                    },
                    grid: {
                        display: true,
                        color: 'rgba(255, 99, 132, 0.2)',
                        lineWidth: 1
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Rainfall (mm)',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        drawOnChartArea: false
                    },
                    min: 0,
                    max: 300,
                    ticks: {
                        stepSize: 50,
                        font: {
                            size: 10
                        }
                    }
                }
            },
            onHover: (event, activeElements, chart) => {
                const canvas = chart.canvas;
                const nativeEvent = event.native || event;
                const pageX = nativeEvent.pageX || (nativeEvent.clientX + window.pageXOffset);
                const pageY = nativeEvent.pageY || (nativeEvent.clientY + window.pageYOffset);

                // Show rainfall tooltip based on y1-axis position
                const canvasPosition = Chart.helpers.getRelativePosition(event, chart);
                const dataY = chart.scales.y1.getValueForPixel(canvasPosition.y);

                if (dataY >= 0 && dataY <= 300) {
                    const rainfallValue = Math.round(dataY);

                    // Change cursor if hovering over rainfall bar
                    if (activeElements.length > 0 && activeElements[0].datasetIndex === 1) {
                        canvas.style.cursor = 'ns-resize';
                    } else {
                        canvas.style.cursor = 'default';
                    }

                    showGraphTooltip(pageX + 15, pageY - 10, `Rainfall: ${rainfallValue}mm`);
                } else {
                    canvas.style.cursor = 'default';
                    hideGraphTooltip();
                }
            }
        }
    });

    // Add drag functionality for rainfall bars
    const canvas = ctx;
    let isDragging2 = false;
    let dragMonthIndex2 = -1;

    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const elements = buildChart2.getElementsAtEventForMode(e, 'nearest', { intersect: true }, false);

        if (elements.length > 0 && elements[0].datasetIndex === 1) {
            isDragging2 = true;
            dragMonthIndex2 = elements[0].index;
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isDragging2 && dragMonthIndex2 >= 0) {
            const canvasPosition = Chart.helpers.getRelativePosition(e, buildChart2);
            const dataY = buildChart2.scales.y1.getValueForPixel(canvasPosition.y);

            if (dataY >= 0 && dataY <= 300) {
                userRainfallData2[dragMonthIndex2] = Math.max(0, Math.round(dataY));
                buildChart2.data.datasets[1].data = userRainfallData2;
                buildChart2.update('none'); // Update without animation for smooth dragging

                // Show tooltip while dragging - rainfall only
                const rainfallValue = Math.round(userRainfallData2[dragMonthIndex2]);
                showGraphTooltip(e.pageX + 15, e.pageY - 10, `Rainfall: ${rainfallValue}mm`);
            }
        } else {
            // Show rainfall tooltip when not dragging
            const canvasPosition = Chart.helpers.getRelativePosition(e, buildChart2);
            const dataY = buildChart2.scales.y1.getValueForPixel(canvasPosition.y);

            if (dataY >= 0 && dataY <= 300) {
                const rainfallValue = Math.round(dataY);
                showGraphTooltip(e.pageX + 15, e.pageY - 10, `Rainfall: ${rainfallValue}mm`);
            } else {
                hideGraphTooltip();
            }
        }
    });

    canvas.addEventListener('mouseup', () => {
        if (isDragging2) {
            isDragging2 = false;
            dragMonthIndex2 = -1;
            buildChart2.update(); // Final update with animation
            saveAppProgress(); // Save after dragging
        }
        // Don't hide tooltip - let it continue showing via mousemove
    });

    canvas.addEventListener('mouseleave', () => {
        if (isDragging2) {
            isDragging2 = false;
            dragMonthIndex2 = -1;
            buildChart2.update();
            saveAppProgress(); // Save after dragging
        }
        hideGraphTooltip();
    });

    // Touch support for mobile
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });

    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup');
        canvas.dispatchEvent(mouseEvent);
    });
}

function resetGraph2() {
    userGraphData2 = [27, 27, 28, 28, 28, 28, 28, 28, 27, 27, 27, 27]; // Reset to prefilled Singapore temperature
    userRainfallData2 = [120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120]; // Reset to midway values for dragging
    buildChart2.data.datasets[0].data = userGraphData2;
    buildChart2.data.datasets[1].data = userRainfallData2;
    buildChart2.update();

    const feedback = document.getElementById('feedback-4b-graph');
    feedback.className = 'feedback';
    feedback.textContent = '';
    
    // Save the reset state
    saveAppProgress();
}

function checkGraphAccuracy2() {
    const feedback = document.getElementById('feedback-4b-graph');
    let rainfallErrors = 0;
    let rainfallErrorMonths = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Only check rainfall (temperature is prefilled)
    userRainfallData2.forEach((value, index) => {
        const difference = Math.abs(value - correctRainfallData2[index]);
        // Allow larger margin of error (±15mm) since rainfall values are much higher
        if (difference > 15) {
            rainfallErrors++;
            rainfallErrorMonths.push(months[index]);
        }
    });

    if (rainfallErrors === 0) {
        feedback.className = 'feedback correct show';
        feedback.textContent = '✓ Excellent! Your Singapore climate graph is perfect!';
        addPoints(50, 'Perfect graph!');

        // Show Continue button
        showGraphContinueButton('feedback-4b-graph');
    } else if (rainfallErrors <= 3) {
        feedback.className = 'feedback correct show';
        feedback.textContent = `✓ Good job! Your graph is mostly accurate (${rainfallErrors} rainfall months slightly off: ${rainfallErrorMonths.join(', ')}).`;
        addPoints(30, 'Good graph!');

        // Show Continue button
        showGraphContinueButton('feedback-4b-graph');
    } else {
        feedback.className = 'feedback incorrect show';
        feedback.textContent = `✗ Keep trying! Rainfall errors in: ${rainfallErrorMonths.join(', ')}. Check the data table and try again.`;
        retries.module4b++;
    }
}

// Helper function to show Continue button for graph builders
function showGraphContinueButton(feedbackId) {
    const feedback = document.getElementById(feedbackId);
    if (!feedback) return;

    // Check if button already exists
    let continueBtn = feedback.parentElement.querySelector('.graph-continue-btn');
    if (continueBtn) {
        continueBtn.style.display = 'inline-block';
        return;
    }

    // Create Continue button
    continueBtn = document.createElement('button');
    continueBtn.className = 'quiz-option graph-continue-btn';
    continueBtn.textContent = 'Continue →';
    continueBtn.style.cssText = `
        margin-top: 1rem;
        display: inline-block;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-weight: 600;
    `;

    continueBtn.onclick = () => {
        // Disable button to prevent double-clicks
        continueBtn.disabled = true;

        // Call screenManager which will properly hide current screen and show next
        screenManager.nextScreen();
    };

    feedback.parentElement.appendChild(continueBtn);
}

// Mystery Graphs for Explorer Module
function createMysteryGraphs() {
    // Mumbai (Tropical) - High rainfall with monsoon spike
    const ctx1 = document.getElementById('mysteryChart1');
    if (ctx1) {
        mysteryChart1 = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    type: 'line',
                    label: 'Temperature (°C)',
                    data: [24, 24, 26, 28, 30, 29, 27, 27, 27, 28, 27, 25],
                    borderColor: 'rgb(255, 99, 132)',
                    yAxisID: 'y',
                    tension: 0.4,
                    borderWidth: 2
                }, {
                    type: 'bar',
                    label: 'Rainfall (mm)',
                    data: [3, 3, 2, 1, 18, 485, 617, 340, 264, 64, 13, 3],
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    yAxisID: 'y1'
                }]
            },
            options: getMysteryGraphOptions('Mystery Graph A', 35, 650, 100)
        });
    }

    // Athens (Mediterranean) - Low rainfall, dry summer, wet winter
    const ctx2 = document.getElementById('mysteryChart2');
    if (ctx2) {
        mysteryChart2 = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    type: 'line',
                    label: 'Temperature (°C)',
                    data: [10, 10, 12, 16, 21, 26, 29, 29, 24, 19, 15, 11],
                    borderColor: 'rgb(255, 99, 132)',
                    yAxisID: 'y',
                    tension: 0.4,
                    borderWidth: 2
                }, {
                    type: 'bar',
                    label: 'Rainfall (mm)',
                    data: [62, 37, 37, 23, 14, 6, 6, 7, 10, 48, 56, 71],
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    yAxisID: 'y1'
                }]
            },
            options: getMysteryGraphOptions('Mystery Graph B', 35, 100, 20)
        });
    }

    // Reykjavik (Polar/Cold) - Moderate rainfall, cold temperatures
    const ctx3 = document.getElementById('mysteryChart3');
    if (ctx3) {
        mysteryChart3 = new Chart(ctx3, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    type: 'line',
                    label: 'Temperature (°C)',
                    data: [0, 1, 1, 4, 7, 10, 12, 11, 9, 5, 2, 1],
                    borderColor: 'rgb(255, 99, 132)',
                    yAxisID: 'y',
                    tension: 0.4,
                    borderWidth: 2
                }, {
                    type: 'bar',
                    label: 'Rainfall (mm)',
                    data: [76, 72, 82, 58, 44, 50, 52, 62, 67, 86, 73, 79],
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    yAxisID: 'y1'
                }]
            },
            options: getMysteryGraphOptions('Mystery Graph C', 20, 120, 20)
        });
    }
}

function createFinalGraph() {
    const ctx = document.getElementById('finalGraph');
    if (!ctx) return;

    // UK temperate climate
    finalChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                type: 'line',
                label: 'Temperature (°C)',
                data: [5, 5, 7, 9, 13, 16, 18, 18, 15, 11, 8, 6],
                borderColor: 'rgb(255, 99, 132)',
                yAxisID: 'y',
                tension: 0.4,
                borderWidth: 2
            }, {
                type: 'bar',
                label: 'Rainfall (mm)',
                data: [55, 40, 42, 44, 49, 45, 44, 50, 49, 62, 59, 55],
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                yAxisID: 'y1'
            }]
        },
        options: getGraphOptions('Final Assessment Climate Graph')
    });
}

function getGraphOptions(title) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: title,
                font: { size: 14, weight: 'bold' }
            },
            legend: {
                display: true,
                position: 'bottom',
                labels: { font: { size: 10 } }
            }
        },
        scales: {
            x: {
                grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.08)',
                    lineWidth: 1
                },
                ticks: {
                    font: {
                        size: 11,
                        weight: 'bold'
                    }
                }
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'Temperature (°C)',
                    font: { size: 12, weight: 'bold' }
                },
                min: 0,
                max: 35,
                ticks: {
                    stepSize: 5,
                    font: { size: 10 }
                },
                grid: {
                    color: 'rgba(255, 99, 132, 0.15)',
                    lineWidth: 1
                }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                    display: true,
                    text: 'Rainfall (mm)',
                    font: { size: 12, weight: 'bold' }
                },
                grid: { drawOnChartArea: false },
                min: 0,
                max: 650,
                ticks: {
                    stepSize: 100,
                    font: { size: 10 }
                }
            }
        }
    };
}

// Custom graph options for mystery graphs with individual scales
function getMysteryGraphOptions(title, tempMax, rainfallMax, rainfallStep) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: title,
                font: { size: 14, weight: 'bold' }
            },
            legend: {
                display: true,
                position: 'bottom',
                labels: { font: { size: 10 } }
            }
        },
        scales: {
            x: {
                grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.08)',
                    lineWidth: 1
                },
                ticks: {
                    font: {
                        size: 11,
                        weight: 'bold'
                    }
                }
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'Temperature (°C)',
                    font: { size: 12, weight: 'bold' }
                },
                min: 0,
                max: tempMax,
                ticks: {
                    stepSize: 5,
                    font: { size: 10 }
                },
                grid: {
                    color: 'rgba(255, 99, 132, 0.15)',
                    lineWidth: 1
                }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                    display: true,
                    text: 'Rainfall (mm)',
                    font: { size: 12, weight: 'bold' }
                },
                grid: { drawOnChartArea: false },
                min: 0,
                max: rainfallMax,
                ticks: {
                    stepSize: rainfallStep,
                    font: { size: 10 }
                }
            }
        }
    };
}

// Explorer Questions
let explorerAnswered = {1: false, 2: false, 3: false};

function checkExplorerAnswer(questionNum, button, isCorrect) {
    const options = button.parentElement.querySelectorAll('.quiz-option');
    const feedback = document.getElementById(`explorer-feedback-${questionNum}`);
    const retryKey = `module5_${questionNum}`;

    // Get the question text from the page
    const questionElement = button.closest('.explorer-question');
    const questionText = questionElement ?
        `Graph ${questionNum}: Which city does this represent?` :
        'Climate Explorer Question';
    const answerText = button.textContent.trim();

    // Initialize question attempts if first time
    if (!questionAttempts[retryKey]) {
        questionAttempts[retryKey] = 0;
    }

    // Increment attempt count
    questionAttempts[retryKey]++;

    // Track first attempt
    if (questionAttempts[retryKey] === 1 && firstAttempts.hasOwnProperty(retryKey)) {
        firstAttempts[retryKey] = isCorrect;
    }

    if (isCorrect) {
        options.forEach(opt => opt.disabled = true);
        button.classList.add('correct');
        addPoints(25, 'Correct identification!');
        explorerAnswered[questionNum] = true;

        // Show success overlay with question and answer
        safeShowSuccess(
            questionText,
            answerText,
            25,
            () => {
                // Check if all explorer questions answered correctly
                if (explorerAnswered[1] && explorerAnswered[2] && explorerAnswered[3]) {
                    autoProgressToNextModule();
                }
            }
        );
    } else {
        button.classList.add('incorrect');
        feedback.className = 'feedback incorrect show';
        feedback.textContent = '✗ Incorrect. You must get this right to continue. Try again!';
        retries[retryKey]++;

        // Show error overlay
        safeShowError('✗ Incorrect. You must get this right to continue. Try again!');

        // Re-enable for retry
        setTimeout(() => {
            button.classList.remove('incorrect');
            feedback.classList.remove('show');
        }, 2000);

        // Save progress after wrong answer
        saveAppProgress();
    }
}

// Quiz Module - One Question at a Time
let currentQuizQuestion = 0;
let quizAnswered = {};

const quizQuestions = [
    {
        num: 1,
        question: "What is the main difference between weather and climate?",
        options: [
            { text: "Weather is hot, climate is cold", correct: false },
            { text: "Weather is short-term, climate is long-term average", correct: true },
            { text: "They are the same thing", correct: false }
        ]
    },
    {
        num: 2,
        question: "Which climate zone is the UK in?",
        options: [
            { text: "Tropical", correct: false },
            { text: "Temperate", correct: true },
            { text: "Arid", correct: false },
            { text: "Mediterranean", correct: false }
        ]
    },
    {
        num: 3,
        question: "On a climate graph, what does the red line usually represent?",
        options: [
            { text: "Rainfall", correct: false },
            { text: "Temperature", correct: true },
            { text: "Wind speed", correct: false },
            { text: "Humidity", correct: false }
        ]
    },
    {
        num: 4,
        question: "Which climate is characterized by hot, dry summers and mild, wet winters?",
        options: [
            { text: "Tropical", correct: false },
            { text: "Mediterranean", correct: true },
            { text: "Temperate", correct: false },
            { text: "Polar", correct: false }
        ]
    },
    {
        num: 5,
        question: "True or False: The Sahara Desert has very high rainfall throughout the year.",
        options: [
            { text: "True", correct: false },
            { text: "False", correct: true }
        ]
    },
    {
        num: 6,
        question: "What information do you need to create a climate graph?",
        options: [
            { text: "Only temperature data", correct: false },
            { text: "Monthly temperature and rainfall data", correct: true },
            { text: "Only rainfall data", correct: false },
            { text: "Wind direction and speed", correct: false }
        ]
    },
    {
        num: 7,
        question: "Which climate zone would have temperatures below 10°C all year round?",
        options: [
            { text: "Tropical", correct: false },
            { text: "Arid", correct: false },
            { text: "Mediterranean", correct: false },
            { text: "Polar", correct: true }
        ]
    },
    {
        num: 8,
        question: "Why is understanding climate important?",
        options: [
            { text: "It helps predict tomorrow's weather", correct: false },
            { text: "It helps us understand what crops grow, how to build homes, and plan for the future", correct: true },
            { text: "It only matters for scientists", correct: false }
        ]
    }
];

function initializeQuiz() {
    currentQuizQuestion = 0;
    quizAnswered = {};
    showQuizQuestion(currentQuizQuestion);
}

function showQuizQuestion(index) {
    const container = document.getElementById('mainQuiz');
    const question = quizQuestions[index];

    // Update progress
    document.getElementById('current-quiz-q').textContent = index + 1;

    const optionsHtml = question.options.map((opt, i) =>
        `<button class="quiz-option" onclick="checkQuizAnswer(${question.num}, this, ${opt.correct})">${opt.text}</button>`
    ).join('');

    container.innerHTML = `
        <div class="quiz-item">
            <h4>Question ${question.num}:</h4>
            <p>${question.question}</p>
            <div class="quiz-options">
                ${optionsHtml}
            </div>
            <div class="feedback" id="quiz-feedback-${question.num}"></div>
        </div>
    `;
}

function checkQuizAnswer(questionNum, button, isCorrect) {
    const options = button.parentElement.querySelectorAll('.quiz-option');
    const feedback = document.getElementById(`quiz-feedback-${questionNum}`);
    const retryKey = `module6_${questionNum}`;

    // Get the question text from the quizQuestions array
    const questionData = quizQuestions.find(q => q.num === questionNum);
    const questionText = questionData ? questionData.question : 'Quiz Question';
    const answerText = button.textContent.trim();

    // Initialize question attempts if first time
    if (!questionAttempts[retryKey]) {
        questionAttempts[retryKey] = 0;
    }

    // Increment attempt count
    questionAttempts[retryKey]++;

    // Track first attempt
    if (questionAttempts[retryKey] === 1 && firstAttempts.hasOwnProperty(retryKey)) {
        firstAttempts[retryKey] = isCorrect;
    }

    if (isCorrect) {
        options.forEach(opt => opt.disabled = true);
        button.classList.add('correct');
        addPoints(15, 'Quiz question correct!');
        moduleScores.module6++;
        quizAnswered[questionNum] = true;

        // Show success overlay with question and answer
        safeShowSuccess(
            questionText,
            answerText,
            15,
            () => {
                // Move to next question or complete after overlay dismissed
                currentQuizQuestion++;
                if (currentQuizQuestion < quizQuestions.length) {
                    showQuizQuestion(currentQuizQuestion);
                } else {
                    checkQuizComplete();
                }
            }
        );
    } else {
        button.classList.add('incorrect');
        feedback.className = 'feedback incorrect show';
        feedback.textContent = '✗ Incorrect. You must get this right to continue. Try again!';
        retries[retryKey]++;

        // Show error overlay
        safeShowError('✗ Incorrect. You must get this right to continue. Try again!');

        // Re-enable for retry
        setTimeout(() => {
            button.classList.remove('incorrect');
            feedback.classList.remove('show');
        }, 2000);

        // Save progress after wrong answer
        saveAppProgress();
    }
}

function checkQuizComplete() {
    const allAnswered = Object.keys(quizAnswered).length === 8 &&
                        Object.values(quizAnswered).every(v => v === true);

    if (allAnswered) {
        const scoreDiv = document.getElementById('quizScore');
        const percentage = Math.round((moduleScores.module6 / 8) * 100);

        scoreDiv.className = 'quiz-score show';
        scoreDiv.innerHTML = `✓ Quiz Complete! All questions answered correctly! Moving to final assessment...`;

        if (percentage >= 75) {
            setTimeout(() => awardBadge('Quiz Champion 🎯'), 500);
        }

        autoProgressToNextModule();
    }
}

// Final Assessment - One Question at a Time
let currentFinalQuestion = 0;
let finalAnswered = {};
let finalGraphShown = false;

const finalQuestions = [
    {
        num: 1,
        question: "Based on this climate graph, what is the approximate temperature range?",
        showGraph: true,
        options: [
            { text: "-10°C to 5°C", correct: false },
            { text: "5°C to 20°C", correct: true },
            { text: "25°C to 35°C", correct: false }
        ]
    },
    {
        num: 2,
        question: "Which season has the highest rainfall?",
        showGraph: true,
        options: [
            { text: "Summer (Jun-Aug)", correct: false },
            { text: "Spring (Mar-May)", correct: false },
            { text: "Autumn/Winter (Oct-Jan)", correct: true }
        ]
    },
    {
        num: 3,
        question: "What climate type does this represent?",
        showGraph: true,
        options: [
            { text: "Tropical", correct: false },
            { text: "Temperate", correct: true },
            { text: "Arid", correct: false }
        ]
    },
    {
        num: 4,
        question: "Which statement best describes climate?",
        showGraph: false,
        options: [
            { text: "The average weather pattern over 30+ years", correct: true },
            { text: "Today's weather conditions", correct: false },
            { text: "Next week's forecast", correct: false }
        ]
    },
    {
        num: 5,
        question: "Which city would most likely have a tropical climate?",
        showGraph: false,
        options: [
            { text: "London", correct: false },
            { text: "Moscow", correct: false },
            { text: "Singapore", correct: true }
        ]
    }
];

function initializeFinalAssessment() {
    currentFinalQuestion = 0;
    finalAnswered = {};
    finalGraphShown = false;
    showFinalQuestion(currentFinalQuestion);
}

function showFinalQuestion(index) {
    const container = document.getElementById('finalAssessment');
    const question = finalQuestions[index];

    // Update progress
    document.getElementById('current-final-q').textContent = index + 1;

    const graphHtml = question.showGraph && !finalGraphShown ?
        `<div class="graph-container" style="margin-bottom: 20px;">
            <canvas id="finalGraph" class="mystery-graph" style="max-height: 250px;"></canvas>
        </div>` : '';

    const optionsHtml = question.options.map((opt, i) =>
        `<button class="quiz-option" onclick="checkFinalAnswer(${question.num}, this, ${opt.correct})">${opt.text}</button>`
    ).join('');

    container.innerHTML = `
        <div class="quiz-item">
            ${graphHtml}
            <h4>Question ${question.num}:</h4>
            <p>${question.question}</p>
            <div class="quiz-options">
                ${optionsHtml}
            </div>
            <div class="feedback" id="final-feedback-${question.num}"></div>
        </div>
    `;

    // Create graph if needed
    if (question.showGraph && !finalGraphShown) {
        setTimeout(() => createFinalGraph(), 100);
        finalGraphShown = true;
    }
}

function checkFinalAnswer(questionNum, button, isCorrect) {
    const options = button.parentElement.querySelectorAll('.quiz-option');
    const feedback = document.getElementById(`final-feedback-${questionNum}`);
    const retryKey = `module7_${questionNum}`;

    // Get the question text from the finalQuestions array
    const questionData = finalQuestions.find(q => q.num === questionNum);
    const questionText = questionData ? questionData.question : 'Final Assessment Question';
    const answerText = button.textContent.trim();

    // Initialize question attempts if first time
    if (!questionAttempts[retryKey]) {
        questionAttempts[retryKey] = 0;
    }

    // Increment attempt count
    questionAttempts[retryKey]++;

    // Track first attempt
    if (questionAttempts[retryKey] === 1 && firstAttempts.hasOwnProperty(retryKey)) {
        firstAttempts[retryKey] = isCorrect;
    }

    if (isCorrect) {
        options.forEach(opt => opt.disabled = true);
        button.classList.add('correct');
        addPoints(20, 'Final assessment correct!');
        moduleScores.module7++;
        finalAnswered[questionNum] = true;

        // Show success overlay with question and answer
        safeShowSuccess(
            questionText,
            answerText,
            20,
            () => {
                // Move to next question or complete after overlay dismissed
                currentFinalQuestion++;
                if (currentFinalQuestion < finalQuestions.length) {
                    showFinalQuestion(currentFinalQuestion);
                } else {
                    checkFinalComplete();
                }
            }
        );
    } else {
        button.classList.add('incorrect');
        feedback.className = 'feedback incorrect show';
        feedback.textContent = '✗ Incorrect. You must get this right to complete the course. Try again!';
        retries[retryKey]++;

        // Show error overlay
        safeShowError('✗ Incorrect. You must get this right to complete the course. Try again!');

        // Re-enable for retry
        setTimeout(() => {
            button.classList.remove('incorrect');
            feedback.classList.remove('show');
        }, 2000);

        // Save progress after wrong answer
        saveAppProgress();
    }
}

function checkFinalComplete() {
    const allAnswered = Object.keys(finalAnswered).length === 5 &&
                        Object.values(finalAnswered).every(v => v === true);

    if (allAnswered) {
        const scoreDiv = document.getElementById('finalScore');
        scoreDiv.className = 'final-score show';
        scoreDiv.innerHTML = `✓ Final Assessment Complete! All questions answered correctly! Congratulations!`;

        const certBtn = document.getElementById('certificateBtn');
        certBtn.style.display = 'inline-block';
        setTimeout(() => awardBadge('Climate Expert 🏆'), 500);
    }
}

// Complete Course
function completeCourse() {
    currentModule = 8;
    showModule(currentModule);
    updateProgress();

    // Generate and populate the certificate with current user data
    generateCertificate();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Generate Certificate
function generateCertificate() {
    // Calculate total retries
    const totalRetries = Object.values(retries).reduce((sum, val) => sum + val, 0);

    // Calculate accuracy score based on FIRST ATTEMPTS
    // Count first attempt successes using the firstAttempts tracking object
    const firstAttemptKeys = Object.keys(firstAttempts);
    let firstAttemptCorrect = 0;
    let totalQuestions = 0;

    // Count Module 1
    if (firstAttempts.module1 !== null) {
        totalQuestions++;
        if (firstAttempts.module1 === true) firstAttemptCorrect++;
    }

    // Count Module 2 (16 cities tracked collectively)
    if (firstAttempts.module2 !== null) {
        totalQuestions += 16; // 16 cities
        if (firstAttempts.module2 === true) {
            firstAttemptCorrect += 16; // All cities correct on first try
        } else {
            // Some cities were wrong on first try - count how many were actually wrong
            // We'll be conservative and count based on retries
            const module2Retries = retries.module2;
            firstAttemptCorrect += Math.max(0, 16 - module2Retries);
        }
    }

    // Count Module 3 (3 questions for graph reading)
    ['module3_q1', 'module3_q2', 'module3_q3'].forEach(key => {
        if (firstAttempts[key] !== null) {
            totalQuestions++;
            if (firstAttempts[key] === true) firstAttemptCorrect++;
        }
    });

    // Count Module 4
    if (firstAttempts.module4 !== null) {
        totalQuestions++;
        if (firstAttempts.module4 === true) firstAttemptCorrect++;
    }

    // Count Module 4B
    if (firstAttempts.module4b !== null) {
        totalQuestions++;
        if (firstAttempts.module4b === true) firstAttemptCorrect++;
    }

    // Count Module 5 (3 mystery graphs)
    for (let i = 1; i <= 3; i++) {
        const key = `module5_${i}`;
        if (firstAttempts[key] !== null) {
            totalQuestions++;
            if (firstAttempts[key] === true) firstAttemptCorrect++;
        }
    }

    // Count Module 6 (8 quiz questions)
    for (let i = 1; i <= 8; i++) {
        const key = `module6_${i}`;
        if (firstAttempts[key] !== null) {
            totalQuestions++;
            if (firstAttempts[key] === true) firstAttemptCorrect++;
        }
    }

    // Count Module 7 (5 final questions)
    for (let i = 1; i <= 5; i++) {
        const key = `module7_${i}`;
        if (firstAttempts[key] !== null) {
            totalQuestions++;
            if (firstAttempts[key] === true) firstAttemptCorrect++;
        }
    }

    // Calculate percentage (fallback to 100% if no questions tracked)
    const accuracyPercentage = totalQuestions > 0
        ? Math.round((firstAttemptCorrect / totalQuestions) * 100)
        : 100;

    const completionDate = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // Validate we have a student name
    if (!studentName || studentName.trim() === '') {
        alert('⚠️ Please enter your name at the start of the course!');
        return;
    }

    // Debug log
    console.log('=== GENERATING CERTIFICATE ===');
    console.log('Current student name:', studentName);
    console.log('Current points:', points);
    console.log('Current badges:', badges.length);
    console.log('Total retries:', totalRetries);
    console.log('Accuracy:', accuracyPercentage + '%');

    // Populate certificate with user data
    document.getElementById('certificateStudentName').textContent = studentName.trim();
    document.getElementById('certificateTotalPoints').textContent = points;
    document.getElementById('certificateBadgeCount').textContent = badges.length;
    document.getElementById('certificateTotalRetries').textContent = totalRetries;
    document.getElementById('certificateAccuracyScore').textContent = accuracyPercentage + '%';
    document.getElementById('certificateCompletionDate').textContent = completionDate;

    // Navigate to certificate screen using screenManager
    if (typeof screenManager !== 'undefined') {
        screenManager.nextScreen();
    }

    console.log('✓ Certificate populated with user data and screen shown');
}

// Restart Course
function restartCourse() {
    if (confirm('Are you sure you want to restart the course? Your progress will be lost.')) {
        currentModule = 0;
        points = 0;
        badges = [];
        moduleScores = {
            module1: 0,
            module2: 0,
            module3: 0,
            module4: 0,
            module4b: 0,
            module5: 0,
            module6: 0,
            module7: 0
        };

        // Reset all retry counters
        Object.keys(retries).forEach(key => {
            retries[key] = 0;
        });

        // Reset answered tracking
        explorerAnswered = {1: false, 2: false, 3: false};
        quizAnswered = {};
        finalAnswered = {};

        // Clear localStorage
        localStorage.removeItem('climateHub_currentScreen');
        localStorage.removeItem('studentName');

        // Navigate to first screen using screenManager
        if (typeof screenManager !== 'undefined') {
            screenManager.showScreen(0);
        } else {
            showModule(0);
        }
        
        updateProgress();
        
        // Clear student name input
        const studentNameInput = document.getElementById('studentName');
        if (studentNameInput) {
            studentNameInput.value = '';
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
