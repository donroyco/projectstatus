'use strict';

let Lamps = require('./statusLamp');
let LightSabers = require('./lightsaber');
let Buzzer = require('./statusBuzzer');
var q = require('q');

var lampBamboo, lampHealth, buzzer;

var defaultTick = 200;
var shortTick = 250;

module.exports = {
	init: init,
    setBambooStatus: setBambooStatus,
    setHealthStatus: setHealthStatus,
    buzz: buzz,
    allOff: allOff, 
    allDisco: allDisco
};

function init(config) {
	lampBamboo = new LightSabers(config.bambooDeviceNumber);
	lampHealth = new Lamps(config.lampHealthConfig);
	buzzer = new Buzzer(config.buzzerPort);
}

function setBambooStatus(status) {
	if (status === 'successful') {
		lampBamboo.set('#00DD00');
	}
	if (status === 'building') {
		lampBamboo.set('#00A1DE');
	}
	if (status === 'failed') {
		lampBamboo.set('#DD0123');
	}
	if (status === 'failedMIP') {
		lampBamboo.set('#FF0000');
	}
	if (status === 'error') {
		lampBamboo.set('#DD00DD');
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
	lampBamboo.set(randomColor(lampBamboo.currentColor), true);  // immediate
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
