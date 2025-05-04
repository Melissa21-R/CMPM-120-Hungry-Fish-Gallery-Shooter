class Enimies extends Phaser.Scene {
    constructor()
    {
        super("enimies");

        this.my = {sprite: {}};

    }

   preload()
   {
        this.load.setPath("./assets/");
        this.load.atlasXML("fishnstuff", "enemies.png", "enemies.xml");
        this.load.atlasXML("flynpellets", "spritesheet_jumper.png", "spritesheet_jumper.xml");
        this.load.atlasXML("words", "spritesheet_hud.png", "spritesheet_hud.xml");
   }
 
   
    create() 
    {
       let my = this.my; 
       this.pinkWorms = [];
       this.greenWorms = [];

       this.score = 0;
       if(!localStorage.getItem("highscore"))
       {
            localStorage.setItem("highscore", 0);
       }
       this.highScore = parseInt(localStorage.getItem("highscore"));
       console.log(this.highScore);
       this.evilAlienHealth = 25; 

       this.startTime = this.time.now; 
       this.waveLength = 8; 
       this.waveGap = 3; 

       this.debudGraphics = this.add.graphics(); 

       this.spikes = [];
       this.spikeCoolDown = 0;
       this.spikeInterval = 5;

       this.spawnCounter = 0;
       this.spawnThreshold = 8;
       this.scene.launch("movement");

       this.path = this.add.path(50, 40); 
       this.path.lineTo(this.scale.width - 50, 40);

       this.my.sprite.evilAlien = this.add.follower(this.path, 50, -100, "flynpellets", "flyMan_fly.png");
       my.sprite.evilAlien.setScale(0.5);

       this.evilAlienExist = false; 

       this.my.sprite.one = this.add.sprite(this.scale.width/2, this.scale.height/2 - 100, "words", "text_1.png");
       this.my.sprite.two = this.add.sprite(this.scale.width/2, this.scale.height/2 - 100, "words", "text_2.png");
       this.my.sprite.two.setVisible(false);
       this.my.sprite.three = this.add.sprite(this.scale.width/2, this.scale.height/2 - 100, "words", "text_3.png");
       this.my.sprite.three.setVisible(false);

       this.scoreText = this.add.text(670, 555, 'Score: ' + this.score, 
        {
            fontSize: '24px',
            fill: '#ADD8E6'
        });

        this.highScoreText = this.add.text(598, 530, 'High Score:' + this.highScore, 
        {
            fontSize: '24px',
            fill: '#ADD8E6'
        });
      
    }

    isColliding(a, b, shrinkA = 0, shrinkB = 0)
    {
        const aHalfShrink = shrinkA/2;
        const bHalfShrink = shrinkB/2;
        return (
            ((a.x + aHalfShrink) < (b.x + bHalfShrink) + (b.width - shrinkB)) && 
            ((a.x + aHalfShrink) + (a.width - shrinkA) > (b.x + bHalfShrink)) && 
            ((a.y + aHalfShrink) < (b.y + bHalfShrink) + (b.height - shrinkB)) && 
            ((a.y + aHalfShrink) + (a.height - shrinkA) > (b.y + bHalfShrink))
        );
    }
    
    update() 
    {   
        
        this.spawnCounter++; 
        this.spikeCoolDown++;

        const player = this.scene.get("movement").my.sprite.fish;
        const bullets = this.scene.get("movement").bullets; 

        
        
        let timePassed = (this.time.now - this.startTime) / 1000;
        let secondsElapsed = Math.floor(timePassed); 

        if(this.spawnCounter >= this.spawnThreshold)
        {
            if(timePassed % (this.waveLength + this.waveGap) > this.waveGap)
            {
                this.spawnCounter = 0;

                const xPink = Phaser.Math.Between(0, this.scale.width);
                const pinkW = this.add.sprite(xPink, -50, "fishnstuff", "worm.png");
                pinkW.speed = 6; 
                this.pinkWorms.push(pinkW); 
                
                if(timePassed > this.waveLength + this.waveGap)
                {
                    const xGreen = Phaser.Math.Between(0, this.scale.width);
                    const greenW = this.add.sprite(xGreen, -50, "fishnstuff", "snake.png");
                    greenW.speed = 8;
                    this.greenWorms.push(greenW);
                }
            }


        }


        for(let i = this.greenWorms.length -1; i >= 0; i--)
        {
            const greenW = this.greenWorms[i];

            if(!greenW)
            {
                continue;
            }

            greenW.y += greenW.speed;

            if(greenW.y > this.scale.height)
            {
                greenW.destroy();
                this.greenWorms.splice(i, 1);
            }

            for(let j = bullets.length - 1; j >= 0; j--)
            {
                const bullet = bullets[j]; 
                if(this.isColliding(greenW, bullet, 1, 45))
                {
                    greenW.destroy();
                    this.greenWorms.splice(i,1);

                    
                    bullet.destroy();
                    bullets.splice(j, 1);
                }
            }

            if(this.isColliding(greenW, player, 1, 1))
            {
                greenW.destroy();
                this.greenWorms.splice(i, 1);
                this.score -= 20; 
                this.scoreText.setText('Score:' + this.score);
            }
        }

        for(let i = this.pinkWorms.length -1; i >= 0; i--)
        {
            const pinkW = this.pinkWorms[i];

            if(!pinkW)
            {
                continue;
            }

            pinkW.y += pinkW.speed;

            if(pinkW.y > this.scale.height)
            {
                pinkW.destroy();
                this.pinkWorms.splice(i, 1);
            }

            for(let j = bullets.length - 1; j >= 0; j--)
            {
                const bullet = bullets[j]; 
                if(this.isColliding(pinkW, bullet, 1, 45))
                {
                    pinkW.destroy();
                    this.pinkWorms.splice(i,1);

                    
                    bullet.destroy();
                    bullets.splice(j, 1);
                }
            }

            if(this.isColliding(pinkW, player, 1, 1))
            {
                pinkW.destroy();
                this.pinkWorms.splice(i, 1);
                this.score += 10; 
                this.scoreText.setText('Score:' + this.score);
            }
        }
        

        if(timePassed > (2 * this.waveLength) + (3 * this.waveGap))
        {
            if(!this.evilAlienExist)
            {
                this.my.sprite.evilAlien.y = 40;
                this.evilAlienExist = true;
                this.my.sprite.evilAlien.startFollow
                (
                    {
                        duration: 3000,
                        repeat: -1, 
                        yoyo: true,
                        ease: "Sine.easeInOut",
                        rotateToPath: false
                    }
                );
                
            }

            if(this.spikeCoolDown >= this.spikeInterval)
            {
    
                this.spikeCoolDown = 0;
    
                if(this.my.sprite.evilAlien)
                {
                    const spike = this.add.sprite(this.my.sprite.evilAlien.x, this.my.sprite.evilAlien.y + 20, "flynpellets", "spike_bottom.png");
                    spike.setScale(0.5);
                    spike.speed = 9; 
                    this.spikes.push(spike); 
                }
                
        
            }
            
            for(let i = bullets.length - 1; i >= 0; i--)
            {
                const bullet = bullets[i];
                if(this.evilAlienExist)
                {
                    if(this.isColliding(this.my.sprite.evilAlien, bullet, 1, 55))
                    {
                        this.evilAlienHealth--; 
                        bullet.destroy();
                        bullets.splice(i, 1); 
                    }
                }
            }

            if(this.evilAlienHealth <= 0)
            {
                this.score += 100;
                this.scoreText.setText('Score: ' + this.score);
                if(this.score > this.highScore)
                {
                    localStorage.setItem("highscore", this.score);
                }
                this.scene.stop("enimies");
                this.scene.stop("movement");
                this.scene.start("over"); 
            }
           
        }

        
        for(let i = this.spikes.length - 1; i >= 0; i--)
        {
            const spike = this.spikes[i];
            spike.y += spike.speed;

            if(spike.y > this.scale.height)
            {
                spike.destroy();
                this.spikes.splice(i, 1); 
            }
        }
        
        for(let i = this.spikes.length - 1; i >= 0; i--)
        {
            const spike = this.spikes[i];

            if(this.isColliding(spike, player, 45, 1))
            {
                spike.destroy();
                this.spikes.splice(i, 1);
                this.scene.get("movement").loseHealth(); 
            }

            for(let j = bullets.length - 1; j >= 0; j--)
            {
                const bullet = bullets[j];

                if(this.isColliding(spike, bullet, 1, 60))
                {
                    spike.destroy();
                    this.spikes.splice(i, 1);

                    bullet.destroy();
                    bullets.splice(j, 1);
                }
            }
        }

        if(timePassed > this.waveGap)
        {
            this.my.sprite.one.setVisible(false);
        }

        if(timePassed > this.waveGap * 2 + this.waveLength)
        {
            this.my.sprite.two.setVisible(false);
        }
        else if(timePassed > this.waveGap + this.waveLength)
        {
            this.my.sprite.two.setVisible(true);
        }

        if(timePassed > this.waveGap * 3 + this.waveLength * 2)
        {
            this.my.sprite.three.setVisible(false);
        }
        else if(timePassed > this.waveGap * 2 + this.waveLength * 2)
        {
            this.my.sprite.three.setVisible(true);
        }

    }
}