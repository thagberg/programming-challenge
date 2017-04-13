/// <reference path="../typings/index.d.ts" />

export enum Direction {
	Down = 0,
	Left,
	Up,
	Right	
}

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
        this.graphics = new PIXI.Graphics();
        this.direction = Direction.Down;

        // set pivot point for rotation (should be center of the arrow)
		//this.graphics.pivot.x = this.a[0] + (this.c[0]-this.a[0])/2;
		//this.graphics.pivot.y = this.a[1] + (this.b[1]-this.a[1])/2;
    }

    draw () {
    	// Rotate the arrow by a set number of radians, depending on which
    	// direction it should be facing
    	this.graphics.rotation = (90 * Math.PI / 180) * this.direction;

        this.graphics.beginFill(this.color, 1);
        this.graphics.drawPolygon([this.a[0], this.a[1], 
                                   this.b[0], this.b[1], 
                                   this.c[0], this.c[1]]);
        this.graphics.endFill();
    }
}

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

	draw () {
		this.arrow.draw();
	}
}

export class Piece {
	spot: Checker;
	r: number;
	color: number;
	graphics: PIXI.Graphics;

	constructor(spot: Checker, r: number, color: number) {
		this.spot = spot;
		this.r = r;
		this.color = color;
		this.graphics = new PIXI.Graphics();
	}

	draw () {
		this.graphics.beginFill(this.color, 1);
		this.graphics.drawCircle(this.spot.x + this.spot.width/2, this.spot.y + this.spot.height/2, this.r);
		this.graphics.endFill();
	}
}

export class UIWidget {
	rect: PIXI.Rectangle;
	text: PIXI.Text;
	graphics: PIXI.Graphics;
	clickHandler: ()=>any;
	color: number;
	alpha: number;
	enabled: boolean;

	constructor(rect: PIXI.Rectangle, text: string, clickHandler: ()=>any) {
		this.rect = rect;
		this.text = new PIXI.Text(text);
		this.graphics = new PIXI.Graphics();

		// add "padding" to text
		this.text.x = this.rect.x + 5;
		this.text.y = this.rect.y + 5;

		// turn on buttonMode so that we can interact via mouse
		this.graphics.interactive = true;
		this.graphics.buttonMode = true;

		this.color = 0xc4c4c4;
		this.alpha = 0.7;

		this.enabled = true;

		// bind the click handler callback
		this.clickHandler = clickHandler;
		this.graphics.on("click", clickHandler);

		// bind mousedown handler, for showing that the button
		//	is being depressed
		this.graphics.on("mousedown", ()=>{
			if (this.enabled) {
				this.color = 0x969696;
				this.alpha = 0.9;
			}
		});

		this.graphics.on("mouseup", ()=>{
			if (this.enabled) {
				this.color = 0xc4c4c4;
				this.alpha = 0.7;
			}
		});
	}

	setEnabled(enabled: boolean) {
		this.enabled = enabled;
		if (this.enabled) {
			this.color = 0xc4c4c4;
		} else {
			this.color = 0x969696;
		}
	}

	draw () {
		this.graphics.beginFill(this.color, this.alpha);
		this.graphics.drawRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
		this.graphics.endFill();
	}
}