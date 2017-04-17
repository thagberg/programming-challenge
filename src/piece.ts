import PIXI = require('pixi.js');
import {Checker} from './checker';

export class Piece {
	spot: Checker;
	r: number;
	color: number;
	x: number;
	y: number;
	newX: number;
	newY: number;
	oldX: number;
	oldY: number;
	graphics: PIXI.Graphics;
	transitionTime: number;
	transitionProgress: number;
	moving: boolean;

	constructor(spot: Checker, r: number, color: number) {
		this.spot = spot;
		this.r = r;
		this.color = color;
		this.graphics = new PIXI.Graphics();

		this.x = 0;
		this.y = 0;
		this.newY = 0;
		this.newX = 0;
		this.oldX = 0;
		this.oldY = 0;

		this.transitionTime = 20;
		this.transitionProgress = 0;
		this.moving = false;
	}

	move (spot: Checker) {
		this.moving = true;
		this.newX = spot.graphics.x - this.spot.graphics.x;
		this.newY = spot.graphics.y - this.spot.graphics.y; 
		this.x = this.newX;
		this.y = this.newY;
		this.spot = spot;	
		this.oldX = this.x;
		this.oldY = this.y;

		this.spot.touch();
	}

	update(deltaTime: number) {
		if (this.moving) {
			this.transitionProgress += deltaTime;
			this.x -= (this.newX) * (deltaTime / this.transitionTime); 
			this.y -= (this.newY) * (deltaTime / this.transitionTime);
			if (this.transitionProgress >= this.transitionTime) {
				this.moving = false;
				this.transitionProgress = 0;
				// make sure we didn't barely miss the exact target from rounding errors, etc.
				this.x = 0;
				this.y = 0;
				this.oldX = this.newX = 0;
				this.oldY = this.newY = 0;
			}
		}
	}

	draw () {
		this.graphics.clear();
		this.graphics.beginFill(this.color, 1);
		this.graphics.drawCircle((this.spot.graphics.x + this.spot.graphics.width/2)-this.x, 
			(this.spot.graphics.y + this.spot.graphics.height/2)-this.y, this.r);
		this.graphics.endFill();
	}
}
