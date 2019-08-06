import last from "ramda/src/last"
import head from "ramda/src/head"

const options = {
	tileSize: 45,
	tileSpeed: -10,
	frameBorder: 12,
	frameWidth: 300,
	numColumns: 6,
	numRows: 18,
	numTiles: 3,
	startingRows: 5,
	destroySpeed: 200
}

export default class GameScene extends Phaser.Scene {
	constructor() {
		super("game")
	}
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

		this.poolArray = []

		const frameX = this.game.config.width / 2
		const frameY = this.game.config.height / 2

		// Playing Area frame
		this.add.image(frameX, frameY, "frame")

		// Group of tiles with physics
		this.tileGroup = this.physics.add.group()

		// create sprites and store matrix of tile data
		this.initializeGameMatrix()
		this.input.keyboard.on("keydown-P", this.pause, this)
	}

	update() {
		const lastTileY = last(this.tileGroup.getChildren()).y
		const isLastRowAboveFrame = this.originY - lastTileY > 0
		if (isLastRowAboveFrame) {
			this.activateLastRow()
			// this.checkRowMatches(this.gameMatrix.length - 1)
			this.addInactiveGameRow()
		}
	}

	initializeGameMatrix() {
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
						tileSprite: tile,
						isActive: true,
						isEmpty: false
					}
				} while (this.isMatch(i, j))
			}
		}
	}

	createTile(x, y) {
		const tile = this.tileGroup.create(x, y, "tiles")
		this.tileGroup.add(tile)
		tile.setVelocity(0, options.tileSpeed)
		// tile.setGravity(0, 60)
		return tile
	}

	isMatch(row, col) {
		const horizMatch = this.isHorizontalMatch(row, col)
		if (horizMatch) {
			return true
		}
		const vertMatch = this.isVerticalMatch(row, col)
		if (vertMatch) {
			return true
		}
		return false
	}

	tileAt(row, col) {
		if (
			row < 0 ||
			row >= this.gameMatrix.length ||
			col < 0 ||
			col >= options.numColumns
		) {
			return -1
		}
		return this.gameMatrix[row][col]
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

	pause() {
		this.scene.pause()
		this.scene.run("pause")
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
		let isHorizMatch = false
		let markedArray = []
		for (let col = 0; col < options.numColumns; col++) {
			if (this.isHorizontalMatch(row, col)) {
				isHorizMatch = true
				markedArray.push([row, col], [row, col - 1], [row, col - 2])
				if (
					this.tileAt(row, col).tileColor ==
					this.tileAt(row, col - 3).tileColor
				) {
					markedArray.push([row, col - 3])
					if (
						this.tileAt(row, col).tileColor ==
						this.tileAt(row, col - 4).tileColor
					) {
						markedArray.push([row, col - 4])
						if (
							this.tileAt(row, col).tileColor ==
							this.tileAt(row, col - 5).tileColor
						) {
							markedArray.push([row, col - 5])
						}
					}
				}
				// this.markHorizonalMatch(row, column)
			}
			// if (this.isVerticalMatch(row, column)) {
			// 	this.markVerticalMatch(row, column)
			// }
		}
		if (isHorizMatch) {
			this.resetMarkedMatrix()

			let markedTile
			do {
				markedTile = markedArray.pop()
				if (markedTile) {
					const [row, col] = markedTile
					this.markedMatrix[row][col] = 1

					// for horiz match, check row above for connected colors
					const tile = this.gameMatrix[row][col]
					const matchColor = tile.tileColor
					if (this.tileAt(row - 1, col).tileColor === matchColor) {
						if (!this.markedMatrix[row - 1][col]) {
							markedArray.push([row - 1, col])
						}
					}
					if (this.tileAt(row + 1, col).tileColor === matchColor) {
						if (!this.markedMatrix[row + 1][col]) {
							markedArray.push([row + 1, col])
						}
					}
					if (this.tileAt(row, col - 1).tileColor === matchColor) {
						if (!this.markedMatrix[row][col - 1]) {
							markedArray.push([row, col - 1])
						}
					}
					if (this.tileAt(row, col + 1).tileColor === matchColor) {
						if (!this.markedMatrix[row][col + 1]) {
							markedArray.push([row, col + 1])
						}
					}
				}
			} while (markedTile)
			this.destroyMarkedTiles()
		}
	}
	resetMarkedMatrix() {
		this.markedMatrix = []
		const rows = this.gameMatrix.length
		const cols = this.gameMatrix[0].length
		for (let i = 0; i < rows; i++) {
			this.markedMatrix[i] = []
			for (let j = 0; j < cols; j++) {
				this.markedMatrix[i][j] = 0
			}
		}
	}
	debugMarkedTiles() {
		console.log("marked tiles")
		let row
		for (let i = 0; i < this.markedMatrix.length; i++) {
			row = ""
			for (let j = 0; j < options.numColumns; j++) {
				row += this.markedMatrix[i][j]
			}
			console.log(row)
		}
	}

	destroyMarkedTiles() {
		console.log("match")
		// this.debugMarkedTiles()
		let destroyed = 0
		for (let i = 0; i < this.gameMatrix.length; i++) {
			for (let j = 0; j < options.numColumns; j++) {
				if (this.markedMatrix[i][j] > 0) {
					destroyed++
					this.tweens.add({
						targets: this.gameMatrix[i][j].tileSprite,
						alpha: 0.5,
						duration: options.destroySpeed,
						callbackScope: this,
						onComplete: function() {
							destroyed--
							this.gameMatrix[i][j].tileSprite.visible = false
							this.poolArray.push(
								this.gameMatrix[i][j].tileSprite
							)
							if (destroyed == 0) {
								// this.makeTilesFall()
							}
						}
					})
					this.gameMatrix[i][j].isEmpty = true
				}
			}
		}
	}
	// makeGemsFall() {
	// 	for (let i = gameOptions.fieldSize - 2; i >= 0; i--) {
	// 		for (let j = 0; j < gameOptions.fieldSize; j++) {
	// 			if (!this.gameArray[i][j].isEmpty) {
	// 				let fallTiles = this.holesBelow(i, j)
	// 				if (fallTiles > 0) {
	// 					this.tweens.add({
	// 						targets: this.gameArray[i][j].gemSprite,
	// 						y:
	// 							this.gameArray[i][j].gemSprite.y +
	// 							fallTiles * gameOptions.gemSize,
	// 						duration: gameOptions.fallSpeed * fallTiles
	// 					})
	// 					this.gameArray[i + fallTiles][j] = {
	// 						gemSprite: this.gameArray[i][j].gemSprite,
	// 						gemColor: this.gameArray[i][j].gemColor,
	// 						isEmpty: false
	// 					}
	// 					this.gameArray[i][j].isEmpty = true
	// 				}
	// 			}
	// 		}
	// 	}
	// }
	// holesBelow(row, col) {
	// 	let result = 0
	// 	for (let i = row + 1; i < gameOptions.fieldSize; i++) {
	// 		if (this.gameArray[i][col].isEmpty) {
	// 			result++
	// 		}
	// 	}
	// 	return result
	// }

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
				tileSprite: tile,
				tileColor: randomTile,
				isActive: false
			}
		}
	}
}
