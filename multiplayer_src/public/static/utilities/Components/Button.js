class Button {
    constructor(sketch, x, y, width, height, text, bgColor, txtColor) {
        this.sketch = sketch;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.bgColor = bgColor;
        this.txtColor = txtColor;
    }

    draw() {
        this.sketch.fill(this.bgColor);

        // Rectangle with text in the middle
        this.sketch.rectMode(this.sketch.CENTER);
        this.sketch.rect(this.x, this.y, this.width, this.height);
        this.sketch.textAlign(this.sketch.CENTER, this.sketch.CENTER);
        this.sketch.textSize(32);
        this.sketch.fill(this.txtColor);
        this.sketch.text(this.text, this.x, this.y);
    }

    onClick(callback) {
        if (
            this.sketch.mouseX >= this.x - this.width / 2 &&
            this.sketch.mouseX <= this.x + this.width / 2
        ) {
            if (
                this.sketch.mouseY >= this.y - this.height / 2 &&
                this.sketch.mouseY <= this.y + this.height / 2
            ) {
                callback();
            }
        }
    }
}
