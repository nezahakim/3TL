// // class LevelManager {
// //     constructor() {
// //         this.currentLevel = 1;
// //         this.enemiesPerLevel = 5;
// //         this.enemySpawnInterval = null;
// //         this.activeEnemies = [];
// //         this.powerUps = [];
// //     }

// //     startLevel() {
// //         this.stopSpawning();
// //         this.enemySpawnInterval = setInterval(() => {
// //             if (this.activeEnemies.length < this.enemiesPerLevel + Math.floor(this.currentLevel * 1.5)) {
// //                 this.spawnEnemy();
// //             }
// //         }, 2000 - (this.currentLevel * 100));

// //         // Spawn power-up every 15 seconds
// //         setInterval(() => this.spawnPowerUp(), 15000);
// //     }

// //     spawnEnemy() {
// //         const types = ['BASIC', 'FAST', 'TANK'];
// //         const randomType = types[Math.floor(Math.random() * types.length)];
// //         const spawnPoint = this.getRandomSpawnPoint();
// //         this.activeEnemies.push(new Enemy(randomType, spawnPoint.x, spawnPoint.y));
// //     }

// //     spawnPowerUp() {
// //         const types = ['HEALTH', 'SPEED', 'DAMAGE'];
// //         const randomType = types[Math.floor(Math.random() * types.length)];
// //         const x = Math.random() * (GAME_CONSTANTS.CANVAS_WIDTH - 100) + 50;
// //         const y = Math.random() * (GAME_CONSTANTS.CANVAS_HEIGHT - 100) + 50;
// //         this.powerUps.push(new PowerUp(randomType, x, y));
// //     }

// //     getRandomSpawnPoint() {
// //         const side = Math.floor(Math.random() * 4);
// //         switch(side) {
// //             case 0: return { x: Math.random() * GAME_CONSTANTS.CANVAS_WIDTH, y: -50 };
// //             case 1: return { x: GAME_CONSTANTS.CANVAS_WIDTH + 50, y: Math.random() * GAME_CONSTANTS.CANVAS_HEIGHT };
// //             case 2: return { x: Math.random() * GAME_CONSTANTS.CANVAS_WIDTH, y: GAME_CONSTANTS.CANVAS_HEIGHT + 50 };
// //             case 3: return { x: -50, y: Math.random() * GAME_CONSTANTS.CANVAS_HEIGHT };
// //         }
// //     }

// //     stopSpawning() {
// //         if (this.enemySpawnInterval) {
// //             clearInterval(this.enemySpawnInterval);
// //         }
// //     }

// //     nextLevel() {
// //         this.currentLevel++;
// //         this.enemiesPerLevel += 2;
// //         this.startLevel();
// //     }
// // }


// class LevelManager {
//     constructor(environment) {
//         this.environment = environment;
//         this.currentLevel = 1;
//         this.activeEnemies = [];
//         this.powerUps = [];
//         this.rooms = {
//             livingRoom: {
//                 bounds: { x: 100, y: 100, width: 400, height: 400 },
//                 cleared: false,
//                 enemyCount: 3
//             },
//             kitchen: {
//                 bounds: { x: 600, y: 100, width: 300, height: 300 },
//                 cleared: false,
//                 enemyCount: 2
//             },
//             bedroom: {
//                 bounds: { x: 100, y: 600, width: 400, height: 300 },
//                 cleared: false,
//                 enemyCount: 2
//             }
//         };
//     }

//     getCurrentRoom(playerX, playerY) {
//         return Object.entries(this.rooms).find(([name, room]) => {
//             return playerX >= room.bounds.x && 
//                    playerX <= room.bounds.x + room.bounds.width &&
//                    playerY >= room.bounds.y && 
//                    playerY <= room.bounds.y + room.bounds.height;
//         });
//     }

//     spawnEnemiesInRoom(roomName) {
//         const room = this.rooms[roomName];
//         if (room.cleared) return;

//         for (let i = 0; i < room.enemyCount; i++) {
//             const spawnPoint = this.getValidSpawnPoint(room.bounds);
//             if (spawnPoint) {
//                 const types = ['BASIC', 'FAST', 'TANK'];
//                 const randomType = types[Math.floor(Math.random() * types.length)];
//                 this.activeEnemies.push(new Enemy(randomType, spawnPoint.x, spawnPoint.y, this.environment));
//             }
//         }
//     }

//     getValidSpawnPoint(bounds) {
//         let attempts = 0;
//         const maxAttempts = 10;

//         while (attempts < maxAttempts) {
//             const x = bounds.x + Math.random() * bounds.width;
//             const y = bounds.y + Math.random() * bounds.height;
            
//             // Check if spawn point is not colliding with walls or furniture
//             if (!this.environment.checkCollision(x, y, 25)) {
//                 return { x, y };
//             }
//             attempts++;
//         }
//         return null;
//     }

//     checkRoomCleared(roomName) {
//         const room = this.rooms[roomName];
//         const enemiesInRoom = this.activeEnemies.filter(enemy => 
//             enemy.x >= room.bounds.x && 
//             enemy.x <= room.bounds.x + room.bounds.width &&
//             enemy.y >= room.bounds.y && 
//             enemy.y <= room.bounds.y + room.bounds.height
//         );

