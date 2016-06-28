'use strict';

let Lamps = require('./statusLamp');
var q = require('q');


var lampBamboo = new Lamps(1);
var lampServer = new Lamps(4);

module.exports = {
    setBambooStatus: setBambooStatus,
    setHealthStatus: setHealthStatus,
    ringBell: ringBell,
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

function ringBell() {
	// setTimeout(function() {
	// } , 800);
}

function allOff() {
	lampBamboo.set('off');
	lampServer.set('off')
}

var howlong = 20;
function allDisco(toStatus) {
	howlong = 20;
	let disco = blinkRandomColor()
				.then(blinkRandomColor)
				.then(blinkRandomColor)
				.then(blinkRandomColor)
				.then(blinkRandomColor)
				.then(blinkRandomColor)
				.then(() => lampBamboo.set(toStatus));
}

function blinkRandomColor(howlong) {

	var possibleColors = ['red','green','blue','yellow','purple','sea'];
	lampBamboo.set(possibleColors[Math.floor(Math.random() * possibleColors.length)]);
	howlong = howlong * 3;
	//console.log('random color ');
    return new Promise((resolve) => setTimeout(resolve, howlong));
}

