class Enemy {
    constructor(type, x, y, environment) {
        this.type = type;
        this.config = GAME_CONSTANTS.ENEMY_TYPES[type];
        this.x = x;
        this.y = y;
        this.health = this.config.health;
        this.speed = this.config.speed;
        this.size = type === 'TANK' ? 40 : 25;
        this.color = this.getEnemyColor();
        this.environment = environment;
        this.pathfinding = new Pathfinding(environment);
        this.lastPathUpdate = 0;
        this.currentPath = null;
        this.pathUpdateInterval = 500;
        this.state = 'chase'; // chase, attack, cover
        this.lastAttack = 0;
        this.attackCooldown = 1000;
    }

    getEnemyColor() {
        switch(this.type) {
            case 'BASIC': return '#ff4444';
            case 'FAST': return '#44ff44';
            case 'TANK': return '#8844ff';
            default: return '#ff0000';
        }
    }

    update(player) {
        const now = Date.now();
        const distanceToPlayer = Math.hypot(player.x - this.x, player.y - this.y);

        // Update path periodically
        if (now - this.lastPathUpdate > this.pathUpdateInterval) {
            this.currentPath = this.pathfinding.findPath(
                {x: this.x, y: this.y},
                {x: player.x, y: player.y}
            );
            this.lastPathUpdate = now;
        }

        // State machine
        if (distanceToPlayer < 150) {
            this.state = 'attack';
        } else {
            this.state = 'chase';
        }

        switch(this.state) {
            case 'chase':
                this.chase();
                break;
            case 'attack':
                this.attack(player);
                break;
        }
    }

    chase() {
        if (this.currentPath && this.currentPath.length > 1) {
            const nextPoint = this.currentPath[1];
            const angle = Math.atan2(nextPoint.y - this.y, nextPoint.x - this.x);
            const nextX = this.x + Math.cos(angle) * this.speed;
            const nextY = this.y + Math.sin(angle) * this.speed;

            if (!this.environment.checkCollision(nextX, this.y, this.size)) {
                this.x = nextX;
            }
            if (!this.environment.checkCollision(this.x, nextY, this.size)) {
                this.y = nextY;
            }
        }
    }

    attack(player) {
        const now = Date.now();
        if (now - this.lastAttack > this.attackCooldown) {
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                player.takeDamage(this.config.damage);
                this.lastAttack = now;
            }
        }
    }

    draw(ctx) {
        ctx.save();
        
        // Draw enemy body
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Draw health bar
        const healthBarWidth = this.size * 2;
        const healthPercent = this.health / this.config.health;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x - healthBarWidth/2, this.y - this.size - 10, healthBarWidth, 5);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x - healthBarWidth/2, this.y - this.size - 10, healthBarWidth * healthPercent, 5);
        
        ctx.restore();
    }

    takeDamage(damage) {
        this.health -= damage;
        return this.health <= 0;
    }
}
