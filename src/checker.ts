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

	constructor(row: number, column: number, x: number, y: number, width: number, height: number) {
		this.row = row;
		this.column = column;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.arrow = new Arrow([-18, -25], [0, 25], [18, -25], 0x3f3f3f);
		this.arrow.direction = Direction.Right;
		this.arrow.graphics.position.x = this.x + this.width/2;
		this.arrow.graphics.position.y = this.y + this.width/2;

		this.touched = false;
	}

	touch() {
		this.touched = true;
		this.arrow.color = 0x008800;
		this.arrow.draw();
	}

	reset() {
		this.touched = false;
		this.arrow.color = 0x3f3f3f;
		this.arrow.draw();
	}

	draw () {
		this.arrow.draw();
	}
}