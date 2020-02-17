var player, platforms, cursors, lamp, recObject;

function preload () {
    // ========== <ONLY IT IMPORTS TO ILLUMINATED.JS PLUGIN> ==========
    this.load.scenePlugin({
        key: "IlluminatedJS",
        url: "illuminated.p3.js",
        sceneKey: "illuminated"
    });
    // ========== </ONLY IT IMPORTS TO ILLUMINATED.JS PLUGIN> ==========

    this.load.image("sky", "sky.png");
    this.load.image("ground", "platform.png");
    this.load.spritesheet("dude", "dude.png", { frameWidth: 32, frameHeight: 48 });
};

function create () {

    notImportantToIlluminatedPlugin[0](this);

    // ========== <ONLY IT IMPORTS TO ILLUMINATED.JS PLUGIN> ==========

    // lamps array
    this.lamps = [];

    // lamp object: x, y and config (only use rgba in color)
    // read the article for check to all possible configs:
    // http://greweb.me/2012/05/illuminated-js-2d-lights-and-shadows-rendering-engine-for-html5-applications/
    // 0.2 recommended color alpha
    lamp = this.illuminated.createLamp(
    150, 
    170, {
        distance: 200,
        diffuse: 0.8,
        color: "rgba(255, 255, 255, 0.9)", // 0.2
        radius: 0,
        samples: 1,
        angle: 0,
        roughness: 0
    });

    // add to lamps array
    this.lamps.push(lamp);

    // not recommended to disable occlusion culling,
    // but if you want just put this flag to false
    // as default the occlusion culling is set to true ->
    // this.illuminated.occlusionCulling = true;

    // only use rgba in color, and the width and height must all you world size
    // in rgba alpha I recommend to use 0.7 (but not in that case)
    const mask = this.illuminated.createDarkMask(this.lamps, {
        width: 800,
        height: 600,
    }, "rgba(0, 0, 0, 0.2)");

    // x, y, width, height
    recObject = this.illuminated.createRectangleObject(0, 0, 16, 24);
    // you can use this.illuminated.createDiscObject(centerX, centerY, radius) too

    // add to create lighting in lamp (the must be a array, if you want to create a lot
    // of recObjects that's ok)
    for (let i = 0; i < this.lamps.length; i ++)
        this.lamps[i].createLighting([recObject]);

    // ========== </ONLY IT IMPORTS TO ILLUMINATED.JS PLUGIN> ==========

};

function update () {

    notImportantToIlluminatedPlugin[1]();

    // ========== <ONLY IT IMPORTS TO ILLUMINATED.JS PLUGIN> ==========

    // make the shadows follow the player
    // the 200 value must be the lamp distance
    recObject.originalX = player.x - 200; // lamp.lamp.distance
    recObject.originalY = player.y - 200; // lamp.lamp.distance

    // ========== </ONLY IT IMPORTS TO ILLUMINATED.JS PLUGIN> ==========
};

const notImportantToIlluminatedPlugin = [
    scene => {
        scene.add.image(400, 300, "sky");

        platforms = scene.physics.add.staticGroup();

        platforms.create(400, 568, "ground").setScale(2).refreshBody();


        player = scene.physics.add.sprite(100, 450, "dude");

        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        scene.anims.create({
            key: "left",
            frames: scene.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: "turn",
            frames: [ { key: "dude", frame: 4 } ],
            frameRate: 20
        });

        scene.anims.create({
            key: "right",
            frames: scene.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        cursors = scene.input.keyboard.createCursorKeys();

        scene.physics.add.collider(player, platforms);
    },
    scene => {

        if (cursors.left.isDown) {
            player.setVelocityX(-160);

            player.anims.play("left", true);
        } else if (cursors.right.isDown) {
            player.setVelocityX(160);

            player.anims.play("right", true);
        } else {
            player.setVelocityX(0);

            player.anims.play("turn");
        };

        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-330);
        };
    }
];

const game = new Phaser.Game({
    // unfortunately, illuminated.js plugin only works with WebGL
    type: Phaser.WEBGL,
    parent: "phaser-illuminated",
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload,
        create,
        update
    }
});