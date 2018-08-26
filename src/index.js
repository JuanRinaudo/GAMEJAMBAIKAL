const SCENE_WIDTH = 540;
const SCENE_HEIGHT = 640;

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: SCENE_WIDTH,
    height: SCENE_HEIGHT
};

var game = new Phaser.Game(config);
game.scene.add('load', {
        preload: preload,
        create: create
    });

game.scene.add('play', play);

game.scene.start('load');


function preload ()
{
    this.load.image('logo', 'assets/logo.png');
    this.load.image('monster', 'assets/Monster.png');
    this.load.image('lazer', 'assets/Lazer.png');
    this.load.image('ship', 'assets/Ship.png');

}

function create ()
{
    var logo = this.add.image(game.canvas.width * 0.5, -game.canvas.height * 0.5, 'logo');

    this.tweens.add({
        targets: logo,
        y: game.canvas.height * 0.5,
        duration: 1000,
        ease: 'Power2',
        onComplete: function() { game.scene.switch("load", "play"); }//game.scene.start.bind(game.scene, "play")
  });
}
