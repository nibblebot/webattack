export default class GameScene extends Phaser.Scene {
	constructor() {
		super("pause")
	}
	create() {
		const graphics = this.add.graphics()

		graphics.fillStyle(0x000000, 0.5)
		graphics.fillRect(0, 0, this.game.config.width, this.game.config.height)

		this.add.text(10, 30, "Pause", {
			font: "16px Courier",
			fill: "#00ff00"
		})

		this.input.keyboard.once("keydown-P", () => {
			this.scene.stop()
			this.scene.resume("game")
		})
	}
}
