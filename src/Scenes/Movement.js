class Movement extends Phaser.Scene {
    constructor()
    {
        super("movement");

        this.my = {sprite: {}};

        this.bodyX = 300;
        this.bodyY = 350;
        this.bullets = [];
        this.hearts = []; 
    }


   preload()
   {
        this.load.setPath("./assets/");
         // Load sprite atlas
         this.load.atlasXML("fishnstuff", "enemies.png", "enemies.xml");
         this.load.atlasXML("pellets", "spritesheet_jumper.png", "spritesheet_jumper.xml");
         this.load.audio("shoot", "drop_002.ogg"); 
         this.load.audio("background", "2-cherry-cute-bgm-271158.mp3");
        
         // update instruction text
   }
 
   
    create() 
    {
        let my = this.my; 
        this.health = 3;
        this.shootSound = this.sound.add("shoot"); 
        if(!this.sound.get("background"))
        {
            this.backGroundMusic = this.sound.add("background", {loop: true, volume: 0.5});
            this.backGroundMusic.play();
        }
        
        my.sprite.fish = this.add.sprite(390, 450, "fishnstuff", "piranha.png");


        for(let i = 0; i < this.health; i++)
        {
            const heart = this.add.sprite(30 + i * 40, 555, "fishnstuff", "fishPink.png");
            this.hearts.push(heart); 
        }

        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.screenW = this.scale.width;
        this.screenH = this.scale.height;

       
        this.bulletSpeed = 5;
        
        this.registry.set("playerSprite", my.sprite.fish);  
        document.getElementById('description').innerHTML = '<h2>Path.js</h2><br>Credit: Melissa Rosales <br>A: Move left <br>D: Move right <br>SPACE: To shoot <br>Left Click Ready: To try again! <br>The fish is hungry eat pink worms but watch out for the green ones, and that evil worm monger, its trying to steal your fish!!! Fight back and secure your spot in this pond, but be careful those pellets are powerful, they may even destroy your worms!';
        
        
    }

    loseHealth()
    {
        const highScore = this.scene.get("enimies").highScore;
        const score = this.scene.get("enimies").score; 
        if(this.health > 0)
        {
            this.health--;
            const lostHeart = this.hearts.pop();
            if(lostHeart)
            {
                lostHeart.destroy();
            }
            if(this.health <= 0)
            {
                this.scene.stop("enimies");
                if(this.sound.get("background"))
                {
                    this.backGroundMusic.destroy();
                }
                this.scene.stop("movement");
                if(score > highScore)
                {
                    localStorage.setItem("highscore", score);
                }
                this.scene.start("over"); 
            }
        }
    }
    
    update() 
    {   
       let my = this.my; 
       
       if(this.aKey.isDown && my.sprite.fish.x > 0)
       {
            my.sprite.fish.x -= 9;
       }
       else if(this.dKey.isDown && my.sprite.fish.x < this.scale.width)
       {
            my.sprite.fish.x += 9; 
       }

       if(this.spaceKey.isDown && !this.spaceKey.prevDown)
       {
            this.spaceKey.prevDown = true;
            this.shootSound.play(); 
            my.sprite.pellet = this.add.sprite(my.sprite.fish.x, my.sprite.fish.y, "pellets", "particle_brown.png");
            my.sprite.pellet.setScale(0.5);
           
            this.bullets.push(my.sprite.pellet); 
        
            
       }

        if(!this.spaceKey.isDown)
        {
            this.spaceKey.prevDown = false; 
        }

        
        for(let bullet of this.bullets)
        {
            bullet.y -= this.bulletSpeed;
            
            if(bullet.y < -50)
            {
                bullet.destroy();
                 
            }
            
        }
        this.bullets = this.bullets.filter(bullet=>bullet.y>=-50);
        
        this.scene.get("enimies").playerX = my.sprite.fish.x;
        this.scene.get("enimies").playerY = my.sprite.fish.y; 
       
    }

}