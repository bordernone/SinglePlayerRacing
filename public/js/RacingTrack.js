class RacingTrack {
    constructor(sketch, x, y, width, trackHeight) {
        this.sketch = sketch;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = trackHeight;

        this.coins = [];
        this.obstacles = [];
        this.velocity = 0.1;
        this.maxVelocity = 5;

        let _this = this;
        this.wallWidth = 20;
        this.leftWall;
        this.rightWall;

        // Randomly generate obstacles
        for (let i = 0; i < Math.floor((5 / 1000) * this.height); i++) {
            let xRange = [15, this.width - 15];
            let yRange = [0, this.height - sketch.height];
            let obstacle = new Obstacle(
                sketch,
                sketch.random(xRange[0], xRange[1]),
                sketch.random(yRange[0], yRange[1]),
                _this
            );

            this.obstacles.push(obstacle);
        }

        // Randomly generate coins
        for (let i = 0; i < Math.floor((5 / 1000) * this.height); i++) {
            let xRange = [15, this.width - 15];
            let yRange = [0, this.height - sketch.height];

            let coinX, coinY;

            // Check if coin is not overlapping with obstacle
            let overlapping;
            do {
                coinX = sketch.random(xRange[0], xRange[1]);
                coinY = sketch.random(yRange[0], yRange[1]);
                overlapping = false;
                for (let j = 0; j < this.obstacles.length; j++) {
                    let obstacle = this.obstacles[j];
                    let d = sketch.dist(coinX, coinY, obstacle.x, obstacle.y);
                    if (d < obstacle.height) {
                        overlapping = true;
                    }
                }
            } while (overlapping);

            let coin = new Coin(sketch, coinX, coinY, _this);
            this.coins.push(coin);
        }
    }

    draw() {
        // Draw object looking like a racing track with wall on each side
        this.sketch.fill("grey");
        this.sketch.rectMode(this.sketch.CORNER);
        this.sketch.rect(this.x, this.y, this.width, this.height);
        // Set wall color to brown
        this.sketch.fill("brown");
        this.leftWall = this.sketch.rect(
            this.x - this.wallWidth,
            this.y,
            this.wallWidth,
            this.height + this.wallWidth
        );
        this.rightWall = this.sketch.rect(
            this.x + this.width,
            this.y,
            this.wallWidth,
            this.height + this.wallWidth
        );

        // Strides
        this.sketch.fill("black");
        this.sketch.rectMode(this.sketch.CENTER);
        for (let i = 0; i < this.height; i += 100) {
            this.sketch.rect(this.x + this.width / 2, this.y + i, 10, 50);
        }

        // draw obstacles
        for (let i = 0; i < this.obstacles.length; i++) {
            this.obstacles[i].draw();
        }

        // draw and move coins
        for (let i = 0; i < this.coins.length; i++) {
            this.coins[i].draw();
        }

        // If UP key is pressed, move track
        if (this.sketch.keyIsDown(this.sketch.UP_ARROW)) {
            this.y += this.velocity;
            this.velocity = Math.min(this.velocity + 0.01, this.maxVelocity);
        } else {
            this.velocity = Math.max(this.velocity - 0.001, 0);
        }
    }
}
