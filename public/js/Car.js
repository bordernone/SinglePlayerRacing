class Car {
    constructor(sketch, x, y, track) {
        this.sketch = sketch;
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 50;

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

            // Stop Idle sound
            if (SOUNDS.car_idle.isPlaying()) {
                SOUNDS.car_idle.stop();
            }

            if (!SOUNDS.car_running.isPlaying()) {
                SOUNDS.car_running.play();
            }
        } else {
            if (SOUNDS.car_running.isPlaying()) {
                SOUNDS.car_running.stop();
            }
            if (!SOUNDS.car_idle.isPlaying()) {
                SOUNDS.car_idle.play();
            }
        }

        // Check if car is colliding with any obstacles
        for (let i = 0; i < this.track.obstacles.length; i++) {
            if (this.track.obstacles[i].hasHit(this)) {
                GameOverScreen();
            }
        }

        // Check if car is colliding with any coins
        for (let i = 0; i < this.track.coins.length; i++) {
            if (this.track.coins[i].hasHit(this)) {
                SOUNDS.coin_hit.play();

                this.track.coins.splice(i, 1);
                coinsCollected++;
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
