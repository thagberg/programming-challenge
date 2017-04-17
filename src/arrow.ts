import PIXI = require('pixi.js');
import {Direction} from './direction';

export class Arrow {
    a: [number, number];
    b: [number, number];
    c: [number, number];
    color: number;
    graphics: PIXI.Graphics;
    direction: Direction;

    constructor(a: [number, number], b: [number, number], c: [number, number], color: number) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.color = color;
        this.direction = Direction.Down;

        this.graphics = new PIXI.Graphics();
    }

     draw(width: number, height: number) {
    	// Rotate the arrow by a set number of radians, depending on which
    	// direction it should be facing
    	this.graphics.rotation = (90 * Math.PI / 180) * this.direction;

        this.graphics.scale.x = width/100;
        this.graphics.scale.y = height/100;

        this.graphics.x = width/2;
        this.graphics.y = height/2;

        this.graphics.beginFill(this.color, 1);
        this.graphics.drawPolygon([this.a[0], this.a[1], 
                                   this.b[0], this.b[1], 
                                   this.c[0], this.c[1]]);
        this.graphics.endFill();
    }
}