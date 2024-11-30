// class Game {
//     constructor() {
//         this.canvas = document.getElementById('gameCanvas');
//         this.ctx = this.canvas.getContext('2d');
//         this.canvas.width = GAME_CONSTANTS.CANVAS_WIDTH;
//         this.canvas.height = GAME_CONSTANTS.CANVAS_HEIGHT;
        
//         this.player = new Player();
//         this.levelManager = new LevelManager();
//         this.audioManager = new AudioManager();
//         this.bullets = [];
//         this.keys = {};
//         this.mouseX = 0;
//         this.mouseY = 0;
//         this.gameOver = false;

//         this.environment = new Environment();
//         this.levelManager = new LevelManager(this.environment);
//         this.lastRoom = null;

        
//         this.setupEventListeners();
//         this.startGame();
//     }

//     setupEventListeners() {
//         document.addEventListener('keydown', (e) => this.keys[e.key] = true);
//         document.addEventListener('keyup', (e) => this.keys[e.key] = false);
        
//         this.canvas.addEventListener('mousemove', (e) => {
//             const rect = this.canvas.getBoundingClientRect();
//             this.mouseX = e.clientX - rect.left;
//             this.mouseY = e.clientY - rect.top;
//         });

//         this.canvas.addEventListener('click', () => this.shoot());
        
//         document.addEventListener('keypress', (e) => {
//             if (e.key === 'r') this.player.currentWeapon.reload();
//             if (e.key === '1') this.player.currentWeapon = this.player.weapons.PISTOL;
//             if (e.key === '2') this.player.currentWeapon = this.player.weapons.RIFLE;
//             if (e.key === '3') this.player.currentWeapon = this.player.weapons.SHOTGUN;
//         });
//     }

//     shoot() {
//         if (this.player.currentWeapon.shoot()) {
//             this.audioManager.play('shoot');
            
//             if (this.player.currentWeapon.config.name === 'SHOTGUN') {
//                 // Shotgun spread
//                 for (let i = -2; i <= 2; i++) {
//                     const spread = i * 0.2;
//                     const angle = this.player.rotationAngle + spread;
//                     this.bullets.push({
//                         x: this.player.x,
//                         y: this.player.y,
//                         angle: angle,
//                         speed: 10,
//                         damage: this.player.currentWeapon.config.damage / 5
//                     });
//                 }
//             } else {
//                 this.bullets.push({
//                     x: this.player.x,
//                     y: this.player.y,
//                     angle: this.player.rotationAngle,
//                     speed: 10,
//                     damage: this.player.currentWeapon.config.damage
//                 });
//             }
//         }
//     }

//     update() {
//         if (this.gameOver) return;

//         // this.player.update(this.keys, this.mouseX, this.mouseY);
//         const nextX = this.player.x + (this.keys['d'] ? this.player.speed : (this.keys['a'] ? -this.player.speed : 0));
//         const nextY = this.player.y + (this.keys['s'] ? this.player.speed : (this.keys['w'] ? -this.player.speed : 0));

//         if (!this.environment.checkCollision(nextX, this.player.y, this.player.radius)) {
//             this.player.x = nextX;
//         }
//         if (!this.environment.checkCollision(this.player.x, nextY, this.player.radius)) {
//             this.player.y = nextY;
//         }

//         // Rooms and New things
//         const currentRoom = this.levelManager.getCurrentRoom(this.player.x, this.player.y);
        
//         if (currentRoom && currentRoom[0] !== this.lastRoom) {
//             this.lastRoom = currentRoom[0];
//             this.levelManager.spawnEnemiesInRoom(currentRoom[0]);
//         }

//         if (currentRoom && this.levelManager.checkRoomCleared(currentRoom[0])) {
//             this.player.score += 1000; // Room clear bonus
//             this.audioManager.play('roomClear');
            
