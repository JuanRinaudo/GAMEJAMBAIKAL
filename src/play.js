var ship;
var playerProjectiles;
var babaProjectiles;
var monsterMinions;
var emitter0, emitter1;
var explosionEmitter;

var playerHealth;
var monsterHealth;
var damageTimeout = 0;

var monsterUIHealth;
var playerUIHealth;
var lastMonsterHit;
var lastMonsterRotation;

var spaceBar;
var left;
var right;

var speed;

var mainTheme;
var monsterScreamSound;
var lazerSound;
var explosionSound;
var winSound;
var looseSound;
var babaSound;
var minionSound;
var lazerHitSound;
var chargeHitSound;

var motorIdleSound;
var motorMovementSound;

var shootTimer;
var babaTimer;
var monsterTimer;

var ultimateTimer;
var ultimateCount;

var charging;

var runningAnimation;

var SHIP_FIRERATE = 500;
var SHIP_SPEED = 0.5;
var LAZER_SPEED = 0.6;

var MONSTER_HEALTH = 5;
var PLAYER_HEALTH = 5;
var LAZER_DAMAGE = 1;
var ENEMY_DAMAGE = 1;

var BABA_SPAWN_BASE_TIME = 1000;
var BABA_SPAWN_RANDOM_TIME = 500;
var MONSTER_SPAWN_BASE_TIME = 2000;
var MONSTER_SPAWN_RANDOM_TIME = 500;
var MONSTER_END_SEEK_Y = 0;

var HEALTH_ULTIMATE = 10;
var ULTIMATE_DELTA = 200;
var ULTIMATE_MINION_COUNT = 5;

var BABA_SPEED = 0.75;
var MINION_SPEED = 0.5;

var MONSTER_START_Y = -300;
var MONSTER_START_TIME = 800;

// var debug;

