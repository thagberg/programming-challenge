/// <reference path="../typings/index.d.ts" />
/// <reference path="shapes.ts" />

import PIXI = require('pixi.js');
const renderer:PIXI.WebGLRenderer = new PIXI.WebGLRenderer(1280, 720);
document.body.appendChild(renderer.view);

import {Arrow, Direction, Checker, Piece, UIWidget} from './shapes';

// You need to create a root container that will hold the scene you want to draw.
const stage:PIXI.Container = new PIXI.Container();

// Declare a global variable for our sprite so that the animate function can access it.
let bunny:PIXI.Sprite = null;

let numColumns = 16;
let numRows = 9;

let checkerWidth = renderer.width / numColumns;
let checkerHeight = renderer.height / numRows;


// set background color as an easy way to only draw half of the checkerboard spaces
renderer.backgroundColor = 0x5552b2;

// load the texture we need
/*PIXI.loader.add('bunny', 'images/bunny.jpeg').load(function (loader:PIXI.loaders.Loader, resources:any) {
    // This creates a texture from a 'bunny.png' image.
    bunny = new PIXI.Sprite(resources.bunny.texture);

    // Setup the position and scale of the bunny
    bunny.position.x = 400;
    bunny.position.y = 300;

    bunny.scale.x = 2;
    bunny.scale.y = 2;

    // Add the bunny to the scene we are building.
    stage.addChild(bunny);

    // kick off the animation loop (defined below)
    animate()
});*/

//stage.addChild(checkerBoard);
//animate();


// create board, arrows, and pieces
let checkers: Checker[][] = [];
let checkerBoard = createCheckerBoard(numColumns, numRows, checkerWidth, checkerHeight, checkers);
stage.addChild(checkerBoard);
let chosenSpot: Checker = checkers[Math.floor(Math.random() * checkers.length)][Math.floor(Math.random() * checkers[0].length)];
let checkerPiece: Piece = new Piece(chosenSpot, checkerWidth/2.3, 0xFF0000);
chosenSpot.touched = true;
stage.addChild(checkerPiece.graphics);
for (let row of checkers) {
    for (let checker of row) {
        stage.addChild(checker.arrow.graphics);
    }
}

// create UI
function clickPlay() {
    play();
}

function clickStop() {
    alert("Clicked Stop");
}

function clickShuffle() {
    shuffleArrows();
    // we just "reset" the touched graph, so re-mark the checker piece's spot as touched
    checkerPiece.spot.touched = true;
}

function clickReset() {

}

let playWidget: UIWidget = new UIWidget(new PIXI.Rectangle(renderer.width-100, 30, 65, 35), "Play", clickPlay);
stage.addChild(playWidget.graphics);
stage.addChild(playWidget.text);

let stopWiget: UIWidget = new UIWidget(new PIXI.Rectangle(renderer.width-100, 80, 65, 35), "Stop", clickStop);
stage.addChild(stopWiget.graphics);
stage.addChild(stopWiget.text);

let shuffleWidget: UIWidget = new UIWidget(new PIXI.Rectangle(renderer.width-100, 130, 90, 35), "Shuffle", clickShuffle);
stage.addChild(shuffleWidget.graphics);
stage.addChild(shuffleWidget.text);

let resetWidget: UIWidget = new UIWidget(new PIXI.Rectangle(renderer.width-100, 180, 65, 35), "Reset", clickReset);
stage.addChild(resetWidget.graphics);
stage.addChild(resetWidget.text);

animate();

function createCheckerBoard(numColumns: number, 
                            numRows: number, 
                            checkerWidth: number, 
                            checkerHeight: number,
                            outCheckers: Checker[][]) {
    let checkerBoard = new PIXI.Graphics();
    checkerBoard.beginFill(0x9f6bc4, 1);

    let startRow = true;
    for (let i = 0; i < numRows; i++)
    {
        outCheckers[i] = [];
        for (let j = 0; j < numColumns; j++)
        {
            if ((j % 2 == 0) == startRow) {
                checkerBoard.drawRect(j*checkerWidth, i*checkerHeight, checkerWidth, checkerHeight);
            }

            // assign a random direction to each checker arrow
            let newChecker = new Checker(i, j, j*checkerWidth, i*checkerHeight, checkerWidth, checkerHeight);
            newChecker.arrow.direction = <Direction>Math.floor(Math.random() * 4);
            outCheckers[i][j] = newChecker;
        }
        startRow = !startRow;
    }

    checkerBoard.endFill();

    //return checkerBoard;
    return new PIXI.Sprite(checkerBoard.generateCanvasTexture());
}

function shuffleArrows() {
    for (let row of checkers) {
        for (let checker of row) {
            checker.arrow.direction = <Direction>Math.floor(Math.random() * 4);
            // since we're reshuffling the arrows, we no longer know which spaces
            // the checker piece has already touched
            checker.touched = false;
        }
    }
}

function play() {
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
        alert("You win!  Congratulations!");
    } else {
        if (newSpot.touched) {
            alert("Loop detected -- Can't move to this spot");
        } else {
            checkerPiece.spot = newSpot;
            checkerPiece.spot.touched = true;
        }
    }
}

function animate() {
    // start the timer for the next animation loop
    requestAnimationFrame(animate);

    // each frame we spin the bunny around a bit
    //bunny.rotation += 0.10;

    // draw checker piece
    checkerPiece.draw();

    // draw arrows
    for (let row of checkers) {
        for (let checker of row) {
            checker.draw();
        }
    }

    playWidget.draw();
    stopWiget.draw();
    shuffleWidget.draw();
    resetWidget.draw();

    // this is the main render call that makes pixi draw your container and its children.
    renderer.render(stage);
}
