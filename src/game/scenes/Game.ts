import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text : Phaser.GameObjects.Text;
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    enemy: Phaser.GameObjects.Rectangle;
    obstacle: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    controls: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor ()
    {
        super('Game');
    }

    preload ()
    {
        this.load.setBaseURL('http://localhost:8080');
         this.load.spritesheet('cat', 'assets/cat.png', { frameWidth: 32, frameHeight: 32 });
         this.load.spritesheet('mushroom', 'assets/mushroom.png', { frameWidth: 80, frameHeight: 64 });
         this.load.spritesheet('plant', 'assets/plant.png', { frameWidth: 44, frameHeight: 42 });
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('cat'),
            frameRate: 16
        });
    
       
        this.controls = this.input.keyboard!.createCursorKeys();

        this.player = this.physics.add.sprite(10, 10, 'cat').setScale(2).setCollideWorldBounds(true);;
        this.player.body.setAllowGravity(false)
        this.player.play({ key: 'cat', repeat: -1 });
        
        this.enemy = this.add.rectangle(358, 358, 50, 50, 0xff0000);
        this.obstacle = this.physics.add.sprite(200, 200, 'plant').setCollideWorldBounds(true);
        this.obstacle.setPushable(false);
        this.obstacle.setData('type', 'obstacle');
        this.obstacle.body.setAllowGravity(false);
        
        
        this.input.on('pointerup', () =>
        {
            this.onShoot()
        });

    }

    update() {
        this.player.setVelocity(0,0);
        if (this.controls.left.isDown) {
            this.player.setVelocity(-30, 0);
        } else if(this.controls.right.isDown) {
            this.player.setVelocity(30, 0);
        }

        if (this.controls.space.isDown) {
            this.onShoot();
        }
        //set velocity enemy per coseno timestamp 
    }

    onShoot() {
            const mushroom = this.physics.add.sprite(this.player.x - 10, this.player.y -10, 'mushroom').setScale(0.8).setCollideWorldBounds(true);
            mushroom.setData('type', 'mushroom');
            this.physics.add.collider(mushroom, this.obstacle)
            this.physics.world.on('collide', (gameObject1: Phaser.GameObjects.GameObject, gameObject2: Phaser.GameObjects.GameObject) =>
        {
            if ((gameObject1.getData('type') !== 'obstacle') && (gameObject1.getData('type') !== 'mushroom')) {
                gameObject1.destroy();
            }

            if ((gameObject2.getData('type') !== 'obstacle') && (gameObject2.getData('type') !== 'mushroom')) {
                gameObject2.destroy();
            }
        });
    }
}