//             // Check if all rooms are cleared
//             if (Object.values(this.levelManager.rooms).every(room => room.cleared)) {
//                 this.levelManager.nextLevel();
//                 this.audioManager.play('levelUp');
//             }
//         }
        
//         // Update bullets
//         this.bullets = this.bullets.filter(bullet => {
//             bullet.x += Math.cos(bullet.angle) * bullet.speed;
//             bullet.y += Math.sin(bullet.angle) * bullet.speed;
//             return bullet.x > 0 && bullet.x < this.canvas.width && 
//                    bullet.y > 0 && bullet.y < this.canvas.height;
//         });

//         // Update enemies
//         this.levelManager.activeEnemies.forEach(enemy => {
//             enemy.update(this.player);
            
//             // Check collision with player
//             const dx = enemy.x - this.player.x;
//             const dy = enemy.y - this.player.y;
//             const distance = Math.sqrt(dx * dx + dy * dy);
            
//             if (distance < enemy.size + this.player.radius) {
//                 if (this.player.takeDamage(enemy.config.damage)) {
//                     this.gameOver = true;
//                 }
//                 this.audioManager.play('playerDamage');
//             }
//         });

//         // Check bullet hits
//         this.bullets.forEach(bullet => {
//             this.levelManager.activeEnemies = this.levelManager.activeEnemies.filter(enemy => {
//                 const dx = bullet.x - enemy.x;
//                 const dy = bullet.y - enemy.y;
//                 const distance = Math.sqrt(dx * dx + dy * dy);
                
//                 if (distance < enemy.size) {
//                     if (enemy.takeDamage(bullet.damage)) {
//                         this.player.score += enemy.config.points;
//                         this.audioManager.play('enemyDeath');
//                         return false;
//                     }
//                     this.audioManager.play('hit');
//                     return true;
//                 }
//                 return true;
//             });
//         });

//         // Check power-up collection
//         this.levelManager.powerUps = this.levelManager.powerUps.filter(powerUp => {
//             const dx = powerUp.x - this.player.x;
//             const dy = powerUp.y - this.player.y;
//             const distance = Math.sqrt(dx * dx + dy * dy);
            
//             if (distance < powerUp.radius + this.player.radius) {
//                 this.player.addPowerUp(powerUp.type);
//                 this.audioManager.play('pickup');
//                 return false;
//             }
//             return true;
//         });

//         // Check level completion
//         if (this.levelManager.activeEnemies.length === 0) {
//             this.levelManager.nextLevel();
//             this.audioManager.play('levelUp');
//         }
//     }

//     draw() {
//         // Clear canvas
//         this.ctx.fillStyle = '#1a1a1a';
//         this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

//         // Draw environment first
//         this.environment.draw(this.ctx, this.player.x, this.player.y);

//         // Draw grid for better depth perception
//         this.drawGrid();

//         // Draw game elements
//         this.levelManager.powerUps.forEach(powerUp => powerUp.draw(this.ctx));
//         this.player.draw(this.ctx);
//         this.levelManager.activeEnemies.forEach(enemy => enemy.draw(this.ctx));
        
//         // Draw bullets
//         this.ctx.fillStyle = '#fff';
//         this.bullets.forEach(bullet => {
//             this.ctx.beginPath();
//             this.ctx.arc(bullet.x, bullet.y, 3, 0, Math.PI * 2);
//             this.ctx.fill();
//         });

//         // Update HUD
//         this.updateHUD();
//     }

//     drawGrid() {
//         this.ctx.strokeStyle = '#333';
//         this.ctx.lineWidth = 1;
        
//         for (let x = 0; x < this.canvas.width; x += 50) {
//             this.ctx.beginPath();
//             this.ctx.moveTo(x, 0);
//             this.ctx.lineTo(x, this.canvas.height);
//             this.ctx.stroke();
//         }
        
