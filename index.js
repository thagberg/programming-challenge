(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.jiboProgrammingChallenge = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/// <reference path="../typings/index.d.ts" />
/// <reference path="shapes.ts" />
"use strict";
var PIXI = require('pixi.js');
var Howler = require('howler');
var renderer = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.view);
var shapes_1 = require('./shapes');
// You need to create a root container that will hold the scene you want to draw.
var stage = new PIXI.Container();
// set background color as an easy way to only draw half of the checkerboard spaces
renderer.backgroundColor = 0x5552b2;
// set up game loop timer
var UPDATE_TIME = 100;
var watchTime = 0;
var ticker = new PIXI.ticker.Ticker();
ticker.stop();
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
// define game board properties
var numColumns = 12;
var numRows = 6;
var checkerWidth = renderer.width / numColumns;
var checkerHeight = renderer.height / numRows;
// create board, arrows, and pieces
var checkers = [];
var checkerBoard;
var chosenSpot;
var checkerPiece;
// Sound effects
var slidingSound = new Howler.Howl({
    src: 'Sliding.mp3'
});
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
    // doing one-second "turns"
    watchTime += deltaTime;
    if (watchTime >= UPDATE_TIME) {
        update();
        watchTime = 0;
    }
    checkerPiece.update(deltaTime);
}
function animate() {
    // start the timer for the next animation loop
    requestAnimationFrame(animate);
    // draw checker piece
    checkerPiece.draw();
    // draw UI widgets
    playWidget.draw();
    stopWiget.draw();
    shuffleWidget.draw();
    resetWidget.draw();
    decreaseRowsWidget.draw();
    increaseRowsWidget.draw();
    rowNumWidget.draw();
    decreaseColumnsWidget.draw();
    increaseColumnsWidget.draw();
    columnNumWidget.draw();
    // this is the main render call that makes pixi draw your container and its children.
    renderer.render(stage);
}
// create window resize handler
// game board components should change size to
// reflect the new window size
window.onresize = function (event) {
    renderer.resize(window.innerWidth, window.innerHeight);
    reset();
};
// UI event handlers
function clickPlay() {
    play();
}
function clickStop() {
    stop();
}
function clickShuffle() {
    shuffleArrows();
    // we just "reset" the touched graph, so re-mark the checker piece's spot as touched
    checkerPiece.spot.touch();
}
function clickReset() {
    reset();
}
function clickDecreaseRows() {
    if (numRows > 1) {
        numRows--;
        reset();
    }
}
function clickIncreaseRows() {
    numRows++;
    reset();
}
function clickDecreaseColumns() {
    if (numColumns > 1) {
        numColumns--;
        reset();
    }
}
function clickIncreaseColumns() {
    numColumns++;
    reset();
}
/**** Game Logic Functions ****/
function shuffleArrows() {
    for (var _i = 0, checkers_1 = checkers; _i < checkers_1.length; _i++) {
        var row = checkers_1[_i];
        for (var _a = 0, row_1 = row; _a < row_1.length; _a++) {
            var checker = row_1[_a];
            checker.arrow.direction = getRandomDirection();
            // since we're reshuffling the arrows, we no longer know which spaces
            // the checker piece has already touched
            checker.reset();
        }
    }
}
function play() {
    ticker.start();
}
function stop() {
    ticker.stop();
}
function update() {
    var currentSpot = checkerPiece.spot;
    var newSpot;
    var foundEdge = false;
    switch (currentSpot.arrow.direction) {
        case (shapes_1.Direction.Down):
            if (currentSpot.row != numRows - 1) {
                newSpot = checkers[currentSpot.row + 1][currentSpot.column];
            }
            else {
                foundEdge = true;
            }
            break;
        case (shapes_1.Direction.Up):
            if (currentSpot.row != 0) {
                newSpot = checkers[currentSpot.row - 1][currentSpot.column];
            }
            else {
                foundEdge = true;
            }
            break;
        case (shapes_1.Direction.Right):
            if (currentSpot.column != numColumns - 1) {
                newSpot = checkers[currentSpot.row][currentSpot.column + 1];
            }
            else {
                foundEdge = true;
            }
            break;
        case (shapes_1.Direction.Left):
            if (currentSpot.column != 0) {
                newSpot = checkers[currentSpot.row][currentSpot.column - 1];
            }
            else {
                foundEdge = true;
            }
            break;
        default:
            break;
    }
    if (foundEdge) {
        stop();
        victorySound.play();
        alert("You win!  Congratulations!");
        reset();
    }
    else {
        if (newSpot.touched) {
            stop();
            failSound.play();
            alert("Loop detected -- Can't move to this spot");
        }
        else {
            checkerPiece.move(newSpot);
            slidingSound.play();
        }
    }
}
function reset() {
    stop();
    stage.removeChildren(0, stage.children.length - 1);
    setup();
}
function setup() {
    checkerWidth = renderer.width / numColumns;
    checkerHeight = renderer.height / numRows;
    checkers = createCheckers(numColumns, numRows, checkerWidth, checkerHeight);
    checkerBoard = createCheckerBoard(numColumns, numRows, checkerWidth, checkerHeight);
    stage.addChild(checkerBoard);
    chosenSpot = checkers[Math.floor(Math.random() * checkers.length)][Math.floor(Math.random() * checkers[0].length)];
    checkerPiece = new shapes_1.Piece(chosenSpot, checkerWidth / 2.3, 0xBB0000);
    chosenSpot.touch();
    stage.addChild(checkerPiece.graphics);
    for (var _i = 0, checkers_2 = checkers; _i < checkers_2.length; _i++) {
        var row = checkers_2[_i];
        for (var _a = 0, row_2 = row; _a < row_2.length; _a++) {
            var checker = row_2[_a];
            stage.addChild(checker.arrow.graphics);
        }
    }
    drawArrows();
    playWidget = new shapes_1.UIWidget(new PIXI.Rectangle(renderer.width - 100, 30, 65, 35), "Play", clickPlay);
    stage.addChild(playWidget.graphics);
    stage.addChild(playWidget.text);
    stopWiget = new shapes_1.UIWidget(new PIXI.Rectangle(renderer.width - 100, 80, 65, 35), "Stop", clickStop);
    stage.addChild(stopWiget.graphics);
    stage.addChild(stopWiget.text);
    shuffleWidget = new shapes_1.UIWidget(new PIXI.Rectangle(renderer.width - 100, 130, 90, 35), "Shuffle", clickShuffle);
    stage.addChild(shuffleWidget.graphics);
    stage.addChild(shuffleWidget.text);
    resetWidget = new shapes_1.UIWidget(new PIXI.Rectangle(renderer.width - 100, 180, 80, 35), "Reset", clickReset);
    stage.addChild(resetWidget.graphics);
    stage.addChild(resetWidget.text);
    decreaseRowsWidget = new shapes_1.UIWidget(new PIXI.Rectangle(renderer.width - 110, 230, 25, 35), "<", clickDecreaseRows);
    stage.addChild(decreaseRowsWidget.graphics);
    stage.addChild(decreaseRowsWidget.text);
    rowNumWidget = new shapes_1.UIWidget(new PIXI.Rectangle(decreaseRowsWidget.rect.x + 40, 230, 40, 35), String(numRows), function () { });
    stage.addChild(rowNumWidget.graphics);
    stage.addChild(rowNumWidget.text);
    increaseRowsWidget = new shapes_1.UIWidget(new PIXI.Rectangle(rowNumWidget.rect.x + 45, 230, 25, 35), ">", clickIncreaseRows);
    stage.addChild(increaseRowsWidget.graphics);
    stage.addChild(increaseRowsWidget.text);
    decreaseColumnsWidget = new shapes_1.UIWidget(new PIXI.Rectangle(renderer.width - 110, 280, 25, 35), "<", clickDecreaseColumns);
    stage.addChild(decreaseColumnsWidget.graphics);
    stage.addChild(decreaseColumnsWidget.text);
    columnNumWidget = new shapes_1.UIWidget(new PIXI.Rectangle(decreaseColumnsWidget.rect.x + 40, 280, 40, 35), String(numColumns), function () { });
    stage.addChild(columnNumWidget.graphics);
    stage.addChild(columnNumWidget.text);
    increaseColumnsWidget = new shapes_1.UIWidget(new PIXI.Rectangle(rowNumWidget.rect.x + 45, 280, 25, 35), ">", clickIncreaseColumns);
    stage.addChild(increaseColumnsWidget.graphics);
    stage.addChild(increaseColumnsWidget.text);
}
function drawArrows() {
    for (var _i = 0, checkers_3 = checkers; _i < checkers_3.length; _i++) {
        var row = checkers_3[_i];
        for (var _a = 0, row_3 = row; _a < row_3.length; _a++) {
            var checker = row_3[_a];
            checker.draw();
        }
    }
}
function createCheckers(numColumns, numRows, checkerWidth, checkerHeight) {
    var checkers = [];
    for (var i = 0; i < numRows; i++) {
        checkers[i] = [];
        for (var j = 0; j < numColumns; j++) {
            var newChecker = new shapes_1.Checker(i, j, j * checkerWidth, i * checkerHeight, checkerWidth, checkerHeight);
            // assign a random direction to each checker arrow
            newChecker.arrow.direction = getRandomDirection();
            checkers[i][j] = newChecker;
        }
    }
    return checkers;
}
function createCheckerBoard(numColumns, numRows, checkerWidth, checkerHeight) {
    var checkerBoard = new PIXI.Graphics();
    checkerBoard.beginFill(0x9f6bc4, 1);
    var startRow = true;
    for (var i = 0; i < numRows; i++) {
        for (var j = 0; j < numColumns; j++) {
            if ((j % 2 == 0) == startRow) {
                checkerBoard.drawRect(j * checkerWidth, i * checkerHeight, checkerWidth, checkerHeight);
            }
        }
        startRow = !startRow;
    }
    checkerBoard.endFill();
    //return checkerBoard;
    return new PIXI.Sprite(checkerBoard.generateCanvasTexture());
}
function getRandomDirection() {
    return Math.floor(Math.random() * 4);
}
},{"./shapes":2,"howler":undefined,"pixi.js":undefined}],2:[function(require,module,exports){
/// <reference path="../typings/index.d.ts" />
"use strict";
(function (Direction) {
    Direction[Direction["Down"] = 0] = "Down";
    Direction[Direction["Left"] = 1] = "Left";
    Direction[Direction["Up"] = 2] = "Up";
    Direction[Direction["Right"] = 3] = "Right";
})(exports.Direction || (exports.Direction = {}));
var Direction = exports.Direction;
var Arrow = (function () {
    function Arrow(a, b, c, color) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.color = color;
        this.graphics = new PIXI.Graphics();
        this.direction = Direction.Down;
    }
    Arrow.prototype.draw = function () {
        // Rotate the arrow by a set number of radians, depending on which
        // direction it should be facing
        this.graphics.rotation = (90 * Math.PI / 180) * this.direction;
        this.graphics.beginFill(this.color, 1);
        this.graphics.drawPolygon([this.a[0], this.a[1],
            this.b[0], this.b[1],
            this.c[0], this.c[1]]);
        this.graphics.endFill();
    };
    return Arrow;
}());
exports.Arrow = Arrow;
var Checker = (function () {
    function Checker(row, column, x, y, width, height) {
        this.row = row;
        this.column = column;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.arrow = new Arrow([-18, -25], [0, 25], [18, -25], 0x3f3f3f);
        this.arrow.direction = Direction.Right;
        this.arrow.graphics.position.x = this.x + this.width / 2;
        this.arrow.graphics.position.y = this.y + this.width / 2;
        this.touched = false;
    }
    Checker.prototype.touch = function () {
        this.touched = true;
        this.arrow.color = 0x008800;
        this.arrow.draw();
    };
    Checker.prototype.reset = function () {
        this.touched = false;
        this.arrow.color = 0x3f3f3f;
        this.arrow.draw();
    };
    Checker.prototype.draw = function () {
        this.arrow.draw();
    };
    return Checker;
}());
exports.Checker = Checker;
var Piece = (function () {
    function Piece(spot, r, color) {
        this.spot = spot;
        this.r = r;
        this.color = color;
        this.graphics = new PIXI.Graphics();
        this.x = this.spot.x + this.spot.width / 2;
        this.y = this.spot.y + this.spot.height / 2;
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
        this.spot = spot;
        this.newX = this.spot.x + this.spot.width / 2;
        this.newY = this.spot.y + this.spot.height / 2;
        this.oldX = this.x;
        this.oldY = this.y;
        this.spot.touch();
    };
    Piece.prototype.update = function (deltaTime) {
        if (this.moving) {
            this.transitionProgress += deltaTime;
            this.x += (this.newX - this.oldX) * (deltaTime / this.transitionTime);
            this.y += (this.newY - this.oldY) * (deltaTime / this.transitionTime);
            if (this.transitionProgress >= this.transitionTime) {
                this.moving = false;
                this.transitionProgress = 0;
                // make sure we didn't barely miss the exact target from rounding errors, etc.
                this.x = this.newX;
                this.y = this.newY;
                this.oldX = this.newX = 0;
                this.oldY = this.newY = 0;
            }
        }
    };
    Piece.prototype.draw = function () {
        this.graphics.clear();
        this.graphics.beginFill(this.color, 1);
        this.graphics.drawCircle(this.x, this.y, this.r);
        this.graphics.endFill();
    };
    return Piece;
}());
exports.Piece = Piece;
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
    UIWidget.prototype.draw = function () {
        this.graphics.clear();
        this.graphics.beginFill(this.color, this.alpha);
        this.graphics.drawRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        this.graphics.endFill();
    };
    return UIWidget;
}());
exports.UIWidget = UIWidget;
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL2luZGV4LnRzIiwic3JjL3NoYXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLDhDQUE4QztBQUM5QyxrQ0FBa0M7O0FBRWxDLElBQU8sSUFBSSxXQUFXLFNBQVMsQ0FBQyxDQUFDO0FBQ2pDLElBQU8sTUFBTSxXQUFXLFFBQVEsQ0FBQyxDQUFDO0FBRWxDLElBQU0sUUFBUSxHQUFzQixJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDbEcsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRXpDLHVCQUF5RCxVQUFVLENBQUMsQ0FBQTtBQUVwRSxpRkFBaUY7QUFDakYsSUFBTSxLQUFLLEdBQWtCLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBRWxELG1GQUFtRjtBQUNuRixRQUFRLENBQUMsZUFBZSxHQUFHLFFBQVEsQ0FBQztBQUVwQyx5QkFBeUI7QUFDekIsSUFBTSxXQUFXLEdBQVcsR0FBRyxDQUFDO0FBQ2hDLElBQUksU0FBUyxHQUFXLENBQUMsQ0FBQztBQUMxQixJQUFJLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDdEMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO0FBRWQsWUFBWTtBQUNaLElBQUksVUFBb0IsQ0FBQztBQUN6QixJQUFJLFNBQW1CLENBQUM7QUFDeEIsSUFBSSxhQUF1QixDQUFDO0FBQzVCLElBQUksV0FBcUIsQ0FBQztBQUMxQixJQUFJLGtCQUE0QixDQUFDO0FBQ2pDLElBQUksa0JBQTRCLENBQUM7QUFDakMsSUFBSSxZQUFzQixDQUFDO0FBQzNC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QUFDLEtBQUssR0FBRyxRQUFRLENBQUM7UUFDdkIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ1AsSUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUM7UUFDdkIsQ0FBQztJQUNGLENBQUM7SUFFRCx1QkFBSSxHQUFKO1FBQ0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BGLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUNGLGVBQUM7QUFBRCxDQS9EQSxBQStEQyxJQUFBO0FBL0RZLGdCQUFRLFdBK0RwQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi90eXBpbmdzL2luZGV4LmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInNoYXBlcy50c1wiIC8+XG5cbmltcG9ydCBQSVhJID0gcmVxdWlyZSgncGl4aS5qcycpO1xuaW1wb3J0IEhvd2xlciA9IHJlcXVpcmUoJ2hvd2xlcicpO1xuXG5jb25zdCByZW5kZXJlcjpQSVhJLldlYkdMUmVuZGVyZXIgPSBuZXcgUElYSS5XZWJHTFJlbmRlcmVyKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci52aWV3KTtcblxuaW1wb3J0IHtBcnJvdywgRGlyZWN0aW9uLCBDaGVja2VyLCBQaWVjZSwgVUlXaWRnZXR9IGZyb20gJy4vc2hhcGVzJztcblxuLy8gWW91IG5lZWQgdG8gY3JlYXRlIGEgcm9vdCBjb250YWluZXIgdGhhdCB3aWxsIGhvbGQgdGhlIHNjZW5lIHlvdSB3YW50IHRvIGRyYXcuXG5jb25zdCBzdGFnZTpQSVhJLkNvbnRhaW5lciA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xuXG4vLyBzZXQgYmFja2dyb3VuZCBjb2xvciBhcyBhbiBlYXN5IHdheSB0byBvbmx5IGRyYXcgaGFsZiBvZiB0aGUgY2hlY2tlcmJvYXJkIHNwYWNlc1xucmVuZGVyZXIuYmFja2dyb3VuZENvbG9yID0gMHg1NTUyYjI7XG5cbi8vIHNldCB1cCBnYW1lIGxvb3AgdGltZXJcbmNvbnN0IFVQREFURV9USU1FOiBudW1iZXIgPSAxMDA7XG5sZXQgd2F0Y2hUaW1lOiBudW1iZXIgPSAwO1xubGV0IHRpY2tlciA9IG5ldyBQSVhJLnRpY2tlci5UaWNrZXIoKTtcbnRpY2tlci5zdG9wKCk7XG5cbi8vIGRlZmluZSBVSVxubGV0IHBsYXlXaWRnZXQ6IFVJV2lkZ2V0O1xubGV0IHN0b3BXaWdldDogVUlXaWRnZXQ7XG5sZXQgc2h1ZmZsZVdpZGdldDogVUlXaWRnZXQ7XG5sZXQgcmVzZXRXaWRnZXQ6IFVJV2lkZ2V0O1xubGV0IGRlY3JlYXNlUm93c1dpZGdldDogVUlXaWRnZXQ7XG5sZXQgaW5jcmVhc2VSb3dzV2lkZ2V0OiBVSVdpZGdldDtcbmxldCByb3dOdW1XaWRnZXQ6IFVJV2lkZ2V0O1xubGV0IGRlY3JlYXNlQ29sdW1uc1dpZGdldDogVUlXaWRnZXQ7XG5sZXQgaW5jcmVhc2VDb2x1bW5zV2lkZ2V0OiBVSVdpZGdldDtcbmxldCBjb2x1bW5OdW1XaWRnZXQ6IFVJV2lkZ2V0O1xubGV0IHZpY3RvcnlXaWRnZXQ6IFVJV2lkZ2V0O1xubGV0IGN5Y2xlV2lkZ2V0OiBVSVdpZGdldDtcblxuLy8gZGVmaW5lIGdhbWUgYm9hcmQgcHJvcGVydGllc1xubGV0IG51bUNvbHVtbnMgPSAxMjtcbmxldCBudW1Sb3dzID0gNjtcbmxldCBjaGVja2VyV2lkdGggPSByZW5kZXJlci53aWR0aCAvIG51bUNvbHVtbnM7XG5sZXQgY2hlY2tlckhlaWdodCA9IHJlbmRlcmVyLmhlaWdodCAvIG51bVJvd3M7XG5cbi8vIGNyZWF0ZSBib2FyZCwgYXJyb3dzLCBhbmQgcGllY2VzXG5sZXQgY2hlY2tlcnM6IENoZWNrZXJbXVtdID0gW107XG5sZXQgY2hlY2tlckJvYXJkOiBQSVhJLlNwcml0ZTtcbmxldCBjaG9zZW5TcG90OiBDaGVja2VyO1xubGV0IGNoZWNrZXJQaWVjZTogUGllY2U7XG5cbi8vIFNvdW5kIGVmZmVjdHNcbmxldCBzbGlkaW5nU291bmQgPSBuZXcgSG93bGVyLkhvd2woe1xuICAgIHNyYzogJ1NsaWRpbmcubXAzJ1xufSk7XG5cbmxldCB2aWN0b3J5U291bmQgPSBuZXcgSG93bGVyLkhvd2woe1xuICAgIHNyYzogJ3dpbi5tcDMnXG59KTtcblxubGV0IGZhaWxTb3VuZCA9IG5ldyBIb3dsZXIuSG93bCh7XG4gICAgc3JjOiAnZmFpbC5tcDMnXG59KTtcblxuLy8gRG8gZmlyc3QtdGltZSBnYW1lIGJvYXJkIHNldHVwXG5zZXR1cCgpO1xuLy8gU3RhcnQgYW5pbWF0aW9uL3JlbmRlcmluZyBsb29wXG5hbmltYXRlKCk7XG5cbi8vIFNldHVwIFBYSSB0aWNrZXIgYXMgZ2FtZSBsb2dpYyBsb29wXG50aWNrZXIuYWRkKGdhbWVMb29wKTtcblxuXG4vKioqIEZ1bmN0aW9ucyAqKiovXG5cbmZ1bmN0aW9uIGdhbWVMb29wKGRlbHRhVGltZSkge1xuICAgIC8vIGRvaW5nIG9uZS1zZWNvbmQgXCJ0dXJuc1wiXG4gICAgd2F0Y2hUaW1lICs9IGRlbHRhVGltZTtcbiAgICBpZiAod2F0Y2hUaW1lID49IFVQREFURV9USU1FKSB7XG4gICAgICAgIHVwZGF0ZSgpO1xuICAgICAgICB3YXRjaFRpbWUgPSAwO1xuICAgIH1cblxuICAgIGNoZWNrZXJQaWVjZS51cGRhdGUoZGVsdGFUaW1lKTtcbn1cblxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgICAvLyBzdGFydCB0aGUgdGltZXIgZm9yIHRoZSBuZXh0IGFuaW1hdGlvbiBsb29wXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xuXG4gICAgLy8gZHJhdyBjaGVja2VyIHBpZWNlXG4gICAgY2hlY2tlclBpZWNlLmRyYXcoKTtcblxuICAgIC8vIGRyYXcgVUkgd2lkZ2V0c1xuICAgIHBsYXlXaWRnZXQuZHJhdygpO1xuICAgIHN0b3BXaWdldC5kcmF3KCk7XG4gICAgc2h1ZmZsZVdpZGdldC5kcmF3KCk7XG4gICAgcmVzZXRXaWRnZXQuZHJhdygpO1xuICAgIGRlY3JlYXNlUm93c1dpZGdldC5kcmF3KCk7XG4gICAgaW5jcmVhc2VSb3dzV2lkZ2V0LmRyYXcoKTtcbiAgICByb3dOdW1XaWRnZXQuZHJhdygpO1xuICAgIGRlY3JlYXNlQ29sdW1uc1dpZGdldC5kcmF3KCk7XG4gICAgaW5jcmVhc2VDb2x1bW5zV2lkZ2V0LmRyYXcoKTtcbiAgICBjb2x1bW5OdW1XaWRnZXQuZHJhdygpO1xuXG4gICAgLy8gdGhpcyBpcyB0aGUgbWFpbiByZW5kZXIgY2FsbCB0aGF0IG1ha2VzIHBpeGkgZHJhdyB5b3VyIGNvbnRhaW5lciBhbmQgaXRzIGNoaWxkcmVuLlxuICAgIHJlbmRlcmVyLnJlbmRlcihzdGFnZSk7XG59XG5cbi8vIGNyZWF0ZSB3aW5kb3cgcmVzaXplIGhhbmRsZXJcbi8vIGdhbWUgYm9hcmQgY29tcG9uZW50cyBzaG91bGQgY2hhbmdlIHNpemUgdG9cbi8vIHJlZmxlY3QgdGhlIG5ldyB3aW5kb3cgc2l6ZVxud2luZG93Lm9ucmVzaXplID0gKGV2ZW50KT0+e1xuICAgIHJlbmRlcmVyLnJlc2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICByZXNldCgpO1xufTtcblxuXG4vLyBVSSBldmVudCBoYW5kbGVyc1xuZnVuY3Rpb24gY2xpY2tQbGF5KCkge1xuICAgIHBsYXkoKTtcbn1cblxuZnVuY3Rpb24gY2xpY2tTdG9wKCkge1xuICAgIHN0b3AoKTtcbn1cblxuZnVuY3Rpb24gY2xpY2tTaHVmZmxlKCkge1xuICAgIHNodWZmbGVBcnJvd3MoKTtcbiAgICAvLyB3ZSBqdXN0IFwicmVzZXRcIiB0aGUgdG91Y2hlZCBncmFwaCwgc28gcmUtbWFyayB0aGUgY2hlY2tlciBwaWVjZSdzIHNwb3QgYXMgdG91Y2hlZFxuICAgIGNoZWNrZXJQaWVjZS5zcG90LnRvdWNoKCk7XG59XG5cbmZ1bmN0aW9uIGNsaWNrUmVzZXQoKSB7XG4gICAgcmVzZXQoKTtcbn1cblxuZnVuY3Rpb24gY2xpY2tEZWNyZWFzZVJvd3MoKSB7XG4gICAgaWYgKG51bVJvd3MgPiAxKSB7XG4gICAgICAgIG51bVJvd3MtLTtcbiAgICAgICAgcmVzZXQoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNsaWNrSW5jcmVhc2VSb3dzKCkge1xuICAgIG51bVJvd3MrKztcbiAgICByZXNldCgpO1xufVxuXG5mdW5jdGlvbiBjbGlja0RlY3JlYXNlQ29sdW1ucygpIHtcbiAgICBpZiAobnVtQ29sdW1ucyA+IDEpIHtcbiAgICAgICAgbnVtQ29sdW1ucy0tO1xuICAgICAgICByZXNldCgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY2xpY2tJbmNyZWFzZUNvbHVtbnMoKSB7XG4gICAgbnVtQ29sdW1ucysrO1xuICAgIHJlc2V0KCk7XG59XG5cblxuLyoqKiogR2FtZSBMb2dpYyBGdW5jdGlvbnMgKioqKi9cblxuZnVuY3Rpb24gc2h1ZmZsZUFycm93cygpIHtcbiAgICBmb3IgKGxldCByb3cgb2YgY2hlY2tlcnMpIHtcbiAgICAgICAgZm9yIChsZXQgY2hlY2tlciBvZiByb3cpIHtcbiAgICAgICAgICAgIGNoZWNrZXIuYXJyb3cuZGlyZWN0aW9uID0gZ2V0UmFuZG9tRGlyZWN0aW9uKCk7XG4gICAgICAgICAgICAvLyBzaW5jZSB3ZSdyZSByZXNodWZmbGluZyB0aGUgYXJyb3dzLCB3ZSBubyBsb25nZXIga25vdyB3aGljaCBzcGFjZXNcbiAgICAgICAgICAgIC8vIHRoZSBjaGVja2VyIHBpZWNlIGhhcyBhbHJlYWR5IHRvdWNoZWRcbiAgICAgICAgICAgIGNoZWNrZXIucmVzZXQoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gcGxheSgpIHtcbiAgICB0aWNrZXIuc3RhcnQoKTtcbn1cblxuZnVuY3Rpb24gc3RvcCgpIHtcbiAgICB0aWNrZXIuc3RvcCgpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgbGV0IGN1cnJlbnRTcG90ID0gY2hlY2tlclBpZWNlLnNwb3Q7XG4gICAgbGV0IG5ld1Nwb3Q6IENoZWNrZXI7XG4gICAgbGV0IGZvdW5kRWRnZTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHN3aXRjaCAoY3VycmVudFNwb3QuYXJyb3cuZGlyZWN0aW9uKSB7XG4gICAgICAgIGNhc2UgKERpcmVjdGlvbi5Eb3duKTpcbiAgICAgICAgICAgIGlmIChjdXJyZW50U3BvdC5yb3cgIT0gbnVtUm93cy0xKSB7XG4gICAgICAgICAgICAgICAgbmV3U3BvdCA9IGNoZWNrZXJzW2N1cnJlbnRTcG90LnJvdysxXVtjdXJyZW50U3BvdC5jb2x1bW5dO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3VuZEVkZ2UgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgKERpcmVjdGlvbi5VcCk6XG4gICAgICAgICAgICBpZiAoY3VycmVudFNwb3Qucm93ICE9IDApIHtcbiAgICAgICAgICAgICAgICBuZXdTcG90ID0gY2hlY2tlcnNbY3VycmVudFNwb3Qucm93LTFdW2N1cnJlbnRTcG90LmNvbHVtbl07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvdW5kRWRnZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAoRGlyZWN0aW9uLlJpZ2h0KTpcbiAgICAgICAgICAgIGlmIChjdXJyZW50U3BvdC5jb2x1bW4gIT0gbnVtQ29sdW1ucy0xKSB7XG4gICAgICAgICAgICAgICAgbmV3U3BvdCA9IGNoZWNrZXJzW2N1cnJlbnRTcG90LnJvd11bY3VycmVudFNwb3QuY29sdW1uKzFdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3VuZEVkZ2UgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgKERpcmVjdGlvbi5MZWZ0KTpcbiAgICAgICAgICAgIGlmIChjdXJyZW50U3BvdC5jb2x1bW4gIT0gMCkge1xuICAgICAgICAgICAgICAgIG5ld1Nwb3QgPSBjaGVja2Vyc1tjdXJyZW50U3BvdC5yb3ddW2N1cnJlbnRTcG90LmNvbHVtbi0xXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm91bmRFZGdlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrOyAgICBcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChmb3VuZEVkZ2UpIHtcbiAgICAgICAgc3RvcCgpO1xuICAgICAgICB2aWN0b3J5U291bmQucGxheSgpO1xuICAgICAgICBhbGVydChcIllvdSB3aW4hICBDb25ncmF0dWxhdGlvbnMhXCIpO1xuICAgICAgICByZXNldCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChuZXdTcG90LnRvdWNoZWQpIHtcbiAgICAgICAgICAgIHN0b3AoKTtcbiAgICAgICAgICAgIGZhaWxTb3VuZC5wbGF5KCk7XG4gICAgICAgICAgICBhbGVydChcIkxvb3AgZGV0ZWN0ZWQgLS0gQ2FuJ3QgbW92ZSB0byB0aGlzIHNwb3RcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjaGVja2VyUGllY2UubW92ZShuZXdTcG90KTtcbiAgICAgICAgICAgIHNsaWRpbmdTb3VuZC5wbGF5KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgc3RvcCgpO1xuICAgIHN0YWdlLnJlbW92ZUNoaWxkcmVuKDAsIHN0YWdlLmNoaWxkcmVuLmxlbmd0aC0xKTtcbiAgICBzZXR1cCgpO1xufVxuXG5mdW5jdGlvbiBzZXR1cCgpIHtcbiAgICBjaGVja2VyV2lkdGggPSByZW5kZXJlci53aWR0aCAvIG51bUNvbHVtbnM7XG4gICAgY2hlY2tlckhlaWdodCA9IHJlbmRlcmVyLmhlaWdodCAvIG51bVJvd3M7XG5cbiAgICBjaGVja2VycyA9IGNyZWF0ZUNoZWNrZXJzKG51bUNvbHVtbnMsIG51bVJvd3MsIGNoZWNrZXJXaWR0aCwgY2hlY2tlckhlaWdodCk7XG4gICAgY2hlY2tlckJvYXJkID0gY3JlYXRlQ2hlY2tlckJvYXJkKG51bUNvbHVtbnMsIG51bVJvd3MsIGNoZWNrZXJXaWR0aCwgY2hlY2tlckhlaWdodCk7XG4gICAgc3RhZ2UuYWRkQ2hpbGQoY2hlY2tlckJvYXJkKTtcbiAgICBjaG9zZW5TcG90ID0gY2hlY2tlcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hlY2tlcnMubGVuZ3RoKV1bTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hlY2tlcnNbMF0ubGVuZ3RoKV07XG4gICAgY2hlY2tlclBpZWNlID0gbmV3IFBpZWNlKGNob3NlblNwb3QsIGNoZWNrZXJXaWR0aC8yLjMsIDB4QkIwMDAwKTtcbiAgICBjaG9zZW5TcG90LnRvdWNoKCk7XG4gICAgc3RhZ2UuYWRkQ2hpbGQoY2hlY2tlclBpZWNlLmdyYXBoaWNzKTtcblxuICAgIGZvciAobGV0IHJvdyBvZiBjaGVja2Vycykge1xuICAgICAgICBmb3IgKGxldCBjaGVja2VyIG9mIHJvdykge1xuICAgICAgICAgICAgc3RhZ2UuYWRkQ2hpbGQoY2hlY2tlci5hcnJvdy5ncmFwaGljcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkcmF3QXJyb3dzKCk7XG5cbiAgICBwbGF5V2lkZ2V0ID0gbmV3IFVJV2lkZ2V0KG5ldyBQSVhJLlJlY3RhbmdsZShyZW5kZXJlci53aWR0aC0xMDAsIDMwLCA2NSwgMzUpLCBcIlBsYXlcIiwgY2xpY2tQbGF5KTtcbiAgICBzdGFnZS5hZGRDaGlsZChwbGF5V2lkZ2V0LmdyYXBoaWNzKTtcbiAgICBzdGFnZS5hZGRDaGlsZChwbGF5V2lkZ2V0LnRleHQpO1xuXG4gICAgc3RvcFdpZ2V0ID0gbmV3IFVJV2lkZ2V0KG5ldyBQSVhJLlJlY3RhbmdsZShyZW5kZXJlci53aWR0aC0xMDAsIDgwLCA2NSwgMzUpLCBcIlN0b3BcIiwgY2xpY2tTdG9wKTtcbiAgICBzdGFnZS5hZGRDaGlsZChzdG9wV2lnZXQuZ3JhcGhpY3MpO1xuICAgIHN0YWdlLmFkZENoaWxkKHN0b3BXaWdldC50ZXh0KTtcblxuICAgIHNodWZmbGVXaWRnZXQgPSBuZXcgVUlXaWRnZXQobmV3IFBJWEkuUmVjdGFuZ2xlKHJlbmRlcmVyLndpZHRoLTEwMCwgMTMwLCA5MCwgMzUpLCBcIlNodWZmbGVcIiwgY2xpY2tTaHVmZmxlKTtcbiAgICBzdGFnZS5hZGRDaGlsZChzaHVmZmxlV2lkZ2V0LmdyYXBoaWNzKTtcbiAgICBzdGFnZS5hZGRDaGlsZChzaHVmZmxlV2lkZ2V0LnRleHQpO1xuXG4gICAgcmVzZXRXaWRnZXQgPSBuZXcgVUlXaWRnZXQobmV3IFBJWEkuUmVjdGFuZ2xlKHJlbmRlcmVyLndpZHRoLTEwMCwgMTgwLCA4MCwgMzUpLCBcIlJlc2V0XCIsIGNsaWNrUmVzZXQpO1xuICAgIHN0YWdlLmFkZENoaWxkKHJlc2V0V2lkZ2V0LmdyYXBoaWNzKTtcbiAgICBzdGFnZS5hZGRDaGlsZChyZXNldFdpZGdldC50ZXh0KTtcblxuICAgIGRlY3JlYXNlUm93c1dpZGdldCA9IG5ldyBVSVdpZGdldChuZXcgUElYSS5SZWN0YW5nbGUocmVuZGVyZXIud2lkdGgtMTEwLCAyMzAsIDI1LCAzNSksIFwiPFwiLCBjbGlja0RlY3JlYXNlUm93cyk7XG4gICAgc3RhZ2UuYWRkQ2hpbGQoZGVjcmVhc2VSb3dzV2lkZ2V0LmdyYXBoaWNzKTtcbiAgICBzdGFnZS5hZGRDaGlsZChkZWNyZWFzZVJvd3NXaWRnZXQudGV4dCk7XG5cbiAgICByb3dOdW1XaWRnZXQgPSBuZXcgVUlXaWRnZXQobmV3IFBJWEkuUmVjdGFuZ2xlKGRlY3JlYXNlUm93c1dpZGdldC5yZWN0LnggKyA0MCwgMjMwLCA0MCwgMzUpLCBTdHJpbmcobnVtUm93cyksICgpPT57fSk7XG4gICAgc3RhZ2UuYWRkQ2hpbGQocm93TnVtV2lkZ2V0LmdyYXBoaWNzKTtcbiAgICBzdGFnZS5hZGRDaGlsZChyb3dOdW1XaWRnZXQudGV4dCk7XG5cbiAgICBpbmNyZWFzZVJvd3NXaWRnZXQgPSBuZXcgVUlXaWRnZXQobmV3IFBJWEkuUmVjdGFuZ2xlKHJvd051bVdpZGdldC5yZWN0LnggKyA0NSwgMjMwLCAyNSwgMzUpLCBcIj5cIiwgY2xpY2tJbmNyZWFzZVJvd3MpO1xuICAgIHN0YWdlLmFkZENoaWxkKGluY3JlYXNlUm93c1dpZGdldC5ncmFwaGljcyk7XG4gICAgc3RhZ2UuYWRkQ2hpbGQoaW5jcmVhc2VSb3dzV2lkZ2V0LnRleHQpO1xuXG4gICAgZGVjcmVhc2VDb2x1bW5zV2lkZ2V0ID0gbmV3IFVJV2lkZ2V0KG5ldyBQSVhJLlJlY3RhbmdsZShyZW5kZXJlci53aWR0aC0xMTAsIDI4MCwgMjUsIDM1KSwgXCI8XCIsIGNsaWNrRGVjcmVhc2VDb2x1bW5zKTtcbiAgICBzdGFnZS5hZGRDaGlsZChkZWNyZWFzZUNvbHVtbnNXaWRnZXQuZ3JhcGhpY3MpO1xuICAgIHN0YWdlLmFkZENoaWxkKGRlY3JlYXNlQ29sdW1uc1dpZGdldC50ZXh0KTtcblxuICAgIGNvbHVtbk51bVdpZGdldCA9IG5ldyBVSVdpZGdldChuZXcgUElYSS5SZWN0YW5nbGUoZGVjcmVhc2VDb2x1bW5zV2lkZ2V0LnJlY3QueCArIDQwLCAyODAsIDQwLCAzNSksIFN0cmluZyhudW1Db2x1bW5zKSwgKCk9Pnt9KTtcbiAgICBzdGFnZS5hZGRDaGlsZChjb2x1bW5OdW1XaWRnZXQuZ3JhcGhpY3MpO1xuICAgIHN0YWdlLmFkZENoaWxkKGNvbHVtbk51bVdpZGdldC50ZXh0KTtcblxuICAgIGluY3JlYXNlQ29sdW1uc1dpZGdldCA9IG5ldyBVSVdpZGdldChuZXcgUElYSS5SZWN0YW5nbGUocm93TnVtV2lkZ2V0LnJlY3QueCArIDQ1LCAyODAsIDI1LCAzNSksIFwiPlwiLCBjbGlja0luY3JlYXNlQ29sdW1ucyk7XG4gICAgc3RhZ2UuYWRkQ2hpbGQoaW5jcmVhc2VDb2x1bW5zV2lkZ2V0LmdyYXBoaWNzKTtcbiAgICBzdGFnZS5hZGRDaGlsZChpbmNyZWFzZUNvbHVtbnNXaWRnZXQudGV4dCk7XG59XG5cbmZ1bmN0aW9uIGRyYXdBcnJvd3MoKSB7XG4gICAgZm9yIChsZXQgcm93IG9mIGNoZWNrZXJzKSB7XG4gICAgICAgIGZvciAobGV0IGNoZWNrZXIgb2Ygcm93KSB7XG4gICAgICAgICAgICBjaGVja2VyLmRyYXcoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlQ2hlY2tlcnMobnVtQ29sdW1uczogbnVtYmVyLCBudW1Sb3dzOiBudW1iZXIsIGNoZWNrZXJXaWR0aDogbnVtYmVyLCBjaGVja2VySGVpZ2h0OiBudW1iZXIpIHtcbiAgICBsZXQgY2hlY2tlcnM6IENoZWNrZXJbXVtdID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1Sb3dzOyBpKyspIHtcbiAgICAgICAgY2hlY2tlcnNbaV0gPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBudW1Db2x1bW5zOyBqKyspIHtcbiAgICAgICAgICAgIGxldCBuZXdDaGVja2VyID0gbmV3IENoZWNrZXIoaSwgaiwgaipjaGVja2VyV2lkdGgsIGkqY2hlY2tlckhlaWdodCwgY2hlY2tlcldpZHRoLCBjaGVja2VySGVpZ2h0KTtcbiAgICAgICAgICAgIC8vIGFzc2lnbiBhIHJhbmRvbSBkaXJlY3Rpb24gdG8gZWFjaCBjaGVja2VyIGFycm93XG4gICAgICAgICAgICBuZXdDaGVja2VyLmFycm93LmRpcmVjdGlvbiA9IGdldFJhbmRvbURpcmVjdGlvbigpO1xuICAgICAgICAgICAgY2hlY2tlcnNbaV1bal0gPSBuZXdDaGVja2VyO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjaGVja2Vycztcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ2hlY2tlckJvYXJkKG51bUNvbHVtbnM6IG51bWJlciwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtUm93czogbnVtYmVyLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VyV2lkdGg6IG51bWJlciwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tlckhlaWdodDogbnVtYmVyKSB7XG4gICAgbGV0IGNoZWNrZXJCb2FyZCA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG4gICAgY2hlY2tlckJvYXJkLmJlZ2luRmlsbCgweDlmNmJjNCwgMSk7XG5cbiAgICBsZXQgc3RhcnRSb3cgPSB0cnVlO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtUm93czsgaSsrKVxuICAgIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBudW1Db2x1bW5zOyBqKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICgoaiAlIDIgPT0gMCkgPT0gc3RhcnRSb3cpIHtcbiAgICAgICAgICAgICAgICBjaGVja2VyQm9hcmQuZHJhd1JlY3QoaipjaGVja2VyV2lkdGgsIGkqY2hlY2tlckhlaWdodCwgY2hlY2tlcldpZHRoLCBjaGVja2VySGVpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzdGFydFJvdyA9ICFzdGFydFJvdztcbiAgICB9XG5cbiAgICBjaGVja2VyQm9hcmQuZW5kRmlsbCgpO1xuXG4gICAgLy9yZXR1cm4gY2hlY2tlckJvYXJkO1xuICAgIHJldHVybiBuZXcgUElYSS5TcHJpdGUoY2hlY2tlckJvYXJkLmdlbmVyYXRlQ2FudmFzVGV4dHVyZSgpKTtcbn1cblxuZnVuY3Rpb24gZ2V0UmFuZG9tRGlyZWN0aW9uKCkge1xuICAgIHJldHVybiA8RGlyZWN0aW9uPk1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDQpO1xufVxuXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cclxuXHJcbmV4cG9ydCBlbnVtIERpcmVjdGlvbiB7XHJcblx0RG93biA9IDAsXHJcblx0TGVmdCxcclxuXHRVcCxcclxuXHRSaWdodFx0XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBBcnJvdyB7XHJcbiAgICBhOiBbbnVtYmVyLCBudW1iZXJdO1xyXG4gICAgYjogW251bWJlciwgbnVtYmVyXTtcclxuICAgIGM6IFtudW1iZXIsIG51bWJlcl07XHJcbiAgICBjb2xvcjogbnVtYmVyO1xyXG4gICAgZ3JhcGhpY3M6IFBJWEkuR3JhcGhpY3M7XHJcbiAgICBkaXJlY3Rpb246IERpcmVjdGlvbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihhOiBbbnVtYmVyLCBudW1iZXJdLCBiOiBbbnVtYmVyLCBudW1iZXJdLCBjOiBbbnVtYmVyLCBudW1iZXJdLCBjb2xvcjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5hID0gYTtcclxuICAgICAgICB0aGlzLmIgPSBiO1xyXG4gICAgICAgIHRoaXMuYyA9IGM7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3MgPSBuZXcgUElYSS5HcmFwaGljcygpO1xyXG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gRGlyZWN0aW9uLkRvd247XHJcbiAgICB9XHJcblxyXG4gICAgZHJhdyAoKSB7XHJcbiAgICBcdC8vIFJvdGF0ZSB0aGUgYXJyb3cgYnkgYSBzZXQgbnVtYmVyIG9mIHJhZGlhbnMsIGRlcGVuZGluZyBvbiB3aGljaFxyXG4gICAgXHQvLyBkaXJlY3Rpb24gaXQgc2hvdWxkIGJlIGZhY2luZ1xyXG4gICAgXHR0aGlzLmdyYXBoaWNzLnJvdGF0aW9uID0gKDkwICogTWF0aC5QSSAvIDE4MCkgKiB0aGlzLmRpcmVjdGlvbjtcclxuXHJcbiAgICAgICAgdGhpcy5ncmFwaGljcy5iZWdpbkZpbGwodGhpcy5jb2xvciwgMSk7XHJcbiAgICAgICAgdGhpcy5ncmFwaGljcy5kcmF3UG9seWdvbihbdGhpcy5hWzBdLCB0aGlzLmFbMV0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYlswXSwgdGhpcy5iWzFdLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNbMF0sIHRoaXMuY1sxXV0pO1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3MuZW5kRmlsbCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2hlY2tlciB7XHJcblx0cm93OiBudW1iZXI7XHJcblx0Y29sdW1uOiBudW1iZXI7XHJcblx0eDogbnVtYmVyO1xyXG5cdHk6IG51bWJlcjtcclxuXHR3aWR0aDogbnVtYmVyO1xyXG5cdGhlaWdodDogbnVtYmVyO1xyXG5cdGFycm93OiBBcnJvdztcclxuXHR0b3VjaGVkOiBib29sZWFuO1xyXG5cclxuXHRjb25zdHJ1Y3Rvcihyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xyXG5cdFx0dGhpcy5yb3cgPSByb3c7XHJcblx0XHR0aGlzLmNvbHVtbiA9IGNvbHVtbjtcclxuXHRcdHRoaXMueCA9IHg7XHJcblx0XHR0aGlzLnkgPSB5O1xyXG5cdFx0dGhpcy53aWR0aCA9IHdpZHRoO1xyXG5cdFx0dGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcblxyXG5cdFx0dGhpcy5hcnJvdyA9IG5ldyBBcnJvdyhbLTE4LCAtMjVdLCBbMCwgMjVdLCBbMTgsIC0yNV0sIDB4M2YzZjNmKTtcclxuXHRcdHRoaXMuYXJyb3cuZGlyZWN0aW9uID0gRGlyZWN0aW9uLlJpZ2h0O1xyXG5cdFx0dGhpcy5hcnJvdy5ncmFwaGljcy5wb3NpdGlvbi54ID0gdGhpcy54ICsgdGhpcy53aWR0aC8yO1xyXG5cdFx0dGhpcy5hcnJvdy5ncmFwaGljcy5wb3NpdGlvbi55ID0gdGhpcy55ICsgdGhpcy53aWR0aC8yO1xyXG5cclxuXHRcdHRoaXMudG91Y2hlZCA9IGZhbHNlO1xyXG5cdH1cclxuXHJcblx0dG91Y2goKSB7XHJcblx0XHR0aGlzLnRvdWNoZWQgPSB0cnVlO1xyXG5cdFx0dGhpcy5hcnJvdy5jb2xvciA9IDB4MDA4ODAwO1xyXG5cdFx0dGhpcy5hcnJvdy5kcmF3KCk7XHJcblx0fVxyXG5cclxuXHRyZXNldCgpIHtcclxuXHRcdHRoaXMudG91Y2hlZCA9IGZhbHNlO1xyXG5cdFx0dGhpcy5hcnJvdy5jb2xvciA9IDB4M2YzZjNmO1xyXG5cdFx0dGhpcy5hcnJvdy5kcmF3KCk7XHJcblx0fVxyXG5cclxuXHRkcmF3ICgpIHtcclxuXHRcdHRoaXMuYXJyb3cuZHJhdygpO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFBpZWNlIHtcclxuXHRzcG90OiBDaGVja2VyO1xyXG5cdHI6IG51bWJlcjtcclxuXHRjb2xvcjogbnVtYmVyO1xyXG5cdHg6IG51bWJlcjtcclxuXHR5OiBudW1iZXI7XHJcblx0bmV3WDogbnVtYmVyO1xyXG5cdG5ld1k6IG51bWJlcjtcclxuXHRvbGRYOiBudW1iZXI7XHJcblx0b2xkWTogbnVtYmVyO1xyXG5cdGdyYXBoaWNzOiBQSVhJLkdyYXBoaWNzO1xyXG5cdHRyYW5zaXRpb25UaW1lOiBudW1iZXI7XHJcblx0dHJhbnNpdGlvblByb2dyZXNzOiBudW1iZXI7XHJcblx0bW92aW5nOiBib29sZWFuO1xyXG5cclxuXHRjb25zdHJ1Y3RvcihzcG90OiBDaGVja2VyLCByOiBudW1iZXIsIGNvbG9yOiBudW1iZXIpIHtcclxuXHRcdHRoaXMuc3BvdCA9IHNwb3Q7XHJcblx0XHR0aGlzLnIgPSByO1xyXG5cdFx0dGhpcy5jb2xvciA9IGNvbG9yO1xyXG5cdFx0dGhpcy5ncmFwaGljcyA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XHJcblxyXG5cdFx0dGhpcy54ID0gdGhpcy5zcG90LnggKyB0aGlzLnNwb3Qud2lkdGgvMjtcclxuXHRcdHRoaXMueSA9IHRoaXMuc3BvdC55ICsgdGhpcy5zcG90LmhlaWdodC8yO1xyXG5cdFx0dGhpcy5uZXdZID0gMDtcclxuXHRcdHRoaXMubmV3WCA9IDA7XHJcblx0XHR0aGlzLm9sZFggPSAwO1xyXG5cdFx0dGhpcy5vbGRZID0gMDtcclxuXHJcblx0XHR0aGlzLnRyYW5zaXRpb25UaW1lID0gMjA7XHJcblx0XHR0aGlzLnRyYW5zaXRpb25Qcm9ncmVzcyA9IDA7XHJcblx0XHR0aGlzLm1vdmluZyA9IGZhbHNlO1xyXG5cdH1cclxuXHJcblx0bW92ZSAoc3BvdDogQ2hlY2tlcikge1xyXG5cdFx0dGhpcy5tb3ZpbmcgPSB0cnVlO1xyXG5cdFx0dGhpcy5zcG90ID0gc3BvdDtcdFxyXG5cdFx0dGhpcy5uZXdYID0gdGhpcy5zcG90LnggKyB0aGlzLnNwb3Qud2lkdGgvMjtcclxuXHRcdHRoaXMubmV3WSA9IHRoaXMuc3BvdC55ICsgdGhpcy5zcG90LmhlaWdodC8yO1xyXG5cdFx0dGhpcy5vbGRYID0gdGhpcy54O1xyXG5cdFx0dGhpcy5vbGRZID0gdGhpcy55O1xyXG5cclxuXHRcdHRoaXMuc3BvdC50b3VjaCgpO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKGRlbHRhVGltZTogbnVtYmVyKSB7XHJcblx0XHRpZiAodGhpcy5tb3ZpbmcpIHtcclxuXHRcdFx0dGhpcy50cmFuc2l0aW9uUHJvZ3Jlc3MgKz0gZGVsdGFUaW1lO1xyXG5cdFx0XHR0aGlzLnggKz0gKHRoaXMubmV3WCAtIHRoaXMub2xkWCkgKiAoZGVsdGFUaW1lIC8gdGhpcy50cmFuc2l0aW9uVGltZSk7IFxyXG5cdFx0XHR0aGlzLnkgKz0gKHRoaXMubmV3WSAtIHRoaXMub2xkWSkgKiAoZGVsdGFUaW1lIC8gdGhpcy50cmFuc2l0aW9uVGltZSk7XHJcblx0XHRcdGlmICh0aGlzLnRyYW5zaXRpb25Qcm9ncmVzcyA+PSB0aGlzLnRyYW5zaXRpb25UaW1lKSB7XHJcblx0XHRcdFx0dGhpcy5tb3ZpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHR0aGlzLnRyYW5zaXRpb25Qcm9ncmVzcyA9IDA7XHJcblx0XHRcdFx0Ly8gbWFrZSBzdXJlIHdlIGRpZG4ndCBiYXJlbHkgbWlzcyB0aGUgZXhhY3QgdGFyZ2V0IGZyb20gcm91bmRpbmcgZXJyb3JzLCBldGMuXHJcblx0XHRcdFx0dGhpcy54ID0gdGhpcy5uZXdYO1xyXG5cdFx0XHRcdHRoaXMueSA9IHRoaXMubmV3WTtcclxuXHRcdFx0XHR0aGlzLm9sZFggPSB0aGlzLm5ld1ggPSAwO1xyXG5cdFx0XHRcdHRoaXMub2xkWSA9IHRoaXMubmV3WSA9IDA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGRyYXcgKCkge1xyXG5cdFx0dGhpcy5ncmFwaGljcy5jbGVhcigpO1xyXG5cdFx0dGhpcy5ncmFwaGljcy5iZWdpbkZpbGwodGhpcy5jb2xvciwgMSk7XHJcblx0XHR0aGlzLmdyYXBoaWNzLmRyYXdDaXJjbGUodGhpcy54LCB0aGlzLnksIHRoaXMucik7XHJcblx0XHR0aGlzLmdyYXBoaWNzLmVuZEZpbGwoKTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBVSVdpZGdldCB7XHJcblx0cmVjdDogUElYSS5SZWN0YW5nbGU7XHJcblx0dGV4dDogUElYSS5UZXh0O1xyXG5cdGdyYXBoaWNzOiBQSVhJLkdyYXBoaWNzO1xyXG5cdGNsaWNrSGFuZGxlcjogKCk9PmFueTtcclxuXHRjb2xvcjogbnVtYmVyO1xyXG5cdGFscGhhOiBudW1iZXI7XHJcblx0ZW5hYmxlZDogYm9vbGVhbjtcclxuXHJcblx0Y29uc3RydWN0b3IocmVjdDogUElYSS5SZWN0YW5nbGUsIHRleHQ6IHN0cmluZywgY2xpY2tIYW5kbGVyOiAoKT0+YW55KSB7XHJcblx0XHR0aGlzLnJlY3QgPSByZWN0O1xyXG5cdFx0dGhpcy50ZXh0ID0gbmV3IFBJWEkuVGV4dCh0ZXh0KTtcclxuXHRcdHRoaXMuZ3JhcGhpY3MgPSBuZXcgUElYSS5HcmFwaGljcygpO1xyXG5cclxuXHRcdC8vIGFkZCBcInBhZGRpbmdcIiB0byB0ZXh0XHJcblx0XHR0aGlzLnRleHQueCA9IHRoaXMucmVjdC54ICsgNTtcclxuXHRcdHRoaXMudGV4dC55ID0gdGhpcy5yZWN0LnkgKyA1O1xyXG5cclxuXHRcdC8vIHR1cm4gb24gYnV0dG9uTW9kZSBzbyB0aGF0IHdlIGNhbiBpbnRlcmFjdCB2aWEgbW91c2VcclxuXHRcdHRoaXMuZ3JhcGhpY3MuaW50ZXJhY3RpdmUgPSB0cnVlO1xyXG5cdFx0dGhpcy5ncmFwaGljcy5idXR0b25Nb2RlID0gdHJ1ZTtcclxuXHJcblx0XHR0aGlzLmNvbG9yID0gMHhjNGM0YzQ7XHJcblx0XHR0aGlzLmFscGhhID0gMC43O1xyXG5cclxuXHRcdHRoaXMuZW5hYmxlZCA9IHRydWU7XHJcblxyXG5cdFx0Ly8gYmluZCB0aGUgY2xpY2sgaGFuZGxlciBjYWxsYmFja1xyXG5cdFx0dGhpcy5jbGlja0hhbmRsZXIgPSBjbGlja0hhbmRsZXI7XHJcblx0XHR0aGlzLmdyYXBoaWNzLm9uKFwiY2xpY2tcIiwgY2xpY2tIYW5kbGVyKTtcclxuXHJcblx0XHQvLyBiaW5kIG1vdXNlZG93biBoYW5kbGVyLCBmb3Igc2hvd2luZyB0aGF0IHRoZSBidXR0b25cclxuXHRcdC8vXHRpcyBiZWluZyBkZXByZXNzZWRcclxuXHRcdHRoaXMuZ3JhcGhpY3Mub24oXCJtb3VzZWRvd25cIiwgKCk9PntcclxuXHRcdFx0aWYgKHRoaXMuZW5hYmxlZCkge1xyXG5cdFx0XHRcdHRoaXMuY29sb3IgPSAweDk2OTY5NjtcclxuXHRcdFx0XHR0aGlzLmFscGhhID0gMC45O1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHR0aGlzLmdyYXBoaWNzLm9uKFwibW91c2V1cFwiLCAoKT0+e1xyXG5cdFx0XHRpZiAodGhpcy5lbmFibGVkKSB7XHJcblx0XHRcdFx0dGhpcy5jb2xvciA9IDB4YzRjNGM0O1xyXG5cdFx0XHRcdHRoaXMuYWxwaGEgPSAwLjc7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0c2V0RW5hYmxlZChlbmFibGVkOiBib29sZWFuKSB7XHJcblx0XHR0aGlzLmVuYWJsZWQgPSBlbmFibGVkO1xyXG5cdFx0aWYgKHRoaXMuZW5hYmxlZCkge1xyXG5cdFx0XHR0aGlzLmNvbG9yID0gMHhjNGM0YzQ7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLmNvbG9yID0gMHg5Njk2OTY7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRkcmF3ICgpIHtcclxuXHRcdHRoaXMuZ3JhcGhpY3MuY2xlYXIoKTtcclxuXHRcdHRoaXMuZ3JhcGhpY3MuYmVnaW5GaWxsKHRoaXMuY29sb3IsIHRoaXMuYWxwaGEpO1xyXG5cdFx0dGhpcy5ncmFwaGljcy5kcmF3UmVjdCh0aGlzLnJlY3QueCwgdGhpcy5yZWN0LnksIHRoaXMucmVjdC53aWR0aCwgdGhpcy5yZWN0LmhlaWdodCk7XHJcblx0XHR0aGlzLmdyYXBoaWNzLmVuZEZpbGwoKTtcclxuXHR9XHJcbn0iXX0=
