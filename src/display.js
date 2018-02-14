'use strict';

let LightSabers = require('./lightsaber');
var q = require('q');

var lampBamboo, lampHealth;

var defaultTick = 200;
var shortTick = 250;

module.exports = {
	init: init,
    setBambooStatus: setBambooStatus,
    setHealthStatus: setHealthStatus,
    allOff: allOff, 
    allDisco: allDisco
};

function init(config) {
	lampBamboo = new LightSabers(config.bamboo.lampDeviceNumber);
	lampHealth = new LightSabers(config.health.lampDeviceNumber);
}

function setBambooStatus(status) {
	if (status === 'successful') {
		lampBamboo.set('#00DD00');
	}
	if (status === 'building') {
		lampBamboo.set('#00A1DE');
	}
	if (status === 'failed') {
		lampBamboo.set('#EE0020');
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
		lampHealth.set('#00EE00');
	}
	if (status === 'shaky') {
		lampHealth.set('yellow');
	}
	if (status === 'down') {
		lampHealth.set('#FF0000');
	}
	if (status === 'error') {
		lampHealth.set('#DD00DD');
	}
}

function allOff() {
	lampBamboo.set('#000000', true);
	lampHealth.set('#000000', true)
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
					lampBamboo.set(lastBambooColor || '#000000')
					lampHealth.set(lastHealthColor || '#000000')
					});
}

function blinkBambooRandom() {
	lampBamboo.set(randomColor(lampBamboo.currentColor), true);  // immediate
    return new Promise((resolve) => setTimeout(resolve, shortTick));
}

function blinkServerRandom() {
	lampHealth.set(randomColor(lampHealth.currentColor), true);
    return new Promise((resolve) => setTimeout(resolve, shortTick));
}

function randomColor(notBeingColor) {

	var possibleColors = ['#FF0000','#00FF00','#0000FF','#FFFF00','#FF00FF','#00FFFF','#FFFFFF'];
	var randomPos = Math.floor(Math.random() * possibleColors.length);
	var discoColor = possibleColors[randomPos];
	if (discoColor === notBeingColor) {
		// Move one color up if same color picked twice in a row
		discoColor = (randomPos === (possibleColors.length -1)) ? possibleColors[0] : possibleColors[randomPos + 1];
	}
	return discoColor;
}
