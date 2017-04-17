/// <reference path="../typings/index.d.ts" />

import PIXI = require('pixi.js');
import Howler = require('howler');
import {Checker} from './checker';
import {Arrow} from './arrow';
import {Direction} from './direction';
import {Piece} from './piece';
import {GameState} from './state';
import {Helpers} from './util';

const UPDATE_TIME: number = 25;
export class Game {
	watchTime: number = 0;
	// let ticker = new PIXI.ticker.Ticker();
	// ticker.stop();

	// board state
	numColumns: number = 12;
	numRows:  number = 6;
	checkerWidth: number = 0;
	checkerHeight: number = 0;	

	// game pieces
	checkers: Checker[][] = [];
	checkerBoard: PIXI.Sprite;
	chosenSpot: Checker;
	checkerPiece: Piece;

	scale: PIXI.Point = new PIXI.Point(1, 1);

	slidingSound: Howl;

	constructor() {
		this.slidingSound = new Howler.Howl({
			src: 'Sliding.mp3'
		});
	}

	gameLoop(deltaTime: number) {
	    // doing quarter-second "turns"
	    let newState: GameState = GameState.Continue;
	    this.watchTime += deltaTime;
	    if (this.watchTime >= UPDATE_TIME) {
	        newState = this.update();
	        this.watchTime = 0;
	    }

	    this.checkerPiece.update(deltaTime);
	    return newState;
	}

	update() {
		let newGameState = GameState.Continue;

	    let currentSpot = this.checkerPiece.spot;
	    let newSpot: Checker;
	    let foundEdge: boolean = false;
	    switch (currentSpot.arrow.direction) {
	        case (Direction.Down):
	            if (currentSpot.row != this.numRows-1) {
	                newSpot = this.checkers[currentSpot.row+1][currentSpot.column];
	            } else {
	                foundEdge = true;
	            }
	            break;
	        case (Direction.Up):
	            if (currentSpot.row != 0) {
	                newSpot = this.checkers[currentSpot.row-1][currentSpot.column];
	            } else {
	                foundEdge = true;
	            }
	            break;
	        case (Direction.Right):
	            if (currentSpot.column != this.numColumns-1) {
	                newSpot = this.checkers[currentSpot.row][currentSpot.column+1];
	            } else {
	                foundEdge = true;
	            }
	            break;
	        case (Direction.Left):
	            if (currentSpot.column != 0) {
	                newSpot = this.checkers[currentSpot.row][currentSpot.column-1];
	            } else {
	                foundEdge = true;
	            }
	            break;    
	        default:
	            break;
	    }

	    if (foundEdge) {
	        newGameState = GameState.Victory;
	    } else {
	        if (newSpot.touched) {
	            newGameState = GameState.Failure;
	        } else {
	            this.checkerPiece.move(newSpot);
	            this.slidingSound.play();
	        }
	    }

	    return newGameState;
	}

	setup(stage: PIXI.Container, renderer: PIXI.SystemRenderer) {
	    let cellSize = Helpers.getCellsize(this.numColumns, this.numRows, renderer.width, renderer.height);
	    this.checkerWidth = cellSize;
	    this.checkerHeight = cellSize;

	    this.scale.x = this.scale.y = cellSize / 100;

	    this.checkers = Helpers.createCheckers(this.numColumns, this.numRows, this.checkerWidth, this.checkerHeight);
	    this.checkerBoard = Helpers.createCheckerBoard(this.numColumns, this.numRows, this.checkerWidth, this.checkerHeight);
	    stage.addChild(this.checkerBoard);
	    this.chosenSpot = this.checkers[Math.floor(Math.random() * this.checkers.length)][Math.floor(Math.random() * this.checkers[0].length)];
	    this.checkerPiece = new Piece(this.chosenSpot, this.checkerWidth/2.3, 0xBB0000);
	    this.chosenSpot.touch();
	    stage.addChild(this.checkerPiece.graphics);

	    for (let row of this.checkers) {
	        for (let checker of row) {
	            stage.addChild(checker.arrow.graphics);
	        }
	    }
	}

	draw() {
	    // draw checker piece
	    this.checkerPiece.draw();
	    Helpers.drawCheckers(this.checkers, this.scale);
	}

	decreaseRows() {
		if (this.numRows > 1) {
			--this.numRows;
		}
	}

	increaseRows() {
		++this.numRows;
	}

	decreaseColumns() {
		if (this.numColumns > 1) {
			--this.numColumns;
		}
	}

	increaseColumns() {
		++this.numColumns;
	}

	shuffle() {
		this.shuffleArrows();
		this.checkerPiece.spot.touch();
	}

	shuffleArrows() {
	    for (let row of this.checkers) {
	        for (let checker of row) {
	            checker.arrow.direction = Helpers.getRandomDirection();
	            // since we're reshuffling the arrows, we no longer know which spaces
	            // the checker piece has already touched
	            checker.reset();
	        }
	    }
	}
}

