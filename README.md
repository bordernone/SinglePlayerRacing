# Project 2: Racing Master
## Concept
For this project, we will create a multiplayer racing game where players compete in a car race, and the one who finishes in the shortest time wins. To make the game more challenging and fun, obstacles will be included on the road to slow down players. At the end of the race, players’ names and times will be stored on the server. The names of 10 players with the shortest times will be displayed on the leaderboard. 


The homepage of our project has two options: “Create Room” and “Join Room.” When a user first creates a room, a socket connection is established between the server and the player. The game starts only when another player joins the same room. When the game starts, each player continuously shares their car’s location to the server which is then broadcasted to both players.

For the in-game interface, we will use a static background and move it in a loop from top to bottom, creating an illusion of “movement.” We generate random obstacle on the track to make it more dynamic. The number of obstacles will increase as the player progresses in the game.


## Planning
#### 1. Wireframes

*Homepage*
![wireframe1](images/Project2_Wireframe1.png)

*After Create Room*
![wireframe2](images/Project2_Wireframe2.png)

*After Join Room*
![wireframe3](images/Project2_Wireframe3.png)

#### 2. Data Flow Diagram

![data_flow](images/DataFlow_Project2.png)
