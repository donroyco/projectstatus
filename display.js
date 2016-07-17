'use strict';

let Lamps = require('./statusLamp');
let Buzzer = require('./statusBuzzer');
var q = require('q');


var lampBamboo = new Lamps(1);
var lampHealth = new Lamps(4);
var buzzer = new Buzzer(7);

var defaultTick = 200;
var shortTick = 250;

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
		lampHealth.set('green');
	}
	if (status === 'shaky') {
		lampHealth.set('yellow');
	}
	if (status === 'down') {
		lampHealth.set('red');
	}
	if (status === 'error') {
		lampHealth.set('purple');
	}
}

function buzz() {
	buzzer.buzz(defaultTick);
}

function allOff() {
	lampBamboo.set('off');
	lampHealth.set('off')
}

function allDisco() {
	var lastHealthColor = lampHealth.currentColor;
	var lastBambooColor = lampBamboo.currentColor;
	console.log('disco requested');

	let disco = blinkBambooRandom()
				.then(blinkServerRandom)
				.then(blinkBambooRandom)
				.then(blinkServerRandom)
				.then(blinkBambooRandom)
				.then(blinkServerRandom)
				.then(blinkBambooRandom)
				.then(blinkServerRandom)
				.then(blinkBambooRandom)
				.then(blinkServerRandom)
				.then(blinkBambooRandom)
				.then(blinkServerRandom)
				.then(blinkBambooRandom)
				.then(blinkServerRandom)
				.then(blinkBambooRandom)
				.then(blinkServerRandom)
				.then(() => {
					lampBamboo.set(lastBambooColor || 'off')
					lampHealth.set(lastHealthColor || 'off')
					});
}

function blinkBambooRandom() {
	lampBamboo.set(randomColor(lampBamboo.currentColor));
    return new Promise((resolve) => setTimeout(resolve, shortTick));
}

function blinkServerRandom() {
	lampHealth.set(randomColor(lampHealth.currentColor));
    return new Promise((resolve) => setTimeout(resolve, shortTick));
}

function randomColor(notBeingColor) {

	var possibleColors = ['red','green','blue','yellow','purple','sea'];
	var randomPos = Math.floor(Math.random() * possibleColors.length);
	var discoColor = possibleColors[randomPos];
	if (discoColor === notBeingColor) {
		// Move one color up if same color picked twice in a row
		discoColor = (randomPos === (possibleColors.length -1)) ? possibleColors[0] : possibleColors[randomPos + 1];
	}
	return discoColor;
}