var play = {
    preload: function () {
        this.load.image('spark0', 'assets/blue.png');
        this.load.image('spark1', 'assets/red.png');
        this.load.image('explosion', 'assets/explosion00.png');

    },
    create: function () {
        MONSTER_END_SEEK_Y = SCENE_HEIGHT * 0.4;
        lastMonsterRotation = Date.now();
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
        babaSound = this.sound.add('Ataque baba');
        minionSound = this.sound.add('Ataque bichos');
        minionSound.loop = true;
        motorIdleSound = this.sound.add('Motor quieto');
        motorIdleSound.loop = true;
        motorMovementSound = this.sound.add('Motor movim loop');
        motorMovementSound.loop = true;
        lazerHitSound = this.sound.add('Impacto');
        chargeHitSound = this.sound.add('ataque carga');
        
        //add clouds

        monsterUIHealth = this.add.graphics(0, 0);

        console.log("Scene Play");
        monster = this.physics.add.sprite(SCENE_WIDTH / 2, 0, "monster");
        monster.y = monster.height / 2;

        ship = this.physics.add.sprite(game.canvas.width * 0.5, game.canvas.height - 48, 'ship');

        playerProjectiles = this.add.group();

        spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        speed = 0;
        shootTimer = 0;
        monsterHealth = MONSTER_HEALTH;
        playerHealth = PLAYER_HEALTH;

        ultimateTimer = 0;
        ultimateCount = 0;

        monsterUIHealth = this.add.graphics(0, 0);
        monsterUIHealth.fillStyle([0xFF0000]);
        monsterUIHealth.fillRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT * 0.025);

        playerUIHealth = this.add.graphics(0, 0);
        playerUIHealth.fillStyle([0x00FF00]);
        playerUIHealth.fillRect(0, SCENE_HEIGHT - SCENE_HEIGHT * 0.025, SCENE_WIDTH, SCENE_HEIGHT * 0.025);

        this.physics.add.overlap(monster, playerProjectiles, onMonsterHit);
        this.physics.add.overlap(monster, ship, onMonsterCatch);

        charging = false;
        runningAnimation = true;
        startAnimation(this);

        startSpawnBaba(this)
        startSpawnMonster(this);

        // debug = this.add.graphics(0, 0);
        // debug.lineStyle(5, 0xFF00FF, 1.0);
        emitter0 = this.add.particles('spark0').createEmitter({
            x: 400,
            y: 300,
            speed: { min: -800, max: 800 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.55, end: 0 },
            blendMode: 'SCREEN',
            active: false,
            lifespan: 700,
            gravityY: 800
        });

        emitter1 = this.add.particles('spark1').createEmitter({
            x: 400,
            y: 300,
            speed: { min: -800, max: 800 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.35, end: 0 },
            blendMode: 'SCREEN',
            active: false,
            lifespan: 400,
            gravityY: 800
        });
        
        explosionEmitter = this.add.particles('explosion').createEmitter({
            alpha: { start: 1, end: 0 },
            scale: { start: 0.5, end: 3.5 },
            speed: 20,
            accelerationY: -300,
            angle: { min: -85, max: -95 },
            rotate: { min: -180, max: 180 },
            lifespan: { min: 1000, max: 1100 },
            blendMode: 'ADD',
            quantity: 30,
            active: false,
            x: 400,
            y: 300
        });

    },
    update: function (time, deltaTime) {
        if(!runningAnimation) {
            monsterUIHealth.scaleX = monsterHealth / MONSTER_HEALTH;
            playerUIHealth.scaleX = playerHealth / PLAYER_HEALTH;

            shootTimer = Math.max(shootTimer - deltaTime, 0);
            if (spaceBar.isDown) {
                if (shootTimer == 0) {
                    fireLazer(this);
                    shootTimer = SHIP_FIRERATE;
                }
            }
            speed = (left.isDown ? -1 : 0 + right.isDown ? 1 : 0) * deltaTime * SHIP_SPEED;
            ship.x = Math.min(Math.max(ship.x + speed, 32), SCENE_WIDTH - 32);

            if(speed == 0) {
                motorMovementSound.pause();
                motorIdleSound.play();
            } else {
                motorIdleSound.pause();
                motorMovementSound.play();
            }

            var timestamp = Date.now()
            if (timestamp - lastMonsterHit < 300) {

                monster.tint = Math.random() * 0xFFFFFF;

            } else if (monster.tint != 0) {
                monster.tint = 0xFFFFFF;
            }

            if (timestamp - lastMonsterRotation >= (2000 + 2000 * Math.random())) {
                rotateMonster(this);
                lastMonsterRotation = timestamp
            }

            for (var i = 0; i < playerProjectiles.children.size; i++) {
                var lazer = playerProjectiles.children.entries[i];
                lazer.y -= deltaTime * LAZER_SPEED;
                if(lazer.y < -lazer.height) {
                    destroyPlayerProjectile(lazer);
                }
            }

            for (var i = 0; i < babaProjectiles.children.size; i++) {
                var enemy = babaProjectiles.children.entries[i];
                enemy.y += deltaTime * BABA_SPEED;
            }

            for (var i = 0; i < monsterMinions.children.size; i++) {
                var enemy = monsterMinions.children.entries[i];
                if (enemy.y < MONSTER_END_SEEK_Y) {
                    enemy.angle = Phaser.Math.Angle.Between(ship.x, ship.y, enemy.x, enemy.y);
                }
                var dx = Math.cos(enemy.angle) * deltaTime * MINION_SPEED;
                var dy = Math.sin(enemy.angle) * deltaTime * MINION_SPEED;
                enemy.x -= dx;
                enemy.y -= dy;
                if(enemy.y < MONSTER_END_SEEK_Y) {
                    enemy.angle = (enemy.angle - Math.PI * 0.5) * Phaser.Math.RAD_TO_DEG;
                }
                
                if(enemy.y > SCENE_HEIGHT + enemy.height) {
                    destroyMinion(enemy);
                }
            }

            if(!charging) {
                babaTimer = Math.max(babaTimer - deltaTime, 0);
                if (babaTimer == 0) {
                    babaTimer = getBabaSpawnTime();
                    spawnBaba(this);
                }

                monsterTimer = Math.max(monsterTimer - deltaTime, 0);
                if (monsterTimer == 0) {
                    monsterTimer = getBabaSpawnTime();
                    spawnMonster(this);
                }
            }

            if(!minionSound.isPlaying && monsterMinions.children.size > 0) {
                minionSound.play();
            } else if(minionSound.isPlaying && monsterMinions.children.size == 0) {
                minionSound.pause();
            }

            if(monsterHealth <= HEALTH_ULTIMATE && ultimateCount < ULTIMATE_MINION_COUNT) {
                ultimateTimer = Math.min(ultimateTimer + deltaTime, ULTIMATE_DELTA);
                if(ultimateTimer == ULTIMATE_DELTA) {
                    spawnMonster(this);
                    ultimateTimer = 0;
                    ultimateCount++;
                }
            }

            if (monsterHealth <= 0) {
                victory = true;
                explosionEmitter.setPosition(monster.x, monster.y);
                explosionEmitter.active = true;
                explosionEmitter.explode();
                runningAnimation = true;
                this.tweens.killAll();
                setTimeout(gameOver, 500);
            }

            if (playerHealth <= 0) {
                victory = false;
                gameOver();
            }
        }
        if (ship) {
            emitter0.setPosition(ship.x, ship.y);
            emitter1.setPosition(ship.x, ship.y);

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
    destroyPlayerProjectile(projectile);
    if (!monsterScreamSound.isPlaying) {
        monsterScreamSound.play();
    }
}

function destroyPlayerProjectile(projectile) {
    playerProjectiles.remove(projectile);
    projectile.destroy();

    lastMonsterHit = Date.now()
}

function onProjectileHit(enemy, projectile) {
    lazerHitSound.play();

    playerProjectiles.remove(projectile);
    projectile.destroy();

    babaProjectiles.remove(enemy);
    enemy.destroy();
}

function moveDownMonster(monster, scene, onComplete) {

    chargeHitSound.play();
    charging = true;

    scene.tweens.timeline({
        targets: monster,
        onComplete: onComplete,
        tweens: [
            {
                ease: 'Linear',
                duration: 500,
                y: 0
            },
            {
                duration: 700,
                ease: 'Power2',
                y: SCENE_HEIGHT * 0.8
            }, {
                duration: 1000,
                ease: 'Linear',
                y: monster.height / 2
            }
        ]

    });


}

function startAnimation(scene) {
    monster.y = MONSTER_START_Y;
    scene.tweens.add({
        targets: monster,
        y: monster.height / 2,
        duration: MONSTER_START_TIME,
        ease: 'Linear',
        onComplete: function () {
            runningAnimation = false;
            tweenMonster(monster, scene)
        }
    });
    ship.y = SCENE_HEIGHT + 128;
    scene.tweens.add({
        targets: ship,
        y: SCENE_HEIGHT - 48,
        duration: MONSTER_START_TIME * 0.5,
        ease: 'Linear'
    });
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

            if (Math.random() * 20 > 2) {
                tweenMonster(monster, scene);
            } else {
                moveDownMonster(monster, scene, chargeCompleted.bind(this, scene));
            }
        }
    });
}

