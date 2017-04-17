/// <reference path="../typings/index.d.ts" />

import PIXI = require('pixi.js');
import Howler = require('howler');

const renderer:PIXI.WebGLRenderer = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.view);

import {Direction} from './direction';
import {Arrow} from './arrow';
import {Checker} from './checker';
import {UIWidget} from './widget';
import {Piece} from './piece';
import {Helpers} from './util';
import {Game} from './game';
import {GameState} from './state';

// You need to create a root container that will hold the scene you want to draw.
const stage:PIXI.Container = new PIXI.Container();

//renderer.backgroundColor = 0x5552b2;
renderer.backgroundColor = 0x000000;

// set up game loop timer
let ticker = new PIXI.ticker.Ticker();
ticker.stop();

// game object
let game = new Game();

// define UI
let playWidget: UIWidget;
let stopWiget: UIWidget;
let shuffleWidget: UIWidget;
let resetWidget: UIWidget;
let decreaseRowsWidget: UIWidget;
let increaseRowsWidget: UIWidget;
let rowNumWidget: UIWidget;
let decreaseColumnsWidget: UIWidget;
let increaseColumnsWidget: UIWidget;
let columnNumWidget: UIWidget;
let victoryWidget: UIWidget;
let cycleWidget: UIWidget;

// graphcis scale
let scale: PIXI.Point = new PIXI.Point(1, 1);

// Sound effects
let victorySound = new Howler.Howl({
    src: 'win.mp3'
});

let failSound = new Howler.Howl({
    src: 'fail.mp3'
});

// Do first-time game board setup
setup();
// Start animation/rendering loop
animate();

// Setup PXI ticker as game logic loop
ticker.add(gameLoop);

function gameLoop(deltaTime: number) {
    let newState = game.gameLoop(deltaTime);
    if (newState == GameState.Victory) {
        stop();
        victorySound.play();
        alert("Congratulations, you win!");
        reset();
    } else if (newState == GameState.Failure) {
        stop();
        failSound.play();
        alert("Cycle detected -- can't move here");
    }
}

/*** Functions ***/

function animate() {
    // start the timer for the next animation loop
    requestAnimationFrame(animate);

    // draw game
    game.draw();

    // draw UI widgets
    playWidget.draw();
    stopWiget.draw();
    shuffleWidget.draw();
    resetWidget.draw();
    decreaseRowsWidget.draw();
    increaseRowsWidget.draw();
    rowNumWidget.draw();
    decreaseColumnsWidget.draw();
    increaseColumnsWidget.draw();
    columnNumWidget.draw();

    // this is the main render call that makes pixi draw your container and its children.
    renderer.render(stage);
}

// create window resize handler
// game board components should change size to
// reflect the new window size
window.onresize = (event)=>{
    renderer.resize(window.innerWidth, window.innerHeight);
    reset();
};


// UI event handlers
function clickPlay() {
    play();
}

function clickStop() {
    stop();
}

function clickShuffle() {
    game.shuffle();
}

function clickReset() {
    reset();
}

function clickDecreaseRows() {
    game.decreaseRows();
    reset();
}

function clickIncreaseRows() {
    game.increaseRows();
    reset();
}

function clickDecreaseColumns() {
    game.decreaseColumns();
    reset();
}

function clickIncreaseColumns() {
    game.increaseColumns();
    reset();
}


/**** Game Logic Functions ****/

function setup() {
    game.setup(stage, renderer); 

    playWidget = new UIWidget(new PIXI.Rectangle(renderer.width-100, 30, 65, 35), "Play", clickPlay);
    stage.addChild(playWidget.graphics);
    stage.addChild(playWidget.text);

    stopWiget = new UIWidget(new PIXI.Rectangle(renderer.width-100, 80, 65, 35), "Stop", clickStop);
    stage.addChild(stopWiget.graphics);
    stage.addChild(stopWiget.text);

    shuffleWidget = new UIWidget(new PIXI.Rectangle(renderer.width-100, 130, 90, 35), "Shuffle", clickShuffle);
    stage.addChild(shuffleWidget.graphics);
    stage.addChild(shuffleWidget.text);

    resetWidget = new UIWidget(new PIXI.Rectangle(renderer.width-100, 180, 80, 35), "Reset", clickReset);
    stage.addChild(resetWidget.graphics);
    stage.addChild(resetWidget.text);

    decreaseRowsWidget = new UIWidget(new PIXI.Rectangle(renderer.width-110, 230, 25, 35), "<", clickDecreaseRows);
    stage.addChild(decreaseRowsWidget.graphics);
    stage.addChild(decreaseRowsWidget.text);

    rowNumWidget = new UIWidget(new PIXI.Rectangle(decreaseRowsWidget.rect.x + 40, 230, 40, 35), String(game.numRows), ()=>{});
    stage.addChild(rowNumWidget.graphics);
    stage.addChild(rowNumWidget.text);

    increaseRowsWidget = new UIWidget(new PIXI.Rectangle(rowNumWidget.rect.x + 45, 230, 25, 35), ">", clickIncreaseRows);
    stage.addChild(increaseRowsWidget.graphics);
    stage.addChild(increaseRowsWidget.text);

    decreaseColumnsWidget = new UIWidget(new PIXI.Rectangle(renderer.width-110, 280, 25, 35), "<", clickDecreaseColumns);
    stage.addChild(decreaseColumnsWidget.graphics);
    stage.addChild(decreaseColumnsWidget.text);

    columnNumWidget = new UIWidget(new PIXI.Rectangle(decreaseColumnsWidget.rect.x + 40, 280, 40, 35), String(game.numColumns), ()=>{});
    stage.addChild(columnNumWidget.graphics);
    stage.addChild(columnNumWidget.text);

    increaseColumnsWidget = new UIWidget(new PIXI.Rectangle(rowNumWidget.rect.x + 45, 280, 25, 35), ">", clickIncreaseColumns);
    stage.addChild(increaseColumnsWidget.graphics);
    stage.addChild(increaseColumnsWidget.text);
}

function play() {
    ticker.start();
}

function stop() {
    ticker.stop();
}

function reset() {
    stop();
    stage.removeChildren(0, stage.children.length-1);
    setup();
}