//         for (let y = 0; y < this.canvas.height; y += 50) {
//             this.ctx.beginPath();
//             this.ctx.moveTo(0, y);
//             this.ctx.lineTo(this.canvas.width, y);
//             this.ctx.stroke();
//         }
//     }

//     updateHUD() {
//         const healthBar = document.querySelector('.health-fill');
//         const healthText = document.querySelector('.health-text');
//         const ammoCounter = document.querySelector('.ammo-counter');
//         const scoreElement = document.querySelector('.score');
//         const levelElement = document.querySelector('.level');

//         healthBar.style.width = `${this.player.health}%`;
//         healthText.textContent = Math.ceil(this.player.health);
//         ammoCounter.textContent = `${this.player.currentWeapon.currentAmmo}/${this.player.currentWeapon.totalAmmo}`;
//         scoreElement.textContent = `Score: ${this.player.score}`;
//         levelElement.textContent = `Level: ${this.levelManager.currentLevel}`;
//     }

//     startGame() {
//         this.audioManager.play('background');
//         // this.levelManager.startLevel();
//         this.gameLoop();
//     }

//     gameLoop() {
//         this.update();
//         this.draw();
        
//         if (!this.gameOver) {
//             requestAnimationFrame(() => this.gameLoop());
//         } else {
//             this.showGameOver();
//         }
//     }

//     showGameOver() {
//         this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
//         this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
//         this.ctx.fillStyle = '#fff';
//         this.ctx.font = '48px Arial';
//         this.ctx.textAlign = 'center';
//         this.ctx.fillText('GAME OVER', this.canvas.width/2, this.canvas.height/2);
//         this.ctx.font = '24px Arial';
//         this.ctx.fillText(`Final Score: ${this.player.score}`, this.canvas.width/2, this.canvas.height/2 + 50);
//         this.ctx.fillText('Press SPACE to restart', this.canvas.width/2, this.canvas.height/2 + 100);

//         document.addEventListener('keydown', (e) => {
//             if (e.code === 'Space') {
//                 window.location.reload();
//             }
//         });
//     }
// }

