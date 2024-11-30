const GAME_CONSTANTS = {
    CANVAS_WIDTH: window.innerWidth,
    CANVAS_HEIGHT: window.innerHeight,
    
    WEAPONS: {
        PISTOL: {
            name: 'Pistol',
            damage: 20,
            fireRate: 400,
            ammoCapacity: 12,
            reloadTime: 1000
        },
        RIFLE: {
            name: 'Rifle',
            damage: 30,
            fireRate: 100,
            ammoCapacity: 30,
            reloadTime: 2000
        },
        SHOTGUN: {
            name: 'Shotgun',
            damage: 80,
            fireRate: 800,
            ammoCapacity: 6,
            reloadTime: 2500
        }
    },
    
    ENEMY_TYPES: {
        BASIC: {
            health: 50,
            speed: 2,
            damage: 10,
            points: 100
        },
        FAST: {
            health: 30,
            speed: 4,
            damage: 5,
            points: 150
        },
        TANK: {
            health: 200,
            speed: 1,
            damage: 20,
            points: 300
        }
    },
    
    POWERUPS: {
        HEALTH: {
            effect: 50,
            duration: 0
        },
        SPEED: {
            effect: 2,
            duration: 5000
        },
        DAMAGE: {
            effect: 2,
            duration: 8000
        }
    }
};
