class Game {
    constructor(gameChannel, gameID) {
        this.state = "waiting";
        this.windowHeight = window.innerHeight;
        this.windowWidth = window.innerWidth;
        this.gameChannel = gameChannel;
        this.gameID = gameID;

        this.players = [];

        // Waiting screen buttons
        this.startButton;
        this.waitingButton;
        this.readyButton;

        // Game play screen items
        this.obstacles = [];

        // Racing track
        this.racingTrack;

        this.s = (sketch) => {
            let windowHeight = window.innerHeight;
            let windowWidth = window.innerWidth;

            sketch.setup = () => {
                let canvas = sketch.createCanvas(windowWidth, windowHeight);
                canvas.parent("game-play");

                this.initWaitingScreen(sketch);
                this.initGamePlayScreen(sketch);
            };

            sketch.draw = () => {
                if (this.state == "waiting") {
                    this.waitingScreen(sketch);
                } else if (this.state == "playing") {
                    this.gamePlayScreen(sketch);
                } else if (this.state == "gameover") {
                    this.gameOverScreen(sketch);
                }
            };

            // on click events
            sketch.mouseClicked = () => {
                this.startButton.onClick(this.onStartClick.bind(this));
            };
        };

        this.p5Instance = new p5(this.s);
    }

    waitingScreen(sketch) {
        sketch.background(0);
        sketch.fill(255);

        if (this.players.length == 2) {
            this.readyButton.draw();
        } else {
            this.waitingButton.draw();
        }
        this.startButton.draw();
    }

    initWaitingScreen(sketch) {
        this.readyButton = new Button(
            sketch,
            this.windowWidth / 2,
            this.windowHeight / 2,
            200,
            100,
            "Ready!",
            "#FFFFFF",
            "#000000"
        );

        this.waitingButton = new Button(
            sketch,
            this.windowWidth / 2,
            this.windowHeight / 2,
            200,
            100,
            "Waiting...",
            "#FFFFFF",
            "#000000"
        );

        this.startButton = new Button(
            sketch,
            this.windowWidth / 2,
            this.windowHeight / 2 + 150,
            200,
            100,
            "Start",
            "green",
            "white"
        );
    }

    initGamePlayScreen(sketch) {
        // Racing track
        this.racingTrack = new RacingTrack(
            sketch,
            this.windowWidth / 2,
            this.windowHeight / 2,
            400,
            this.windowHeight
        );

        // Create obstacle within the racing track (random)
        let rightWall = this.racingTrack.x + this.racingTrack.width / 2;
        let leftWall = this.racingTrack.x - this.racingTrack.width / 2;

        let obstacleX =
            Math.floor(Math.random() * (rightWall - leftWall + 1)) + leftWall;

        console.log("obstacleX: " + obstacleX);
        console.log("rightWall: " + rightWall);
        console.log("leftWall: " + leftWall);

        this.obstacles.push(
            new Obstacle(
                sketch,
                obstacleX,
                this.racingTrack.y - this.racingTrack.height / 2
            )
        );
    }

    onStartClick() {
        console.log("Start button clicked");
        this.gameChannel.startGame(this.gameID);
    }

    startGame() {
        this.state = "playing";
    }

    gamePlayScreen(sketch) {
        sketch.background(0);
        sketch.fill(255);

        // Draw racing track
        this.racingTrack.draw();

        // Draw obstacles
        let rightWall = this.racingTrack.x + this.racingTrack.width / 2;
        let leftWall = this.racingTrack.x - this.racingTrack.width / 2;
        // if (!this.print) this.print = true;
        this.obstacles.forEach((obstacle) => {
            // if obstacle is within the racing track
            if (
                obstacle.x > this.racingTrack.x - this.racingTrack.width / 2 &&
                obstacle.x < this.racingTrack.x + this.racingTrack.width / 2
                // obstacle.y > this.racingTrack.y - this.racingTrack.height / 2 &&
                // obstacle.y < this.racingTrack.y + this.racingTrack.height / 2
            ) {
                obstacle.draw();
                // obstacle.move();
            }
        });
    }

    gameOverScreen(sketch) {
        sketch.background(0);
        sketch.fill(255);
        sketch.text("Game Over", 100, 100);
    }
}

class RacingTrack {
    constructor(sketch, x, y, width, height) {
        this.sketch = sketch;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        this.sketch.rect(this.x, this.y, this.width, this.height);
    }
}
