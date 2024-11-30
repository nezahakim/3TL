class Pathfinding {
    constructor(environment) {
        this.environment = environment;
        this.gridSize = 20;
    }

    findPath(start, end) {
        const grid = this.createGrid();
        const openSet = [this.gridPosition(start)];
        const closedSet = new Set();
        const cameFrom = new Map();
        const gScore = new Map();
        const fScore = new Map();

        gScore.set(this.pointToKey(start), 0);
        fScore.set(this.pointToKey(start), this.heuristic(start, end));

        while (openSet.length > 0) {
            const current = this.getLowestFScore(openSet, fScore);
            if (this.isCloseEnough(current, end)) {
                return this.reconstructPath(cameFrom, current);
            }

            openSet.splice(openSet.indexOf(current), 1);
            closedSet.add(this.pointToKey(current));

            for (const neighbor of this.getNeighbors(current, grid)) {
                if (closedSet.has(this.pointToKey(neighbor))) continue;

                const tentativeGScore = gScore.get(this.pointToKey(current)) + 1;
                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                } else if (tentativeGScore >= gScore.get(this.pointToKey(neighbor))) {
                    continue;
                }

                cameFrom.set(this.pointToKey(neighbor), current);
                gScore.set(this.pointToKey(neighbor), tentativeGScore);
                fScore.set(this.pointToKey(neighbor), tentativeGScore + this.heuristic(neighbor, end));
            }
        }
        return null;
    }

    createGrid() {
        const grid = [];
        for (let x = 0; x < GAME_CONSTANTS.CANVAS_WIDTH; x += this.gridSize) {
            for (let y = 0; y < GAME_CONSTANTS.CANVAS_HEIGHT; y += this.gridSize) {
                if (!this.environment.checkCollision(x, y, this.gridSize/2)) {
                    grid.push({x, y});
                }
            }
        }
        return grid;
    }

    gridPosition(point) {
        return {
            x: Math.floor(point.x / this.gridSize) * this.gridSize,
            y: Math.floor(point.y / this.gridSize) * this.gridSize
        };
    }

    pointToKey(point) {
        return `${point.x},${point.y}`;
    }

    heuristic(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    getLowestFScore(set, scores) {
        return set.reduce((lowest, current) => 
            (scores.get(this.pointToKey(current)) < scores.get(this.pointToKey(lowest))) ? current : lowest
        );
    }

    isCloseEnough(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy) < this.gridSize;
    }

    getNeighbors(point, grid) {
        const directions = [
            {x: -this.gridSize, y: 0}, {x: this.gridSize, y: 0},
            {x: 0, y: -this.gridSize}, {x: 0, y: this.gridSize}
        ];

        return directions
            .map(dir => ({x: point.x + dir.x, y: point.y + dir.y}))
            .filter(pos => grid.some(p => p.x === pos.x && p.y === pos.y));
    }

    reconstructPath(cameFrom, current) {
        const path = [current];
        let currentKey = this.pointToKey(current);
        
        while (cameFrom.has(currentKey)) {
            current = cameFrom.get(currentKey);
            currentKey = this.pointToKey(current);
            path.unshift(current);
        }
        return path;
    }
}
