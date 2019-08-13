export default class TileMatcher {
	constructor(numRows, numColumns) {
		// this.initialRows = initialRows
		this._columns = numColumns
		this.grid = []
		this.matches = []
	}
	getLastRow() {
		return this.grid[this.grid.length - 1]
	}
	setRow(row, value) {
		this.grid[row] = value
	}
	addRow(row) {
		this.grid.push(row)
	}
	numRows() {
		return this.grid.length
	}
	numColumns() {
		return this._columns
	}
	setTile(row, col, tile) {
		this.grid[row][col] = tile
	}

	isMatch(row, col) {
		const horizMatch = this.isHorizontalMatch(row, col)
		if (horizMatch) {
			return true
		}
		// const vertMatch = this.isVerticalMatch(row, col)
		// if (vertMatch) {
		// 	return true
		// }
		return false
	}

	isHorizontalMatch(row, col) {
		// return (
		// 	this.grid[row][col].tileColor ==
		// 		this.grid[row][col - 1].tileColor &&
		// 	this.grid[row][col].tileColor == this.grid[row][col - 2].tileColor
		// )
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
			row >= this.grid.length ||
			col < 0 ||
			col >= this.numColumns()
		) {
			return -1
		}
		return this.grid[row][col]
	}

	checkMatches() {
		if (!this.hasMatches()) {
			return false
		}
		this.resetMatches()
		return this.markHorizontalMatches()
	}

	hasMatches() {
		for (let i = 0; i < this.grid.length; i++) {
			for (let j = 0; j < this.numColumns(); j++) {
				if (this.isMatch(i, j)) {
					return true
				}
			}
		}
	}

	resetMatches() {
		this.matches = []
		for (let i = 0; i < this.grid.length; i++) {
			this.matches[i] = []
			for (let j = 0; j < this.numColumns(); j++) {
				this.matches[i][j] = 0
			}
		}
	}

	markHorizontalMatches() {
		let match = false
		for (let i = 0; i < this.grid.length; i++) {
			let colorStreak = 1
			let colorToWatch = 0
			let startStreak = 0
			let currentColor = -2
			for (let j = 0; j < this.numColumns(); j++) {
				// watch for current tile color
				colorToWatch = this.tileAt(i, j).tileColor

				// skip empty tiles
				if (colorToWatch < 0) {
					startStreak = 0
					colorStreak = 1
					continue
				}

				// extend streak if match
				const colorMatch = colorToWatch === currentColor
				if (colorMatch) {
					colorStreak++
				}
				// if no match or on the edge
				if (!colorMatch || j === this.numColumns() - 1) {
					// ... and we already have a match
					if (colorStreak >= 3) {
						console.log("streak: ", colorStreak)
						match = true
						for (let k = 0; k < colorStreak; k++) {
							this.matches[i][startStreak + k]++
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

	hasMatch(row, col) {
		return this.matches[row][col]
	}

	checkMatchingNeighbors() {}
}
