class Environment {
    constructor() {
        this.walls = [
            // Living Room
            { x: 100, y: 100, width: 400, height: 20, type: 'wall' },  // North wall
            { x: 100, y: 500, width: 400, height: 20, type: 'wall' },  // South wall
            { x: 100, y: 100, width: 20, height: 400, type: 'wall' },  // West wall
            { x: 500, y: 100, width: 20, height: 400, type: 'wall' },  // East wall
            
            // Furniture
            { x: 150, y: 150, width: 100, height: 60, type: 'sofa' },
            { x: 300, y: 200, width: 80, height: 80, type: 'table' },
            
            // Kitchen
            { x: 600, y: 100, width: 300, height: 20, type: 'wall' },
            { x: 600, y: 400, width: 300, height: 20, type: 'wall' },
            { x: 600, y: 100, width: 20, height: 300, type: 'wall' },
            { x: 900, y: 100, width: 20, height: 300, type: 'wall' },
            
            // Kitchen counters
            { x: 650, y: 150, width: 200, height: 40, type: 'counter' },
            
            // Bedroom
            { x: 100, y: 600, width: 400, height: 20, type: 'wall' },
            { x: 100, y: 900, width: 400, height: 20, type: 'wall' },
            { x: 100, y: 600, width: 20, height: 300, type: 'wall' },
            { x: 500, y: 600, width: 20, height: 300, type: 'wall' },
            
            // Bed
            { x: 150, y: 650, width: 120, height: 200, type: 'bed' }
        ];

        this.doors = [
            { x: 500, y: 250, width: 100, height: 20, rotation: 0 },
            { x: 700, y: 400, width: 100, height: 20, rotation: 0 }
        ];

        this.windows = [
            { x: 250, y: 100, width: 100, height: 10 },
            { x: 750, y: 100, width: 100, height: 10 }
        ];

        this.textures = {
            wall: '#8B4513',
            floor: '#DEB887',
            sofa: '#556B2F',
            table: '#8B4513',
            counter: '#696969',
            bed: '#4682B4'
        };

        this.lighting = {
            ambient: 0.3,
            sources: [
                { x: 300, y: 300, intensity: 1, radius: 200 },
                { x: 750, y: 250, intensity: 0.8, radius: 150 }
            ]
        };
    }

    draw(ctx, playerX, playerY) {
        // Draw floor
        ctx.fillStyle = this.textures.floor;
        ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);

        // Draw walls and furniture with shadows
        this.walls.forEach(wall => {
            ctx.save();
            ctx.fillStyle = this.textures[wall.type];
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 15;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
            ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
            ctx.restore();
        });

        // Draw lighting effects
        this.drawLighting(ctx, playerX, playerY);

        // Draw windows with reflection
        this.windows.forEach(window => {
            ctx.save();
            ctx.fillStyle = 'rgba(135, 206, 235, 0.5)';
            ctx.fillRect(window.x, window.y, window.width, window.height);
            // Add reflection effect
            const gradient = ctx.createLinearGradient(window.x, window.y, window.x, window.y + 20);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(window.x, window.y, window.width, window.height + 20);
            ctx.restore();
        });
    }

    drawLighting(ctx, playerX, playerY) {
        // Create dynamic lighting overlay
        const overlay = ctx.createRadialGradient(
            playerX, playerY, 0,
            playerX, playerY, 300
        );
        overlay.addColorStop(0, 'rgba(0, 0, 0, 0)');
        overlay.addColorStop(1, `rgba(0, 0, 0, ${1 - this.lighting.ambient})`);
        
        ctx.save();
        ctx.fillStyle = overlay;
        ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);
        ctx.restore();

        // Add light sources
        this.lighting.sources.forEach(light => {
            const gradient = ctx.createRadialGradient(
                light.x, light.y, 0,
                light.x, light.y, light.radius
            );
            gradient.addColorStop(0, `rgba(255, 255, 200, ${light.intensity})`);
            gradient.addColorStop(1, 'rgba(255, 255, 200, 0)');
            
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.fillStyle = gradient;
            ctx.fillRect(light.x - light.radius, light.y - light.radius, 
                        light.radius * 2, light.radius * 2);
            ctx.restore();
        });
    }

    checkCollision(x, y, radius) {
        return this.walls.some(wall => {
            const closestX = Math.max(wall.x, Math.min(x, wall.x + wall.width));
            const closestY = Math.max(wall.y, Math.min(y, wall.y + wall.height));
            
            const distanceX = x - closestX;
            const distanceY = y - closestY;
            
            return (distanceX * distanceX + distanceY * distanceY) < (radius * radius);
        });
    }
}
