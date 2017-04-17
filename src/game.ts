/// <reference path="../typings/index.d.ts" />

import PIXI = require('pixi.js');
import Howler = require('howler');
import {Board} from './board';
import {Checker} from './checker';
import {Arrow} from './arrow';
import {Direction} from './direction';
import {Piece} from './piece';
import {GameState} from './state';
import {Helpers} from './util';

const UPDATE_TIME: number = 25;
export class Game {
	watchTime: number = 0;

	// board state
	board: Board;
	numColumns: number = 12;
	numRows:  number = 6;

	scale: PIXI.Point = new PIXI.Point(1, 1);

	slidingSound: Howl;

	constructor(renderer: PIXI.SystemRenderer) {
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

	    this.board.checkerPiece.update(deltaTime);
	    return newState;
	}

	update() {
		let newGameState = GameState.Continue;

	    let currentSpot = this.board.checkerPiece.spot;
	    let newSpot: Checker;
	    let foundEdge: boolean = false;
	    switch (currentSpot.arrow.direction) {
	        case (Direction.Down):
	            if (currentSpot.row != this.numRows-1) {
	                newSpot = this.board.checkers[currentSpot.row+1][currentSpot.column];
	            } else {
	                foundEdge = true;
	            }
	            break;
	        case (Direction.Up):
	            if (currentSpot.row != 0) {
	                newSpot = this.board.checkers[currentSpot.row-1][currentSpot.column];
	            } else {
	                foundEdge = true;
	            }
	            break;
	        case (Direction.Right):
	            if (currentSpot.column != this.numColumns-1) {
	                newSpot = this.board.checkers[currentSpot.row][currentSpot.column+1];
	            } else {
	                foundEdge = true;
	            }
	            break;
	        case (Direction.Left):
	            if (currentSpot.column != 0) {
	                newSpot = this.board.checkers[currentSpot.row][currentSpot.column-1];
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
	            this.board.checkerPiece.move(newSpot);
	            this.slidingSound.play();
	        }
	    }

	    return newGameState;
	}

	setup(stage: PIXI.Container, renderer: PIXI.SystemRenderer) {
		this.board = new Board(this.numRows, this.numColumns, renderer);
		stage.addChild(this.board.graphics);
	    this.board.chosenSpot.touch();
	}

	draw(renderer: PIXI.SystemRenderer) {
		this.board.graphics.x = (renderer.width/2) - (this.board.graphics.width/2);
		this.board.graphics.y = (renderer.height/2) - (this.board.graphics.height/2);
	    this.board.draw();
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
		this.board.shuffleArrows();
		this.board.checkerPiece.spot.touch();
	}
}

