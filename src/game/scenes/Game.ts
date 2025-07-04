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
    projectiles: Phaser.Physics.Arcade.Sprite[] = [];
    path: Phaser.Curves.Path;
    graphics: Phaser.GameObjects.Graphics
    follower: any;

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

        this.player = this.physics.add.sprite(10, 10, 'cat').setScale(2).setCollideWorldBounds(true);
        this.player.body.setAllowGravity(false)
        this.player.play({ key: 'cat', repeat: -1 });

        this.enemy = this.add.rectangle(358, 358, 50, 50, 0xff0000);
        this.physics.add.existing(this.enemy);
        (this.enemy.body as Phaser.Physics.Arcade.Body).setImmovable(true);
        (this.enemy.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
        this.enemy.setData('type', 'enemy');
        this.enemy.setData('life', 3);

        this.obstacle = this.physics.add.sprite(200, 200, 'plant').setCollideWorldBounds(true);
        this.obstacle.setPushable(false);
        this.obstacle.setData('type', 'obstacle');
        this.obstacle.body.setAllowGravity(false);

        this.graphics = this.add.graphics();
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        this.path = new Phaser.Curves.Path(465, 761);
        this.path.lineTo(546,541);
        this.path.lineTo(530,333);
        this.path.lineTo(332,230);
        this.path.lineTo(208,174);
        this.path.lineTo(173,64);

            this.tweens.add({
            targets: this.follower,
            t: 1,
            ease: 'Sine.easeInOut',
            duration: 4000,
            yoyo: true,
            repeat: -1
        });

        this.input.on('pointerup', () =>
        {
            this.onShoot()
        });

        this.input.on('pointerdown', (event: Phaser.Input.Pointer) => {
            console.log('x and y', event.x, event.y);
        })
    }

    createPath() {
        // todo
    }

    randomizePath() {
        // draw paths and switch between them randomly
        // paths with platforms
    }

    update() {
        this.graphics.clear();
        this.graphics.lineStyle(2, 0xffffff, 1);

        this.path.draw(this.graphics);

        this.path.getPoint(this.follower.t, this.follower.vec);
        this.enemy.x = this.follower.vec.x
        this.enemy.y = this.follower.vec.y

        this.player.setVelocity(0,0);
        if (this.controls.left.isDown) {
            this.player.setVelocity(-100, 0);
        } else if(this.controls.right.isDown) {
            this.player.setVelocity(100, 0);
        }

        if (Phaser.Input.Keyboard.JustDown(this.controls.space)) {
            this.onShoot();
        }
        //set velocity enemy per coseno timestamp 
    }

    onShoot() {
        const mushroom = this.physics.add.sprite(this.player.x - 10, this.player.y -10, 'mushroom')
            .setScale(0.8)
            .setCollideWorldBounds(true);
        mushroom.setVelocityY(150);
        mushroom.setData('type', 'mushroom');
        this.projectiles.push(mushroom);

        // Collider ostacolo
        this.physics.add.collider(mushroom, this.obstacle, (mushroomObj, obstacleObj) => {
            console.log('COLPITO OSTACOLO!', obstacleObj);
            mushroomObj.destroy();
        });

        // Collider nemico
        this.physics.add.collider(mushroom, this.enemy, (mushroomObj, enemyObj) => {
            console.log('COLPITO NEMICO!', enemyObj);
            mushroomObj.destroy();

            const enemy = enemyObj as Phaser.GameObjects.GameObject;
            const life = enemy.getData('life');
            enemy.setData('life', life - 1);
            if(enemy.getData('life') <= 0) {
                enemy.destroy();
                console.log('NEMICO DISTRUTTO!');
            }
        });
    }
}
