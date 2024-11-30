class PowerUp {
    constructor(type, x, y) {
        this.type = type;
        this.config = GAME_CONSTANTS.POWERUPS[type];
        this.x = x;
        this.y = y;
        this.radius = 15;
        this.pulseEffect = 0;
        this.pulseDirection = 1;
    }
    
    update() {
        this.pulseEffect += 0.1 * this.pulseDirection;
        if (this.pulseEffect >= 1 || this.pulseEffect <= 0) {
            this.pulseDirection *= -1;
        }
    }
    
    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + (this.pulseEffect * 5), 0, Math.PI * 2);
        ctx.fillStyle = this.getColor();
        ctx.fill();
        ctx.restore();
    }
    
    getColor() {
        switch(this.type) {
            case 'HEALTH': return '#ff0000';
            case 'SPEED': return '#00ff00';
            case 'DAMAGE': return '#ffff00';
            default: return '#ffffff';
        }
    }
}
