var ship;
var playerProjectiles;
var monsterProjectiles;

var playerHealth = 0;
var monsterHealth = 0;

var spaceBar;
var left;
var right;

var cursors;

var shootTimer = 0;
var SHIP_FIRERATE = 100;
var SHIP_SPEED = 0.5;

var MONSTER_HEALTH = 100;
var PLAYER_HEALTH = 5;
var LAZER_DAMAGE = 1;

var play = {
    preload: function () {
    },
    create: function () {
        console.log("Scene Play");
        var monster = this.add.sprite(SCENE_WIDTH/2, 0, "monster");
        monster.y = monster.height/2;

        ship = this.add.sprite(game.canvas.width * 0.5, game.canvas.height - 64, 'ship');
        
        playerProjectiles = this.add.group();
        spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        cursors = this.input.keyboard.createCursorKeys();
    },
    update: function(time, deltaTime) {
        if(spaceBar.isDown) {
            shootTimer += deltaTime;
            if(shootTimer > SHIP_FIRERATE) {
                var lazer = this.add.sprite(ship.x, ship.y, 'lazer');
                playerProjectiles.add(lazer);
                shootTimer = 0;
            }
        }
        var speed = (left.isDown ? -1 : 0 + right.isDown ? 1 : 0) * deltaTime * SHIP_SPEED;
        ship.x = Math.min(Math.max(ship.x + speed, 32), SCENE_WIDTH - 32);

        for(var i = 0; i < playerProjectiles.children.size; i++) {
            var lazer = playerProjectiles.children.entries[i];
            lazer.y -= deltaTime;
        }
    }
}

