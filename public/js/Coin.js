class Coin {
    constructor(sketch, x, y, track) {
        this.sketch = sketch;
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;

        this.track = track;
    }

    draw() {
        // Draw image coin
        this.sketch.image(
            IMAGES.coin,
            this.x + this.track.x - this.width / 2,
            this.track.y + this.y - this.height / 2,
            this.width,
            this.height
        );
    }

    hasHit(car) {
        // Check if car has hit coin
        if (
            car.x + car.width / 2 >= this.x + this.track.x - this.width / 2 &&
            car.x - car.width / 2 <= this.x + this.track.x + this.width / 2 &&
            car.y + car.height / 2 >= this.track.y + this.y - this.height / 2 &&
            car.y - car.height / 2 <= this.track.y + this.y + this.height / 2
        ) {
            return true;
        }
    }
}