//         if (enemiesInRoom.length === 0 && !room.cleared) {
//             room.cleared = true;
//             return true;
//         }
//         return false;
//     }

//     nextLevel() {
//         this.currentLevel++;
//         Object.values(this.rooms).forEach(room => {
//             room.cleared = false;
//             room.enemyCount = Math.min(room.enemyCount + 1, 5);
//         });
//     }
// }


class LevelManager {
    constructor(environment) {
        this.environment = environment;
        this.currentLevel = 1;
        this.activeEnemies = [];
        this.powerUps = [];
        this.rooms = {
            livingRoom: {
                bounds: { x: 100, y: 100, width: 400, height: 400 },
                cleared: false,
                enemyCount: 3,
                spawnPoints: [
                    { x: 150, y: 150 },
                    { x: 400, y: 150 },
                    { x: 250, y: 400 }
                ]
            },
            kitchen: {
                bounds: { x: 600, y: 100, width: 300, height: 300 },
                cleared: false,
                enemyCount: 2,
                spawnPoints: [
                    { x: 650, y: 150 },
                    { x: 850, y: 300 }
                ]
            },
            bedroom: {
                bounds: { x: 100, y: 600, width: 400, height: 300 },
                cleared: false,
                enemyCount: 2,
                spawnPoints: [
                    { x: 150, y: 700 },
                    { x: 400, y: 800 }
                ]
            }
        };
        this.currentRoom = null;
        this.levelRewards = {
            clearBonus: 1000,
            enemyKill: 100,
            powerUpSpawnChance: 0.3
        };
    }

    getCurrentRoom(playerX, playerY) {
        for (const [roomName, room] of Object.entries(this.rooms)) {
            if (playerX >= room.bounds.x && 
                playerX <= room.bounds.x + room.bounds.width &&
                playerY >= room.bounds.y && 
                playerY <= room.bounds.y + room.bounds.height) {
                return [roomName, room];
            }
        }
        return null;
    }

    spawnEnemiesInRoom(roomName) {
        const room = this.rooms[roomName];
        if (room.cleared) return;

        const availableSpawnPoints = [...room.spawnPoints];
        const enemyCount = room.enemyCount + Math.floor(this.currentLevel / 2);

        for (let i = 0; i < enemyCount; i++) {
            if (availableSpawnPoints.length === 0) break;

            const spawnIndex = Math.floor(Math.random() * availableSpawnPoints.length);
            const spawnPoint = availableSpawnPoints.splice(spawnIndex, 1)[0];

            const types = ['BASIC', 'FAST', 'TANK'];
            const typeWeights = [0.5, 0.3, 0.2];
            const randomType = this.getRandomTypeByWeight(types, typeWeights);

            this.activeEnemies.push(
                new Enemy(randomType, spawnPoint.x, spawnPoint.y, this.environment)
            );
        }
    }

    getRandomTypeByWeight(types, weights) {
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        
        for (let i = 0; i < types.length; i++) {
            if (random < weights[i]) return types[i];
            random -= weights[i];
        }
        return types[0];
    }

    checkRoomCleared(roomName) {
        const room = this.rooms[roomName];
        if (room.cleared) return false;

        const enemiesInRoom = this.activeEnemies.filter(enemy => 
            enemy.x >= room.bounds.x && 
            enemy.x <= room.bounds.x + room.bounds.width &&
            enemy.y >= room.bounds.y && 
            enemy.y <= room.bounds.y + room.bounds.height
        );

        if (enemiesInRoom.length === 0) {
            room.cleared = true;
            this.spawnRoomRewards(room);
            return true;
        }
        return false;
    }

    spawnRoomRewards(room) {
        if (Math.random() < this.levelRewards.powerUpSpawnChance) {
            const x = room.bounds.x + Math.random() * room.bounds.width;
            const y = room.bounds.y + Math.random() * room.bounds.height;
            const types = ['HEALTH', 'SPEED', 'DAMAGE'];
            const randomType = types[Math.floor(Math.random() * types.length)];
            
            this.powerUps.push(new PowerUp(randomType, x, y));
        }
    }

    nextLevel() {
        this.currentLevel++;
        Object.values(this.rooms).forEach(room => {
            room.cleared = false;
            room.enemyCount = Math.min(
                Math.floor(room.enemyCount * 1.5), 
                8
            );
        });

        this.levelRewards.clearBonus += 500;
        this.levelRewards.enemyKill += 50;
        this.levelRewards.powerUpSpawnChance = Math.min(
            this.levelRewards.powerUpSpawnChance + 0.1, 
            0.7
        );
    }

    isLevelComplete() {
        return Object.values(this.rooms).every(room => room.cleared);
    }

    getRoomProgress() {
        const clearedRooms = Object.values(this.rooms).filter(room => room.cleared).length;
        const totalRooms = Object.values(this.rooms).length;
        return {
            cleared: clearedRooms,
            total: totalRooms,
            percentage: (clearedRooms / totalRooms) * 100
        };
    }

    update(player) {
        const currentRoom = this.getCurrentRoom(player.x, player.y);
        if (currentRoom && currentRoom[0] !== this.currentRoom) {
            this.currentRoom = currentRoom[0];
            this.spawnEnemiesInRoom(this.currentRoom);
        }
    }
}
