'use strict';

let Lamps = require('./statusLamp');
let Buzzer = require('./statusBuzzer');
var q = require('q');


var lampBamboo = new Lamps(1);
var lampServer = new Lamps(4);
var buzzer = new Buzzer(7);

module.exports = {
    setBambooStatus: setBambooStatus,
    setHealthStatus: setHealthStatus,
    buzz: buzz,
    allOff: allOff, 
    allDisco: allDisco
};

function setBambooStatus(status) {
	if (status === 'successful') {
		lampBamboo.set('green');
	}
	if (status === 'building') {
		lampBamboo.set('blue');
	}
	if (status === 'failed') {
		lampBamboo.set('red');
	}
	if (status === 'error') {
		lampBamboo.set('purple');
	}
}

function setHealthStatus(status) {
	if (status === 'up') {
		lampServer.set('green');
	}
	if (status === 'shaky') {
		lampServer.set('yellow');
	}
	if (status === 'down') {
		lampServer.set('red');
	}
	if (status === 'error') {
		lampServer.set('purple');
	}
}

function buzz() {
	buzzer.buzz(500);
}

function allOff() {
	lampBamboo.set('off');
	lampServer.set('off')
}

var howlong = 25;
var lastDiscoColor = 'unknown';
function allDisco(toStatus) {
	howlong = 25;
	let disco = blinkRandomColor()
				.then(blinkRandomColor)
				.then(blinkRandomColor)
				.then(blinkRandomColor)
				.then(blinkRandomColor)
				.then(blinkRandomColor)
				.then(() => lampBamboo.set(toStatus));
}

function blinkRandomColor() {

	var possibleColors = ['red','green','blue','yellow','purple','sea'];
	var discoColor = possibleColors[Math.floor(Math.random() * possibleColors.length)];
	if (discoColor === lastDiscoColor) {
		discoColor = possibleColors[Math.floor(Math.random() * possibleColors.length)]
	}
	lastDiscoColor = discoColor;
	lampBamboo.set(discoColor);
	howlong+=100;
	// console.log('delay: ', howlong);
    return new Promise((resolve) => setTimeout(resolve, howlong));
}

