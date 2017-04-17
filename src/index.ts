/// <reference path="../typings/index.d.ts" />

import PIXI = require('pixi.js');
import Howler = require('howler');

const renderer:PIXI.WebGLRenderer = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.view);

import {Direction} from './direction';
import {Arrow} from './arrow';
import {Checker} from './checker';
import {UIWidget} from './widget';
import {Piece} from './piece';

// You need to create a root container that will hold the scene you want to draw.
const stage:PIXI.Container = new PIXI.Container();

// set background color as an easy way to only draw half of the checkerboard spaces
renderer.backgroundColor = 0x5552b2;

// set up game loop timer
const UPDATE_TIME: number = 25;
let watchTime: number = 0;
let ticker = new PIXI.ticker.Ticker();
ticker.stop();

// define UI
let playWidget: UIWidget;
let stopWiget: UIWidget;
let shuffleWidget: UIWidget;
let resetWidget: UIWidget;
let decreaseRowsWidget: UIWidget;
let increaseRowsWidget: UIWidget;
let rowNumWidget: UIWidget;
let decreaseColumnsWidget: UIWidget;
let increaseColumnsWidget: UIWidget;
let columnNumWidget: UIWidget;
let victoryWidget: UIWidget;
let cycleWidget: UIWidget;

// define game board properties
let numColumns = 12;
let numRows = 6;
let checkerWidth = renderer.width / numColumns;
let checkerHeight = renderer.height / numRows;

// create board, arrows, and pieces
let checkers: Checker[][] = [];
let checkerBoard: PIXI.Sprite;
let chosenSpot: Checker;
let checkerPiece: Piece;

// Sound effects
let slidingSound = new Howler.Howl({
    src: 'Sliding.mp3'
});

let victorySound = new Howler.Howl({
    src: 'win.mp3'
});

