# Project 2: Racing Master

## Journey 1: Attempting to create a multiplayer racing game
### Concept
For this project, we will create a multiplayer racing game where players compete in a car race, and the one who finishes in the shortest time wins. To make the game more challenging and fun, obstacles will be included on the road to slow down players. At the end of the race, players’ names and times will be stored on the server. The names of 10 players with the shortest times will be displayed on the leaderboard. 


The homepage of our project has two options: “Create Room” and “Join Room.” When a user first creates a room, a socket connection is established between the server and the player. The game starts only when another player joins the same room. When the game starts, each player continuously shares their car’s location to the server which is then broadcasted to both players.

For the in-game interface, we will use a static background and move it in a loop from top to bottom, creating an illusion of “movement.” We generate random obstacle on the track to make it more dynamic. The number of obstacles will increase as the player progresses in the game.


### Planning
#### 1. Wireframes

*Homepage*
![wireframe1](images/Project2_Wireframe1.png)

*After Create Room*
![wireframe2](images/Project2_Wireframe2.png)

*After Join Room*
![wireframe3](images/Project2_Wireframe3.png)

#### 2. Data Flow Diagram

![data_flow](images/DataFlow_Project2.png)

### Process

We began to implement the socket communications between the server and clients. We wanted players to be able to create and join different rooms.

```javascript
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

```
*Player 1 creates a new room*
![p1](images/player1.png)

*Player 1 waits for player 2 to join*
![wait](images/wait-screen.png)

*Player 2 joins a room*
![p2](images/player2.png)

*Players ready to play*
![ready](images/ready_screen.png)

Although we managed to create different lobbies for players to join, we faced bigger problems when it came to sharing data during the gameplay:
1. Update player's position on each side was difficult because we needed to render *p5js* elements based on where the other player is on the track
2. Collision would lag since the data would pass through the internet
3. The game's layout was not hard coded so the coordinates for one player on one client will be different for the other client

Thus, we decided to simplify our game to be single-player. After we successful built this version, we could upgrade it to be a multiplayer game. 

## Journey 2: Creating a single-player racing game
### Concept
The cocept for our revised game is very similar to the first version. The biggest change is that single-player, so players will not have to create and joins a room. They will only need to enter their name to start the race. 

During the race, obstacles will be randomly spawned on the track to add difficulty and fun to the game. To motivate players to be competitive, we will have a leaderboard that show top ten players who finished the race in the shortest times. 


