import last from "ramda/src/last"
import head from "ramda/src/head"
import TileMatcher from "../lib/TileMatcher"

const options = {
	debug: false,
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

export default class GameScene extends Phaser.Scene {
	constructor() {
		super("game")
	}
	preload() {
		this.load.image("debug-grid", "assets/debug-grid.png")
		this.load.image("frame", "assets/frame.png")
		this.load.spritesheet("tiles", "assets/sprites/tiles.png", {
			frameWidth: options.tileSize,
			frameHeight: options.tileSize
		})
		this.load.bitmapFont(
			"atari-classic",
			"assets/fonts/bitmap/atari-classic-black.png",
			"assets/fonts/bitmap/atari-classic.xml"
		)
	}

	create() {
		this.frameWidth = 312
		this.debugGridWidth = 270
		this.debugGridHeight = 765
		this.debugSprites = []
		this.debugSpritePool = []

		// Playing Area frame
		this.add.image(
			this.frameWidth / 2,
			this.game.config.height / 2,
			"frame"
		)

		if (options.debug) {
			this.add.image(
				this.frameWidth + this.debugGridWidth / 2,
				this.game.config.height / 2,
				"debug-grid"
			)
		}

		this.originX =
			this.frameWidth / 2 +
			Math.floor((options.tileSize - options.frameWidth) / 2) +
			7
		this.originY =
			this.game.config.height -
			Math.floor(options.tileSize / 2) -
			options.frameBorder

		this.tilePool = []

		// Group of tiles with physics
		this.tileGroup = this.physics.add.group()

		this.matcher = new TileMatcher(options.startingRows, options.numColumns)

		// create sprites and store matrix of tile data
		this.initializeGameMatrix()
		if (options.debug) {
			this.renderDebug()
		}
		this.input.keyboard.on("keydown-P", this.pause, this)
	}

	initializeGameMatrix() {
		for (let i = 0; i < options.startingRows; i++) {
			this.matcher.setRow(i, [])
			for (let j = 0; j < this.matcher.numColumns(); j++) {
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
					this.matcher.setTile(i, j, {
						tileColor: randomColor,
						tileSprite: tile,
						isActive: true,
						isEmpty: false
					})
				} while (this.matcher.isMatch(i, j))
			}
		}
	}

	renderDebug() {
		// recycle any existing sprites
		let recycleSprite
		while ((recycleSprite = this.debugSprites.pop())) {
			this.debugSpritePool.push(
				recycleSprite
					.setText("")
					.setX(0)
					.setY(0)
					.setVisible(false)
			)
		}

		// render debug grid
		// for (let row = 0; row < this.gameMatrix.length; row++) {
		for (let row = this.matcher.numRows() - 1; row >= 0; row--) {
			for (let col = 0; col < this.matcher.numColumns(); col++) {
				let sprite
				const x = this.frameWidth + 6 + options.tileSize * col
				const y =
					this.game.config.height -
					56 -
					// options.tileSize * row
					options.tileSize * (this.matcher.numRows() - 1 - row)
				let text = this.matcher.tileAt(row, col).tileColor
				if (text === -1) {
					text = "-"
				}

				if (this.debugSpritePool.length) {
					sprite = this.debugSpritePool.pop()
					sprite
						.setX(x)
						.setY(y)
						.setText(text)
						.setVisible(true)
				} else {
					sprite = this.add.bitmapText(
						x,
						y,
						"atari-classic",
						text,
						32
					)
				}
				this.debugSprites.push(sprite)
			}
		}
	}

	// TODO: use tilePool to recycle sprites
	createTile(x, y) {
		const tile = this.tileGroup.create(x, y, "tiles")
		if (!this.frozen) {
			tile.setVelocity(0, options.tileDefaultSpeed)
		}
		return tile
	}

	pause() {
		this.scene.pause()
		this.scene.run("pause")
	}

	update() {
		const lastRow = this.matcher.getLastRow()
		const lastTileY = lastRow[0].tileSprite.y
		const isLastRowAboveFrame = this.originY - lastTileY > 0
		if (isLastRowAboveFrame) {
			if (options.debug) {
				this.renderDebug()
			}
			this.activateLastRow()
			if (this.matcher.checkMatches()) {
				this.freezeTiles()
				this.destroyMarkedTiles()
					.then(() => this.makeTilesFall())
					.then(() => {
						this.unfreezeTiles()
						// this.renderDebug()
					})
			}
			this.addInactiveGameRow()
		}
	}

	activateLastRow() {
		this.matcher.getLastRow().forEach(item => {
			item.isActive = true
			if (item.tileSprite.isTinted) {
				item.tileSprite.clearTint()
			}
		})
	}

	freezeTiles() {
		this.frozen = true
		for (let row = 0; row < this.matcher.numRows(); row++) {
			for (let col = 0; col < this.matcher.numColumns(); col++) {
				this.matcher.tileAt(row, col).tileSprite.setVelocity(0, 0)
			}
		}
	}

	unfreezeTiles() {
		this.frozen = false
		for (let row = 0; row < this.matcher.numRows(); row++) {
			for (let col = 0; col < this.matcher.numColumns(); col++) {
				this.matcher
					.tileAt(row, col)
					.tileSprite.setVelocity(0, options.tileDefaultSpeed)
			}
		}
	}

	destroyMarkedTiles() {
		return new Promise(resolve => {
			let destroyed = 0
			for (let i = 0; i < this.matcher.numRows(); i++) {
				for (let j = 0; j < this.matcher.numColumns(); j++) {
					if (this.matcher.hasMatch(i, j) > 0) {
						destroyed++
						this.tweens.add({
							targets: this.matcher.tileAt(i, j).tileSprite,
							alpha: 0.5,
							duration: options.destroySpeed,
							callbackScope: this,
							onComplete: function() {
								destroyed--

								const tile = this.matcher.tileAt(i, j)
								tile.tileSprite.visible = false
								tile.isEmpty = true
								this.tilePool.push(tile.tileSprite)
								if (destroyed == 0) {
									resolve()
								}
							}
						})
					}
				}
			}
		})
	}

	makeTilesFall() {
		return new Promise(resolve => {
			let currentTile
			let falling = 0
			let hasFalling = false
			for (let i = this.matcher.numRows() - 2; i >= 0; i--) {
				for (let j = 0; j < this.matcher.numColumns(); j++) {
					currentTile = this.matcher.tileAt(i, j)
					if (!currentTile.isEmpty) {
						let fallTiles = this.holesBelow(i, j)
						if (fallTiles > 0) {
							hasFalling = true
							falling++
							this.tweens.add({
								targets: currentTile.tileSprite,
								y: this.matcher.tileAt(i + fallTiles, j)
									.tileSprite.y,
								duration: options.tileFallSpeed * fallTiles,
								callbackScope: this,
								onComplete: function() {
									falling--
									if (falling === 0) {
										resolve()
									}
								}
							})
							this.matcher.setTile(i + fallTiles, j, {
								tileSprite: currentTile.tileSprite,
								tileColor: currentTile.tileColor,
								isEmpty: false
							})
							currentTile.isEmpty = true
							currentTile.tileColor = -1
						}
					}
				}
			}
			if (!hasFalling) {
				resolve()
			}
		})
	}

	holesBelow(row, col) {
		let result = 0
		for (let i = row + 1; i < this.matcher.numRows(); i++) {
			if (this.matcher.tileAt(i, col).isEmpty) {
				result++
			}
		}
		return result
	}

	addInactiveGameRow() {
		const row = []
		for (let j = 0; j < this.matcher.numColumns(); j++) {
			// create tile
			const tileSprite = this.createTile(
				this.originX + j * options.tileSize,
				this.originY + options.tileSize - 1
			)

			// set random color to tile
			const tileColor = Math.floor(Math.random() * options.numTiles)
			tileSprite.setFrame(tileColor)
			// set inactive tint
			tileSprite.setTint(0x888888)

			row[j] = {
				tileSprite,
				tileColor,
				isActive: false
			}
		}
		this.matcher.addRow(row)
	}
}
