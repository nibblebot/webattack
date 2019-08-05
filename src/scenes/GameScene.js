import last from "ramda/src/last"
import head from "ramda/src/head"

const options = {
	tileSize: 45,
	tileSpeed: -10,
	frameBorder: 12,
	frameWidth: 300,
	numColumns: 6,
	numRows: 18,
	numTiles: 5,
	startingRows: 5
}

export default class GameScene extends Phaser.Scene {
	preload() {
		this.load.image("frame", "assets/frame.png")
		this.load.spritesheet("tiles", "assets/sprites/tiles.png", {
			frameWidth: options.tileSize,
			frameHeight: options.tileSize
		})
	}

	create() {
		this.originX =
			this.game.config.width / 2 +
			Math.floor((options.tileSize - options.frameWidth) / 2) +
			7
		this.originY =
			this.game.config.height -
			Math.floor(options.tileSize / 2) -
			options.frameBorder
		const frameX = this.game.config.width / 2
		const frameY = this.game.config.height / 2

		// Playing Area frame
		this.add.image(frameX, frameY, "frame")

		// Group of tiles with physics
		this.tileGroup = this.physics.add.group()

		// create sprites and store matrix of tile data
		this.initiateGameMatrix()
	}
	initiateGameMatrix() {
		this.gameMatrix = []
		this.tilePool = []
		for (let i = 0; i < options.startingRows; i++) {
			this.gameMatrix[i] = []
			for (let j = 0; j < options.numColumns; j++) {
				// create tile
				// const rowOffset = this.gameMatrix.length - 1 - i
				const tile = this.createTile(
					this.originX + j * options.tileSize,
					this.originY -
						(options.startingRows - i - 1) * options.tileSize
				)

				// set random color to tile until no match is created
				do {
					const randomTile = Math.floor(
						Math.random() * options.numTiles
					)
					tile.setFrame(randomTile)
					this.gameMatrix[i][j] = {
						tileColor: randomTile,
						isActive: true
					}
				} while (this.isMatch(i, j))
			}
		}
	}
	createTile(x, y) {
		const tile = this.tileGroup.create(x, y, "tiles")
		this.tileGroup.add(tile)
		tile.setVelocity(0, options.tileSpeed)
		return tile
		// tile.setGravity(0, 60)
	}

	isMatch(row, col) {
		const horizMatch = this.isHorizontalMatch(row, col)
		if (horizMatch) {
			console.log("horiz match", row, col)
			return true
		}
		const vertMatch = this.isVerticalMatch(row, col)
		if (vertMatch) {
			console.log("vert match", row, col)
			return true
		}
		return false
	}
	isHorizontalMatch(row, col) {
		return (
			this.tileAt(row, col).tileColor ==
				this.tileAt(row, col - 1).tileColor &&
			this.tileAt(row, col).tileColor ==
				this.tileAt(row, col - 2).tileColor
		)
	}
	isVerticalMatch(row, col) {
		return (
			this.tileAt(row, col).tileColor ==
				this.tileAt(row - 1, col).tileColor &&
			this.tileAt(row, col).tileColor ==
				this.tileAt(row - 2, col).tileColor
		)
	}
	tileAt(row, col) {
		if (
			row < 0 ||
			row >= options.numRows ||
			col < 0 ||
			col >= options.numColumns
		) {
			return -1
		}
		return this.gameMatrix[row][col]
	}

	// addInactiveGameRow() {
	// 	this.gameMatrix.push([])
	// 	for (
	// 		let columnIndex = 0;
	// 		columnIndex < options.numColumns;
	// 		columnIndex++
	// 	) {
	// 		const randomTile = Math.floor(Math.random() * options.numTiles)
	// 		last(this.gameMatrix).push({
	// 			value: randomTile,
	// 			isActive: false
	// 		})
	// 	}
	// }
	// renderInactiveTileRow(row) {
	// 	for (let column = 0; column < options.numColumns; column++) {
	// 		this.createTile(
	// 			this.originX + column * options.tileSize,
	// 			this.originY + 1 * options.tileSize - 1
	// 		)
	// 	}
	// }

	update(time, delta) {
		const lastTileY = last(this.tileGroup.getChildren()).y
		const isLastRowAboveFrame = this.originY - lastTileY > 0
		if (isLastRowAboveFrame) {
			this.activateLastRow()
			this.checkRowMatches(this.gameMatrix.length - 1)
			this.addInactiveGameRow()
		}
	}

	activateLastRow() {
		last(this.gameMatrix).forEach(item => {
			item.isActive = true
		})
		this.tileGroup.getChildren().forEach(tile => {
			if (tile.isTinted) {
				tile.clearTint()
			}
		})
	}

	checkRowMatches(row) {
		for (let column = 0; column < options.numColumns; column++) {
			if (this.isMatch(row, column)) {
				console.log("match: ", row, column)
			}
		}
	}

	addInactiveGameRow() {
		const row = []
		this.gameMatrix.push(row)
		for (let j = 0; j < options.numColumns; j++) {
			// create tile
			// const rowOffset = this.gameMatrix.length - 1 - i
			const tile = this.createTile(
				this.originX + j * options.tileSize,
				this.originY + options.tileSize - 1
			)

			// set random color to tile until no match is created
			const randomTile = Math.floor(Math.random() * options.numTiles)
			tile.setFrame(randomTile)
			tile.setTint(0x888888)
			row[j] = {
				tileColor: randomTile,
				isActive: false
			}
		}
	}
}
