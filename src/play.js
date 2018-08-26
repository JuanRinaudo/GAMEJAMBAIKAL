var monsterSpawnerID;
var ship;
var playerProjectiles;
var monsterProjectiles;

var playerHealth;
var monsterHealth;

var monsterUIHealth;

var spaceBar;
var left;
var right;

var monster;
var shootTimer;
var SHIP_FIRERATE = 100;
var SHIP_SPEED = 0.5;

var MONSTER_HEALTH = 50;
var PLAYER_HEALTH = 5;
var LAZER_DAMAGE = 1;

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

        console.log("Scene Play");
        monster = this.physics.add.sprite(SCENE_WIDTH / 2, 0, "monster");
        monster.y = monster.height / 2;

        tweenMonster(monster, this)

        ship = this.physics.add.sprite(game.canvas.width * 0.5, game.canvas.height - 64, 'ship');

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


        this.physics.add.overlap(monster, playerProjectiles, onMonsterHit);

        startSpawnMonster(this)
    },
    update: function (time, deltaTime) {
        monsterUIHealth.scaleX = monsterHealth / MONSTER_HEALTH;

        if (spaceBar.isDown) {
            shootTimer += deltaTime;
            if (shootTimer > SHIP_FIRERATE) {
                var lazer = this.physics.add.sprite(ship.x, ship.y, 'lazer');
                playerProjectiles.add(lazer);
                shootTimer = 0;
            }
        }
        var speed = (left.isDown ? -1 : 0 + right.isDown ? 1 : 0) * deltaTime * SHIP_SPEED;
        ship.x = Math.min(Math.max(ship.x + speed, 32), SCENE_WIDTH - 32);

        for (var i = 0; i < playerProjectiles.children.size; i++) {
            var lazer = playerProjectiles.children.entries[i];
            lazer.y -= deltaTime;
        }

        
        for (var i = 0; i < monsterProjectiles.children.size; i++) {
            var enemy = monsterProjectiles.children.entries[i];
            enemy.y += deltaTime * 0.75;
        }

        if (monsterHealth <= 0) {
            this.scene.restart();
            clearTimeout(monsterSpawnerID);
        }
    }
}

function onMonsterHit(monster, projectile) {
    monsterHealth--;
    playerProjectiles.remove(projectile);
    projectile.destroy();
    console.log(monsterHealth);
}


function onProjectileHit(enemy, projectile) {
    playerProjectiles.remove(projectile);
    projectile.destroy();
    
    monsterProjectiles.remove(enemy);
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


function startSpawnMonster(scene) {
    monsterProjectiles = scene.add.group();
    scene.physics.add.overlap(ship, monsterProjectiles, onHeroHit);
    
    spawnMonster(scene);
}

function spawnMonster(scene) {
    var enemy = scene.physics.add.sprite(monster.x, monster.y + monster.height / 2, "monster");
    //SCALE
    enemy.setScale(0.2)
    monsterProjectiles.add(enemy);
    scene.physics.add.overlap(enemy, playerProjectiles, onProjectileHit);

    monsterSpawnerID = setTimeout(spawnMonster.bind(this, scene), Math.random() * 1000 + 500);
}

function onHeroHit() {
    playerHealth -= 5;
    console.log("GAME OVER");
}


//TODO 
//Player health
//enemies spawn pattern