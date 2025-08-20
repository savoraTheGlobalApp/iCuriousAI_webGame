// 2D World Controller
class WorldController {
    constructor(gameController) {
        this.gameController = gameController;
        this.currentLevel = 'jungle';
        this.playerPosition = { x: 2, y: 2 };
        this.worldData = {};
        this.interactiveObjects = [];
        this.isMoving = false;
        this.currentInteractiveObject = null;
        
        this.init();
    }

    init() {
        this.setupWorlds();
        this.setupEventListeners();
        this.renderWorld();
    }

    setupWorlds() {
        this.worldData = {
            jungle: {
                tiles: this.generateJungleWorld(),
                playerStart: { x: 2, y: 2 },
                interactiveObjects: [
                    { x: 5, y: 3, type: 'hut', challenge: 'math', reward: 15, description: 'Math Hut' },
                    { x: 8, y: 7, type: 'board', challenge: 'reading', reward: 20, description: 'Reading Board' },
                    { x: 12, y: 5, type: 'box', challenge: 'selfie', reward: 25, description: 'Mystery Box' },
                    { x: 15, y: 10, type: 'hut', challenge: 'friends', reward: 30, description: 'Friends Hut' }
                ]
            },
            desert: {
                tiles: this.generateDesertWorld(),
                playerStart: { x: 2, y: 2 },
                interactiveObjects: [
                    { x: 6, y: 4, type: 'hut', challenge: 'math', reward: 18, description: 'Desert Math Hut' },
                    { x: 10, y: 8, type: 'board', challenge: 'reading', reward: 22, description: 'Desert Reading Board' },
                    { x: 14, y: 6, type: 'box', challenge: 'creative', reward: 35, description: 'Desert Mystery Box' }
                ]
            },
            mountains: {
                tiles: this.generateMountainWorld(),
                playerStart: { x: 2, y: 2 },
                interactiveObjects: [
                    { x: 7, y: 5, type: 'hut', challenge: 'math', reward: 25, description: 'Mountain Math Hut' },
                    { x: 11, y: 9, type: 'board', challenge: 'reading', reward: 30, description: 'Mountain Reading Board' },
                    { x: 13, y: 7, type: 'box', challenge: 'creative', reward: 40, description: 'Mountain Mystery Box' }
                ]
            },
            ocean: {
                tiles: this.generateOceanWorld(),
                playerStart: { x: 2, y: 2 },
                interactiveObjects: [
                    { x: 5, y: 4, type: 'hut', challenge: 'math', reward: 20, description: 'Ocean Math Hut' },
                    { x: 9, y: 8, type: 'board', challenge: 'reading', reward: 25, description: 'Ocean Reading Board' },
                    { x: 15, y: 6, type: 'box', challenge: 'selfie', reward: 30, description: 'Ocean Mystery Box' }
                ]
            }
        };
    }

    generateJungleWorld() {
        const tiles = [];
        const width = 20;
        const height = 15;

        for (let y = 0; y < height; y++) {
            tiles[y] = [];
            for (let x = 0; x < width; x++) {
                // Create boundaries
                if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
                    tiles[y][x] = { type: 'rock', symbol: '🪨', walkable: false };
                }
                // Main paths
                else if (x === 10 || y === 7 || (x >= 5 && x <= 15 && y === 3) || (x >= 8 && x <= 18 && y === 10)) {
                    tiles[y][x] = { type: 'path', symbol: '🛤️', walkable: true };
                }
                // Trees
                else if (Math.random() < 0.3) {
                    tiles[y][x] = { type: 'tree', symbol: '🌳', walkable: false };
                }
                // Grass
                else {
                    tiles[y][x] = { type: 'grass', symbol: '🌱', walkable: true };
                }
            }
        }

        // Add specific features
        tiles[3][5] = { type: 'hut', symbol: '🏠', walkable: false };
        tiles[7][8] = { type: 'board', symbol: '📋', walkable: false };
        tiles[5][12] = { type: 'box', symbol: '📦', walkable: false };
        tiles[10][15] = { type: 'hut', symbol: '🏠', walkable: false };
        tiles[12][5] = { type: 'water', symbol: '💧', walkable: false };

