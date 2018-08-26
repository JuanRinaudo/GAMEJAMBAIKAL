var ship;
var lazers = [];

var play = {
    preload: function () {
    },
    create: function () {
        console.log("Scene Play");
        var monster = this.add.sprite(SCENE_WIDTH/2, 0, "monster");
        monster.y = monster.height/2;

        ship = this.add.image(game.canvas.width * 0.5, game.canvas.height - 64, 'ship');
    },
    update: function() {
        
        // lazers = this.add.image(400, 150, 'logo');
        if(true) {

        }
    }
}