// // Start the game when the window loads
// window.onload = () => {
//     new Game();
// };

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = GAME_CONSTANTS.CANVAS_WIDTH;
        this.canvas.height = GAME_CONSTANTS.CANVAS_HEIGHT;
        
        this.environment = new Environment();
        this.player = new Player();
        this.levelManager = new LevelManager(this.environment);
        this.audioManager = new AudioManager();
        
        this.bullets = [];
        this.particles = [];
        this.keys = {};
        this.mouseX = 0;
        this.mouseY = 0;
        this.gameState = 'playing'; // menu, playing, paused, gameOver
        this.score = 0;
        this.frameCount = 0;
        
        this.setupEventListeners();
        this.startGameLoop();
    }

    setupEventListeners() {
        // Mouse movement
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });

        // Mouse click for shooting
        this.canvas.addEventListener('mousedown', (e) => {
            if (this.gameState === 'playing') {
                this.shoot();
            }
        });

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            if (e.key === 'p') this.togglePause();
            if (e.key === 'r') this.player.currentWeapon.reload();
            if (e.key >= '1' && e.key <= '3') this.player.switchWeapon(parseInt(e.key) - 1);
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });

        // Menu buttons
        document.getElementById('startGame').addEventListener('click', () => {
            this.startGame();
        });
    }

    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.player = new Player();
        this.levelManager = new LevelManager(this.environment);
        this.bullets = [];
        this.particles = [];
        this.audioManager.play('background');
    }

    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
        }
    }

    shoot() {
        if (this.player.currentWeapon.shoot()) {
            const weapon = this.player.currentWeapon;
            this.audioManager.play('shoot');

            if (weapon.config.name === 'SHOTGUN') {
                for (let i = -2; i <= 2; i++) {
                    const spread = i * 0.2;
                    const angle = this.player.rotationAngle + spread;
                    this.createBullet(angle, weapon.config.damage / 5);
                }
            } else {
                this.createBullet(this.player.rotationAngle, weapon.config.damage);
            }
        }
    }

    createBullet(angle, damage) {
        this.bullets.push({
            x: this.player.x + Math.cos(angle) * 30,
            y: this.player.y + Math.sin(angle) * 30,
            angle: angle,
            speed: 15,
            damage: damage,
            penetration: this.player.currentWeapon.config.name === 'RIFLE' ? 2 : 1
        });
    }

    update() {
        if (this.gameState !== 'playing') return;

        this.frameCount++;
        
        // Update player
        this.player.update(this.keys, this.mouseX, this.mouseY);
        const nextX = this.player.x + (this.keys['d'] ? this.player.speed : (this.keys['a'] ? -this.player.speed : 0));
        const nextY = this.player.y + (this.keys['s'] ? this.player.speed : (this.keys['w'] ? -this.player.speed : 0));

        if (!this.environment.checkCollision(nextX, this.player.y, this.player.radius)) {
            this.player.x = nextX;
        }
        if (!this.environment.checkCollision(this.player.x, nextY, this.player.radius)) {
            this.player.y = nextY;
        }

        // Update level manager
        this.levelManager.update(this.player);

        // Rooms and New things
        const currentRoom = this.levelManager.getCurrentRoom(this.player.x, this.player.y);
        
        if (currentRoom && currentRoom[0] !== this.lastRoom) {
            this.lastRoom = currentRoom[0];
            this.levelManager.spawnEnemiesInRoom(currentRoom[0]);
        }

        if (currentRoom && this.levelManager.checkRoomCleared(currentRoom[0])) {
            this.player.score += 1000; // Room clear bonus
            this.audioManager.play('roomClear');
            
            // Check if all rooms are cleared
            if (Object.values(this.levelManager.rooms).every(room => room.cleared)) {
                this.levelManager.nextLevel();
                this.audioManager.play('levelUp');
            }
        }

        // Update bullets
        this.updateBullets();
        
        // Update enemies
        this.updateEnemies();
        
        // Update particles
        this.updateParticles();
        
        // Update power-ups
        this.updatePowerUps();

        // Check level completion
        if (this.levelManager.isLevelComplete()) {
            this.levelManager.nextLevel();
            this.score += 5000;
            this.audioManager.play('levelUp');
        }

        // Check game over
        if (this.player.health <= 0) {
            this.gameOver();
        }
    }

    updateBullets() {
        this.bullets = this.bullets.filter(bullet => {
            bullet.x += Math.cos(bullet.angle) * bullet.speed;
            bullet.y += Math.sin(bullet.angle) * bullet.speed;

            // Wall collision
            if (this.environment.checkCollision(bullet.x, bullet.y, 2)) {
                this.createParticles(bullet.x, bullet.y, '#ffff00', 5);
                return false;
            }

            // Check if bullet is out of bounds
            if (bullet.x < 0 || bullet.x > this.canvas.width || 
                bullet.y < 0 || bullet.y > this.canvas.height) {
                return false;
            }

            return true;
        });
    }

    updateEnemies() {
        this.levelManager.activeEnemies.forEach(enemy => {
            enemy.update(this.player);

            // Check bullet hits
            this.bullets.forEach(bullet => {
                const dx = bullet.x - enemy.x;
                const dy = bullet.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < enemy.size) {
                    enemy.takeDamage(bullet.damage);
                    this.createParticles(bullet.x, bullet.y, '#ff0000', 8);
                    bullet.penetration--;
                    
                    if (bullet.penetration <= 0) {
                        this.bullets = this.bullets.filter(b => b !== bullet);
                    }

                    if (enemy.health <= 0) {
                        this.score += enemy.config.points;
                        this.audioManager.play('enemyDeath');
                        this.createParticles(enemy.x, enemy.y, enemy.color, 15);
                        this.levelManager.activeEnemies = this.levelManager.activeEnemies.filter(e => e !== enemy);
                    }
                }
            });
        });
    }

    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.life -= 1;
            particle.x += particle.vx;
            particle.y += particle.vy;
            return particle.life > 0;
        });
    }

    updatePowerUps() {
        this.levelManager.powerUps = this.levelManager.powerUps.filter(powerUp => {
            const dx = powerUp.x - this.player.x;
            const dy = powerUp.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.player.radius + powerUp.radius) {
                this.player.addPowerUp(powerUp.type);
                this.audioManager.play('pickup');
                return false;
            }
            return true;
        });
    }

    createParticles(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 2;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: color,
                life: 30
            });
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw environment
        this.environment.draw(this.ctx, this.player.x, this.player.y);

        // Draw power-ups
        this.levelManager.powerUps.forEach(powerUp => powerUp.draw(this.ctx));

        // Draw enemies
        this.levelManager.activeEnemies.forEach(enemy => enemy.draw(this.ctx));

        // Draw player
        this.player.draw(this.ctx);

        // Draw bullets
        this.ctx.fillStyle = '#ffff00';
        this.bullets.forEach(bullet => {
            this.ctx.beginPath();
            this.ctx.arc(bullet.x, bullet.y, 2, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.life / 30;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        });

        //  Draw grid for better depth perception
        this.drawGrid();

        // Draw HUD
        this.drawHUD();

        // Draw game state overlays
        if (this.gameState === 'paused') this.drawPauseScreen();
        if (this.gameState === 'gameOver') this.drawGameOverScreen();
        if (this.gameState === 'menu') this.drawMenuScreen();
    }

    drawGrid() {
                this.ctx.strokeStyle = '#333';
                this.ctx.lineWidth = 1;
                
                for (let x = 0; x < this.canvas.width; x += 50) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(x, 0);
                    this.ctx.lineTo(x, this.canvas.height);
                    this.ctx.stroke();
                }
                
                for (let y = 0; y < this.canvas.height; y += 50) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, y);
                    this.ctx.lineTo(this.canvas.width, y);
                    this.ctx.stroke();
                }
            }

    drawHUD() {
        // Health bar
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(20, 20, 200, 20);
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(20, 20, this.player.health * 2, 20);

        // Ammo counter
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(
            `${this.player.currentWeapon.currentAmmo}/${this.player.currentWeapon.totalAmmo}`,
            20, 60
        );

        // Score
        this.ctx.fillText(`Score: ${this.score}`, 20, 90);

        // Level
        this.ctx.fillText(`Level: ${this.levelManager.currentLevel}`, 20, 120);

        // Room progress
        const progress = this.levelManager.getRoomProgress();
        this.ctx.fillText(
            `Rooms Cleared: ${progress.cleared}/${progress.total}`,
            20, 150
        );
    }

    drawPauseScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSED', this.canvas.width/2, this.canvas.height/2);
        this.ctx.font = '24px Arial';
        this.ctx.fillText('Press P to resume', this.canvas.width/2, this.canvas.height/2 + 50);
    }

    drawGameOverScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.canvas.width/2, this.canvas.height/2);
        this.ctx.font = '24px Arial';
        this.ctx.fillText(
            `Final Score: ${this.score}`,
            this.canvas.width/2,
            this.canvas.height/2 + 50
        );
        this.ctx.fillText(
            'Press SPACE to restart',
            this.canvas.width/2,
            this.canvas.height/2 + 100
        );
    }

    drawMenuScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('ROOM CLEARING FPS', this.canvas.width/2, this.canvas.height/3);
    }

    gameOver() {
        this.gameState = 'gameOver';
        this.audioManager.play('gameOver');
    }

    startGameLoop() {
        const gameLoop = () => {
            this.update();
            this.draw();
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }
}

// Start the game when the window loads
window.onload = () => {
    new Game();
};
