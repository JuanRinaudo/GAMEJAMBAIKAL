



function createGameOver() {
    var style = { font: 'bold 15pt Arial', fill: 'white', align: 'center' } ;
    var text = this.add.text(SCENE_WIDTH/2, SCENE_HEIGHT/2, "GAME OVER", style);
    text.x = SCENE_WIDTH/2 - text.width/2 
}
