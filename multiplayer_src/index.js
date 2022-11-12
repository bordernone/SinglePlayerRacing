let express = require("express");
let app = express();
app.use("/", express.static("public"));

//creating an http server ON the express app
let http = require("http");
let server = http.createServer(app);
server.listen(3000, () => {
    console.log("listening on 3000");
});

//add sockets on top of the http server
let io = require("socket.io");
io = new io.Server(server);

const Game = require("./controllers/game.controllers");

// Listen to socket connection
io.on("connection", (socket) => {
    console.log("a user connected: ", socket.id);
    socket.on("disconnect", () => {
        console.log("user disconnected: ", socket.id);
    });

    // Listen to game initialization
    socket.on("init", async (data) => {
        // Log init
        console.log("init: ", data);

        // Create new game
        let game = await Game.createGame();
        // Emit game id
        socket.emit("init", game._id);
    });

    // Listen to player join event
    socket.on("player-join", async (data) => {
        let gameID = data.gameID;
        let player = {
            playerName: data.playerName,
            socketID: socket.id,
        };

        try {
            let game = await Game.getGame(gameID);
            game.addPlayer(player.playerName, player.socketID);
            await game.save();

            // Add player to the room
            socket.join(gameID);

            // Emit to all player of this game
            console.log("Player added to game");
            io.to(gameID).emit("player-join", {
                players: game.players,
            });
        } catch (err) {
            socket.emit("error", err);
        }
    });

    // Listen to player start event
    socket.on("game-start", async (data) => {
        let gameData = {
            gameID: data.gameID,
        };

        // Get game
        let game = await Game.getGame(gameData.gameID);

        try {
            // Start game
            game.startGame();
            await game.save();

            // Emit to all player of this game
            console.log("Game started");
            io.to(gameData.gameID).emit("game-start", {
                players: game.players,
            });
        } catch (err) {
            socket.emit("error", err);
        }
    });

    // Listen to player position event
    socket.on("update-player-position", (data) => {
        let gameID = data.gameID;

        // Emit to all player of this game
        io.to(gameID).emit("update-player-position", data);
    });

    // Listen to player reach finish event
    socket.on("player-reach-finish", async (data) => {
        let gameID = data.gameID;

        let game = await Game.getGame(gameID);
        game.registerPlayerFinish(socket.id);
        await game.save();

        // Emit to all player of this game
        io.to(gameID).emit("player-reach-finish", data);
    });
});
