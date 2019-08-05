'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _isPlaceholder(a) {
       return a != null && typeof a === 'object' && a['@@functional/placeholder'] === true;
}
var _isPlaceholder_1 = _isPlaceholder;

/**
 * Optimized internal one-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */


function _curry1(fn) {
  return function f1(a) {
    if (arguments.length === 0 || _isPlaceholder_1(a)) {
      return f1;
    } else {
      return fn.apply(this, arguments);
    }
  };
}
var _curry1_1 = _curry1;

/**
 * Optimized internal two-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */


function _curry2(fn) {
  return function f2(a, b) {
    switch (arguments.length) {
      case 0:
        return f2;
      case 1:
        return _isPlaceholder_1(a) ? f2 : _curry1_1(function (_b) {
          return fn(a, _b);
        });
      default:
        return _isPlaceholder_1(a) && _isPlaceholder_1(b) ? f2 : _isPlaceholder_1(a) ? _curry1_1(function (_a) {
          return fn(_a, b);
        }) : _isPlaceholder_1(b) ? _curry1_1(function (_b) {
          return fn(a, _b);
        }) : fn(a, b);
    }
  };
}
var _curry2_1 = _curry2;

function _isString(x) {
  return Object.prototype.toString.call(x) === '[object String]';
}
var _isString_1 = _isString;

/**
 * Returns the nth element of the given list or string. If n is negative the
 * element at index length + n is returned.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Number -> [a] -> a | Undefined
 * @sig Number -> String -> String
 * @param {Number} offset
 * @param {*} list
 * @return {*}
 * @example
 *
 *      const list = ['foo', 'bar', 'baz', 'quux'];
 *      R.nth(1, list); //=> 'bar'
 *      R.nth(-1, list); //=> 'quux'
 *      R.nth(-99, list); //=> undefined
 *
 *      R.nth(2, 'abc'); //=> 'c'
 *      R.nth(3, 'abc'); //=> ''
 * @symb R.nth(-1, [a, b, c]) = c
 * @symb R.nth(0, [a, b, c]) = a
 * @symb R.nth(1, [a, b, c]) = b
 */


var nth = /*#__PURE__*/_curry2_1(function nth(offset, list) {
  var idx = offset < 0 ? list.length + offset : offset;
  return _isString_1(list) ? list.charAt(idx) : list[idx];
});
var nth_1 = nth;

/**
 * Returns the last element of the given list or string.
 *
 * @func
 * @memberOf R
 * @since v0.1.4
 * @category List
 * @sig [a] -> a | Undefined
 * @sig String -> String
 * @param {*} list
 * @return {*}
 * @see R.init, R.head, R.tail
 * @example
 *
 *      R.last(['fi', 'fo', 'fum']); //=> 'fum'
 *      R.last([]); //=> undefined
 *
 *      R.last('abc'); //=> 'c'
 *      R.last(''); //=> ''
 */


var last = /*#__PURE__*/nth_1(-1);
var last_1 = last;

var options = {
  tileSize: 45,
  frameBorder: 12,
  frameWidth: 300,
  numColumns: 6,
  numRows: 18,
  numTiles: 5,
  startingRows: 5
};

