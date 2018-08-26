

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
    }
}

