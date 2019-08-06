import GameScene from "./scenes/GameScene"
import PauseScene from "./scenes/PauseScene"

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
	scene: [GameScene, PauseScene]
}

const game = new Phaser.Game(config)