var GameScene =
/*#__PURE__*/
function (_Phaser$Scene) {
  _inherits(GameScene, _Phaser$Scene);

  function GameScene() {
    _classCallCheck(this, GameScene);

    return _possibleConstructorReturn(this, _getPrototypeOf(GameScene).apply(this, arguments));
  }

  _createClass(GameScene, [{
    key: "preload",
    value: function preload() {
      this.load.image("frame", "assets/frame.png");
      this.load.spritesheet("tiles", "assets/sprites/tiles.png", {
        frameWidth: options.tileSize,
        frameHeight: options.tileSize
      });
    }
  }, {
    key: "create",
    value: function create() {
      this.originX = this.game.config.width / 2 + Math.floor((options.tileSize - options.frameWidth) / 2) + 7;
      this.originY = this.game.config.height - Math.floor(options.tileSize / 2) - options.frameBorder;
      var frameX = this.game.config.width / 2;
      var frameY = this.game.config.height / 2; // Playing Area frame

      this.add.image(frameX, frameY, "frame"); // Group of tiles with physics

      this.tileGroup = this.physics.add.group(); // create sprites and store matrix of tile data

      this.initiateGameMatrix();
    }
  }, {
    key: "initiateGameMatrix",
    value: function initiateGameMatrix() {
      this.gameMatrix = [];
      this.tilePool = [];

      for (var i = 0; i < options.startingRows; i++) {
        this.gameMatrix[i] = [];

        for (var j = 0; j < options.numColumns; j++) {
          // create tile
          // const rowOffset = this.gameMatrix.length - 1 - i
          var tile = this.createTile(this.originX + j * options.tileSize, this.originY - i * options.tileSize); // set random color to tile until no match is created

          do {
            var randomTile = Math.floor(Math.random() * options.numTiles);
            tile.setFrame(randomTile);
            this.gameMatrix[i][j] = {
              tileColor: randomTile,
              isActive: true
            };
          } while (this.isMatch(i, j));
        }
      }
    }
  }, {
    key: "createTile",
    value: function createTile(x, y) {
      var tile = this.tileGroup.create(x, y, "tiles");
      this.tileGroup.add(tile);
      tile.setVelocity(0, -10);
      return tile; // tile.setGravity(0, 60)
    }
  }, {
    key: "isMatch",
    value: function isMatch(row, col) {
      var horizMatch = this.isHorizontalMatch(row, col);

      if (horizMatch) {
        console.log("horiz match", row, col);
        return true;
      }

      var vertMatch = this.isVerticalMatch(row, col);

      if (vertMatch) {
        console.log("vert match", row, col);
        return true;
      }

      return false;
    }
  }, {
    key: "isHorizontalMatch",
    value: function isHorizontalMatch(row, col) {
      return this.tileAt(row, col).tileColor == this.tileAt(row, col - 1).tileColor && this.tileAt(row, col).tileColor == this.tileAt(row, col - 2).tileColor;
    }
  }, {
    key: "isVerticalMatch",
    value: function isVerticalMatch(row, col) {
      return this.tileAt(row, col).tileColor == this.tileAt(row - 1, col).tileColor && this.tileAt(row, col).tileColor == this.tileAt(row - 2, col).tileColor;
    }
  }, {
    key: "tileAt",
    value: function tileAt(row, col) {
      if (row < 0 || row >= options.numRows || col < 0 || col >= options.numColumns) {
        return -1;
      }

      return this.gameMatrix[row][col];
    } // addInactiveGameRow() {
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

  }, {
    key: "update",
    value: function update(time, delta) {
      var lastTileY = last_1(this.tileGroup.getChildren()).y;
      var isLastRowAboveFrame = this.originY - lastTileY > 0;

      if (isLastRowAboveFrame) {
        this.activateLastRow();
        this.checkRowMatches(this.gameMatrix.length - 1);
        this.addInactiveGameRow();
      }
    }
  }, {
    key: "activateLastRow",
    value: function activateLastRow() {
      last_1(this.gameMatrix).forEach(function (item) {
        item.isActive = true;
      });
      this.tileGroup.getChildren().forEach(function (tile) {
        if (tile.isTinted) {
          tile.clearTint();
        }
      });
    }
  }, {
    key: "checkRowMatches",
    value: function checkRowMatches(row) {
      for (var column = 0; column < options.numColumns; column++) {
        if (this.isMatch(row, column)) {
          console.log("match: ", row, column);
        }
      }
    }
  }, {
    key: "addInactiveGameRow",
    value: function addInactiveGameRow() {
      var row = [];
      this.gameMatrix.push(row);

      for (var j = 0; j < options.numColumns; j++) {
        // create tile
        // const rowOffset = this.gameMatrix.length - 1 - i
        var tile = this.createTile(this.originX + j * options.tileSize, this.originY + options.tileSize - 1); // set random color to tile until no match is created

        var randomTile = Math.floor(Math.random() * options.numTiles);
        tile.setFrame(randomTile);
        tile.setTint(0x888888);
        row[j] = {
          tileColor: randomTile,
          isActive: false
        };
      }
    }
  }]);

  return GameScene;
}(Phaser.Scene);

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 800,
  physics: {
    "default": "arcade",
    arcade: {
      gravity: {
        y: 0
      }
    }
  },
  scene: [GameScene]
};
var game = new Phaser.Game(config);
