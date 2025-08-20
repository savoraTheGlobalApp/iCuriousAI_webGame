// Simple Game Controller
class SimpleGameController {
    constructor() {
        this.currentScreen = 'loading';
        this.player = {
            name: '',
            avatar: '1',
            coins: 0
        };
        this.worldController = null;
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
                this.enterLevel(level);
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

    enterLevel(level) {
        // Initialize world controller if not already done
        if (!this.worldController) {
            this.worldController = new WorldController(this);
            worldController = this.worldController; // Global reference
        }

        // Load the specific level
        this.worldController.loadLevel(level);
        this.worldController.showWorld();
        this.updatePlayerInfo();
    }

    updatePlayerInfo() {
        const playerAvatar = document.getElementById('player-avatar');
        const playerNameDisplay = document.getElementById('player-name-display');
        const coinsCount = document.getElementById('coins-count');

        if (playerAvatar) {
            const colors = {
                '1': '#FF6B6B',
                '2': '#4ECDC4', 
                '3': '#45B7D1',
                '4': '#96CEB4'
            };
            const color = colors[this.player.avatar] || '#FF6B6B';
            playerAvatar.style.backgroundColor = color;
            playerAvatar.textContent = this.getAvatarEmoji(this.player.avatar);
        }
        if (playerNameDisplay) {
            playerNameDisplay.textContent = this.player.name;
        }
        if (coinsCount) {
            coinsCount.textContent = this.player.coins;
        }

        // Update player sprite in world
        const playerSprite = document.querySelector('.player-sprite');
        if (playerSprite) {
            playerSprite.textContent = this.getAvatarEmoji(this.player.avatar);
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
        this.updateLevelChallenges(level);
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

    updateLevelChallenges(level) {
        const challengesGrid = document.querySelector('.challenges-grid');
        if (!challengesGrid) return;

        const levelChallenges = this.getChallengesForLevel(level);
        challengesGrid.innerHTML = '';

        levelChallenges.forEach(challenge => {
            const challengeCard = this.createChallengeCard(challenge);
            challengesGrid.appendChild(challengeCard);
        });
    }

    getChallengesForLevel(level) {
        const challenges = {
            jungle: [
                { type: 'math', title: 'Jungle Math', description: 'Solve: 8 + 5 = ?', reward: 10 },
                { type: 'reading', title: 'Jungle Reading', description: 'Read: "The brave monkey swings quickly."', reward: 15 },
                { type: 'selfie', title: 'Jungle Selfie', description: 'Take a selfie with green background', reward: 20 },
                { type: 'friends', title: 'Group Photo', description: 'Take a photo with friends', reward: 25 }
            ],
            desert: [
                { type: 'math', title: 'Desert Math', description: 'Solve: 12 - 7 = ?', reward: 12 },
                { type: 'reading', title: 'Desert Reading', description: 'Read: "The thirsty rabbit needs water."', reward: 18 },
                { type: 'selfie', title: 'Desert Selfie', description: 'Take a selfie in sunlight', reward: 22 },
                { type: 'creative', title: 'Desert Art', description: 'Draw a desert landscape', reward: 30 }
            ]
        };

        return challenges[level] || challenges.jungle;
    }

    createChallengeCard(challenge) {
        const card = document.createElement('div');
        card.className = 'challenge-card';
        card.dataset.challenge = challenge.type;

        const icon = this.getChallengeIcon(challenge.type);
        
        card.innerHTML = `
            <div class="challenge-icon">${icon}</div>
            <h4>${challenge.title}</h4>
            <p>${challenge.description}</p>
            <div class="challenge-reward">
                <i class="fas fa-coins"></i>
                <span>${challenge.reward} coins</span>
            </div>
            <button class="btn-challenge">Start</button>
        `;

        return card;
    }

    getChallengeIcon(type) {
        const icons = {
            'math': '🧮',
            'reading': '📖',
            'selfie': '📸',
            'friends': '👥',
            'creative': '🎨',
            'video': '📹',
            'recording': '🎤'
        };
        return icons[type] || '❓';
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
            },
            creative: {
                title: 'Creative Challenge',
                content: this.createCreativeChallenge(),
                type: 'creative'
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
        const sentences = [
            "The brave monkey swings from tree to tree.",
            "The thirsty rabbit needs water to survive.",
            "The eagle soars high above the peaks.",
            "The dolphin swims gracefully through the waves."
        ];
        const sentence = sentences[Math.floor(Math.random() * sentences.length)];

        return `
            <div class="reading-challenge">
                <h4>Read this sentence out loud:</h4>
                <div class="reading-text">
                    <p>"${sentence}"</p>
                </div>
                <div class="recording-controls">
                    <button class="btn-primary" onclick="gameController.startRecording()">
                        <i class="fas fa-microphone"></i> Start Recording
                    </button>
                    <button class="btn-secondary" onclick="gameController.stopRecording()" style="display: none;">
                        <i class="fas fa-stop"></i> Stop Recording
                    </button>
                </div>
                <div class="recording-status">
                    <p>Click "Start Recording" and read the sentence clearly!</p>
                </div>
                <button class="btn-primary" onclick="gameController.completeReadingChallenge()">Complete Challenge</button>
            </div>
        `;
    }

    createSelfieChallenge() {
        return `
            <div class="selfie-challenge">
                <h4>Take a Selfie Challenge</h4>
                <div class="camera-container">
                    <div class="camera-placeholder">
                        <i class="fas fa-camera"></i>
                        <p>Camera access required</p>
                    </div>
                </div>
                <div class="selfie-instructions">
                    <p>📸 Take a selfie according to the challenge requirements!</p>
                    <p>🌞 Make sure you're in good lighting</p>
                    <p>😊 Show your best smile!</p>
                </div>
                <button class="btn-primary" onclick="gameController.completeSelfieChallenge()">Complete Challenge</button>
            </div>
        `;
    }

    createFriendsChallenge() {
        return `
            <div class="friends-challenge">
                <h4>Group Photo Challenge</h4>
                <div class="friends-instructions">
                    <p>👥 Take a photo with at least one friend!</p>
                    <p>📸 The more friends in the photo, the more points you get!</p>
                    <p>🎉 Make it fun and creative!</p>
                </div>
                <div class="friends-count">
                    <label>How many friends are in your photo?</label>
                    <input type="number" id="friends-count" min="1" max="10" value="1" class="number-input">
                </div>
                <button class="btn-primary" onclick="gameController.completeFriendsChallenge()">Complete Challenge</button>
            </div>
        `;
    }

    createCreativeChallenge() {
        return `
            <div class="creative-challenge">
                <h4>Creative Challenge</h4>
                <div class="creative-instructions">
                    <p>🎨 Draw or create something amazing!</p>
                    <p>📝 You can draw, paint, or create with any materials</p>
                    <p>📸 Take a photo of your creation when done</p>
                </div>
                <div class="creative-timer">
                    <p>⏱️ Take your time to be creative!</p>
                </div>
                <button class="btn-primary" onclick="gameController.completeCreativeChallenge()">Complete Challenge</button>
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
            this.showSuccessMessage('Correct! You earned 20 coins! 🎉');
        } else {
            this.showErrorMessage('Try again! The answer was ' + correctAnswer);
        }
    }

    startRecording() {
        const startBtn = document.querySelector('.recording-controls .btn-primary');
        const stopBtn = document.querySelector('.recording-controls .btn-secondary');
        const status = document.querySelector('.recording-status p');

        if (startBtn && stopBtn && status) {
            startBtn.style.display = 'none';
            stopBtn.style.display = 'inline-block';
            status.textContent = ' Recording... Speak clearly!';
        }
    }

    stopRecording() {
        const startBtn = document.querySelector('.recording-controls .btn-primary');
        const stopBtn = document.querySelector('.recording-controls .btn-secondary');
        const status = document.querySelector('.recording-status p');

        if (startBtn && stopBtn && status) {
            startBtn.style.display = 'inline-block';
            stopBtn.style.display = 'none';
            status.textContent = '✅ Recording completed! Great job!';
        }
    }

    completeReadingChallenge() {
        this.completeChallenge(15);
        this.showSuccessMessage('Excellent reading! You earned 15 coins! 📖');
        this.hideModal();
    }

    completeSelfieChallenge() {
        this.completeChallenge(20);
        this.showSuccessMessage('Amazing selfie! You earned 20 coins! 📸');
        this.hideModal();
    }

    completeFriendsChallenge() {
        const friendsCount = parseInt(document.getElementById('friends-count').value) || 1;
        const bonus = Math.min(friendsCount - 1, 4) * 5; // 5 coins bonus per extra friend, max 20
        const totalReward = 25 + bonus;
        
        this.completeChallenge(totalReward);
        this.showSuccessMessage(`Great group photo! You earned ${totalReward} coins! 👥`);
        this.hideModal();
    }

    completeCreativeChallenge() {
        this.completeChallenge(30);
        this.showSuccessMessage('Wonderful creativity! You earned 30 coins! 🎨');
        this.hideModal();
    }

    completeChallenge(reward) {
        this.player.coins += reward;
        this.updatePlayerInfo();
        this.showCoinsAnimation(reward);
    }

    showSuccessMessage(message) {
        this.showNotification(message, 'success');
    }

    showErrorMessage(message) {
        this.showNotification(message, 'error');
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

    showCoinsAnimation(amount) {
        const coinsDisplay = document.getElementById('coins-count');
        if (coinsDisplay) {
            coinsDisplay.classList.add('bounce');
            setTimeout(() => {
                coinsDisplay.classList.remove('bounce');
            }, 1000);
        }
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
