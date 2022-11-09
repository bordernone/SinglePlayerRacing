class RacingTrack {
    constructor(sketch, x, y, width, trackHeight) {
        this.sketch = sketch;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = trackHeight;

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

        // draw and move obstacles
        for (let i = 0; i < this.obstacles.length; i++) {
            this.obstacles[i].draw();
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

class Car {
    constructor(sketch, x, y, track) {
        this.sketch = sketch;
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;

        this.track = track;
    }

    draw() {
        this.sketch.fill("red");
        this.sketch.rectMode(this.sketch.CENTER);
        this.sketch.rect(this.x, this.y, this.width, this.height);
        this.sketch.fill("black");
        this.sketch.rectMode(this.sketch.CENTER);
        this.sketch.rect(this.x, this.y - 5, this.width - 5, this.height - 5);
        this.sketch.fill("white");
        this.sketch.rectMode(this.sketch.CENTER);
        this.sketch.rect(this.x, this.y - 5, this.width - 10, this.height - 10);

        // If up key is pressed, move car
        if (this.sketch.keyIsDown(this.sketch.UP_ARROW)) {
            this.move();
        }

        // Check if car is colliding with any obstacles
        for (let i = 0; i < this.track.obstacles.length; i++) {
            if (this.track.obstacles[i].hasHit(this)) {
                GameOverScreen();
            }
        }
    }

    moveLeft() {
        // Check if car is colliding with left wall
        if (this.x - this.width / 2 <= this.track.x) {
            return;
        }
        this.x -= 1;
    }

    moveRight() {
        // Check if car is colliding with right wall
        if (this.x + this.width / 2 >= this.track.x + this.track.width) {
            return;
        }
        this.x += 1;
    }

    move() {
        // If LEFT key is pressed, move car left
        if (this.sketch.keyIsDown(this.sketch.LEFT_ARROW)) {
            this.moveLeft();
        }
        // If RIGHT key is pressed, move car right
        if (this.sketch.keyIsDown(this.sketch.RIGHT_ARROW)) {
            this.moveRight();
        }
    }
}

class Obstacle {
    constructor(sketch, x, y, track) {
        this.sketch = sketch;
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;

        this.track = track;
    }

    draw() {
        // Create obstacle looking like a tree
        this.sketch.fill("green");
        this.sketch.triangle(
            this.x + this.track.x,
            this.track.y + this.y - this.height / 2,
            this.x + this.track.x - this.width / 2,
            this.track.y + this.y + this.height / 2,
            this.x + this.track.x + this.width / 2,
            this.track.y + this.y + this.height / 2
        );
    }

    hasHit(car) {
        // Check if car has hit obstacle
        if (
            car.x + car.width / 2 > this.x + this.track.x - this.width / 2 &&
            car.x - car.width / 2 < this.x + this.track.x + this.width / 2 &&
            car.y + car.height / 2 > this.track.y + this.y - this.height / 2 &&
            car.y - car.height / 2 < this.track.y + this.y + this.height / 2
        ) {
            return true;
        }
    }
}
