(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.jiboProgrammingChallenge = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/// <reference path="../typings/index.d.ts" />
"use strict";
const PIXI = require('pixi.js');
const renderer = new PIXI.WebGLRenderer(1280, 720);
document.body.appendChild(renderer.view);
// You need to create a root container that will hold the scene you want to draw.
const stage = new PIXI.Container();
// Declare a global variable for our sprite so that the animate function can access it.
let bunny = null;
// load the texture we need
PIXI.loader.add('bunny', 'images/bunny.jpeg').load(function (loader, resources) {
    // This creates a texture from a 'bunny.png' image.
    bunny = new PIXI.Sprite(resources.bunny.texture);
    // Setup the position and scale of the bunny
    bunny.position.x = 400;
    bunny.position.y = 300;
    bunny.scale.x = 2;
    bunny.scale.y = 2;
    // Add the bunny to the scene we are building.
    stage.addChild(bunny);
    // kick off the animation loop (defined below)
    animate();
});
function animate() {
    // start the timer for the next animation loop
    requestAnimationFrame(animate);
    // each frame we spin the bunny around a bit
    bunny.rotation += 0.01;
    // this is the main render call that makes pixi draw your container and its children.
    renderer.render(stage);
}

},{"pixi.js":undefined}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsOENBQThDOztBQUU5QyxNQUFPLElBQUksV0FBVyxTQUFTLENBQUMsQ0FBQztBQUNqQyxNQUFNLFFBQVEsR0FBc0IsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN0RSxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFekMsaUZBQWlGO0FBQ2pGLE1BQU0sS0FBSyxHQUFrQixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUVsRCx1RkFBdUY7QUFDdkYsSUFBSSxLQUFLLEdBQWUsSUFBSSxDQUFDO0FBRTdCLDJCQUEyQjtBQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsbUJBQW1CLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxNQUEwQixFQUFFLFNBQWE7SUFDbEcsbURBQW1EO0lBQ25ELEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUVqRCw0Q0FBNEM7SUFDNUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ3ZCLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUV2QixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEIsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRWxCLDhDQUE4QztJQUM5QyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXRCLDhDQUE4QztJQUM5QyxPQUFPLEVBQUUsQ0FBQztBQUNkLENBQUMsQ0FBQyxDQUFDO0FBRUg7SUFDSSw4Q0FBOEM7SUFDOUMscUJBQXFCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFL0IsNENBQTRDO0lBQzVDLEtBQUssQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDO0lBRXZCLHFGQUFxRjtJQUNyRixRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzNCLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvaW5kZXguZC50c1wiIC8+XG5cbmltcG9ydCBQSVhJID0gcmVxdWlyZSgncGl4aS5qcycpO1xuY29uc3QgcmVuZGVyZXI6UElYSS5XZWJHTFJlbmRlcmVyID0gbmV3IFBJWEkuV2ViR0xSZW5kZXJlcigxMjgwLCA3MjApO1xuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci52aWV3KTtcblxuLy8gWW91IG5lZWQgdG8gY3JlYXRlIGEgcm9vdCBjb250YWluZXIgdGhhdCB3aWxsIGhvbGQgdGhlIHNjZW5lIHlvdSB3YW50IHRvIGRyYXcuXG5jb25zdCBzdGFnZTpQSVhJLkNvbnRhaW5lciA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xuXG4vLyBEZWNsYXJlIGEgZ2xvYmFsIHZhcmlhYmxlIGZvciBvdXIgc3ByaXRlIHNvIHRoYXQgdGhlIGFuaW1hdGUgZnVuY3Rpb24gY2FuIGFjY2VzcyBpdC5cbmxldCBidW5ueTpQSVhJLlNwcml0ZSA9IG51bGw7XG5cbi8vIGxvYWQgdGhlIHRleHR1cmUgd2UgbmVlZFxuUElYSS5sb2FkZXIuYWRkKCdidW5ueScsICdpbWFnZXMvYnVubnkuanBlZycpLmxvYWQoZnVuY3Rpb24gKGxvYWRlcjpQSVhJLmxvYWRlcnMuTG9hZGVyLCByZXNvdXJjZXM6YW55KSB7XG4gICAgLy8gVGhpcyBjcmVhdGVzIGEgdGV4dHVyZSBmcm9tIGEgJ2J1bm55LnBuZycgaW1hZ2UuXG4gICAgYnVubnkgPSBuZXcgUElYSS5TcHJpdGUocmVzb3VyY2VzLmJ1bm55LnRleHR1cmUpO1xuXG4gICAgLy8gU2V0dXAgdGhlIHBvc2l0aW9uIGFuZCBzY2FsZSBvZiB0aGUgYnVubnlcbiAgICBidW5ueS5wb3NpdGlvbi54ID0gNDAwO1xuICAgIGJ1bm55LnBvc2l0aW9uLnkgPSAzMDA7XG5cbiAgICBidW5ueS5zY2FsZS54ID0gMjtcbiAgICBidW5ueS5zY2FsZS55ID0gMjtcblxuICAgIC8vIEFkZCB0aGUgYnVubnkgdG8gdGhlIHNjZW5lIHdlIGFyZSBidWlsZGluZy5cbiAgICBzdGFnZS5hZGRDaGlsZChidW5ueSk7XG5cbiAgICAvLyBraWNrIG9mZiB0aGUgYW5pbWF0aW9uIGxvb3AgKGRlZmluZWQgYmVsb3cpXG4gICAgYW5pbWF0ZSgpO1xufSk7XG5cbmZ1bmN0aW9uIGFuaW1hdGUoKSB7XG4gICAgLy8gc3RhcnQgdGhlIHRpbWVyIGZvciB0aGUgbmV4dCBhbmltYXRpb24gbG9vcFxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcblxuICAgIC8vIGVhY2ggZnJhbWUgd2Ugc3BpbiB0aGUgYnVubnkgYXJvdW5kIGEgYml0XG4gICAgYnVubnkucm90YXRpb24gKz0gMC4wMTtcblxuICAgIC8vIHRoaXMgaXMgdGhlIG1haW4gcmVuZGVyIGNhbGwgdGhhdCBtYWtlcyBwaXhpIGRyYXcgeW91ciBjb250YWluZXIgYW5kIGl0cyBjaGlsZHJlbi5cbiAgICByZW5kZXJlci5yZW5kZXIoc3RhZ2UpO1xufVxuIl19
