var gameOverTime;
var fanfarea;

function createGameOver() {
    var string = "";
    if(victory) {
        fanfarea = this.sound.add('Winner');
        string = "¡Felicidades!\nTe otorgaron una medalla por tus acciones heroicas,\npero aún queda mucho por hacer...";
    } else {
        fanfarea = this.sound.add('Loser');
        string = "El R.A.I.D. aún te necesita ¡No te rindas!";
    }
    fanfarea.play();

    var style = { font: 'bold 15pt Arial', fill: 'white', align: 'center' } ;
    var text = this.add.text(SCENE_WIDTH/2, SCENE_HEIGHT/2, string, style);
    text.x = SCENE_WIDTH/2 - text.width/2;
    text.y = SCENE_HEIGHT/2 - text.height/2;

    this.input.keyboard.on("keydown", restartGame);

    gameOverTime = 0;
}

function gameOverUpdate(time, deltaTime) {
    gameOverTime += deltaTime;
}

function restartGame() {
    if(gameOverTime > CAN_RESTART_TIME) {
        fanfarea.stop();
        game.scene.switch("gameover", "play");
        game.scene.stop("gameover");
    }
}