        return tiles;
    }

    generateDesertWorld() {
        const tiles = [];
        const width = 20;
        const height = 15;

        for (let y = 0; y < height; y++) {
            tiles[y] = [];
            for (let x = 0; x < width; x++) {
                if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
                    tiles[y][x] = { type: 'rock', symbol: '🪨', walkable: false };
                }
                else if (x === 10 || y === 7) {
                    tiles[y][x] = { type: 'path', symbol: '🛤️', walkable: true };
                }
                else if (Math.random() < 0.2) {
                    tiles[y][x] = { type: 'rock', symbol: '🪨', walkable: false };
                }
                else {
                    tiles[y][x] = { type: 'grass', symbol: '🏜️', walkable: true };
                }
            }
        }

        tiles[4][6] = { type: 'hut', symbol: '🏠', walkable: false };
        tiles[8][10] = { type: 'board', symbol: '📋', walkable: false };
        tiles[6][14] = { type: 'box', symbol: '📦', walkable: false };

        return tiles;
    }

    generateMountainWorld() {
        const tiles = [];
        const width = 20;
        const height = 15;

        for (let y = 0; y < height; y++) {
            tiles[y] = [];
            for (let x = 0; x < width; x++) {
                if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
                    tiles[y][x] = { type: 'rock', symbol: '🪨', walkable: false };
                }
                else if (x === 10 || y === 7) {
                    tiles[y][x] = { type: 'path', symbol: '🛤️', walkable: true };
                }
                else if (Math.random() < 0.4) {
                    tiles[y][x] = { type: 'rock', symbol: '🪨', walkable: false };
                }
                else {
                    tiles[y][x] = { type: 'grass', symbol: '🌱', walkable: true };
                }
            }
        }

        tiles[5][7] = { type: 'hut', symbol: '🏠', walkable: false };
        tiles[9][11] = { type: 'board', symbol: '📋', walkable: false };
        tiles[7][13] = { type: 'box', symbol: '📦', walkable: false };

        return tiles;
    }

    generateOceanWorld() {
        const tiles = [];
        const width = 20;
        const height = 15;

        for (let y = 0; y < height; y++) {
            tiles[y] = [];
            for (let x = 0; x < width; x++) {
                if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
                    tiles[y][x] = { type: 'rock', symbol: '🪨', walkable: false };
                }
                else if (x === 10 || y === 7) {
                    tiles[y][x] = { type: 'path', symbol: '🛤️', walkable: true };
                }
                else if (Math.random() < 0.3) {
                    tiles[y][x] = { type: 'water', symbol: '💧', walkable: false };
                }
                else {
                    tiles[y][x] = { type: 'grass', symbol: '🌱', walkable: true };
                }
            }
        }

        tiles[4][5] = { type: 'hut', symbol: '🏠', walkable: false };
        tiles[8][9] = { type: 'board', symbol: '📋', walkable: false };
        tiles[6][15] = { type: 'box', symbol: '📦', walkable: false };

        return tiles;
    }

    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (this.isMoving) return;
            
            let newX = this.playerPosition.x;
            let newY = this.playerPosition.y;
            
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    newY = Math.max(0, this.playerPosition.y - 1);
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    newY = Math.min(14, this.playerPosition.y + 1);
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    newX = Math.max(0, this.playerPosition.x - 1);
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    newX = Math.min(19, this.playerPosition.x + 1);
                    break;
            }
            
            if (newX !== this.playerPosition.x || newY !== this.playerPosition.y) {
                this.movePlayer(newX, newY);
            }
        });

        // Interaction button
        document.addEventListener('click', (e) => {
            if (e.target.closest('#interaction-button')) {
                this.interactWithObject();
            }
        });

        // Back to map button
        document.addEventListener('click', (e) => {
            if (e.target.closest('#back-to-map')) {
                this.showMap();
            }
        });
    }

    movePlayer(newX, newY) {
        const world = this.worldData[this.currentLevel];
        const targetTile = world.tiles[newY][newX];
        
        // Check if the tile is walkable
        if (!targetTile.walkable) {
            return;
        }
        
        this.isMoving = true;
        this.playerPosition.x = newX;
        this.playerPosition.y = newY;
        
        // Update player position
        const player = document.getElementById('player');
        if (player) {
            player.style.left = `${newX * 5}%`;
            player.style.top = `${newY * 6.67}%`;
            player.classList.add('moving');
            
            setTimeout(() => {
                player.classList.remove('moving');
                this.isMoving = false;
            }, 300);
        }
        
        // Check for interactions
        this.checkForInteractions();
    }

    checkForInteractions() {
        const world = this.worldData[this.currentLevel];
        const interactionButton = document.getElementById('interaction-button');
        
        // Check if player is near an interactive object
        const nearbyObject = world.interactiveObjects.find(obj => 
            Math.abs(obj.x - this.playerPosition.x) <= 1 && 
            Math.abs(obj.y - this.playerPosition.y) <= 1
        );
        
        if (nearbyObject) {
            interactionButton.classList.remove('hidden');
            this.currentInteractiveObject = nearbyObject;
            
            // Show tooltip
            interactionButton.title = `Click to interact with ${nearbyObject.description}`;
        } else {
            interactionButton.classList.add('hidden');
            this.currentInteractiveObject = null;
        }
    }

    interactWithObject() {
        if (!this.currentInteractiveObject) return;
        
        const obj = this.currentInteractiveObject;
        const challenge = this.createChallenge(obj.challenge, obj.reward);
        
        this.gameController.showModal(challenge);
    }

    createChallenge(type, reward) {
        const challenges = {
            math: {
                title: 'Math Challenge',
                content: this.createMathChallenge(),
                type: 'math',
                reward: reward
            },
            reading: {
                title: 'Reading Challenge',
                content: this.createReadingChallenge(),
                type: 'reading',
                reward: reward
            },
            selfie: {
                title: 'Selfie Challenge',
                content: this.createSelfieChallenge(),
                type: 'selfie',
                reward: reward
            },
            friends: {
                title: 'Friends Challenge',
                content: this.createFriendsChallenge(),
                type: 'friends',
                reward: reward
            },
            creative: {
                title: 'Creative Challenge',
                content: this.createCreativeChallenge(),
                type: 'creative',
                reward: reward
            }
        };

        return challenges[type] || challenges.math;
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
                <button class="btn-primary" onclick="worldController.checkMathAnswer(${answer})">Submit Answer</button>
            </div>
        `;
    }

    createReadingChallenge() {
        const sentences = [
            "The brave explorer discovers ancient treasures.",
            "A magical creature lives in the enchanted forest.",
            "The wise owl teaches young animals to fly.",
            "Adventure awaits around every corner.",
            "Friendship makes every journey special."
        ];
        const sentence = sentences[Math.floor(Math.random() * sentences.length)];

        return `
            <div class="reading-challenge">
                <h4>Read this sentence out loud:</h4>
                <div class="reading-text">
                    <p>"${sentence}"</p>
                </div>
                <div class="recording-controls">
                    <button class="btn-primary" onclick="worldController.startRecording()">
                        <i class="fas fa-microphone"></i> Start Recording
                    </button>
                    <button class="btn-secondary" onclick="worldController.stopRecording()" style="display: none;">
                        <i class="fas fa-stop"></i> Stop Recording
                    </button>
                </div>
                <div class="recording-status">
                    <p>Click "Start Recording" and read the sentence clearly!</p>
                </div>
                <button class="btn-primary" onclick="worldController.completeReadingChallenge()">Complete Challenge</button>
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
                <button class="btn-primary" onclick="worldController.completeSelfieChallenge()">Complete Challenge</button>
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
                <button class="btn-primary" onclick="worldController.completeFriendsChallenge()">Complete Challenge</button>
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
                <button class="btn-primary" onclick="worldController.completeCreativeChallenge()">Complete Challenge</button>
            </div>
        `;
    }

    checkMathAnswer(correctAnswer) {
        const userAnswer = parseInt(document.getElementById('math-answer').value);
        
        if (userAnswer === correctAnswer) {
            this.completeChallenge();
            this.gameController.showSuccessMessage('Correct! You earned coins! 🎉');
        } else {
            this.gameController.showErrorMessage('Try again! The answer was ' + correctAnswer);
        }
    }

    startRecording() {
        const startBtn = document.querySelector('.recording-controls .btn-primary');
        const stopBtn = document.querySelector('.recording-controls .btn-secondary');
        const status = document.querySelector('.recording-status p');

        if (startBtn && stopBtn && status) {
            startBtn.style.display = 'none';
            stopBtn.style.display = 'inline-block';
            status.textContent = '�� Recording... Speak clearly!';
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
        this.completeChallenge();
        this.gameController.showSuccessMessage('Excellent reading! You earned coins! 📖');
        this.gameController.hideModal();
    }

    completeSelfieChallenge() {
        this.completeChallenge();
        this.gameController.showSuccessMessage('Amazing selfie! You earned coins! 📸');
        this.gameController.hideModal();
    }

    completeFriendsChallenge() {
        const friendsCount = parseInt(document.getElementById('friends-count').value) || 1;
        const bonus = Math.min(friendsCount - 1, 4) * 5; // 5 coins bonus per extra friend, max 20
        const totalReward = this.currentInteractiveObject.reward + bonus;
        
        this.gameController.player.coins += totalReward;
        this.gameController.updatePlayerInfo();
        this.gameController.hideModal();
        this.gameController.showSuccessMessage(`Great group photo! You earned ${totalReward} coins! 👥`);
    }

    completeCreativeChallenge() {
        this.completeChallenge();
        this.gameController.showSuccessMessage('Wonderful creativity! You earned coins! 🎨');
        this.gameController.hideModal();
    }

    completeChallenge() {
        const reward = this.currentInteractiveObject.reward;
        this.gameController.player.coins += reward;
        this.gameController.updatePlayerInfo();
        this.gameController.hideModal();
        this.gameController.showSuccessMessage(`You earned ${reward} coins! 🎉`);
    }

    renderWorld() {
        const worldGrid = document.getElementById('world-grid');
        if (!worldGrid) return;

        const world = this.worldData[this.currentLevel];
        worldGrid.innerHTML = '';

        for (let y = 0; y < world.tiles.length; y++) {
            for (let x = 0; x < world.tiles[y].length; x++) {
                const tile = world.tiles[y][x];
                const tileElement = document.createElement('div');
                tileElement.className = `world-tile tile-${tile.type}`;
                tileElement.textContent = tile.symbol;
                tileElement.style.gridColumn = x + 1;
                tileElement.style.gridRow = y + 1;
                
                worldGrid.appendChild(tileElement);
            }
        }

        // Position player
        this.playerPosition = { ...world.playerStart };
        const player = document.getElementById('player');
        if (player) {
            player.style.left = `${this.playerPosition.x * 5}%`;
            player.style.top = `${this.playerPosition.y * 6.67}%`;
        }

        this.checkForInteractions();
    }

    loadLevel(level) {
        this.currentLevel = level;
        this.renderWorld();
        
        // Update level title
        const levelTitle = document.getElementById('current-level');
        if (levelTitle) {
            const titles = {
                'jungle': 'Jungle Adventure',
                'desert': 'Desert Quest',
                'mountains': 'Mountain Peak',
                'ocean': 'Ocean Depths'
            };
            levelTitle.textContent = titles[level] || 'Adventure';
        }
    }

    showWorld() {
        const levelMap = document.getElementById('level-map');
        const worldView = document.getElementById('world-view');
        const levelContent = document.getElementById('level-content');

        if (levelMap) levelMap.classList.add('hidden');
        if (levelContent) levelContent.classList.add('hidden');
        if (worldView) worldView.classList.remove('hidden');
    }

    showMap() {
        const levelMap = document.getElementById('level-map');
        const worldView = document.getElementById('world-view');
        const levelContent = document.getElementById('level-content');

        if (levelMap) levelMap.classList.remove('hidden');
        if (worldView) worldView.classList.add('hidden');
        if (levelContent) levelContent.classList.add('hidden');
    }
}

// Global world controller instance
let worldController;

