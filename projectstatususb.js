'use strict';

let USB_VID = 5824;
let USB_PID = 1503;
let HID = require('node-hid');
console.log('Detected usb devices:', HID.devices(USB_VID, USB_PID));

//var relayFactory = require('./relay8');
//var relayboard = new relayFactory(USB_VID, USB_PID);

var relay = new HID.HID(USB_VID, USB_PID);

relay.on("error", function(err) {
	console.log(err);
});

relay.on("data", function(data) {
	console.log(data);
});

relay.write([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
relay.write([1, 1, 1, 1, 1, 1, 1, 1]);

console.log(relay);

// var deviceInfo = relay.getDeviceInfo();
// console.log("deviceInfo.manufacturer:", deviceInfo.manufacturer);
// console.log("deviceInfo.product:", deviceInfo.product);
// console.log("deviceInfo.serialNumber:", deviceInfo.serialNumber);

relay.close();

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
	}
	if (status === 'building') {
	}
	if (status === 'failed') {
	}
}

function setHealthStatus(status) {
	if (status === 'up') {
	}
	if (status === 'shaky') {
	}
	if (status === 'down') {
	}
}

function ringBell() {
	bell.writeSync(1);
	setTimeout(function() {
	} , 800);
}

function allOff() {
	relay.close();
}

