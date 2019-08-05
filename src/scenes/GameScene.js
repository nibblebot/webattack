const options = {
	tileSize: 45,
	frameBorder: 12,
	frameWidth: 300,
	numColumns: 6,
	numTiles: 5
}

export default class GameScene extends Phaser.Scene {
	preload() {
		// this.load.setBaseURL("http://labs.phaser.io")

		this.load.image("frame", "assets/frame.png")
		this.load.spritesheet("tiles", "assets/sprites/tiles.png", {
			frameWidth: options.tileSize,
			frameHeight: options.tileSize
		})
	}

	create() {
		const frameX = this.game.config.width / 2
		const frameY = this.game.config.height / 2
		this.add.image(frameX, frameY, "frame")
		this.playArea = this.add.container(frameX, frameY)
		this.createTileMatrix()
		this.addTileRows(5)
		this.renderTiles()
	}
	createTileMatrix() {
		this.tileMatrix = []
	}
	addTileRows(numRows) {
		for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
			this.addTileRow()
		}
	}
	addTileRow() {
		const row = []
		for (let rowIndex = 0; rowIndex < options.numColumns; rowIndex++) {
			const randomTile = Math.floor(Math.random() * options.numTiles)
			row.push({
				value: randomTile,
				isActive: true
			})
		}
		this.tileMatrix.push(row)
	}
	renderTiles() {
		const x = Math.floor((options.tileSize - options.frameWidth) / 2) + 7
		const y =
			this.game.config.height / 2 -
			Math.floor(options.tileSize / 2) -
			options.frameBorder

		for (
			let columnIndex = 0;
			columnIndex < options.numColumns;
			columnIndex++
		) {
			for (
				let rowIndex = 0;
				rowIndex < this.tileMatrix.length;
				rowIndex++
			) {
				const sprite = this.add.sprite(
					x + columnIndex * options.tileSize,
					y - rowIndex * options.tileSize,
					"tiles",
					this.tileMatrix[rowIndex][columnIndex].value
				)
				this.playArea.add(sprite)
			}
		}
	}
	update(time, delta) {
		this.playArea.y -= 0.1
	}
}
