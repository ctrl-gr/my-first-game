import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text : Phaser.GameObjects.Text;
    player: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    enemy: Phaser.GameObjects.Rectangle;
    controls: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor ()
    {
        super('Game');
    }

    preload ()
    {
        this.load.setBaseURL('http://localhost:8080');
        this.load.image('green_rectangle', 'assets/Green_rectangle.png');
        this.load.image('red_rectangle', 'assets/Red_rectangle.png');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        this.controls = this.input.keyboard!.createCursorKeys();

        this.player = this.physics.add.image(10,10, 'green_rectangle');
        this.enemy = this.add.rectangle(358, 358, 50, 50, 0xff0000);
        
    }

    update() {
        if (this.controls.left.isDown) {
            this.player.setVelocity(-30);
        } else if(this.controls.right.isDown) {
            this.player.setVelocity(30);
        }
        //set velocity enemy per coseno timestamp 
    }
}