function chargeCompleted(scene) {
    charging = false;
    tweenMonster(monster, scene);
}

function startSpawnBaba(scene) {
    babaProjectiles = scene.add.group();
    scene.physics.add.overlap(ship, babaProjectiles, onHeroHitBaba);

    babaTimer = getBabaSpawnTime();
}

function startSpawnMonster(scene) {
    monsterMinions = scene.add.group();
    scene.physics.add.overlap(ship, monsterMinions, onHeroHitMonster);

    monsterTimer = getMonsterSpawnTime();
}

function getBabaSpawnTime() {
    return Math.random() * BABA_SPAWN_RANDOM_TIME + BABA_SPAWN_BASE_TIME;
}

function getMonsterSpawnTime() {
    return Math.random() * MONSTER_SPAWN_RANDOM_TIME + MONSTER_SPAWN_BASE_TIME;
}

function spawnBaba(scene) {
    var enemy = scene.physics.add.sprite(monster.x + Math.random() * 32 - 16, monster.y + monster.height / 2, "baba");
    babaProjectiles.add(enemy);

    babaSound.play();

    babaTimer = getBabaSpawnTime();
}

function spawnMonster(scene) {
    var minion = scene.physics.add.sprite(monster.x + monster.width * (Math.random() * 0.6 - 0.3), monster.y + monster.height * (Math.random() * 0.6 - 0.3), "minion");
    //SCALE
    minion.setScale(0.75)
    monsterMinions.add(minion);
    scene.physics.add.overlap(minion, playerProjectiles, onProjectileHit);

    monsterTimer = getMonsterSpawnTime();
}

function onHeroHitBaba(ship, babaProjectile) {
    babaProjectiles.remove(babaProjectile);
    babaProjectile.destroy();
    onHeroHitted();
}

function onHeroHitted(multiplier = 1) {

    playerHealth -= ENEMY_DAMAGE * multiplier;
    emitter0.active = true;
    emitter1.active = true;
    emitter0.explode();
    emitter1.explode();

}

function onHeroHitMonster(ship, minion) {
    destroyMinion(minion);
    playerHealth -= ENEMY_DAMAGE;
    onHeroHitted();
}

function destroyMinion(minion) {
    monsterMinions.remove(minion);
    minion.destroy()
}

function addCloudsFX(scene) {
    for (var i = 1; i < 10; i++) {
        var y = (SCENE_HEIGHT / 5) * (Math.random() * 3 + 1)

        //vel = 10 * distance
        var randomOffset = 400 * Math.random() + SCENE_WIDTH * Math.random() * 0.5;
        var rightPos = SCENE_WIDTH + randomOffset + i * 500;
        var leftPos = -randomOffset - 100 - i * 500;

        var distance = Math.abs(Math.abs(rightPos) + Math.abs(leftPos));
        var cloud = scene.add.image(i % 2 == 1 ? rightPos : leftPos, y, 'cloud' + i);


        scene.tweens.add({
            targets: cloud,
            x: (i % 2 == 1) ? leftPos : rightPos,
            duration: 10 * distance,
            ease: 'Linear',
            yoyo: true,
            loop: -1
        });

    }
}

function rotateMonster(scene) {

    scene.tweens.add({
        targets: monster,
        angle: monster.angle + (Math.random() >= 0.5 ? -15 : 15),
        duration: 25,
        ease: 'Linear',
        yoyo: true,
        loop: 3
    });
}


function onMonsterCatch(monster, ship) {
    var time = Date.now();
    if (time - damageTimeout > 500) {

        damageTimeout = time;

        onHeroHitted(2);
    }
}

function gameOver() {
    motorIdleSound.stop();
    motorMovementSound.stop();
    mainTheme.stop();
    chargeHitSound.stop();

    monsterScreamSound.stop();
    lazerSound.stop();
    chargeHitSound.stop();
    winSound.stop();
    looseSound.stop();
    babaSound.stop();
    minionSound.stop();
    lazerHitSound.stop();
    
    game.scene.switch("play", "gameover");
    game.scene.stop("play");
}