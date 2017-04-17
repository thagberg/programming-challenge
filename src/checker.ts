import PIXI = require('pixi.js');
import {Direction} from './direction';
import {Arrow} from './arrow';

export class Checker {
	row: number;
	column: number;
	x: number;
	y: number;
	width: number;
	height: number;
	arrow: Arrow;
	touched: boolean;
	graphics: PIXI.Graphics;

	constructor(row: number, column: number, x: number, y: number, width: number, height: number) {
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

		this.arrow = new Arrow([-9, -12.5], [0, 12.5], [9, -12.5], 0x3f3f3f);
		this.arrow.direction = Direction.Right;
		this.graphics.addChild(this.arrow.graphics);

		this.touched = false;
	}

	touch() {
		this.touched = true;
		this.arrow.color = 0x008800;
	}

	reset() {
		this.touched = false;
		this.arrow.color = 0x3f3f3f;
	}

	draw(x: number, y: number, width: number, height: number) {
		this.graphics.x = x;
		this.graphics.y = y;
		this.arrow.draw(width, height);	
	}
}