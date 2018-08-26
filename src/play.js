
var ship;
var lazers = [];

var play = {
    preload: function () {
    },
    create: function () {
        //bg
        const divisions = 6;
        const colors = [0x1FC8DC,0x1EBCCF]
        var graphics = this.add.graphics(0, 0);
        for(var i = 0; i < divisions; i++) {
            graphics.fillStyle(colors[i%2]);
            var x = 0;
            var h = Math.round(SCENE_HEIGHT / divisions);
            var y = h * i;
            var w = SCENE_WIDTH;
            graphics.fillRect(x, y, w, h);
        }
        //end bg

        console.log("Scene Play");
        var monster = this.add.sprite(SCENE_WIDTH/2, 0, "monster");
        monster.y = monster.height/2;
        
        tweenMonster(monster,this)


        
        ship = this.add.image(game.canvas.width * 0.5, game.canvas.height - 64, 'ship');
    },
    update: function() {
        
        // lazers = this.add.image(400, 150, 'logo');
        if(true) {

        }
    }
}


function tweenMonster(monster, scene) {
    
    //var time = 1000;
    var velFactor = 4;
    
    var direction = ((monster.x > SCENE_WIDTH/2 ) ? -1 : 1)
    var distance =  direction * (Math.random() * SCENE_WIDTH * 0.25) + (direction * SCENE_WIDTH *.1);
    
    //to change vel use constraint time.
    var time = Math.abs(distance) * velFactor;
    
    scene.tweens.add({
            targets: monster,
            x: monster.x + distance,
            duration: time,
            ease: 'Linear',
            onComplete: function() { 
                tweenMonster(monster, scene); 
            }
        });
}
    