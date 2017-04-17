import PIXI = require('pixi.js');

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
		this.graphics.clear();
		this.graphics.beginFill(this.color, this.alpha);
		this.graphics.drawRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
		this.graphics.endFill();
	}
}