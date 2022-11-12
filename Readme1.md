


### Scoring
We started with a time-based scoring system: the longer a user remains in the game, the higher their score is. Soon, we realized that a person can start the game and not move their car at all and this will lead to them getting a very high score. We could have a method for updating the score only when the car is moving but instead we moved to coin based scoring system. So we made coin class which was completely based on obstacle class but with different behavior and image. 

```javascript
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
```


### Sound
We added multiple sound feedbacks in our game. When the user first lands onto the `/game.html` page, a background music is played on loop. This sound effect added much better feeling of the game (as some of the tester noticed) compared to without sound. During the game play, the sound of the car engine is played on loop based on whether the car is "moving" (code below). When a user collects coin, another sound is played. Finally when the car hits an obstacle (blue cars), the user is taken to game-over screen where it plays a game over sound. 

Car movement sound:
```javascript
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
```

### Images
Initially all the objects were p5js shapes. We replaced those with `.png` images. One of the challenges (and also a limitation) was replacing the car's image itself. When we changed the p5js shapes for obstacles and coins to images, it worked fine. But using the same method, when we changed the car's shape to an image, collision detection system started to behave differently. We tried different strategies but none of them worked so we continued to use the original shape for the car. 


### Bishnu's Contributions and Challenges
I think most of the work in this project was done together. However, here are a few things that caught my interest and thus I focused more on those. The main challenge that I faced in this project was setting up the game mechanics. Moving the car and other objects on the track was difficult. Initially, I planned to change the coordinates of the car to make it move, but I soon figured out that I should be moving the track instead which would create the same effect as moving the car. Using this technique, the obstacles would be place relative to the track and when the track is moved, the obstacles will move as well. 

Track movement:
```javascript
// If UP key is pressed, move track
if (this.sketch.keyIsDown(this.sketch.UP_ARROW)) {
    this.y += this.velocity;
    this.velocity = Math.min(this.velocity + 0.01, this.maxVelocity);
} else {
    this.velocity = Math.max(this.velocity - 0.001, 0);
}
```

Relative Positioning of objects:
```javascript
// Similar implementation for obstacle and strides
this.sketch.image(
    IMAGES.coin,
    this.x + this.track.x - this.width / 2,
    this.track.y + this.y - this.height / 2,
    this.width,
    this.height
);
```


Furthermore, I also created three different screens (three different p5 instances: game-start, game-play, game-over) to make the design more modular. This made the process much easier as we wouldn't have to worry about re-initializing the objects if user pressed "play again" as creating a new instance will automatically discard old objects. Another challenge was the scoring system which is described above. I also configured the audio and images used in the game. For the homepage, I worked on the aesthetics and data communication between frontend and backend. Finally, I also put together each other's work and made necessary adjustment for proper integration. 

In terms of learning outcomes, I have learned a lot doing this project. From handling game threads to working with inner game logic, I got a glimpse of how games are really built from scratch without using any game engine. I discovered a lot of great resources that made it possible to build this game. One of the things I am incredibly proud of is how flawless the logic of the game was and its implementation. There was 0 bugs reported by the people I asked to test the game, although it was missing some feature (like the obstacle not moving, which was actually the intension).

### Resources Used:

1. Kilobolt.com
2. Soundsnap.com (for all audio files)
3. deviantart.com: [BG Image](https://www.deviantart.com/rhoogers/art/Hotline-Miami-Fan-art-522628505)

Most other images were based on blueprints and were edited on an image editor to produce the ones used in the game.