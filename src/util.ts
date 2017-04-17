import PIXI = require('pixi.js');
import {Direction} from './direction';
import {Checker} from './checker';

export namespace Helpers {
	export function getRandomDirection() {
	    return <Direction>Math.floor(Math.random() * 4);
	}

	export function getCellsize(numColumns: number, numRows: number, screenWidth: number, screenHeight: number) {
		return Math.min(screenWidth / numColumns, screenHeight / numRows);
	}
}