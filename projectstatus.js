'use strict';

var Gpio = require('onoff').Gpio,
    ports = [new Gpio(20, 'out'),
             new Gpio(21, 'out'),
             new Gpio(22, 'out'),
             new Gpio(23, 'out'),
             new Gpio(24, 'out'),
             new Gpio(25, 'out'),
             new Gpio(26, 'out')];

var bell = new Gpio(27,'out');

module.exports = {
    setBambooStatus: setBambooStatus,
    setHealthStatus: setHealthStatus,
    ringBell: ringBell,
    allOff: allOff
};


/**
 * The status indications:
 * - close down
 * - show status of bamboo
 * - show status of health
 * - ring a bell
 */

function setBambooStatus(status) {
	if (status === 'successful') {
		ports[0].writeSync(0);
		ports[1].writeSync(1);
		ports[2].writeSync(0);
	}
	if (status === 'building') {
		ports[0].writeSync(0);
		ports[1].writeSync(0);
		ports[2].writeSync(1);
	}
	if (status === 'failed') {
		ports[0].writeSync(1);
		ports[1].writeSync(0);
		ports[2].writeSync(0);
	}
}

function setHealthStatus(status) {
	if (status === 'up') {
		ports[3].writeSync(0);
		ports[4].writeSync(1);
		ports[5].writeSync(0);
	}
	if (status === 'shaky') {
		ports[3].writeSync(1);
		ports[4].writeSync(1);
		ports[5].writeSync(0);
	}
	if (status === 'down') {
		ports[3].writeSync(1);
		ports[4].writeSync(0);
		ports[5].writeSync(0);
	}
}

function ringBell() {
	bell.writeSync(1);
	setTimeout(function() {
		bell.writeSync(0)
	} , 800);
}

function allOff() {
	ports.forEach(function(port) {port.writeSync(0)});
}

