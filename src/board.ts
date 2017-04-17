import PIXI = require('pixi.js');
import {Checker} from './checker';
import {Helpers} from './util';
import {Piece} from './piece';

export class Board {
	checkerBoard: PIXI.Sprite;
	checkers: Checker[][] = [];
	checkerPiece: Piece;
	chosenSpot: Checker;

	numRows: number;
	numColumns: number;
	checkerWidth: number;
	checkerHeight: number;

	graphics: PIXI.Graphics;

	constructor(numRows: number, numColumns: number, renderer: PIXI.SystemRenderer) {
		this.graphics = new PIXI.Graphics();

		this.numRows = numRows;
		this.numColumns = numColumns;

		this.resize(renderer);

		this.createCheckers();
	    this.chosenSpot = this.checkers[Math.floor(Math.random() * this.checkers.length)][Math.floor(Math.random() * this.checkers[0].length)];
	    this.checkerPiece = new Piece(this.chosenSpot, this.checkerWidth/2.3, 0xBB0000);
	    this.graphics.addChildAt(this.checkerPiece.graphics, 1);

	}

	resize(renderer: PIXI.SystemRenderer) {
		/*if (this.graphics.children && this.graphics.children.length) {
			this.graphics.removeChildren(0, this.graphics.children.length-1);
		}*/
		if (this.graphics.children && this.graphics.children.length) {
			this.graphics.removeChildAt(0);
		}
		let cellSize = Helpers.getCellsize(this.numColumns, this.numRows, renderer.width, renderer.height);
		this.checkerWidth = cellSize;
		this.checkerHeight = cellSize;
		this.createCheckerBoard();
		/*for (let row of this.checkers) {
			for (let checker of row) {
				this.graphics.addChild(checker.graphics);
			}
		}*/
		if (this.checkerPiece) {
			this.checkerPiece.r = this.checkerWidth/2.3;
			//this.graphics.addChildAt(this.checkerPiece.graphics, 1);
		}
	}

	createCheckerBoard() {
		let newBoard = new PIXI.Graphics();
		newBoard.beginFill(0x9f6bc4, 1);

		let startRow = true;
		for (let i = 0; i < this.numRows; i++) {
			for (let j = 0; j < this.numColumns; j++) {
				if ((j % 2 == 0) == startRow) {
					newBoard.beginFill(0x9f6bc4, 1);
				} else {
					newBoard.beginFill(0x5552b2, 1);
				}
				newBoard.drawRect(j*this.checkerWidth, i*this.checkerHeight, this.checkerWidth, this.checkerHeight);
			}
			startRow = !startRow;
		}

		newBoard.endFill();
		this.checkerBoard = new PIXI.Sprite(newBoard.generateCanvasTexture());
		this.graphics.addChildAt(this.checkerBoard, 0);
	}

	createCheckers() {
		this.checkers = [];
		for (let i = 0; i < this.numRows; i++) {
			this.checkers[i] = [];
			for (let j = 0; j < this.numColumns; j++) {
				let newChecker = new Checker(i, j, j*this.checkerWidth, i*this.checkerHeight, this.checkerWidth, this.checkerHeight);
				newChecker.arrow.direction = Helpers.getRandomDirection();
				this.checkers[i][j] = newChecker;
				this.graphics.addChild(this.checkers[i][j].graphics);	
			}
		}
	}

	draw() {
		this.checkerPiece.draw();
		for (let i = 0; i < this.checkers.length; i++) {
			let row = this.checkers[i];
			for (let j = 0; j < row.length; j++) {
				let checker = row[j];
				checker.draw(j*this.checkerWidth, i*this.checkerHeight, this.checkerWidth, this.checkerHeight);
			}
		}
	}

	shuffleArrows() {
		for (let row of this.checkers) {
			for (let checker of row) {
				checker.arrow.direction = Helpers.getRandomDirection();
				checker.reset();
			}
		}
	}
}