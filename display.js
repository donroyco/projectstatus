'use strict';

let Lamps = require('./statusLamp');
let Buzzer = require('./statusBuzzer');
var q = require('q');


var lampBamboo = new Lamps(1);
var lampServer = new Lamps(4);
var buzzer = new Buzzer(7);

var defaultTick = 500;

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
	buzzer.buzz(defaultTick);
}

function allOff() {
	lampBamboo.set('off');
	lampServer.set('off')
}

function allDisco() {
	var lastServerColor = lampServer.currentColor;
	var lastBambooColor = lampBamboo.currentColor;

	console.log('Going for allDisco');

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
				.then(() => {
					lampBamboo.set(lastBambooColor)
					lampServer.set(lastServerColor)
					});
}

function blinkBambooRandom() {

	lampBamboo.set(randomColor(lampBamboo.currentColor));
	console.log('bamboo set to ', lampBamboo.currentColor);
    return new Promise((resolve) => setTimeout(resolve, defaultTick));
}

function blinkServerRandom() {

	lampServer.set(randomColor(lampServer.currentColor));
	console.log('server set to ', lampServer.currentColor);
    return new Promise((resolve) => setTimeout(resolve, defaultTick));
}

function randomColor(notBeingColor) {

	var possibleColors = ['red','green','blue','yellow','purple','sea'];
	var randomPos = Math.floor(Math.random() * possibleColors.length);
	var discoColor = possibleColors[randomPos];
	if (discoColor === notBeingColor) {
		// Move one color up if same color picked twice in a row
		discoColor = (randomPos === possibleColors.length) ? possibleColors[0] : possibleColors[randomPos + 1];
	}
	return discoColor;
}
