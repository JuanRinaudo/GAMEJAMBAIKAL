const SCENE_WIDTH = 800;
const SCENE_HEIGHT = 600;

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
    var logo = this.add.image(400, 150, 'logo');

    this.tweens.add({
        targets: logo,
        y: 450,
        duration: 2000,
        ease: 'Power2',
        //yoyo: true,
        //loop: -1,
        onComplete: function() { game.scene.switch("load", "play"); }//game.scene.start.bind(game.scene, "play")
  });
}
