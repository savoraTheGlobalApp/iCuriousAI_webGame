// Simple Game Controller
class SimpleGameController {
    constructor() {
        this.currentScreen = 'loading';
        this.player = {
            name: '',
            avatar: '1',
            coins: 0
        };
        this.init();
    }

    init() {
        console.log('Game initializing...');
        this.setupEventListeners();
        this.startLoadingSequence();
    }

    setupEventListeners() {
        // Avatar selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.avatar-option')) {
                const option = e.target.closest('.avatar-option');
                document.querySelectorAll('.avatar-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                this.player.avatar = option.dataset.avatar;
            }
        });

        // Start game button
        document.addEventListener('click', (e) => {
            if (e.target.closest('#start-game')) {
                const playerName = document.getElementById('player-name').value.trim();
                if (playerName) {
                    this.player.name = playerName;
                    this.showScreen('game');
                    this.updatePlayerInfo();
                } else {
                    alert('Please enter your name!');
                }
            }
        });

        // Level selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.level-card') && !e.target.closest('.level-card').classList.contains('locked')) {
                const level = e.target.closest('.level-card').dataset.level;
                this.showLevelContent(level);
            }
        });

        // Navigation
        document.addEventListener('click', (e) => {
            if (e.target.closest('.nav-btn')) {
                const btn = e.target.closest('.nav-btn');
                const screen = btn.dataset.screen;
                this.showScreen(screen);
                
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
        });

        // Back buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.back-btn')) {
                this.showScreen('game');
                document.querySelector('.nav-btn[data-screen="map"]').classList.add('active');
            }
        });

        // Challenge buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-challenge')) {
                const challengeCard = e.target.closest('.challenge-card');
                const challengeType = challengeCard.dataset.challenge;
                this.startChallenge(challengeType);
            }
        });

        // Modal close
        document.addEventListener('click', (e) => {
            if (e.target.closest('.close-btn') || e.target.id === 'challenge-modal') {
                this.hideModal();
            }
        });
    }

    startLoadingSequence() {
        console.log('Starting loading sequence...');
        setTimeout(() => {
            console.log('Loading complete, showing login screen');
            this.showScreen('login');
        }, 3000);
    }

    showScreen(screenName) {
        console.log('Showing screen:', screenName);
        
        // Hide loading screen specifically
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });

        // Show target screen
        const targetScreen = document.getElementById(`${screenName}-screen`);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
            console.log('Target screen found and shown:', targetScreen.id);
        } else {
            console.error('Target screen not found:', `${screenName}-screen`);
        }

        this.currentScreen = screenName;
    }

    updatePlayerInfo() {
        const playerAvatar = document.getElementById('player-avatar');
        const playerNameDisplay = document.getElementById('player-name-display');
        const coinsCount = document.getElementById('coins-count');

        if (playerAvatar) {
            // Use simple colored circles instead of problematic placeholder URLs
            const colors = {
                '1': '#FF6B6B',
                '2': '#4ECDC4', 
                '3': '#45B7D1',
                '4': '#96CEB4'
            };
            const color = colors[this.player.avatar] || '#FF6B6B';
            playerAvatar.style.backgroundColor = color;
            playerAvatar.style.borderRadius = '50%';
            playerAvatar.style.width = '40px';
            playerAvatar.style.height = '40px';
            playerAvatar.style.display = 'flex';
            playerAvatar.style.alignItems = 'center';
            playerAvatar.style.justifyContent = 'center';
            playerAvatar.style.color = 'white';
            playerAvatar.style.fontSize = '20px';
            playerAvatar.textContent = this.getAvatarEmoji(this.player.avatar);
        }
        if (playerNameDisplay) {
            playerNameDisplay.textContent = this.player.name;
        }
        if (coinsCount) {
            coinsCount.textContent = this.player.coins;
        }
    }

    getAvatarEmoji(avatarId) {
        const emojis = {
            '1': '🐒',
            '2': '🐰',
            '3': '🦅',
            '4': '🐳'
        };
        return emojis[avatarId] || '👦';
    }

    showLevelContent(level) {
        const levelMap = document.getElementById('level-map');
        const levelContent = document.getElementById('level-content');

        if (levelMap && levelContent) {
            levelMap.classList.add('hidden');
            levelContent.classList.remove('hidden');
        }

        this.updateLevelStory(level);
    }

    updateLevelStory(level) {
        const storyTitle = document.getElementById('story-title');
        const storyText = document.querySelector('.story-text p');

        const stories = {
            jungle: {
                title: 'The Lost Monkey',
                text: 'A little monkey has lost his way in the jungle! Help him find his family by solving challenges and collecting bananas.'
            },
            desert: {
                title: 'The Thirsty Rabbit',
                text: 'Oh no! Little Rabbit is very thirsty in the hot desert. He found a well, but it\'s locked! Can you help him get water by solving challenges to find the key?'
            },
            mountains: {
                title: 'The Brave Eagle',
                text: 'A young eagle wants to learn to fly high above the mountains. Help him gain confidence through various challenges!'
            },
            ocean: {
                title: 'The Curious Dolphin',
                text: 'A friendly dolphin wants to explore the ocean depths but needs help with some underwater challenges first.'
            }
        };

        if (storyTitle && storyText) {
            const story = stories[level] || stories.jungle;
            storyTitle.textContent = story.title;
            storyText.textContent = story.text;
        }
    }

    startChallenge(challengeType) {
        const challenge = this.createChallenge(challengeType);
        this.showModal(challenge);
    }

    createChallenge(challengeType) {
        const challenges = {
            math: {
                title: 'Math Challenge',
                content: this.createMathChallenge(),
                type: 'math'
            },
            reading: {
                title: 'Reading Challenge',
                content: this.createReadingChallenge(),
                type: 'reading'
            },
            selfie: {
                title: 'Selfie Challenge',
                content: this.createSelfieChallenge(),
                type: 'selfie'
            },
            friends: {
                title: 'Friends Challenge',
                content: this.createFriendsChallenge(),
                type: 'friends'
            }
        };

        return challenges[challengeType] || challenges.math;
    }

    createMathChallenge() {
        const num1 = Math.floor(Math.random() * 20) + 1;
        const num2 = Math.floor(Math.random() * 15) + 1;
        const answer = num1 + num2;

        return `
            <div class="math-challenge">
                <h4>Solve this math problem:</h4>
                <div class="math-problem">
                    <span class="number">${num1}</span>
                    <span class="operator">+</span>
                    <span class="number">${num2}</span>
                    <span class="equals">=</span>
                    <input type="number" id="math-answer" placeholder="?" class="math-input">
                </div>
                <button class="btn-primary" onclick="gameController.checkMathAnswer(${answer})">Submit Answer</button>
            </div>
        `;
    }

    createReadingChallenge() {
        return `
            <div class="reading-challenge">
                <h4>Reading Challenge</h4>
                <div class="reading-text">
                    <p>"The brave monkey swings from tree to tree."</p>
                </div>
                <p>Read this sentence out loud!</p>
                <button class="btn-primary" onclick="gameController.completeChallenge(15)">Complete Challenge</button>
            </div>
        `;
    }

    createSelfieChallenge() {
        return `
            <div class="selfie-challenge">
                <h4>Selfie Challenge</h4>
                <p>📸 Take a selfie according to the challenge requirements!</p>
                <button class="btn-primary" onclick="gameController.completeChallenge(20)">Complete Challenge</button>
            </div>
        `;
    }

    createFriendsChallenge() {
        return `
            <div class="friends-challenge">
                <h4>Friends Challenge</h4>
                <p>👥 Take a photo with friends!</p>
                <button class="btn-primary" onclick="gameController.completeChallenge(25)">Complete Challenge</button>
            </div>
        `;
    }

    showModal(challenge) {
        const modal = document.getElementById('challenge-modal');
        const modalTitle = document.getElementById('modal-title');
        const challengeContent = document.getElementById('challenge-content');

        if (modal && modalTitle && challengeContent) {
            modalTitle.textContent = challenge.title;
            challengeContent.innerHTML = challenge.content;
            modal.classList.remove('hidden');
        }
    }

    hideModal() {
        const modal = document.getElementById('challenge-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    checkMathAnswer(correctAnswer) {
        const userAnswer = parseInt(document.getElementById('math-answer').value);
        
        if (userAnswer === correctAnswer) {
            this.completeChallenge(20);
            this.showNotification('Correct! You earned 20 coins! 🎉', 'success');
        } else {
            this.showNotification('Try again! The answer was ' + correctAnswer, 'error');
        }
    }

    completeChallenge(reward) {
        this.player.coins += reward;
        this.updatePlayerInfo();
        this.hideModal();
        this.showNotification(`You earned ${reward} coins! 🎉`, 'success');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the game
let gameController;

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, initializing game...');
        gameController = new SimpleGameController();
    });
} else {
    console.log('DOM already loaded, initializing game...');
    gameController = new SimpleGameController();
}

// Add notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    }
    
    .notification.success {
        background: linear-gradient(45deg, #4CAF50, #8BC34A);
    }
    
    .notification.error {
        background: linear-gradient(45deg, #f44336, #e91e63);
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .math-challenge {
        text-align: center;
    }
    
    .math-problem {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin: 2rem 0;
        font-size: 2rem;
    }
    
    .math-input {
        width: 80px;
        padding: 0.5rem;
        font-size: 1.5rem;
        text-align: center;
        border: 2px solid #ddd;
        border-radius: 8px;
    }
    
    .reading-challenge, .selfie-challenge, .friends-challenge {
        text-align: center;
    }
    
    .reading-text {
        background: #f5f5f5;
        padding: 2rem;
        border-radius: 10px;
        margin: 1rem 0;
        font-size: 1.2rem;
    }
`;

// Add styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Debug: Check if script is loaded
console.log('Script loaded successfully!');

// Force hide loading screen after 3 seconds as backup
setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
        console.log('Forced loading screen hide');
    }
    
    const loginScreen = document.getElementById('login-screen');
    if (loginScreen) {
        loginScreen.classList.remove('hidden');
        console.log('Forced login screen show');
    }
}, 3000);
