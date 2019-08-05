import GameScene from "./scenes/GameScene"

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 800,
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 0 }
		}
	},
	scene: [GameScene]
}

const game = new Phaser.Game(config)
