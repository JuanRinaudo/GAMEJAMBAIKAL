const SCENE_WIDTH = 540;
const SCENE_HEIGHT = 640;
const TEXT_TIMEOUT = 50;
const END_TIMEOUT = 2000;

var timerId;
var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: SCENE_WIDTH,
    height: SCENE_HEIGHT,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    }
};

var game = new Phaser.Game(config);
game.scene.add('load', {
    preload: preload,
    create: create
});

game.scene.add('play', play);
game.scene.add('gameover', {
    create: createGameOver
});

game.scene.start('load');


function preload() {
    this.load.image('monster', 'assets/Monster.png');
    this.load.image('lazer', 'assets/Lazer.png');
    this.load.image('ship', 'assets/Ship.png');

}

function create() {
    var fillText = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."

    var PADDING = 5;
    var style = { font: 'bold 15pt Arial', fill: 'white', align: 'left', wordWrap: { width: SCENE_WIDTH - PADDING * 2, useAdvancedWrap: false } };


    var graphics = this.add.graphics(0, 0);
    graphics.fillStyle(0);

    graphics.fillRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);
    graphics.setInteractive();

    var text = this.add.text(0, 0, "", style);
    addText(text, fillText);

    //graphics.on('gameobjectdown', changeState);
    this.input.keyboard.on("keydown", changeState);
}


function addText(textFill, fillText) {
    if (textFill.text != fillText) {
        var nextText = fillText.slice(0, textFill.text.length + 1);
        textFill.setText(nextText);
        timerId = setTimeout(addText.bind(this, textFill, fillText), TEXT_TIMEOUT);
    } else {
        timerId = setTimeout(changeState, END_TIMEOUT);
    }
}


function changeState() {
    clearTimeout(timerId)
    game.scene.switch("load", "play");
}


function gameOver(){
    game.scene.switch("play", "gameover");
}


function restartGame(){
    game.scene.switch("gameover", "play");
}