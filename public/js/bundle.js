let gameState = "playing";
let racingTrack;
let car;
let gamePlayInstance, gameOverInstance, gameStartInstance;
let gameStartTime, gameEndTime;
let frameHeight = 600;
let frameWidth = 800;
let playerName;
let scoreResponse;

// Globally Available
let AUDIO_FILES = {
    car_running: "assets/audio/car_running.mp3",
    game_start_screen: "assets/audio/game_start_screen.mp3",
    game_over: "assets/audio/game_over.mp3",
    car_idle: "assets/audio/car_idle.mp3",
};

let SOUNDS = {};

// on load
window.onload = function () {
    // get name from local storage
    playerName = localStorage.getItem("name");
    if (!playerName) {
        alert("Please enter a name");
        window.location.href = "index.html";
    }

    GameStartScreen();
};

const GamePlayScreen = () => {
    gameStartTime = Date.now();
    if (gameOverInstance) gameOverInstance.remove();
    if (gameStartInstance) gameStartInstance.remove();
    gameState = "playing";
    gamePlayInstance = new p5(function (sketch) {
        // Preload
        sketch.preload = function () {
            // Load car running sound
            SOUNDS.car_running = sketch.loadSound(AUDIO_FILES.car_running);
            SOUNDS.car_idle = sketch.loadSound(AUDIO_FILES.car_idle);
        };

        // Setup
        sketch.setup = function () {
            // center canvas to the screen
            sketch.createCanvas(frameWidth, frameHeight);

            // create racing track, center screen, full height
            let trackWidth = 200;
            let trackHeight = 100000;
            racingTrack = new RacingTrack(
                sketch,
                sketch.width / 2 - trackWidth / 2,
                sketch.height - trackHeight,
                trackWidth,
                trackHeight
            );

            // create car at the bottom of the racing track
            car = new Car(
                sketch,
                sketch.width / 2,
                sketch.height / 2 + 200,
                racingTrack
            );

            sketch.background(0);
        };
        // Draw
        sketch.draw = function () {
            if (gameState === "playing") {
                racingTrack.draw();
                car.draw();
            }
        };
    }, document.getElementById("app"));
};

const GameOverScreen = () => {
    gameEndTime = Date.now();
    if (gamePlayInstance) gamePlayInstance.remove();
    if (gameStartInstance) gameStartInstance.remove();
    gameState = "gameOver";

    scoreResponse = null;
    SubmitScore();

    gameOverInstance = new p5(function (sketch) {
        // Preload
        sketch.preload = function () {
            SOUNDS.game_over = sketch.loadSound(AUDIO_FILES.game_over);
        };

        // Setup
        sketch.setup = function () {
            // center canvas to the screen
            sketch.createCanvas(frameWidth, frameHeight);

            sketch.background(0);

            sketch.background(0);
            sketch.fill("white");
            sketch.textSize(32);
            // center text
            sketch.textAlign(sketch.CENTER, sketch.CENTER);
            sketch.text("Game Over", sketch.width / 2, sketch.height / 2);
            sketch.textSize(16);
            sketch.text(
                "Your Score: " +
                    Math.floor((gameEndTime - gameStartTime) / 1000),
                sketch.width / 2,
                sketch.height / 2 + 50
            );

            if (SOUNDS.game_over && !SOUNDS.game_over.isPlaying()) {
                SOUNDS.game_over.play();
            }
        };

        // Draw
        sketch.draw = function () {
            // If scoreResponse is not null
            sketch.fill("white");
            if (scoreResponse) {
                let highScoreBroken = scoreResponse.highScoreBroken;
                if (highScoreBroken) {
                    // Display new high score
                    sketch.textSize(16);
                    sketch.textAlign(sketch.CENTER, sketch.CENTER);
                    sketch.text(
                        "New High Score!",
                        sketch.width / 2,
                        sketch.height / 2 + 100
                    );
                } else {
                    // Display high score
                    sketch.textSize(16);
                    sketch.textAlign(sketch.CENTER, sketch.CENTER);
                    sketch.text(
                        "High Score: " + scoreResponse.highScore.toString(),
                        sketch.width / 2,
                        sketch.height / 2 + 100
                    );
                }
            }

            // Draw reactangle with text "Play again"
            sketch.fill("white");
            sketch.rectMode(sketch.CENTER);
            sketch.rect(sketch.width / 2, sketch.height / 2 + 200, 100, 50);
            sketch.fill("black");
            sketch.textSize(16);
            sketch.textAlign(sketch.CENTER, sketch.CENTER);
            sketch.text(
                "Play again",
                sketch.width / 2,
                sketch.height / 2 + 200
            );

            // If mouse is pressed, check if mouse is over "Play again" button
            if (sketch.mouseIsPressed) {
                if (
                    sketch.mouseX > sketch.width / 2 - 50 &&
                    sketch.mouseX < sketch.width / 2 + 50 &&
                    sketch.mouseY > sketch.height / 2 + 200 - 25 &&
                    sketch.mouseY < sketch.height / 2 + 200 + 25
                ) {
                    GamePlayScreen();
                }
            }
        };
    }, document.getElementById("app"));
};

const GameStartScreen = () => {
    if (gameOverInstance) gameOverInstance.remove();
    if (gamePlayInstance) gamePlayInstance.remove();
    gameState = "gameStart";
    gameStartInstance = new p5(function (sketch) {
        // Preload
        sketch.preload = function () {
            // Load audio files
            SOUNDS.game_start_screen = sketch.loadSound(
                AUDIO_FILES.game_start_screen
            );
        };

        // Setup
        sketch.setup = function () {
            // center canvas to the screen
            sketch.createCanvas(frameWidth, frameHeight);

            sketch.background(0);
            sketch.fill("white");
            sketch.textSize(32);
            // center text
            sketch.textAlign(sketch.CENTER, sketch.CENTER);
            sketch.text("Racing Game", sketch.width / 2, sketch.height / 2);
            sketch.textSize(16);
            sketch.text(
                "Click to start",
                sketch.width / 2,
                sketch.height / 2 + 50
            );
        };

        // Draw
        sketch.draw = function () {
            // If mouse is pressed, start game
            if (sketch.mouseIsPressed) {
                GamePlayScreen();
            }

            // Play audio
            if (
                SOUNDS.game_start_screen &&
                !SOUNDS.game_start_screen.isPlaying()
            ) {
                SOUNDS.game_start_screen.play();
            }
        };
    }, document.getElementById("app"));
};

const SubmitScore = () => {
    // get score
    let score = Math.floor((gameEndTime - gameStartTime) / 1000);
    // post score
    fetch("/api/scores", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: playerName,
            score: score,
        }),
    })
        .then((res) => res.json())
        .then((data) => {
            scoreResponse = data;
            console.log(data);
        })
        .catch((err) => {
            console.log(err);
        });
};
