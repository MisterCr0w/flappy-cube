// Create out main state that contains the game
var mainState = {
    preload: function() {
        // Load the bird sprite
        game.load.image('bird', 'assets/bird.png');
        
        // Load pipe sprite
        game.load.image('pipe', 'assets/pipe.png');
        
        // Load audio
        game.load.audio('jump', 'assets/jump.wav');
    
    },
    
    create: function() {
        // Change the background color to blue
        game.stage.backgroundColor = '#71c5cf';
        
        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Display bird at x=100 and y=245
        this.bird = game.add.sprite(100, 245, 'bird');
        
        // Bird physics
        game.physics.arcade.enable(this.bird);
        
        // Add gravity to the bird
        this.bird.body.gravity.y = 1000;
        
        // Call the jump function when space is hit
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        
        // Empty group
        this.pipes = game.add.group();
        
        // Add pipes 1.5 seconds
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
        
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0",
            { font: "30px Arial", fill: "#ffffff" });
        
        // Sound in game
        this.jumpSound = game.add.audio('jump');
        
        // Move anchor to the left and downward
        this.bird.anchor.setTo(-0.2, 0.5);
        
    },
    
    addOnePipe: function(x, y) {
        // Create a pipe at position x and y
        var pipe = game.add.sprite(x, y, 'pipe');
        
        // Add pipe to group
        this.pipes.add(pipe);
        
        // Pipe physics
        game.physics.arcade.enable(pipe);
        
        // Velocity to the pipe to move it left
        pipe.body.velocity.x = -200;
        
        // Auto kill pipe when it's not visible
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },
    
    addRowOfPipes: function () {
        //Randomly pick a number between 1 and 5
        // This will be the hole position
        var hole = Math.floor(Math.random() * 5) + 1;
        
        // Add the 6 pipes
        // With one big hole at position 'hole' and 'hole +1'
        for (var i = 0; i< 8; i++)
            if (i != hole && i != hole + 1)
                this.addOnePipe(400, i * 60 + 10);
       
        // Score
        this.score += 1;
        this.labelScore.text = this.score;
    },
    
    update: function() {
        // Out of screen controll
        // Call restartGame function
        if (this.bird.y < 0 || this.bird.y > 490)
            this.restartGame();
        
    game.physics.arcade.overlap(
        this.bird, this.pipes, this.restartGame, null, this); 
        
        if (this.bird.angle < 20)
            this.bird.angle += 1;
    },
    
    hitPipe: function() {
        
        if (this.bird.alive == false)
            return;
        
        this.bird.alive = false;
        
        game.time.events.remove(this.timer);
        
        this.pipes.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);
    },
    
    // Make bird jump
    jump: function() {
    
        if (this.bird.alive == false)
            return; 
    
        // Vertical velocity for bird
        this.bird.body.velocity.y = -350;
            
        // Bird animations
        var animation = game.add.tween(this.bird);
        
        // Change angle of the bird to -20 deg in 100 milliseconds
        animation.to({angle: -20}, 100);
        
        // Start animation
        animation.start();
    },
    
    // Restart game
    restartGame: function() {
        
        //Start main state for restartin the game
        game.state.start('main');
    },
};

// Initialize Phaser and create a 400px by 490px game
var game = new Phaser.Game(400, 490);


// Add the 'mainState' and call it 'main'
game.state.add('main', mainState);

// Start the state to actually start the game
game.state.start('main');