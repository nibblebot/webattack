import last from "ramda/src/last"
import head from "ramda/src/head"

const options = {
	tileSize: 45,
	tileDefaultSpeed: -10,
	tileFallSpeed: 60,
	frameBorder: 12,
	frameWidth: 300,
	numColumns: 6,
	numRows: 18,
	numTiles: 3,
	startingRows: 5,
	destroySpeed: 4000
}

const HORIZONTAL = 1
const VERTICAL = 2

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
					const randomColor = Math.floor(
						Math.random() * options.numTiles
					)
					tile.setFrame(randomColor)
					this.gameMatrix[i][j] = {
						tileColor: randomColor,
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
		if (!this.frozen) {
			tile.setVelocity(0, options.tileDefaultSpeed)
		}
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

	update() {
		const lastTileY = last(this.tileGroup.getChildren()).y
		const isLastRowAboveFrame = this.originY - lastTileY > 0
		if (isLastRowAboveFrame) {
			this.activateLastRow()
			if (this.boardHasMatches()) {
				this.resetMatches()
				const horizMatch = this.markMatches(HORIZONTAL)
				const vertMatch = this.markMatches(VERTICAL)
				if (horizMatch || vertMatch) {
					this.freezeTiles()
				}
				this.destroyMarkedTiles()
			}
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

	boardHasMatches() {
		for (let row = 0; row < this.gameMatrix.length; row++) {
			for (let col = 0; col < options.numColumns; col++) {
				if (this.isMatch(row, col)) {
					return true
				}
			}
		}
		return false
	}

	markMatches(direction) {
		let match = false
		let iMax
		let jMax
		// scan for horizontal with left->right inner loop
		if (direction === HORIZONTAL) {
			iMax = this.gameMatrix.length
			jMax = options.numColumns
		}
		// scan for vertical with top->bottom inner loop
		else {
			iMax = options.numColumns
			jMax = this.gameMatrix.length
		}

		for (let i = 0; i < iMax; i++) {
			let colorStreak = 1
			let colorToWatch
			let startStreak = 0
			let currentColor = -1
			for (let j = 0; j < jMax; j++) {
				// watch for current tile color
				colorToWatch =
					direction === HORIZONTAL
						? this.tileAt(i, j).tileColor
						: this.tileAt(j, i).tileColor

				// extend streak if match
				const colorMatch = colorToWatch === currentColor
				if (colorMatch) {
					colorStreak++
					// console.log(
					// 	direction === HORIZONTAL ? "HORIZONTAL" : "VERTICAL"
					// )
					// console.log("streak: ", colorStreak)
				}
				// if no match or on the edge
				if (!colorMatch || j === jMax - 1) {
					// ... and we already have a match
					if (colorStreak >= 3) {
						match = true
						// console.log(colorStreak + " combo!")
						for (let k = 0; k < colorStreak; k++) {
							const row =
								direction === HORIZONTAL ? i : startStreak + k
							const col =
								direction === HORIZONTAL ? startStreak + k : i

							// console.log("matching: ", row, col)
							this.matchMatrix[row][col]++
						}
					}
					startStreak = j
					colorStreak = 1
					currentColor = colorToWatch
				}
			}
		}
		return match
	}

	freezeTiles() {
		console.log("freezing tiles")
		this.frozen = true
		for (let row = 0; row < this.gameMatrix.length; row++) {
			for (let col = 0; col < options.numColumns; col++) {
				this.gameMatrix[row][col].tileSprite.setVelocity(0, 0)
			}
		}
	}

	unfreezeTiles() {
		console.log("unfreezing tiles")
		this.frozen = false
		for (let row = 0; row < this.gameMatrix.length; row++) {
			for (let col = 0; col < options.numColumns; col++) {
				this.gameMatrix[row][col].tileSprite.setVelocity(
					0,
					options.tileDefaultSpeed
				)
			}
		}
	}

	checkMatchingNeighbors() {}

	resetMatches() {
		this.matchMatrix = []
		const rows = this.gameMatrix.length
		const cols = this.gameMatrix[0].length
		for (let i = 0; i < rows; i++) {
			this.matchMatrix[i] = []
			for (let j = 0; j < cols; j++) {
				this.matchMatrix[i][j] = 0
			}
		}
	}

	destroyMarkedTiles() {
		let destroyed = 0
		for (let i = 0; i < this.gameMatrix.length; i++) {
			for (let j = 0; j < options.numColumns; j++) {
				if (this.matchMatrix[i][j] > 0) {
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
							this.gameMatrix[i][j].isEmpty = true
							if (destroyed == 0) {
								console.log("all matched tiles destroyed")
								this.makeTilesFall()
							}
						}
					})
				}
			}
		}
	}

	makeTilesFall() {
		let currentTile
		let falling = 0
		for (let i = this.gameMatrix.length - 2; i >= 0; i--) {
			for (let j = 0; j < options.numColumns; j++) {
				currentTile = this.gameMatrix[i][j]
				if (!currentTile.isEmpty) {
					let fallTiles = this.holesBelow(i, j)
					if (fallTiles > 0) {
						console.log("fall tiles: ", fallTiles)
						falling++
						console.log("falling:", falling)
						this.tweens.add({
							targets: currentTile.tileSprite,
							y: this.gameMatrix[i + fallTiles][j].tileSprite.y,

							// currentTile.tileSprite.y +
							// fallTiles * options.tileSize,
							duration: options.tileFallSpeed * fallTiles,
							callbackScope: this,
							onComplete: function() {
								falling--
								console.log("falling:", falling)
								if (falling === 0) {
									this.unfreezeTiles()
								}
							}
						})
						this.gameMatrix[i + fallTiles][j] = {
							tileSprite: currentTile.tileSprite,
							tileColor: currentTile.tileColor,
							isEmpty: false
						}
						currentTile.isEmpty = true
					}
				}
			}
		}
	}

	holesBelow(row, col) {
		let result = 0
		for (let i = row + 1; i < this.gameMatrix.length; i++) {
			if (this.gameMatrix[i][col].isEmpty) {
				result++
			}
		}
		return result
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
				tileSprite: tile,
				tileColor: randomTile,
				isActive: false
			}
		}
	}
}
