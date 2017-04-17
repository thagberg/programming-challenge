(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.jiboProgrammingChallenge = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var PIXI = require('pixi.js');
var direction_1 = require('./direction');
var Arrow = (function () {
    function Arrow(a, b, c, color) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.color = color;
        this.direction = direction_1.Direction.Down;
        this.graphics = new PIXI.Graphics();
    }
    Arrow.prototype.draw = function (width, height) {
        // Rotate the arrow by a set number of radians, depending on which
        // direction it should be facing
        this.graphics.rotation = (90 * Math.PI / 180) * this.direction;
        this.graphics.scale.x = width / 100;
        this.graphics.scale.y = height / 100;
        this.graphics.x = width / 2;
        this.graphics.y = height / 2;
        this.graphics.beginFill(this.color, 1);
        this.graphics.drawPolygon([this.a[0], this.a[1],
            this.b[0], this.b[1],
            this.c[0], this.c[1]]);
        this.graphics.endFill();
    };
    return Arrow;
}());
exports.Arrow = Arrow;
},{"./direction":4,"pixi.js":undefined}],2:[function(require,module,exports){
"use strict";
var PIXI = require('pixi.js');
var checker_1 = require('./checker');
var util_1 = require('./util');
var piece_1 = require('./piece');
var Board = (function () {
    function Board(numRows, numColumns, renderer) {
        this.checkers = [];
        this.graphics = new PIXI.Graphics();
        this.numRows = numRows;
        this.numColumns = numColumns;
        this.resize(renderer);
        this.createCheckers();
        this.chosenSpot = this.checkers[Math.floor(Math.random() * this.checkers.length)][Math.floor(Math.random() * this.checkers[0].length)];
        this.checkerPiece = new piece_1.Piece(this.chosenSpot, this.checkerWidth / 2.3, 0xBB0000);
        this.graphics.addChildAt(this.checkerPiece.graphics, 1);
    }
    Board.prototype.resize = function (renderer) {
        if (this.graphics.children && this.graphics.children.length) {
            this.graphics.removeChildAt(0);
        }
        var cellSize = util_1.Helpers.getCellsize(this.numColumns, this.numRows, renderer.width, renderer.height);
        this.checkerWidth = cellSize;
        this.checkerHeight = cellSize;
        this.createCheckerBoard();
        if (this.checkerPiece) {
            this.checkerPiece.r = this.checkerWidth / 2.3;
        }
    };
    Board.prototype.createCheckerBoard = function () {
        var newBoard = new PIXI.Graphics();
        newBoard.beginFill(0x9f6bc4, 1);
        var startRow = true;
        for (var i = 0; i < this.numRows; i++) {
            for (var j = 0; j < this.numColumns; j++) {
                if ((j % 2 == 0) == startRow) {
                    newBoard.beginFill(0x9f6bc4, 1);
                }
                else {
                    newBoard.beginFill(0x5552b2, 1);
                }
                newBoard.drawRect(j * this.checkerWidth, i * this.checkerHeight, this.checkerWidth, this.checkerHeight);
            }
            startRow = !startRow;
        }
        newBoard.endFill();
        this.checkerBoard = new PIXI.Sprite(newBoard.generateCanvasTexture());
        this.graphics.addChildAt(this.checkerBoard, 0);
    };
    Board.prototype.createCheckers = function () {
        this.checkers = [];
        for (var i = 0; i < this.numRows; i++) {
            this.checkers[i] = [];
            for (var j = 0; j < this.numColumns; j++) {
                var newChecker = new checker_1.Checker(i, j, j * this.checkerWidth, i * this.checkerHeight, this.checkerWidth, this.checkerHeight);
                newChecker.arrow.direction = util_1.Helpers.getRandomDirection();
                this.checkers[i][j] = newChecker;
                this.graphics.addChild(this.checkers[i][j].graphics);
            }
        }
    };
    Board.prototype.draw = function () {
        this.checkerPiece.draw();
        for (var i = 0; i < this.checkers.length; i++) {
            var row = this.checkers[i];
            for (var j = 0; j < row.length; j++) {
                var checker = row[j];
                checker.draw(j * this.checkerWidth, i * this.checkerHeight, this.checkerWidth, this.checkerHeight);
            }
        }
    };
    Board.prototype.shuffleArrows = function () {
        for (var _i = 0, _a = this.checkers; _i < _a.length; _i++) {
            var row = _a[_i];
            for (var _b = 0, row_1 = row; _b < row_1.length; _b++) {
                var checker = row_1[_b];
                checker.arrow.direction = util_1.Helpers.getRandomDirection();
                checker.reset();
            }
        }
    };
    return Board;
}());
exports.Board = Board;
},{"./checker":3,"./piece":7,"./util":9,"pixi.js":undefined}],3:[function(require,module,exports){
"use strict";
var PIXI = require('pixi.js');
var direction_1 = require('./direction');
var arrow_1 = require('./arrow');
var Checker = (function () {
    function Checker(row, column, x, y, width, height) {
        this.row = row;
        this.column = column;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.graphics = new PIXI.Graphics();
        this.graphics.x = this.x;
        this.graphics.y = this.y;
        this.graphics.width = this.width;
        this.graphics.height = this.height;
        this.arrow = new arrow_1.Arrow([-9, -12.5], [0, 12.5], [9, -12.5], 0x3f3f3f);
        this.arrow.direction = direction_1.Direction.Right;
        this.graphics.addChild(this.arrow.graphics);
        this.touched = false;
    }
    Checker.prototype.touch = function () {
        this.touched = true;
        this.arrow.color = 0x008800;
    };
    Checker.prototype.reset = function () {
        this.touched = false;
        this.arrow.color = 0x3f3f3f;
    };
    Checker.prototype.draw = function (x, y, width, height) {
        this.graphics.x = x;
        this.graphics.y = y;
        this.graphics.width = width;
        this.graphics.height = height;
        this.arrow.draw(width, height);
    };
    return Checker;
}());
exports.Checker = Checker;
},{"./arrow":1,"./direction":4,"pixi.js":undefined}],4:[function(require,module,exports){
"use strict";
(function (Direction) {
    Direction[Direction["Down"] = 0] = "Down";
    Direction[Direction["Left"] = 1] = "Left";
    Direction[Direction["Up"] = 2] = "Up";
    Direction[Direction["Right"] = 3] = "Right";
})(exports.Direction || (exports.Direction = {}));
var Direction = exports.Direction;
},{}],5:[function(require,module,exports){
/// <reference path="../typings/index.d.ts" />
"use strict";
var PIXI = require('pixi.js');
var Howler = require('howler');
var board_1 = require('./board');
var direction_1 = require('./direction');
var state_1 = require('./state');
var UPDATE_TIME = 25;
var Game = (function () {
    function Game(renderer) {
        this.watchTime = 0;
        this.numColumns = 12;
        this.numRows = 6;
        this.scale = new PIXI.Point(1, 1);
        this.slidingSound = new Howler.Howl({
            src: 'Sliding.mp3'
        });
    }
    Game.prototype.gameLoop = function (deltaTime) {
        // doing quarter-second "turns"
        var newState = state_1.GameState.Continue;
        this.watchTime += deltaTime;
        if (this.watchTime >= UPDATE_TIME) {
            newState = this.update();
            this.watchTime = 0;
        }
        this.board.checkerPiece.update(deltaTime);
        return newState;
    };
    Game.prototype.update = function () {
        var newGameState = state_1.GameState.Continue;
        var currentSpot = this.board.checkerPiece.spot;
        var newSpot;
        var foundEdge = false;
        switch (currentSpot.arrow.direction) {
            case (direction_1.Direction.Down):
                if (currentSpot.row != this.numRows - 1) {
                    newSpot = this.board.checkers[currentSpot.row + 1][currentSpot.column];
                }
                else {
                    foundEdge = true;
                }
                break;
            case (direction_1.Direction.Up):
                if (currentSpot.row != 0) {
                    newSpot = this.board.checkers[currentSpot.row - 1][currentSpot.column];
                }
                else {
                    foundEdge = true;
                }
                break;
            case (direction_1.Direction.Right):
                if (currentSpot.column != this.numColumns - 1) {
                    newSpot = this.board.checkers[currentSpot.row][currentSpot.column + 1];
                }
                else {
                    foundEdge = true;
                }
                break;
            case (direction_1.Direction.Left):
                if (currentSpot.column != 0) {
                    newSpot = this.board.checkers[currentSpot.row][currentSpot.column - 1];
                }
                else {
                    foundEdge = true;
                }
                break;
            default:
                break;
        }
        if (foundEdge) {
            newGameState = state_1.GameState.Victory;
        }
        else {
            if (newSpot.touched) {
                newGameState = state_1.GameState.Failure;
            }
            else {
                this.board.checkerPiece.move(newSpot);
                this.slidingSound.play();
            }
        }
        return newGameState;
    };
    Game.prototype.setup = function (stage, renderer) {
        this.board = new board_1.Board(this.numRows, this.numColumns, renderer);
        stage.addChild(this.board.graphics);
        this.board.chosenSpot.touch();
    };
    Game.prototype.draw = function (renderer) {
        this.board.graphics.x = (renderer.width / 2) - (this.board.graphics.width / 2);
        this.board.graphics.y = (renderer.height / 2) - (this.board.graphics.height / 2);
        this.board.draw();
    };
    Game.prototype.decreaseRows = function () {
        if (this.numRows > 1) {
            --this.numRows;
        }
    };
    Game.prototype.increaseRows = function () {
        ++this.numRows;
    };
    Game.prototype.decreaseColumns = function () {
        if (this.numColumns > 1) {
            --this.numColumns;
        }
    };
    Game.prototype.increaseColumns = function () {
        ++this.numColumns;
    };
    Game.prototype.shuffle = function () {
        this.board.shuffleArrows();
        this.board.checkerPiece.spot.touch();
    };
    return Game;
}());
exports.Game = Game;
},{"./board":2,"./direction":4,"./state":8,"howler":undefined,"pixi.js":undefined}],6:[function(require,module,exports){
/// <reference path="../typings/index.d.ts" />
"use strict";
var PIXI = require('pixi.js');
var Howler = require('howler');
var renderer = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.view);
var widget_1 = require('./widget');
var game_1 = require('./game');
var state_1 = require('./state');
// You need to create a root container that will hold the scene you want to draw.
var stage = new PIXI.Container();
//renderer.backgroundColor = 0x5552b2;
renderer.backgroundColor = 0x000000;
// set up game loop timer
var ticker = new PIXI.ticker.Ticker();
ticker.stop();
// game object
var game = new game_1.Game(renderer);
// define UI
var playWidget;
var stopWiget;
var shuffleWidget;
var resetWidget;
var decreaseRowsWidget;
var increaseRowsWidget;
var rowNumWidget;
var decreaseColumnsWidget;
var increaseColumnsWidget;
var columnNumWidget;
var victoryWidget;
var cycleWidget;
// Sound effects
var victorySound = new Howler.Howl({
    src: 'win.mp3'
});
var failSound = new Howler.Howl({
    src: 'fail.mp3'
});
// Do first-time game board setup
setup();
// Start animation/rendering loop
animate();
// Setup PXI ticker as game logic loop
ticker.add(gameLoop);
/*** Functions ***/
function gameLoop(deltaTime) {
    var newState = game.gameLoop(deltaTime);
    if (newState == state_1.GameState.Victory) {
        stop();
        victorySound.play();
        alert("Congratulations, you win!");
        reset();
    }
    else if (newState == state_1.GameState.Failure) {
        stop();
        failSound.play();
        alert("Cycle detected -- can't move here");
    }
}
function animate() {
    // start the timer for the next animation loop
    requestAnimationFrame(animate);
    // draw game
    game.draw(renderer);
    renderer.render(stage);
    // draw UI widgets
    playWidget.draw(renderer);
    stopWiget.draw(renderer);
    shuffleWidget.draw(renderer);
    resetWidget.draw(renderer);
    decreaseRowsWidget.draw(renderer);
    increaseRowsWidget.draw(renderer);
    rowNumWidget.draw(renderer);
    decreaseColumnsWidget.draw(renderer);
    increaseColumnsWidget.draw(renderer);
    columnNumWidget.draw(renderer);
    // this is the main render call that makes pixi draw your container and its children.
}
// create window resize handler
// game board components should change size to
// reflect the new window size
window.onresize = function (event) {
    renderer.resize(window.innerWidth, window.innerHeight);
    game.board.resize(renderer);
    //reset();
};
// UI event handlers
function clickPlay() {
    play();
}
function clickStop() {
    stop();
}
function clickShuffle() {
    game.shuffle();
}
function clickReset() {
    reset();
}
function clickDecreaseRows() {
    game.decreaseRows();
    reset();
}
function clickIncreaseRows() {
    game.increaseRows();
    reset();
}
function clickDecreaseColumns() {
    game.decreaseColumns();
    reset();
}
function clickIncreaseColumns() {
    game.increaseColumns();
    reset();
}
/**** Game Logic Functions ****/
function setup() {
    game.setup(stage, renderer);
    playWidget = new widget_1.UIWidget(new PIXI.Rectangle(100, 30, 65, 35), "Play", clickPlay);
    stage.addChild(playWidget.graphics);
    stage.addChild(playWidget.text);
    stopWiget = new widget_1.UIWidget(new PIXI.Rectangle(100, 80, 65, 35), "Stop", clickStop);
    stage.addChild(stopWiget.graphics);
    stage.addChild(stopWiget.text);
    shuffleWidget = new widget_1.UIWidget(new PIXI.Rectangle(100, 130, 90, 35), "Shuffle", clickShuffle);
    stage.addChild(shuffleWidget.graphics);
    stage.addChild(shuffleWidget.text);
    resetWidget = new widget_1.UIWidget(new PIXI.Rectangle(100, 180, 80, 35), "Reset", clickReset);
    stage.addChild(resetWidget.graphics);
    stage.addChild(resetWidget.text);
    decreaseRowsWidget = new widget_1.UIWidget(new PIXI.Rectangle(110, 230, 25, 35), "<", clickDecreaseRows);
    stage.addChild(decreaseRowsWidget.graphics);
    stage.addChild(decreaseRowsWidget.text);
    rowNumWidget = new widget_1.UIWidget(new PIXI.Rectangle(decreaseRowsWidget.rect.x - 40, 230, 40, 35), String(game.numRows), function () { });
    stage.addChild(rowNumWidget.graphics);
    stage.addChild(rowNumWidget.text);
    increaseRowsWidget = new widget_1.UIWidget(new PIXI.Rectangle(rowNumWidget.rect.x - 45, 230, 25, 35), ">", clickIncreaseRows);
    stage.addChild(increaseRowsWidget.graphics);
    stage.addChild(increaseRowsWidget.text);
    decreaseColumnsWidget = new widget_1.UIWidget(new PIXI.Rectangle(110, 280, 25, 35), "<", clickDecreaseColumns);
    stage.addChild(decreaseColumnsWidget.graphics);
    stage.addChild(decreaseColumnsWidget.text);
    columnNumWidget = new widget_1.UIWidget(new PIXI.Rectangle(decreaseColumnsWidget.rect.x - 40, 280, 40, 35), String(game.numColumns), function () { });
    stage.addChild(columnNumWidget.graphics);
    stage.addChild(columnNumWidget.text);
    increaseColumnsWidget = new widget_1.UIWidget(new PIXI.Rectangle(rowNumWidget.rect.x - 45, 280, 25, 35), ">", clickIncreaseColumns);
    stage.addChild(increaseColumnsWidget.graphics);
    stage.addChild(increaseColumnsWidget.text);
}
function play() {
    ticker.start();
}
function stop() {
    ticker.stop();
}
function reset() {
    stop();
    stage.removeChildren(0, stage.children.length - 1);
    setup();
}
},{"./game":5,"./state":8,"./widget":10,"howler":undefined,"pixi.js":undefined}],7:[function(require,module,exports){
"use strict";
var PIXI = require('pixi.js');
var Piece = (function () {
    function Piece(spot, r, color) {
        this.spot = spot;
        this.r = r;
        this.color = color;
        this.graphics = new PIXI.Graphics();
        this.x = 0;
        this.y = 0;
        this.newY = 0;
        this.newX = 0;
        this.oldX = 0;
        this.oldY = 0;
        this.transitionTime = 20;
        this.transitionProgress = 0;
        this.moving = false;
    }
    Piece.prototype.move = function (spot) {
        this.moving = true;
        this.newX = spot.graphics.x - this.spot.graphics.x;
        this.newY = spot.graphics.y - this.spot.graphics.y;
        this.x = this.newX;
        this.y = this.newY;
        this.spot = spot;
        this.oldX = this.x;
        this.oldY = this.y;
        this.spot.touch();
    };
    Piece.prototype.update = function (deltaTime) {
        if (this.moving) {
            this.transitionProgress += deltaTime;
            this.x -= (this.newX) * (deltaTime / this.transitionTime);
            this.y -= (this.newY) * (deltaTime / this.transitionTime);
            if (this.transitionProgress >= this.transitionTime) {
                this.moving = false;
                this.transitionProgress = 0;
                // make sure we didn't barely miss the exact target from rounding errors, etc.
                this.x = 0;
                this.y = 0;
                this.oldX = this.newX = 0;
                this.oldY = this.newY = 0;
            }
        }
    };
    Piece.prototype.draw = function () {
        this.graphics.clear();
        this.graphics.beginFill(this.color, 1);
        this.graphics.drawCircle((this.spot.graphics.x + this.spot.graphics.width / 2) - this.x, (this.spot.graphics.y + this.spot.graphics.height / 2) - this.y, this.r);
        this.graphics.endFill();
    };
    return Piece;
}());
exports.Piece = Piece;
},{"pixi.js":undefined}],8:[function(require,module,exports){
"use strict";
(function (GameState) {
    GameState[GameState["Victory"] = 0] = "Victory";
    GameState[GameState["Failure"] = 1] = "Failure";
    GameState[GameState["Continue"] = 2] = "Continue";
})(exports.GameState || (exports.GameState = {}));
var GameState = exports.GameState;
},{}],9:[function(require,module,exports){
"use strict";
var Helpers;
(function (Helpers) {
    function getRandomDirection() {
        return Math.floor(Math.random() * 4);
    }
    Helpers.getRandomDirection = getRandomDirection;
    function getCellsize(numColumns, numRows, screenWidth, screenHeight) {
        return Math.min(screenWidth / numColumns, screenHeight / numRows);
    }
    Helpers.getCellsize = getCellsize;
})(Helpers = exports.Helpers || (exports.Helpers = {}));
},{}],10:[function(require,module,exports){
"use strict";
var PIXI = require('pixi.js');
var UIWidget = (function () {
    function UIWidget(rect, text, clickHandler) {
        var _this = this;
        this.rect = rect;
        this.text = new PIXI.Text(text);
        this.graphics = new PIXI.Graphics();
        // add "padding" to text
        this.text.x = this.rect.x + 5;
        this.text.y = this.rect.y + 5;
        // turn on buttonMode so that we can interact via mouse
        this.graphics.interactive = true;
        this.graphics.buttonMode = true;
        this.color = 0xc4c4c4;
        this.alpha = 0.7;
        this.enabled = true;
        // bind the click handler callback
        this.clickHandler = clickHandler;
        this.graphics.on("click", clickHandler);
        // bind mousedown handler, for showing that the button
        //	is being depressed
        this.graphics.on("mousedown", function () {
            if (_this.enabled) {
                _this.color = 0x969696;
                _this.alpha = 0.9;
            }
        });
        this.graphics.on("mouseup", function () {
            if (_this.enabled) {
                _this.color = 0xc4c4c4;
                _this.alpha = 0.7;
            }
        });
    }
    UIWidget.prototype.setEnabled = function (enabled) {
        this.enabled = enabled;
        if (this.enabled) {
            this.color = 0xc4c4c4;
        }
        else {
            this.color = 0x969696;
        }
    };
    UIWidget.prototype.draw = function (renderer) {
        this.graphics.clear();
        this.text.x = renderer.width - this.rect.x + 5;
        this.graphics.beginFill(this.color, this.alpha);
        this.graphics.drawRect(renderer.width - this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        this.graphics.endFill();
    };
    return UIWidget;
}());
exports.UIWidget = UIWidget;
},{"pixi.js":undefined}]},{},[6])(6)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL2Fycm93LnRzIiwic3JjL2JvYXJkLnRzIiwic3JjL2NoZWNrZXIudHMiLCJzcmMvZGlyZWN0aW9uLnRzIiwic3JjL2dhbWUudHMiLCJzcmMvaW5kZXgudHMiLCJzcmMvcGllY2UudHMiLCJzcmMvc3RhdGUudHMiLCJzcmMvdXRpbC50cyIsInNyYy93aWRnZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUEsSUFBTyxJQUFJLFdBQVcsU0FBUyxDQUFDLENBQUM7QUFDakMsMEJBQXdCLGFBQWEsQ0FBQyxDQUFBO0FBRXRDO0lBUUksZUFBWSxDQUFtQixFQUFFLENBQW1CLEVBQUUsQ0FBbUIsRUFBRSxLQUFhO1FBQ3BGLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxTQUFTLEdBQUcscUJBQVMsQ0FBQyxJQUFJLENBQUM7UUFFaEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN4QyxDQUFDO0lBRUEsb0JBQUksR0FBSixVQUFLLEtBQWEsRUFBRSxNQUFjO1FBQ2xDLGtFQUFrRTtRQUNsRSxnQ0FBZ0M7UUFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBRTVELElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUMsR0FBRyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLEdBQUMsR0FBRyxDQUFDO1FBRW5DLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBQyxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsTUFBTSxHQUFDLENBQUMsQ0FBQztRQUUzQixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBQ0wsWUFBQztBQUFELENBbkNBLEFBbUNDLElBQUE7QUFuQ1ksYUFBSyxRQW1DakIsQ0FBQTs7O0FDdENELElBQU8sSUFBSSxXQUFXLFNBQVMsQ0FBQyxDQUFDO0FBQ2pDLHdCQUFzQixXQUFXLENBQUMsQ0FBQTtBQUNsQyxxQkFBc0IsUUFBUSxDQUFDLENBQUE7QUFDL0Isc0JBQW9CLFNBQVMsQ0FBQyxDQUFBO0FBRTlCO0lBYUMsZUFBWSxPQUFlLEVBQUUsVUFBa0IsRUFBRSxRQUE2QjtRQVg5RSxhQUFRLEdBQWdCLEVBQUUsQ0FBQztRQVkxQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRXBDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBRTdCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFdEIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3ZJLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxhQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsWUFBWSxHQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNoRixJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUU1RCxDQUFDO0lBRUQsc0JBQU0sR0FBTixVQUFPLFFBQTZCO1FBQ25DLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDN0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEMsQ0FBQztRQUNELElBQUksUUFBUSxHQUFHLGNBQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25HLElBQUksQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDO1FBQzdCLElBQUksQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDO1FBQzlCLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzFCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUMsR0FBRyxDQUFDO1FBQzdDLENBQUM7SUFDRixDQUFDO0lBRUQsa0NBQWtCLEdBQWxCO1FBQ0MsSUFBSSxRQUFRLEdBQUcsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbkMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFaEMsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3ZDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUMxQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDOUIsUUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ1AsUUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLENBQUM7Z0JBQ0QsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNyRyxDQUFDO1lBQ0QsUUFBUSxHQUFHLENBQUMsUUFBUSxDQUFDO1FBQ3RCLENBQUM7UUFFRCxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCw4QkFBYyxHQUFkO1FBQ0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDbkIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDdkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDdEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQzFDLElBQUksVUFBVSxHQUFHLElBQUksaUJBQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUNySCxVQUFVLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxjQUFPLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDMUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUM7Z0JBQ2pDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdEQsQ0FBQztRQUNGLENBQUM7SUFDRixDQUFDO0lBRUQsb0JBQUksR0FBSjtRQUNDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDekIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQy9DLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3JDLElBQUksT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNoRyxDQUFDO1FBQ0YsQ0FBQztJQUNGLENBQUM7SUFFRCw2QkFBYSxHQUFiO1FBQ0MsR0FBRyxDQUFDLENBQVksVUFBYSxFQUFiLEtBQUEsSUFBSSxDQUFDLFFBQVEsRUFBYixjQUFhLEVBQWIsSUFBYSxDQUFDO1lBQXpCLElBQUksR0FBRyxTQUFBO1lBQ1gsR0FBRyxDQUFDLENBQWdCLFVBQUcsRUFBSCxXQUFHLEVBQUgsaUJBQUcsRUFBSCxJQUFHLENBQUM7Z0JBQW5CLElBQUksT0FBTyxZQUFBO2dCQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLGNBQU8sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUN2RCxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7YUFDaEI7U0FDRDtJQUNGLENBQUM7SUFDRixZQUFDO0FBQUQsQ0EvRkEsQUErRkMsSUFBQTtBQS9GWSxhQUFLLFFBK0ZqQixDQUFBOzs7QUNwR0QsSUFBTyxJQUFJLFdBQVcsU0FBUyxDQUFDLENBQUM7QUFDakMsMEJBQXdCLGFBQWEsQ0FBQyxDQUFBO0FBQ3RDLHNCQUFvQixTQUFTLENBQUMsQ0FBQTtBQUU5QjtJQVdDLGlCQUFZLEdBQVcsRUFBRSxNQUFjLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxLQUFhLEVBQUUsTUFBYztRQUMzRixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUVyQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFFbkMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGFBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNyRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxxQkFBUyxDQUFDLEtBQUssQ0FBQztRQUN2QyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTVDLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFRCx1QkFBSyxHQUFMO1FBQ0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDcEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO0lBQzdCLENBQUM7SUFFRCx1QkFBSyxHQUFMO1FBQ0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO0lBQzdCLENBQUM7SUFFRCxzQkFBSSxHQUFKLFVBQUssQ0FBUyxFQUFFLENBQVMsRUFBRSxLQUFhLEVBQUUsTUFBYztRQUN2RCxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUM1QixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDOUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFDRixjQUFDO0FBQUQsQ0FqREEsQUFpREMsSUFBQTtBQWpEWSxlQUFPLFVBaURuQixDQUFBOzs7QUNyREQsV0FBWSxTQUFTO0lBQ3BCLHlDQUFRLENBQUE7SUFDUix5Q0FBSSxDQUFBO0lBQ0oscUNBQUUsQ0FBQTtJQUNGLDJDQUFLLENBQUE7QUFDTixDQUFDLEVBTFcsaUJBQVMsS0FBVCxpQkFBUyxRQUtwQjtBQUxELElBQVksU0FBUyxHQUFULGlCQUtYLENBQUE7O0FDTEQsOENBQThDOztBQUU5QyxJQUFPLElBQUksV0FBVyxTQUFTLENBQUMsQ0FBQztBQUNqQyxJQUFPLE1BQU0sV0FBVyxRQUFRLENBQUMsQ0FBQztBQUNsQyxzQkFBb0IsU0FBUyxDQUFDLENBQUE7QUFHOUIsMEJBQXdCLGFBQWEsQ0FBQyxDQUFBO0FBRXRDLHNCQUF3QixTQUFTLENBQUMsQ0FBQTtBQUdsQyxJQUFNLFdBQVcsR0FBVyxFQUFFLENBQUM7QUFDL0I7SUFZQyxjQUFZLFFBQTZCO1FBWHpDLGNBQVMsR0FBVyxDQUFDLENBQUM7UUFJdEIsZUFBVSxHQUFXLEVBQUUsQ0FBQztRQUN4QixZQUFPLEdBQVksQ0FBQyxDQUFDO1FBRXJCLFVBQUssR0FBZSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBS3hDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ25DLEdBQUcsRUFBRSxhQUFhO1NBQ2xCLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCx1QkFBUSxHQUFSLFVBQVMsU0FBaUI7UUFDdEIsK0JBQStCO1FBQy9CLElBQUksUUFBUSxHQUFjLGlCQUFTLENBQUMsUUFBUSxDQUFDO1FBQzdDLElBQUksQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDO1FBQzVCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNoQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLENBQUM7UUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDMUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUNwQixDQUFDO0lBRUQscUJBQU0sR0FBTjtRQUNDLElBQUksWUFBWSxHQUFHLGlCQUFTLENBQUMsUUFBUSxDQUFDO1FBRW5DLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQztRQUMvQyxJQUFJLE9BQWdCLENBQUM7UUFDckIsSUFBSSxTQUFTLEdBQVksS0FBSyxDQUFDO1FBQy9CLE1BQU0sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNsQyxLQUFLLENBQUMscUJBQVMsQ0FBQyxJQUFJLENBQUM7Z0JBQ2pCLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNwQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEdBQUcsR0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3pFLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osU0FBUyxHQUFHLElBQUksQ0FBQztnQkFDckIsQ0FBQztnQkFDRCxLQUFLLENBQUM7WUFDVixLQUFLLENBQUMscUJBQVMsQ0FBQyxFQUFFLENBQUM7Z0JBQ2YsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN2QixPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEdBQUcsR0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3pFLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osU0FBUyxHQUFHLElBQUksQ0FBQztnQkFDckIsQ0FBQztnQkFDRCxLQUFLLENBQUM7WUFDVixLQUFLLENBQUMscUJBQVMsQ0FBQyxLQUFLLENBQUM7Z0JBQ2xCLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMxQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pFLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osU0FBUyxHQUFHLElBQUksQ0FBQztnQkFDckIsQ0FBQztnQkFDRCxLQUFLLENBQUM7WUFDVixLQUFLLENBQUMscUJBQVMsQ0FBQyxJQUFJLENBQUM7Z0JBQ2pCLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDMUIsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6RSxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLFNBQVMsR0FBRyxJQUFJLENBQUM7Z0JBQ3JCLENBQUM7Z0JBQ0QsS0FBSyxDQUFDO1lBQ1Y7Z0JBQ0ksS0FBSyxDQUFDO1FBQ2QsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDWixZQUFZLEdBQUcsaUJBQVMsQ0FBQyxPQUFPLENBQUM7UUFDckMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLFlBQVksR0FBRyxpQkFBUyxDQUFDLE9BQU8sQ0FBQztZQUNyQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN0QyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQzdCLENBQUM7UUFDTCxDQUFDO1FBRUQsTUFBTSxDQUFDLFlBQVksQ0FBQztJQUN4QixDQUFDO0lBRUQsb0JBQUssR0FBTCxVQUFNLEtBQXFCLEVBQUUsUUFBNkI7UUFDekQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGFBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDaEUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2xDLENBQUM7SUFFRCxtQkFBSSxHQUFKLFVBQUssUUFBNkI7UUFDakMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVELDJCQUFZLEdBQVo7UUFDQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEIsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ2hCLENBQUM7SUFDRixDQUFDO0lBRUQsMkJBQVksR0FBWjtRQUNDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUNoQixDQUFDO0lBRUQsOEJBQWUsR0FBZjtRQUNDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixFQUFFLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDbkIsQ0FBQztJQUNGLENBQUM7SUFFRCw4QkFBZSxHQUFmO1FBQ0MsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ25CLENBQUM7SUFFRCxzQkFBTyxHQUFQO1FBQ0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDdEMsQ0FBQztJQUNGLFdBQUM7QUFBRCxDQXhIQSxBQXdIQyxJQUFBO0FBeEhZLFlBQUksT0F3SGhCLENBQUE7O0FDcklELDhDQUE4Qzs7QUFFOUMsSUFBTyxJQUFJLFdBQVcsU0FBUyxDQUFDLENBQUM7QUFDakMsSUFBTyxNQUFNLFdBQVcsUUFBUSxDQUFDLENBQUM7QUFFbEMsSUFBTSxRQUFRLEdBQXNCLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNsRyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFLekMsdUJBQXVCLFVBQVUsQ0FBQyxDQUFBO0FBR2xDLHFCQUFtQixRQUFRLENBQUMsQ0FBQTtBQUM1QixzQkFBd0IsU0FBUyxDQUFDLENBQUE7QUFFbEMsaUZBQWlGO0FBQ2pGLElBQU0sS0FBSyxHQUFrQixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUVsRCxzQ0FBc0M7QUFDdEMsUUFBUSxDQUFDLGVBQWUsR0FBRyxRQUFRLENBQUM7QUFFcEMseUJBQXlCO0FBQ3pCLElBQUksTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUN0QyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFZCxjQUFjO0FBQ2QsSUFBSSxJQUFJLEdBQUcsSUFBSSxXQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFFOUIsWUFBWTtBQUNaLElBQUksVUFBb0IsQ0FBQztBQUN6QixJQUFJLFNBQW1CLENBQUM7QUFDeEIsSUFBSSxhQUF1QixDQUFDO0FBQzVCLElBQUksV0FBcUIsQ0FBQztBQUMxQixJQUFJLGtCQUE0QixDQUFDO0FBQ2pDLElBQUksa0JBQTRCLENBQUM7QUFDakMsSUFBSSxZQUFzQixDQUFDO0FBQzNCLElBQUkscUJBQStCLENBQUM7QUFDcEMsSUFBSSxxQkFBK0IsQ0FBQztBQUNwQyxJQUFJLGVBQXlCLENBQUM7QUFDOUIsSUFBSSxhQUF1QixDQUFDO0FBQzVCLElBQUksV0FBcUIsQ0FBQztBQUUxQixnQkFBZ0I7QUFDaEIsSUFBSSxZQUFZLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQy9CLEdBQUcsRUFBRSxTQUFTO0NBQ2pCLENBQUMsQ0FBQztBQUVILElBQUksU0FBUyxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQztJQUM1QixHQUFHLEVBQUUsVUFBVTtDQUNsQixDQUFDLENBQUM7QUFFSCxpQ0FBaUM7QUFDakMsS0FBSyxFQUFFLENBQUM7QUFDUixpQ0FBaUM7QUFDakMsT0FBTyxFQUFFLENBQUM7QUFFVixzQ0FBc0M7QUFDdEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUVyQixtQkFBbUI7QUFFbkIsa0JBQWtCLFNBQWlCO0lBQy9CLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDeEMsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLGlCQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNoQyxJQUFJLEVBQUUsQ0FBQztRQUNQLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNwQixLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQztRQUNuQyxLQUFLLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLGlCQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUN2QyxJQUFJLEVBQUUsQ0FBQztRQUNQLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNqQixLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQztJQUMvQyxDQUFDO0FBQ0wsQ0FBQztBQUVEO0lBQ0ksOENBQThDO0lBQzlDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRS9CLFlBQVk7SUFDWixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRXBCLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdkIsa0JBQWtCO0lBQ2xCLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDMUIsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN6QixhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdCLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDM0Isa0JBQWtCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2xDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNsQyxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzVCLHFCQUFxQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNyQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDckMsZUFBZSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUUvQixxRkFBcUY7QUFDekYsQ0FBQztBQUVELCtCQUErQjtBQUMvQiw4Q0FBOEM7QUFDOUMsOEJBQThCO0FBQzlCLE1BQU0sQ0FBQyxRQUFRLEdBQUcsVUFBQyxLQUFLO0lBQ3BCLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDdkQsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDNUIsVUFBVTtBQUNkLENBQUMsQ0FBQztBQUdGLG9CQUFvQjtBQUNwQjtJQUNJLElBQUksRUFBRSxDQUFDO0FBQ1gsQ0FBQztBQUVEO0lBQ0ksSUFBSSxFQUFFLENBQUM7QUFDWCxDQUFDO0FBRUQ7SUFDSSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDbkIsQ0FBQztBQUVEO0lBQ0ksS0FBSyxFQUFFLENBQUM7QUFDWixDQUFDO0FBRUQ7SUFDSSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDcEIsS0FBSyxFQUFFLENBQUM7QUFDWixDQUFDO0FBRUQ7SUFDSSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDcEIsS0FBSyxFQUFFLENBQUM7QUFDWixDQUFDO0FBRUQ7SUFDSSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDdkIsS0FBSyxFQUFFLENBQUM7QUFDWixDQUFDO0FBRUQ7SUFDSSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDdkIsS0FBSyxFQUFFLENBQUM7QUFDWixDQUFDO0FBR0QsZ0NBQWdDO0FBRWhDO0lBQ0ksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFFNUIsVUFBVSxHQUFHLElBQUksaUJBQVEsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ2xGLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3BDLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRWhDLFNBQVMsR0FBRyxJQUFJLGlCQUFRLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNqRixLQUFLLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuQyxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUUvQixhQUFhLEdBQUcsSUFBSSxpQkFBUSxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDNUYsS0FBSyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdkMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFbkMsV0FBVyxHQUFHLElBQUksaUJBQVEsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ3RGLEtBQUssQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3JDLEtBQUssQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRWpDLGtCQUFrQixHQUFHLElBQUksaUJBQVEsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLGlCQUFpQixDQUFDLENBQUM7SUFDaEcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM1QyxLQUFLLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXhDLFlBQVksR0FBRyxJQUFJLGlCQUFRLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxjQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzNILEtBQUssQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3RDLEtBQUssQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRWxDLGtCQUFrQixHQUFHLElBQUksaUJBQVEsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLGlCQUFpQixDQUFDLENBQUM7SUFDckgsS0FBSyxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM1QyxLQUFLLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXhDLHFCQUFxQixHQUFHLElBQUksaUJBQVEsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLG9CQUFvQixDQUFDLENBQUM7SUFDdEcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMvQyxLQUFLLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBRTNDLGVBQWUsR0FBRyxJQUFJLGlCQUFRLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxjQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3BJLEtBQUssQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3pDLEtBQUssQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXJDLHFCQUFxQixHQUFHLElBQUksaUJBQVEsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLG9CQUFvQixDQUFDLENBQUM7SUFDM0gsS0FBSyxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMvQyxLQUFLLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9DLENBQUM7QUFFRDtJQUNJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNuQixDQUFDO0FBRUQ7SUFDSSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDbEIsQ0FBQztBQUVEO0lBQ0ksSUFBSSxFQUFFLENBQUM7SUFDUCxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqRCxLQUFLLEVBQUUsQ0FBQztBQUNaLENBQUM7OztBQzlNRCxJQUFPLElBQUksV0FBVyxTQUFTLENBQUMsQ0FBQztBQUdqQztJQWVDLGVBQVksSUFBYSxFQUFFLENBQVMsRUFBRSxLQUFhO1FBQ2xELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUVwQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztRQUNkLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7UUFFZCxJQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ3JCLENBQUM7SUFFRCxvQkFBSSxHQUFKLFVBQU0sSUFBYTtRQUNsQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUNuQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDbkIsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNuQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBRUQsc0JBQU0sR0FBTixVQUFPLFNBQWlCO1FBQ3ZCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLElBQUksQ0FBQyxrQkFBa0IsSUFBSSxTQUFTLENBQUM7WUFDckMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDMUQsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDMUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO2dCQUNwRCxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztnQkFDcEIsSUFBSSxDQUFDLGtCQUFrQixHQUFHLENBQUMsQ0FBQztnQkFDNUIsOEVBQThFO2dCQUM5RSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDWCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO2dCQUMxQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQzNCLENBQUM7UUFDRixDQUFDO0lBQ0YsQ0FBQztJQUVELG9CQUFJLEdBQUo7UUFDQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFDLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxDQUFDLEVBQ2xGLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFDRixZQUFDO0FBQUQsQ0F0RUEsQUFzRUMsSUFBQTtBQXRFWSxhQUFLLFFBc0VqQixDQUFBOzs7QUN6RUQsV0FBWSxTQUFTO0lBQ3BCLCtDQUFXLENBQUE7SUFDWCwrQ0FBVyxDQUFBO0lBQ1gsaURBQVksQ0FBQTtBQUNiLENBQUMsRUFKVyxpQkFBUyxLQUFULGlCQUFTLFFBSXBCO0FBSkQsSUFBWSxTQUFTLEdBQVQsaUJBSVgsQ0FBQTs7O0FDQUQsSUFBaUIsT0FBTyxDQVF2QjtBQVJELFdBQWlCLE9BQU8sRUFBQyxDQUFDO0lBQ3pCO1FBQ0ksTUFBTSxDQUFZLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFGZSwwQkFBa0IscUJBRWpDLENBQUE7SUFFRCxxQkFBNEIsVUFBa0IsRUFBRSxPQUFlLEVBQUUsV0FBbUIsRUFBRSxZQUFvQjtRQUN6RyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsVUFBVSxFQUFFLFlBQVksR0FBRyxPQUFPLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRmUsbUJBQVcsY0FFMUIsQ0FBQTtBQUNGLENBQUMsRUFSZ0IsT0FBTyxHQUFQLGVBQU8sS0FBUCxlQUFPLFFBUXZCOzs7QUNaRCxJQUFPLElBQUksV0FBVyxTQUFTLENBQUMsQ0FBQztBQUVqQztJQVNDLGtCQUFZLElBQW9CLEVBQUUsSUFBWSxFQUFFLFlBQXFCO1FBVHRFLGlCQWdFQztRQXREQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRXBDLHdCQUF3QjtRQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRTlCLHVEQUF1RDtRQUN2RCxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDakMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBRWhDLElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1FBRWpCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBRXBCLGtDQUFrQztRQUNsQyxJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztRQUNqQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFFeEMsc0RBQXNEO1FBQ3RELHFCQUFxQjtRQUNyQixJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUU7WUFDN0IsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLEtBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO2dCQUN0QixLQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztZQUNsQixDQUFDO1FBQ0YsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUU7WUFDM0IsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLEtBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO2dCQUN0QixLQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztZQUNsQixDQUFDO1FBQ0YsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsNkJBQVUsR0FBVixVQUFXLE9BQWdCO1FBQzFCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO1FBQ3ZCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNQLElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO1FBQ3ZCLENBQUM7SUFDRixDQUFDO0lBRUQsdUJBQUksR0FBSixVQUFNLFFBQTZCO1FBQ2xDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUNGLGVBQUM7QUFBRCxDQWhFQSxBQWdFQyxJQUFBO0FBaEVZLGdCQUFRLFdBZ0VwQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBQSVhJID0gcmVxdWlyZSgncGl4aS5qcycpO1xyXG5pbXBvcnQge0RpcmVjdGlvbn0gZnJvbSAnLi9kaXJlY3Rpb24nO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFycm93IHtcclxuICAgIGE6IFtudW1iZXIsIG51bWJlcl07XHJcbiAgICBiOiBbbnVtYmVyLCBudW1iZXJdO1xyXG4gICAgYzogW251bWJlciwgbnVtYmVyXTtcclxuICAgIGNvbG9yOiBudW1iZXI7XHJcbiAgICBncmFwaGljczogUElYSS5HcmFwaGljcztcclxuICAgIGRpcmVjdGlvbjogRGlyZWN0aW9uO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGE6IFtudW1iZXIsIG51bWJlcl0sIGI6IFtudW1iZXIsIG51bWJlcl0sIGM6IFtudW1iZXIsIG51bWJlcl0sIGNvbG9yOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmEgPSBhO1xyXG4gICAgICAgIHRoaXMuYiA9IGI7XHJcbiAgICAgICAgdGhpcy5jID0gYztcclxuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XHJcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBEaXJlY3Rpb24uRG93bjtcclxuXHJcbiAgICAgICAgdGhpcy5ncmFwaGljcyA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgIGRyYXcod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcclxuICAgIFx0Ly8gUm90YXRlIHRoZSBhcnJvdyBieSBhIHNldCBudW1iZXIgb2YgcmFkaWFucywgZGVwZW5kaW5nIG9uIHdoaWNoXHJcbiAgICBcdC8vIGRpcmVjdGlvbiBpdCBzaG91bGQgYmUgZmFjaW5nXHJcbiAgICBcdHRoaXMuZ3JhcGhpY3Mucm90YXRpb24gPSAoOTAgKiBNYXRoLlBJIC8gMTgwKSAqIHRoaXMuZGlyZWN0aW9uO1xyXG5cclxuICAgICAgICB0aGlzLmdyYXBoaWNzLnNjYWxlLnggPSB3aWR0aC8xMDA7XHJcbiAgICAgICAgdGhpcy5ncmFwaGljcy5zY2FsZS55ID0gaGVpZ2h0LzEwMDtcclxuXHJcbiAgICAgICAgdGhpcy5ncmFwaGljcy54ID0gd2lkdGgvMjtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzLnkgPSBoZWlnaHQvMjtcclxuXHJcbiAgICAgICAgdGhpcy5ncmFwaGljcy5iZWdpbkZpbGwodGhpcy5jb2xvciwgMSk7XHJcbiAgICAgICAgdGhpcy5ncmFwaGljcy5kcmF3UG9seWdvbihbdGhpcy5hWzBdLCB0aGlzLmFbMV0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYlswXSwgdGhpcy5iWzFdLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNbMF0sIHRoaXMuY1sxXV0pO1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3MuZW5kRmlsbCgpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IFBJWEkgPSByZXF1aXJlKCdwaXhpLmpzJyk7XHJcbmltcG9ydCB7Q2hlY2tlcn0gZnJvbSAnLi9jaGVja2VyJztcclxuaW1wb3J0IHtIZWxwZXJzfSBmcm9tICcuL3V0aWwnO1xyXG5pbXBvcnQge1BpZWNlfSBmcm9tICcuL3BpZWNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBCb2FyZCB7XHJcblx0Y2hlY2tlckJvYXJkOiBQSVhJLlNwcml0ZTtcclxuXHRjaGVja2VyczogQ2hlY2tlcltdW10gPSBbXTtcclxuXHRjaGVja2VyUGllY2U6IFBpZWNlO1xyXG5cdGNob3NlblNwb3Q6IENoZWNrZXI7XHJcblxyXG5cdG51bVJvd3M6IG51bWJlcjtcclxuXHRudW1Db2x1bW5zOiBudW1iZXI7XHJcblx0Y2hlY2tlcldpZHRoOiBudW1iZXI7XHJcblx0Y2hlY2tlckhlaWdodDogbnVtYmVyO1xyXG5cclxuXHRncmFwaGljczogUElYSS5HcmFwaGljcztcclxuXHJcblx0Y29uc3RydWN0b3IobnVtUm93czogbnVtYmVyLCBudW1Db2x1bW5zOiBudW1iZXIsIHJlbmRlcmVyOiBQSVhJLlN5c3RlbVJlbmRlcmVyKSB7XHJcblx0XHR0aGlzLmdyYXBoaWNzID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcclxuXHJcblx0XHR0aGlzLm51bVJvd3MgPSBudW1Sb3dzO1xyXG5cdFx0dGhpcy5udW1Db2x1bW5zID0gbnVtQ29sdW1ucztcclxuXHJcblx0XHR0aGlzLnJlc2l6ZShyZW5kZXJlcik7XHJcblxyXG5cdFx0dGhpcy5jcmVhdGVDaGVja2VycygpO1xyXG5cdCAgICB0aGlzLmNob3NlblNwb3QgPSB0aGlzLmNoZWNrZXJzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuY2hlY2tlcnMubGVuZ3RoKV1bTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5jaGVja2Vyc1swXS5sZW5ndGgpXTtcclxuXHQgICAgdGhpcy5jaGVja2VyUGllY2UgPSBuZXcgUGllY2UodGhpcy5jaG9zZW5TcG90LCB0aGlzLmNoZWNrZXJXaWR0aC8yLjMsIDB4QkIwMDAwKTtcclxuXHQgICAgdGhpcy5ncmFwaGljcy5hZGRDaGlsZEF0KHRoaXMuY2hlY2tlclBpZWNlLmdyYXBoaWNzLCAxKTtcclxuXHJcblx0fVxyXG5cclxuXHRyZXNpemUocmVuZGVyZXI6IFBJWEkuU3lzdGVtUmVuZGVyZXIpIHtcclxuXHRcdGlmICh0aGlzLmdyYXBoaWNzLmNoaWxkcmVuICYmIHRoaXMuZ3JhcGhpY3MuY2hpbGRyZW4ubGVuZ3RoKSB7XHJcblx0XHRcdHRoaXMuZ3JhcGhpY3MucmVtb3ZlQ2hpbGRBdCgwKTtcclxuXHRcdH1cclxuXHRcdGxldCBjZWxsU2l6ZSA9IEhlbHBlcnMuZ2V0Q2VsbHNpemUodGhpcy5udW1Db2x1bW5zLCB0aGlzLm51bVJvd3MsIHJlbmRlcmVyLndpZHRoLCByZW5kZXJlci5oZWlnaHQpO1xyXG5cdFx0dGhpcy5jaGVja2VyV2lkdGggPSBjZWxsU2l6ZTtcclxuXHRcdHRoaXMuY2hlY2tlckhlaWdodCA9IGNlbGxTaXplO1xyXG5cdFx0dGhpcy5jcmVhdGVDaGVja2VyQm9hcmQoKTtcclxuXHRcdGlmICh0aGlzLmNoZWNrZXJQaWVjZSkge1xyXG5cdFx0XHR0aGlzLmNoZWNrZXJQaWVjZS5yID0gdGhpcy5jaGVja2VyV2lkdGgvMi4zO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Y3JlYXRlQ2hlY2tlckJvYXJkKCkge1xyXG5cdFx0bGV0IG5ld0JvYXJkID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcclxuXHRcdG5ld0JvYXJkLmJlZ2luRmlsbCgweDlmNmJjNCwgMSk7XHJcblxyXG5cdFx0bGV0IHN0YXJ0Um93ID0gdHJ1ZTtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5udW1Sb3dzOyBpKyspIHtcclxuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLm51bUNvbHVtbnM7IGorKykge1xyXG5cdFx0XHRcdGlmICgoaiAlIDIgPT0gMCkgPT0gc3RhcnRSb3cpIHtcclxuXHRcdFx0XHRcdG5ld0JvYXJkLmJlZ2luRmlsbCgweDlmNmJjNCwgMSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdG5ld0JvYXJkLmJlZ2luRmlsbCgweDU1NTJiMiwgMSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld0JvYXJkLmRyYXdSZWN0KGoqdGhpcy5jaGVja2VyV2lkdGgsIGkqdGhpcy5jaGVja2VySGVpZ2h0LCB0aGlzLmNoZWNrZXJXaWR0aCwgdGhpcy5jaGVja2VySGVpZ2h0KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRzdGFydFJvdyA9ICFzdGFydFJvdztcclxuXHRcdH1cclxuXHJcblx0XHRuZXdCb2FyZC5lbmRGaWxsKCk7XHJcblx0XHR0aGlzLmNoZWNrZXJCb2FyZCA9IG5ldyBQSVhJLlNwcml0ZShuZXdCb2FyZC5nZW5lcmF0ZUNhbnZhc1RleHR1cmUoKSk7XHJcblx0XHR0aGlzLmdyYXBoaWNzLmFkZENoaWxkQXQodGhpcy5jaGVja2VyQm9hcmQsIDApO1xyXG5cdH1cclxuXHJcblx0Y3JlYXRlQ2hlY2tlcnMoKSB7XHJcblx0XHR0aGlzLmNoZWNrZXJzID0gW107XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubnVtUm93czsgaSsrKSB7XHJcblx0XHRcdHRoaXMuY2hlY2tlcnNbaV0gPSBbXTtcclxuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLm51bUNvbHVtbnM7IGorKykge1xyXG5cdFx0XHRcdGxldCBuZXdDaGVja2VyID0gbmV3IENoZWNrZXIoaSwgaiwgaip0aGlzLmNoZWNrZXJXaWR0aCwgaSp0aGlzLmNoZWNrZXJIZWlnaHQsIHRoaXMuY2hlY2tlcldpZHRoLCB0aGlzLmNoZWNrZXJIZWlnaHQpO1xyXG5cdFx0XHRcdG5ld0NoZWNrZXIuYXJyb3cuZGlyZWN0aW9uID0gSGVscGVycy5nZXRSYW5kb21EaXJlY3Rpb24oKTtcclxuXHRcdFx0XHR0aGlzLmNoZWNrZXJzW2ldW2pdID0gbmV3Q2hlY2tlcjtcclxuXHRcdFx0XHR0aGlzLmdyYXBoaWNzLmFkZENoaWxkKHRoaXMuY2hlY2tlcnNbaV1bal0uZ3JhcGhpY3MpO1x0XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGRyYXcoKSB7XHJcblx0XHR0aGlzLmNoZWNrZXJQaWVjZS5kcmF3KCk7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hlY2tlcnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0bGV0IHJvdyA9IHRoaXMuY2hlY2tlcnNbaV07XHJcblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgcm93Lmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0bGV0IGNoZWNrZXIgPSByb3dbal07XHJcblx0XHRcdFx0Y2hlY2tlci5kcmF3KGoqdGhpcy5jaGVja2VyV2lkdGgsIGkqdGhpcy5jaGVja2VySGVpZ2h0LCB0aGlzLmNoZWNrZXJXaWR0aCwgdGhpcy5jaGVja2VySGVpZ2h0KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c2h1ZmZsZUFycm93cygpIHtcclxuXHRcdGZvciAobGV0IHJvdyBvZiB0aGlzLmNoZWNrZXJzKSB7XHJcblx0XHRcdGZvciAobGV0IGNoZWNrZXIgb2Ygcm93KSB7XHJcblx0XHRcdFx0Y2hlY2tlci5hcnJvdy5kaXJlY3Rpb24gPSBIZWxwZXJzLmdldFJhbmRvbURpcmVjdGlvbigpO1xyXG5cdFx0XHRcdGNoZWNrZXIucmVzZXQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufSIsImltcG9ydCBQSVhJID0gcmVxdWlyZSgncGl4aS5qcycpO1xyXG5pbXBvcnQge0RpcmVjdGlvbn0gZnJvbSAnLi9kaXJlY3Rpb24nO1xyXG5pbXBvcnQge0Fycm93fSBmcm9tICcuL2Fycm93JztcclxuXHJcbmV4cG9ydCBjbGFzcyBDaGVja2VyIHtcclxuXHRyb3c6IG51bWJlcjtcclxuXHRjb2x1bW46IG51bWJlcjtcclxuXHR4OiBudW1iZXI7XHJcblx0eTogbnVtYmVyO1xyXG5cdHdpZHRoOiBudW1iZXI7XHJcblx0aGVpZ2h0OiBudW1iZXI7XHJcblx0YXJyb3c6IEFycm93O1xyXG5cdHRvdWNoZWQ6IGJvb2xlYW47XHJcblx0Z3JhcGhpY3M6IFBJWEkuR3JhcGhpY3M7XHJcblxyXG5cdGNvbnN0cnVjdG9yKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSB7XHJcblx0XHR0aGlzLnJvdyA9IHJvdztcclxuXHRcdHRoaXMuY29sdW1uID0gY29sdW1uO1xyXG5cdFx0dGhpcy54ID0geDtcclxuXHRcdHRoaXMueSA9IHk7XHJcblx0XHR0aGlzLndpZHRoID0gd2lkdGg7XHJcblx0XHR0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuXHJcblx0XHR0aGlzLmdyYXBoaWNzID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcclxuXHRcdHRoaXMuZ3JhcGhpY3MueCA9IHRoaXMueDtcclxuXHRcdHRoaXMuZ3JhcGhpY3MueSA9IHRoaXMueTtcclxuXHRcdHRoaXMuZ3JhcGhpY3Mud2lkdGggPSB0aGlzLndpZHRoO1xyXG5cdFx0dGhpcy5ncmFwaGljcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcclxuXHJcblx0XHR0aGlzLmFycm93ID0gbmV3IEFycm93KFstOSwgLTEyLjVdLCBbMCwgMTIuNV0sIFs5LCAtMTIuNV0sIDB4M2YzZjNmKTtcclxuXHRcdHRoaXMuYXJyb3cuZGlyZWN0aW9uID0gRGlyZWN0aW9uLlJpZ2h0O1xyXG5cdFx0dGhpcy5ncmFwaGljcy5hZGRDaGlsZCh0aGlzLmFycm93LmdyYXBoaWNzKTtcclxuXHJcblx0XHR0aGlzLnRvdWNoZWQgPSBmYWxzZTtcclxuXHR9XHJcblxyXG5cdHRvdWNoKCkge1xyXG5cdFx0dGhpcy50b3VjaGVkID0gdHJ1ZTtcclxuXHRcdHRoaXMuYXJyb3cuY29sb3IgPSAweDAwODgwMDtcclxuXHR9XHJcblxyXG5cdHJlc2V0KCkge1xyXG5cdFx0dGhpcy50b3VjaGVkID0gZmFsc2U7XHJcblx0XHR0aGlzLmFycm93LmNvbG9yID0gMHgzZjNmM2Y7XHJcblx0fVxyXG5cclxuXHRkcmF3KHg6IG51bWJlciwgeTogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xyXG5cdFx0dGhpcy5ncmFwaGljcy54ID0geDtcclxuXHRcdHRoaXMuZ3JhcGhpY3MueSA9IHk7XHJcblx0XHR0aGlzLmdyYXBoaWNzLndpZHRoID0gd2lkdGg7XHJcblx0XHR0aGlzLmdyYXBoaWNzLmhlaWdodCA9IGhlaWdodDtcclxuXHRcdHRoaXMuYXJyb3cuZHJhdyh3aWR0aCwgaGVpZ2h0KTtcdFxyXG5cdH1cclxufSIsImV4cG9ydCBlbnVtIERpcmVjdGlvbiB7XHJcblx0RG93biA9IDAsXHJcblx0TGVmdCxcclxuXHRVcCxcclxuXHRSaWdodFx0XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvaW5kZXguZC50c1wiIC8+XHJcblxyXG5pbXBvcnQgUElYSSA9IHJlcXVpcmUoJ3BpeGkuanMnKTtcclxuaW1wb3J0IEhvd2xlciA9IHJlcXVpcmUoJ2hvd2xlcicpO1xyXG5pbXBvcnQge0JvYXJkfSBmcm9tICcuL2JvYXJkJztcclxuaW1wb3J0IHtDaGVja2VyfSBmcm9tICcuL2NoZWNrZXInO1xyXG5pbXBvcnQge0Fycm93fSBmcm9tICcuL2Fycm93JztcclxuaW1wb3J0IHtEaXJlY3Rpb259IGZyb20gJy4vZGlyZWN0aW9uJztcclxuaW1wb3J0IHtQaWVjZX0gZnJvbSAnLi9waWVjZSc7XHJcbmltcG9ydCB7R2FtZVN0YXRlfSBmcm9tICcuL3N0YXRlJztcclxuaW1wb3J0IHtIZWxwZXJzfSBmcm9tICcuL3V0aWwnO1xyXG5cclxuY29uc3QgVVBEQVRFX1RJTUU6IG51bWJlciA9IDI1O1xyXG5leHBvcnQgY2xhc3MgR2FtZSB7XHJcblx0d2F0Y2hUaW1lOiBudW1iZXIgPSAwO1xyXG5cclxuXHQvLyBib2FyZCBzdGF0ZVxyXG5cdGJvYXJkOiBCb2FyZDtcclxuXHRudW1Db2x1bW5zOiBudW1iZXIgPSAxMjtcclxuXHRudW1Sb3dzOiAgbnVtYmVyID0gNjtcclxuXHJcblx0c2NhbGU6IFBJWEkuUG9pbnQgPSBuZXcgUElYSS5Qb2ludCgxLCAxKTtcclxuXHJcblx0c2xpZGluZ1NvdW5kOiBIb3dsO1xyXG5cclxuXHRjb25zdHJ1Y3RvcihyZW5kZXJlcjogUElYSS5TeXN0ZW1SZW5kZXJlcikge1xyXG5cdFx0dGhpcy5zbGlkaW5nU291bmQgPSBuZXcgSG93bGVyLkhvd2woe1xyXG5cdFx0XHRzcmM6ICdTbGlkaW5nLm1wMydcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Z2FtZUxvb3AoZGVsdGFUaW1lOiBudW1iZXIpIHtcclxuXHQgICAgLy8gZG9pbmcgcXVhcnRlci1zZWNvbmQgXCJ0dXJuc1wiXHJcblx0ICAgIGxldCBuZXdTdGF0ZTogR2FtZVN0YXRlID0gR2FtZVN0YXRlLkNvbnRpbnVlO1xyXG5cdCAgICB0aGlzLndhdGNoVGltZSArPSBkZWx0YVRpbWU7XHJcblx0ICAgIGlmICh0aGlzLndhdGNoVGltZSA+PSBVUERBVEVfVElNRSkge1xyXG5cdCAgICAgICAgbmV3U3RhdGUgPSB0aGlzLnVwZGF0ZSgpO1xyXG5cdCAgICAgICAgdGhpcy53YXRjaFRpbWUgPSAwO1xyXG5cdCAgICB9XHJcblxyXG5cdCAgICB0aGlzLmJvYXJkLmNoZWNrZXJQaWVjZS51cGRhdGUoZGVsdGFUaW1lKTtcclxuXHQgICAgcmV0dXJuIG5ld1N0YXRlO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKCkge1xyXG5cdFx0bGV0IG5ld0dhbWVTdGF0ZSA9IEdhbWVTdGF0ZS5Db250aW51ZTtcclxuXHJcblx0ICAgIGxldCBjdXJyZW50U3BvdCA9IHRoaXMuYm9hcmQuY2hlY2tlclBpZWNlLnNwb3Q7XHJcblx0ICAgIGxldCBuZXdTcG90OiBDaGVja2VyO1xyXG5cdCAgICBsZXQgZm91bmRFZGdlOiBib29sZWFuID0gZmFsc2U7XHJcblx0ICAgIHN3aXRjaCAoY3VycmVudFNwb3QuYXJyb3cuZGlyZWN0aW9uKSB7XHJcblx0ICAgICAgICBjYXNlIChEaXJlY3Rpb24uRG93bik6XHJcblx0ICAgICAgICAgICAgaWYgKGN1cnJlbnRTcG90LnJvdyAhPSB0aGlzLm51bVJvd3MtMSkge1xyXG5cdCAgICAgICAgICAgICAgICBuZXdTcG90ID0gdGhpcy5ib2FyZC5jaGVja2Vyc1tjdXJyZW50U3BvdC5yb3crMV1bY3VycmVudFNwb3QuY29sdW1uXTtcclxuXHQgICAgICAgICAgICB9IGVsc2Uge1xyXG5cdCAgICAgICAgICAgICAgICBmb3VuZEVkZ2UgPSB0cnVlO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgIGNhc2UgKERpcmVjdGlvbi5VcCk6XHJcblx0ICAgICAgICAgICAgaWYgKGN1cnJlbnRTcG90LnJvdyAhPSAwKSB7XHJcblx0ICAgICAgICAgICAgICAgIG5ld1Nwb3QgPSB0aGlzLmJvYXJkLmNoZWNrZXJzW2N1cnJlbnRTcG90LnJvdy0xXVtjdXJyZW50U3BvdC5jb2x1bW5dO1xyXG5cdCAgICAgICAgICAgIH0gZWxzZSB7XHJcblx0ICAgICAgICAgICAgICAgIGZvdW5kRWRnZSA9IHRydWU7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgY2FzZSAoRGlyZWN0aW9uLlJpZ2h0KTpcclxuXHQgICAgICAgICAgICBpZiAoY3VycmVudFNwb3QuY29sdW1uICE9IHRoaXMubnVtQ29sdW1ucy0xKSB7XHJcblx0ICAgICAgICAgICAgICAgIG5ld1Nwb3QgPSB0aGlzLmJvYXJkLmNoZWNrZXJzW2N1cnJlbnRTcG90LnJvd11bY3VycmVudFNwb3QuY29sdW1uKzFdO1xyXG5cdCAgICAgICAgICAgIH0gZWxzZSB7XHJcblx0ICAgICAgICAgICAgICAgIGZvdW5kRWRnZSA9IHRydWU7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgY2FzZSAoRGlyZWN0aW9uLkxlZnQpOlxyXG5cdCAgICAgICAgICAgIGlmIChjdXJyZW50U3BvdC5jb2x1bW4gIT0gMCkge1xyXG5cdCAgICAgICAgICAgICAgICBuZXdTcG90ID0gdGhpcy5ib2FyZC5jaGVja2Vyc1tjdXJyZW50U3BvdC5yb3ddW2N1cnJlbnRTcG90LmNvbHVtbi0xXTtcclxuXHQgICAgICAgICAgICB9IGVsc2Uge1xyXG5cdCAgICAgICAgICAgICAgICBmb3VuZEVkZ2UgPSB0cnVlO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBicmVhazsgICAgXHJcblx0ICAgICAgICBkZWZhdWx0OlxyXG5cdCAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICB9XHJcblxyXG5cdCAgICBpZiAoZm91bmRFZGdlKSB7XHJcblx0ICAgICAgICBuZXdHYW1lU3RhdGUgPSBHYW1lU3RhdGUuVmljdG9yeTtcclxuXHQgICAgfSBlbHNlIHtcclxuXHQgICAgICAgIGlmIChuZXdTcG90LnRvdWNoZWQpIHtcclxuXHQgICAgICAgICAgICBuZXdHYW1lU3RhdGUgPSBHYW1lU3RhdGUuRmFpbHVyZTtcclxuXHQgICAgICAgIH0gZWxzZSB7XHJcblx0ICAgICAgICAgICAgdGhpcy5ib2FyZC5jaGVja2VyUGllY2UubW92ZShuZXdTcG90KTtcclxuXHQgICAgICAgICAgICB0aGlzLnNsaWRpbmdTb3VuZC5wbGF5KCk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgIH1cclxuXHJcblx0ICAgIHJldHVybiBuZXdHYW1lU3RhdGU7XHJcblx0fVxyXG5cclxuXHRzZXR1cChzdGFnZTogUElYSS5Db250YWluZXIsIHJlbmRlcmVyOiBQSVhJLlN5c3RlbVJlbmRlcmVyKSB7XHJcblx0XHR0aGlzLmJvYXJkID0gbmV3IEJvYXJkKHRoaXMubnVtUm93cywgdGhpcy5udW1Db2x1bW5zLCByZW5kZXJlcik7XHJcblx0XHRzdGFnZS5hZGRDaGlsZCh0aGlzLmJvYXJkLmdyYXBoaWNzKTtcclxuXHQgICAgdGhpcy5ib2FyZC5jaG9zZW5TcG90LnRvdWNoKCk7XHJcblx0fVxyXG5cclxuXHRkcmF3KHJlbmRlcmVyOiBQSVhJLlN5c3RlbVJlbmRlcmVyKSB7XHJcblx0XHR0aGlzLmJvYXJkLmdyYXBoaWNzLnggPSAocmVuZGVyZXIud2lkdGgvMikgLSAodGhpcy5ib2FyZC5ncmFwaGljcy53aWR0aC8yKTtcclxuXHRcdHRoaXMuYm9hcmQuZ3JhcGhpY3MueSA9IChyZW5kZXJlci5oZWlnaHQvMikgLSAodGhpcy5ib2FyZC5ncmFwaGljcy5oZWlnaHQvMik7XHJcblx0ICAgIHRoaXMuYm9hcmQuZHJhdygpO1xyXG5cdH1cclxuXHJcblx0ZGVjcmVhc2VSb3dzKCkge1xyXG5cdFx0aWYgKHRoaXMubnVtUm93cyA+IDEpIHtcclxuXHRcdFx0LS10aGlzLm51bVJvd3M7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRpbmNyZWFzZVJvd3MoKSB7XHJcblx0XHQrK3RoaXMubnVtUm93cztcclxuXHR9XHJcblxyXG5cdGRlY3JlYXNlQ29sdW1ucygpIHtcclxuXHRcdGlmICh0aGlzLm51bUNvbHVtbnMgPiAxKSB7XHJcblx0XHRcdC0tdGhpcy5udW1Db2x1bW5zO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aW5jcmVhc2VDb2x1bW5zKCkge1xyXG5cdFx0Kyt0aGlzLm51bUNvbHVtbnM7XHJcblx0fVxyXG5cclxuXHRzaHVmZmxlKCkge1xyXG5cdFx0dGhpcy5ib2FyZC5zaHVmZmxlQXJyb3dzKCk7XHJcblx0XHR0aGlzLmJvYXJkLmNoZWNrZXJQaWVjZS5zcG90LnRvdWNoKCk7XHJcblx0fVxyXG59XHJcblxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cblxuaW1wb3J0IFBJWEkgPSByZXF1aXJlKCdwaXhpLmpzJyk7XG5pbXBvcnQgSG93bGVyID0gcmVxdWlyZSgnaG93bGVyJyk7XG5cbmNvbnN0IHJlbmRlcmVyOlBJWEkuV2ViR0xSZW5kZXJlciA9IG5ldyBQSVhJLldlYkdMUmVuZGVyZXIod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlbmRlcmVyLnZpZXcpO1xuXG5pbXBvcnQge0RpcmVjdGlvbn0gZnJvbSAnLi9kaXJlY3Rpb24nO1xuaW1wb3J0IHtBcnJvd30gZnJvbSAnLi9hcnJvdyc7XG5pbXBvcnQge0NoZWNrZXJ9IGZyb20gJy4vY2hlY2tlcic7XG5pbXBvcnQge1VJV2lkZ2V0fSBmcm9tICcuL3dpZGdldCc7XG5pbXBvcnQge1BpZWNlfSBmcm9tICcuL3BpZWNlJztcbmltcG9ydCB7SGVscGVyc30gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7R2FtZX0gZnJvbSAnLi9nYW1lJztcbmltcG9ydCB7R2FtZVN0YXRlfSBmcm9tICcuL3N0YXRlJztcblxuLy8gWW91IG5lZWQgdG8gY3JlYXRlIGEgcm9vdCBjb250YWluZXIgdGhhdCB3aWxsIGhvbGQgdGhlIHNjZW5lIHlvdSB3YW50IHRvIGRyYXcuXG5jb25zdCBzdGFnZTpQSVhJLkNvbnRhaW5lciA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xuXG4vL3JlbmRlcmVyLmJhY2tncm91bmRDb2xvciA9IDB4NTU1MmIyO1xucmVuZGVyZXIuYmFja2dyb3VuZENvbG9yID0gMHgwMDAwMDA7XG5cbi8vIHNldCB1cCBnYW1lIGxvb3AgdGltZXJcbmxldCB0aWNrZXIgPSBuZXcgUElYSS50aWNrZXIuVGlja2VyKCk7XG50aWNrZXIuc3RvcCgpO1xuXG4vLyBnYW1lIG9iamVjdFxubGV0IGdhbWUgPSBuZXcgR2FtZShyZW5kZXJlcik7XG5cbi8vIGRlZmluZSBVSVxubGV0IHBsYXlXaWRnZXQ6IFVJV2lkZ2V0O1xubGV0IHN0b3BXaWdldDogVUlXaWRnZXQ7XG5sZXQgc2h1ZmZsZVdpZGdldDogVUlXaWRnZXQ7XG5sZXQgcmVzZXRXaWRnZXQ6IFVJV2lkZ2V0O1xubGV0IGRlY3JlYXNlUm93c1dpZGdldDogVUlXaWRnZXQ7XG5sZXQgaW5jcmVhc2VSb3dzV2lkZ2V0OiBVSVdpZGdldDtcbmxldCByb3dOdW1XaWRnZXQ6IFVJV2lkZ2V0O1xubGV0IGRlY3JlYXNlQ29sdW1uc1dpZGdldDogVUlXaWRnZXQ7XG5sZXQgaW5jcmVhc2VDb2x1bW5zV2lkZ2V0OiBVSVdpZGdldDtcbmxldCBjb2x1bW5OdW1XaWRnZXQ6IFVJV2lkZ2V0O1xubGV0IHZpY3RvcnlXaWRnZXQ6IFVJV2lkZ2V0O1xubGV0IGN5Y2xlV2lkZ2V0OiBVSVdpZGdldDtcblxuLy8gU291bmQgZWZmZWN0c1xubGV0IHZpY3RvcnlTb3VuZCA9IG5ldyBIb3dsZXIuSG93bCh7XG4gICAgc3JjOiAnd2luLm1wMydcbn0pO1xuXG5sZXQgZmFpbFNvdW5kID0gbmV3IEhvd2xlci5Ib3dsKHtcbiAgICBzcmM6ICdmYWlsLm1wMydcbn0pO1xuXG4vLyBEbyBmaXJzdC10aW1lIGdhbWUgYm9hcmQgc2V0dXBcbnNldHVwKCk7XG4vLyBTdGFydCBhbmltYXRpb24vcmVuZGVyaW5nIGxvb3BcbmFuaW1hdGUoKTtcblxuLy8gU2V0dXAgUFhJIHRpY2tlciBhcyBnYW1lIGxvZ2ljIGxvb3BcbnRpY2tlci5hZGQoZ2FtZUxvb3ApO1xuXG4vKioqIEZ1bmN0aW9ucyAqKiovXG5cbmZ1bmN0aW9uIGdhbWVMb29wKGRlbHRhVGltZTogbnVtYmVyKSB7XG4gICAgbGV0IG5ld1N0YXRlID0gZ2FtZS5nYW1lTG9vcChkZWx0YVRpbWUpO1xuICAgIGlmIChuZXdTdGF0ZSA9PSBHYW1lU3RhdGUuVmljdG9yeSkge1xuICAgICAgICBzdG9wKCk7XG4gICAgICAgIHZpY3RvcnlTb3VuZC5wbGF5KCk7XG4gICAgICAgIGFsZXJ0KFwiQ29uZ3JhdHVsYXRpb25zLCB5b3Ugd2luIVwiKTtcbiAgICAgICAgcmVzZXQoKTtcbiAgICB9IGVsc2UgaWYgKG5ld1N0YXRlID09IEdhbWVTdGF0ZS5GYWlsdXJlKSB7XG4gICAgICAgIHN0b3AoKTtcbiAgICAgICAgZmFpbFNvdW5kLnBsYXkoKTtcbiAgICAgICAgYWxlcnQoXCJDeWNsZSBkZXRlY3RlZCAtLSBjYW4ndCBtb3ZlIGhlcmVcIik7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBhbmltYXRlKCkge1xuICAgIC8vIHN0YXJ0IHRoZSB0aW1lciBmb3IgdGhlIG5leHQgYW5pbWF0aW9uIGxvb3BcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG5cbiAgICAvLyBkcmF3IGdhbWVcbiAgICBnYW1lLmRyYXcocmVuZGVyZXIpO1xuXG4gICAgcmVuZGVyZXIucmVuZGVyKHN0YWdlKTtcbiAgICAvLyBkcmF3IFVJIHdpZGdldHNcbiAgICBwbGF5V2lkZ2V0LmRyYXcocmVuZGVyZXIpO1xuICAgIHN0b3BXaWdldC5kcmF3KHJlbmRlcmVyKTtcbiAgICBzaHVmZmxlV2lkZ2V0LmRyYXcocmVuZGVyZXIpO1xuICAgIHJlc2V0V2lkZ2V0LmRyYXcocmVuZGVyZXIpO1xuICAgIGRlY3JlYXNlUm93c1dpZGdldC5kcmF3KHJlbmRlcmVyKTtcbiAgICBpbmNyZWFzZVJvd3NXaWRnZXQuZHJhdyhyZW5kZXJlcik7XG4gICAgcm93TnVtV2lkZ2V0LmRyYXcocmVuZGVyZXIpO1xuICAgIGRlY3JlYXNlQ29sdW1uc1dpZGdldC5kcmF3KHJlbmRlcmVyKTtcbiAgICBpbmNyZWFzZUNvbHVtbnNXaWRnZXQuZHJhdyhyZW5kZXJlcik7XG4gICAgY29sdW1uTnVtV2lkZ2V0LmRyYXcocmVuZGVyZXIpO1xuXG4gICAgLy8gdGhpcyBpcyB0aGUgbWFpbiByZW5kZXIgY2FsbCB0aGF0IG1ha2VzIHBpeGkgZHJhdyB5b3VyIGNvbnRhaW5lciBhbmQgaXRzIGNoaWxkcmVuLlxufVxuXG4vLyBjcmVhdGUgd2luZG93IHJlc2l6ZSBoYW5kbGVyXG4vLyBnYW1lIGJvYXJkIGNvbXBvbmVudHMgc2hvdWxkIGNoYW5nZSBzaXplIHRvXG4vLyByZWZsZWN0IHRoZSBuZXcgd2luZG93IHNpemVcbndpbmRvdy5vbnJlc2l6ZSA9IChldmVudCk9PntcbiAgICByZW5kZXJlci5yZXNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgZ2FtZS5ib2FyZC5yZXNpemUocmVuZGVyZXIpO1xuICAgIC8vcmVzZXQoKTtcbn07XG5cblxuLy8gVUkgZXZlbnQgaGFuZGxlcnNcbmZ1bmN0aW9uIGNsaWNrUGxheSgpIHtcbiAgICBwbGF5KCk7XG59XG5cbmZ1bmN0aW9uIGNsaWNrU3RvcCgpIHtcbiAgICBzdG9wKCk7XG59XG5cbmZ1bmN0aW9uIGNsaWNrU2h1ZmZsZSgpIHtcbiAgICBnYW1lLnNodWZmbGUoKTtcbn1cblxuZnVuY3Rpb24gY2xpY2tSZXNldCgpIHtcbiAgICByZXNldCgpO1xufVxuXG5mdW5jdGlvbiBjbGlja0RlY3JlYXNlUm93cygpIHtcbiAgICBnYW1lLmRlY3JlYXNlUm93cygpO1xuICAgIHJlc2V0KCk7XG59XG5cbmZ1bmN0aW9uIGNsaWNrSW5jcmVhc2VSb3dzKCkge1xuICAgIGdhbWUuaW5jcmVhc2VSb3dzKCk7XG4gICAgcmVzZXQoKTtcbn1cblxuZnVuY3Rpb24gY2xpY2tEZWNyZWFzZUNvbHVtbnMoKSB7XG4gICAgZ2FtZS5kZWNyZWFzZUNvbHVtbnMoKTtcbiAgICByZXNldCgpO1xufVxuXG5mdW5jdGlvbiBjbGlja0luY3JlYXNlQ29sdW1ucygpIHtcbiAgICBnYW1lLmluY3JlYXNlQ29sdW1ucygpO1xuICAgIHJlc2V0KCk7XG59XG5cblxuLyoqKiogR2FtZSBMb2dpYyBGdW5jdGlvbnMgKioqKi9cblxuZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAgZ2FtZS5zZXR1cChzdGFnZSwgcmVuZGVyZXIpOyBcblxuICAgIHBsYXlXaWRnZXQgPSBuZXcgVUlXaWRnZXQobmV3IFBJWEkuUmVjdGFuZ2xlKDEwMCwgMzAsIDY1LCAzNSksIFwiUGxheVwiLCBjbGlja1BsYXkpO1xuICAgIHN0YWdlLmFkZENoaWxkKHBsYXlXaWRnZXQuZ3JhcGhpY3MpO1xuICAgIHN0YWdlLmFkZENoaWxkKHBsYXlXaWRnZXQudGV4dCk7XG5cbiAgICBzdG9wV2lnZXQgPSBuZXcgVUlXaWRnZXQobmV3IFBJWEkuUmVjdGFuZ2xlKDEwMCwgODAsIDY1LCAzNSksIFwiU3RvcFwiLCBjbGlja1N0b3ApO1xuICAgIHN0YWdlLmFkZENoaWxkKHN0b3BXaWdldC5ncmFwaGljcyk7XG4gICAgc3RhZ2UuYWRkQ2hpbGQoc3RvcFdpZ2V0LnRleHQpO1xuXG4gICAgc2h1ZmZsZVdpZGdldCA9IG5ldyBVSVdpZGdldChuZXcgUElYSS5SZWN0YW5nbGUoMTAwLCAxMzAsIDkwLCAzNSksIFwiU2h1ZmZsZVwiLCBjbGlja1NodWZmbGUpO1xuICAgIHN0YWdlLmFkZENoaWxkKHNodWZmbGVXaWRnZXQuZ3JhcGhpY3MpO1xuICAgIHN0YWdlLmFkZENoaWxkKHNodWZmbGVXaWRnZXQudGV4dCk7XG5cbiAgICByZXNldFdpZGdldCA9IG5ldyBVSVdpZGdldChuZXcgUElYSS5SZWN0YW5nbGUoMTAwLCAxODAsIDgwLCAzNSksIFwiUmVzZXRcIiwgY2xpY2tSZXNldCk7XG4gICAgc3RhZ2UuYWRkQ2hpbGQocmVzZXRXaWRnZXQuZ3JhcGhpY3MpO1xuICAgIHN0YWdlLmFkZENoaWxkKHJlc2V0V2lkZ2V0LnRleHQpO1xuXG4gICAgZGVjcmVhc2VSb3dzV2lkZ2V0ID0gbmV3IFVJV2lkZ2V0KG5ldyBQSVhJLlJlY3RhbmdsZSgxMTAsIDIzMCwgMjUsIDM1KSwgXCI8XCIsIGNsaWNrRGVjcmVhc2VSb3dzKTtcbiAgICBzdGFnZS5hZGRDaGlsZChkZWNyZWFzZVJvd3NXaWRnZXQuZ3JhcGhpY3MpO1xuICAgIHN0YWdlLmFkZENoaWxkKGRlY3JlYXNlUm93c1dpZGdldC50ZXh0KTtcblxuICAgIHJvd051bVdpZGdldCA9IG5ldyBVSVdpZGdldChuZXcgUElYSS5SZWN0YW5nbGUoZGVjcmVhc2VSb3dzV2lkZ2V0LnJlY3QueCAtIDQwLCAyMzAsIDQwLCAzNSksIFN0cmluZyhnYW1lLm51bVJvd3MpLCAoKT0+e30pO1xuICAgIHN0YWdlLmFkZENoaWxkKHJvd051bVdpZGdldC5ncmFwaGljcyk7XG4gICAgc3RhZ2UuYWRkQ2hpbGQocm93TnVtV2lkZ2V0LnRleHQpO1xuXG4gICAgaW5jcmVhc2VSb3dzV2lkZ2V0ID0gbmV3IFVJV2lkZ2V0KG5ldyBQSVhJLlJlY3RhbmdsZShyb3dOdW1XaWRnZXQucmVjdC54IC0gNDUsIDIzMCwgMjUsIDM1KSwgXCI+XCIsIGNsaWNrSW5jcmVhc2VSb3dzKTtcbiAgICBzdGFnZS5hZGRDaGlsZChpbmNyZWFzZVJvd3NXaWRnZXQuZ3JhcGhpY3MpO1xuICAgIHN0YWdlLmFkZENoaWxkKGluY3JlYXNlUm93c1dpZGdldC50ZXh0KTtcblxuICAgIGRlY3JlYXNlQ29sdW1uc1dpZGdldCA9IG5ldyBVSVdpZGdldChuZXcgUElYSS5SZWN0YW5nbGUoMTEwLCAyODAsIDI1LCAzNSksIFwiPFwiLCBjbGlja0RlY3JlYXNlQ29sdW1ucyk7XG4gICAgc3RhZ2UuYWRkQ2hpbGQoZGVjcmVhc2VDb2x1bW5zV2lkZ2V0LmdyYXBoaWNzKTtcbiAgICBzdGFnZS5hZGRDaGlsZChkZWNyZWFzZUNvbHVtbnNXaWRnZXQudGV4dCk7XG5cbiAgICBjb2x1bW5OdW1XaWRnZXQgPSBuZXcgVUlXaWRnZXQobmV3IFBJWEkuUmVjdGFuZ2xlKGRlY3JlYXNlQ29sdW1uc1dpZGdldC5yZWN0LnggLSA0MCwgMjgwLCA0MCwgMzUpLCBTdHJpbmcoZ2FtZS5udW1Db2x1bW5zKSwgKCk9Pnt9KTtcbiAgICBzdGFnZS5hZGRDaGlsZChjb2x1bW5OdW1XaWRnZXQuZ3JhcGhpY3MpO1xuICAgIHN0YWdlLmFkZENoaWxkKGNvbHVtbk51bVdpZGdldC50ZXh0KTtcblxuICAgIGluY3JlYXNlQ29sdW1uc1dpZGdldCA9IG5ldyBVSVdpZGdldChuZXcgUElYSS5SZWN0YW5nbGUocm93TnVtV2lkZ2V0LnJlY3QueCAtIDQ1LCAyODAsIDI1LCAzNSksIFwiPlwiLCBjbGlja0luY3JlYXNlQ29sdW1ucyk7XG4gICAgc3RhZ2UuYWRkQ2hpbGQoaW5jcmVhc2VDb2x1bW5zV2lkZ2V0LmdyYXBoaWNzKTtcbiAgICBzdGFnZS5hZGRDaGlsZChpbmNyZWFzZUNvbHVtbnNXaWRnZXQudGV4dCk7XG59XG5cbmZ1bmN0aW9uIHBsYXkoKSB7XG4gICAgdGlja2VyLnN0YXJ0KCk7XG59XG5cbmZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgdGlja2VyLnN0b3AoKTtcbn1cblxuZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgc3RvcCgpO1xuICAgIHN0YWdlLnJlbW92ZUNoaWxkcmVuKDAsIHN0YWdlLmNoaWxkcmVuLmxlbmd0aC0xKTtcbiAgICBzZXR1cCgpO1xufVxuXG5cblxuXG5cblxuXG5cbiIsImltcG9ydCBQSVhJID0gcmVxdWlyZSgncGl4aS5qcycpO1xyXG5pbXBvcnQge0NoZWNrZXJ9IGZyb20gJy4vY2hlY2tlcic7XHJcblxyXG5leHBvcnQgY2xhc3MgUGllY2Uge1xyXG5cdHNwb3Q6IENoZWNrZXI7XHJcblx0cjogbnVtYmVyO1xyXG5cdGNvbG9yOiBudW1iZXI7XHJcblx0eDogbnVtYmVyO1xyXG5cdHk6IG51bWJlcjtcclxuXHRuZXdYOiBudW1iZXI7XHJcblx0bmV3WTogbnVtYmVyO1xyXG5cdG9sZFg6IG51bWJlcjtcclxuXHRvbGRZOiBudW1iZXI7XHJcblx0Z3JhcGhpY3M6IFBJWEkuR3JhcGhpY3M7XHJcblx0dHJhbnNpdGlvblRpbWU6IG51bWJlcjtcclxuXHR0cmFuc2l0aW9uUHJvZ3Jlc3M6IG51bWJlcjtcclxuXHRtb3Zpbmc6IGJvb2xlYW47XHJcblxyXG5cdGNvbnN0cnVjdG9yKHNwb3Q6IENoZWNrZXIsIHI6IG51bWJlciwgY29sb3I6IG51bWJlcikge1xyXG5cdFx0dGhpcy5zcG90ID0gc3BvdDtcclxuXHRcdHRoaXMuciA9IHI7XHJcblx0XHR0aGlzLmNvbG9yID0gY29sb3I7XHJcblx0XHR0aGlzLmdyYXBoaWNzID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcclxuXHJcblx0XHR0aGlzLnggPSAwO1xyXG5cdFx0dGhpcy55ID0gMDtcclxuXHRcdHRoaXMubmV3WSA9IDA7XHJcblx0XHR0aGlzLm5ld1ggPSAwO1xyXG5cdFx0dGhpcy5vbGRYID0gMDtcclxuXHRcdHRoaXMub2xkWSA9IDA7XHJcblxyXG5cdFx0dGhpcy50cmFuc2l0aW9uVGltZSA9IDIwO1xyXG5cdFx0dGhpcy50cmFuc2l0aW9uUHJvZ3Jlc3MgPSAwO1xyXG5cdFx0dGhpcy5tb3ZpbmcgPSBmYWxzZTtcclxuXHR9XHJcblxyXG5cdG1vdmUgKHNwb3Q6IENoZWNrZXIpIHtcclxuXHRcdHRoaXMubW92aW5nID0gdHJ1ZTtcclxuXHRcdHRoaXMubmV3WCA9IHNwb3QuZ3JhcGhpY3MueCAtIHRoaXMuc3BvdC5ncmFwaGljcy54O1xyXG5cdFx0dGhpcy5uZXdZID0gc3BvdC5ncmFwaGljcy55IC0gdGhpcy5zcG90LmdyYXBoaWNzLnk7IFxyXG5cdFx0dGhpcy54ID0gdGhpcy5uZXdYO1xyXG5cdFx0dGhpcy55ID0gdGhpcy5uZXdZO1xyXG5cdFx0dGhpcy5zcG90ID0gc3BvdDtcdFxyXG5cdFx0dGhpcy5vbGRYID0gdGhpcy54O1xyXG5cdFx0dGhpcy5vbGRZID0gdGhpcy55O1xyXG5cclxuXHRcdHRoaXMuc3BvdC50b3VjaCgpO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKGRlbHRhVGltZTogbnVtYmVyKSB7XHJcblx0XHRpZiAodGhpcy5tb3ZpbmcpIHtcclxuXHRcdFx0dGhpcy50cmFuc2l0aW9uUHJvZ3Jlc3MgKz0gZGVsdGFUaW1lO1xyXG5cdFx0XHR0aGlzLnggLT0gKHRoaXMubmV3WCkgKiAoZGVsdGFUaW1lIC8gdGhpcy50cmFuc2l0aW9uVGltZSk7IFxyXG5cdFx0XHR0aGlzLnkgLT0gKHRoaXMubmV3WSkgKiAoZGVsdGFUaW1lIC8gdGhpcy50cmFuc2l0aW9uVGltZSk7XHJcblx0XHRcdGlmICh0aGlzLnRyYW5zaXRpb25Qcm9ncmVzcyA+PSB0aGlzLnRyYW5zaXRpb25UaW1lKSB7XHJcblx0XHRcdFx0dGhpcy5tb3ZpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHR0aGlzLnRyYW5zaXRpb25Qcm9ncmVzcyA9IDA7XHJcblx0XHRcdFx0Ly8gbWFrZSBzdXJlIHdlIGRpZG4ndCBiYXJlbHkgbWlzcyB0aGUgZXhhY3QgdGFyZ2V0IGZyb20gcm91bmRpbmcgZXJyb3JzLCBldGMuXHJcblx0XHRcdFx0dGhpcy54ID0gMDtcclxuXHRcdFx0XHR0aGlzLnkgPSAwO1xyXG5cdFx0XHRcdHRoaXMub2xkWCA9IHRoaXMubmV3WCA9IDA7XHJcblx0XHRcdFx0dGhpcy5vbGRZID0gdGhpcy5uZXdZID0gMDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZHJhdyAoKSB7XHJcblx0XHR0aGlzLmdyYXBoaWNzLmNsZWFyKCk7XHJcblx0XHR0aGlzLmdyYXBoaWNzLmJlZ2luRmlsbCh0aGlzLmNvbG9yLCAxKTtcclxuXHRcdHRoaXMuZ3JhcGhpY3MuZHJhd0NpcmNsZSgodGhpcy5zcG90LmdyYXBoaWNzLnggKyB0aGlzLnNwb3QuZ3JhcGhpY3Mud2lkdGgvMiktdGhpcy54LCBcclxuXHRcdFx0KHRoaXMuc3BvdC5ncmFwaGljcy55ICsgdGhpcy5zcG90LmdyYXBoaWNzLmhlaWdodC8yKS10aGlzLnksIHRoaXMucik7XHJcblx0XHR0aGlzLmdyYXBoaWNzLmVuZEZpbGwoKTtcclxuXHR9XHJcbn1cclxuIiwiZXhwb3J0IGVudW0gR2FtZVN0YXRlIHtcclxuXHRWaWN0b3J5ID0gMCxcclxuXHRGYWlsdXJlID0gMSxcclxuXHRDb250aW51ZSA9IDJcclxufVxyXG4iLCJpbXBvcnQgUElYSSA9IHJlcXVpcmUoJ3BpeGkuanMnKTtcclxuaW1wb3J0IHtEaXJlY3Rpb259IGZyb20gJy4vZGlyZWN0aW9uJztcclxuaW1wb3J0IHtDaGVja2VyfSBmcm9tICcuL2NoZWNrZXInO1xyXG5cclxuZXhwb3J0IG5hbWVzcGFjZSBIZWxwZXJzIHtcclxuXHRleHBvcnQgZnVuY3Rpb24gZ2V0UmFuZG9tRGlyZWN0aW9uKCkge1xyXG5cdCAgICByZXR1cm4gPERpcmVjdGlvbj5NYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA0KTtcclxuXHR9XHJcblxyXG5cdGV4cG9ydCBmdW5jdGlvbiBnZXRDZWxsc2l6ZShudW1Db2x1bW5zOiBudW1iZXIsIG51bVJvd3M6IG51bWJlciwgc2NyZWVuV2lkdGg6IG51bWJlciwgc2NyZWVuSGVpZ2h0OiBudW1iZXIpIHtcclxuXHRcdHJldHVybiBNYXRoLm1pbihzY3JlZW5XaWR0aCAvIG51bUNvbHVtbnMsIHNjcmVlbkhlaWdodCAvIG51bVJvd3MpO1xyXG5cdH1cclxufSIsImltcG9ydCBQSVhJID0gcmVxdWlyZSgncGl4aS5qcycpO1xyXG5cclxuZXhwb3J0IGNsYXNzIFVJV2lkZ2V0IHtcclxuXHRyZWN0OiBQSVhJLlJlY3RhbmdsZTtcclxuXHR0ZXh0OiBQSVhJLlRleHQ7XHJcblx0Z3JhcGhpY3M6IFBJWEkuR3JhcGhpY3M7XHJcblx0Y2xpY2tIYW5kbGVyOiAoKT0+YW55O1xyXG5cdGNvbG9yOiBudW1iZXI7XHJcblx0YWxwaGE6IG51bWJlcjtcclxuXHRlbmFibGVkOiBib29sZWFuO1xyXG5cclxuXHRjb25zdHJ1Y3RvcihyZWN0OiBQSVhJLlJlY3RhbmdsZSwgdGV4dDogc3RyaW5nLCBjbGlja0hhbmRsZXI6ICgpPT5hbnkpIHtcclxuXHRcdHRoaXMucmVjdCA9IHJlY3Q7XHJcblx0XHR0aGlzLnRleHQgPSBuZXcgUElYSS5UZXh0KHRleHQpO1xyXG5cdFx0dGhpcy5ncmFwaGljcyA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XHJcblxyXG5cdFx0Ly8gYWRkIFwicGFkZGluZ1wiIHRvIHRleHRcclxuXHRcdHRoaXMudGV4dC54ID0gdGhpcy5yZWN0LnggKyA1O1xyXG5cdFx0dGhpcy50ZXh0LnkgPSB0aGlzLnJlY3QueSArIDU7XHJcblxyXG5cdFx0Ly8gdHVybiBvbiBidXR0b25Nb2RlIHNvIHRoYXQgd2UgY2FuIGludGVyYWN0IHZpYSBtb3VzZVxyXG5cdFx0dGhpcy5ncmFwaGljcy5pbnRlcmFjdGl2ZSA9IHRydWU7XHJcblx0XHR0aGlzLmdyYXBoaWNzLmJ1dHRvbk1vZGUgPSB0cnVlO1xyXG5cclxuXHRcdHRoaXMuY29sb3IgPSAweGM0YzRjNDtcclxuXHRcdHRoaXMuYWxwaGEgPSAwLjc7XHJcblxyXG5cdFx0dGhpcy5lbmFibGVkID0gdHJ1ZTtcclxuXHJcblx0XHQvLyBiaW5kIHRoZSBjbGljayBoYW5kbGVyIGNhbGxiYWNrXHJcblx0XHR0aGlzLmNsaWNrSGFuZGxlciA9IGNsaWNrSGFuZGxlcjtcclxuXHRcdHRoaXMuZ3JhcGhpY3Mub24oXCJjbGlja1wiLCBjbGlja0hhbmRsZXIpO1xyXG5cclxuXHRcdC8vIGJpbmQgbW91c2Vkb3duIGhhbmRsZXIsIGZvciBzaG93aW5nIHRoYXQgdGhlIGJ1dHRvblxyXG5cdFx0Ly9cdGlzIGJlaW5nIGRlcHJlc3NlZFxyXG5cdFx0dGhpcy5ncmFwaGljcy5vbihcIm1vdXNlZG93blwiLCAoKT0+e1xyXG5cdFx0XHRpZiAodGhpcy5lbmFibGVkKSB7XHJcblx0XHRcdFx0dGhpcy5jb2xvciA9IDB4OTY5Njk2O1xyXG5cdFx0XHRcdHRoaXMuYWxwaGEgPSAwLjk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHRoaXMuZ3JhcGhpY3Mub24oXCJtb3VzZXVwXCIsICgpPT57XHJcblx0XHRcdGlmICh0aGlzLmVuYWJsZWQpIHtcclxuXHRcdFx0XHR0aGlzLmNvbG9yID0gMHhjNGM0YzQ7XHJcblx0XHRcdFx0dGhpcy5hbHBoYSA9IDAuNztcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRzZXRFbmFibGVkKGVuYWJsZWQ6IGJvb2xlYW4pIHtcclxuXHRcdHRoaXMuZW5hYmxlZCA9IGVuYWJsZWQ7XHJcblx0XHRpZiAodGhpcy5lbmFibGVkKSB7XHJcblx0XHRcdHRoaXMuY29sb3IgPSAweGM0YzRjNDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuY29sb3IgPSAweDk2OTY5NjtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGRyYXcgKHJlbmRlcmVyOiBQSVhJLlN5c3RlbVJlbmRlcmVyKSB7XHJcblx0XHR0aGlzLmdyYXBoaWNzLmNsZWFyKCk7XHJcblx0XHR0aGlzLnRleHQueCA9IHJlbmRlcmVyLndpZHRoIC0gdGhpcy5yZWN0LnggKyA1O1xyXG5cdFx0dGhpcy5ncmFwaGljcy5iZWdpbkZpbGwodGhpcy5jb2xvciwgdGhpcy5hbHBoYSk7XHJcblx0XHR0aGlzLmdyYXBoaWNzLmRyYXdSZWN0KHJlbmRlcmVyLndpZHRoIC0gdGhpcy5yZWN0LngsIHRoaXMucmVjdC55LCB0aGlzLnJlY3Qud2lkdGgsIHRoaXMucmVjdC5oZWlnaHQpO1xyXG5cdFx0dGhpcy5ncmFwaGljcy5lbmRGaWxsKCk7XHJcblx0fVxyXG59Il19
