class GameOver extends Phaser.Scene {
    constructor()
    {
        super("over");

        this.my = {sprite: {}};

        this.bodyX = 300;
        this.bodyY = 350;
    }

   preload()
   {
        this.load.setPath("./assets/");
        this.load.atlasXML("words", "spritesheet_hud.png", "spritesheet_hud.xml");
   }
 
   
    create() 
    {
        my.sprite.gameOver = this.add.sprite(400, 100, "words", "text_gameover.png");
        my.sprite.playAgain = this.add.sprite(400, 350, "words", "text_ready.png");
        my.sprite.playAgain.setInteractive({useHandCursor: true});
        const score = this.scene.get("enimies").score;
        this.scoreText = this.add.text(260, 450, 'Score: ' + score, 
        {
            fontSize: '50px',
            fill: '#ADD8E6'
        });
    }

   
    update() 
    {   
        my.sprite.playAgain.on("pointerdown", () =>
        {
            this.scene.stop("over");
            this.scene.start("movement");
            this.scene.start("enimies"); 
            this.scene.get("movement").health = 3;
        })
    }
}