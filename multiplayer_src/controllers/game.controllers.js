// Import database
const db = require("../db/index");

class Game {
    constructor() {}

    // Create Game
    static createGame() {
        return new Promise((resolve, reject) => {
            let game = {
                players: [],
                state: "waiting",
                startedAt: null,
            };

            // Insert new game in database
            db.insert(game, (err, newGame) => {
                if (err) {
                    reject(err);
                } else {
                    let game = new Game();
                    game._id = newGame._id;
                    game.players = newGame.players;
                    game.state = newGame.state;
                    game.startedAt = newGame.startedAt;
                    resolve(game);
                }
            });
        });
    }

    static getGame(gameID) {
        return new Promise((resolve, reject) => {
            db.find({ _id: gameID }, (err, docs) => {
                if (docs.length == 0) {
                    reject("Game does not exist");
                } else {
                    let gameData = docs[0];
                    let game = new Game();
                    game._id = gameData._id;
                    game.players = gameData.players;
                    game.state = gameData.state;
                    game.startedAt = gameData.startedAt;
                    resolve(game);
                }
            });
        });
    }

    addPlayer(playerName, socketID) {
        let player = {
            socketID: socketID,
            playerName: playerName,
            finished: false,
            finishedAt: null,
        };

        // Check number of players
        if (this.players.length >= 2) {
            throw "Game is full";
        }

        // Check game state
        if (this.state != "waiting") {
            throw "Game has already started";
        }

        this.players.push(player);
    }

    startGame() {
        // Check number of players in the game
        if (this.players.length < 2) {
            throw "You need at least 2 players to start the game";
        }

        // Check game state
        if (this.state != "waiting") {
            throw "Game has already started";
        }

        this.state = "started";
        this.startedAt = +new Date();
    }

    registerPlayerFinish(socketID) {
        // Check if both players have finished
        if (this.players.filter((player) => player.finished).length == 2) {
            throw "Game has already finished";
        }

        // Check game state
        if (this.state != "started") {
            throw "Game has not started yet";
        }

        // Find player
        let player = this.players.find((player) => player.socketID == socketID);

        // Check if player exists
        if (!player) {
            throw "Player does not exist";
        }

        // Check if player has already finished
        if (player.finished) {
            throw "Player has already finished";
        }

        // Register player finish
        player.finished = true;
        player.finishedAt = +new Date();
    }

    save() {
        return new Promise((resolve, reject) => {
            db.update(
                { _id: this._id },
                {
                    players: this.players,
                    state: this.state,
                    startedAt: this.startedAt,
                },
                {},
                (err, numReplaced) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        });
    }
}

module.exports = Game;