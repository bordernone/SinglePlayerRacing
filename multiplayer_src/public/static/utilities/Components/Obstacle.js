class Obstacle {
    constructor(sketch, x, y) {
        this.sketch = sketch;
        this.height = 20;
        this.width = 20;
        this.x = x;
        this.y = y;
    }

    draw() {
        this.sketch.fill("red");
        this.sketch.rect(this.x, this.y, this.width, this.height);
    }

    move() {
        this.x -= 5;
    }
}