let failSound = new Howler.Howl({
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
window.onresize = (event)=>{
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
    for (let row of checkers) {
        for (let checker of row) {
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
    let currentSpot = checkerPiece.spot;
    let newSpot: Checker;
    let foundEdge: boolean = false;
    switch (currentSpot.arrow.direction) {
        case (Direction.Down):
            if (currentSpot.row != numRows-1) {
                newSpot = checkers[currentSpot.row+1][currentSpot.column];
            } else {
                foundEdge = true;
            }
            break;
        case (Direction.Up):
            if (currentSpot.row != 0) {
                newSpot = checkers[currentSpot.row-1][currentSpot.column];
            } else {
                foundEdge = true;
            }
            break;
        case (Direction.Right):
            if (currentSpot.column != numColumns-1) {
                newSpot = checkers[currentSpot.row][currentSpot.column+1];
            } else {
                foundEdge = true;
            }
            break;
        case (Direction.Left):
            if (currentSpot.column != 0) {
                newSpot = checkers[currentSpot.row][currentSpot.column-1];
            } else {
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
    } else {
        if (newSpot.touched) {
            stop();
            failSound.play();
            alert("Loop detected -- Can't move to this spot");
        } else {
            checkerPiece.move(newSpot);
            slidingSound.play();
        }
    }
}


function reset() {
    stop();
    stage.removeChildren(0, stage.children.length-1);
    setup();
}

function setup() {
    checkerWidth = renderer.width / numColumns;
    checkerHeight = renderer.height / numRows;

    checkers = createCheckers(numColumns, numRows, checkerWidth, checkerHeight);
    checkerBoard = createCheckerBoard(numColumns, numRows, checkerWidth, checkerHeight);
    stage.addChild(checkerBoard);
    chosenSpot = checkers[Math.floor(Math.random() * checkers.length)][Math.floor(Math.random() * checkers[0].length)];
    checkerPiece = new Piece(chosenSpot, checkerWidth/2.3, 0xBB0000);
    chosenSpot.touch();
    stage.addChild(checkerPiece.graphics);

    for (let row of checkers) {
        for (let checker of row) {
            stage.addChild(checker.arrow.graphics);
        }
    }

    drawArrows();

    playWidget = new UIWidget(new PIXI.Rectangle(renderer.width-100, 30, 65, 35), "Play", clickPlay);
    stage.addChild(playWidget.graphics);
    stage.addChild(playWidget.text);

    stopWiget = new UIWidget(new PIXI.Rectangle(renderer.width-100, 80, 65, 35), "Stop", clickStop);
    stage.addChild(stopWiget.graphics);
    stage.addChild(stopWiget.text);

    shuffleWidget = new UIWidget(new PIXI.Rectangle(renderer.width-100, 130, 90, 35), "Shuffle", clickShuffle);
    stage.addChild(shuffleWidget.graphics);
    stage.addChild(shuffleWidget.text);

    resetWidget = new UIWidget(new PIXI.Rectangle(renderer.width-100, 180, 80, 35), "Reset", clickReset);
    stage.addChild(resetWidget.graphics);
    stage.addChild(resetWidget.text);

    decreaseRowsWidget = new UIWidget(new PIXI.Rectangle(renderer.width-110, 230, 25, 35), "<", clickDecreaseRows);
    stage.addChild(decreaseRowsWidget.graphics);
    stage.addChild(decreaseRowsWidget.text);

    rowNumWidget = new UIWidget(new PIXI.Rectangle(decreaseRowsWidget.rect.x + 40, 230, 40, 35), String(numRows), ()=>{});
    stage.addChild(rowNumWidget.graphics);
    stage.addChild(rowNumWidget.text);

    increaseRowsWidget = new UIWidget(new PIXI.Rectangle(rowNumWidget.rect.x + 45, 230, 25, 35), ">", clickIncreaseRows);
    stage.addChild(increaseRowsWidget.graphics);
    stage.addChild(increaseRowsWidget.text);

    decreaseColumnsWidget = new UIWidget(new PIXI.Rectangle(renderer.width-110, 280, 25, 35), "<", clickDecreaseColumns);
    stage.addChild(decreaseColumnsWidget.graphics);
    stage.addChild(decreaseColumnsWidget.text);

    columnNumWidget = new UIWidget(new PIXI.Rectangle(decreaseColumnsWidget.rect.x + 40, 280, 40, 35), String(numColumns), ()=>{});
    stage.addChild(columnNumWidget.graphics);
    stage.addChild(columnNumWidget.text);

    increaseColumnsWidget = new UIWidget(new PIXI.Rectangle(rowNumWidget.rect.x + 45, 280, 25, 35), ">", clickIncreaseColumns);
    stage.addChild(increaseColumnsWidget.graphics);
    stage.addChild(increaseColumnsWidget.text);
}

function drawArrows() {
    for (let row of checkers) {
        for (let checker of row) {
            checker.draw();
        }
    }
}

function createCheckers(numColumns: number, numRows: number, checkerWidth: number, checkerHeight: number) {
    let checkers: Checker[][] = [];
    for (let i = 0; i < numRows; i++) {
        checkers[i] = [];
        for (let j = 0; j < numColumns; j++) {
            let newChecker = new Checker(i, j, j*checkerWidth, i*checkerHeight, checkerWidth, checkerHeight);
            // assign a random direction to each checker arrow
            newChecker.arrow.direction = getRandomDirection();
            checkers[i][j] = newChecker;
        }
    }
    return checkers;
}

function createCheckerBoard(numColumns: number, 
                            numRows: number, 
                            checkerWidth: number, 
                            checkerHeight: number) {
    let checkerBoard = new PIXI.Graphics();
    checkerBoard.beginFill(0x9f6bc4, 1);

    let startRow = true;
    for (let i = 0; i < numRows; i++)
    {
        for (let j = 0; j < numColumns; j++)
        {
            if ((j % 2 == 0) == startRow) {
                checkerBoard.drawRect(j*checkerWidth, i*checkerHeight, checkerWidth, checkerHeight);
            }
        }
        startRow = !startRow;
    }

    checkerBoard.endFill();

    //return checkerBoard;
    return new PIXI.Sprite(checkerBoard.generateCanvasTexture());
}

function getRandomDirection() {
    return <Direction>Math.floor(Math.random() * 4);
}

