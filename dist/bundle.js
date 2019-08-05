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

var options = {
  tileSize: 45,
  frameBorder: 12,
  frameWidth: 300,
  numColumns: 6,
  numTiles: 5
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
      // this.load.setBaseURL("http://labs.phaser.io")
      this.load.image("frame", "assets/frame.png");
      this.load.spritesheet("tiles", "assets/sprites/tiles.png", {
        frameWidth: options.tileSize,
        frameHeight: options.tileSize
      });
    }
  }, {
    key: "create",
    value: function create() {
      var frameX = this.game.config.width / 2;
      var frameY = this.game.config.height / 2;
      this.add.image(frameX, frameY, "frame");
      this.playArea = this.add.container(frameX, frameY);
      this.createTileMatrix();
      this.addTileRows(5);
      this.renderTiles();
    }
  }, {
    key: "createTileMatrix",
    value: function createTileMatrix() {
      this.tileMatrix = [];
    }
  }, {
    key: "addTileRows",
    value: function addTileRows(numRows) {
      for (var rowIndex = 0; rowIndex < numRows; rowIndex++) {
        this.addTileRow();
      }
    }
  }, {
    key: "addTileRow",
    value: function addTileRow() {
      var row = [];

      for (var rowIndex = 0; rowIndex < options.numColumns; rowIndex++) {
        var randomTile = Math.floor(Math.random() * options.numTiles);
        row.push({
          value: randomTile,
          isActive: true
        });
      }

      this.tileMatrix.push(row);
    }
  }, {
    key: "renderTiles",
    value: function renderTiles() {
      var x = Math.floor((options.tileSize - options.frameWidth) / 2) + 7;
      var y = this.game.config.height / 2 - Math.floor(options.tileSize / 2) - options.frameBorder;

      for (var columnIndex = 0; columnIndex < options.numColumns; columnIndex++) {
        for (var rowIndex = 0; rowIndex < this.tileMatrix.length; rowIndex++) {
          var sprite = this.add.sprite(x + columnIndex * options.tileSize, y - rowIndex * options.tileSize, "tiles", this.tileMatrix[rowIndex][columnIndex].value);
          this.playArea.add(sprite);
        }
      }
    }
  }, {
    key: "update",
    value: function update(time, delta) {
      this.playArea.y -= 0.1;
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
        y: 200
      }
    }
  },
  scene: [GameScene]
};
var game = new Phaser.Game(config);
