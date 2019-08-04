const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 800,
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: {
		preload: preload,
		create: create
	}
}

const game = new Phaser.Game(config)

function preload() {
	// this.load.setBaseURL("http://labs.phaser.io")

	this.load.image("frame", "assets/frame.png")
	this.load.image("tiles", "assets/sprites/tiles.png")
}

function create() {
	this.add.image(400, 400, "frame")
	// const particles = this.add.particles("red")
	// const emitter = particles.createEmitter({
	// 	speed: 100,
	// 	scale: { start: 1, end: 0 },
	// 	blendMode: "ADD"
	// })
	// const logo = this.physics.add.image(400, 100, "logo")
	// logo.setVelocity(100, 200)
	// logo.setBounce(1, 1)
	// logo.setCollideWorldBounds(true)
	// emitter.startFollow(logo)
}
