const SCENE_WIDTH = 540;
const SCENE_HEIGHT = 640;
const TEXT_TIMEOUT = 50;
const END_TIMEOUT = 2000;

const CAN_RESTART_TIME = 500;

var victory = false;

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

var introTheme;

var game = new Phaser.Game(config);
game.scene.add('load', {
    preload: preload,
    create: create
});

game.scene.add('play', play);
game.scene.add('gameover', {
    create: createGameOver,
    update: gameOverUpdate
});

game.scene.start('load');


function preload() {
    this.load.image('minion', 'assets/Minion.png');
    this.load.image('monster', 'assets/Monster.png');
    this.load.image('lazer', 'assets/Lazer.png');
    this.load.image('ship', 'assets/Ship.png');
    this.load.image('baba', 'assets/Baba.png');

    loadAudios(this, [
        "MainTheme", "Winner", "Loser", "Laser", "Explosion", "Rugido", "EnterMonster", "IntroTheme", "Ataque baba", "Ataque bichos", "Impacto", "Motor movim loop", "Motor quieto", "ataque carga"
    ]);
    for (var i = 1; i < 10; i++) {
        this.load.image('cloud' + i, 'assets/cloud' + i + '.png');
    }
}

function loadAudios(context, audios) {
    for(var i = 0; i < audios.length; i++) {
        var audioName = audios[i];
        context.load.audio(audioName, [
            'assets/'+ audioName +'.ogg'//,
            // 'assets/'+ audioName + '.wav'
        ]);        
    }
}

function create() {
    introTheme = this.sound.add('IntroTheme');
    introTheme.play();
    
    var logo = this.add.image(game.canvas.width * 0.5, -game.canvas.height * 0.5, 'logo');
    var fillText = "En el año 2420, los niveles de contaminación del riachuelo alcanzaron niveles críticos, y el gobierno del presidente Menem tercero declaró estado de emergencia regional.\n" +
    "A partir de ese día, la ciudad permaneció en cuarentena.\n" +
    "Varias décadas más tarde, estudios científicos y expediciones al epicentro de la catástrofe probaron lo increíble. Insectos que consumían el agua contaminada a diario sufrieron cambios en su estructura genetica y evolucionaron en monstruos hambrientos de carne humana.\n" +
    "Los únicos que pueden defendernos son del Regimiento Armado Insecticida del Delta (R.A.I.D.).\n" +
    "El futuro de la argentinidad es aún incierto...\n";

    var PADDING = 5;
    var style = { font: 'bold 15pt Arial', fill: 'white', align: 'left', wordWrap: { width: SCENE_WIDTH - PADDING * 2, useAdvancedWrap: false } };


    var graphics = this.add.graphics(0, 0);
    graphics.fillStyle(0);

    graphics.fillRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);
    graphics.setInteractive();

    var text = this.add.text(0, 0, "", style);
    addText(text, fillText);

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
    introTheme.stop();
    clearTimeout(timerId)
    game.scene.switch("load", "play");
    game.scene.stop("load");
}