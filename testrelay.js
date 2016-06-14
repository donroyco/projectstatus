'use strict';

var relay8 = require('./relay8');

let USB_VID = 5824;
let USB_PID = 1503;

var myRelay = new relay8(USB_VID, USB_PID);

console.log('going to');
myRelay.set(1,true);
console.log('done so');

process.exit();


