class Player {
    constructor() {
        this.x = GAME_CONSTANTS.CANVAS_WIDTH / 2;
        this.y = GAME_CONSTANTS.CANVAS_HEIGHT / 2;
        this.radius = 20;
        this.speed = 5;
        this.health = 100;
        this.score = 0;
        this.weapons = {
            PISTOL: new Weapon('PISTOL'),
            RIFLE: new Weapon('RIFLE'),
            SHOTGUN: new Weapon('SHOTGUN')
        };
        this.currentWeapon = this.weapons.PISTOL;
        this.rotationAngle = 0;
        this.powerUps = {};
    }

    update(keys, mouseX, mouseY) {
        // Movement
        if (keys['w']) this.y -= this.speed;
        if (keys['s']) this.y += this.speed;
        if (keys['a']) this.x -= this.speed;
        if (keys['d']) this.x += this.speed;

        // Rotation
        this.rotationAngle = Math.atan2(mouseY - this.y, mouseX - this.x);

        // Boundary checking
        this.x = Math.max(this.radius, Math.min(GAME_CONSTANTS.CANVAS_WIDTH - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(GAME_CONSTANTS.CANVAS_HEIGHT - this.radius, this.y));
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotationAngle);

        // Draw player body
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#4CAF50';
        ctx.fill();

        // Draw weapon
        ctx.fillStyle = '#333';
        ctx.fillRect(0, -5, 30, 10);

        ctx.restore();
    }
    switchWeapon(num){
        return this.currentWeapon = num
    }
    takeDamage(damage) {
        this.health = Math.max(0, this.health - damage);
        return this.health <= 0;
    }

    addPowerUp(type) {
        const config = GAME_CONSTANTS.POWERUPS[type];
        this.powerUps[type] = {
            startTime: Date.now(),
            duration: config.duration,
            effect: config.effect
        };

        if (type === 'HEALTH') {
            this.health = Math.min(100, this.health + config.effect);
        }

        setTimeout(() => {
            delete this.powerUps[type];
        }, config.duration);
    }
}
