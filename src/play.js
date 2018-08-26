var ship;
var playerProjectiles;
var babaProjectiles;

var playerHealth;
var monsterHealth;

var monsterUIHealth;
var playerUIHealth;

var spaceBar;
var left;
var right;

var mainTheme;
var monsterScreamSound;
var lazerSound;
var explosionSound;
var winSound;
var looseSound;

var shootTimer;
var babaTimer;

var SHIP_FIRERATE = 250;
var SHIP_SPEED = 0.5;
var LAZER_SPEED = 0.6;

var MONSTER_HEALTH = 50;
var PLAYER_HEALTH = 5;
var LAZER_DAMAGE = 1;
var ENEMY_DAMAGE = 1;

var BABA_SPAWN_BASE_TIME = 1000;
var BABA_SPAWN_RANDOM_TIME = 500;

var play = {
    preload: function () {
    },
    create: function () {
        //bg
        const divisions = 6;
        const colors = [0x1FC8DC, 0x1EBCCF]
        var graphics = this.add.graphics(0, 0);
        for (var i = 0; i < divisions; i++) {
            graphics.fillStyle(colors[i % 2]);
            var x = 0;
            var h = Math.round(SCENE_HEIGHT / divisions);
            var y = h * i;
            var w = SCENE_WIDTH;
            graphics.fillRect(x, y, w, h);
        }
        //end bg
        addCloudsFX(this);

        mainTheme = this.sound.add('MainTheme');
        mainTheme.loop = true;
        mainTheme.play();
        monsterScreamSound = this.sound.add('Rugido');
        lazerSound = this.sound.add('Laser');
        explosionSound = this.sound.add('Explosion');
        winSound = this.sound.add('Winner');
        looseSound = this.sound.add('Loser');

        //add clouds


        console.log("Scene Play");
        monster = this.physics.add.sprite(SCENE_WIDTH / 2, 0, "monster");
        monster.y = monster.height / 2;

        tweenMonster(monster, this)

        ship = this.physics.add.sprite(game.canvas.width * 0.5, game.canvas.height - 48, 'ship');

        playerProjectiles = this.add.group();

        spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        shootTimer = 0;
        monsterHealth = MONSTER_HEALTH;
        playerHealth = PLAYER_HEALTH;

        monsterUIHealth = this.add.graphics(0, 0);
        monsterUIHealth.fillStyle([0xFF0000]);
        monsterUIHealth.fillRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT * 0.05);

        playerUIHealth = this.add.graphics(0, 0);
        playerUIHealth.fillStyle([0x00FF00]);
        playerUIHealth.fillRect(0, SCENE_HEIGHT - SCENE_HEIGHT * 0.05, SCENE_WIDTH, SCENE_HEIGHT * 0.05);


        this.physics.add.overlap(monster, playerProjectiles, onMonsterHit);

        startSpawnBaba(this)
    },
    update: function (time, deltaTime) {
        monsterUIHealth.scaleX = monsterHealth / MONSTER_HEALTH;
        playerUIHealth.scaleX = playerHealth / PLAYER_HEALTH;

        shootTimer = Math.max(shootTimer - deltaTime, 0);
        if(spaceBar.isDown) {
            if(shootTimer == 0) {
                fireLazer(this);
                shootTimer = SHIP_FIRERATE;
            }
        }
        var speed = (left.isDown ? -1 : 0 + right.isDown ? 1 : 0) * deltaTime * SHIP_SPEED;
        ship.x = Math.min(Math.max(ship.x + speed, 32), SCENE_WIDTH - 32);

        for (var i = 0; i < playerProjectiles.children.size; i++) {
            var lazer = playerProjectiles.children.entries[i];
            lazer.y -= deltaTime * LAZER_SPEED;
        }

        for (var i = 0; i < babaProjectiles.children.size; i++) {
            var enemy = babaProjectiles.children.entries[i];
            enemy.y += deltaTime * 0.75;
        }

        babaTimer = Math.max(babaTimer - deltaTime, 0);
        if(babaTimer == 0) {
            babaTimer = getBabaSpawnTime();
            spawnbaba(this);
        }

        if (monsterHealth <= 0) {
            gameOver();
        }

        if (playerHealth <= 0) {
            gameOver();
        }

    }
}

function fireLazer(context) {
    var lazer = context.physics.add.sprite(ship.x, ship.y, 'lazer');
    playerProjectiles.add(lazer);
    lazerSound.play();
}

function onMonsterHit(monster, projectile) {
    monsterHealth--;
    playerProjectiles.remove(projectile);
    projectile.destroy();
    if(!monsterScreamSound.isPlaying) {
        monsterScreamSound.play();
    }
}


function onProjectileHit(enemy, projectile) {
    playerProjectiles.remove(projectile);
    projectile.destroy();

    babaProjectiles.remove(enemy);
    enemy.destroy();
}

function tweenMonster(monster, scene) {

    //var time = 1000;
    var velFactor = 4;

    var direction = ((monster.x > SCENE_WIDTH / 2) ? -1 : 1)
    var distance = direction * (Math.random() * SCENE_WIDTH * 0.25) + (direction * SCENE_WIDTH * .1);

    //to change vel use constraint time.
    var time = Math.abs(distance) * velFactor;

    scene.tweens.add({
        targets: monster,
        x: monster.x + distance,
        duration: time,
        ease: 'Linear',
        onComplete: function () {
            tweenMonster(monster, scene);
        }
    });
}


function startSpawnBaba(scene) {
    babaProjectiles = scene.add.group();
    scene.physics.add.overlap(ship, babaProjectiles, onHeroHit);

    babaTimer = getBabaSpawnTime();
}

function getBabaSpawnTime() {
    return Math.random() * BABA_SPAWN_RANDOM_TIME + BABA_SPAWN_BASE_TIME;
}

function spawnbaba(scene) {
    var enemy = scene.physics.add.sprite(monster.x + Math.random() * 32 - 16, monster.y + monster.height / 2, "baba");
    //SCALE
    enemy.setScale(0.75)
    babaProjectiles.add(enemy);
    // scene.physics.add.overlap(enemy, playerProjectiles, onProjectileHit);

    babaTimer = getBabaSpawnTime();
}

function onHeroHit(ship, babaProjectile) {
    babaProjectiles.remove(babaProjectile);

    babaProjectile.destroy()
    playerHealth -= ENEMY_DAMAGE;
}

function addCloudsFX(scene) {


}

//TODO 
//enemies spawn pattern