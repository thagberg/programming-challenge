import PIXI = require('pixi.js');
import {Direction} from './direction';
import {Checker} from './checker';

export namespace Helpers {
	export function getRandomDirection() {
	    return <Direction>Math.floor(Math.random() * 4);
	}

	export function createCheckerBoard(numColumns: number, 
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
				    checkerBoard.beginFill(0x9f6bc4, 1);
	            } else {
	            	checkerBoard.beginFill(0x5552b2, 1);
	            }
                checkerBoard.drawRect(j*checkerWidth, i*checkerHeight, checkerWidth, checkerHeight);
	        }
	        startRow = !startRow;
	    }

	    checkerBoard.endFill();

	    return new PIXI.Sprite(checkerBoard.generateCanvasTexture());
	}

	export function createCheckers(numColumns: number, numRows: number, checkerWidth: number, checkerHeight: number) {
	    let checkers: Checker[][] = [];
	    for (let i = 0; i < numRows; i++) {
	        checkers[i] = [];
	        for (let j = 0; j < numColumns; j++) {
	            let newChecker = new Checker(i, j, j*checkerWidth, i*checkerHeight, checkerWidth, checkerHeight);
	            // assign a random direction to each checker arrow
	            newChecker.arrow.direction = Helpers.getRandomDirection();
	            checkers[i][j] = newChecker;
	        }
	    }
	    return checkers;
	}

	export function getCellsize(numColumns: number, numRows: number, screenWidth: number, screenHeight: number) {
		return Math.min(screenWidth / numColumns, screenHeight / numRows);
	}

	export function drawCheckers(checkers: Checker[][], scale: PIXI.Point) {
	    for (let row of checkers) {
	        for (let checker of row) {
	            //checker.draw(scale);
	        }
	    }
	}

}